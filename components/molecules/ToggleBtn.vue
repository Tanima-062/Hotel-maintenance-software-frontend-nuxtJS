<template>
  <label :class="toggleStyle" @click="click">
    <span v-if="isActive" :class="onTextStyle">{{ toggleMenu[0].name }}</span>
    <div
      class="w-5 h-5 flex justify-center items-center rounded-full shadow-lg bg-white"
    >
      <Icon :icon="icon.blank" aria-hidden="true" />
    </div>
    <span v-if="!isActive" :class="offTextStyle">{{ toggleMenu[1].name }}</span>
  </label>
</template>

<script lang="ts">
import { Component, Vue, Prop, Emit } from 'vue-property-decorator'
import { mdiCheckboxBlankCircle, mdiCheckboxBlankCircleOutline } from '@mdi/js'
import { Global } from '~/types'

@Component({
  components: {
    Icon: () => import('~/components/atoms/Icon.vue'),
  },
})
export default class extends Vue {
  @Prop()
  toggleMenu!: Global.ToggleBtn[]

  @Prop({ default: false })
  isActive!: boolean

  private icon: { [key: string]: string } = {
    blank: mdiCheckboxBlankCircle,
    white: mdiCheckboxBlankCircleOutline,
  }

  get toggleStyle() {
    return [
      'h-8 w-min flex items-center px-1',
      'rounded-full',
      'overflow-hidden cursor-pointer',
      this.isActive ? 'bg-menuColor-active' : 'bg-btnColor-border',
      'transition-bg',
    ]
  }

  get onTextStyle() {
    return [
      'ml-4 mr-2 text-white overflow-hidden whitespace-no-wrap',
      this.isActive ? '' : 'hidden',
    ]
  }

  get offTextStyle() {
    return [
      'ml-2 mr-4 text-white overflow-hidden  whitespace-no-wrap',
      this.isActive ? 'hidden' : '',
    ]
  }

  @Emit()
  private click(): boolean {
    return !this.isActive
  }
}
</script>
<style lang="sass" scoped>
.transition-bg
  transition: background .4s ease
</style>
