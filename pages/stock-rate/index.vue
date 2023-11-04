<template>
  <main class="flex-1 py-8 px-3">
    <Breadcrumb :breadcrumb-list="breadcrumbList" class="mb-8" />
    <div v-if="calendarRoom.length">
      <p
        class="text-sm text-black"
        :class="isHasEditPersission ? 'mb-1' : 'mb-7'"
      >
        {{ $t('calendar.pageDescription') }}
      </p>
      <p v-if="isHasEditPersission" class="text-sm text-black mb-7">
        {{ $t('calendar.pageDescriptionTwo') }}
      </p>
      <StockRateSearchBox
        :room-plan-list="calendarRoom"
        @search-filter-stock-rate="searchFilterStockRate"
      />
      <Empty v-if="calendarRoom.length && !filterStockRateList.length">
        検索結果がありません
      </Empty>
      <div v-if="calendarRoom.length && filterStockRateList.length">
        <DateSelect
          :date-selected="currentDate"
          :check-before-change="checkBeforeChangeDate"
          @change="changeDateHeader"
        />
        <!-- 在庫・プラン料金一括更新 -->
        <Btn
          v-if="isSlectedDate"
          class="w-40 h-9 text-m m-auto mt-2 mb-2"
          color="blue"
          @click="saveRoomStockPlanPrices()"
        >
          在庫・料金一括更新
        </Btn>
        <div
          v-if="calendarRoom.length && filterStockRateList.length"
          id="calendarToTop"
          class="h-full max-h-640px overflow-y-auto relative border-b border-bdColor"
        >
          <table class="table-border border w-full">
            <thead class="border relative z-10">
              <tr class="text-base">
                <th
                  colspan="4"
                  class="w-49 py-3 px-1 border bg-white border-bdColor top-0 sticky green-bottom-line"
                >
                  <Btn
                    v-if="!isHideStockPrice"
                    class="w-34 h-9 ml-2.5 font-light"
                    @click="goToStock"
                  >
                    {{ $t('calendar.stockButton') }}
                  </Btn>
                </th>
                <th
                  v-for="(dateShow, index) in dateShowHeader"
                  :key="index"
                  class="py-3 px-1 border-r border-t border-b border-bdColor bg-white top-0 sticky green-bottom-line"
                >
                  <div
                    :class="
                      !editModeDateList.includes(dateShow.defaultDate) &&
                      isHasEditPersission &&
                      'cursor-pointer'
                    "
                    @click="addEditModeDateList(dateShow.defaultDate)"
                  >
                    <div class="underline" :class="dateColor(dateShow)">
                      {{ dateShow.date }}
                    </div>
                    <div class="font-light" :class="dateColor(dateShow)">
                      {{ dateShow.dayName }}
                    </div>
                  </div>
                  <Btn
                    v-if="dateShow.isRoomStocks && !isFilterMode && wholesalerId != wholesalerId_TL && wholesalerId != wholesalerId_Tema"
                    class="w-16 h-6 text-sm"
                    :color="dateShow.isStopSales ? 'gray' : 'white'"
                    @click="
                      changeStockSales(
                        stockRoomIDList,
                        dateShow.dateApiFormat,
                        !dateShow.isStopSales
                      )
                    "
                  >
                    {{
                      dateShow.isStopSales
                        ? $t('calendar.tableDetail.soldOutButton')
                        : $t('calendar.tableDetail.saleButton')
                    }}
                  </Btn>
                  <p
                    v-if="!dateShow.isRoomStocks && !isFilterMode"
                    class="text-alert"
                  >
                    在庫なし
                  </p>
                </th>
              </tr>
            </thead>
            <template v-for="(roomPlanData, roomIndex) in filterStockRateList">
              <RateListRoom
                :key="roomPlanData.roomTypeId"
                :is-loading-request="isLoadingRequest"
                :calendar-room="roomPlanData"
                :room-index="roomIndex"
                :date-show-header="dateLoopIndex"
                :change-room-sales="changeRoomSales"
                :change-stock-sales="changeStockSales"
                :edit-mode-date-list="editModeDateList"
                :change-stock-room="changeStockRoom"
              />
              <RateListPlan
                v-for="(planData, planIndex) in roomPlanData.plans"
                :key="`${roomPlanData.roomTypeId}${planData.planId}`"
                :is-first-plan="planIndex === 0"
                :room-stocks="roomPlanData.stocks"
                :is-loading-request="isLoadingRequest"
                :date-show-header="dateLoopIndex"
                :calendar-plan="planData"
                :change-plan-sales="changePlanSales"
                :go-to-plan-prices="goToPlanPrices"
                :is-hide-stock-price="isHideStockPrice"
                :edit-mode-date-list="editModeDateList"
                :room-index="roomIndex"
                :plan-index="planIndex"
                :change-price-plan="changePricePlan"
              />
            </template>
          </table>
        </div>
        <div class="mb-20">
          <GoTop to-top-id="calendarToTop" class="float-right" />
        </div>
      </div>
    </div>
    <Empty v-else-if="isLoadingRequest">
      {{ $t('calendar.isLoadingRequest') }}
    </Empty>
  </main>
</template>
<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import { getDay, eachDayOfInterval } from 'date-fns'
import alert from '~/mixins/alert'
import { formatDate, getWeekName } from '~/utils/date'
import { Global, Calendar, Holiday, Charge, Stock } from '~/types'
import {
  RoomRepository,
  PlanRepository,
  CalendarRepository,
  StockRepository,
  HolidayRepository,
  ChargeRepository,
} from '~/repositories'
import {
  API_DATE_FORMAT,
  CALENDAR_EDIT_PERMISSION,
  WHOLESALER_ID_TL,
  WHOLESALER_ID_TEMA,
} from '~/utils/const'
import { accountStore, roomAndPlanStore } from '~/store'
import { PERMISSION_NOT_STOCK_PRICE, PERMISSION_LIST } from '~/utils/permission'

@Component({
  layout: 'AfterLogin',
  middleware: ['auth'],
  components: {
    DateSelect: () => import('~/components/molecules/DateSelect.vue'),
    Breadcrumb: () => import('~/components/molecules/Breadcrumb.vue'),
    RateListRoom: () => import('~/components/organisms/RateListRoom.vue'),
    RateListPlan: () => import('~/components/organisms/RateListPlan.vue'),
    StockRateSearchBox: () =>
      import('~/components/organisms/StockRateSearchBox.vue'),
    GoTop: () => import('~/components/molecules/GoTop.vue'),
    Empty: () => import('~/components/molecules/Empty.vue'),
    Btn: () => import('~/components/atoms/Btn.vue'),
  },
})
export default class extends Mixins(alert) {
  head() {
    return {
      title: `${this.$t('global.title.stockRate') as string} | Skyticket ${
        this.$t('global.title.admin') as string
      }`,
    }
  }

  // eslint-disable-next-line camelcase
  readonly wholesalerId_TL: number = WHOLESALER_ID_TL
  // eslint-disable-next-line camelcase
  readonly wholesalerId_Tema: number = WHOLESALER_ID_TEMA
  readonly wholesalerId: number = accountStore.wholesalerId
  private breadcrumbList: Global.BreadCrumb[] = accountStore.currentBreadCrumbs
  private dateShowHeader: Calendar.CalendarHeader[] = []
  private dateLoopIndex: string[] = []
  private dateUpdateStatus: string[] = []
  private currentDate: Date = new Date()
  private chargeRepository = new ChargeRepository()
  private roomRepository = new RoomRepository()
  private planRepository = new PlanRepository()
  private stockRepository = new StockRepository()
  private holidayRepository = new HolidayRepository()
  private calendarRepository = new CalendarRepository()
  private isLoadingRequest: boolean = false
  private holidayList: Holiday.HolidayDate = {}
  private calendarRoom: Calendar.Room[] = []
  private editModeDateList: string[] = []
  private priceAllPlanCalendar: Charge.PlanPricesCalendarData = {}
  private stockAllRoomCalendar: Stock.roomStocksCalendarData = {}
  private filterStockRate: Calendar.FilterOption = {
    roomList: [0],
    planList: [0],
    sellingStatus: 0,
    keyword: '',
  }

  private scroll() {
    const scroll = document.getElementById('calendarToTop')
    if (!scroll) return
    scroll.scrollTop = 0
  }

  private async init(): Promise<void> {
    this.holidayList = await this.holidayRepository.fetchHolidayList()
    this.updateDateHeader()
    this.requestFetchCalendar()
  }

  private async searchFilterStockRate(
    filter: Calendar.FilterOption
  ): Promise<void> {
    let selected: boolean = true
    if (this.editModeDateList.length) {
      selected = await this.mixinConfirm(
        this.$t('charge.alert.checkTitle') as string,
        this.$t('charge.alert.checkContent') as string,
        this.$t('alert.yes') as string,
        this.$t('alert.no') as string
      )
    }
    if (selected) {
      this.priceAllPlanCalendar = {}
      this.editModeDateList = []
      this.$nuxt.$loading.start()
      await this.requestFetchCalendar()
      this.filterStockRate = filter
      this.scroll()
      this.$nuxt.$loading.finish()
    }
  }

  private async checkBeforeChangeDate(): Promise<boolean> {
    let selected: boolean = true
    if (this.editModeDateList.length) {
      selected = await this.mixinConfirm(
        this.$t('charge.alert.checkTitle') as string,
        this.$t('charge.alert.checkContent') as string,
        this.$t('alert.yes') as string,
        this.$t('alert.no') as string
      )
    }
    return selected
  }

  get isHasEditPersission(): boolean {
    return CALENDAR_EDIT_PERMISSION.includes(accountStore.wholesalerId)
  }

  get isFilterMode(): boolean {
    if (
      this.filterStockRate.roomList.includes(0) &&
      this.filterStockRate.planList.includes(0) &&
      this.filterStockRate.sellingStatus === 0 &&
      !this.filterStockRate.keyword.length
    ) {
      return false
    }
    return true
  }

  get stockRoomIDList(): number[] {
    const roomIDList: number[] = []
    this.filterStockRateList.map((stockRate) => {
      roomIDList.push(stockRate.roomTypeId)
    })
    return roomIDList
  }

  get isSlectedDate(): boolean {
    let selected: boolean = false
    this.dateShowHeader.map((dateShow) => {
      if (this.editModeDateList.includes(dateShow.defaultDate)) {
        selected = true
      }
    })
    return selected
  }

  get filterStockRateList(): Calendar.Room[] {
    if (!this.isFilterMode) {
      return this.calendarRoom
    }
    if (this.filterStockRate.sellingStatus === 3) return []
    let filterList: Calendar.Room[] = JSON.parse(
      JSON.stringify([...this.calendarRoom])
    )
    filterList = filterList.filter((stockRate: Calendar.Room) => {
      if (this.filterStockRate.roomList.includes(stockRate.roomTypeId)) {
        return true
      }
      return false
    })
    filterList = filterList.map((stockRate: Calendar.Room) => {
      stockRate.plans = stockRate.plans.filter((plan: Calendar.Plan) => {
        if (this.filterStockRate.planList.includes(plan.planId)) {
          return true
        }
        return false
      })
      return stockRate
    })
    if (this.filterStockRate.sellingStatus === 1) {
      const keepRoomId: number[] = []
      filterList = filterList.map((stockRate: Calendar.Room) => {
        stockRate.plans = stockRate.plans.filter((plan: Calendar.Plan) => {
          if (!plan.isStopSales) {
            if (!keepRoomId.includes(stockRate.roomTypeId))
              keepRoomId.push(stockRate.roomTypeId)
            return true
          }
          return false
        })
        return stockRate
      })
      filterList = filterList.filter(
        (stockRate: Calendar.Room) =>
          !stockRate.isStopSales || keepRoomId.includes(stockRate.roomTypeId)
      )
    }
    if (this.filterStockRate.sellingStatus === 2) {
      const keepRoomId: number[] = []
      filterList = filterList.map((stockRate: Calendar.Room) => {
        stockRate.plans = stockRate.plans.filter((plan: Calendar.Plan) => {
          if (plan.isStopSales) {
            if (!keepRoomId.includes(stockRate.roomTypeId))
              keepRoomId.push(stockRate.roomTypeId)
            return true
          }
          return false
        })
        return stockRate
      })
      filterList = filterList.filter(
        (stockRate: Calendar.Room) =>
          stockRate.isStopSales || keepRoomId.includes(stockRate.roomTypeId)
      )
    }
    if (this.filterStockRate.keyword.length) {
      const keepRoomId: number[] = []
      filterList = filterList.map((stockRate: Calendar.Room) => {
        stockRate.plans = stockRate.plans.filter((plan: Calendar.Plan) => {
          if (plan.planName.includes(this.filterStockRate.keyword)) {
            if (!keepRoomId.includes(stockRate.roomTypeId))
              keepRoomId.push(stockRate.roomTypeId)
            return true
          }
          return false
        })
        return stockRate
      })
      filterList = filterList.filter(
        (stockRate: Calendar.Room) =>
          stockRate.roomName.includes(this.filterStockRate.keyword) ||
          keepRoomId.includes(stockRate.roomTypeId)
      )
    }
    return filterList
  }

  private updateDateHeader(): void {
    this.dateShowHeader = []
    this.dateUpdateStatus = []
    const twoWeeks = new Date(
      this.currentDate.getFullYear(),
      this.currentDate.getMonth(),
      this.currentDate.getDate() + 13
    )

    const settingWeeks: Date[] = eachDayOfInterval({
      start: this.currentDate,
      end: twoWeeks,
    })
    settingWeeks.forEach((date: Date) => {
      this.dateUpdateStatus.push(formatDate(date, API_DATE_FORMAT))
      this.dateShowHeader.push({
        defaultDate: formatDate(date, 'yyyy-MM-dd'),
        date: formatDate(date, 'MM/dd'),
        day: getDay(date),
        dateApiFormat: formatDate(date, API_DATE_FORMAT),
        dayName: getWeekName(getDay(date)),
        isHoliday: !!this.holidayList[formatDate(date, API_DATE_FORMAT)],
        isStopSales: false,
        isRoomStocks: false,
      })
    })
  }

  private addEditModeDateList(date: string): void {
    if (!this.editModeDateList.includes(date) && this.isHasEditPersission) {
      this.editModeDateList.push(date)
    }
  }

  private changeDateHeader(dateHeader: Date): void {
    if (!this.isLoadingRequest) {
      this.priceAllPlanCalendar = {}
      this.editModeDateList = []
      this.currentDate = dateHeader
      this.updateDateHeader()
      this.requestFetchCalendar()
    }
  }

  private async requestFetchCalendar(): Promise<void> {
    this.isLoadingRequest = true
    this.calendarRoom = await this.calendarRepository.fetchSearchCalendar(
      formatDate(this.currentDate, API_DATE_FORMAT)
    )
    this.checkPlans()
    this.checkRoomStocks()
    this.dateLoopIndex = [...this.dateUpdateStatus]
    this.dateShowHeader.map((dateShow) => {
      // 日毎のisStopSalesの初期値設定(売止)
      dateShow.isStopSales = true
      this.calendarRoom.map((room) => {
        // 在庫があるかチェック
        if (room.stocks[dateShow.dateApiFormat].roomCount !== 0) {
          // 在庫があればtrue
          dateShow.isRoomStocks = true
          // 日毎に在庫のisStopSalesを確認して、販売中(false)があれば日毎のisStopSalesもfalseにする
          if (!room.stocks[dateShow.dateApiFormat].isStopSales) {
            dateShow.isStopSales = false
          }
        }
      })
    })
    this.isLoadingRequest = false
  }

  // ルームの在庫の値を確認
  private checkRoomStocks(): void {
    this.calendarRoom = this.calendarRoom.map((room: any) => {
      const roomStockData: Calendar.Stock = {}
      this.dateUpdateStatus.map((dateIndex) => {
        roomStockData[dateIndex] = {
          useDate: dateIndex,
          roomCount: 0,
          bookingCount: 0,
          stock: 0,
          isStopSales: true,
        }
      })
      room.stocks &&
        room.stocks.map((stock: any) => {
          const stockData = {
            useDate: stock.use_date,
            roomCount: stock.room_count,
            bookingCount: stock.booking_count,
            stock: stock.stock,
            isStopSales: stock.is_stop_sales,
          }
          roomStockData[stock.use_date] = stockData
        })
      room.stocks = roomStockData
      return room
    })
  }

  // プランの料金の値を確認
  private checkPlans(): void {
    this.calendarRoom = this.calendarRoom.map((room) => {
      room.plans = room.plans
        ? room.plans.map((plan: any) => {
            const calendarPlan: Calendar.Plan = {
              planId: plan.plan_id,
              planName: plan.plan_name,
              isStopSales: plan.is_stop_sales,
              stockAndPrices: {},
            }
            this.dateUpdateStatus.map((dateIndex: string) => {
              calendarPlan.stockAndPrices[dateIndex] = {
                bookingCount: plan.stock_and_prices[dateIndex]
                  ? plan.stock_and_prices[dateIndex].booking_count
                  : 0,
                prices: {},
                isEditMode: false,
              }
              const pricesPlan: Calendar.Price = {}
              plan.stock_and_prices[dateIndex] &&
                plan.stock_and_prices[dateIndex].prices.map(
                  (planPrice: any) => {
                    pricesPlan[planPrice.type] = planPrice.price
                  }
                )
              calendarPlan.stockAndPrices[dateIndex].prices = pricesPlan
            })
            return calendarPlan
          })
        : []
      return room
    })
  }

  // 料金を変更を仮登録する
  private changePricePlan(
    roomIndex: number,
    planIndex: number,
    date: string,
    type: string,
    price: number,
    editedPricesList: Charge.PlanPricesCalendarData
  ): void {
    this.filterStockRateList[roomIndex].plans[planIndex].stockAndPrices[
      date
    ].prices[type] = price
    this.priceAllPlanCalendar = {
      ...this.priceAllPlanCalendar,
      ...editedPricesList,
    }
  }

  private changeStockRoom(
    roomIndex: number,
    date: string,
    stock: number,
    editedStockRoomList: Stock.roomStocksCalendarData
  ): void {
    this.filterStockRateList[roomIndex].stocks[date].stock = stock
    this.stockAllRoomCalendar = {
      ...this.stockAllRoomCalendar,
      ...editedStockRoomList,
    }
  }

  private async saveRoomStockPlanPrices(): Promise<void> {
    const requestPrices: Charge.PlanPricesData[] = []
    const requestStocks: Stock.Input[] = []
    const planPriceKeys = Object.keys(this.priceAllPlanCalendar)
    const roomStocksKeys = Object.keys(this.stockAllRoomCalendar)
    planPriceKeys.map((keyTarget) => {
      requestPrices.push(this.priceAllPlanCalendar[keyTarget])
    })
    roomStocksKeys.map((keyTarget) => {
      requestStocks.push(this.stockAllRoomCalendar[keyTarget])
    })
    if (requestPrices.length || requestStocks.length) {
      const selected = await this.mixinConfirm(
        this.$t('calendar.alert.confirmTitle') as string,
        this.$t('calendar.alert.confirm') as string,
        this.$t('alert.yes') as string,
        this.$t('alert.no') as string
      )
      if (selected) {
        let error: boolean = false
        this.$nuxt.$loading.start()
        if (requestStocks.length) {
          const res = await this.stockRepository.saveStocks(requestStocks)
          error = res !== 200
        }
        if (requestPrices.length) {
          const res = await this.chargeRepository.updatePricesByPlanId(
            requestPrices
          )
          error = res !== 200
        }
        if (error) {
          this.mixinAlert(
            'error',
            this.$t('calendar.alert.title') as string,
            this.$t('calendar.alert.content') as string
          )
        } else {
          this.mixinAlert(
            'success',
            this.$t('calendar.success.updateTitle') as string,
            this.$t('calendar.success.updateContent') as string
          )
          this.editModeDateList = []
          if (requestStocks.length) {
            roomStocksKeys.map((keyTarget) => {
              delete this.stockAllRoomCalendar[keyTarget]
            })
          }
          if (requestPrices.length) {
            planPriceKeys.map((keyTarget) => {
              delete this.priceAllPlanCalendar[keyTarget]
            })
          }
        }
        this.$nuxt.$loading.finish()
      }
    } else {
      this.editModeDateList = []
    }
  }

  get isHideStockPrice(): boolean {
    return (
      PERMISSION_LIST[accountStore.wholesalerId] === PERMISSION_NOT_STOCK_PRICE
    )
  }

  private dateColor(dateShow: Calendar.CalendarHeader): string {
    if (dateShow.day === 0 || dateShow.isHoliday) {
      return 'text-alert'
    }
    if (dateShow.day === 6) {
      return 'text-btnColor'
    }
    return ''
  }

  private async changeRoomSales(
    roomId: number,
    changeStatus: boolean
  ): Promise<void> {
    if (!this.isLoadingRequest) {
      this.isLoadingRequest = true
      await this.roomRepository.changeRoomSales(roomId, changeStatus)
      this.requestFetchCalendar()
      this.isLoadingRequest = false
    }
  }

  private async changeStockSales(
    roomIds: number[],
    useDate: string,
    status: boolean
  ): Promise<void> {
    if (!this.isLoadingRequest) {
      this.isLoadingRequest = true
      await this.stockRepository.changeStockSales(roomIds, useDate, status)
      this.requestFetchCalendar()
      this.isLoadingRequest = false
    }
  }

  private async changePlanSales(
    planId: number,
    changeStatus: boolean
  ): Promise<void> {
    if (!this.isLoadingRequest) {
      this.isLoadingRequest = true
      await this.planRepository.changePlanSales(planId, changeStatus)
      this.requestFetchCalendar()
      this.isLoadingRequest = false
    }
  }

  private goToStock() {
    roomAndPlanStore.setIsShowBack(true)
    this.$router.push('/stock/edit')
  }

  private async goToPlanPrices(planId: number) {
    await roomAndPlanStore.setCopyPlanData(planId)
    this.$router.push('/charge/edit')
  }

  created() {
    this.init()
  }
}
</script>
<style lang="sass" scoped>
$green-color: #58aaae
.green-bottom-line
  border-bottom: solid 2px $green-color
.table-border
  border-collapse: separate
  border: 1px
  border-spacing: 0
#calendarToTop
  scroll-behavior: smooth
</style>
