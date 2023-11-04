<template>
  <validation-provider
    v-slot="{ errors }"
    tag="div"
    :rules="rules"
    :name="name"
  >
    <div
      class="flex-1"
      :class="`${width} ${height}`"
      @dragover.prevent="isHover = true"
      @dragleave.prevent="isHover = false"
      @drop.prevent="drop"
    >
      <div
        class="rounded border-2 flex items-center justify-center flex-col transition-all duration-200 ease-in-out"
        :class="styles"
      >
        <Icon
          class="mb-1"
          :color="isHover ? 'text-white' : 'text-tagColor'"
          :icon="wallpaperIcon"
          :icon-width="iconWidth"
          :icon-height="iconHeight"
        />
        <div>
          <span class="text-alert" :class="fontStyle"> {{ navStar }} </span>
          <span class="text-center text-black mb-5">
            {{ navTitle }}
          </span>
        </div>
        <p class="text-center text-black-light" :class="fontStyle">
          {{ navText }}
        </p>
        <ErrorText :err-text="errors[0]" />
        <Btn
          v-if="btn"
          color="blue"
          height="py-2"
          class="mt-3"
          :class="btnWidth"
          @click="click"
        >
          {{ btnText }}
        </Btn>
        <input
          ref="input"
          type="file"
          class="hidden"
          :error="!!errors[0]"
          accept="image/jpeg,image/jpg,image/png"
          @change="change"
        />
        <div>{{ errors[0] }}</div>
      </div>
    </div>
  </validation-provider>
</template>
<script lang="ts">
import { Component, Prop, mixins, Emit } from 'nuxt-property-decorator'
import { mdiWallpaper } from '@mdi/js'
import { Global } from '~/types'
import alert from '~/mixins/alert'

@Component({
  components: {
    Icon: () => import('~/components/atoms/Icon.vue'),
    Btn: () => import('~/components/atoms/Btn.vue'),
    ErrorText: () => import('~/components/atoms/ErrorText.vue'),
  },
})
export default class extends mixins(alert) {
  @Prop({ default: 'w-60' })
  width!: string

  @Prop({ default: 'h-40' })
  height!: string

  @Prop({ default: '' })
  navStar!: string

  @Prop({ default: '' })
  navTitle!: string

  @Prop({ default: '' })
  navText!: string

  @Prop({ default: false })
  btn!: boolean

  @Prop({ default: '' })
  btnText!: string

  @Prop({ default: '' })
  btnWidth!: string

  @Prop({ default: '' })
  iconWidth!: string

  @Prop({ default: '' })
  iconHeight!: string

  @Prop({ default: 'text-sm' })
  fontSize!: string

  @Prop({ default: { name: '', src: '' } })
  previewFile!: Global.FileType

  @Prop({ default: '' })
  name!: string

  @Prop({ default: '' })
  rules!: string

  @Prop({ default: false })
  error!: boolean

  private isFocus: boolean = false

  private wallpaperIcon: string = mdiWallpaper
  private isHover: boolean = false

  private isEnter: boolean = false

  get styles(): string {
    const classList = []
    classList.push(this.width)
    classList.push(this.height)
    classList.push(this.isHover ? 'bg-bdColor' : '')
    classList.push(
      this.error ? 'border-alert bg-error' : 'border-dashed border-bdColor'
    )
    return classList.join(' ')
  }

  get fontStyle(): string {
    const classList = []
    classList.push(this.isHover ? 'text-white' : 'text-black-light')
    classList.push(this.fontSize)
    return classList.join(' ')
  }

  private click() {
    const ref = this.$refs.input as HTMLInputElement
    ref.click()
  }

  @Emit()
  private drop(
    e: Event & { dataTransfer: DataTransfer; target: HTMLInputElement }
  ): File | null {
    this.isHover = false
    const files = e.target.files || e.dataTransfer.files
    const file = files[0]
    const FileType = ['image/jpeg', 'image/png', 'image/jpeg']
    if (file && !FileType.includes(file.type)) {
      this.mixinAlert(
        'error',
        this.$t('album.mixinAlert.title') as string,
        this.$t('album.mixinAlert.notUpload') as string
      )
      return null
    }
    return file
  }

  @Emit()
  private change(
    e: Event & { dataTransfer: DataTransfer; target: HTMLInputElement }
  ): File {
    const files = e.target.files || e.dataTransfer.files
    const file = files[0]
    return file
  }
}
</script>
