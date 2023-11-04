<template>
  <div
    v-if="tabData.length"
    class="flex items-baseline"
    :class="tabPositionStyle"
  >
    <slot />
    <Tab
      v-for="(tab, index) in tabData"
      :key="index"
      :class="index > 0 ? '-ml-px' : ''"
      :is-active="tab.value === activeTab"
      :tab-width="tabWidth"
      :disable="!!tab.disable"
      @click="click(tab)"
    >
      {{ tab.name }}
    </Tab>
  </div>
</template>
<script lang="ts">
import { Prop, Vue, Component, Emit } from 'nuxt-property-decorator'
import { Global } from '~/types'

@Component({
  components: {
    Tab: () => import('~/components/atoms/Tab.vue'),
  },
})
export default class extends Vue {
  @Prop({ default: [] })
  tabData!: Global.TabCategory[]

  @Prop({ default: '' })
  activeTab!: string

  @Prop({ default: 'left' })
  position!: string

  @Prop({ default: '' })
  tabWidth!: string

  get tabPositionStyle(): string {
    if (this.position === 'left') {
      return 'justify-start'
    } else if (this.position === 'right') {
      return 'justify-end'
    }
    return ''
  }

  @Emit()
  private click(tab: Global.TabCategory): string {
    return tab.disable ? '' : tab.value
  }
}
</script>
