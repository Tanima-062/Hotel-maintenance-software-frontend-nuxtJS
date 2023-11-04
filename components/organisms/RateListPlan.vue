<template>
  <tbody class="text-base border-b-2 border-menuColor-active">
    <tr class="text-base border-t-2 border-btnColor-border">
      <td
        rowspan="7"
        class="border-l border-bdColor plan-left-space bg-tableColor-green-dark"
      />
      <td
        rowspan="7"
        class="align-top pt-1.5 room-name-max-w bg-tableColor-green-light overflow-hidden"
        :class="!isFirstPlan && 'plan-top-line'"
      >
        <div class="px-2.5 text-base font-normal break-all">
          {{ calendarPlan.planName }}
        </div>
        <div class="flex flex-col items-center">
          <Btn
            :class="`w-30 h-5 mt-1.5 text-sm ${
              wholesalerId == wholesalerId_TL ||
              wholesalerId == wholesalerId_Tema
                ? 'pointer-events-none'
                : ''
            }`"
            :color="`${calendarPlan.isStopSales ? 'gray' : 'white'}`"
            :disabled="
              wholesalerId == wholesalerId_TL ||
              wholesalerId == wholesalerId_Tema
                ? true
                : false
            "
            @click="
              changePlanSales(calendarPlan.planId, !calendarPlan.isStopSales)
            "
          >
            {{
              calendarPlan.isStopSales
                ? $t('calendar.tableDetail.soldOutButton')
                : $t('calendar.tableDetail.saleButton')
            }}
          </Btn>
        </div>
      </td>
      <td
        colspan="2"
        class="w-20 py-3 pl-2.5 plan-top-line border-l border-r border-b border-bdColor font-normal bg-tableColor-disable"
      >
        {{ $t('calendar.tableDetail.numOfSalesRoom') }}
      </td>
      <td
        v-for="(dateData, index) in dateShowHeader"
        :key="index"
        class="py-2.5 pr-2.5 plan-price-max-w plan-top-line border-r border-b border-bdColor text-right"
        :class="
          (roomStocks[dateData].isStopSales ||
            calendarPlan.isStopSales ||
            calendarPlan.isStopSales) &&
          'disabled-status text-disabled'
        "
      >
        {{ calendarPlan.stockAndPrices[dateData].bookingCount }}
      </td>
    </tr>
    <tr class="text-base">
      <td
        rowspan="6"
        class="align-top pt-2.5 border-r border-l border-bdColor font-normal bg-tableColor-disable"
      >
        <div class="flex flex-col items-center">
          <div>{{ $t('calendar.tableDetail.price') }}</div>
          <IconBtn
            v-if="!isHideStockPrice"
            :icon="iconCalendar"
            color="text-btnColor"
            :icon-width="20"
            class="z50"
            @click="goToPlanPrices(calendarPlan.planId)"
          />
        </div>
      </td>
      <td
        class="border-r border-b border-bdColor text-center font-normal people-bg"
      >
        {{ $t('calendar.tableDetail.onePeople') }}
      </td>
      <td
        v-for="(dateData, index) in dateShowHeader"
        :key="index"
        class="py-2.5 pr-2.5 plan-price-max-w border-r border-b border-bdColor text-right"
        :class="
          (roomStocks[dateData].isStopSales || calendarPlan.isStopSales) &&
          'disabled-status text-disabled'
        "
      >
        <template v-if="!isEdidTarget(dateData)">
          {{
            calendarPlan.stockAndPrices[dateData].prices['01']
              ? calendarPlan.stockAndPrices[dateData].prices[
                  '01'
                ].toLocaleString()
              : 0
          }}
        </template>
        <input
          v-if="isEdidTarget(dateData)"
          type="number"
          class="w-14 text-right border border-dotted rounded-md"
          :value="
            calendarPlan.stockAndPrices[dateData].prices['01']
              ? calendarPlan.stockAndPrices[dateData].prices['01']
              : 0
          "
          @focus="onHandleSelectPlanDate(calendarPlan.planId, dateData, '01')"
          @blur="
            (e) => {
              onHandleSelectPlanDate(0, '', '', e)
            }
          "
          @input="onChangePrice"
        />
      </td>
    </tr>
    <tr class="text-base">
      <td
        class="border-r border-b border-bdColor text-center font-normal people-bg"
      >
        {{ $t('calendar.tableDetail.twoPeople') }}
      </td>
      <td
        v-for="(dateData, index) in dateShowHeader"
        :key="index"
        class="py-2.5 pr-2.5 plan-price-max-w border-r border-b border-bdColor text-right"
        :class="
          (roomStocks[dateData].isStopSales || calendarPlan.isStopSales) &&
          'disabled-status text-disabled'
        "
      >
        <template v-if="!isEdidTarget(dateData)">
          {{
            calendarPlan.stockAndPrices[dateData].prices['02']
              ? calendarPlan.stockAndPrices[dateData].prices[
                  '02'
                ].toLocaleString()
              : 0
          }}
        </template>
        <input
          v-if="isEdidTarget(dateData)"
          type="number"
          class="w-14 text-right border border-dotted rounded-md"
          :value="
            calendarPlan.stockAndPrices[dateData].prices['02']
              ? calendarPlan.stockAndPrices[dateData].prices['02']
              : 0
          "
          @focus="onHandleSelectPlanDate(calendarPlan.planId, dateData, '02')"
          @blur="
            (e) => {
              onHandleSelectPlanDate(0, '', '', e)
            }
          "
          @input="onChangePrice"
        />
      </td>
    </tr>
    <tr class="text-base">
      <td
        class="border-r border-b border-bdColor text-center font-normal people-bg"
      >
        {{ $t('calendar.tableDetail.threePeople') }}
      </td>
      <td
        v-for="(dateData, index) in dateShowHeader"
        :key="index"
        class="py-2.5 pr-2.5 plan-price-max-w border-r border-b border-bdColor text-right"
        :class="
          (roomStocks[dateData].isStopSales || calendarPlan.isStopSales) &&
          'disabled-status text-disabled'
        "
      >
        <template v-if="!isEdidTarget(dateData)">
          {{
            calendarPlan.stockAndPrices[dateData].prices['03']
              ? calendarPlan.stockAndPrices[dateData].prices[
                  '03'
                ].toLocaleString()
              : 0
          }}
        </template>
        <input
          v-if="isEdidTarget(dateData)"
          type="number"
          class="w-14 text-right border border-dotted rounded-md"
          :value="
            calendarPlan.stockAndPrices[dateData].prices['03']
              ? calendarPlan.stockAndPrices[dateData].prices['03']
              : 0
          "
          @focus="onHandleSelectPlanDate(calendarPlan.planId, dateData, '03')"
          @blur="
            (e) => {
              onHandleSelectPlanDate(0, '', '', e)
            }
          "
          @input="onChangePrice"
        />
      </td>
    </tr>
    <tr class="text-base">
      <td
        class="border-r border-b border-bdColor text-center font-normal people-bg"
      >
        {{ $t('calendar.tableDetail.fourPeople') }}
      </td>
      <td
        v-for="(dateData, index) in dateShowHeader"
        :key="index"
        class="py-2.5 pr-2.5 plan-price-max-w border-r border-b border-bdColor text-right"
        :class="
          (roomStocks[dateData].isStopSales || calendarPlan.isStopSales) &&
          'disabled-status text-disabled'
        "
      >
        <template v-if="!isEdidTarget(dateData)">
          {{
            calendarPlan.stockAndPrices[dateData].prices['04']
              ? calendarPlan.stockAndPrices[dateData].prices[
                  '04'
                ].toLocaleString()
              : 0
          }}
        </template>
        <input
          v-if="isEdidTarget(dateData)"
          type="number"
          class="w-14 text-right border border-dotted rounded-md"
          :value="
            calendarPlan.stockAndPrices[dateData].prices['04']
              ? calendarPlan.stockAndPrices[dateData].prices['04']
              : 0
          "
          @focus="onHandleSelectPlanDate(calendarPlan.planId, dateData, '04')"
          @blur="
            (e) => {
              onHandleSelectPlanDate(0, '', '', e)
            }
          "
          @input="onChangePrice"
        />
      </td>
    </tr>
    <tr class="text-base">
      <td
        class="border-r border-b border-bdColor text-center font-normal people-bg"
      >
        {{ $t('calendar.tableDetail.fivePeople') }}
      </td>
      <td
        v-for="(dateData, index) in dateShowHeader"
        :key="index"
        class="py-2.5 pr-2.5 plan-price-max-w border-r border-b border-bdColor text-right"
        :class="
          (roomStocks[dateData].isStopSales || calendarPlan.isStopSales) &&
          'disabled-status text-disabled'
        "
      >
        <template v-if="!isEdidTarget(dateData)">
          {{
            calendarPlan.stockAndPrices[dateData].prices['05']
              ? calendarPlan.stockAndPrices[dateData].prices[
                  '05'
                ].toLocaleString()
              : 0
          }}
        </template>
        <input
          v-if="isEdidTarget(dateData)"
          type="number"
          class="w-14 text-right border border-dotted rounded-md"
          :value="
            calendarPlan.stockAndPrices[dateData].prices['05']
              ? calendarPlan.stockAndPrices[dateData].prices['05']
              : 0
          "
          @focus="onHandleSelectPlanDate(calendarPlan.planId, dateData, '05')"
          @blur="
            (e) => {
              onHandleSelectPlanDate(0, '', '', e)
            }
          "
          @input="onChangePrice"
        />
      </td>
    </tr>
    <tr class="text-base">
      <td class="border-r border-bdColor text-center font-normal people-bg">
        {{ $t('calendar.tableDetail.sixPeople') }}
      </td>
      <td
        v-for="(dateData, index) in dateShowHeader"
        :key="index"
        class="py-2.5 pr-2.5 plan-price-max-w border-r border-bdColor text-right"
        :class="
          (roomStocks[dateData].isStopSales || calendarPlan.isStopSales) &&
          'disabled-status text-disabled'
        "
      >
        <template v-if="!isEdidTarget(dateData)">
          {{
            calendarPlan.stockAndPrices[dateData].prices['06']
              ? calendarPlan.stockAndPrices[dateData].prices[
                  '06'
                ].toLocaleString()
              : 0
          }}
        </template>
        <input
          v-if="isEdidTarget(dateData)"
          type="number"
          class="w-14 text-right border border-dotted rounded-md"
          :value="
            calendarPlan.stockAndPrices[dateData].prices['06']
              ? calendarPlan.stockAndPrices[dateData].prices['06']
              : 0
          "
          @focus="onHandleSelectPlanDate(calendarPlan.planId, dateData, '06')"
          @blur="
            (e) => {
              onHandleSelectPlanDate(0, '', '', e)
            }
          "
          @input="onChangePrice"
        />
      </td>
    </tr>
  </tbody>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { mdiCalendarRange } from '@mdi/js'
import { Calendar, Charge } from '~/types'
import {
  CALENDAR_PLAN_PRICE_MAX_LENGTH,
  WHOLESALER_ID_TL,
  WHOLESALER_ID_TEMA,
} from '~/utils/const'
import { accountStore } from '~/store'

@Component({
  components: {
    Btn: () => import('~/components/atoms/Btn.vue'),
    IconBtn: () => import('~/components/atoms/IconBtn.vue'),
    GoTop: () => import('~/components/molecules/GoTop.vue'),
  },
})
export default class extends Vue {
  @Prop({ required: true })
  calendarPlan!: Calendar.Plan

  @Prop({ default: false })
  isFirstPlan!: boolean

  @Prop({ required: true })
  roomStocks!: Calendar.Stock

  @Prop({ required: true })
  isLoadingRequest!: boolean

  @Prop({ default: [] })
  dateShowHeader!: Calendar.CalendarHeader[]

  @Prop({ required: true })
  changePlanSales!: Function

  @Prop({ required: true })
  goToPlanPrices!: Function

  @Prop({ default: false })
  isHideStockPrice!: boolean

  @Prop({ required: true, default: [] })
  editModeDateList!: string[]

  @Prop({ required: true })
  roomIndex!: number

  @Prop({ required: true })
  planIndex!: number

  @Prop({ required: true })
  changePricePlan!: Function

  // eslint-disable-next-line camelcase
  readonly wholesalerId_TL: number = WHOLESALER_ID_TL
  // eslint-disable-next-line camelcase
  readonly wholesalerId_Tema: number = WHOLESALER_ID_TEMA
  readonly wholesalerId: number = accountStore.wholesalerId
  private iconCalendar = mdiCalendarRange
  private pricePlanCalendar: Charge.PlanPricesCalendarData = {}
  private selectedPlanId: number = 0
  private selectedDate: string = ''
  private selectedType: string = ''

  private isEdidTarget(date: string): boolean {
    return this.editModeDateList.includes(date)
  }

  private onChangePrice(e: Event & { target: HTMLInputElement }): void {
    const targetPlanPrice: string = `${this.selectedDate}|${this.selectedPlanId}`
    if (this.selectedPlanId) {
      e.target.value = e.target.value.slice(0, CALENDAR_PLAN_PRICE_MAX_LENGTH)
      if (this.pricePlanCalendar[targetPlanPrice]) {
        if (this.pricePlanCalendar[targetPlanPrice].prices[this.selectedDate]) {
          const findPricePlan = this.pricePlanCalendar[targetPlanPrice].prices[
            this.selectedDate
          ].find((price) => price.type === this.selectedType)
          if (findPricePlan) {
            findPricePlan.price = Number(e.target.value)
          } else {
            this.pricePlanCalendar[targetPlanPrice].prices[
              this.selectedDate
            ].push({ type: this.selectedType, price: Number(e.target.value) })
          }
        } else {
          this.pricePlanCalendar[targetPlanPrice].prices = {
            ...this.pricePlanCalendar[targetPlanPrice].prices,
            ...{
              [this.selectedDate]: [
                { type: this.selectedType, price: Number(e.target.value) },
              ],
            },
          }
        }
      } else {
        this.pricePlanCalendar[targetPlanPrice] = {
          planId: this.selectedPlanId,
          prices: {
            [this.selectedDate]: [
              { type: this.selectedType, price: Number(e.target.value) },
            ],
          },
        }
      }
      if (this.calendarPlan.stockAndPrices[this.selectedDate]) {
        this.changePricePlan(
          this.roomIndex,
          this.planIndex,
          this.selectedDate,
          this.selectedType,
          Number(e.target.value),
          this.pricePlanCalendar
        )
      }
    }
  }

  private onHandleSelectPlanDate(
    planId: number,
    date: string,
    type: string,
    e: (Event & { target: HTMLInputElement }) | null = null
  ): void {
    if (e && !e.target.value.length) e.target.value = '0'
    this.selectedPlanId = planId
    this.selectedDate = date
    this.selectedType = type
  }
}
</script>
<style lang="sass" scoped>
.room-name-max-w
  max-width: 110px
.room-title-max-w
  max-width: 80px
.plan-left-space
  width: 4px
.plan-price-max-w
  width: 67px
.room-top-line
  border-top: 2px solid rgba(88, 170, 174, 1)
.plan-top-line
  border-top: 1px solid #bbb
.people-bg
  background-color: rgba(240, 240, 240, 0.5)
.disabled-status
  background-color: rgba(221, 221, 221, 0.3)
</style>
