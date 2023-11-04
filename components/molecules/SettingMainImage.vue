<template>
  <div
    class="rounded border-2 border-dashed border-bdColor flex items-center justify-center flex-col transition-all duration-200 ease-in-out"
    :class="styles"
    @dragover.prevent="isHover = true"
    @dragleave="isHover = false"
    @drop.stop="drop"
  >
    <Icon
      class="mb-1"
      :color="isHover ? 'text-white' : 'text-tagColor'"
      :icon="wallpaperIcon"
      :icon-width="33"
      :icon-height="33"
    />
    <p
      class="text-sm text-center"
      :class="isHover ? 'text-white' : 'text-black-light'"
    >
      {{ $t('album.mainImageSection.DropZoneFirstLine') }}<br />{{
        $t('album.mainImageSection.DropZoneSecondLine')
      }}
    </p>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Emit } from 'nuxt-property-decorator'

import { mdiWallpaper } from '@mdi/js'
@Component({
  components: {
    IconBtn: () => import('~/components/atoms/IconBtn.vue'),
    Icon: () => import('~/components/atoms/Icon.vue'),
  },
})
export default class extends Vue {
  @Prop({ default: 'w-60' })
  width!: string

  @Prop({ default: 'h-40' })
  height!: string

  private wallpaperIcon: string = mdiWallpaper
  private isHover: boolean = false

  get styles(): string {
    const classList = []
    classList.push(this.width)
    classList.push(this.height)
    classList.push(this.isHover ? 'bg-bdColor' : '')
    return classList.join(' ')
  }

  @Emit()
  private drop(event: Event & { dataTransfer: DataTransfer }): number {
    this.isHover = false
    const imageId = Number(event.dataTransfer.getData('text/plain'))
    event.dataTransfer.clearData()
    if (imageId && !Number.isNaN(imageId)) {
      return imageId
    }
    return 0
  }
}
</script>
