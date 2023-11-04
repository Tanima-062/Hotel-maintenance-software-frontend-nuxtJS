<template>
  <div class="rounded-full select-none" :class="styles">
    <slot />

    <IconBtn
      v-if="isClear"
      class="ml-2"
      :icon="icon.close"
      :bg-color="bgColor"
      :round="rounded"
      :icon-width="iconWidth"
      :icon-height="iconHeight"
      @click="click"
    />
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop, Emit } from 'nuxt-property-decorator'
import { mdiClose } from '@mdi/js'

@Component({
  components: {
    IconBtn: () => import('~/components/atoms/IconBtn.vue'),
  },
})
export default class extends Vue {
  @Prop({ default: 'text-white' })
  color!: string

  @Prop({ default: false })
  outline!: boolean

  @Prop({ default: false })
  isClear!: boolean

  @Prop({ default: 'bg-black-dark' })
  bgColor!: string

  @Prop({ default: 24 })
  iconWidth!: number

  @Prop({ default: 24 })
  iconHeight!: number

  @Prop({ default: true })
  rounded!: boolean

  private icon: { [key: string]: string } = {
    close: mdiClose,
  }

  get styles(): string {
    if (!this.outline) return 'text-black bg-badge-bg'

    switch (true) {
      case this.color === 'blue':
        return 'border border-solid border-tagColor-blue text-tagColor-blue'
      case this.color === 'green':
        return 'border border-solid border-tagColor-green text-tagColor-green'
      case this.color === 'yellow':
        return 'border border-solid border-tagColor-yellow text-tagColor-yellow'
      case this.color === 'red':
        return 'border border-solid border-tagColor-red text-tagColor-red'
      case this.color === 'cancel':
        return 'border border-solid border-tagColor-cancel text-tagColor-cancel'
      default:
        return 'border-tagColor text-tagColor'
    }
  }

  @Emit()
  private click(e: Event): Event {
    return e
  }
}
</script>
