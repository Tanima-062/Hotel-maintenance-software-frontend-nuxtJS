<template>
  <tbody class="text-base border-b-2 border-menuColor-active">
    <tr class="text-base border-t-2 border-menuColor-active">
      <td
        rowspan="3"
        colspan="2"
        class="align-top room-name-max-w border-l border-bdColor bg-tableColor-green-dark overflow-hidden py-3 px-1"
        :class="roomIndex !== 0 && 'room-top-line'"
      >
        <p class="px-1.5 text-base font-normal break-all">
          {{ calendarRoom.roomName }}
        </p>
        <div class="flex flex-col items-center">
          <Btn
            :class="`w-30 h-5 mt-1.5 border-r border-b border-btnColor-cancel text-sm ${
              wholesalerId == wholesalerId_TL ||
              wholesalerId == wholesalerId_Tema
                ? 'pointer-events-none'
                : ''
            }`"
            :color="`${calendarRoom.isStopSales ? 'gray' : 'white'}`"
            :is-disabled="isLoadingRequest"
            :disabled="
              wholesalerId == wholesalerId_TL ||
              wholesalerId == wholesalerId_Tema
                ? true
                : false
            "
            @click="
              changeRoomSales(
                calendarRoom.roomTypeId,
                !calendarRoom.isStopSales
              )
            "
          >
            {{
              calendarRoom.isStopSales
                ? $t('calendar.tableDetail.soldOutButton')
                : $t('calendar.tableDetail.saleButton')
            }}
          </Btn>
        </div>
      </td>
      <td
        colspan="2"
        class="room-title-max-w py-3 pl-2.5 border-l border-r border-b border-bdColor font-normal bg-tableColor-green"
        :class="roomIndex !== 0 && 'room-top-line'"
      >
        {{ $t('calendar.tableDetail.numOfInventory') }}
      </td>
      <td
        v-for="(dateData, index) in dateShowHeader"
        :key="index"
        class="py-2.5 pr-2.5 border-r border-b border-bdColor text-right"
        :class="`
          ${
            calendarRoom.isStopSales ||
            calendarRoom.stocks[dateData].isStopSales
              ? 'disabled-status text-disabled'
              : 'bg-tableColor-green-light'
          } ${roomIndex !== 0 && 'room-top-line'}
        `"
      >
        <template v-if="!isEdidTarget(dateData)">
          {{ calendarRoom.stocks[dateData].stock }}
        </template>
        <input
          v-if="isEdidTarget(dateData)"
          :value="calendarRoom.stocks[dateData].stock"
          type="number"
          class="w-14 text-right border border-dotted rounded-md"
          @keypress="validateNumber"
          @focus="onHandleSelectRoomDate(calendarRoom.roomTypeId, dateData)"
          @blur="
            (e) => {
              onHandleSelectRoomDate(0, '', e)
            }
          "
          @input="onChangeStock"
        />
      </td>
    </tr>
    <tr class="text-base">
      <td
        colspan="2"
        class="room-title-max-w py-3 pl-2.5 border-l border-r border-b border-bdColor font-normal bg-tableColor-green"
      >
        {{ $t('calendar.tableDetail.numOfSalesRoom') }}
      </td>
      <td
        v-for="(dateData, index) in dateShowHeader"
        :key="index"
        class="py-2.5 pr-2.5 border-r border-b border-bdColor text-right"
        :class="
          calendarRoom.isStopSales || calendarRoom.stocks[dateData].isStopSales
            ? 'disabled-status text-disabled'
            : 'bg-tableColor-green-light'
        "
      >
        {{ calendarRoom.stocks[dateData].bookingCount }}
      </td>
    </tr>
    <tr class="text-sm">
      <td
        colspan="2"
        class="w-20 h-12 py-3 pl-2.5 border-l border-r border-b border-bdColor font-normal bg-tableColor-green text-base"
      >
        {{ $t('calendar.tableDetail.stopSales') }}
      </td>
      <td
        v-for="(dateData, index) in dateShowHeader"
        :key="index"
        :align="center"
        class="border-r border-b border-bdColor"
        :class="
          calendarRoom.isStopSales || calendarRoom.stocks[dateData].isStopSales
            ? 'disabled-status'
            : 'bg-tableColor-green-light'
        "
      >
        <p v-if="calendarRoom.stocks[dateData].stock === 0" class="text-alert">
          在庫なし
        </p>
        <Btn
          v-if="calendarRoom.stocks[dateData].stock !== 0"
          :class="`w-14 h-6 ${
            wholesalerId == wholesalerId_TL || wholesalerId == wholesalerId_Tema
              ? 'pointer-events-none'
              : ''
          }`"
          :color="
            calendarRoom.isStopSales ||
            calendarRoom.stocks[dateData].isStopSales
              ? 'gray'
              : 'white'
          "
          :disabled="
            wholesalerId == wholesalerId_TL || wholesalerId == wholesalerId_Tema
              ? true
              : false
          "
          @click="
            changeStockSales(
              roomTypeIds,
              dateData,
              !calendarRoom.stocks[dateData].isStopSales
            )
          "
        >
          {{
            calendarRoom.isStopSales ||
            calendarRoom.stocks[dateData].isStopSales
              ? $t('calendar.tableDetail.soldOutButton')
              : $t('calendar.tableDetail.saleButton')
          }}
        </Btn>
      </td>
    </tr>
  </tbody>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { mdiCalendarRange } from '@mdi/js'
import { Calendar, Stock } from '~/types'
import { CALENDAR_ROOM_STOCK_MAX_LENGTH, WHOLESALER_ID_TL, WHOLESALER_ID_TEMA } from '~/utils/const'
import { accountStore } from '~/store'

@Component({
  components: {
    Btn: () => import('~/components/atoms/Btn.vue'),
    GoTop: () => import('~/components/molecules/GoTop.vue'),
  },
})
export default class extends Vue {
  @Prop()
  calendarRoom!: Calendar.Room

  @Prop()
  roomIndex!: number

  @Prop({ required: true })
  isLoadingRequest!: boolean

  @Prop({ default: [] })
  dateShowHeader!: Calendar.CalendarHeader[]

  @Prop({ required: true })
  changeRoomSales!: Function

  @Prop({ required: true })
  changeStockSales!: Function

  @Prop({ required: true, default: [] })
  editModeDateList!: string[]

  @Prop({ required: true })
  changeStockRoom!: Function

  // eslint-disable-next-line camelcase
  readonly wholesalerId_TL: number = WHOLESALER_ID_TL
  // eslint-disable-next-line camelcase
  readonly wholesalerId_Tema: number = WHOLESALER_ID_TEMA
  readonly wholesalerId: number = accountStore.wholesalerId
  private Calendar = mdiCalendarRange
  private roomTypeIds: number[] = [this.calendarRoom.roomTypeId]
  private selectedRoomId: number = 0
  private selectedDate: string = ''
  private roomStockCalendar: Stock.roomStocksCalendarData = {}

  private isEdidTarget(date: string): boolean {
    return this.editModeDateList.includes(date)
  }

  private validateNumber(event: Event & { keyCode: number }): void {
    const keyCode = event.keyCode
    if (keyCode < 48 || keyCode > 57) {
      event.preventDefault()
    }
  }

  private onChangeStock(e: Event & { target: HTMLInputElement }): void {
    const targetRoomStock: string = `${this.selectedDate}|${this.selectedRoomId}`
    if (this.selectedRoomId) {
      e.target.value = e.target.value.slice(0, CALENDAR_ROOM_STOCK_MAX_LENGTH)
      if (this.roomStockCalendar[targetRoomStock]) {
        const findRoomStock = this.roomStockCalendar[targetRoomStock].stocks[
          this.selectedDate
        ]
        if (findRoomStock) {
          findRoomStock.roomCount = Number(e.target.value)
        }
      } else {
        this.roomStockCalendar[targetRoomStock] = {
          roomTypeId: this.selectedRoomId,
          stocks: {
            [this.selectedDate]: {
              roomCount: Number(e.target.value),
              bookingCount: 0,
            },
          },
        }
      }
    }
    if (this.calendarRoom.stocks[this.selectedDate]) {
      this.changeStockRoom(
        this.roomIndex,
        this.selectedDate,
        Number(e.target.value),
        this.roomStockCalendar
      )
    }
  }

  private onHandleSelectRoomDate(
    roomId: number,
    date: string,
    e: (Event & { target: HTMLInputElement }) | null = null
  ): void {
    if (e && !e.target.value.length) e.target.value = '0'
    this.selectedRoomId = roomId
    this.selectedDate = date
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
.room-top-line
  border-top: 2px solid rgba(88, 170, 174, 1)
.plan-top-line
  border-top: 1px solid #bbb
.people-bg
  background-color: rgba(240, 240, 240, 0.5)
.disabled-status
  background-color: rgba(221, 221, 221, 0.3)
</style>
