<template>
  <label class="inline-flex items-center">
    <input
      type="radio"
      :name="name"
      class="form-radio h-4 w-4 mr-1"
      :checked="checked"
      :value="value"
      @click="click(value)"
      :disabled="isDisabled"
    />
    <span :class="`${checked ? 'text-checkboxColor' : color}`">{{ text }}</span>
  </label>
</template>
<script lang="ts">
import { Vue, Component, Prop, Emit } from 'nuxt-property-decorator'

@Component
export default class extends Vue {
  @Prop({ default: '' })
  name!: string

  @Prop({ default: '' })
  value!: string | number

  @Prop({ default: '' })
  text!: string

  @Prop({ default: 'default' })
  color!: string

  @Prop({ default: false })
  checked!: boolean

  @Prop({ default: false })
  isDisabled!: boolean

  @Emit()
  private click(value: string | number): string | number | void {
    if (this.isDisabled) return
    return value
  }
}
</script>
