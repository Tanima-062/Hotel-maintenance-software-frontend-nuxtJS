<template>
  <div class="relative">
    <textarea
      :value="value"
      :placeholder="placeholder"
      :class="`w-full rounded-md border border-solid border-bdColor text-black-dark placeholder-black-light py-2 focus:shadow-outline focus:outline-none ${styles}`"
      :maxlength="maxlength"
      :rows="rows"
      :disabled="isDisabled"
      @input="input"
    />
    <div
      v-if="showTextLength"
      class="absolute right-0 bottom-0 text-inputLength text-sm py-2.5 pr-2"
    >
      {{ inputTextLength }}/ {{ maxlength }}
    </div>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop, Emit } from 'nuxt-property-decorator'

@Component
export default class extends Vue {
  @Prop({ default: '' })
  placeholder!: string

  @Prop({ default: '' })
  value!: string

  @Prop({ default: 1000 })
  maxlength!: number

  @Prop({ default: 2 })
  rows!: number

  @Prop({ default: false })
  showTextLength!: boolean

  @Prop({ default: 0 })
  inputTextLength!: number

  @Prop({ default: true })
  resize!: boolean

  @Prop({ default: '' })
  height!: string

  @Prop({ default: false })
  isDisabled!: boolean

  get styles(): string {
    const style = []
    if (this.showTextLength) {
      style.push('pr-16')
      style.push('pl-3')
      style.push('resize-none')
    } else {
      style.push('px-3')
    }
    if (!this.resize) {
      style.push('resize-none')
    }
    if (this.height) {
      style.push(this.height)
    }
    return style.join(' ')
  }

  @Emit()
  private input(e: Event & { target: HTMLInputElement }): string {
    return e.target.value
  }
}
</script>
