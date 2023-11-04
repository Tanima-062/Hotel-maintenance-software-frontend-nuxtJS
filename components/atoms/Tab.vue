<template>
  <div class="relative">
    <button
      class="border border-solid border-bdColor px-4 py-3"
      :class="styles"
      @click="click"
    >
      <slot />
    </button>
    <div
      v-if="isActive"
      class="border border-solid border-btnColor bg-btnColor absolute top-0 left-0 w-full h-4px"
    />
    <div
      v-if="isActive"
      class="bg-white absolute bottom-0 left-0 wfull h-px -mb-px ml-px"
    />
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop, Emit } from 'nuxt-property-decorator'

@Component({})
export default class extends Vue {
  @Prop({ default: false })
  isActive!: boolean

  @Prop({ default: '' })
  tabWidth!: string

  @Prop({ default: false })
  disable!: boolean

  get styles(): string {
    const classList = []
    classList.push(
      this.isActive
        ? 'border-b-0 text-btnColor bg-white'
        : 'text-black bg-tabBgColor'
    )
    classList.push(this.tabWidth)
    if (this.disable) {
      classList.push('text-bdColor cursor-not-allowed')
    }
    return classList.join(' ')
  }

  @Emit()
  private click(e: Event): Event {
    return e
  }
}
</script>
<style lang="sass" scoped>
.wfull
  width: calc(100% - 2px)
</style>
