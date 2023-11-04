<template>
  <div class="grid grid-cols-4 gap-4 justify-center">
    <div v-for="(image, index) in imagesList" :key="index" class="relative">
      <Picture
        :image-id="index"
        width="w-60"
        height="h-40"
        :class="`mb-1 cursor-pointer ${isDuplicateImage(image.imageId)}`"
        :draggable="false"
        :href="image.href"
        :is-clear="true"
        :is-images-count="isShowCount"
        :images-count="index + 1"
        :show-count-top="true"
        @clear="removeImage"
        @click-image="toggleImageModal(index, image.image_id)"
        :isViewMode="isViewMode"
      />
      <p class="text-black h-4 text-xs truncate">
        {{ image.caption }}
      </p>
    </div>
    <div
      v-if="imagesList.length < imageLimit && !isViewMode"
      class="w-60 h-40 border border-bdColor round-lg cursor-pointer border-dashed rounded-lg flex justify-cener"
      @click="toggleImageModal()"
    >
      <div class="flex flex-col m-auto items-center">
        <Icon
          :icon="plusCircleIcon"
          color="text-imageColor"
          :icon-width="33"
          :icon-height="33"
        />
        <p class="text-sm text-black-light">
          {{ $t('room.addImageBox') }}
        </p>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Emit } from 'vue-property-decorator'
import { mdiPlusCircleOutline } from '@mdi/js'
import { Room, Plan } from '~/types'

@Component({
  components: {
    Picture: () => import('~/components/molecules/Picture.vue'),
    Icon: () => import('~/components/atoms/Icon.vue'),
  },
})
export default class extends Vue {
  @Prop({ default: [] })
  imagesList!: Room.Image[] | Plan.Image[]

  @Prop({ default: [] })
  duplicateImages!: number[]

  @Prop({ default: 10 })
  imageLimit!: number

  @Prop({ default: true })
  isShowCount!: boolean

  @Prop()
  removeImage!: Function

  @Prop({ default: false })
  isViewMode!: boolean

  private plusCircleIcon: string = mdiPlusCircleOutline

  private isDuplicateImage(imageId: number): string {
    if (this.duplicateImages.includes(imageId)) return 'border-3 border-alert'
    return ''
  }

  @Emit()
  private toggleImageModal(
    indexPos: number = -1,
    imageId: number = 0
  ): { open: boolean; indexPos: number; imageId: number } {
    return { open: true, indexPos, imageId }
  }
}
</script>
