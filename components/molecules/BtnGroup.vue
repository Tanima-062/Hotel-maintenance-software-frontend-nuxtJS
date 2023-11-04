<template>
  <div>
    <button
      v-for="(item, index) in items"
      :key="item.value"
      type="button"
      class="border border-solid px-4 py-1.5"
      :class="`${borderRadius(index, items.length)} ${overawedBorder(
        index
      )} ${isActive(item.value === activeValue && isSelect)}`"
      @click="click(item.value)"
    >
      {{ item.name }}
    </button>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop, Emit } from 'nuxt-property-decorator'
import { Global } from '~/types'

@Component
export default class extends Vue {
  @Prop({
    default: [
      { name: 'hoge', value: 0 },
      { name: 'hoge1', value: 1 },
      { name: 'hoge2', value: 2 },
    ],
  })
  items!: Global.BtnGroup[]

  @Prop({ default: 0 })
  activeValue!: number

  @Prop({ default: true })
  isSelect!: boolean

  private overawedBorder(index: number): string {
    return index !== 0 ? 'border-l-0' : ''
  }

  private borderRadius(index: number, length: number): string {
    if (index === 0) return 'rounded-l-lg'
    if (index === length - 1) return 'rounded-r-lg'
    return ''
  }

  private isActive(bool: boolean): string {
    return bool
      ? 'bg-btnColor text-white border-btnColor'
      : 'bg-white text-black-light border-btnColor-border'
  }

  @Emit()
  private click(value: number): number {
    return value
  }
}
</script>
