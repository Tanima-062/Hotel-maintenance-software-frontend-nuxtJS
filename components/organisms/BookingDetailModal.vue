<template>
  <transition name="fade-modal">
    <div
      v-if="open"
      class="fixed top-0 left-0 flex items-center justify-center w-full h-full z-40"
    >
      <transition name="fade-modal">
        <div
          v-if="!isLoadingBooking"
          class="booking-modal rounded-md bg-white z-20 flex items-center justify-center flex-col"
        >
          <div
            class="w-full py-4 px-5 flex items-center justify-between booking-modal-title"
          >
            <p class="text-lg text-black-dark font-bold whitespace-no-wrap">
              {{ $t('booking.searchModal.detailTitle') }}
            </p>
            <IconBtn
              :icon="closeIcon"
              color="black-dark"
              hover-color="'black-dark'"
              class="mb-1"
              @click="closeBookingModal"
            />
          </div>
          <div class="w-full overflow-auto px-5 max-h-500px">
            <div class="w-full my-2">
              <p class="text-base text-black-dark">
                {{ $t('booking.searchModal.basicTitle') }}
              </p>
            </div>
            <div class="w-full">
              <table class="w-full mb-6">
                <tbody>
                  <tr>
                    <td
                      class="align-text-top w-29 p-3 border-t border-l border-b border-bdColor text-black-dark content-border bg-menuColor"
                    >
                      {{ $t('booking.searchModal.applicationId') }}
                    </td>
                    <td
                      class="align-text-top pl-3 py-3 border-t border-b border-bdColor text-black content-border"
                    >
                      {{ bookingDetail.cmApplicationId }}
                    </td>
                    <td
                      class="align-text-top w-29 p-3 border-t border-l border-b border-bdColor text-black-dark content-border bg-menuColor"
                    >
                      {{ $t('booking.searchModal.bookDate') }}
                    </td>
                    <td
                      class="align-text-top pl-3 w-56 py-3 border-t border-r border-b border-bdColor text-black content-border"
                    >
                      {{ bookingDetail.createdAt }}
                    </td>
                  </tr>
                  <tr>
                    <td
                      class="align-text-top w-29 pl-3 py-3 border-l border-b border-bdColor text-black-dark content-border bg-menuColor"
                    >
                      {{ $t('booking.searchModal.status') }}
                    </td>
                    <td
                      class="align-text-top pl-3 w-56 py-3 border-b border-bdColor text-black content-border"
                    >
                      <Tag
                        :color="statusColor(bookingDetail.status)"
                        padding="px-0"
                        class="p-0 w-20"
                      >
                        <p class="text-sm text-center whitespace-no-wrap">
                          {{ statusName(bookingDetail.status) }}
                        </p>
                      </Tag>
                    </td>
                    <td
                      class="align-text-top w-29 pl-3 py-3 border-l border-b border-bdColor text-black-dark content-border bg-menuColor"
                    >
                      {{ $t('booking.searchModal.stayDate') }}
                    </td>
                    <td
                      class="align-text-top pl-3 w-56 py-3 border-r border-b border-bdColor text-black content-border"
                    >
                      {{ bookingDetail.arrival }} 〜
                      {{ bookingDetail.departure }}
                    </td>
                  </tr>
                  <tr>
                    <td
                      class="align-text-top w-29 p-3 border-l border-b border-bdColor text-black-dark content-border bg-menuColor"
                    >
                      {{ $t('booking.searchModal.route') }}
                    </td>
                    <td
                      class="align-text-top pl-3 w-56 py-3 border-b border-bdColor text-black content-border"
                    >
                      {{
                        routeType(
                          bookingDetail.applicationCd,
                          bookingDetail.tourId
                        )
                      }}
                    </td>
                    <td
                      class="align-text-top w-29 p-3 border-l border-b border-bdColor text-black-dark content-border bg-menuColor"
                    >
                      {{ $t('booking.searchModal.stayCount') }}/{{
                        $t('booking.searchModal.roomCount')
                      }}
                    </td>
                    <td
                      class="align-text-top pl-3 w-56 py-3 border-r border-b border-bdColor text-black content-border"
                    >
                      {{ bookingDetail.stays
                      }}{{ $t('booking.searchModal.stayUnit') }}
                      {{ bookingDetail.roomNum
                      }}{{ $t('booking.searchModal.roomUnit') }}
                    </td>
                  </tr>
                  <tr>
                    <td
                      class="align-text-top w-29 p-3 border-l border-b border-bdColor text-black-dark content-border bg-menuColor"
                    >
                      {{ $t('booking.searchModal.customerName') }}
                    </td>
                    <td
                      class="align-text-top pl-3 w-56 py-3 border-r border-b border-bdColor text-black content-border"
                    >
                      {{ bookingDetail.familyNameEnc }}
                      {{ bookingDetail.givenNameEnc }}
                    </td>
                    <td
                      class="align-text-top w-29 p-3 border-l border-b border-bdColor text-black-dark content-border bg-menuColor"
                    >
                      {{ $t('booking.searchModal.totalPrice') }}
                    </td>
                    <td
                      class="align-text-top pl-3 w-56 py-3 border-r border-b border-bdColor text-black content-border"
                    >
                      {{ bookingDetail.totalPayInTax.toLocaleString() }}
                      {{ $t('booking.searchModal.currencyUnit') }}
                    </td>
                  </tr>
                  <tr>
                    <td
                      class="align-text-top w-29 p-3 border-l border-b border-bdColor text-black-dark content-border bg-menuColor"
                    >
                      {{ $t('booking.searchModal.tel') }}
                    </td>
                    <td
                      class="align-text-top p-3 w-56 border-b border-bdColor text-black content-border"
                    >
                      {{ bookingDetail.phoneEnc }}
                    </td>
                    <td
                      rowspan="2"
                      class="align-text-top w-29 p-3 border-l border-b border-bdColor text-black-dark bg-menuColor"
                    >
                      {{ $t('booking.searchModal.campaign') }}
                    </td>
                    <td
                      rowspan="2"
                      class="align-text-top pl-3 w-56 py-3 border-r border-b border-bdColor text-black"
                    >
                      <div
                        v-for="(flashSale, index) in bookingDetail.flashSales"
                        :key="index"
                        class="w-full text-center flex items-center mb-1.5"
                      >
                        <div
                          class="flex flex-row rounded-xl overflow-hidden text-sm"
                        >
                          <p
                            v-if="flashSale.discountCouponCount >= 0"
                            class="text-center py-1 px-2 bg-tagCampaignColor-withCoupon1 text-tagCampaignColor-withCoupon2"
                          >
                            {{ flashSale.saleName }}
                            {{ flashSale.discountCouponCount
                            }}{{ $t('booking.searchModal.couponUnit') }}
                          </p>
                          <p
                            v-else
                            class="text-center py-1 px-2 bg-tagCampaignColor-withoutCoupon1 text-tagCampaignColor-withoutCoupon2"
                          >
                            {{ flashSale.saleName }}
                          </p>
                        </div>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td
                      class="align-text-top w-29 p-3 border-l border-b border-bdColor text-black-dark bg-menuColor"
                    >
                      E-mail
                    </td>
                    <td
                      class="align-text-top pl-3 w-56 py-3 border-r border-b border-bdColor text-black"
                    >
                      {{ bookingDetail.emailEnc }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="w-full mb-2">
              <p class="text-base text-black-dark">
                {{ $t('booking.searchModal.priceTitle') }}
              </p>
            </div>
            <div class="w-full">
              <table class="w-full border border-bdColor mb-6">
                <tbody>
                  <tr>
                    <td
                      class="w-34 p-3 border-b border-bdColor text-black-dark content-border bg-menuColor"
                    >
                      {{ $t('booking.searchModal.bookingAmount') }}
                    </td>
                    <td
                      class="px-3 border-b border-bdColor text-black content-border"
                    >
                      <div
                        v-for="(personPrices, i) in bookingDetail.personPrices"
                        :key="i"
                        class="py-2"
                        :class="
                          i !== bookingDetail.personPrices.length - 1
                            ? 'border-b border-bdColor'
                            : ''
                        "
                      >
                        <div v-for="(personPrice, j) in personPrices" :key="j">
                          <p
                            class="w-full flex px-3 py-0.5 text-sm justify-between"
                          >
                            <span v-if="j === 0" class="text-left w-40"
                              >・{{ personPrice.useDate }}</span
                            >
                            <span v-else class="text-left w-40"></span>
                            <span class="w-full flex justify-between">
                              <span class="text-left"
                                >＜{{ j + 1
                                }}{{
                                  $t('booking.searchModal.roomIndex')
                                }}＞</span
                              >
                              <span class="text-right"></span>
                            </span>
                          </p>
                          <p
                            class="w-full flex px-3 py-0.5 text-sm justify-between"
                          >
                            <span class="text-left w-40"></span>
                            <span class="w-full flex justify-between">
                              <span class="text-left">{{
                                $t('booking.searchModal.adult')
                              }}</span>
                              <span class="text-right">
                                {{ personPrice.priceInTax.toLocaleString() }}
                                {{ $t('booking.searchModal.currencyUnit') }}
                                ×
                                {{ personPrice.person }}
                              </span>
                            </span>
                          </p>
                          <p
                            v-show="personPrice.child1Person > 0"
                            class="w-full flex px-3 py-0.5 text-sm justify-between"
                          >
                            <span class="text-left w-40"></span>
                            <span class="w-full flex justify-between">
                              <span class="text-left">{{
                                $t('booking.searchModal.child1')
                              }}</span>
                              <span class="text-right">
                                {{
                                  personPrice.childPrice1InTax.toLocaleString()
                                }}
                                {{ $t('booking.searchModal.currencyUnit') }}
                                ×
                                {{ personPrice.child1Person }}
                              </span>
                            </span>
                          </p>
                          <p
                            v-show="personPrice.child2Person > 0"
                            class="w-full flex px-3 py-0.5 text-sm justify-between"
                          >
                            <span class="text-left w-40"></span>
                            <span class="w-full flex justify-between">
                              <span class="text-left">{{
                                $t('booking.searchModal.child2')
                              }}</span>
                              <span class="text-right">
                                {{
                                  personPrice.childPrice2InTax.toLocaleString()
                                }}
                                {{ $t('booking.searchModal.currencyUnit') }}
                                ×
                                {{ personPrice.child2Person }}
                              </span>
                            </span>
                          </p>
                          <p
                            v-show="personPrice.child3Person > 0"
                            class="w-full flex px-3 py-0.5 text-sm justify-between"
                          >
                            <span class="text-left w-40"></span>
                            <span class="w-full flex justify-between">
                              <span class="text-left">{{
                                $t('booking.searchModal.child3')
                              }}</span>
                              <span class="text-right">
                                {{
                                  personPrice.childPrice3InTax.toLocaleString()
                                }}
                                {{ $t('booking.searchModal.currencyUnit') }}
                                ×
                                {{ personPrice.child3Person }}
                              </span>
                            </span>
                          </p>
                          <p
                            v-show="personPrice.child4Person > 0"
                            class="w-full flex px-3 py-0.5 text-sm justify-between"
                          >
                            <span class="text-left w-40"></span>
                            <span class="w-full flex justify-between">
                              <span class="text-left">{{
                                $t('booking.searchModal.child4')
                              }}</span>
                              <span class="text-right">
                                {{
                                  personPrice.childPrice4InTax.toLocaleString()
                                }}
                                {{ $t('booking.searchModal.currencyUnit') }}
                                ×
                                {{ personPrice.child4Person }}
                              </span>
                            </span>
                          </p>
                          <p
                            v-show="personPrice.child5Person > 0"
                            class="w-full flex px-3 py-0.5 text-sm justify-between"
                          >
                            <span class="text-left w-40"></span>
                            <span class="w-full flex justify-between">
                              <span class="text-left">{{
                                $t('booking.searchModal.child5')
                              }}</span>
                              <span class="text-right">
                                {{
                                  personPrice.childPrice5InTax.toLocaleString()
                                }}
                                {{ $t('booking.searchModal.currencyUnit') }}
                                ×
                                {{ personPrice.child5Person }}
                              </span>
                            </span>
                          </p>
                          <p
                            v-show="personPrice.child6Person > 0"
                            class="w-full flex px-3 py-0.5 text-sm justify-between"
                          >
                            <span class="text-left w-40"></span>
                            <span class="w-full flex justify-between">
                              <span class="text-left">{{
                                $t('booking.searchModal.child6')
                              }}</span>
                              <span class="text-right">
                                {{
                                  personPrice.childPrice6InTax.toLocaleString()
                                }}
                                {{ $t('booking.searchModal.currencyUnit') }}
                                ×
                                {{ personPrice.child6Person }}
                              </span>
                            </span>
                          </p>
                        </div>
                      </div>
                    </td>
                    <td
                      class="w-40 p-3 pr-5 border-b border-bdColor text-black content-border text-right"
                    >
                      {{ bookingDetail.totalPayInTax.toLocaleString() }}
                      {{ $t('booking.searchModal.currencyUnit') }}
                    </td>
                  </tr>
                  <tr>
                    <td
                      class="w-34 p-3 border-b border-bdColor text-black-dark content-border bg-menuColor"
                    >
                      {{ $t('booking.searchModal.discountAmount') }}
                    </td>
                    <td
                      class="p-3 border-b border-bdColor text-black content-border"
                    >
                      <div
                        v-for="(flashSale, index) in bookingDetail.flashSales"
                        :key="index"
                        class="w-full flex items-center px-3 py-0.5 text-sm justify-between"
                      >
                        <span class="text-left"
                          >・{{ flashSale.saleName }}</span
                        >
                        <span
                          v-if="!isTour && getDiscountAmount !== 0"
                          class="text-right"
                          >-{{ flashSale.discountCashAmount.toLocaleString()
                          }}{{ $t('booking.searchModal.currencyUnit') }}</span
                        >
                      </div>
                    </td>
                    <td
                      class="w-40 p-3 pr-5 border-b border-bdColor content-border text-right"
                    >
                      <span v-if="isTour" class="text-black">＊＊＊</span>
                      <span
                        v-else-if="getDiscountAmount > 0"
                        class="text-alert"
                      >
                        -{{ getDiscountAmount.toLocaleString() }}
                        {{ $t('booking.searchModal.currencyUnit') }}
                      </span>
                      <span v-else class="text-black">
                        0
                        {{ $t('booking.searchModal.currencyUnit') }}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td
                      class="w-34 p-3 border-b border-bdColor text-black-dark content-border bg-menuColor"
                    >
                      {{ $t('booking.searchModal.settlementAmount') }}
                    </td>
                    <td
                      class="p-3 border-b border-bdColor text-black content-border text-sm"
                    >
                      <span v-if="isTour">
                        {{ $t('booking.searchModal.tourNotice') }}
                      </span>
                    </td>
                    <td
                      class="p-3 pr-5 border-b border-bdColor text-black content-border text-right"
                    >
                      <span v-if="isTour">＊＊＊</span>
                      <span v-else>
                        {{ getSettlementAmount.toLocaleString() }}
                        {{ $t('booking.searchModal.currencyUnit') }}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td
                      class="w-34 p-3 border-bdColor text-black-dark bg-menuColor"
                    >
                      {{ $t('booking.searchModal.cancelCharge') }}
                    </td>
                    <td
                      colspan="2"
                      class="p-3 pr-5 border-bdColor text-black text-right"
                    >
                      {{ bookingDetail.cancelFee.toLocaleString() }}
                      {{ $t('booking.searchModal.currencyUnit') }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="w-full mb-2">
              <p class="text-base text-black-dark">
                {{ $t('booking.searchModal.roomTitle') }}
              </p>
            </div>
            <div class="w-full">
              <table
                v-for="(roomInfo, index) in bookingDetail.rooms"
                :key="index"
                class="w-full border border-bdColor"
                :class="
                  index !== bookingDetail.rooms.length - 1 ? 'mb-3' : 'mb-6'
                "
              >
                <tbody>
                  <tr>
                    <td
                      class="align-text-top w-34 p-3 border-b border-bdColor text-black-dark content-border bg-menuColor"
                    >
                      {{ $t('booking.searchModal.roomName') }}
                    </td>
                    <td
                      class="align-text-top p-3 border-b border-bdColor text-black content-border"
                    >
                      {{ roomInfo.roomName }}
                    </td>
                  </tr>
                  <tr>
                    <td
                      class="align-text-top w-34 p-3 border-b border-bdColor text-black-dark content-border bg-menuColor"
                    >
                      {{ $t('booking.searchModal.planName') }}
                    </td>
                    <td
                      class="align-text-top p-3 border-b border-bdColor text-black content-border"
                    >
                      {{ roomInfo.planName }}
                    </td>
                  </tr>
                  <tr>
                    <td
                      class="align-text-top w-34 p-3 border-b border-bdColor text-black-dark content-border bg-menuColor"
                    >
                      {{ $t('booking.searchModal.fullName') }}
                    </td>
                    <td
                      class="align-text-top p-3 border-b border-bdColor text-black content-border"
                    >
                      {{ roomInfo.familyName }}
                      {{ roomInfo.givenName }}
                    </td>
                  </tr>
                  <tr>
                    <td
                      class="align-text-top w-34 p-3 border-bdColor text-black-dark bg-menuColor"
                    >
                      {{ $t('booking.searchModal.guestNumber') }}
                    </td>
                    <td class="align-text-top p-3 border-bdColor text-black">
                      {{ createGuestNumber(roomInfo) }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div
            class="flex flex-col w-full p-4 border rounded-b-md border-bdColor text-black-dark bg-bookingModal-footer"
          >
            <div class="flex w-full">
              <div class="flex flex-grow items-center">
                <p class="text-black-light mr-2">
                  {{ $t('booking.searchModal.cancelCharge') }}
                </p>
                <InputText
                  :value="
                    bookingDetail.cancelFee
                      ? bookingDetail.cancelFee
                      : cancelCharge
                  "
                  type="number"
                  class="w-32 mr-2 text-right font-normal"
                  rules="required|number"
                  bg="inputBack"
                  :is-disabled="isCanChangeCancel"
                  :disabled="isCanChangeCancel"
                  @input="inputCancelCharge"
                  @blur="blueInputCancelCharge"
                />
                <p class="text-black-light">
                  {{ $t('booking.searchModal.currencyUnit') }}
                </p>
              </div>
              <div class="flex">
                <Btn
                  v-if="!isTour"
                  color="green"
                  class="w-47 mr-7"
                  :is-disabled="isCanChangeCancel"
                  :disabled="isCanChangeCancel"
                  @click="updateCancelStatus"
                >
                  {{ $t('booking.searchModal.cancelBtnText') }}
                </Btn>
                <span
                  v-show="bookingDetail.cancelFlg"
                  class="border-r border-bdColor"
                ></span>
                <Checkbox
                  v-show="
                    (bookingDetail.status === 4 ||
                      bookingDetail.status === 5) &&
                    checkCancelByDates &&
                    !bookingDetail.cancelFlg &&
                    !isCanChangeCancel
                  "
                  :label="$t('booking.searchModal.noShowBtnText')"
                  class="ml-7 h-11 leading-4"
                  color="black-dark2"
                  :checked="noShowStatus"
                  @change="noShowStatus = $event"
                />
                <Btn
                  v-show="bookingDetail.cancelFlg"
                  color="green"
                  class="w-47 ml-7"
                  :is-disabled="isCanChangeNoShow"
                  :disabled="isCanChangeNoShow"
                  @click="updateNoShowStatus"
                >
                  {{
                    bookingDetail.noShowFlg
                      ? $t('booking.searchModal.noShowDesBtnText')
                      : $t('booking.searchModal.noShowBtnText')
                  }}
                </Btn>
              </div>
            </div>
            <p v-if="isTour" class="mt-2">
              {{ $t('booking.searchModal.tourCancel') }}
            </p>
          </div>
        </div>
      </transition>
      <div v-if="isLoadingBooking">
        <Loading />
      </div>
      <div
        class="absolute top-0 left-0 opacity-40 bg-overlayColor w-full h-full z-10"
        @click="closeBookingModal"
      />
    </div>
  </transition>
</template>
<script lang="ts">
import { Component, Vue, Emit, Prop } from 'vue-property-decorator'
import { mdiClose } from '@mdi/js'
import { isBefore, isAfter, endOfMonth } from 'date-fns'
import { Booking } from '~/types'
import { WHOLESALER_ID_TL, WHOLESALER_ID_TEMA } from '~/utils/const'

@Component({
  components: {
    Checkbox: () => import('~/components/molecules/Checkbox.vue'),
    Btn: () => import('~/components/atoms/Btn.vue'),
    Tag: () => import('~/components/atoms/Tag.vue'),
    IconBtn: () => import('~/components/atoms/IconBtn.vue'),
    InputText: () => import('~/components/atoms/InputText.vue'),
    Loading: () => import('~/components/atoms/Loading.vue'),
  },
})
export default class extends Vue {
  @Prop({ default: false, required: true })
  open!: boolean

  @Prop({ default: false, required: true })
  isLoadingBooking!: boolean

  @Prop({ default: new Date() })
  serverTime!: Date

  @Prop({ required: true })
  bookingDetail!: Booking.BookingDetail

  @Prop({ required: true })
  routeFlgId!: Function

  @Prop({ required: true })
  routeType!: Function

  @Prop({ required: true })
  statusColor!: Function

  @Prop({ required: true })
  statusName!: Function

  private cancelCharge: number = 0
  private closeIcon: string = mdiClose
  private noShowStatus: boolean = false

  private inputCancelCharge(charge: string): void {
    this.cancelCharge = parseFloat(charge)
  }

  get getSettlementAmount(): number {
    if (this.bookingDetail.cancelFlg) {
      return this.bookingDetail.cancelFee
    }
    if (this.bookingDetail.discountPaymentFlg) {
      return this.bookingDetail.salePrice
    }
    return this.bookingDetail.totalPayInTax
  }

  get getDiscountAmount(): number {
    if (this.bookingDetail.cancelFlg) {
      return 0
    }
    if (this.bookingDetail.discountPaymentFlg) {
      return this.bookingDetail.discountCashAmount
    }
    return 0
  }

  get isTour(): boolean {
    return (
      this.routeFlgId(
        this.bookingDetail.applicationCd,
        this.bookingDetail.tourId
      ) === 3
    )
  }

  get isCanChangeCancel(): boolean {
    if (
      (!this.bookingDetail.cancelFlg && this.bookingDetail.noShowFlg) ||
      !this.checkCancelByDates() ||
      this.bookingDetail.cancelFlg
    ) {
      return true
    }
    return false
  }

  get isCanChangeNoShow(): boolean {
    if (
      !this.bookingDetail.cancelFlg ||
      !this.checkCancelByDates() ||
      !isAfter(this.serverTime, new Date(this.bookingDetail.arrival))
    ) {
      this.cancelCharge = this.bookingDetail.cancelFeeSuggest
      return true
    }
    return false
  }

  // 予約詳細のキャンセル可能を確認
  private checkCancelByDates() {
    if (
      isBefore(this.serverTime, new Date(this.bookingDetail.arrival)) ||
      (!this.bookingDetail.cancelFlg &&
        isBefore(
          this.serverTime,
          endOfMonth(new Date(this.bookingDetail.departure))
        )) ||
      (this.bookingDetail.cancelFlg &&
        isBefore(
          new Date(this.bookingDetail.canceledDt),
          new Date(this.bookingDetail.departure)
        ) &&
        isBefore(
          this.serverTime,
          endOfMonth(new Date(this.bookingDetail.canceledDt))
        )) ||
      (this.bookingDetail.cancelFlg &&
        !isBefore(
          new Date(this.bookingDetail.canceledDt),
          new Date(this.bookingDetail.departure)
        ) &&
        isBefore(
          this.serverTime,
          endOfMonth(new Date(this.bookingDetail.canceledDt))
        ))
    ) {
      return true
    }
    return false
  }

  private blueInputCancelCharge(): void {
    this.cancelCharge = this.cancelCharge ? this.cancelCharge : 0
  }

  private createGuestNumber(roomInfo: Booking.RoomInfo): string {
    const result = []
    result.push(
      `${this.$t('booking.searchModal.adult')} ${roomInfo.person}${this.$t(
        'booking.searchModal.personUnit'
      )}`
    )
    if (roomInfo.child1Person !== 0) {
      result.push(
        `${this.$t('booking.searchModal.child1')} ${
          roomInfo.child1Person
        }${this.$t('booking.searchModal.personUnit')}`
      )
    }
    if (roomInfo.child2Person !== 0) {
      result.push(
        `${this.$t('booking.searchModal.child2')} ${
          roomInfo.child2Person
        }${this.$t('booking.searchModal.personUnit')}`
      )
    }
    if (roomInfo.child3Person !== 0) {
      result.push(
        `${this.$t('booking.searchModal.child3')} ${
          roomInfo.child3Person
        }${this.$t('booking.searchModal.personUnit')}`
      )
    }
    if (roomInfo.child4Person !== 0) {
      result.push(
        `${this.$t('booking.searchModal.child4')} ${
          roomInfo.child4Person
        }${this.$t('booking.searchModal.personUnit')}`
      )
    }
    if (roomInfo.child5Person !== 0) {
      result.push(
        `${this.$t('booking.searchModal.child5')} ${
          roomInfo.child5Person
        }${this.$t('booking.searchModal.personUnit')}`
      )
    }
    if (roomInfo.child6Person !== 0) {
      result.push(
        `${this.$t('booking.searchModal.child6')} ${
          roomInfo.child6Person
        }${this.$t('booking.searchModal.personUnit')}`
      )
    }
    if (
      (this.bookingDetail.wholesalerId === WHOLESALER_ID_TL ||
        this.bookingDetail.wholesalerId === WHOLESALER_ID_TEMA) &&
      roomInfo.numberOfChilds !== 0 &&
      roomInfo.child1Person === 0 &&
      roomInfo.child2Person === 0 &&
      roomInfo.child3Person === 0 &&
      roomInfo.child4Person === 0 &&
      roomInfo.child5Person === 0 &&
      roomInfo.child6Person === 0
    ) {
      let childAgeLabel = ''
      if (roomInfo.childAges !== '[]') {
        const childAges = roomInfo.childAges
          .replace(/\[(.+?)\]/, '$1')
          .split(',')
          .join(`${this.$t('booking.searchModal.ageUnit')}, `)
        childAgeLabel = `（${childAges}${this.$t(
          'booking.searchModal.ageUnit'
        )}）`
      }

      result.push(
        `${this.$t('booking.searchModal.child')} ${
          roomInfo.numberOfChilds
        }${this.$t('booking.searchModal.personUnit')}${childAgeLabel}`
      )
    }
    return result.join(' / ')
  }

  @Emit()
  private closeBookingModal(): object & {
    open: boolean
    applicationId: string
  } {
    this.cancelCharge = 0
    this.noShowStatus = false
    return { open: false, applicationId: '0' }
  }

  @Emit()
  private updateNoShowStatus(): Booking.NoShowRequest {
    return {
      cmApplicationId: this.bookingDetail.cmApplicationId,
      noShowFlg: !this.bookingDetail.noShowFlg,
    }
  }

  @Emit()
  private updateCancelStatus(): {
    cancelRequest: Booking.CancelRequest
    isNoShowUpdate: boolean
    isNoShowStatus: boolean
  } {
    return {
      cancelRequest: {
        cmApplicationId: this.bookingDetail.cmApplicationId,
        noShow: this.bookingDetail.noShowFlg ? 1 : 0,
        cancelFee: this.cancelCharge,
      },
      isNoShowUpdate: this.noShowStatus,
      isNoShowStatus: !this.bookingDetail.noShowFlg,
    }
  }
}
</script>
<style lang="sass" scoped>
.booking-modal
  width: 53rem
  .content-border
    border-bottom-style: dotted
  .booking-modal-title
    box-shadow: 0 0 4px 0 rgba(34, 34, 34, 0.3)
.fade-modal-enter-active, .fade-modal-leave-active
  transition: all 0.4s
.fade-modal-enter, .fade-modal-leave-to
  opacity: 0
</style>
