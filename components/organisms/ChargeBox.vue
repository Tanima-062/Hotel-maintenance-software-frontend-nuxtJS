<template>
  <div>
    <div
      class="-mt-4 flex flex-row items-center space-x-3 justify-end text-black-dark"
    >
      <p>{{ $t('charge.showRange') }}</p>
      <Selectbox
        padding="px-3 py-0.5"
        :items="availableMonth"
        max-height="max-h-285px"
        :active-item="activeStartMonth"
        @select-item="selectMonthStart"
      />
      <p>{{ $t('charge.from') }}</p>
      <Selectbox
        padding="px-3 py-0.5"
        :items="showDateMonth"
        :active-item="activeShowMonth"
        @select-item="selectMonthShow"
      />
      <p>{{ $t('charge.to') }}</p>
      <Btn
        :is-disabled="isLoadingRequest"
        color="blue"
        class="w-24 py-0.5"
        height="small"
        @click="loadDatePriceCalendar"
      >
        {{ $t('charge.show') }}
      </Btn>
    </div>
    <div
      id="chargeBoxToTop"
      ref="calendarBox"
      :class="`relative border border-bdColor w-full mt-3 ${
        isLoadingRequest ? 'overflow-hidden' : 'overflow-auto'
      } price-calendar-h min-h-50`"
    >
      <div
        v-if="isLoadingRequest"
        class="absolute w-full h-full max-h-full flex items-center justify center bg-white opacity-50 z-10"
      >
        <Loading class="z-20" />
      </div>
      <div
        v-if="!isLoadingRequest && Object.keys(datePricesCalendar).length === 0"
        class="py-14 text-center"
      >
        <Icon
          :icon="exclamationIcon"
          color="text-bdColor"
          :round="true"
          :icon-width="35"
          :icon-height="35"
          :extra-class="'w-fit-content border-bdColor border-4 exclamation-icon m-auto mb-3'"
        />
        <p class="text-black-light">{{ $t('charge.selectRange') }}</p>
      </div>
      <div
        v-for="(price, month, index) in datePricesCalendar"
        :key="index"
        class="mb-10 border-b-2 border-menuColor-active last:mb-0"
      >
        <div
          class="p-3 text-center w-full bg-bgColor-green-top text-xl font-normal"
        >
          {{ Number(month.slice(-2)) }}{{ $t('global.month') }}
        </div>
        <div
          v-for="(formData, formIndex) in price"
          :key="formIndex"
          class="table w-full text-sm"
        >
          <div class="table-row-group">
            <div
              v-if="formIndex === 0"
              class="font-bold table-row text-center bg-menuColor text-black-dark"
            >
              <div class="table-cell border-bdColor p-3 w-50"></div>
              <div
                class="table-cell border-l border-bdColor p-3 text-btnColor-red"
              >
                {{ $t('global.week.su') }}
              </div>
              <div class="table-cell border-l border-bdColor p-3">
                {{ $t('global.week.mo') }}
              </div>
              <div class="table-cell border-l border-bdColor p-3">
                {{ $t('global.week.tu') }}
              </div>
              <div class="table-cell border-l border-bdColor p-3">
                {{ $t('global.week.we') }}
              </div>
              <div class="table-cell border-l border-bdColor p-3">
                {{ $t('global.week.thu') }}
              </div>
              <div class="table-cell border-l border-bdColor p-3">
                {{ $t('global.week.fri') }}
              </div>
              <div
                class="table-cell border-l border-bdColor p-3 text-linkColor"
              >
                {{ $t('global.week.sa') }}
              </div>
            </div>
            <div v-if="formIndex === 0" class="table-row">
              <div
                class="table-cell border-t-2 border-menuColor-active w-50"
              ></div>
              <div class="table-cell border-t-2 border-menuColor-active"></div>
              <div class="table-cell border-t-2 border-menuColor-active"></div>
              <div class="table-cell border-t-2 border-menuColor-active"></div>
              <div class="table-cell border-t-2 border-menuColor-active"></div>
              <div class="table-cell border-t-2 border-menuColor-active"></div>
              <div class="table-cell border-t-2 border-menuColor-active"></div>
              <div class="table-cell border-t-2 border-menuColor-active"></div>
            </div>
            <div class="table-row text-center">
              <div class="text-left table-cell py-3 pl-5 w-50"></div>
              <div
                v-for="dayShowIndex in weekIndex"
                :key="dayShowIndex"
                :class="`${
                  formData[formIndex].dates[dayShowIndex].isShow
                    ? 'border-l border-bdColor'
                    : formData[formIndex].dates[dayShowIndex].isBefore
                    ? 'border-l border-bdColor'
                    : ''
                } table-cell p-3 text-left`"
              >
                <p
                  v-if="formData[formIndex].dates[dayShowIndex].isShow"
                  :class="`w-6 text-center font-bold ${
                    dayShowIndex === 0
                      ? 'text-alert bg-error'
                      : dayShowIndex === 6
                      ? 'text-linkColor bg-bgColor-blue-light'
                      : formData[formIndex].dates[dayShowIndex].isHoliday
                      ? 'text-alert bg-error'
                      : ''
                  }`"
                >
                  {{
                    Number(
                      formData[formIndex].dates[dayShowIndex].date.slice(-2)
                    )
                  }}
                </p>
              </div>
            </div>
            <div
              v-for="formInput in formData"
              :key="formInput.people"
              class="table-row text-center"
            >
              <div
                class="font-normal text-left table-cell py-3 pl-5 w-50 bg-bgColor-green-light"
              >
                {{ formInput.showPeople }}
              </div>

              <div
                v-for="(priceNumber, priceIndex) in formInput.prices"
                :key="priceIndex"
                :class="`table-cell ${
                  formInput.dates[priceIndex].isShow
                    ? 'border-l border-bdColor'
                    : formInput.dates[priceIndex].isBefore
                    ? 'border-l border-bdColor'
                    : ''
                } py-2 px-3 w-40`"
              >
                <InputForm
                  v-if="formInput.dates[priceIndex].isShow"
                  v-model="formInput.prices[priceIndex]"
                  class="text-right"
                  padding="py-1"
                  type="number"
                  label=""
                  placeholder="-"
                />
              </div>
            </div>
          </div>
          <div
            v-if="formIndex !== 0"
            class="table-caption border-t border-b border-bdColor bg-menuColor"
          >
            <div
              class="w-90 p-3 space-x-4 font-normal flex flex-row items-center text-center cursor-pointer m-auto"
              @click="overwritePricesAll(month, formIndex)"
            >
              <IconBtn
                :icon="downIcon"
                color="text-white"
                bg-color="bg-btnColor"
                :icon-width="16"
                :icon-height="16"
                :round="true"
                class="mb-1"
              />
              <p>{{ $t('charge.topCopy') }}</p>
              <IconBtn
                :icon="downIcon"
                color="text-white"
                bg-color="bg-btnColor"
                :icon-width="16"
                :icon-height="16"
                :round="true"
                class="mb-1"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="w-ful pt-2 relative">
      <div
        v-if="showGoBack"
        class="w-fit-content flex flex-row items-center cursor-pointer"
        @click="$router.go(-1)"
      >
        <Icon :icon="leftIcon" color="text-btnColor-cancel" />
        <p
          class="w-fit-content text-black-light border-b border-btnColor-cancel"
        >
          {{ $t('global.cancelBack') }}
        </p>
      </div>
      <GoTop
        extra-class="absolute right-0 top-0"
        :to-top-id="'chargeBoxToTop'"
      />
    </div>
    <div class="mb-8" :class="!showGoBack && 'mt-6'">
      <Btn
        :is-disabled="isLoadingRequest"
        color="blue"
        class="w-60 m-auto"
        height="big"
        @click="saveChargePrices"
      >
        {{ $t('charge.saveBtn') }}
      </Btn>
    </div>
  </div>
</template>
<script lang="ts">
import { Mixins } from 'vue-property-decorator'
import { Component, Prop, Emit } from 'nuxt-property-decorator'
import { mdiMenuDown, mdiExclamation, mdiChevronLeft } from '@mdi/js'
import * as format from 'date-fns'
import { ROOM_MAX_PEOPLE } from '~/utils/const'
import { Global, Charge, Holiday } from '~/types'
import alert from '~/mixins/alert'

@Component({
  components: {
    Btn: () => import('~/components/atoms/Btn.vue'),
    Icon: () => import('~/components/atoms/Icon.vue'),
    InputForm: () => import('~/components/molecules/InputForm.vue'),
    Selectbox: () => import('~/components/molecules/Selectbox.vue'),
    IconBtn: () => import('~/components/atoms/IconBtn.vue'),
    Loading: () => import('~/components/atoms/Loading.vue'),
    GoTop: () => import('~/components/molecules/GoTop.vue'),
  },
})
export default class extends Mixins(alert) {
  @Prop({ required: true })
  availableMonth!: Global.SelectboxItem[]

  @Prop({ required: true })
  holidaysList!: Holiday.HolidayDate

  @Prop({ required: true })
  datePricesCalendar!: Charge.DatePricesCalendar

  @Prop({ default: false })
  isLoadingRequest!: boolean

  @Prop({ required: true })
  readableShowPrices!: Charge.ShowPlanPrices

  @Prop({ default: false })
  showGoBack!: boolean

  @Prop({ required: true })
  setLoadingStatus!: Function

  @Prop({ required: true })
  savePlanPrices!: Function

  @Prop({ required: true })
  loadPricesByPlanId!: Function

  private downIcon: string = mdiMenuDown
  private leftIcon: string = mdiChevronLeft
  private exclamationIcon: string = mdiExclamation
  private weekIndex: number[] = [0, 1, 2, 3, 4, 5, 6]
  private showDateMonth: Global.SelectboxItem[] = [
    {
      name: this.$t('charge.monthsOption.one') as string,
      value: 1,
    },
    {
      name: this.$t('charge.monthsOption.three') as string,
      value: 3,
    },
    {
      name: this.$t('charge.monthsOption.six') as string,
      value: 6,
    },
    {
      name: this.$t('charge.monthsOption.twelve') as string,
      value: 12,
    },
  ]

  private activeStartMonth: Global.SelectboxItem = this.availableMonth[0]
  private activeShowMonth: Global.SelectboxItem = this.showDateMonth[0]
  private pricesCalendarData: Charge.DatePricesCalendar = {}

  // 選択された範囲の料金を取得
  private async loadDatePriceCalendar(): Promise<void> {
    if (this.isLoadingRequest) return
    this.scrollToTopBox()
    this.setLoadingStatus(true)
    const startSelectMonth: Date = new Date(this.activeStartMonth.value)
    const endSelectMonth: Date = new Date(
      startSelectMonth.getFullYear(),
      startSelectMonth.getMonth() + Number(this.activeShowMonth.value),
      0
    )
    // 料金対象範囲の調整
    const successData = await this.loadPricesByPlanId(
      format.format(startSelectMonth, 'yyyy-MM-dd'),
      format.format(endSelectMonth, 'yyyy-MM-dd')
    )
    if (!successData) {
      this.setLoadingStatus(false)
      return
    }
    // 週毎の料金コピーを可能にするためにデータを分ける
    this.pricesCalendarData = {}
    for (let index = 0; index < this.activeShowMonth.value; index++) {
      const startOfMonth = format.startOfMonth(
        new Date(
          startSelectMonth.getFullYear(),
          startSelectMonth.getMonth() + index,
          1
        )
      )
      const endMonth = format.endOfMonth(startOfMonth)
      const startWeek = format.startOfWeek(startOfMonth, { weekStartsOn: 0 })
      const endWeek = format.endOfWeek(endMonth)
      const daysMonth = format.eachDayOfInterval({
        start: startWeek,
        end: endWeek,
      })
      let weekCounter = 0
      const monthIndex = format.format(startOfMonth, 'yyyy-MM')
      this.pricesCalendarData[monthIndex] = [[]]
      let weekData: string[] = []
      let isCheckBefore: boolean = false
      daysMonth.map((day) => {
        weekData.push(format.format(day, 'yyyy-MM-dd'))
        this.pricesCalendarData[monthIndex][weekCounter] = []
        if (weekData.length === 7) {
          for (let index = 1; index <= ROOM_MAX_PEOPLE; index++) {
            const dataPrice: Charge.WeekPeoplePrices = {
              dates: [],
              prices: [],
              people: '',
              showPeople: '',
            }
            const people: string = '0' + index
            dataPrice.people = people
            dataPrice.showPeople =
              index === ROOM_MAX_PEOPLE
                ? `${index}${this.$t('charge.people.more')}`
                : `${index}${this.$t('charge.people.single')}`
            dataPrice.prices = []
            dataPrice.dates = []
            weekData.map((dayData: string, indexDay: number) => {
              // check same month
              const isShow = dayData.slice(0, 7) === monthIndex
              const isBefore = indexDay === 0 || (isCheckBefore && !isShow)
              const data = this.readableShowPrices[dayData]
                ? this.readableShowPrices[dayData][people]
                : ''
              dataPrice.prices.push(data)
              // カレンダーの祝日を確認
              dataPrice.dates.push({
                date: dayData,
                isHoliday: !!this.holidaysList[dayData],
                isShow,
                isBefore,
              })
              isCheckBefore = isShow
            })
            this.pricesCalendarData[monthIndex][weekCounter].push(dataPrice)
          }
          weekData = []
          weekCounter++
        }
      })
    }
    this.updateDatePrices()
    this.setLoadingStatus(false)
  }

  /*
  週の料金を対象にコピーする
  month: 対象の月
  weekNumber: コピー対象の週
  */
  private overwritePricesAll(month: string, weekNumber: number) {
    const dataOverwrite: string[][] = []
    this.pricesCalendarData[month][weekNumber - 1].map(
      (data: Charge.WeekPeoplePrices) => {
        dataOverwrite.push(data.prices)
      }
    )
    this.pricesCalendarData[month][weekNumber].map(
      (data: Charge.WeekPeoplePrices, index: number) => {
        data.prices = [...dataOverwrite[index]]
        return data
      }
    )
    this.pricesCalendarData = { ...this.pricesCalendarData }
    this.updateDatePrices()
  }

  private selectMonthShow(selectedMonth: number): void {
    this.activeShowMonth =
      this.showDateMonth.find(
        (month: Global.SelectboxItem) => month.value === selectedMonth
      ) || this.activeShowMonth
  }

  private scrollToTopBox(): void {
    const scrollOption = document.getElementById('chargeBoxToTop')
    if (scrollOption) {
      scrollOption.style.scrollBehavior = 'auto'
      scrollOption.scrollTop = 0
      scrollOption.style.scrollBehavior = 'smooth'
    }
  }

  private async saveChargePrices(): Promise<void> {
    if (this.isLoadingRequest) return
    this.scrollToTopBox()
    this.mixinAlertLoading(
      `登録には時間がかかることがあります。<br />
      完了するまでそのまましばらくお待ち下さい。`
    )
    const result = await this.savePlanPrices()
    if (result) {
      await this.loadDatePriceCalendar()
    }
  }

  @Emit()
  private updateDatePrices(): Charge.DatePricesCalendar {
    return this.pricesCalendarData
  }

  @Emit()
  private selectMonthStart(selectedMonth: string): string {
    this.activeStartMonth =
      this.availableMonth.find(
        (month: Global.SelectboxItem) => month.value === selectedMonth
      ) || this.activeStartMonth
    return selectedMonth
  }
}
</script>
<style lang="sass" scoped>
.price-calendar-h
  max-height: 800px
.w-fit-content
  width: fit-content
#chargeBoxToTop
  scroll-behavior: smooth
</style>
