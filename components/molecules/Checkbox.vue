<template>
  <div class="relative">
    <div
      v-show="showTooltip"
      class="tooltip-position shadow break-all bg-bgColor-light-gray w-70 rounded"
    >
      {{ tooltip }}
    </div>
    <label
      class="flex items-center focus:outline-none"
      :class="styles"
      tabindex="-1"
      @mouseover="mouseover"
      @mouseleave="mouseleave"
    >
      <input
        type="checkbox"
        tabindex="0"
        class="form-checkbox focus:shadow-outline focus:outline-none"
        :class="disabled && 'text-disabled'"
        :checked="checked"
        :disabled="disabled"
        @change="change"
      />
      <span class="ml-2" :class="`text-${checked ? 'checkboxColor' : color}`">{{
        label
      }}</span>
    </label>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop, Emit } from 'vue-property-decorator'

@Component
export default class extends Vue {
  @Prop({ default: false })
  checked!: boolean

  @Prop({ default: '' })
  label!: string

  @Prop({ default: 'black' })
  color!: string

  @Prop({ default: false })
  disabled!: boolean

  @Prop({ default: '' })
  tooltip!: string

  private isShowTooltip: boolean = false

  get styles(): string {
    return this.checked ? 'text-checkboxColor' : 'text-black'
  }

  get showTooltip(): boolean {
    return this.isShowTooltip && this.tooltip !== ''
  }

  @Emit()
  private change(e: Event & { target: HTMLInputElement }): boolean {
    return e.target.checked
  }

  private mouseover(): void {
    this.isShowTooltip = true
  }

  private mouseleave(): void {
    this.isShowTooltip = false
  }
}
</script>
<style lang="sass" scoped>
.tooltip-position
  position: absolute
  bottom: 110%
  left: 5%
</style>
