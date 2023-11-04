<template>
  <div>
    <p class="text-sm text-black mb-7">
      {{ $t('stock.pageDescription') }}
    </p>
    <DateSelect
      :date-selected="baseDateFromStringToDate"
      :check-before-change="() => true"
      @change="changeDate"
    />
    <div id="stockToTop" class="h-full max-h-620px overflow-y-auto relative">
      <table class="w-full border-separate border-spacing">
        <thead>
          <tr>
            <th
              class="sticky top-0 bg-white border-t border-l border-solid border-bdColor text-center py-3 px-1 green-bottom-line"
              colspan="2"
            />
            <th
              v-for="(day, dIndex) in dayList"
              :key="dIndex"
              class="sticky top-0 bg-white border-t border-l border-solid border-bdColor text-center py-3 px-1 green-bottom-line"
              :class="dIndex === dayList.length - 1 ? 'border-r' : ''"
            >
              <span class="underline font-normal" :class="holidayColor(day)">{{
                day.headerDate
              }}</span>
              <br />
              <span class="font-light" :class="holidayColor(day)">{{
                day.week
              }}</span>
            </th>
          </tr>
        </thead>
        <tbody
          v-for="(room, rIndex) in roomsAndStocks"
          :key="rIndex"
          class="relative"
        >
          <tr>
            <td
              class="border-l border-solid border-bdColor bg-tableColor-green-dark py-3 px-1 font-normal green-bottom-line"
              rowspan="2"
            >
              <div class="max-w-34 break-all align-middle three-point">
                {{ room.name }}
              </div>
            </td>
            <td
              class="border-l border-b border-solid border-bdColor bg-tableColor-green py-3 px-2 font-normal"
            >
              {{ $t('stock.table.numberOfOffers') }}
            </td>
            <td
              v-for="(day, dIndex2) in dayList"
              :key="dIndex2"
              class="border-l border-b border-solid border-bdColor py-3 px-1 text-center font-light"
              :class="
                tableCellStyling(
                  dIndex2 === dayList.length - 1,
                  day.rowDate,
                  room
                )
              "
            >
              <InputText
                :value="
                  room.stocks[day.rowDate]
                    ? room.stocks[day.rowDate].roomCount
                    : 0
                "
                :error="isErrorForm(room.roomTypeId, day.rowDate)"
                class="w-16 text-right"
                padding="px-2 py-1"
                @blur="setRoomCount($event, room, day.rowDate)"
              />
            </td>
          </tr>
          <tr>
            <td
              class="border-l border-solid border-bdColor bg-tableColor-green py-3 px-2 font-normal green-bottom-line"
            >
              {{ $t('stock.table.numberOfSalesRooms') }}
            </td>
            <td
              v-for="(day, dIndex2) in dayList"
              :key="dIndex2"
              class="border-l border-solid border-bdColor p-3 pr-4.5 text-right font-light green-bottom-line"
              :class="
                tableCellStyling(
                  dIndex2 === dayList.length - 1,
                  day.rowDate,
                  room
                )
              "
            >
              {{
                room.stocks[day.rowDate]
                  ? room.stocks[day.rowDate].bookingCount
                  : 0
              }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="flex items-start justify-between mb-8">
      <div
        v-if="showPrevious"
        class="mt-3 flex underline cursor-pointer text-black-light focus:outline-none hover:text-black-light2"
        @click="$router.back()"
      >
        <Icon :icon="icon.left" color="text-black-light" />
        {{ $t('global.cancelBack') }}
      </div>
      <div v-else class="mt-3 w-66" />
      <div class="mt-7">
        <p v-show="isError" class="mb-2 text-alert">
          {{ $t('stock.alert.form') }}
        </p>
        <Btn
          color="blue"
          class="w-51"
          height="big"
          :is-disabled="isDisabled"
          @click="submit"
        >
          {{ $t('stock.stockButton') }}
        </Btn>
      </div>
      <div class="w-66 flex justify-end">
        <GoTop to-top-id="stockToTop" />
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Mixins, Prop } from 'vue-property-decorator'
import { addDays, format, getDay, isWithinInterval } from 'date-fns'
import { mdiChevronLeft } from '@mdi/js'
import { Stock, Holiday } from '~/types'
import { getWeekName } from '~/utils/date'
import { STOCK_DISPLAY_WEEK, API_DATE_FORMAT } from '~/utils/const'
import alert from '~/mixins/alert'

@Component({
  components: {
    Icon: () => import('~/components/atoms/Icon.vue'),
    InputText: () => import('~/components/atoms/InputText.vue'),
    Btn: () => import('~/components/atoms/Btn.vue'),
    InnerLink: () => import('~/components/atoms/InnerLink.vue'),
    DateSelect: () => import('~/components/molecules/DateSelect.vue'),
    GoTop: () => import('~/components/molecules/GoTop.vue'),
  },
})
export default class extends Mixins(alert) {
  @Prop({ default: [] })
  roomsAndStocksProp!: Stock.List[]

  @Prop()
  saveStocks!: Function

  @Prop({ default: '' })
  baseDate!: string

  @Prop({ default: {} })
  holiday!: Holiday.HolidayDate

  @Prop({ default: false })
  showPrevious!: boolean

  @Prop()
  changeBaseDate!: Function

  private roomsAndStocks: Stock.List[] = []
  private inputRoomsAndStocks: Stock.Input[] = []
  private errorList: Stock.InputError[] = []
  private btnDisable: boolean = false
  private icon: { [key: string]: string } = {
    left: mdiChevronLeft,
  }

  async created() {
    await this.initData()
  }

  get baseDateFromStringToDate(): Date {
    return new Date(this.baseDate)
  }

  get dayList(): Stock.Day[] {
    const base = new Date(this.baseDate)
    return [...Array(STOCK_DISPLAY_WEEK)].map((_, index: number) => {
      const nextDate = addDays(base, index)
      return {
        rowDate: format(nextDate, API_DATE_FORMAT),
        headerDate: format(nextDate, 'MM/dd'),
        week: getWeekName(getDay(nextDate)),
        isSaturday: getDay(nextDate) === 6,
        isHoliday:
          getDay(nextDate) === 0 ||
          !!this.holiday[format(nextDate, API_DATE_FORMAT)],
      }
    })
  }

  get isDisabled(): boolean {
    return this.btnDisable || this.errorList.length > 0
  }

  get isError(): boolean {
    return this.errorList.length > 0
  }

  private async initData(): Promise<void> {
    this.roomsAndStocks = JSON.parse(JSON.stringify(this.roomsAndStocksProp))
    this.roomsAndStocks.forEach((roomData, index) => {
      this.dayList.forEach((day) => {
        this.roomsAndStocks[index].stocks[day.rowDate] = {
          roomCount: roomData.stocks[day.rowDate]
            ? roomData.stocks[day.rowDate].roomCount
            : 0,
          bookingCount: roomData.stocks[day.rowDate]
            ? roomData.stocks[day.rowDate].bookingCount
            : 0,
        }
      })
    })

    this.roomsAndStocks.sort((a: Stock.List, b: Stock.List) => {
      if (a.roomTypeId < b.roomTypeId) return -1
      if (a.roomTypeId > b.roomTypeId) return 1
      return 0
    })
    this.errorList.splice(0, this.errorList.length)
    await this.$nextTick()
  }

  private isRangeWithinStockSettingPeriod(
    day: string,
    start: string,
    end: string
  ): boolean {
    return isWithinInterval(new Date(day), {
      start: new Date(start),
      end: new Date(end),
    })
  }

  private tableCellStyling(
    isBorderR: boolean,
    day: string,
    room: Stock.List
  ): string {
    const classList = []
    if (isBorderR) {
      classList.push('border-r')
    }

    if (
      room.isSettingStockYearRound ||
      this.isRangeWithinStockSettingPeriod(
        day,
        room.stockSettingStart,
        room.stockSettingEnd
      )
    ) {
      classList.push('bg-tableColor-green-light text-black')
    } else {
      classList.push('bg-tableColor-disable text-disabled')
    }
    return classList.join(' ')
  }

  private holidayColor(day: Stock.Day): string {
    if (day.isSaturday) return 'text-dayColor-saturday'
    if (day.isHoliday) return 'text-dayColor-holiday'
    return ''
  }

  private isErrorForm(roomTypeId: number, useDate: string): boolean {
    return this.errorList.some(
      (errorObj) =>
        errorObj.roomTypeId === roomTypeId && errorObj.useDate === useDate
    )
  }

  private setRoomCount(value: string, roomData: Stock.List, day: string): void {
    this.roomsAndStocks.find((room, index, originalArr) => {
      if (room.roomTypeId !== roomData.roomTypeId) return false
      this.$set(originalArr[index].stocks, day, {
        roomCount: value,
        bookingCount: roomData.stocks[day]
          ? roomData.stocks[day].bookingCount
          : 0,
      })
      return true
    })
    this.validateStocks()
  }

  private validateStocks() {
    this.roomsAndStocks.some((room) => {
      Object.entries(room.stocks).forEach(
        ([key, value]: [key: string, value: Stock.Detail]) => {
          let gotError = false
          // 数字かどうかのエラーチェック
          if (
            Number.isNaN(Number(value.roomCount)) ||
            String(value.roomCount).includes('e') ||
            String(value.roomCount) !== Number(value.roomCount).toFixed(0) ||
            value.roomCount === null
          ) {
            gotError = true
          }

          // 提供数<販売数になっていないかチェック
          if (value.roomCount < value.bookingCount) {
            gotError = true
          }

          // 提供数が999を超えていないかチェック
          if (value.roomCount > 999) {
            gotError = true
          }

          if (gotError) {
            this.errorList.push({ roomTypeId: room.roomTypeId, useDate: key })
            this.errorList = this.errorList.filter(
              (element, index, self) =>
                self.findIndex(
                  (e) =>
                    e.roomTypeId === element.roomTypeId &&
                    e.useDate === element.useDate
                ) === index
            )
            this.btnDisable = true
            return
          }
          this.errorList.some((errorObj, index) => {
            if (
              errorObj.roomTypeId === room.roomTypeId &&
              errorObj.useDate === key
            ) {
              this.errorList.splice(index, 1)
              return true
            }
            return false
          })
        }
      )
    })
    if (this.errorList.length === 0) {
      this.btnDisable = false
    }
  }

  private async submit(): Promise<void> {
    this.$nuxt.$loading.start()
    this.validateStocks()
    if (this.isError || this.btnDisable) {
      this.$nuxt.$loading.finish()
      return
    }
    this.btnDisable = true
    let isOutOfRange = false
    let tempRoomsAndStocks: Stock.List[] = JSON.parse(
      JSON.stringify(this.roomsAndStocks)
    )
    this.inputRoomsAndStocks = tempRoomsAndStocks.map(
      (localRoom, index, origArr) => {
        if (Object.keys(localRoom.stocks).length === 0) {
          return {
            roomTypeId: localRoom.roomTypeId,
            stocks: {},
          }
        }

        Object.entries(localRoom.stocks).forEach(
          ([key, value]: [key: string, value: Stock.Detail]) => {
            // 変更のないデータは削除し、サーバ側へ送らない
            if (
              this.roomsAndStocksProp[index].stocks[key] &&
              Number(value.roomCount) ===
                this.roomsAndStocksProp[index].stocks[key].roomCount
            ) {
              delete origArr[index].stocks[key]
              return
            }
            // 数字化
            if (origArr[index].stocks[key]) {
              origArr[index].stocks[key].roomCount = Number(value.roomCount)
            }
            if (
              !localRoom.isSettingStockYearRound &&
              !this.isRangeWithinStockSettingPeriod(
                key,
                localRoom.stockSettingStart,
                localRoom.stockSettingEnd
              )
            ) {
              isOutOfRange = true
            }
          }
        )
        return {
          roomTypeId: localRoom.roomTypeId,
          stocks: origArr[index].stocks,
        }
      }
    )
    tempRoomsAndStocks = []

    if (isOutOfRange) {
      const selected = await this.mixinConfirm(
        this.$t('stock.confirm.confirmTitle') as string,
        this.$t('stock.confirm.confirmContent') as string
      )
      if (!selected) {
        this.$nuxt.$loading.finish()
        this.btnDisable = false
        return
      }
    }
    await this.saveStocks(this.inputRoomsAndStocks)

    this.$nuxt.$loading.finish()
    await this.mixinAlert(
      'success',
      this.$t('stock.alert.saveTitle') as string,
      this.$t('stock.alert.saveContent') as string
    )
    this.btnDisable = false
  }

  private async changeDate(value: Date): Promise<void> {
    await this.changeBaseDate(format(value, API_DATE_FORMAT))
    await this.initData()
  }
}
</script>
<style lang="sass" scoped>
$green-color: #58aaae

.three-point
  display: -webkit-box
  -webkit-box-orient: vertical
  -webkit-line-clamp: 3
  overflow: hidden

.border-spacing
  border-spacing: 0

.green-bottom-line
  border-bottom: solid 2px $green-color

#stockToTop
  scroll-behavior: smooth
</style>
