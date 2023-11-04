<template>
  <div>
    <ValidationObserver v-slot="{ errors, invalid }" ref="planInputRef">
      <table
        class="border border-solid border-bdColor p-0 mb-6 w-full border-collapse"
      >
        <tbody>
          <tr class="border-b border-dotted border-bdColor">
            <td class="bg-bgColor-blue pt-4 pl-4 w-60">
              <p class="text-black-dark">
                {{ $t('plan.label.planName') }}
              </p>
            </td>
            <td class="pt-4 px-4">
              <p class="w-full">{{ inputData.name }}</p>
            </td>
          </tr>
          <tr class="border-b border-dotted border-bdColor">
            <td class="bg-bgColor-blue py-4 pl-4 w-60">
              <p class="text-black-dark">
                {{ $t('plan.label.planCode') }}
              </p>
            </td>
            <td class="py-4 px-4">
              <p class="w-full">{{ inputData.planCode }}</p>
            </td>
          </tr>
          <tr class="border-b border-dotted border-bdColor">
            <td class="bg-bgColor-blue py-4 pl-4 w-60 align-top">
              <p class="text-black-dark">
                {{ $t('plan.label.roomForSale') }}
              </p>
            </td>
            <td class="py-4 px-4">
              <div v-if="rooms.length > 0" class="grid grid-cols-3 gap-4">
                <Checkbox
                  v-for="(room, index) in rooms"
                  :key="index"
                  :label="room.name"
                  :checked="inputData.selectedRooms.includes(room.roomTypeId)"
                  :tooltip="room.roomTypeCode"
                  class="select-none"
                  :disabled=true
                />
              </div>
            </td>
          </tr>
          <tr class="border-b border-dotted border-bdColor">
            <td class="bg-bgColor-blue py-4 pl-4 w-60 align-top">
              <p class="text-black-dark">
                {{ $t('plan.label.planDesc') }}
              </p>
            </td>
            <div class="table-cell py-4 px-4">
              <p class="w-full whitespace-pre-line">{{ inputData.description }}</p>
            </div>
          </tr>
          <tr class="border-b border-dotted border-bdColor">
            <td class="bg-bgColor-blue py-4 pl-4 w-60 align-top">
              <p class="text-black-dark">
                {{ $t('plan.label.stayMore') }}
              </p>
            </td>
            <td class="py-4 px-4">
              <div class="flex items-center mb-3">
                <span class="text-black-light mr-1">{{
                  $t('plan.label.min')
                }}</span>
                <span class="ml-1 mr-2">{{ inputData.minStayNum }}</span>
                <span class="text-black-light">{{
                  $t('plan.label.stay')
                }}</span>
              </div>
              <div class="flex items-center">
                <span class="text-black-light mr-1">{{
                  $t('plan.label.max')
                }}</span>
                <span class="ml-1 mr-2">{{ inputData.maxStayNum }}</span>
                <span class="text-black-light">{{
                  $t('plan.label.stay')
                }}</span>
              </div>
            </td>
          </tr>
          <tr class="border-b border-dotted border-bdColor">
            <td class="bg-bgColor-blue py-4 pl-4 w-60 align-middle">
              <p class="text-black-dark">
                {{ $t('plan.label.accommodationPeriod') }}
              </p>
            </td>
            <td class="p-4">
              <div class="flex">
                <RadioGroup
                  :value="inputData.isAccommodatedYearRound"
                  color="text-black"
                  :radio-items="radioItems"
                  class="flex items-center justify-between w-76 mr-3"
                  :isDisabled=true
                />
                <div v-if="!inputData.isAccommodatedYearRound">

                  <span class="ml-2">{{ inputData.accommodationPeriodStart }}</span>
                  <span class="mx-3">〜</span>
                  <span>{{ inputData.accommodationPeriodEnd }}</span>
                </div>
              </div>
            </td>
          </tr>
          <tr class="border-b border-dotted border-bdColor">
            <td class="bg-bgColor-blue py-4 pl-4 w-60 align-middle">
              <p class="text-black-dark">
                {{ $t('plan.label.publishingPeriod') }}
              </p>
            </td>
            <td class="p-4">
              <div class="flex">
                <RadioGroup
                  v-model="inputData.isPublishedYearRound"
                  :value="inputData.isPublishedYearRound"
                  name="publishing"
                  color="text-black"
                  :radio-items="radioItems"
                  class="flex items-center justify-between w-76 mr-3"
                  :isDisabled=true
                />
                <div v-if="!inputData.isPublishedYearRound">
                  <span class="ml-2">{{ inputData.publishingStartDate }}</span>
                  <span class="mx-3">〜</span>
                  <span>{{ inputData.publishingEndDate }}</span>
                </div>
              </div>
            </td>
          </tr>
          <tr class="border-b border-dotted border-bdColor">
            <td class="bg-bgColor-blue py-4 pl-4 w-60 align-top">
              <p class="text-black-dark mt-2">
                {{ $t('plan.label.planReceipt') }}
              </p>
            </td>
            <td class="py-2 px-4">
              <div class="flex items-center py-2">
                <p class="text-black-light3 mr-7">
                  {{ $t('plan.label.receiptEnd') }}
                </p>

                <span class="ml-1 mr-3">{{ inputData.reserveDeadlineDate }}</span>
                <span class="text-black-light mr-3">{{
                  $t('plan.label.stayDate')
                }}</span>

                <div class="flex items-center justify-between">
                  <span class="ml-1 mr-1">{{ inputData.reserveDeadlineTime.split(':')[1] }}</span>
                </div>
                <span class="text-black-light ml-4 mr-3">{{
                   $t('plan.label.hour')
                }}</span>

                <div class="flex items-center justify-between">
                  <span class="ml-1 mr-1">{{ inputData.reserveDeadlineTime.split(':')[0] }}</span>
                </div>
                <span class="ml-3 mr-3 text-black-light">{{
                   $t('plan.label.minute')
                }}</span>
              </div>
            </td>
          </tr>
          <tr class="border-b border-dotted border-bdColor">
            <td class="bg-bgColor-blue py-4 pl-4 w-60 text-black-dark">
              {{ $t('plan.label.checkInTime') }}
            </td>
            <td class="py-4 px-4">
              <div class="flex items-center">
                <span>{{ inputData.checkInStart }}</span>
                <span class="text-black-light ml-4 mr-4">〜</span>
                <span>{{ inputData.checkInEnd }}</span>
              </div>
            </td>
          </tr>
          <tr class="border-b border-dotted border-bdColor">
            <td class="bg-bgColor-blue py-4 pl-4 w-60 text-black-dark">
              {{ $t('plan.label.checkOutTime') }}
            </td>
            <td class="py-4 px-4">
              <div class="flex items-center">
                <span>{{ inputData.checkOut }}</span>
              </div>
            </td>
          </tr>
          <tr class="border-b border-dotted border-bdColor hidden">
            <td
              class="bg-bgColor-blue py-4 pl-4 w-60 align-top text-black-dark"
            >
              {{ $t('plan.formTitle.cancelPolicy') }}
            </td>
            <td class="py-4 px-4">
              <p class="w-full" v-html="inputData.planCancelPolicy"></p>
            </td>
          </tr>
          <tr class="border-b border-dotted border-bdColor">
            <td class="bg-bgColor-blue py-4 pl-4 w-60 text-black-dark">
              {{ $t('plan.formTitle.mealOpt') }}
            </td>
            <td class="py-4 px-4">
              <div class="flex items-center">
                <RadioGroup
                  v-model="checkMealOption"
                  name="meal"
                  color="text-black"
                  :radio-items="isMealOption"
                  class="flex items-center justify-between w-76 mr-3"
                  :isDisabled=true
                />
                <div class="bg-tabBgColor grid grid-cols-3 py-3 px-7">
                  <Checkbox
                    :label="$t('plan.label.mealConditionBreakfast')"
                    class="mr-3"
                    :checked="inputData.mealConditionBreakfast"
                    :disabled=true
                  />
                  <Checkbox
                    :label="$t('plan.label.mealConditionLunch')"
                    class="mr-3"
                    :checked="inputData.mealConditionLunch"
                    :disabled=true
                  />
                  <Checkbox
                    :label="$t('plan.label.mealConditionDinner')"
                    class="mr-3"
                    :checked="inputData.mealConditionDinner"
                    :disabled=true
                  />
                </div>
              </div>
            </td>
          </tr>
          <tr class="border-b border-dotted border-bdColor">
            <td
              class="bg-bgColor-blue py-4 pl-4 w-60 align-top text-black-dark"
            >
              {{ $t('plan.formTitle.priceClass') }}
            </td>
            <td class="py-4 px-4">
              <div class="flex items-center">
                <Checkbox
                  :label="$t('plan.label.oneMan')"
                  :checked="inputData.chargeCategory == 0"
                  :disabled="true"
                />
                <Checkbox
                  :label="$t('plan.label.oneRoom')"
                  class="ml-6"
                  :checked="inputData.chargeCategory == 1"
                  :disabled="true"
                />
              </div>
            </td>
          </tr>
          <tr class="border-b border-dotted border-bdColor">
            <td
              class="bg-bgColor-blue py-4 pl-4 w-60 text-black-dark align-top"
            >
              {{ $t('plan.formTitle.childSet') }}
            </td>
            <td class="py-4 px-4">
              <div class="table w-full">
                <div
                  class="table-header-group bg-bgColor-light-gray text-black"
                >
                  <div class="table-cell p-2">
                    {{ $t('plan.label.childTarget') }}
                  </div>
                  <div class="table-cell p-2 pr-40">
                    {{ $t('plan.label.acceptSet') }}
                  </div>
                  <div class="table-cell p-2 pr-8">
                    {{ $t('plan.label.adultNumberCal') }}
                  </div>
                  <div class="table-cell p-2">
                    {{ $t('plan.label.priceCal') }}
                  </div>
                  <div class="table-cell p-2">
                    {{ $t('plan.label.priceUnit') }}
                  </div>
                </div>
                <div
                  class="table-row-group text-black border-b border-bdColor last:border-b-0"
                >
                  <div class="table-cell p-2">
                    {{ $t('plan.label.childA') }}
                  </div>
                  <div class="table-cell p-2">
                    <BtnGroup
                      :items="acceptSetting"
                      :active-value="inputData.childA.receive"
                    />
                  </div>
                  <div class="table-cell p-2">
                    <Checkbox
                      :label="$t('plan.label.childCount')"
                      :checked="inputData.childA.calcCategory"
                      :disabled=true
                    />
                  </div>
                  <div class="table-cell p-2">
                    <InputForm
                      v-model="inputData.childA.rate"
                      label=""
                      class="w-47"
                      type="number"
                      :name="$t('plan.label.childAPrice')"
                      :disabled=true
                    />
                  </div>
                  <div class="table-cell p-2">
                    <BtnGroup
                      :items="rateUnitSetting"
                      :active-value="inputData.childA.rateCategory"
                      :isSelect="true"
                    />
                  </div>
                </div>
                <div
                  class="table-row-group text-black border-b border-bdColor last:border-b-0"
                >
                  <div class="table-cell p-2">
                    {{ $t('plan.label.childB') }}
                  </div>
                  <div class="table-cell p-2">
                    <BtnGroup
                      :items="acceptSetting"
                      :active-value="inputData.childB.receive"
                    />
                  </div>
                  <div class="table-cell p-2">
                    <Checkbox
                      :label="$t('plan.label.childCount')"
                      :checked="inputData.childB.calcCategory"
                      :disabled=true
                    />
                  </div>
                  <div class="table-cell p-2">
                    <InputForm
                      v-model="inputData.childB.rate"
                      label=""
                      class="w-47"
                      type="number"
                      :name="$t('plan.label.childBPrice')"
                      :disabled=true
                    />
                  </div>
                  <div class="table-cell p-2">
                    <BtnGroup
                      :items="rateUnitSetting"
                      :active-value="inputData.childB.rateCategory"
                      :isSelect="true"
                    />
                  </div>
                </div>
                <div
                  class="table-row-group text-black border-b border-bdColor last:border-b-0"
                >
                  <div class="table-cell p-2">
                    {{ $t('plan.label.childC') }}
                  </div>
                  <div class="table-cell p-2">
                    <BtnGroup
                      :items="acceptSetting"
                      :active-value="inputData.childC.receive"
                    />
                  </div>
                  <div class="table-cell p-2">
                    <Checkbox
                      :label="$t('plan.label.childCount')"
                      :checked="inputData.childC.calcCategory"
                      :disabled=true
                    />
                  </div>
                  <div class="table-cell p-2">
                    <InputForm
                      v-model="inputData.childC.rate"
                      label=""
                      class="w-47"
                      type="number"
                      :name="$t('plan.label.childCPrice')"
                      :disabled=true
                    />
                  </div>
                  <div class="table-cell p-2">
                    <BtnGroup
                      :items="rateUnitSetting"
                      :active-value="inputData.childC.rateCategory"
                      :isSelect="true"
                    />
                  </div>
                </div>
                <div
                  class="table-row-group text-black border-b border-bdColor last:border-b-0"
                >
                  <div class="table-cell p-2">
                    {{ $t('plan.label.childD') }}
                  </div>
                  <div class="table-cell p-2">
                    <BtnGroup
                      :items="acceptSetting"
                      :active-value="inputData.childD.receive"
                    />
                  </div>
                  <div class="table-cell p-2">
                    <Checkbox
                      :label="$t('plan.label.childCount')"
                      :checked="inputData.childD.calcCategory"
                      :disabled=true
                    />
                  </div>
                  <div class="table-cell p-2">
                    <InputForm
                      v-model="inputData.childD.rate"
                      label=""
                      class="w-47"
                      type="number"
                      :name="$t('plan.label.childDPrice')"
                      :disabled=true
                    />
                  </div>
                  <div class="table-cell p-2">
                    <BtnGroup
                      :items="rateUnitSetting"
                      :active-value="inputData.childD.rateCategory"
                      :isSelect="true"
                    />
                  </div>
                </div>
                <div
                  class="table-row-group text-black border-b border-bdColor last:border-b-0"
                >
                  <div class="table-cell p-2">
                    {{ $t('plan.label.childE') }}
                  </div>
                  <div class="table-cell p-2">
                    <BtnGroup
                      :items="acceptSetting"
                      :active-value="inputData.childE.receive"
                    />
                  </div>
                  <div class="table-cell p-2">
                    <Checkbox
                      :label="$t('plan.label.childCount')"
                      :checked="inputData.childE.calcCategory"
                      :disabled=true
                    />
                  </div>
                  <div class="table-cell p-2">
                    <InputForm
                      v-model="inputData.childE.rate"
                      label=""
                      class="w-47"
                      type="number"
                      :name="$t('plan.label.childEPrice')"
                      :disabled=true
                    />
                  </div>
                  <div class="table-cell p-2">
                    <BtnGroup
                      :items="rateUnitSetting"
                      :active-value="inputData.childE.rateCategory"
                      :isSelect="true"
                    />
                  </div>
                </div>
                <div class="table-row-group text-black">
                  <div class="table-cell p-2">
                    {{ $t('plan.label.childF') }}
                  </div>
                  <div class="table-cell p-2">
                    <BtnGroup
                      :items="acceptSetting"
                      :active-value="inputData.childF.receive"
                    />
                  </div>
                  <div class="table-cell p-2">
                    <Checkbox
                      :label="$t('plan.label.childCount')"
                      :checked="inputData.childF.calcCategory"
                      :disabled=true
                    />
                  </div>
                  <div class="table-cell p-2">
                    <InputForm
                      v-model="inputData.childF.rate"
                      label=""
                      class="w-47"
                      type="number"
                      :name="$t('plan.label.childFPrice')"
                      :disabled=true
                    />
                  </div>
                  <div class="table-cell p-2">
                    <BtnGroup
                      :items="rateUnitSetting"
                      :active-value="inputData.childF.rateCategory"
                      :isSelect="true"
                    />
                  </div>
                </div>
              </div>
            </td>
          </tr>
          <tr>
            <td
              class="bg-bgColor-blue py-4 pl-4 w-60 align-top text-black-dark"
            >
              {{ $t('plan.formTitle.planImages') }}
            </td>
            <td class="p-4">
              <ImageBox
                class="w-full"
                :images-list="inputData.images"
                :duplicate-images="[]"
                :remove-image="()=>{}"
                :isViewMode=true
              />
            </td>
          </tr>
        </tbody>
      </table>
      <div class="flex items-center justify-center mb-8 w-full">
        <Btn
          color="gray"
          class="w-51 mr-3"
          height="big"
          @click="$router.push('/room-plan')"
        >
          {{ $t('plan.backBtnText') }}
        </Btn>
      </div>
    </ValidationObserver>
  </div>
</template>
<script lang="ts">
import { Component, Mixins, Prop } from 'vue-property-decorator'
import alert from '~/mixins/alert'
import { Global, Room, Plan, ImageManage } from '~/types'
import { DATE_PICKER_FORMAT, DEFAULT_TIME_MINUTE } from '~/utils/const'

@Component({
  components: {
    Btn: () => import('~/components/atoms/Btn.vue'),
    RadioGroup: () => import('~/components/molecules/RadioGroup.vue'),
    InputForm: () => import('~/components/molecules/InputForm.vue'),
    BtnGroup: () => import('~/components/molecules/BtnGroup.vue'),
    Selectbox: () => import('~/components/molecules/Selectbox.vue'),
    Checkbox: () => import('~/components/molecules/Checkbox.vue'),
    ImageBox: () => import('~/components/organisms/ImageBox.vue'),
    Loading: () => import('~/components/atoms/Loading.vue'),
  },
})
export default class extends Mixins(alert) {
  @Prop()
  savePlan!: Function

  @Prop({ default: false })
  isCopy!: boolean

  @Prop({ default: null })
  planDetail!: Plan.Input | null

  @Prop({ default: [] })
  rooms!: Room.RoomForPlanEdit[]

  @Prop({ default: [] })
  images!: ImageManage.Main[]

  @Prop()
  setTab!: Function

  @Prop({ default: false })
  isHideStockPrice!: boolean

  @Prop()
  fetchRoomInfoPreview!: Function

  @Prop()
  fetchRoomAmenityList!: Function

  private dateFormat: string = DATE_PICKER_FORMAT
  private inputData: Plan.Detail = {
    planId: 0,
    planGroupId: 0,
    roomTypeId: 0,
    name: '',
    planCode: '',
    description: '',
    chargeCategory: 1,
    taxCategory: false,
    checkInStart: 'ー:ー',
    checkInEnd: 'ー:ー',
    checkOut: 'ー:ー',
    minStayNum: 0,
    maxStayNum: 0,
    isAccommodatedYearRound: true,
    accommodationPeriodStart: '',
    accommodationPeriodEnd: '',
    publishingStartDate: '',
    publishingEndDate: '',
    isPublishedYearRound: true,
    reserveAcceptDate: 365,
    reserveAcceptTime: '00:00',
    reserveDeadlineDate: 0,
    reserveDeadlineTime: '23:45',
    mealConditionBreakfast: false,
    mealConditionLunch: false,
    mealConditionDinner: false,
    isPackage: false,
    isNoCancel: false,
    isStopSales: false,
    childA: {
      receive: true,
      rateCategory: 0,
      rate: 100,
      calcCategory: true,
    },
    childB: {
      receive: true,
      rateCategory: 0,
      rate: 100,
      calcCategory: true,
    },
    childC: {
      receive: false,
      rateCategory: 0,
      rate: 0,
      calcCategory: false,
    },
    childD: {
      receive: false,
      rateCategory: 0,
      rate: 0,
      calcCategory: false,
    },
    childE: {
      receive: false,
      rateCategory: 0,
      rate: 0,
      calcCategory: false,
    },
    childF: {
      receive: true,
      rateCategory: 0,
      rate: 100,
      calcCategory: false,
    },
    images: [],
    roomName: '',
    planCancelPolicyId: 0,
    planCancelPolicy: ''
  }

  private activePlanCancelPolicyId: number = 0

  private radioItems: Global.RadioItem[] = [
    { value: true, text: this.$t('plan.label.soldYearRound') as string },
    { value: false, text: this.$t('plan.label.periodSetting') as string },
  ]

  private isMealOption: Global.RadioItem[] = [
    { value: false, text: this.$t('plan.list.noMeal') as string },
    { value: true, text: this.$t('plan.list.meal') as string },
  ]

  private acceptSetting: Global.BtnGroup[] = [
    { name: this.$t('plan.list.button.none') as string, value: false },
    { name: this.$t('plan.list.button.yes') as string, value: true },
  ]

  private rateUnitSetting: Global.BtnGroup[] = [
    { name: this.$t('plan.list.button.yen') as string, value: 2 },
    { name: this.$t('plan.list.button.yenDiscount') as string, value: 3 },
    { name: '%', value: 1 },
  ]

  get taxRadioItems(): Global.RadioItem[] {
    return this.isHideStockPrice
      ? [
          { value: false, text: this.$t('plan.list.button.tax') as string },
          { value: true, text: this.$t('plan.list.button.noTax') as string },
        ]
      : [{ value: false, text: this.$t('plan.list.button.tax') as string }]
  }

  get hourList(): Global.SelectboxItem[] {
    return [...Array(25)].map((_, i) => ({
      name: ('0' + i).slice(-2),
      value: ('0' + i).slice(-2),
    }))
  }

  get CheckInOutHourList(): Global.SelectboxItem[] {
    return [...Array(30)].map((_, i) => ({
      name: ('0' + i).slice(-2),
      value: ('0' + i).slice(-2),
    }))
  }

  get checkInOutMinuteList(): Global.SelectboxItem[] {
    return [
      ...DEFAULT_TIME_MINUTE.map((i) => ({
        name: ('0' + i).slice(-2),
        value: ('0' + i).slice(-2),
      })),
    ]
  }

  get minuteList(): Global.SelectboxItem[] {
    return [
      ...DEFAULT_TIME_MINUTE.map((i) => ({
        name: ('0' + i).slice(-2),
        value: ('0' + i).slice(-2),
      })),
    ]
  }

  get checkMealOption(): string | number | boolean {
    if (
      this.inputData.mealConditionBreakfast ||
      this.inputData.mealConditionLunch ||
      this.inputData.mealConditionDinner
    ) {
      return this.isMealOption[1].value
    }
    return this.isMealOption[0].value
  }

  set checkMealOption(v: string | number | boolean) {
    if (v === this.isMealOption[0].value) {
      this.inputData.mealConditionBreakfast = false
      this.inputData.mealConditionLunch = false
      this.inputData.mealConditionDinner = false
    } else {
      this.inputData.mealConditionBreakfast = true
    }
  }

  private created(): void {
    if (!this.planDetail) {
      return
    }
    this.inputData = {
      ...this.planDetail,
      selectedRooms: [],
    }

    this.inputData.checkInStart = this.timeConvert(this.inputData.checkInStart)
    this.inputData.checkInEnd = this.timeConvert(this.inputData.checkInEnd)
    this.inputData.checkOut = this.timeConvert(this.inputData.checkOut)
  }

  private timeConvert(time: any): string {
    const minutes = time.slice(-2)
    const hours = time.substr(0, time.length - 2)
    const hr = ('0' + hours).slice(-2)
    return hr + ':' + minutes
  }
}
</script>

<style scoped>
.disabled {
  pointer-events: none;
  opacity: 0.4;
}
</style>
