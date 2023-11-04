<template>
  <div class="relative">
    <input
      ref="input"
      :value="value"
      tabindex="0"
      class="w-full rounded-md border border-solid text-black-dark placeholder-black-light px-3 focus:shadow-outline focus:outline-none bg-white border-bdColor py-2"
      @input="onInput"
      @compositionstart="composing = true"
      @compositionend="composing = false"
      @keydown="onKeyDownHandler"
      @keydown.enter="onEnter"
      @focus="isFocus = true"
      @blur="blurHideSuggestion"
    />
    <div
      v-show="value && isFocus && items.length"
      tabindex="0"
      class="absolute w-full z-50 bg-white border border-solid mt-1 max-h-80 border-bdColor overflow-auto rounded-md"
      @focusout="isFocus = false"
    >
      <ul class="py-1">
        <li
          v-for="(itemText, index) in items"
          :key="index"
          class="px-3 py-1 cursor-pointer hover:bg-menuColor"
          @click="handleClick(this, itemText)"
        >
          {{ itemText }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit } from 'nuxt-property-decorator'
import { zenkaku2Hankaku } from '../../utils/string'

@Component
export default class extends Vue {
  @Prop({ default: [] })
  items!: string[]

  @Prop({ default: 'test' })
  placeholder!: string

  @Prop({ default: 'demo' })
  value!: string

  @Prop({ default: false })
  error!: boolean

  @Prop({ default: 'bg-white' })
  bg!: string

  @Prop({ default: false })
  disabled!: boolean

  @Prop({ default: () => {} })
  onInputHandler!: Function

  @Prop({ default: () => {} })
  onKeyDownHandler!: Function

  @Prop({ default: () => {} })
  onLeavedHandler!: Function

  @Prop({ default: 'py-2' })
  padding!: string

  private isFocus: boolean = false
  private composing: boolean = false
  private prev: string = ''

  private zenkaku2Hankaku: Function = zenkaku2Hankaku

  get dynamicStyle() {
    const classes = []
    if (this.error) {
      classes.push('border-alert')
      classes.push('bg-error')
    } else {
      classes.push(this.bg)
      classes.push('border-bdColor')
    }
    classes.push(this.padding)
    return classes.join(' ')
  }

  private onEnter(
    e: Event & { target: HTMLInputElement } & { keyCode: number }
  ): void {
    if (this.composing) {
      this.suggestion(e)
    }
  }

  private onInput(
    e: Event & { target: HTMLInputElement } & { keyCode: number }
  ): void {
    // Windows対策
    // Enterイベントが補足できず、キーコードも常に229が返るため判別不可。
    // 暫定として、イベント発生時に前回と同じ入力だった場合はEnterとみなしてサジェストする。
    if (e.target.value === this.prev) {
      this.suggestion(e)
      return
    }

    this.prev = e.target.value

    if (this.composing) {
      return
    }
    this.suggestion(e)
  }

  private suggestion(
    e: Event & { target: HTMLInputElement } & { keyCode: number }
  ): void {
    this.onInputHandler(e)
    if (this.items.includes(e.target.value)) {
      e.target.blur()
    }
  }

  private handleClick(e: Event & { target: HTMLInputElement }, target: string) {
    this.onInputHandler(e, target)
  }

  private blurHideSuggestion(): void {
    setTimeout(() => {
      this.isFocus = false
    }, 150)
  }

  @Emit()
  private input(e: Event & { target: HTMLInputElement }): string {
    this.isFocus = false
    return e.target.value
  }

  @Emit()
  private blur(e: Event & { target: HTMLInputElement }): string {
    return e.target.value
  }
}
</script>
