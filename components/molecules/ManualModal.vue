<template>
  <transition name="fade-modal">
    <div class="fixed z-40">
      <div class="opacity-25 fixed inset-0 z-10 bg-black"></div>
      <div
        id="toTopId"
        class="inset-0 fixed overflow-auto h-screen py-18 top-0 left-0 z-40 flex"
        @click.self="closeModal"
      >
        <div class="relative manual-w m-auto">
          <div
            class="border-0 p-5 rounded-lg shadow-lg relative flex flex-col z-20 w-full bg-white"
          >
            <div class="flex items-start justify-between mb-2 rounded-t">
              <h3
                class="text-base font-bold text-black-dark whitespace-no-wrap"
              >
                {{ manualData.title }}
              </h3>
              <IconBtn
                :icon="icon.closeIcon"
                hover-color="text-black-dark"
                color="text-black-dark"
                class="text-black-dark h-6 w-6 text-xl block"
                @click="closeModal"
              />
            </div>
            <div class="">
              <div v-for="(image, index) in manualData.imageList" :key="index">
                <img :src="image" />
                <div
                  v-if="
                    manualData.separateOption === 'arrow' &&
                    index < manualData.imageList.length - 1
                  "
                  class="w-full p-2 flex justify-center flex-col"
                >
                  <img class="w-6 m-auto" :src="arrowImages" />
                  <img class="w-6 m-auto" :src="arrowImages" />
                </div>
                <div
                  v-if="
                    manualData.separateOption === 'dashed' &&
                    index < manualData.imageList.length - 1
                  "
                  class="border-b border-inputLength border-dashed w-full my-4"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { mdiClose } from '@mdi/js'
import { Global } from '~/types'

@Component({
  components: {
    IconBtn: () => import('~/components/atoms/IconBtn.vue'),
  },
})
export default class ManualModal extends Vue {
  @Prop({ required: true })
  manualData!: Global.ManualItem

  @Prop({ required: true })
  closeManualModal!: Function

  private icon: { [key: string]: string } = {
    closeIcon: mdiClose,
  }

  // Arrow Icon Image
  private arrowImages = '/images/guide-arrow.svg'

  private closeModal(): void {
    this.scrollToTopModal()
    this.closeManualModal()
  }

  private scrollToTopModal(): void {
    const scroll = document.getElementById('toTopId')
    if (!scroll) return
    scroll.scrollTop = 0
  }
}
</script>
<style lang="sass" scoped>
.manual-w
  width: 53rem
.fade-modal-enter-active, .fade-modal-leave-active
  transition: all 0.4s
.fade-modal-enter, .fade-modal-leave-to
  opacity: 0
</style>
