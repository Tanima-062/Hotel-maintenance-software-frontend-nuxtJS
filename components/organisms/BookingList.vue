<template>
  <div>
    <div class="w-full flex flex-row justify-between items-center mb-3">
      <h3 class="font-normal text-lg ml-2">
        {{ $t('booking.searchList.tableName.title') }}
      </h3>
      <div class="flex flex-row items-center">
        <p class="text-sm">
          {{ $t('booking.searchList.tableName.downloadInfo') }}
        </p>
        <Btn
          :outline="true"
          color="blue"
          class="m-auto px-7"
          height="py-2"
          type="button"
          :is-disabled="!bookingList.length"
          @click="fetchBookingInfoDownload"
        >
          {{ $t('booking.searchList.tableName.btnDownload') }}
        </Btn>
      </div>
    </div>
    <table class="w-full text-sm">
      <thead>
        <tr class="bg-menuColor text-black-dark">
          <th class="w-18 py-4 border-t font-light border-b border-bdColor">
            {{ $t('booking.searchList.tableName.applicationIds') }}
          </th>
          <th class="w-40 py-4 border-t font-light border-b border-bdColor">
            {{ $t('booking.searchList.tableName.status') }}
          </th>
          <th
            class="w-36 py-4 border-t font-light border-b border-bdColor text-left"
          >
            {{ $t('booking.searchList.tableName.totalPrice') }}
          </th>
          <th
            class="w-36 py-4 border-t font-light border-b border-bdColor text-left"
          >
            {{ $t('booking.searchList.tableName.route') }}
          </th>
          <th
            class="w-36 py-4 border-t font-light border-b border-bdColor text-left"
          >
            {{ $t('booking.searchList.tableName.checkIn') }}
          </th>
          <th
            class="w-36 py-4 border-t font-light border-b border-bdColor text-left"
          >
            {{ $t('booking.searchList.tableName.checkOut') }}
          </th>
          <th
            class="w-36 py-4 border-t font-light border-b border-bdColor text-left"
          >
            {{ $t('booking.searchList.tableName.lastName') }}
          </th>
          <th
            class="w-36 py-4 border-t font-light border-b border-bdColor text-left"
          >
            {{ $t('booking.searchList.tableName.firstName') }}
          </th>
          <th
            class="w-36 py-4 border-t font-light border-b border-bdColor text-left"
          >
            {{ $t('booking.searchList.tableName.tel') }}
          </th>
          <th
            class="py-4 border-t font-light border-b border-bdColor pl-3 text-left"
          >
            {{ $t('booking.searchList.tableName.showDetail') }}
          </th>
        </tr>
      </thead>
      <tbody v-if="bookingShowList.length && !isLoadingSearch">
        <tr v-for="(booking, index) in bookingShowList" :key="index">
          <td class="text-center py-4 border-b border-bdColor text-black">
            {{ booking.cmApplicationId }}
          </td>
          <td class="text-center py-4 border-b border-bdColor">
            <Tag
              :color="statusColor(booking.status)"
              padding="px-0"
              class="m-auto p-0 w-20 whitespace-no-wrap"
            >
              <p class="text-sm">{{ statusName(booking.status) }}</p>
            </Tag>
          </td>
          <td class="py-4 border-b border-bdColor text-black">
            {{ booking.totalPayInTax.toLocaleString() }}
          </td>
          <td class="py-4 border-b border-bdColor text-black">
            {{ routeType(booking.applicationCd, booking.tourId) }}
          </td>
          <td class="py-4 border-b border-bdColor text-black">
            {{ booking.checkin }}
          </td>
          <td class="py-4 border-b border-bdColor text-black">
            {{ booking.checkout }}
          </td>
          <td class="py-4 border-b border-bdColor text-black text-left">
            {{ booking.familyName }}
          </td>
          <td class="py-4 border-b border-bdColor text-black text-left">
            {{ booking.givenName }}
          </td>
          <td class="py-4 border-b border-bdColor text-black text-left">
            {{ booking.phone }}
          </td>
          <td class="py-4 border-b border-bdColor">
            <Btn
              color="blue"
              class="w-20 m-auto"
              height="small"
              type="button"
              @click="
                toggleBookingModal({
                  open: true,
                  applicationId: booking.cmApplicationId,
                })
              "
            >
              {{ $t('booking.searchList.detailText') }}
            </Btn>
          </td>
        </tr>
      </tbody>
    </table>
    <div
      v-if="!bookingShowList.length && !isLoadingSearch"
      class="mb-9 border-b border-solid border-bdColor text-center"
    >
      <Empty>
        {{ $t('booking.searchList.noBookingList') }}
      </Empty>
    </div>
    <div
      v-if="isLoadingSearch"
      class="h-50 border-b border-solid border-bdColor flex items-center justify-center"
    >
      <Loading />
    </div>
    <div v-if="bookingShowList.length && !isLoadingSearch" class="my-9">
      <Pagination
        :page-count-items="selectData"
        :selected-count="
          !Object.keys(selectedItem).length ? selectData[0] : selectedItem
        "
        :items-length="bookingList.length"
        :current-page-num="currentPageNum"
        @select-item="selectEvent"
        @click-page-num="clickPageNum"
        @click-left="clickLeft"
        @click-right="clickRight"
      />
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Emit, Prop } from 'vue-property-decorator'
import { Global, Booking } from '~/types'

@Component({
  components: {
    Icon: () => import('~/components/atoms/Icon.vue'),
    Btn: () => import('~/components/atoms/Btn.vue'),
    Tag: () => import('~/components/atoms/Tag.vue'),
    Pagination: () => import('~/components/molecules/Pagination.vue'),
    Loading: () => import('~/components/atoms/Loading.vue'),
    Empty: () => import('~/components/molecules/Empty.vue'),
  },
})
export default class extends Vue {
  @Prop({ required: true })
  bookingList!: Booking.BookingInfo[]

  @Prop({ required: true })
  isLoadingSearch!: boolean

  @Prop({ required: true })
  routeType!: Function

  @Prop({ required: true })
  statusColor!: Function

  @Prop({ required: true })
  statusName!: Function

  @Prop({ required: true })
  fetchBookingInfoDownload!: Function

  private selectData: Global.SelectboxItem[] = [
    {
      name: this.$t('global.maxShowItem.other.firstItem') as string,
      value: 10,
    },
    {
      name: this.$t('global.maxShowItem.other.secondItem') as string,
      value: 20,
    },
    {
      name: this.$t('global.maxShowItem.other.thirdItem') as string,
      value: 30,
    },
  ]

  private selectedItem: Global.SelectboxItem = this.selectData[0]
  private showBookingList: Booking.BookingInfo[] = []
  private currentPageNum: number = 1

  private selectEvent(value: number): void {
    this.selectedItem = this.selectData.find(
      (item) => item.value === value
    ) || {
      name: this.$t('global.maxShowItem.other.firstItem') as string,
      value: 10,
    }
    this.currentPageNum = 1
  }

  private clickPageNum(num: number): void {
    this.currentPageNum = num
  }

  private clickLeft(): void {
    this.currentPageNum--
  }

  private clickRight(): void {
    this.currentPageNum++
  }

  public resetPage(): void {
    this.currentPageNum = 1
  }

  get bookingShowList(): Booking.BookingInfo[] {
    this.showBookingList = [...this.bookingList]
    const currentList =
      Number(this.selectedItem.value) * (this.currentPageNum - 1)
    this.showBookingList = this.showBookingList.splice(
      currentList,
      Number(this.selectedItem.value)
    )
    return this.showBookingList
  }

  @Emit()
  private toggleBookingModal(
    data: object & { open: boolean; applicationId: string }
  ): object & { open: boolean; applicationId: string } {
    return data
  }
}
</script>
