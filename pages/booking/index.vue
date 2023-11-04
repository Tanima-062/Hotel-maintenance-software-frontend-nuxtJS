<template>
  <main class="flex-1 pt-8 px-3">
    <Breadcrumb :breadcrumb-list="breadcrumbList" class="mb-8" />
    <BookingSearchBox
      :is-loading-search="isLoadingBooking"
      @search-booking="searchBooking"
    />
    <BookingList
      ref="bookingList"
      :booking-list="bookingList"
      :is-loading-search="isLoadingBooking"
      :status-color="statusColor"
      :status-name="statusName"
      :route-type="routeType"
      :fetch-booking-info-download="fetchBookingInfoDownload"
      @toggle-booking-modal="toggleBookingModal"
    />
    <BookingDetailModal
      :open="isOpenModal"
      :is-loading-booking="isLoadingBookingInfo"
      :booking-detail="bookingDetail"
      :status-color="statusColor"
      :status-name="statusName"
      :server-time="serverTime"
      :route-type="routeType"
      :route-flg-id="routeFlgId"
      @update-no-show-status="updateNoShowStatus"
      @update-cancel-status="updateCancelStatus"
      @close-booking-modal="toggleBookingModal"
    />
  </main>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import { differenceInDays, isBefore, endOfMonth } from 'date-fns'
import XLSX from 'xlsx'
import { Global, Booking } from '~/types'
import { BookingRepository } from '~/repositories'
import { formatDate, formatTZDate } from '~/utils/date'
import {
  RESERVE_STATUS_RESERVED,
  RESERVE_STATUS_CANCEL,
  RESERVE_STATUS_NOSHOW,
  RESERVE_STATUS_STAYING,
  RESERVE_STATUS_STAYED,
  API_DATE_FORMAT,
} from '~/utils/const'
import BookingList from '~/components/organisms/BookingList.vue'
import alert from '~/mixins/alert'
import { accountStore } from '~/store'

@Component({
  layout: 'AfterLogin',
  middleware: ['auth'],
  components: {
    Breadcrumb: () => import('~/components/molecules/Breadcrumb.vue'),
    BookingList,
    BookingSearchBox: () =>
      import('~/components/organisms/BookingSearchBox.vue'),
    BookingDetailModal: () =>
      import('~/components/organisms/BookingDetailModal.vue'),
  },
})
export default class extends Mixins(alert) {
  head() {
    return {
      title: `${this.$t('global.title.booking') as string} | Skyticket ${
        this.$t('global.title.admin') as string
      }`,
    }
  }

  private bookingRepository = new BookingRepository()
  private breadcrumbList: Global.BreadCrumb[] = accountStore.currentBreadCrumbs
  private isOpenBookingModal: boolean = false
  private isLoadingBooking: boolean = false
  private isLoadingBookingInfo: boolean = false
  private serverTime: Date = new Date()
  private bookingList: Booking.BookingInfo[] = []
  private selectedApplicationId: string = ''
  private isDetailStatusUpdated: boolean = false
  private bookingDetail: Booking.BookingDetail = {
    applicationCd: '',
    arrival: '',
    wholesalerId: 0,
    cmApplicationId: 0,
    createdAt: '',
    departure: '',
    stays: 0,
    roomNum: 0,
    emailEnc: '',
    familyNameEnc: '',
    givenNameEnc: '',
    phoneEnc: '',
    cancelFeeSuggest: 0,
    tourId: 0,
    cancelFee: 0,
    cancelFlg: false,
    discountCashAmount: 0,
    discountPaymentFlg: false,
    noShowFee: 0,
    noShowFlg: false,
    salePrice: 0,
    totalPayInTax: 0,
    status: 0,
    canceledDt: '',
    rooms: [],
    flashSales: [],
    personPrices: [],
  }

  private searchInfo: Booking.BookingSearchInfo = {
    propertyId: 0,
    wholesalerId: 0,
    applicationIds: '',
    applicationStart: '',
    applicationEnd: '',
    checkinStart: '',
    checkinEnd: '',
    checkoutStart: '',
    checkoutEnd: '',
    status: 0,
    familyName: '',
    givenName: '',
    phone: '',
  }

  private statusColor(status: number): string {
    switch (status) {
      case RESERVE_STATUS_RESERVED:
        return 'blue'
      case RESERVE_STATUS_CANCEL:
        return 'gray'
      case RESERVE_STATUS_NOSHOW:
        return 'purple'
      case RESERVE_STATUS_STAYING:
        return 'red'
      case RESERVE_STATUS_STAYED:
        return 'green'
      default:
        return ''
    }
  }

  private statusName(status: number): string {
    switch (status) {
      case RESERVE_STATUS_RESERVED:
        return this.$t('booking.statusList.bookingDone') as string
      case RESERVE_STATUS_CANCEL:
        return this.$t('booking.statusList.cancel') as string
      case RESERVE_STATUS_NOSHOW:
        return this.$t('booking.statusList.noShow') as string
      case RESERVE_STATUS_STAYING:
        return this.$t('booking.statusList.duringStay') as string
      case RESERVE_STATUS_STAYED:
        return this.$t('booking.statusList.itineraryEnd') as string
      default:
        return ''
    }
  }

  get bookingInfoList(): Booking.BookingInfo[] {
    return this.bookingList
  }

  get isOpenModal(): boolean {
    return this.isOpenBookingModal
  }

  /*
  予約詳細モーダルのトグル
  閉じる際に予約詳細のステータス変更を行った場合は予約リストを更新する
  */
  private async toggleBookingModal(
    data: object & { open: boolean; applicationId: string }
  ): Promise<void> {
    if (this.isLoadingBookingInfo) return
    const el = document.body
    if (data.open) {
      const bookingDetailStatus = await this.fetchBookingDetail(
        data.applicationId
      )
      if (bookingDetailStatus) {
        el.classList.add('swal2-shown')
        this.isOpenBookingModal = data.open
      }
    } else {
      el.classList.remove('swal2-shown')
      this.isOpenBookingModal = data.open
      if (this.isDetailStatusUpdated) {
        this.isDetailStatusUpdated = false
        await this.searchBooking(this.searchInfo)
      }
    }
  }

  private async searchBooking(
    searchInfo: Booking.BookingSearchInfo
  ): Promise<void> {
    if (!this.isLoadingBooking) {
      this.isLoadingBooking = true
      this.bookingList = []
      const bookingListComponent = this.$refs.bookingList as BookingList
      bookingListComponent.resetPage()
      this.searchInfo = { ...searchInfo }
      this.searchInfo.propertyId = accountStore.activeFacilityInfo.propertyId
      this.searchInfo.wholesalerId =
        accountStore.activeFacilityInfo.wholesalerId
      this.searchInfo.checkinStart = this.convertApiDateFormat(
        this.searchInfo.checkinStart
      )
      this.searchInfo.checkinEnd = this.convertApiDateFormat(
        this.searchInfo.checkinEnd
      )
      this.searchInfo.checkoutStart = this.convertApiDateFormat(
        this.searchInfo.checkoutStart
      )
      this.searchInfo.checkoutEnd = this.convertApiDateFormat(
        this.searchInfo.checkoutEnd
      )
      this.searchInfo.applicationStart = this.convertApiDateFormat(
        this.searchInfo.applicationStart
      )
      this.searchInfo.applicationEnd = this.convertApiDateFormat(
        this.searchInfo.applicationEnd
      )
      this.bookingList = await this.bookingRepository.fetchSearchBooking(
        this.searchInfo
      )
      // 予約の新しい順に並び替える
      this.bookingList.sort(
        (a: Booking.BookingInfo, b: Booking.BookingInfo) => {
          return b.cmApplicationId - a.cmApplicationId
        }
      )
      this.bookingList.map((booking) => {
        booking.checkin = formatTZDate(booking.checkin, 'yyyy-MM-dd')
        booking.checkout = formatTZDate(booking.checkout, 'yyyy-MM-dd')
        return booking
      })
      this.isLoadingBooking = false
    }
  }

  private convertApiDateFormat(date: string): string {
    return date ? formatDate(date, API_DATE_FORMAT) : ''
  }

  private async fetchBookingDetail(applicationId: string): Promise<boolean> {
    this.$nuxt.$loading.start()
    const serverTime = await this.bookingRepository.getServerTime()
    if (serverTime) {
      this.serverTime = new Date(serverTime)
    } else {
      this.mixinAlert(
        'error',
        this.$t('alert.error') as string,
        this.$t('alert.errorContent') as string
      )
      this.isLoadingBookingInfo = false
      this.$nuxt.$loading.finish()
      return false
    }
    this.bookingDetail = await this.bookingRepository.fetchBookingDetail(
      accountStore.activeFacilityInfo.propertyId,
      applicationId,
      accountStore.activeFacilityInfo.wholesalerId
    )
    this.selectedApplicationId = applicationId
    this.bookingDetail.createdAt = formatTZDate(
      this.bookingDetail.createdAt,
      'yyyy/MM/dd HH:mm:ss'
    )
    this.bookingDetail.arrival = formatTZDate(this.bookingDetail.arrival)
    this.bookingDetail.departure = formatTZDate(this.bookingDetail.departure)
    this.isLoadingBookingInfo = false
    this.$nuxt.$loading.finish()
    return true
  }

  private async fetchBookingInfoDownload(): Promise<void> {
    if (!this.bookingList.length) return
    this.$nuxt.$loading.start()
    const bookingData = await this.bookingRepository.fetchBookingInfoDownload(
      accountStore.activeFacilityInfo.propertyId,
      accountStore.activeFacilityInfo.wholesalerId,
      this.bookingList.map((application) => application.cmApplicationId)
    )

    bookingData.sort(
      (a: Booking.BookingInfoDownload, b: Booking.BookingInfoDownload) => {
        return b.cmApplicationId - a.cmApplicationId
      }
    )

    // レポートに必要なデータのみにする
    const generateBookingData: any[] = []
    bookingData.map((booking: Booking.BookingInfoDownload) => {
      let isSameApplication = false
      // 割引金額
      let discountCashAmount = 0
      if (!booking.cancelFlg && booking.discountPaymentFlg) {
        discountCashAmount = booking.discountCashAmount
      }
      // 決済金額
      let salePrice = 0
      if (booking.cancelFlg) {
        salePrice = booking.cancelFee
      } else if (booking.discountPaymentFlg) {
        salePrice = booking.salePrice
      } else {
        salePrice = booking.totalPayInTax
      }

      // 部屋の数
      booking.rooms.map((room: Booking.RoomInfo) => {
        // [Object keyがシートのヘッダー名になる]
        // [Object keyは言語ファイルで切り替えるようにするため、any型とする]
        const report: any = {}
        report[this.$t('booking.report.applicationId') as string] =
          booking.cmApplicationId
        report[this.$t('booking.report.status') as string] = this.statusName(
          booking.status
        )
        report[this.$t('booking.report.bookingAmount') as string] =
          booking.totalPayInTax
        report[this.$t('booking.report.settlementAmount') as string] =
          this.routeFlgId(booking.applicationCd, booking.tourId) === 3
            ? '＊＊＊'
            : salePrice
        report[this.$t('booking.report.discountAmount') as string] =
          this.routeFlgId(booking.applicationCd, booking.tourId) === 3
            ? '＊＊＊'
            : discountCashAmount
        report[this.$t('booking.report.cancelCharge') as string] =
          booking.cancelFee
        report[this.$t('booking.report.route') as string] = this.routeType(
          booking.applicationCd,
          booking.tourId
        )
        report[this.$t('booking.report.bookDate') as string] = formatDate(
          booking.createdAt
        )
        report[this.$t('booking.report.checkIn') as string] = formatDate(
          booking.arrival
        )
        report[this.$t('booking.report.checkOut') as string] = formatDate(
          booking.departure
        )
        report[this.$t('booking.report.stays') as string] = differenceInDays(
          new Date(booking.departure),
          new Date(booking.arrival)
        )
        report[
          this.$t('booking.report.roomCount') as string
        ] = isSameApplication ? '-' : booking.rooms.length
        report[this.$t('booking.report.adultCount') as string] =
          room.numberOfAdults
        report[this.$t('booking.report.childCount') as string] =
          room.numberOfChilds
        report[this.$t('booking.report.roomsName') as string] = room.roomName
        report[this.$t('booking.report.plansName') as string] = room.planName
        report[this.$t('booking.report.familyNameEnc') as string] =
          booking.familyNameEnc
        report[this.$t('booking.report.givenNameEnc') as string] =
          booking.givenNameEnc
        generateBookingData.push(report)
        isSameApplication = true
      })
    })
    const bookingSheet = XLSX.utils.json_to_sheet(generateBookingData)
    const workBook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(
      workBook,
      bookingSheet,
      this.$t('booking.fileName') as string
    )
    XLSX.writeFile(
      workBook,
      `${this.$t('booking.fileName') as string}_${formatDate(
        new Date(),
        'yyyy-MM-dd'
      )}.csv`
    )
    this.$nuxt.$loading.finish()
  }

  private routeType(applicationCd: string, tourId: number): string {
    if (applicationCd === '0' && tourId === 0) {
      return this.$i18n.t('booking.searchList.routeType.hotel') as string
    } else if (applicationCd !== '0' && tourId === 0) {
      return this.$i18n.t('booking.searchList.routeType.dp') as string
    } else {
      return this.$i18n.t('booking.searchList.routeType.tour') as string
    }
  }

  // ホテル：１、DP：２、ツアー：３
  private routeFlgId(applicationCd: string, tourId: number): number {
    if (applicationCd === '0' && tourId === 0) {
      return 1
    } else if (applicationCd !== '0' && tourId === 0) {
      return 2
    } else {
      return 3
    }
  }

  private checkServerTime(): boolean {
    return isBefore(
      this.serverTime,
      endOfMonth(new Date(this.bookingDetail.departure))
    )
  }

  private async updateCancelStatus({
    cancelRequest,
    isNoShowUpdate,
    isNoShowStatus,
  }: {
    cancelRequest: Booking.CancelRequest
    isNoShowUpdate: boolean
    isNoShowStatus: boolean
  }): Promise<void> {
    if (this.checkServerTime()) {
      const selected = await this.mixinConfirm(
        this.$t('booking.alertBox.confirmTitle') as string,
        isNoShowUpdate
          ? (this.$t('booking.alertBox.noShowContent') as string)
          : (this.$t('booking.alertBox.cancelContent') as string),
        this.$t('booking.alertBox.confirmBtnText') as string,
        this.$t('booking.alertBox.cancelBtnText') as string
      )
      if (selected) {
        this.$nuxt.$loading.start()
        const res = await this.bookingRepository.updateBookingCancel(
          cancelRequest
        )
        if (res === 200) {
          if (isNoShowUpdate) {
            const resNoShow = await this.bookingRepository.updateBookingNoshow({
              cmApplicationId: cancelRequest.cmApplicationId,
              noShowFlg: isNoShowStatus,
            })
            if (resNoShow === 200) {
              this.isDetailStatusUpdated = true
              await this.fetchBookingDetail(this.selectedApplicationId)
            } else {
              this.mixinAlert(
                'error',
                this.$t('alert.error') as string,
                this.$t('alert.errorContent') as string
              )
            }
          } else {
            this.isDetailStatusUpdated = true
            await this.fetchBookingDetail(this.selectedApplicationId)
          }
        } else {
          this.mixinAlert(
            'error',
            this.$t('alert.error') as string,
            this.$t('alert.errorContent') as string
          )
        }
        this.$nuxt.$loading.finish()
      }
    } else {
      this.mixinAlert(
        'error',
        this.$t('alert.error') as string,
        this.$t('alert.errorContent') as string
      )
      await this.fetchBookingDetail(this.selectedApplicationId)
    }
  }

  private async updateNoShowStatus(
    noShowRequest: Booking.NoShowRequest
  ): Promise<void> {
    if (this.checkServerTime()) {
      const selected = await this.mixinConfirm(
        this.$t('booking.alertBox.confirmTitle') as string,
        noShowRequest.noShowFlg
          ? (this.$t('booking.alertBox.noShowContent') as string)
          : (this.$t('booking.alertBox.noShowDesactivate') as string),
        this.$t('booking.alertBox.confirmBtnText') as string,
        this.$t('booking.alertBox.cancelBtnText') as string
      )
      if (selected) {
        this.$nuxt.$loading.start()
        const res = await this.bookingRepository.updateBookingNoshow(
          noShowRequest
        )
        if (res === 200) {
          this.isDetailStatusUpdated = true
          await this.fetchBookingDetail(this.selectedApplicationId)
        } else {
          this.mixinAlert(
            'error',
            this.$t('alert.error') as string,
            this.$t('alert.errorContent') as string
          )
        }
        this.$nuxt.$loading.finish()
      }
    } else {
      this.mixinAlert(
        'error',
        this.$t('alert.error') as string,
        this.$t('alert.errorContent') as string
      )
      await this.fetchBookingDetail(this.selectedApplicationId)
    }
  }

  mounted() {
    this.searchBooking(this.searchInfo)
  }
}
</script>
