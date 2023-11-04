<template>
  <div :class="styles">
    <svg
      class="w-7 h-7 fill-current"
      :class="`${color}`"
      :style="`width: ${iconWidth}px; height: ${iconHeight}px`"
      :viewBox="`0 0 24 24`"
    >
      <path :d="icon" />
    </svg>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'nuxt-property-decorator'

@Component
export default class extends Vue {
  @Prop({ default: '' })
  icon!: string

  @Prop({ default: 'text-white' })
  color!: string

  @Prop({ default: '' })
  bgColor!: string

  @Prop({ default: false })
  round!: boolean

  @Prop({ default: 24 })
  iconWidth!: number

  @Prop({ default: 24 })
  iconHeight!: number

  @Prop({ default: '' })
  extraClass!: string

  get styles(): string {
    const classList = []
    if (this.bgColor) {
      classList.push(`${this.bgColor}`)
    }
    if (this.round) {
      classList.push('rounded-full')
    }
    if (this.extraClass) {
      classList.push(this.extraClass)
    }
    return classList.join(' ')
  }
}
</script>
