<template>
  <button
    type="button"
    class="flex justify-center items-center leading-5 whitespace-no-wrap"
    :class="styleColor"
    @click="click"
    @mouseover="mouseover"
    @mouseleave="mouseleave"
  >
    <slot />
  </button>
</template>
<script lang="ts">
import { Vue, Component, Prop, Emit } from 'nuxt-property-decorator'

@Component
export default class extends Vue {
  @Prop({ default: 'text-black' })
  textColor!: string

  @Prop({ default: false })
  isActive!: boolean

  private isAnim: boolean = false
  private interval: number | undefined

  get styleColor(): string {
    const classList = []
    // click時のボタン
    classList.push(this.isPushed ? 'btn--click' : 'btn')

    // テキスト文字の切り替え
    classList.push(this.textColor)

    // 背景色の切り替え
    classList.push(this.isPushed ? 'bg-menuColor-hover font-bold' : '')

    return classList.join(' ')
  }

  get isPushed(): boolean {
    return this.isAnim || this.isActive
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
    }, 150)
  }

  @Emit()
  private click(e: Event): Event {
    this.doAnim()
    return e
  }

  @Emit()
  mouseover(e: Event): Event {
    return e
  }

  @Emit()
  mouseleave(e: Event): Event {
    return e
  }
}
</script>
<style lang="sass" scoped>
.btn
  transition: background-color .3s ease-in
  &:hover
    transition: opacity .1s cubic-bezier(.4,0,.6,1)
    opacity:.9
  &--click
    transition: background-color .15s ease
</style>
