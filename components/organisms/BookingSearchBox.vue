<template>
  <div
    class="border border-solid border-bdColor bg-menuColor px-6 pb-6 pt-4 mb-4"
  >
    <p class="text-lg font-bold mb-4">
      {{ $t('booking.searchBox.headline') }}
    </p>
    <div class="grid grid-rows-2 grid-cols-3-border gap-5 justify-start">
      <div>
        <p class="text-sm mb-2 ml-2">
          {{ $t('booking.searchBox.checkInDate') }}
        </p>
        <div
          class="flex items-stretch mx-booking-search rounded-md border-bdColor border border-solid"
        >
          <date-picker
            v-model="bookingSearchInfo.checkinStart"
            input-class="w-full rounded-l-md text-black-dark placeholder-black-light pl-9 py-2 pr-3 focus:shadow-outline focus:outline-none"
            value-type="format"
            :format="dateFormatCalendar"
            :disabled-date="
              (date) => isCheckDate(date, bookingSearchInfo.checkinEnd, true)
            "
            :placeholder="$t('booking.searchBox.checkInDate')"
          />
          <span
            class="w-20 text-sm bg-bgColor-dark-gray flex items-center justify-center"
            >～</span
          >
          <date-picker
            v-model="bookingSearchInfo.checkinEnd"
            input-class="w-full rounded-r-md text-black-dark placeholder-black-light pl-9 py-2 pr-3 focus:shadow-outline focus:outline-none"
            value-type="format"
            :format="dateFormatCalendar"
            :disabled-date="
              (date) => isCheckDate(date, bookingSearchInfo.checkinStart, false)
            "
            :placeholder="$t('booking.searchBox.checkInDate')"
          />
        </div>
      </div>
      <div class="row-span-2 border-dashed border-r border-bdColor w-px" />
      <div>
        <p class="text-sm mb-2 ml-2">
          {{ $t('booking.searchBox.checkOutDate') }}
        </p>
        <div
          class="flex items-stretch mx-booking-search rounded-md border-bdColor border border-solid"
        >
          <date-picker
            v-model="bookingSearchInfo.checkoutStart"
            input-class="w-full rounded-l-md text-black-dark placeholder-black-light pl-9 py-2 pr-3 focus:shadow-outline focus:outline-none"
            value-type="format"
            :format="dateFormatCalendar"
            :disabled-date="
              (date) => isCheckDate(date, bookingSearchInfo.checkoutEnd, true)
            "
            :placeholder="$t('booking.searchBox.checkOutDate')"
          />
          <span
            class="w-20 text-sm bg-bgColor-dark-gray flex items-center justify-center"
            >～</span
          >
          <date-picker
            v-model="bookingSearchInfo.checkoutEnd"
            input-class="w-full rounded-r-md text-black-dark placeholder-black-light pl-9 py-2 pr-3 focus:shadow-outline focus:outline-none"
            value-type="format"
            :format="dateFormatCalendar"
            :disabled-date="
              (date) =>
                isCheckDate(date, bookingSearchInfo.checkoutStart, false)
            "
            :placeholder="$t('booking.searchBox.checkOutDate')"
          />
        </div>
      </div>
      <div class="row-span-2 border-dashed border-r border-bdColor w-px" />
      <div>
        <p class="text-sm mb-2 ml-2">
          {{ $t('booking.searchBox.applicationDate') }}
        </p>
        <div
          class="flex items-stretch mx-booking-search rounded-md border-bdColor border border-solid"
        >
          <date-picker
            v-model="bookingSearchInfo.applicationStart"
            input-class="w-full rounded-l-md text-black-dark placeholder-black-light pl-9 py-2 pr-3 focus:shadow-outline focus:outline-none"
            value-type="format"
            :format="dateFormatCalendar"
            :disabled-date="
              (date) =>
                isCheckDate(date, bookingSearchInfo.applicationEnd, true)
            "
            :placeholder="$t('booking.searchBox.applicationDate')"
          />
          <span
            class="w-20 text-sm bg-bgColor-dark-gray flex items-center justify-center"
            >～</span
          >
          <date-picker
            v-model="bookingSearchInfo.applicationEnd"
            input-class="w-full rounded-r-md text-black-dark placeholder-black-light pl-9 py-2 pr-3 focus:shadow-outline focus:outline-none"
            value-type="format"
            :format="dateFormatCalendar"
            :disabled-date="
              (date) =>
                isCheckDate(date, bookingSearchInfo.applicationStart, false)
            "
            :placeholder="$t('booking.searchBox.applicationDate')"
          />
        </div>
      </div>
      <div class="flex">
        <div class="w-full flex flex-col space-x-0 text-sm">
          <p class="text-sm mb-2 ml-2 flex">
            {{ $t('booking.searchBox.bookingNumber') }}
            <ErrorText
              :err-text="applicationIdsErrorMessage"
              class="inline ml-auto"
            />
          </p>
          <InputText
            ref="input"
            v-model="bookingSearchInfo.applicationIds"
            class="text-base w-full"
            :error="isCheckNumberAndSpace(bookingSearchInfo.applicationIds)"
            :placeholder="$t('booking.searchList.placeholder.applicationIds')"
            bg=""
            @input="input"
          />
        </div>
      </div>
      <div class="flex">
        <div class="w-full flex flex-col space-x-0 text-sm">
          <p class="text-sm mb-2 ml-2 flex">
            {{ $t('booking.searchBox.lastName') }}
            <ErrorText
              :err-text="lastNameErrorMessage"
              class="inline ml-auto"
            />
          </p>
          <InputText
            v-model="bookingSearchInfo.familyName"
            class="text-base w-full"
            :error="isCheckLastNameAlphabet(bookingSearchInfo.familyName)"
            :placeholder="$t('booking.searchList.placeholder.name')"
            bg=""
          />
        </div>
        <div class="w-20" />
        <div class="w-full flex flex-col text-sm">
          <p class="text-sm mb-2 ml-2 flex">
            {{ $t('booking.searchBox.firstName') }}
            <ErrorText
              :err-text="firstNameErrorMessage"
              class="inline ml-auto"
            />
          </p>
          <InputText
            v-model="bookingSearchInfo.givenName"
            class="text-base w-full"
            :error="isCheckFirstNameAlphabet(bookingSearchInfo.givenName)"
            :placeholder="$t('booking.searchList.placeholder.name')"
            bg=""
          />
        </div>
      </div>
      <div class="flex">
        <div class="w-full flex flex-col space-x-0 text-sm">
          <p class="text-sm mb-2 ml-2">
            {{ $t('booking.searchBox.tel') }}
          </p>
          <InputText
            v-model="bookingSearchInfo.phone"
            class="text-base w-full"
            error=""
            :placeholder="$t('booking.searchList.placeholder.tel')"
            type="number"
            bg=""
          />
        </div>
        <div class="w-20" />
        <div class="w-full flex flex-col text-sm">
          <p class="text-sm mb-2 ml-2">
            {{ $t('booking.statusList.title') }}
          </p>
          <Selectbox
            padding="px-3 py-1.5"
            :items="statusFilter"
            :active-item="activeStatusFilter"
            class="text-base"
            width="w-full"
            :box-position="'top'"
            @select-item="selectedStatusFilter"
          />
        </div>
      </div>
    </div>
    <div class="h-20 overflow-hidden">
      <!-- inputのtextがinputのwidthより長い時fouse位置をちゃんと取れない(blurとclickとmousedownの優先順位の関係で)
      fousetSelectionRangeのclickとmousedownを２回発火してhackを作る -->
      <Tag
        v-for="(item, i) in createTagData"
        :key="i"
        :if="!!bookingSearchInfo.applicationIds"
        :color="'text-tagColor'"
        :clickable="true"
        class="mr-2 mt-2 inline-block"
        @click="inputSelectionRange(item)"
        @mousedown="inputSelectionRange(item)"
      >
        <div class="px-1 py-0.5">{{ item }}</div>
      </Tag>
    </div>
    <div class="flex space-x-3 justify-center">
      <Btn color="gray" class="w-50" height="big" @click="resetSearchInfo">{{
        $t('booking.searchBox.clearButton')
      }}</Btn>
      <Btn
        color="blue"
        class="w-50"
        height="big"
        type="submit"
        :is-disabled="isLoadingSearch"
        :disabled="isLoadingSearch"
        @click="searchBooking"
        >{{ $t('booking.searchBox.searchButton') }}</Btn
      >
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Emit, Prop } from 'vue-property-decorator'
import { isBefore, isAfter } from 'date-fns'
import { Global, Booking } from '~/types'
import {
  DATE_PICKER_FORMAT,
  RESERVE_STATUS_RESERVED,
  RESERVE_STATUS_CANCEL,
  RESERVE_STATUS_NOSHOW,
  RESERVE_STATUS_STAYING,
  RESERVE_STATUS_STAYED,
} from '~/utils/const'
import { stringToNumArray } from '~/utils/typeCasting'

@Component({
  components: {
    Btn: () => import('~/components/atoms/Btn.vue'),
    ErrorText: () => import('~/components/atoms/ErrorText.vue'),
    Tag: () => import('~/components/atoms/Tag.vue'),
    InputText: () => import('~/components/atoms/InputText.vue'),
    RadioGroup: () => import('~/components/molecules/RadioGroup.vue'),
    Selectbox: () => import('~/components/molecules/Selectbox.vue'),
  },
})
export default class extends Vue {
  @Prop({ required: true })
  isLoadingSearch!: boolean

  private applicationIdsErrorMessage: string = ''
  private lastNameErrorMessage: string = ''
  private firstNameErrorMessage: string = ''

  private statusFilter: Global.SelectboxItem[] = [
    {
      name: this.$t('booking.statusList.all') as string,
      value: 0,
    },
    {
      name: this.$t('booking.statusList.bookingDone') as string,
      value: RESERVE_STATUS_RESERVED,
    },
    {
      name: this.$t('booking.statusList.cancel') as string,
      value: RESERVE_STATUS_CANCEL,
    },
    {
      name: this.$t('booking.statusList.noShow') as string,
      value: RESERVE_STATUS_NOSHOW,
    },
    {
      name: this.$t('booking.statusList.duringStay') as string,
      value: RESERVE_STATUS_STAYING,
    },
    {
      name: this.$t('booking.statusList.itineraryEnd') as string,
      value: RESERVE_STATUS_STAYED,
    },
  ]

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

  private defaultValue: Booking.BookingSearchInfo = {
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

  private bookingSearchInfo: Booking.BookingSearchInfo = {
    ...this.defaultValue,
  }

  private activeStatusFilter: Global.SelectboxItem = this.statusFilter[0]
  private dateFormatCalendar = DATE_PICKER_FORMAT

  private routeType(applicationCd: string, tourId: number): string {
    if (applicationCd === '0' && tourId === 0) {
      return this.$i18n.t('booking.searchList.routeType.hotel') as string
    } else if (applicationCd !== '0' && tourId === 0) {
      return this.$i18n.t('booking.searchList.routeType.dp') as string
    } else {
      return this.$i18n.t('booking.searchList.routeType.tour') as string
    }
  }

  private isCheckFirstNameAlphabet(text: string): boolean {
    const alphabetRegex = !/^[A-Za-z+]*$/.test(text)

    if (alphabetRegex) {
      this.firstNameErrorMessage = this.$t(
        'booking.searchList.errorMessage.nameAlphabet'
      ) as string
    } else {
      this.firstNameErrorMessage = ''
    }

    return alphabetRegex
  }

  private isCheckLastNameAlphabet(text: string): boolean {
    const alphabetRegex = !/^[A-Za-z+]*$/.test(text)

    if (alphabetRegex) {
      this.lastNameErrorMessage = this.$t(
        'booking.searchList.errorMessage.nameAlphabet'
      ) as string
    } else {
      this.lastNameErrorMessage = ''
    }

    return alphabetRegex
  }

  private isCheckNumberAndSpace(text: string): boolean {
    const numberRegex = !/^[0-9 ]*$/.test(text)
    const isMaxLength = this.createTagData.length > 20

    if (numberRegex) {
      this.applicationIdsErrorMessage = this.$t(
        'booking.searchList.errorMessage.applicationIdsNumber'
      ) as string
    } else if (isMaxLength) {
      this.applicationIdsErrorMessage = this.$t(
        'booking.searchList.errorMessage.applicationIdsMaxLength'
      ) as string
    } else {
      this.applicationIdsErrorMessage = ''
    }

    return numberRegex || isMaxLength
  }

  private resetSearchInfo(): void {
    this.activeStatusFilter = this.statusFilter[0]
    this.bookingSearchInfo = {
      ...this.defaultValue,
    }
  }

  private isCheckDate(
    date: Date,
    dateCompare: string,
    compareType: boolean
  ): boolean {
    if (dateCompare === '' || dateCompare === null) return false
    return compareType
      ? isAfter(date, new Date(dateCompare))
      : isBefore(date, new Date(dateCompare))
  }

  private input(applicationIds: string): void {
    this.bookingSearchInfo.applicationIds = applicationIds
  }

  private selectedStatusFilter(v: number | string): void {
    this.activeStatusFilter =
      this.statusFilter.find(
        (status: Global.SelectboxItem) => status.value === v
      ) || this.activeStatusFilter
    this.bookingSearchInfo.status = this.activeStatusFilter.value as number
  }

  private inputSelectionRange(item: number) {
    const inputRef = (this.$refs.input as Vue).$el as HTMLInputElement
    const inputData = ` ${this.bookingSearchInfo.applicationIds} `
    const startIndex = inputData.indexOf(` ${item} `)
    const endIndex = startIndex + `${item}`.length
    inputRef.focus()
    inputRef.setSelectionRange(endIndex, endIndex)
  }

  get createTagData(): '' | number[] {
    return stringToNumArray(this.bookingSearchInfo.applicationIds, ' ')
  }

  @Emit()
  private inputSearchInfo(e: string): string {
    return e
  }

  @Emit()
  private searchBooking(): Booking.BookingSearchInfo {
    return this.bookingSearchInfo
  }
}
</script>
