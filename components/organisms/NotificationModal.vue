<template>
  <transition name="fade-modal">
    <div class="fixed z-40">
      <div class="opacity-25 fixed inset-0 z-40 bg-black"></div>
      <div
        class="overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none justify-center items-center flex"
        @click.self="closeNotificationInfo"
      >
        <div class="relative w-notificationModal my-6 mx-auto max-w-3xl">
          <div
            class="border-0 p-5 rounded-lg shadow-lg relative flex flex-col w-full h-3/6 bg-white outline-none focus:outline-none"
          >
            <div class="flex items-start justify-between mb-2 rounded-t">
              <h3 class="text-lg font-bold text-black-dark whitespace-no-wrap">
                {{ $t('notification.pageName') }}
              </h3>
              <IconBtn
                :icon="closeIcon"
                hover-color="text-black-dark"
                color="text-black-dark"
                class="text-black-dark h-6 w-6 text-xl block outline-none focus:outline-none"
                @click="closeNotificationInfo"
              />
            </div>
            <div class="flex items-center p-3 bg-menuColor">
              <div>
                <span
                  v-if="noticeInfo.isLatest"
                  class="mr-3 w-full px-1 rounded text-alert border border-alert"
                >
                  {{ $t('notification.newText') }}
                </span>
              </div>
              <div class="font-light text-black">
                {{ noticeInfo.noticeTitle }}
              </div>
            </div>
            <div
              v-if="noticeInfo.createdAt"
              class="text-sm font-light text-black-light ml-auto"
            >
              {{ noticeInfo.createdAt }}
            </div>
            <div class="content-max-h overflow-auto">
              <div class="overflow-y-auto my-4 text-gray-600 leading-relaxed">
                <p class="whitespace-pre-wrap">{{ noticeInfo.noticeBody }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>
<script lang="ts">
import { Component, Vue, Prop, Emit } from 'vue-property-decorator'
import { mdiClose } from '@mdi/js'
import { Notice } from '~/types'

@Component({
  name: 'NotificationModal',
  components: {
    IconBtn: () => import('~/components/atoms/IconBtn.vue'),
  },
})
export default class ViewModal extends Vue {
  @Prop({ required: true })
  noticeInfo!: Notice.Info

  private closeIcon: string = mdiClose

  @Emit()
  private closeNotificationInfo(): boolean {
    return false
  }
}
</script>
<style lang="sass" scoped>
.notice-id-min-w
  min-width: 30px
.content-max-h
  max-height: 465px
.fade-modal-enter-active, .fade-modal-leave-active
  transition: all 0.4s
.fade-modal-enter, .fade-modal-leave-to
  opacity: 0
</style>
