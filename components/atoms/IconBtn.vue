<template>
  <button
    type="button"
    class="flex h-fit-content items-center justify-center"
    :class="styles"
    :disabled="disabled"
    @click="click"
  >
    <svg
      class="w-7 h-7 fill-current"
      :class="`${color} hover:${hoverColor}`"
      :style="`width: ${iconWidth}px; height: ${iconHeight}px`"
      viewBox="0 0 24 24"
    >
      <path :d="icon" />
    </svg>
  </button>
</template>
<script lang="ts">
import { Vue, Component, Prop, Emit } from 'nuxt-property-decorator'

@Component
export default class extends Vue {
  @Prop({ default: '' })
  icon!: string

  @Prop({ default: 'text-white' })
  color!: string

  @Prop({ default: 'text-white' })
  hoverColor!: string

  @Prop({ default: false })
  disabled!: boolean

  @Prop({ default: false })
  round!: boolean

  @Prop({ default: '' })
  bgColor!: string

  @Prop({ default: '' })
  padding!: string

  @Prop({ default: 24 })
  iconWidth!: number

  @Prop({ default: 24 })
  iconHeight!: number

  @Prop({ default: '' })
  extraClass!: string

  private isAnim: boolean = false
  private interval: number | undefined

  get styles(): string {
    const classList = []

    classList.push(this.isAnim ? 'btn--click' : 'btn')
    if (this.disabled) {
      classList.push('cursor-not-allowed')
    }
    if (this.round) {
      classList.push('rounded-full')
    } else if (!this.extraClass.includes('rounded-sm')) {
      classList.push('rounded-md')
    }
    classList.push(this.bgColor ? `${this.bgColor} opacity-75` : 'opacity-85')
    if (this.padding) {
      classList.push(`${this.padding}`)
    }
    if (this.extraClass) {
      classList.push(this.extraClass)
    }
    return classList.join(' ')
  }

  private doAnim(): void {
    if (this.isAnim || this.interval) {
      return
    }
    this.isAnim = true
    this.interval = window.setInterval(() => {
      this.isAnim = false
      clearInterval(this.interval)
      this.interval = undefined
    }, 130)
  }

  @Emit()
  private click(e: Event): Event {
    this.doAnim()
    return e
  }
}
</script>
<style lang="sass" scoped>
.btn
  transition: opacity .1s ease-in
  &:hover
    transition: opacity .2s cubic-bezier(.4,0,.6,1)
    opacity: 1
  &--click
    transition: opacity .05s ease-out
    opacity: .7
.h-fit-content
  height: fit-content
</style>
