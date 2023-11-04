<template>
  <div
    class="opacity-80 w-24 rounded-bl-lg rounded-br-md px-3 py-1 bg-black-light cursor-pointer"
    :class="extraClass"
    @click="scrollToTopWindow"
  >
    <div class="flex flex-row items-center justify-center">
      <Icon :icon="topIcon" color="text-white" extra-class="-ml-2 mr-1" />
      <p class="text-xs text-white">To top</p>
    </div>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'nuxt-property-decorator'
import { mdiChevronUp } from '@mdi/js'

@Component({
  components: {
    Icon: () => import('~/components/atoms/Icon.vue'),
  },
})
export default class extends Vue {
  @Prop({ default: '' })
  extraClass!: string

  @Prop({ required: true })
  toTopId!: string

  private topIcon: string = mdiChevronUp
  private scrollToTopWindow(): void {
    const scroll = document.getElementById(this.toTopId)
    if (!scroll) return
    scroll.scrollTop = 0
  }
}
</script>
