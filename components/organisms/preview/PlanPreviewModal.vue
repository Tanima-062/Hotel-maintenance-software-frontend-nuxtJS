<template>
  <transition name="fade-modal">
    <div class="fixed z-40">
      <div class="fixed inset-0 z-10 preview-bg"></div>
      <div
        id="toTopId"
        class="inset-0 fixed overflow-auto h-screen py-18 top-0 left-0 z-40 flex flex-col"
      >
        <div class="relative w-preview m-auto">
          <div
            v-if="roomInfo"
            class="border-0 p-5 rounded-lg relative z-20 w-preview preview-bg"
          >
            <div
              v-for="(roomData, index) in roomInfo"
              :key="index"
              class="flex flex-row bg-white w-full"
              :class="index < roomInfo.length - 1 && 'mb-11'"
            >
              <div class="w-image">
                <div class="relative w-full h-image">
                  <Icon
                    v-if="roomData.images.length > 1"
                    :icon="icon.arrowLeft"
                    color="text-white"
                    class="text-white absolute left-0 top-1/2 -mt-6 text-xl"
                    icon-width="50"
                    icon-height="50"
                  />
                  <img
                    class="w-full h-full h-image"
                    :src="
                      roomData.images.length
                        ? roomData.images[0].href
                        : 'https://skyticket.jp/hotel/images/no_image.png'
                    "
                    alt=""
                  />
                  <Icon
                    v-if="roomData.images.length > 1"
                    :icon="icon.arrowRight"
                    color="text-white"
                    class="text-white absolute right-0 top-1/2 -mt-6 text-xl"
                    icon-width="50"
                    icon-height="50"
                  />
                  <div
                    v-if="roomData.images.length > 1"
                    class="image-gallery-index text-font-preview"
                  >
                    1 / {{ roomData.images.length }}
                  </div>
                  <button
                    v-if="roomData.images.length > 1"
                    class="image-gallery-count text-white flex flex-col items-center justify-center"
                    @click="togglePreviewModal(index, false)"
                  >
                    <img
                      class="w-5 mt-0.5"
                      src="https://skyticket.jp/hotel/svg/picture-fff.svg"
                      alt=""
                    />
                    <p class="text-sm">
                      {{ roomData.images.length }}{{ $t('preview.count') }}
                    </p>
                  </button>
                </div>
                <div
                  v-if="roomData.images.length > 1"
                  class="flex flex-row space-x-4 items-center justify-center"
                >
                  <div
                    v-for="(image, roomIndex) in roomData.images"
                    :key="roomIndex"
                    :class="roomIndex === 0 ? 'selected' : 'no-selected'"
                  >
                    <img class="image-box" :src="image.href" alt="" />
                  </div>
                </div>
                <p class="pt-5 pl-5 pr-5 text-2xl mb-2 font-bold">
                  {{ roomData.name }}
                </p>
                <div class="w-full text-center">
                  <button
                    class="btn-service text-2xl font-bold py-3"
                    @click="togglePreviewModal(index, false)"
                  >
                    {{ $t('preview.roomInfo') }}
                  </button>
                </div>
              </div>
              <div class="p-5 flex flex-col max-w-content w-full">
                <p class="text-2xl font-bold">{{ planInfo.name }}</p>
                <div class="flex flex-row my-3">
                  <div v-if="roomInfo" class="flex flex-row items-center mr-4">
                    <img
                      v-if="!roomData.isSmoking"
                      src="https://skyticket.jp/hotel/svg/no_smoking.svg"
                      class="w-4 mr-2"
                      alt=""
                    />
                    <p class="font-bold">
                      {{
                        roomData.isSmoking
                          ? $t('preview.smoking')
                          : $t('preview.noSmoking')
                      }}
                    </p>
                  </div>
                  <div class="flex flex-row items-center">
                    <img
                      :src="`https://skyticket.jp/hotel/svg/${
                        foodText === $t('preview.noFood') ? 'no-' : ''
                      }meal.svg`"
                      class="w-4 mr-2"
                      alt=""
                    />
                    <p class="font-bold">{{ foodText }}</p>
                  </div>
                </div>
                <div class="mb-3">
                  <span class="cancel-tag">{{ $t('preview.freeCancel') }}</span>
                  <span class="cancel-date text-font-preview">{{
                    $t('preview.dateCancel')
                  }}</span>
                  <span class="red-bold">{{ $t('preview.restRoom') }}</span>
                </div>
                <div
                  v-if="planInfo.description.trim().length"
                  class="relative overflow-hidden"
                  :class="!isOpenContent[index] && 'h-13'"
                >
                  <img
                    v-if="planInfo.images.length"
                    class="w-plan-image"
                    :src="planInfo.images[0].href"
                    alt=""
                  />
                  <!-- eslint-disable -->
                  <div
                    class="whitespace-pre-line"
                    v-html="planInfo.description"
                  />
                  <div
                    v-if="!isOpenContent[index]"
                    class="top-0 left-0 absolute w-full h-full bg-gradient-to-t from-white to-transparent"
                  />
                  <!-- eslint-enable -->
                </div>
                <div
                  v-if="
                    planInfo.images.length && planInfo.description.trim().length
                  "
                  class="mt-3 w-full"
                >
                  <button
                    v-if="planInfo.description.trim().length > 78"
                    class="float-right btn-color"
                    @click="handleToggleContent(index)"
                  >
                    {{
                      isOpenContent[index]
                        ? $t('preview.closeContent')
                        : $t('preview.openContent')
                    }}
                  </button>
                </div>
                <div class="flex flex-row justify-end items-center">
                  <div class="text-right mt-4.5">
                    <p class="text-2xl font-bold text-font-preview">
                      <span class="font-light">¥</span>000000
                    </p>
                    <p class="text-sm mt-0.5">
                      {{ $t('preview.payment') }}
                    </p>
                  </div>
                  <button class="btn-book text-2xl font-bold py-3">
                    {{ $t('preview.book') }}
                  </button>
                </div>
              </div>
            </div>
          </div>
          <p class="ml-5">{{ $t('preview.previewInfo') }}</p>
        </div>
        <Btn
          color="blue"
          class="mt-8 mx-auto py-3 w-60"
          height="big"
          type="button"
          @click="closeModal"
        >
          {{ $t('alert.confirmButton') }}
        </Btn>
        <RoomInfoPreviewModal
          v-if="isOpenPreviewModal && selectedRoomShow"
          :room-info="selectedRoomShow"
          :is-open-preview-modal="isOpenPreviewModal"
          :close-preview-modal="togglePreviewModal"
          :amenity-list="amenityList"
        />
      </div>
    </div>
  </transition>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { mdiClose, mdiChevronLeft, mdiChevronRight } from '@mdi/js'
import { Plan, Room } from '~/types'

@Component({
  components: {
    IconBtn: () => import('~/components/atoms/IconBtn.vue'),
    Btn: () => import('~/components/atoms/Btn.vue'),
    Icon: () => import('~/components/atoms/Icon.vue'),
    RoomInfoPreviewModal: () =>
      import('~/components/organisms/preview/RoomInfoPreviewModal.vue'),
  },
})
export default class PlanPreviewModal extends Vue {
  @Prop({ required: true })
  closePreviewModal!: Function

  @Prop({ required: true })
  roomInfo!: Room.Detail[]

  @Prop({ required: true })
  planInfo!: Plan.Input

  @Prop({ required: true })
  isPlanPreviewModalOpen!: boolean

  @Prop({ required: true })
  amenityList!: { [id: string]: Room.Amenity }

  private isOpenContent: boolean[] = []
  private isOpenRoomInfo: boolean = false
  private isOpenPreviewModal: boolean = false
  private selectedRoomShow: Room.Detail | null = null
  private icon: { [key: string]: string } = {
    closeIcon: mdiClose,
    arrowLeft: mdiChevronLeft,
    arrowRight: mdiChevronRight,
  }

  updated() {
    if (this.isPlanPreviewModalOpen && !this.isOpenContent.length) {
      if (this.roomInfo && this.roomInfo.length) {
        this.isOpenContent = new Array(this.roomInfo.length).fill(true)
      }
    }
  }

  get foodText(): string {
    const {
      mealConditionBreakfast,
      mealConditionLunch,
      mealConditionDinner,
    } = this.planInfo
    if (mealConditionBreakfast && !mealConditionLunch && !mealConditionDinner) {
      return this.$t('preview.onlyBreakfast') as string
    } else if (
      mealConditionBreakfast &&
      mealConditionLunch &&
      !mealConditionDinner
    ) {
      return this.$t('preview.breakfastLunch') as string
    } else if (
      mealConditionBreakfast &&
      mealConditionLunch &&
      mealConditionDinner
    ) {
      return this.$t('preview.allFood') as string
    } else if (
      mealConditionBreakfast &&
      !mealConditionLunch &&
      mealConditionDinner
    ) {
      return this.$t('preview.breakfastDinner') as string
    } else if (
      !mealConditionBreakfast &&
      mealConditionLunch &&
      !mealConditionDinner
    ) {
      return this.$t('preview.onlyLunch') as string
    } else if (
      !mealConditionBreakfast &&
      !mealConditionLunch &&
      mealConditionDinner
    ) {
      return this.$t('preview.onlyDinner') as string
    } else if (
      !mealConditionBreakfast &&
      mealConditionLunch &&
      mealConditionDinner
    ) {
      return this.$t('preview.lunchDinner') as string
    }
    return this.$t('preview.noFood') as string
  }

  private closeModal(): void {
    this.scrollToTopModal()
    this.closePreviewModal()
    this.isOpenContent = []
  }

  private togglePreviewModal(roomIndex: number, close: boolean = false): void {
    if (!close) {
      this.selectedRoomShow = this.roomInfo[roomIndex]
    }
    this.isOpenPreviewModal = close ? false : !this.isOpenPreviewModal
  }

  private handleToggleContent(index: number): void {
    this.isOpenContent[index] = !this.isOpenContent[index]
    this.isOpenContent = [...this.isOpenContent]
  }

  private scrollToTopModal(): void {
    const scroll = document.getElementById('toTopId')
    if (!scroll) return
    scroll.scrollTop = 0
  }
}
</script>
<style lang="sass" scoped>
.preview-bg
  background-color: #F4F4F4
.fade-modal-enter-active, .fade-modal-leave-active
  transition: all 0.2s
.fade-modal-enter, .fade-modal-leave-to
  opacity: 0
.w-preview
  width: 1024px
.w-image
  width: 380px
  border-right: 1px solid rgb(228, 228, 228)
.h-image
  height: 250px
  object-fit: cover
  overflow: hidden
  width: 100%
.btn-service
  font-family: "ヒラギノ角ゴ ProN", "Hiragino Kaku Gothic ProN", メイリオ, Meiryo, sans-serif
  width: 220px
  border: 1px solid rgb(27, 161, 255)
  color: rgb(27, 161, 255)
  margin: 20px auto
  border-radius: 3px
.btn-book
  font-family: "ヒラギノ角ゴ ProN", "Hiragino Kaku Gothic ProN", メイリオ, Meiryo, sans-serif
  width: 220px
  background-color: #ffc11c
  color: #222
  border-radius: 3px
  margin: 12px 0 0 20px
.w-plan-image
  float: left
  margin-right: 20px
  width: 220px
  height: 140px
  object-fit: cover
.max-w-content
  max-width: 620px
.btn-color
  color: rgb(27, 161, 255)
  line-height: 1
  text-decoration: underline
.text-font-preview
  font-family: "ヒラギノ角ゴ ProN", "Hiragino Kaku Gothic ProN", メイリオ, Meiryo, sans-serif
.cancel-tag
  display: inline-block
  background-color: rgb(28, 93, 181)
  border-radius: 3px
  color: rgb(255, 255, 255)
  width: 104px
  font-size: 12px
  text-align: center
  flex: 0 0 104px
.cancel-date
  align-self: center
  color: rgb(28, 93, 181)
  display: inline-flex
  font-size: 12px
  margin-left: 8px
.red-bold
  color: rgb(255, 29, 28)
  font-weight: bold
.room-info-modal
  background-color: rgb(255, 255, 255)
  display: flex
  flex-direction: column
  height: 100vh
  padding: 16px
  position: fixed
  width: 540px
.image-gallery-index
  background: rgba(0,0,0,.4)
  color: #fff
  line-height: 1
  padding: 10px 20px
  position: absolute
  right: 0
  top: 0
.image-gallery-count
  position: absolute
  bottom: 12px
  right: 12px
  width: 60px
  height: 38px
  border-radius: 3px
  background-color: rgba(255, 255, 255, 0.4)
  display: flex
  justify-content: center
.image-box
  box-sizing: content-box
  display: inline-block
  height: 50px
  position: relative
  object-fit: cover
  vertical-align: top
  width: 70px
.selected
  border: 4px solid rgb(28, 93, 181)
  margin: 8px 4px
.no-selected
  border: 4px solid rgba(0, 0, 0, 0)
  margin: 8px 4px
</style>
