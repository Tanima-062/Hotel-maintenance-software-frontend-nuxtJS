<template>
  <button
    :type="type"
    :tabindex="tabindex"
    class="flex justify-center items-center leading-5 outline-none focus:outline-none rounded-md transition-all duration-300 ease-in-out"
    :class="styleColor"
    @click="clickEvent"
    @mouseover="mouseover"
    @mouseleave="mouseleave"
  >
    <slot />
  </button>
</template>
<script lang="ts">
import { Prop, Vue, Component, Emit } from 'nuxt-property-decorator'

@Component
export default class extends Vue {
  @Prop({ default: 'button' })
  type!: string

  @Prop({ default: false })
  outline!: boolean

  @Prop({ default: 'blue' })
  color!: string

  @Prop({ default: 'black' })
  textColor!: string

  @Prop({ default: '' })
  height!: string

  @Prop({ default: false })
  isActive!: boolean

  @Prop({ default: false })
  isDisabled!: boolean

  @Prop({ default: false })
  isNotFocusLine!: boolean

  private isAnim: boolean = false
  private tabindex: number = 0

  get styleColor(): string {
    const classList = []

    if (this.outline) {
      classList.push('border border-solid')
    }

    // hoverとcursor
    this.switchHoverAndCusor(classList)

    // 文字と背景色の切り替え
    this.switchColor(classList)

    // 高さ設定
    this.switchHeight(classList)

    return classList.join(' ')
  }

  get isPushed(): boolean {
    return this.isAnim || this.isActive
  }

  private switchHoverAndCusor(classList: string[]): void {
    if (this.isDisabled) {
      classList.push('cursor-not-allowed ')
      this.tabindex = -1
    } else if (this.isPushed) {
      classList.push('cursor-default')
    } else if (!this.isNotFocusLine) {
      classList.push('focus:shadow-outline')
    }
  }

  private switchColor(classList: string[]): void {
    switch (true) {
      case !this.outline && this.color === 'blue':
        // ボタンdisabled時
        if (this.isDisabled) {
          classList.push('bg-btnColor-default__disabled text-white')
        } else {
          classList.push(
            'bg-btnColor text-white hover:bg-btnColor-default__hover'
          )
        }
        break
      case !this.outline && this.color === 'red':
        classList.push('text-white')
        classList.push('bg-btnColor-red hover:bg-opacity-90')
        break
      case !this.outline && this.color === 'green':
        classList.push('text-white')
        if (this.isDisabled) {
          classList.push('bg-btnColor-border')
          break
        }
        classList.push('bg-btnColor-green hover:bg-opacity-90')
        break
      case !this.outline && this.color === 'gray':
        if (this.isDisabled) {
          classList.push('bg-btnColor-cancel__disabled text-black-light')
        } else {
          classList.push('text-white')
          classList.push('bg-btnColor-cancel hover:bg-btnColor-cancel__hover')
        }
        break
      case !this.outline && this.color === 'white':
        classList.push('text-black ')
        classList.push(
          this.isPushed
            ? 'bg-white border border-btnColor-cancel'
            : 'bg-white border border-btnColor-cancel hover:bg-opacity-80'
        )
        break
      case this.outline && this.color === 'blue':
        // ボタンdisabled時
        if (this.isDisabled) {
          classList.push('border-btnColor text-btnColor')
          break
        }
        // ボタン通常時
        classList.push(
          'border-btnColor-outline text-btnColor-outline hover:border-btnColor-outline__hover hover:text-btnColor-outline__hover'
        )
        break
      case this.outline && this.color === 'gray':
        if (this.isDisabled) {
          // TODO: active時の色不明の為、決まり次第実装
          classList.push('bg-black border-black text-bdColor')
          break
        }

        classList.push('border-btnColor-cancel text-btnColor-cancel')

        break
      case this.color === 'none':
        if (!this.isDisabled) {
          classList.push(`${this.textColor} hover:${this.textColor}__hover`)
        } else {
          classList.push(`text-btnColor-disabled`)
        }
        break
      default:
        break
    }
  }

  private switchHeight(classList: string[]): void {
    if (this.height === 'small') {
      classList.push('h-8')
    } else if (this.height === 'big') {
      classList.push('h-11')
    } else if (this.height && this.height.indexOf('py-') === 0) {
      classList.push(this.height)
    } else {
      classList.push('py-3')
    }
  }

  @Emit('click')
  private clickEvent(e: Event): Event | void {
    if (this.isDisabled) return

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
  transition: all .3s ease
</style>
