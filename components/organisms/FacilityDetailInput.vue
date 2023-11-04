<template>
  <div>
    <div v-if="!isLoadingRequest">
      <div class="border border-solid border-bdColor table p-0 mb-6 w-full">
        <div class="table-row-group">
          <div class="table-row">
            <div class="table-cell bg-menuColor pt-4 pl-4 w-60">
              <div class="flex flex-row items-center">
                <p class="text-black-dark text-lg font-normal">
                  {{ $t('facility.detailinput.info') }}
                </p>
                <IconBtn
                  :icon="questionIcon"
                  color="text-white"
                  bg-color="bg-btnColor-outline"
                  :icon-width="11"
                  :icon-height="11"
                  :extra-class="'rounded-sm'"
                  padding="p-0.7"
                  class="ml-2"
                  @click="openManualModal(manualData['baseInfo'])"
                />
              </div>
            </div>
          </div>
          <div class="table-row">
            <div class="table-cell align-top bg-menuColor pt-5 pl-4 w-60">
              <p class="text-black-dark ml-3">
                {{ $t('facility.detailinput.amenity') }}
              </p>
            </div>
            <div class="table-cell p-4">
              <InputTextarea
                v-model="inputDetailInfo.descriptionAmenity"
                label=""
                :resize="false"
                height="h-27"
                :placeholder="$t('facility.detailinput.amenity')"
              />
            </div>
          </div>
          <div class="table-row">
            <div class="table-cell align-top bg-menuColor pt-5 pl-4 w-60">
              <p class="text-black-dark ml-3">
                {{ $t('facility.detailinput.food') }}
              </p>
            </div>
            <div class="table-cell p-4">
              <InputTextarea
                v-model="inputDetailInfo.descriptionDining"
                label=""
                rows="5"
                :resize="false"
                height="h-27"
                :placeholder="$t('facility.detailinput.food')"
              />
            </div>
          </div>
          <div class="table-row">
            <div class="table-cell align-top bg-menuColor pt-5 pl-4 w-60">
              <p class="text-black-dark ml-3">
                {{ $t('facility.detailinput.service') }}
              </p>
              <p class="text-black-dark ml-3">
                {{ $t('facility.detailinput.serviceInfo') }}
              </p>
            </div>
            <div class="table-cell p-4">
              <InputTextarea
                v-model="inputDetailInfo.descriptionRooms"
                label=""
                rows="5"
                :resize="false"
                height="h-27"
                :placeholder="`${$t('facility.detailinput.service')} ${$t(
                  'facility.detailinput.serviceInfo'
                )}`"
              />
            </div>
          </div>
          <div class="table-row">
            <div class="table-cell align-top bg-menuColor pt-5 pl-4 w-60">
              <p class="text-black-dark ml-3">
                {{ $t('facility.detailinput.spot') }}
              </p>
            </div>
            <div class="table-cell p-4">
              <InputTextarea
                v-model="inputDetailInfo.descriptionAttractions"
                label=""
                rows="5"
                :resize="false"
                height="h-27"
                :placeholder="$t('facility.detailinput.spot')"
              />
            </div>
          </div>
          <div class="table-row">
            <div class="table-cell align-top bg-menuColor pt-5 pl-4 w-60">
              <p class="text-black-dark ml-3">
                {{ $t('facility.detailinput.view') }}
              </p>
            </div>
            <div class="table-cell p-4">
              <InputTextarea
                v-model="inputDetailInfo.descriptionLocation"
                label=""
                rows="5"
                :resize="false"
                height="h-27"
                :placeholder="$t('facility.detailinput.view')"
              />
            </div>
          </div>
          <div class="table-row">
            <div class="table-cell align-top bg-menuColor pt-5 pl-4 w-60">
              <p class="text-black-dark ml-3">
                {{ $t('facility.detailinput.around') }}
              </p>
            </div>
            <div class="table-cell p-4">
              <InputTextarea
                v-model="inputDetailInfo.descriptionHeadline"
                label=""
                rows="5"
                :resize="false"
                height="h-27"
                :placeholder="$t('facility.detailinput.around')"
              />
            </div>
          </div>
          <div class="table-row">
            <div class="w-full border-b border-bdColor border-dotted" />
            <div class="table-cell">
              <div class="w-full border-b border-bdColor border-dotted" />
            </div>
          </div>
          <div class="table-row">
            <div class="table-cell align-top bg-menuColor pt-5 pl-4 w-60">
              <div class="flex flex-row items-center">
                <p class="text-black-dark text-lg font-normal">
                  {{ $t('facility.detailinput.utility') }}
                </p>
                <IconBtn
                  :icon="questionIcon"
                  color="text-white"
                  bg-color="bg-btnColor-outline"
                  :icon-width="11"
                  :icon-height="11"
                  :extra-class="'rounded-sm'"
                  padding="p-0.7"
                  class="ml-2"
                  @click="openManualModal(manualData['facilityService'])"
                />
              </div>
            </div>
            <div class="table-cell p-4">
              <AmenityBox
                class="w-full"
                :amenities="amenities"
                @change="changeAmenities"
              />
            </div>
          </div>
          <div class="table-row">
            <div class="w-full border-b border-bdColor border-dotted" />
            <div class="table-cell">
              <div class="w-full border-b border-bdColor border-dotted" />
            </div>
          </div>
          <div class="table-row">
            <div class="table-cell align-top bg-menuColor pt-5 pl-4 w-60">
              <div class="flex flex-row items-center">
                <p class="text-black-dark text-lg font-normal">
                  {{ $t('facility.detailinput.policy') }}
                </p>
                <IconBtn
                  :icon="questionIcon"
                  color="text-white"
                  bg-color="bg-btnColor-outline"
                  :icon-width="11"
                  :icon-height="11"
                  :extra-class="'rounded-sm'"
                  padding="p-0.7"
                  class="ml-2"
                  @click="openManualModal(manualData['hotelPolicy'])"
                />
              </div>
            </div>
          </div>
          <div class="table-row">
            <div class="table-cell align-top bg-menuColor pt-6 pl-4 w-60">
              <p class="text-black-dark ml-3">
                {{ $t('facility.detailinput.checkin') }}
              </p>
            </div>
            <div class="table-cell p-4">
              <div class="flex flex-row items-center space-x-3">
                <p class="text-black-light3">
                  {{ $t('facility.detailinput.checkinStart') }}
                </p>
                <TimeSelect
                  :hour-option="CheckInOutHourList"
                  :minute-option="checkInOutMinuteList"
                  :selected-time="inputDetailInfo.checkinBegin"
                  :error="validateCheckInTime"
                  @change="selecteTimeCheckInStart"
                />
                <p class="text-black-light3">〜</p>
                <p class="text-black-light3">
                  {{ $t('facility.detailinput.checkinEnd') }}
                </p>
                <TimeSelect
                  :hour-option="CheckInOutHourList"
                  :minute-option="checkInOutMinuteList"
                  :selected-time="inputDetailInfo.checkinEnd"
                  :error="validateCheckInTime"
                  @change="selecteTimeCheckInEnd"
                />
              </div>
              <p v-if="validateCheckInTime" class="text-alert">
                {{ $t('plan.alert.checkInTime') }}
              </p>
            </div>
          </div>
          <div class="table-row">
            <div class="table-cell align-top bg-menuColor pt-5 pl-4 w-60">
              <p class="text-black-dark ml-3">
                {{ $t('facility.detailinput.checkinDesc') }}
              </p>
              <p class="text-black-dark ml-3">
                {{ $t('facility.detailinput.checkinNotice') }}
              </p>
            </div>
            <div class="table-cell p-4">
              <InputTextarea
                v-model="inputDetailInfo.specialInstructions"
                value=""
                label=""
                rows="5"
                :resize="false"
                height="h-27"
                :placeholder="`${$t('facility.detailinput.checkinDesc')} ${$t(
                  'facility.detailinput.checkinNotice'
                )}`"
              />
            </div>
          </div>
          <div class="table-row">
            <div class="table-cell align-top bg-menuColor pt-6 pl-4 w-60">
              <p class="text-black-dark ml-3">
                {{ $t('facility.detailinput.checkout') }}
              </p>
            </div>
            <div class="table-cell p-4">
              <div class="flex flex-row items-center space-x-3">
                <TimeSelect
                  :hour-option="CheckInOutHourList"
                  :minute-option="checkInOutMinuteList"
                  :selected-time="inputDetailInfo.checkout"
                  @change="selecteTimeCheckOut"
                />
              </div>
            </div>
          </div>
          <div class="table-row">
            <div class="w-full border-b border-bdColor border-dotted" />
            <div class="table-cell">
              <div class="w-full border-b border-bdColor border-dotted" />
            </div>
          </div>
          <div class="table-row">
            <div class="table-cell align-top bg-menuColor pt-5 pl-4 w-60">
              <div class="flex flex-row items-center">
                <p class="text-black-dark text-lg font-normal">
                  {{ $t('facility.detailinput.important') }}
                </p>
                <IconBtn
                  :icon="questionIcon"
                  color="text-white"
                  bg-color="bg-btnColor-outline"
                  :icon-width="11"
                  :icon-height="11"
                  :extra-class="'rounded-sm'"
                  padding="p-0.7"
                  class="ml-2"
                  @click="openManualModal(manualData['importantNotice'])"
                />
              </div>
            </div>
            <div class="table-cell p-4"></div>
          </div>
          <div class="table-row">
            <div class="table-cell align-top bg-menuColor pt-5 pl-4 w-60">
              <p class="text-black-dark ml-3">
                {{ $t('facility.detailinput.price') }}
              </p>
            </div>
            <div class="table-cell p-4">
              <InputTextarea
                v-model="inputDetailInfo.feeMandatory"
                value=""
                label=""
                rows="5"
                :resize="false"
                height="h-27"
                :placeholder="$t('facility.detailinput.price')"
              />
            </div>
          </div>
          <div class="table-row">
            <div class="table-cell align-top bg-menuColor pt-5 pl-4 w-60">
              <p class="text-black-dark ml-3">
                {{ $t('facility.detailinput.optionalPrice') }}
              </p>
            </div>
            <div class="table-cell p-4">
              <InputTextarea
                v-model="inputDetailInfo.feeOptional"
                value=""
                label=""
                rows="5"
                :resize="false"
                height="h-27"
                :placeholder="$t('facility.detailinput.optionalPrice')"
              />
            </div>
          </div>
          <div class="table-row">
            <div class="w-full border-b border-bdColor border-dotted" />
            <div class="table-cell">
              <div class="w-full border-b border-bdColor border-dotted" />
            </div>
          </div>
          <div class="table-row">
            <div class="table-cell align-top bg-menuColor pt-5 pl-4 w-60">
              <div class="flex flex-row items-center">
                <p class="text-black-dark text-lg font-normal">
                  {{ $t('facility.detailinput.toKnowBefore') }}
                </p>
                <IconBtn
                  :icon="questionIcon"
                  color="text-white"
                  bg-color="bg-btnColor-outline"
                  :icon-width="11"
                  :icon-height="11"
                  :extra-class="'rounded-sm'"
                  padding="p-0.7"
                  class="ml-2"
                  @click="openManualModal(manualData['advanceHotelPolicy'])"
                />
              </div>
              <p class="text-black-dark text-lg font-normal">
                {{ $t('facility.detailinput.policy') }}
              </p>
            </div>
            <div class="table-cell p-4">
              <InputTextarea
                v-model="inputDetailInfo.policyKnowBeforeYouGo"
                value=""
                label=""
                rows="5"
                :resize="false"
                height="h-27"
                :placeholder="`${$t('facility.detailinput.toKnowBefore')} ${$t(
                  'facility.detailinput.policy'
                )}`"
              />
            </div>
          </div>
        </div>
      </div>
      <div class="flex items-center justify-center mt-8 w-full mb-10">
        <Btn
          color="blue"
          class="w-60"
          height="big"
          type="button"
          :is-disabled="validateCheckInTime"
          @click="!validateCheckInTime ? saveFacilityDetail() : null"
        >
          {{ $t('facility.saveBtn') }}
        </Btn>
        <Btn
          color="blue"
          class="ml-4 w-60"
          height="big"
          type="button"
          :is-disabled="validateCheckInTime"
          @click="togglePreviewModal"
        >
          {{ $t('global.preview') }}
        </Btn>
      </div>
    </div>
    <div
      v-if="isLoadingRequest"
      class="border border-solid border-bdColor table p-0 mb-6 w-full"
    >
      <Empty> {{ $t('facility.detailLoading') }} </Empty>
    </div>
    <ManualModal
      v-show="isOpenManualModal"
      :is-open-manual-modal="isOpenManualModal"
      :manual-data="showManualImages"
      :close-manual-modal="closeManualModal"
    />
    <FacilityPreviewModal
      v-show="isOpenPreviewModal"
      :main-image="mainImage"
      :facility-detail-info="inputDetailInfo"
      :facility-base-info="facilityBaseInfo"
      :is-open-preview-modal="isOpenPreviewModal"
      :close-preview-modal="togglePreviewModal"
      :amenity-list="selectedAmenities"
    />
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Emit } from 'vue-property-decorator'
import { mdiHelp } from '@mdi/js'
import { Facility, Global } from '~/types'
import { DEFAULT_TIME_MINUTE } from '~/utils/const'

@Component({
  components: {
    IconBtn: () => import('~/components/atoms/IconBtn.vue'),
    Btn: () => import('~/components/atoms/Btn.vue'),
    InputForm: () => import('~/components/molecules/InputForm.vue'),
    InputTextarea: () => import('~/components/atoms/InputTextarea.vue'),
    AmenityBox: () => import('~/components/organisms/AmenityBox.vue'),
    Empty: () => import('~/components/molecules/Empty.vue'),
    ManualModal: () => import('~/components/molecules/ManualModal.vue'),
    FacilityPreviewModal: () =>
      import('~/components/organisms/preview/FacilityPreviewModal.vue'),
    TimeSelect: () => import('~/components/molecules/TimeSelect.vue'),
  },
})
export default class extends Vue {
  @Prop({ default: [] })
  amenities!: Facility.Amenity[]

  @Prop({ required: true })
  facilityDetailInfo!: Facility.FacilityDetailInfo

  @Prop({ required: true })
  facilityBaseInfo!: Facility.FacilityBaseInfo

  @Prop({ default: false })
  isLoadingRequest!: boolean

  @Prop({ required: true })
  fetchFacilityDetailInfo!: Function

  @Prop({ required: true })
  fetchMainImage!: Function

  private questionIcon: string = mdiHelp
  private mainImage: string = ''
  private selectedAmenities: Facility.Amenity[] = []
  private inputDetailInfo: Facility.FacilityDetailInfo = {
    ...this.facilityDetailInfo,
  }

  private isOpenManualModal: boolean = false
  private isOpenPreviewModal: boolean = false
  private showManualImages: Global.ManualItem = {}
  // 施設詳細情報のマニュアルの表示情報
  private manualData: Global.ManualItem = {
    baseInfo: {
      title: this.$t('manual.facilityModal.baseInfo.title') as string,
      separateOption: 'arrow',
      imageList: ['/images/hotel-guide01-1.jpg', '/images/hotel-guide01-2.jpg'],
    },
    facilityService: {
      title: this.$t('manual.facilityModal.facilityService.title') as string,
      separateOption: 'arrow',
      imageList: ['/images/hotel-guide02-1.jpg', '/images/hotel-guide02-2.jpg'],
    },
    hotelPolicy: {
      title: this.$t('manual.facilityModal.hotelPolicy.title') as string,
      separateOption: 'arrow',
      imageList: ['/images/hotel-guide03-1.jpg', '/images/hotel-guide03-2.jpg'],
    },
    importantNotice: {
      title: this.$t('manual.facilityModal.importantNotice.title') as string,
      separateOption: 'arrow',
      imageList: ['/images/hotel-guide04-1.jpg', '/images/hotel-guide04-2.jpg'],
    },
    advanceHotelPolicy: {
      title: this.$t('manual.facilityModal.advanceHotelPolicy.title') as string,
      separateOption: 'arrow',
      imageList: ['/images/hotel-guide05-1.jpg', '/images/hotel-guide05-2.jpg'],
    },
  }

  private changeAmenities(list: Facility.Amenity[]) {
    this.selectedAmenities = list
  }

  get CheckInOutHourList(): Global.SelectboxItem[] {
    return [...Array(30)].map((_, i) => ({
      name: ('0' + i).slice(-2),
      value: ('0' + i).slice(-2),
    }))
  }

  get checkInOutMinuteList(): Global.SelectboxItem[] {
    return DEFAULT_TIME_MINUTE.map((i) => ({
      name: ('0' + i).slice(-2),
      value: ('0' + i).slice(-2),
    }))
  }

  get validateCheckInTime(): boolean {
    if (this.inputDetailInfo.checkinBegin && this.inputDetailInfo.checkinEnd) {
      const checkInStartHour = Number(
        this.inputDetailInfo.checkinBegin.split(':')[0]
      )
      const checkInStartMinute = Number(
        this.inputDetailInfo.checkinBegin.split(':')[1]
      )
      const checkInEndtHour = Number(
        this.inputDetailInfo.checkinEnd.split(':')[0]
      )
      const checkInEndMinute = Number(
        this.inputDetailInfo.checkinEnd.split(':')[1]
      )
      if (
        checkInStartHour > checkInEndtHour ||
        (checkInStartHour === checkInEndtHour &&
          checkInStartMinute > checkInEndMinute)
      ) {
        return true
      }
      return false
    }
    return false
  }

  private updateInputData(facilityDetailInfo: Facility.FacilityDetailInfo) {
    this.inputDetailInfo = { ...facilityDetailInfo }
    this.inputDetailInfo.checkinBegin = this.checkTimeFormat(
      this.inputDetailInfo.checkinBegin
    )
      ? this.inputDetailInfo.checkinBegin
      : '00:00'
    this.inputDetailInfo.checkinEnd = this.checkTimeFormat(
      this.inputDetailInfo.checkinEnd
    )
      ? this.inputDetailInfo.checkinEnd
      : '00:00'
    this.inputDetailInfo.checkout = this.checkTimeFormat(
      this.inputDetailInfo.checkout
    )
      ? this.inputDetailInfo.checkout
      : '00:00'
    this.selectedAmenities = this.inputDetailInfo.amenities
    this.amenities.forEach((amenity, index) => {
      this.amenities[index].isSelected = this.inputDetailInfo.amenities.some(
        (amenityId) => amenityId.amenityId === amenity.amenityId
      )
    })
  }

  private checkTimeFormat(target: string): boolean {
    try {
      const time = target.split(':')
      if (time.length === 2) {
        return Number(time[0]) !== Number.NaN && Number(time[1]) !== Number.NaN
      } else {
        return false
      }
    } catch (error) {
      return false
    }
  }

  private selecteTimeCheckInStart(time: string): void {
    this.inputDetailInfo.checkinBegin = time
  }

  private selecteTimeCheckInEnd(time: string): void {
    this.inputDetailInfo.checkinEnd = time
  }

  private selecteTimeCheckOut(time: string): void {
    this.inputDetailInfo.checkout = time
  }

  async created() {
    await this.fetchFacilityDetailInfo(true, this.updateInputData)
  }

  private openManualModal(manualShowData: Global.ManualItem): void {
    document.body.classList.add('swal2-shown')
    this.showManualImages = manualShowData
    this.isOpenManualModal = true
  }

  private closeManualModal(): void {
    document.body.classList.remove('swal2-shown')
    this.isOpenManualModal = false
  }

  private async togglePreviewModal(): Promise<void> {
    if (!this.isOpenPreviewModal) {
      this.$nuxt.$loading.start()
      this.mainImage = await this.fetchMainImage()
      this.$nuxt.$loading.finish()
    }
    this.isOpenPreviewModal = !this.isOpenPreviewModal
    if (this.isOpenPreviewModal) {
      document.body.classList.add('swal2-shown')
    } else {
      document.body.classList.remove('swal2-shown')
    }
  }

  @Emit()
  private saveFacilityDetail(): Facility.FacilityDetailInfo {
    this.inputDetailInfo.amenities = this.selectedAmenities
    return this.inputDetailInfo
  }
}
</script>
