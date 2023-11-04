<template>
  <transition name="fade-modal">
    <div
      v-if="isOpen"
      class="fixed top-0 left-0 flex items-center justify-center w-full h-full"
    >
      <div class="w-image-modal p-5 bg-white z-20 flex flex-col rounded-md">
        <div class="w-full mb-2 flex items-center justify-between">
          <p class="text-base text-black-dark font-bold">
            {{
              isPlan ? $t('plan.label.modalTitle') : $t('room.imageModal.title')
            }}
          </p>
          <IconBtn
            :icon="closeIcon"
            hover-color="text-black-dark"
            color="text-black-dark"
            @click="toggleImageModal"
          />
        </div>
        <p class="text-xs text-black mb-3">
          {{ isPlan ? $t('plan.label.modalDesc') : $t('room.imageModal.desc') }}
        </p>
        <div
          v-if="isPlan"
          class="flex flex-row border-t border-l border-r border-bdColor"
        >
          <div
            v-for="(category, keyCat) in imageCategory"
            :key="category"
            :class="`flex-grow text-center border-r border-bdColor py-3 cursor-pointer ${
              keyCat === tabSelectedIndex ? 'bg-btnColor' : 'bg-tabBgColor'
            } last:border-none`"
            @click="changeTabCategory(keyCat)"
          >
            <p
              :class="`text-sm ${
                keyCat === tabSelectedIndex ? 'text-white' : 'text-black'
              }`"
            >
              {{ category }}({{ categoryCount(keyCat) }})
            </p>
          </div>
        </div>
        <div
          class="h-image-panel border border-bdColor p-3"
          :class="`${
            updateImageList.length &&
            'grid grid-cols-5 auto-rows-min overflow-auto gap-4'
          }`"
        >
          <div
            v-if="!updateImageList.length"
            class="w-full h-full flex items-center justify-content"
          >
            <div class="flex flex-col m-auto items-center justify-content">
              <Icon
                :icon="imageOffIcon"
                color="text-bdColor"
                class="mb-1"
                :icon-width="40"
                :icon-height="40"
              />
              <p class="text-black-light">{{ $t('plan.label.noImage') }}</p>
            </div>
          </div>
          <div
            v-for="image in updateImageList"
            :key="image.id"
            :class="!isCanSelectImage && 'cursor-pointer'"
            @click="!isCanSelectImage && selectImage(image)"
          >
            <Picture
              :image-id="image.id"
              width="w-full"
              height="h-32"
              class="mb-1"
              :draggable="false"
              :href="image.href"
              :is-clear="false"
              :is-checked="currentImageId === image.id"
            />
            <p class="text-black truncate text-xs mb-2">
              {{ image.caption }}
            </p>
          </div>
        </div>
      </div>
      <div
        class="absolute top-0 left-0 opacity-40 bg-overlayColor w-full h-full z-10"
        @click="toggleImageModal"
      />
    </div>
  </transition>
</template>
<script lang="ts">
import { Component, Vue, Prop, Emit } from 'vue-property-decorator'
import { mdiClose, mdiImageOff } from '@mdi/js'
import { ROOM_IMAGE_TYPE, IMAGE_CATEGORY } from '~/utils/const'
import { ImageManage } from '~/types'

@Component({
  components: {
    Icon: () => import('~/components/atoms/Icon.vue'),
    IconBtn: () => import('~/components/atoms/IconBtn.vue'),
    Picture: () => import('~/components/molecules/Picture.vue'),
  },
})
export default class extends Vue {
  @Prop({ default: false })
  isOpen!: boolean

  @Prop({ default: [] })
  imagesList!: ImageManage.Main[]

  @Prop({ required: true })
  currentImageSelected!: number

  @Prop({ required: true })
  currentImageId!: number

  @Prop({ default: false })
  isPlan!: boolean

  private closeIcon: string = mdiClose
  private imageOffIcon: string = mdiImageOff
  private tabSelectedIndex: string = ROOM_IMAGE_TYPE
  private imageCategory = IMAGE_CATEGORY
  private isSelectedImage = false

  private changeTabCategory(category: string): void {
    this.tabSelectedIndex = category
  }

  get updateImageList(): ImageManage.Main[] {
    const category = this.isPlan ? this.tabSelectedIndex : ROOM_IMAGE_TYPE
    return this.imagesList.filter((image) => image.category === category)
  }

  private categoryCount(keyCat: string): number {
    const catCount = this.imagesList.filter(
      (image) => image.category === keyCat
    )
    return catCount.length
  }

  // 画像が選択フラグを確認
  get isCanSelectImage(): boolean {
    if (this.isOpen) this.isSelectedImage = false
    return this.isSelectedImage
  }

  @Emit()
  private toggleImageModal(): boolean {
    return false
  }

  @Emit()
  private selectImage(
    image: ImageManage.Main
  ): { image: ImageManage.Main; indexPos: number } {
    this.isSelectedImage = true
    image.sortNum = this.currentImageSelected
    return { image, indexPos: this.currentImageSelected }
  }
}
</script>
<style lang="sass" scoped>
.w-image-modal
  width: 900px
.h-image-panel
  height: 460px
.fade-modal-enter-active, .fade-modal-leave-active
  transition: all 0.4s
.fade-modal-enter, .fade-modal-leave-to
  opacity: 0
</style>
