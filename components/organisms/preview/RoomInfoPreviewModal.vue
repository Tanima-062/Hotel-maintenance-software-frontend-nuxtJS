<template>
  <transition name="fade-modal">
    <div class="fixed z-50">
      <div class="fixed inset-0 z-10 opacity-70 bg-black-dark" />
      <div
        id="toTopId"
        class="inset-0 fixed overflow-auto h-screen py-18 top-0 left-0 z-40 flex flex-col"
        @click.self="closeModal"
      >
        <div
          v-if="roomInfo"
          class="relative m-auto room-info-modal"
          :class="isOpenPreviewModal ? 'open-modal' : 'close-modal'"
        >
          <div class="flex flex-row items-center justify-center">
            <p class="w-full text-3xl font-bold text-font-preview">
              {{ $t('preview.roomInfo') }}
            </p>
            <IconBtn
              :icon="icon.closeIcon"
              color="text-black"
              class="text-black"
              hover-color="text-black"
              icon-width="30"
              icon-height="30"
              @click="closeModal"
            />
          </div>
          <p class="text-2xl font-bold bottom-divider text-font-preview">
            {{ roomInfo.name }}
          </p>
          <div class="overflow-box">
            <div class="relative w-full h-image">
              <Icon
                v-if="roomInfo.images.length > 1"
                :icon="icon.arrowLeft"
                color="text-white"
                class="text-white absolute left-0 top-1/2 -mt-6 text-xl"
                icon-width="50"
                icon-height="50"
              />
              <img
                class="w-full h-full h-image"
                :src="
                  roomInfo.images.length
                    ? roomInfo.images[0].href
                    : 'https://skyticket.jp/hotel/images/no_image.png'
                "
                alt=""
              />
              <Icon
                v-if="roomInfo.images.length > 1"
                :icon="icon.arrowRight"
                color="text-white"
                class="text-white absolute right-0 top-1/2 -mt-6 text-xl"
                icon-width="50"
                icon-height="50"
              />
              <div class="image-gallery-index text-font-preview">
                1 / {{ roomInfo.images.length }}
              </div>
              <div
                v-if="roomInfo.images.length > 1"
                class="image-gallery-index text-font-preview"
              >
                1 / {{ roomInfo.images.length }}
              </div>
              <button
                v-if="roomInfo.images.length > 1"
                class="image-gallery-count text-white flex flex-col items-center justify-center"
                @click="togglePreviewModal(false)"
              >
                <img
                  class="w-5 mt-0.5"
                  src="https://skyticket.jp/hotel/svg/picture-fff.svg"
                  alt=""
                />
                <p class="text-sm">
                  {{ roomInfo.images.length }}{{ $t('preview.count') }}
                </p>
              </button>
            </div>
            <div class="flex flex-row space-x-4 items-center justify-center">
              <div
                v-for="(image, index) in roomInfo.images"
                :key="index"
                :class="index === 0 ? 'selected' : 'no-selected'"
              >
                <img class="image-box" :src="image.href" alt="" />
              </div>
            </div>
            <div class="text-font-preview mt-2.5">
              <div
                v-if="roomInfo.amenityIdList && roomInfo.amenityIdList.length"
              >
                <p class="font-bold text-2xl mb-2">
                  {{ $t('preview.amenityAndService') }}
                </p>
                <ul>
                  <li
                    v-for="(amenity, index) in roomInfo.amenityIdList"
                    :key="index"
                    class="mb-1"
                  >
                    {{ amenityList[amenity] ? amenityList[amenity].name : '' }}
                  </li>
                </ul>
              </div>
              <div v-if="roomInfo.roomDesc && roomInfo.roomDesc.trim().length">
                <p class="font-bold text-2xl mb-1.5 mt-4">
                  {{ $t('preview.roomDesc') }}
                </p>
                <!-- eslint-disable -->
                <div class="whitespace-pre-line" v-html="roomInfo.roomDesc" />
                <!-- eslint-enable -->
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { mdiClose, mdiChevronLeft, mdiChevronRight } from '@mdi/js'
import { Room } from '~/types'

@Component({
  components: {
    IconBtn: () => import('~/components/atoms/IconBtn.vue'),
    Btn: () => import('~/components/atoms/Btn.vue'),
    Icon: () => import('~/components/atoms/Icon.vue'),
  },
})
export default class RoomInfoPreviewModal extends Vue {
  @Prop({ required: true })
  closePreviewModal!: Function

  @Prop({ required: true })
  isOpenPreviewModal!: boolean

  @Prop({ required: true })
  roomInfo!: Room.Detail

  @Prop({ required: true })
  amenityList!: { [id: string]: Room.Amenity }

  private icon: { [key: string]: string } = {
    closeIcon: mdiClose,
    arrowLeft: mdiChevronLeft,
    arrowRight: mdiChevronRight,
  }

  private closeModal(): void {
    this.closePreviewModal(true)
  }
}
</script>
<style lang="sass" scoped>
.h-image
  height: 250px
  object-fit: cover
  overflow: hidden
  width: 100%
.text-font-preview
  font-family: "ヒラギノ角ゴ ProN", "Hiragino Kaku Gothic ProN", メイリオ, Meiryo, sans-serif
.room-info-modal
  background-color: rgb(255, 255, 255)
  display: flex
  flex-direction: column
  height: 100vh
  padding: 16px
  position: fixed
  right: 0
  top: 0
  width: 540px
.bottom-divider
  border-bottom: 1px solid rgb(151, 151, 151)
  padding-bottom: 16px
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
.overflow-box
  height: 100%
  overflow: scroll
  padding-top: 20px
.image-gallery-index
  background: rgba(0,0,0,.4)
  color: #fff
  line-height: 1
  padding: 10px 20px
  position: absolute
  right: 0
  top: 0
</style>
