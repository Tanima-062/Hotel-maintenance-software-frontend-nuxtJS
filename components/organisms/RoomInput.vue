<template>
  <div>
    <ValidationObserver v-slot="{ handleSubmit, errors, invalid }">
      <form @submit.prevent>
        <div class="border border-solid border-bdColor table p-0 mb-6 w-full">
          <div class="table-row-group text-base">
            <div class="table-row">
              <div class="table-cell bg-bgColor-red pt-4 pl-4 w-60">
                <p class="text-black-dark">
                  <span class="text-alert">＊</span>
                  {{ $t('room.formTitle.roomName') }}
                </p>
              </div>
              <div class="table-cell pt-4 px-4">
                <InputForm
                  v-model="inputData.name"
                  label=""
                  :show-text-length="true"
                  :text-length="35"
                  :maxlength="35"
                  :input-text-length="inputData.name.length"
                  rules="required"
                  :name="$t('room.label.roomName')"
                  :placeholder="$t('room.placeholder.roomName')"
                />
              </div>
            </div>
            <div class="table-row">
              <div class="table-cell bg-bgColor-red pt-4 pl-4 w-60">
                <p class="text-black-dark">
                  <span class="text-alert">＊</span>
                  {{ $t('room.formTitle.roomKind') }}
                </p>
              </div>
              <div class="table-cell pt-4 px-4">
                <Selectbox
                  width="w-40"
                  padding="px-3 py-1"
                  :error="isErrorRoomKind"
                  :items="roomSelectKinds"
                  :active-item="roomSelectedKind"
                  @select-item="selectedRoomKind"
                />
                <p v-if="isErrorRoomKind" class="text-alert mb-1">
                  {{ $t('room.alert.roomKind') }}
                </p>
              </div>
            </div>
            <div class="table-row">
              <div class="table-cell bg-bgColor-red pt-4 pl-4 w-60">
                <p class="text-black-dark">
                  <span class="text-alert">＊</span>
                  {{ $t('room.formTitle.roomTypeCode') }}
                </p>
              </div>
              <div class="table-cell pt-4 px-4">
                <InputForm
                  v-model="inputData.roomTypeCode"
                  label=""
                  :show-text-length="!isEdit"
                  :text-length="isEdit ? '50' : '20'"
                  :input-text-length="inputData.roomTypeCode.length"
                  :maxlength="isEdit ? '50' : '20'"
                  :rules="`required${
                    isEdit ? '' : regexRuleRoom + '|alpha_num'
                  }`"
                  :name="$t('room.label.roomTypeCode')"
                  :placeholder="$t('room.placeholder.roomTypeCode')"
                  :disabled="isEdit"
                  :prevent-space="true"
                  class="w-full"
                />
              </div>
            </div>
            <div class="table-row">
              <div class="table-cell bg-bgColor-red pt-4 pl-4 w-60 align-top">
                <p class="text-black-dark">
                  {{ $t('room.formTitle.roomDesc') }}
                </p>
              </div>
              <div class="table-cell pt-4 px-4">
                <InputTextarea
                  v-model="inputData.roomDesc"
                  label=""
                  class="w-full mb-3"
                  :placeholder="$t('room.placeholder.roomDesc')"
                  :maxlength="500"
                  :show-text-length="true"
                  :text-length="500"
                  :input-text-length="
                    inputData.roomDesc ? inputData.roomDesc.length : 0
                  "
                  :rows="10"
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
              <div class="table-cell bg-bgColor-red p-4 w-60 align-top">
                <p class="text-black-dark mt-2.5">
                  <span class="text-alert">＊</span>
                  {{ $t('room.formTitle.stockDate') }}
                </p>
              </div>
              <div class="table-cell p-4">
                <div class="flex">
                  <RadioGroup
                    v-model="inputData.isSettingStockYearRound"
                    name="stock-setting"
                    color="text-black"
                    space-between="w-40 last:w-23"
                    :radio-items="radioItems"
                    class="flex items-center justify-between w-76 mr-3 h-10"
                    @input="changePeriodType"
                  />
                  <div class="flex flex-col">
                    <date-picker
                      v-model="inputData.stockSettingStart"
                      value-type="format"
                      :format="'YYYY/MM/DD'"
                      :placeholder="$t('room.placeholder.startDate')"
                      :disabled="inputData.isSettingStockYearRound === 1"
                      :disabled-date="
                        (date) => checkDisableDate(date, new Date(), true)
                      "
                    />
                  </div>
                  <span class="mx-3 text-sm mt-2">〜</span>
                  <div class="flex flex-col">
                    <date-picker
                      v-model="inputData.stockSettingEnd"
                      value-type="format"
                      :format="'YYYY/MM/DD'"
                      :placeholder="$t('room.placeholder.endDate')"
                      :disabled="inputData.isSettingStockYearRound === 1"
                      :disabled-date="
                        (date) =>
                          checkDisableDate(
                            date,
                            new Date(inputData.stockSettingStart),
                            false
                          )
                      "
                    />
                  </div>
                </div>
                <div v-if="isErrorPeriodStart || isErrorPeriodEnd" class="mt-2">
                  <p v-if="isErrorPeriodStart" class="text-alert mb-1">
                    {{ $t('room.alert.startDate') }}
                  </p>
                  <p v-if="isErrorPeriodEnd" class="text-alert">
                    {{ $t('room.alert.endDate') }}
                  </p>
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
              <div class="table-cell bg-bgColor-red pt-4 pl-4 w-60">
                <p class="text-black-dark">
                  <span class="text-alert">＊</span>
                  {{ $t('room.formTitle.roomSetting') }}
                </p>
              </div>
              <div class="table-cell p-4">
                <div class="flex items-center">
                  <p class="text-black-light3 mr-7">
                    {{ $t('room.label.roomOcu') }}
                  </p>
                  <span class="text-black-light mr-3">{{
                    $t('room.label.ocuMin')
                  }}</span>
                  <InputForm
                    v-model="inputData.ocuMin"
                    label=""
                    type="number"
                    :name="$t('room.label.ocuMin')"
                    rules="required_if|integer|min_value:1|max_value:6"
                    class="mr-1 w-23"
                    width="w-23"
                    :show-error="false"
                  />
                  <span class="mr-5 text-black-light">{{
                    $t('room.label.people')
                  }}</span>
                  <span class="mr-5 text-black-light">/</span>
                  <span class="mr-3 text-black-light">{{
                    $t('room.label.ocuMax')
                  }}</span>
                  <InputForm
                    v-model="inputData.ocuMax"
                    label=""
                    type="number"
                    :name="$t('room.label.ocuMax')"
                    :rules="`required_if|integer|min_value:${inputData.ocuMin}|max_value:6`"
                    class="mr-1 w-23"
                    width="w-23"
                    :show-error="false"
                  />
                  <span class="text-black-light">{{
                    $t('room.label.people')
                  }}</span>
                </div>
                <div class="flex flex-col text-alert mt-2">
                  <p v-if="errors[$t('room.label.ocuMin')]" class="mb-1">
                    {{ errors[$t('room.label.ocuMin')][0] }}
                  </p>
                  <p v-if="errors[$t('room.label.ocuMax')]">
                    {{ errors[$t('room.label.ocuMax')][0] }}
                  </p>
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
              <div class="table-cell bg-bgColor-red p-4 w-60">
                <p class="text-black-dark">
                  {{ $t('room.formTitle.smokeOption') }}
                </p>
              </div>
              <div class="table-cell p-4">
                <div class="flex items-center">
                  <RadioGroup
                    v-model="inputData.isSmoking"
                    name="smoking"
                    color="text-black"
                    class="flex items-center justify-between w-67 h-10"
                    :radio-items="isSmokeRadioGroup"
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
              <div class="table-cell bg-bgColor-red pt-4 pl-4 w-60">
                <p class="text-black-dark">
                  {{ $t('room.formTitle.roomAmenity') }}
                </p>
              </div>
              <div class="table-cell pt-4 px-4 pb-2">
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
              <div class="table-cell bg-bgColor-red py-4 pl-4 w-60">
                <p class="text-black-dark">
                  {{ $t('room.formTitle.roomImages') }}
                </p>
              </div>
              <div class="table-cell p-4">
                <div class="mb-4 text-black-light3">
                  <p>{{ $t('room.label.imageDesc1') }}</p>
                  <p>{{ $t('room.label.imageDesc2') }}</p>
                </div>
                <ImageBox
                  class="w-full"
                  :images-list="selectedImages"
                  :remove-image="removeImage"
                  :duplicate-images="checkDuplicateImage"
                  @toggle-image-modal="toggleImageSelecModal"
                />
              </div>
            </div>
          </div>
        </div>
        <div class="flex items-center justify-center mt-6 mb-8 w-full">
          <Btn
            v-if="isEdit"
            :is-disabled="isRequestingForm"
            color="gray"
            class="w-51 m-3"
            height="big"
            @click="!isRequestingForm && $router.push('/room-plan')"
          >
            {{ $t('room.backBtnText') }}
          </Btn>
          <Btn
            :is-disabled="isRequestingForm || checkRoomInputRequired || invalid"
            color="blue"
            class="w-51"
            height="big"
            type="button"
            @click="
              isErrorRoomKind = !checkRoomKindSelected()
              handleSubmit(submit)
            "
          >
            {{ $t('room.saveBtnText') }}
          </Btn>
        </div>
      </form>
    </ValidationObserver>
    <ImageSelectModal
      :is-open="isOpenImageSelectModal"
      :images-list="imagesRoomList"
      :current-image-selected="currentImagePos"
      :current-image-id="currentImageId"
      @select-image="selectImage"
      @toggle-image-modal="toggleImageSelecModal"
    />
  </div>
</template>
<script lang="ts">
import { Component, Mixins, Prop } from 'vue-property-decorator'
import { mdiCog, mdiSmoking } from '@mdi/js'
import { addDays, addYears, isAfter, isWithinInterval } from 'date-fns'
import alert from '~/mixins/alert'
import { formatDate } from '~/utils/date'
import { DATE_PICKER_FORMAT } from '~/utils/const'

import { Global, Room, ImageManage } from '~/types'

@Component({
  components: {
    InputTextarea: () => import('~/components/atoms/InputTextarea.vue'),
    Btn: () => import('~/components/atoms/Btn.vue'),
    RadioGroup: () => import('~/components/molecules/RadioGroup.vue'),
    InputForm: () => import('~/components/molecules/InputForm.vue'),
    AmenityBox: () => import('~/components/organisms/AmenityBox.vue'),
    ImageBox: () => import('~/components/organisms/ImageBox.vue'),
    ImageSelectModal: () =>
      import('~/components/organisms/ImageSelectModal.vue'),
    Selectbox: () => import('~/components/molecules/Selectbox.vue'),
  },
})
export default class extends Mixins(alert) {
  @Prop({ default: [] })
  amenities!: Room.Amenity[]

  @Prop({ default: [] })
  roomKinds!: Room.RoomKind[]

  @Prop()
  saveRoom!: Function

  @Prop({ default: false })
  isEdit!: boolean

  @Prop({ default: false })
  isCopy!: boolean

  @Prop({ default: null })
  roomDetail!: Room.Detail

  @Prop({ default: false })
  isDirect!: boolean

  @Prop({ default: [] })
  imagesRoomList!: ImageManage.Main[]

  private selectedImages: Room.Image[] = []
  private selectedAmenities: Room.Amenity[] = []
  private currentPageNum: number = 1
  private currentImagePos: number = 0
  private currentImageId: number = 0
  private isOpenImageSelectModal: boolean = false
  private isErrorRoomKind: boolean = false
  private isErrorStartPeridod: boolean = false
  private isErrorEndPeridod: boolean = false
  private dateFormat: string = DATE_PICKER_FORMAT
  private isRequestingForm: boolean = false
  private regexRuleRoom: string = !this.isDirect
    ? '|regex:^[^_ 　]+$'
    : '|regex:^[^ 　]+$'

  private icon: { [key: string]: string } = {
    edit: mdiCog,
    smoke: mdiSmoking,
  }

  private inputData = {
    roomTypeId: 0,
    name: '',
    roomKindId: 0,
    roomTypeCode: '',
    roomDesc: '',
    isSettingStockYearRound: 1,
    stockSettingStart: '',
    stockSettingEnd: '',
    ocuMin: '0',
    ocuMax: '0',
    isSmoking: 0,
  }

  private radioItems: Global.RadioItem[] = [
    { value: 1, text: this.$t('room.label.stockYear') as string },
    { value: 0, text: this.$t('room.label.stockSetting') as string },
  ]

  private isSmokeRadioGroup: Global.RadioItem[] = [
    { value: 0, text: this.$t('room.label.nonSmoke') as string },
    { value: 1, text: this.$t('room.label.smoke') as string },
  ]

  private defaultRoomKindToShow: Global.SelectboxItem = {
    name: '未設定',
    value: 0,
  }

  private defaultRoomKindToSelect: Global.SelectboxItem = {
    name: '　',
    value: 0,
  }

  private selectRoomKinds: Global.SelectboxItem[] = [
    this.defaultRoomKindToSelect,
  ]

  private activeKind: Global.SelectboxItem = this.roomSelectedKind

  /*
  カレンダーの選択範囲設定のバリデーション
  date:カレンダーの日にち
  compareDate:範囲対象の日にち
  isStartDate: カレンダーの期間対象、true=開始年月日、false=終了年月日
  */
  private checkDisableDate(
    date: Date,
    compareDate: Date,
    isStartDate: boolean
  ): boolean {
    const validateDateOneyear = addYears(new Date(), 1)
    const validateDate = addDays(compareDate, isStartDate ? -1 : 0)
    if ((this.isEdit && isStartDate) || (this.isCopy && isStartDate)) {
      return isAfter(date, validateDateOneyear)
    }
    this.inputData.stockSettingEnd = ''
    if (!isStartDate && !this.inputData.stockSettingStart.length) {
      return true
    }
    return !isWithinInterval(date, {
      start: validateDate,
      end: validateDateOneyear,
    })
  }

  get roomSelectKinds(): Global.SelectboxItem[] {
    this.selectRoomKinds = [this.defaultRoomKindToSelect]
    this.roomKinds &&
      this.roomKinds.map((kind) => {
        this.selectRoomKinds.push({
          name: kind.kindName,
          value: kind.roomKindId,
        })
      })
    this.activeKind = this.selectRoomKinds[0]
    return this.selectRoomKinds
  }

  get roomSelectedKind(): Global.SelectboxItem {
    if (this.inputData.roomKindId === 0) {
      return this.defaultRoomKindToShow
    }
    return (
      this.roomSelectKinds.find(
        (roomKind: Global.SelectboxItem) =>
          roomKind.value === this.inputData.roomKindId
      ) || this.activeKind
    )
  }

  private selectedRoomKind(roomKindId: number): void {
    this.inputData.roomKindId = roomKindId
    this.isErrorRoomKind = !this.checkRoomKindSelected()
  }

  private checkRoomKindSelected(): boolean {
    return this.inputData.roomKindId !== 0
  }

  get checkRoomInputRequired(): boolean {
    if (
      this.inputData.name.length &&
      this.inputData.roomTypeCode.length &&
      this.checkRoomKindSelected() &&
      Number(this.inputData.ocuMin) > 0 &&
      Number(this.inputData.ocuMax) > 0 &&
      (this.inputData.isSettingStockYearRound === 1 ||
        (this.inputData.isSettingStockYearRound === 0 &&
          !this.isErrorPeriodStart &&
          !this.isErrorPeriodEnd))
    ) {
      return false
    }
    return true
  }

  private created(): void {
    if (!this.roomDetail) return

    this.inputData = {
      ...this.roomDetail,
      isSettingStockYearRound: Number(this.roomDetail.isSettingStockYearRound),
      ocuMin: String(this.roomDetail.ocuMin),
      ocuMax: String(this.roomDetail.ocuMax),
      isSmoking: Number(this.roomDetail.isSmoking),
      stockSettingStart: formatDate(this.roomDetail.stockSettingStart),
      stockSettingEnd: formatDate(this.roomDetail.stockSettingEnd),
    }
    this.changePeriodType()
    this.selectedImages = this.roomDetail.images
    this.selectedAmenities = this.amenities.filter(
      (amenity) => amenity.isSelected
    )
    this.isErrorRoomKind = !this.checkRoomKindSelected()
  }

  private showBorder(index: number): string {
    return index !== 0 ? 'border-t border-solid border-bdColor' : ''
  }

  private isLastMargin(index: number, itemLength: number): string {
    return index === itemLength - 1 ? '' : 'mb-9'
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

  private changeAmenities(list: Room.Amenity[]) {
    this.selectedAmenities = list
  }

  private toggleImageSelecModal(
    data: object & { open: boolean; indexPos: number; imageId: number }
  ): void {
    const el = document.body
    if (data.open) {
      this.currentImagePos = data.indexPos
      this.currentImageId = data.imageId
      el.classList.add('swal2-shown')
    } else {
      this.currentImagePos = 0
      this.currentImageId = 0
      el.classList.remove('swal2-shown')
    }
    this.isOpenImageSelectModal = data.open
  }

  private selectImage(
    data: object & { image: ImageManage.Main; indexPos: number }
  ): void {
    const imageSelected: Room.Image = {
      imageId: data.image.id,
      caption: data.image.caption,
      order: data.image.sortNum,
      href: data.image.href,
    }
    if (data.indexPos !== -1) {
      imageSelected.order = data.indexPos + 1
      this.selectedImages[data.indexPos] = imageSelected
      this.selectedImages = [...this.selectedImages]
    } else {
      imageSelected.order = this.selectedImages.length + 1
      this.selectedImages.push(imageSelected)
    }
    this.toggleImageSelecModal({ open: false, indexPos: 0, imageId: 0 })
  }

  private removeImage(imagePos: number): void {
    this.selectedImages.splice(imagePos, 1)
    this.selectedImages.map((image, index) => {
      image.order = index + 1
    })
  }

  // 重複している画像をチェック
  get checkDuplicateImage(): number[] {
    const duplicateId: number[] = []
    this.selectedImages.map((image) => {
      if (!duplicateId.includes(image.imageId)) {
        const duplicateImage = this.selectedImages.filter(
          (checkImage) => checkImage.imageId === image.imageId
        )
        if (duplicateImage.length >= 2) duplicateId.push(image.imageId)
      }
    })
    return duplicateId
  }

  private changePeriodType(): void {
    if (this.inputData.isSettingStockYearRound) {
      this.inputData.stockSettingStart = ''
      this.inputData.stockSettingEnd = ''
    }
  }

  // 開始年月日と終了年月日のチェック
  private checkStockPeriodDates(): boolean {
    if (this.inputData.isSettingStockYearRound === 0) {
      if (this.isErrorPeriodStart || this.isErrorPeriodEnd) {
        return true
      }
    }
    return false
  }

  get isErrorPeriodStart(): boolean {
    if (this.inputData.isSettingStockYearRound === 0) {
      if (
        !this.inputData.stockSettingStart ||
        (this.inputData.stockSettingStart &&
          !this.inputData.stockSettingStart.length)
      )
        return true
    }
    return false
  }

  get isErrorPeriodEnd(): boolean {
    if (this.inputData.isSettingStockYearRound === 0) {
      if (
        !this.inputData.stockSettingEnd ||
        (this.inputData.stockSettingEnd &&
          !this.inputData.stockSettingEnd.length)
      )
        return true
    }
    return false
  }

  private async submit(): Promise<void> {
    if (this.isRequestingForm) return
    this.isRequestingForm = true
    if (this.checkStockPeriodDates() || this.isErrorRoomKind) {
      this.isRequestingForm = false
      return
    }

    if (this.checkDuplicateImage.length) {
      this.mixinAlert(
        'error',
        this.$t('room.alert.duplTitle') as string,
        this.$t('room.alert.duplContent') as string
      )
      this.isRequestingForm = false
      return
    }

    const amenityIdList: number[] = []
    this.selectedAmenities.forEach((amenity: Room.Amenity) => {
      amenityIdList.push(amenity.amenityId)
    })

    const input: Room.Input = {
      roomTypeId: this.inputData.roomTypeId,
      propertyId: 0,
      roomTypeCode: this.inputData.roomTypeCode,
      name: this.inputData.name,
      roomKindId: this.inputData.roomKindId,
      roomDesc: this.inputData.roomDesc,
      stockSettingStart: this.inputData.stockSettingStart,
      stockSettingEnd: this.inputData.stockSettingEnd,
      isSettingStockYearRound: !!this.inputData.isSettingStockYearRound,
      ocuMin: Number(this.inputData.ocuMin),
      ocuMax: Number(this.inputData.ocuMax),
      isSmoking: !!this.inputData.isSmoking,
      isStopSales: false,
      amenityIdList,
      images: this.selectedImages,
    }
    this.$nuxt.$loading.start()
    const res = await this.saveRoom(input)
    if (res && res === 'DuplicateError') {
      // 重複エラー
      this.mixinAlert(
        'error',
        this.$t('room.alert.duplDataTitle') as string,
        this.$t('room.alert.duplDataContent') as string
      )
      this.isRequestingForm = false
      this.$nuxt.$loading.finish()
      return
    } else if (res !== '') {
      // 重複エラー以外のエラー
      this.mixinAlert(
        'error',
        this.$t('alert.error') as string,
        this.$t('alert.errorContent') as string
      )
      this.isRequestingForm = false
      this.$nuxt.$loading.finish()
      return
    }
    this.$nuxt.$loading.finish()
    await this.mixinAlert(
      'success',
      this.isEdit
        ? (this.$t('room.alert.updateTitle') as string)
        : (this.$t('room.alert.saveTitle') as string),
      this.isEdit
        ? (this.$t('room.alert.updateContent') as string)
        : (this.$t('room.alert.saveContent') as string)
    )
    this.isRequestingForm = false
    this.$router.push('/room-plan')
  }
}
</script>
