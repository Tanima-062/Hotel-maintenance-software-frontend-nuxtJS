<template>
  <main class="flex-1 pt-8 px-3">
    <Breadcrumb :breadcrumb-list="breadcrumbList" class="mb-8" />
    <ChargeForm
      :room-plan-list="roomPlanList"
      :form-input-data-week="formInputDataWeek"
      :apply-prices-calendar="applyPricesCalendar"
      :is-loading-request="isLoadingRequest"
      :selected-room-id="selectedRoomId"
      :selected-plan-id="loadSavePricesData.planId"
      @selected-room="selectedRoom"
      @selected-plan="selectedPlan"
    />
    <ChargeBox
      :available-month="availableMonth"
      :holidays-list="holidaysList"
      :is-loading-request="isLoadingRequest"
      :date-prices-calendar="datePricesCalendar"
      :readable-show-prices="readableShowPrices"
      :load-prices-by-plan-id="loadPricesByPlanId"
      :set-loading-status="setLoadingStatus"
      :save-plan-prices="savePlanPrices"
      :show-go-back="showGoBack"
      @update-date-prices="updateDatePrices"
    />
  </main>
</template>
<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import * as format from 'date-fns'
import alert from '~/mixins/alert'
import {
  PlanRepository,
  ChargeRepository,
  HolidayRepository,
} from '~/repositories'
import { Global, Plan, Charge, Holiday } from '~/types'
import { ROOM_MAX_PEOPLE, AVAILABLE_CHARGE_MONTH } from '~/utils/const'
import { accountStore, roomAndPlanStore } from '~/store'

@Component({
  layout: 'AfterLogin',
  middleware: ['auth'],
  components: {
    Breadcrumb: () => import('~/components/molecules/Breadcrumb.vue'),
    Icon: () => import('~/components/atoms/Icon.vue'),
    ChargeForm: () => import('~/components/organisms/ChargeForm.vue'),
    ChargeBox: () => import('~/components/organisms/ChargeBox.vue'),
  },
})
export default class extends Mixins(alert) {
  head() {
    return {
      title: `${this.$t('global.title.charge') as string} | Skyticket ${
        this.$t('global.title.admin') as string
      }`,
    }
  }

  private breadcrumbList: Global.BreadCrumb[] = accountStore.currentBreadCrumbs
  private planRepository = new PlanRepository()
  private chargeRepository = new ChargeRepository()
  private holidayRepository = new HolidayRepository()
  private roomPlanList: Plan.List[] = []
  private selectedRoomId: number = 0
  private isLoadingRequest: boolean = false
  private datePricesCalendar: Charge.DatePricesCalendar = {}
  private availableMonth: Global.SelectboxItem[] = []
  private defaultValuePrice = ['', '', '', '', '', '', '']
  private startMonth: string = ''
  private endMonth: string = ''
  private formInputDataWeek: Charge.FormInputData[] = []
  private readableShowPrices: Charge.ShowPlanPrices = {}
  private holidaysList: Holiday.HolidayDate = {}
  private showGoBack: boolean = false

  private loadSavePricesData: Charge.PlanPricesData = {
    planId: 0,
    prices: {},
  }

  private async loadRoomPlanList(): Promise<void> {
    this.roomPlanList = await this.planRepository.fetchPlanList(
      accountStore.activeFacilityInfo.propertyId
    )
  }

  private selectedRoom(roomId: number): void {
    this.selectedRoomId = roomId
  }

  private selectedPlan(planId: number): void {
    if (this.loadSavePricesData.planId !== planId) {
      this.datePricesCalendar = {}
    }
    this.loadSavePricesData.planId = planId
  }

  private loadAvailableMonthCalendar(): void {
    const now: Date = new Date()
    for (let index = 0; index <= AVAILABLE_CHARGE_MONTH; index++) {
      const startMonth = format.startOfMonth(
        new Date(now.getFullYear(), now.getMonth() + index, 1)
      )
      const name: string = `${format.format(startMonth, 'yyyy')}${this.$t(
        'global.year'
      )}${format.format(startMonth, 'MM')}${this.$t('global.month')}`
      const value: string = format.format(startMonth, 'yyyy-MM')
      this.availableMonth.push({ name, value })
    }
  }

  // 料金フォームの値を更新する
  get overwriteData(): Charge.OverwriteData {
    const dataFormPrices: Charge.OverwriteData = {}
    this.formInputDataWeek.map((data: Charge.FormInputData) => {
      dataFormPrices[data.people] = data.prices
    })
    return dataFormPrices
  }

  // 料金フォームの値を表示対象カレンダーに反映する
  private applyPricesCalendar(): void {
    if (this.checkPlanLoadedData()) return
    for (const monthData in this.datePricesCalendar) {
      this.datePricesCalendar[monthData].map(
        (weekData: Charge.WeekPeoplePrices[]) => {
          return weekData.map((dataDataPrice: Charge.WeekPeoplePrices) => {
            dataDataPrice.prices = [...this.overwriteData[dataDataPrice.people]]
          })
        }
      )
    }
    this.datePricesCalendar = { ...this.datePricesCalendar }
  }

  private updateDatePrices(dataPrices: Charge.DatePricesCalendar): void {
    this.datePricesCalendar = { ...dataPrices }
  }

  // 料金フォームの初期設定
  private loadInputFormValue(): void {
    for (let index = 1; index <= ROOM_MAX_PEOPLE; index++) {
      this.formInputDataWeek.push({
        people: ('0' + index) as string,
        showPeople:
          index === ROOM_MAX_PEOPLE
            ? `${index}${this.$t('charge.people.more' as string)}`
            : `${index}${this.$t('charge.people.single' as string)}`,
        prices: [...this.defaultValuePrice],
      })
    }
  }

  private setRoomPlanId(): void {
    const copyPlanData = roomAndPlanStore.getCopyPlanData
    if (copyPlanData.planId > 0) {
      this.showGoBack = true
      this.selectedRoomId = copyPlanData.roomTypeId
      this.loadSavePricesData.planId = copyPlanData.planId
      roomAndPlanStore.clearCopyPlanData()
    }
  }

  private setLoadingStatus(status: boolean): void {
    this.isLoadingRequest = status
  }

  private async fetchHolidayList(): Promise<void> {
    this.holidaysList = await this.holidayRepository.fetchHolidayList()
  }

  private async init(): Promise<void> {
    this.loadAvailableMonthCalendar()
    this.loadInputFormValue()
    await this.fetchHolidayList()
    await this.loadRoomPlanList()
    this.setRoomPlanId()
  }

  // 設定した期間内のブランの料金を取得する
  private async loadPricesByPlanId(
    dateStart: string,
    dateEnd: string
  ): Promise<boolean> {
    if (this.checkPlanLoadedData(true)) return false
    this.startMonth = dateStart
    this.endMonth = dateEnd
    this.isLoadingRequest = true
    this.loadSavePricesData = await this.chargeRepository.fetchPricesByPlanId(
      this.loadSavePricesData.planId,
      dateStart,
      dateEnd
    )
    // 日にちをキーに設定して料金を取得できるようにする
    // 料金が０の場合は弾く
    this.readableShowPrices = {}
    for (const dateData in this.loadSavePricesData.prices) {
      const isAvailable = format.isWithinInterval(new Date(dateData), {
        start: new Date(dateStart),
        end: new Date(dateEnd),
      })
      if (isAvailable) {
        this.readableShowPrices[dateData] = {}
        this.loadSavePricesData.prices[dateData].map(
          (priceData: Charge.Price) => {
            if (priceData.price !== 0) {
              this.readableShowPrices[dateData][
                priceData.type
              ] = priceData.price.toString()
            }
          }
        )
      } else {
        delete this.loadSavePricesData.prices[dateData]
      }
    }
    this.isLoadingRequest = false
    return true
  }

  /*
  料金を登録する
  料金が０、または重複していないかを確認して登録する
  */
  private async savePlanPrices(): Promise<boolean> {
    if (await this.checkPlanLoadedData()) return false
    this.isLoadingRequest = true
    const readableSaveData: { [date: string]: Charge.Price[] } = {
      ...this.loadSavePricesData.prices,
    }
    for (const monthData in this.datePricesCalendar) {
      this.datePricesCalendar[monthData].map((weekData) => {
        weekData.map((week) => {
          for (let index = 0; index < week.dates.length; index++) {
            if (week.dates[index].isShow) {
              const priceIndex = week.dates[index].date
              const filterData = readableSaveData[priceIndex]
                ? readableSaveData[priceIndex].findIndex(
                    (duplicate) => duplicate.type === week.people
                  )
                : -1
              if (week.prices[index] && filterData === -1) {
                if (!readableSaveData[priceIndex]) {
                  readableSaveData[priceIndex] = []
                }
                readableSaveData[priceIndex].push({
                  type: week.people,
                  price: Number(week.prices[index]),
                })
                // 登録してあった料金と重複していないかを確認する
              } else if (filterData !== -1) {
                if (
                  readableSaveData[priceIndex][filterData].price ===
                  Number(week.prices[index])
                ) {
                  readableSaveData[priceIndex].splice(filterData, 1)
                  if (!readableSaveData[priceIndex].length)
                    delete readableSaveData[priceIndex]
                } else {
                  readableSaveData[priceIndex][filterData].price = Number(
                    week.prices[index]
                  )
                }
              }
            }
          }
        })
      })
    }
    const requestParam: Charge.PlanPricesData[] = [
      {
        ...this.loadSavePricesData,
        prices: readableSaveData,
      },
    ]
    const res = await this.chargeRepository.updatePricesByPlanId(requestParam)
    this.isLoadingRequest = false
    if (res === 200) {
      this.loadSavePricesData.prices = readableSaveData
      this.mixinAlert(
        'success',
        this.$t('charge.success.title') as string,
        this.$t('charge.success.content') as string
      )
      return true
    } else {
      this.mixinAlert(
        'error',
        this.$t('charge.alert.title') as string,
        this.$t('charge.alert.content') as string
      )
      return false
    }
  }

  private checkPlanLoadedData(checkOnlyPlan: boolean = false): boolean {
    if (!this.loadSavePricesData.planId) {
      this.mixinAlert(
        'error',
        this.$t('charge.alert.plan') as string,
        this.$t('charge.alert.title') as string
      )
      return true
    } else if (
      !Object.entries(this.datePricesCalendar).length &&
      !checkOnlyPlan
    ) {
      this.mixinAlert(
        'error',
        this.$t('charge.alert.period') as string,
        this.$t('charge.alert.title') as string
      )
      return true
    }
    return false
  }

  async created() {
    await this.init()
  }
}
</script>
