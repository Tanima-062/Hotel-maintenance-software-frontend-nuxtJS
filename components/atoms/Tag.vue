<template>
  <div
    class="border border-solid rounded-md select-none"
    :class="`${outlineColor} ${py} ${textSize} ${fontWeight} ${padding} ${clickablePointer}`"
    @click="click"
    @mousedown="mousedown"
  >
    <slot />
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop, Emit } from 'nuxt-property-decorator'

@Component
export default class extends Vue {
  @Prop({ default: 'white' })
  color!: string

  @Prop({ default: 'py-0.5' })
  py!: string

  @Prop({ default: 'text-sm' })
  textSize!: string

  @Prop({ default: 'font-hairline' })
  fontWeight!: string

  @Prop({ default: 'px-2' })
  padding!: string

  @Prop({ default: false })
  clickable!: boolean

  get clickablePointer(): string {
    return this.clickable ? 'cursor-pointer' : ''
  }

  get outlineColor(): string {
    switch (true) {
      case this.color === 'blue':
        return 'border-tagColor-blue text-tagColor-blue'
      case this.color === 'green':
        return 'border-tagColor-green text-tagColor-green'
      case this.color === 'yellow':
        return 'border-tagColor-yellow text-tagColor-yellow'
      case this.color === 'red':
        return 'border-tagColor-red text-tagColor-red'
      case this.color === 'cancel':
        return 'border-tagColor-cancel text-tagColor-cancel'
      case this.color === 'purple':
        return 'border-tagColor-purple text-tagColor-purple'
      default:
        return 'border-tagColor text-tagColor'
    }
  }

  @Emit()
  private click(e: Event): Event {
    return e
  }

  @Emit()
  private mousedown(e: Event): Event {
    return e
  }
}
</script>
