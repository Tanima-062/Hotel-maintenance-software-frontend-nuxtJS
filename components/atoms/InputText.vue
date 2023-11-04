<template>
  <input
    :id="id"
    :type="type"
    class="rounded-md border border-solid text-black-dark placeholder-black-light px-3 focus:shadow-outline focus:outline-none"
    :class="dynamicStyle"
    :placeholder="placeholder"
    :value="value"
    :disabled="disabled"
    @input="input"
    @keydown="isNumber"
    @focus="isFocus = true"
    @blur="blur"
    @keydown.space="(event) => (preventSpace ? event.preventDefault() : event)"
  />
</template>
<script lang="ts">
import { Vue, Component, Prop, Emit } from 'nuxt-property-decorator'

@Component
export default class extends Vue {
  @Prop({ default: null })
  id?: string

  @Prop({ default: 'text' })
  type!: string

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

  @Prop({ default: 'py-2' })
  padding!: string

  @Prop({ default: false })
  preventSpace!: boolean

  private isFocus: boolean = false

  get dynamicStyle() {
    const classes = []
    // if (this.isFocus) {
    // classes.push('border-blue-600')
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

  private isNumber(event: Event & { keyCode: number }): boolean {
    if (this.type !== 'number') return true
    const preventKey = [38, 40, 190, 69, 187, 189]
    if (preventKey.includes(event.keyCode)) {
      event.preventDefault()
      return false
    } else if (this.value.length >= Number(this.$attrs.maxlength)) {
      if (event.keyCode !== 8) {
        event.preventDefault()
        return false
      }
      return true
    } else {
      return true
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
