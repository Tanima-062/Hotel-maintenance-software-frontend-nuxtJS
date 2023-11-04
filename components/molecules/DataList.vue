<template>
  <div>
    <input
      :id="name"
      type="text"
      autocomplete="off"
      :list="id"
      :name="name"
      :class="dynamicStyle"
      :placeholder="placeholder"
      :value="value"
      class="w-full rounded-md border border-solid text-black-dark placeholder-black-light px-3 focus:shadow-outline focus:outline-none"
      @input="onInput"
      @compositionstart="composing = true"
      @compositionend="composing = false"
      @keydown.enter="onEnter"
      @blur="onLeavedHandler"
    />
    <datalist :id="id">
      <option
        v-for="(itemText, itemKey) in items"
        :key="itemKey"
        :value="itemText"
      >
        {{ zenkaku2Hankaku(itemText) }}
      </option>
    </datalist>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop, Emit } from 'nuxt-property-decorator'
import { zenkaku2Hankaku } from '../../utils/string'

@Component
export default class extends Vue {
  @Prop({ default: '' })
  id!: string

  @Prop({ default: '' })
  name!: string

  @Prop({ default: [] })
  items!: string[]

  @Prop({ default: '' })
  placeholder!: string

  @Prop({ default: '' })
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
  onLeavedHandler!: Function

  @Prop({ default: 'py-2' })
  padding!: string

  private isFocus: boolean = false
  private composing: boolean = false
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

  private onEnter(e: Event & { target: HTMLInputElement }): void {
    if (this.composing) {
      this.suggestion(e)
    }
  }

  private onInput(
    e: Event & { target: HTMLInputElement } & { keyCode: number }
  ): void {
    if (this.composing) {
      return
    }
    this.suggestion(e)
  }

  private suggestion(e: Event & { target: HTMLInputElement }): void {
    this.onInputHandler(e)

    if (this.items.includes(e.target.value)) {
      e.target.blur()
    }
  }

  @Emit()
  private input(e: Event & { target: HTMLInputElement }): string {
    return e.target.value
  }

  @Emit()
  private blur(e: Event & { target: HTMLInputElement }): string {
    this.isFocus = false
    return e.target.value
  }
}
</script>
