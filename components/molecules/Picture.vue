<template>
  <transition-group
    tag="div"
    name="picture"
    class="relative bg-black"
    :class="`${width} ${round}`"
  >
    <div
      :key="imageId + '-div'"
      :draggable="draggable"
      :class="`${isHoverPict} ${round}`"
      @dragstart="fDragstart"
      @dragover.prevent="isHover = true"
      @dragleave="isHover = false"
      @dragend="isHover = false"
      @drop.stop="drop"
    >
      <img
        :key="imageId + '-image'"
        :src="imageSrc"
        :class="`${width} ${height} ${round}`"
        draggable="false"
        @error="imageError = true"
        @click.self="clickImage"
      />
    </div>

    <div
      v-if="isImagesCount"
      :key="imageId + '-isImagesCount'"
      :class="countStyle"
    >
      <Icon
        v-if="!showCountTop"
        :icon="icon.image"
        icon-width="12"
        icon-height="12"
        class="mr-1"
      />
      <p
        :class="`text-white ${showCountTop ? 'text-lg' : 'text-sm'} leading-3`"
      >
        {{ imagesCount }}
      </p>
    </div>

    <div
      v-if="isMain"
      :key="imageId + '-isMain'"
      class="absolute top-0 left-0 border-3 border-solid border-alert bg-black bg-opacity-50"
      :class="`${width} ${height} ${round}`"
    >
      <div
        class="bg-alert rounded-br-lg absolute top-0 left-0 text-white py-1 px-2"
        :class="isNotRounded ? '' : 'rounded-br-lg'"
      >
        メイン{{ mainNumber }}
      </div>
    </div>
    <div
      v-if="isChecked"
      :key="imageId + '-isChecked'"
      class="absolute top-0 left-0 border-3 border-solid border-alert"
      :class="`${width} ${height} ${round}`"
    >
      <Icon
        class="absolute top-0 right-0 mr-2 mt-2 p-1"
        :icon="icon.check"
        bg-color="bg-alert"
        icon-width="12"
        icon-height="12"
        :round="true"
      />
    </div>
    <IconBtn
      v-if="isClear && !isViewMode"
      :key="imageId + '-isClear'"
      class="absolute top-0 right-0 mr-2 mt-2"
      :icon="icon.close"
      bg-color="bg-black-dark"
      :round="true"
      @click="clear"
    />
  </transition-group>
</template>
<script lang="ts">
import { Component, Prop, Vue, Emit } from 'nuxt-property-decorator'
import { mdiClose, mdiCheck, mdiImageOutline } from '@mdi/js'

@Component({
  components: {
    IconBtn: () => import('~/components/atoms/IconBtn.vue'),
    Icon: () => import('~/components/atoms/Icon.vue'),
  },
})
export default class extends Vue {
  @Prop({ default: '' })
  imageId!: string

  @Prop({ default: '' })
  href!: string

  @Prop({ default: 'w-60' })
  width!: string

  @Prop({ default: 'h-40' })
  height!: string

  @Prop({ default: false })
  isClear!: boolean

  @Prop({ default: false })
  isMain!: boolean

  @Prop({ default: 1 })
  mainNumber!: number

  @Prop({ default: false })
  isChecked!: boolean

  @Prop({ default: true })
  draggable!: boolean

  @Prop({ default: '' })
  dragDataPrefix!: string

  @Prop({ default: false })
  isNotRounded!: boolean

  @Prop({ default: false })
  isImagesCount!: boolean

  @Prop({ default: 0 })
  imagesCount!: number

  @Prop({ default: false })
  showCountTop!: boolean

  @Prop({ default: false })
  isViewMode!: boolean

  private imageError: boolean = false
  private isHover: boolean = false
  private icon: { [key: string]: string } = {
    close: mdiClose,
    check: mdiCheck,
    image: mdiImageOutline,
  }

  get style(): string {
    const classList = []
    classList.push(this.isHover ? '' : '')
    classList.push(this.width)
    classList.push(this.height)
    return classList.join(' ')
  }

  get countStyle(): string {
    if (this.showCountTop) {
      return 'absolute top-0 left-0 p-2 rounded-br-md rounded-tl-md bg-opacity-50 bg-black-dark'
    } else {
      return 'absolute bottom-0 right-0 mr-3 mb-2 flex items-center justify-cener p-2 rounded-md bg-opacity-50 bg-black-dark'
    }
  }

  get round(): string {
    return this.isNotRounded ? '' : 'rounded-lg'
  }

  get isHoverPict(): string {
    return this.isHover ? 'opacity-50' : ''
  }

  get imageSrc(): string {
    return this.imageError ? '/images/no_image.png' : this.href
  }

  private fDragstart(event: Event & { dataTransfer: DataTransfer }): void {
    event.dataTransfer.setData(
      'text/plain',
      `${this.dragDataPrefix}${this.imageId}`
    )
  }

  @Emit()
  private clear(): string {
    return this.imageId
  }

  @Emit()
  clickImage(): void {}

  @Emit()
  private drop(event: Event & { dataTransfer: DataTransfer }): Object {
    this.isHover = false
    const data = event.dataTransfer.getData('text/plain')

    event.dataTransfer.clearData()
    return {
      from: data,
      to: this.imageId,
    }
  }
}
</script>
<style lang="sass" scoped>
.picture-enter-active
  transition: opacity .2s

.picture-enter, .picture-leave-to
  opacity: 0
</style>
