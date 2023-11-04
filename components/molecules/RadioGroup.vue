<template>
  <div>
    <Radio
      v-for="(item, index) in radioItems"
      :key="index"
      :name="name"
      :value="item.value"
      :text="item.text"
      :checked="value === item.value"
      :color="color"
      :isDisabled="isDisabled"
      @click="input"
    />
  </div>
</template>
<script lang="ts">
import { Prop, Vue, Component, Emit } from 'nuxt-property-decorator'
import { Global } from '~/types'

@Component({
  components: {
    Radio: () => import('~/components/atoms/Radio.vue'),
  },
})
export default class extends Vue {
  @Prop()
  name!: string

  @Prop({ default: 'default' })
  color!: string

  @Prop({ default: [] })
  radioItems!: Global.RadioItem[]

  @Prop({ default: false })
  isDisabled!: boolean

  @Prop({ default: '' })
  value!: string | number

  @Emit()
  private input(e: string | number | boolean): string | number | boolean {
    if (this.isDisabled) return ''
    return e
  }
}
</script>
