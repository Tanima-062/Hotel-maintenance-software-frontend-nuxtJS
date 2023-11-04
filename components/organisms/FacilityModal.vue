<template>
  <div>
    <div
      v-if="open"
      class="overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none justify-center items-center flex"
    >
      <div class="relative max-w-620 my-6 mx-auto max-w-3xl">
        <div
          class="border-0 rounded-lg shadow-lg relative flex flex-col w-full h-3/6 bg-white outline-none focus:outline-none"
        >
          <div class="w-full p-5 flex items-center justify-between">
            <h1
              class="text-lg font-bold text-black-dark whitespace-no-wrap w-full"
            >
              {{ $t('facility.modal.title') }}
            </h1>
            <IconBtn
              :icon="icon.closeIcon"
              color="text-black-dark"
              hover-color="text-black"
              class="mb-1"
              @click="closeModal"
            />
          </div>
          <div class="mx-5">
            <div class="text-sm font-light text-black">
              <div class="flex-col items-center">
                <div class="flex">
                  <p class="text-left mr-1">{{ $t('facility.modal.star') }}</p>
                  <div>
                    <p class="text-left">
                      {{ $t('facility.modal.guideTextOne') }}
                    </p>
                    <p class="text-left">
                      {{ $t('facility.modal.guideTextTwo') }}
                    </p>
                  </div>
                </div>
              </div>
              <div class="mt-2">
                <p class="text-alert">
                  {{ $t('facility.modal.pictureTextOne')
                  }}<span class="text-black">{{
                    $t('facility.modal.pictureTextTwo')
                  }}</span>
                  {{ $t('facility.modal.pictureTextThree') }}
                </p>
              </div>
            </div>
          </div>
          <div>
            <Btn
              v-if="!isParent"
              color="none"
              text-color="text-btnColor"
              class="items-center select-none flex flex-row mr-5 ml-auto text-sm underline"
              @click="() => this.$router.push('/album')"
            >
              <Icon :icon="icon.left" color="text-btnColor" />
              {{ $t('facility.modal.albumBtn') }}
            </Btn>
          </div>
          <div
            class="flex flex-col justify-center items-center mx-5 p-5 mt-3.5 bg-menuColor border border-bdColor text-sm font-light"
          >
            <div v-if="checkStatus" class="text-black">
              <p class="text-center text-btnColor">
                {{ $t('facility.modalAlert.checkOkayMessage') }}
              </p>
              <p class="text-center text-btnColor">
                {{ $t('facility.modalAlert.approvalMessage') }}
              </p>
            </div>
            <div v-if="imageCount < 5" class="text-alert">
              <p>{{ $t('facility.modalAlert.checkPictureMessage') }} 。</p>
            </div>
            <div v-if="!userStatus" class="text-alert">
              {{ $t('facility.modalAlert.checkIdmessage') }}
            </div>
          </div>
          <div class="flex justify-center my-5">
            <Btn
              class="w-35 h-9"
              :is-disabled="!checkStatus"
              @click="clickPublicBtn(true)"
            >
              {{ $t('facility.modal.openSiteBtn') }}
            </Btn>
          </div>
        </div>
      </div>
    </div>
    <div v-if="open" class="opacity-25 fixed inset-0 z-40 bg-black"></div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Emit } from 'vue-property-decorator'
import { mdiChevronLeft, mdiClose } from '@mdi/js'
import { Facility } from '~/types'

@Component({
  components: {
    Icon: () => import('~/components/atoms/Icon.vue'),
    Btn: () => import('~/components/atoms/Btn.vue'),
    IconBtn: () => import('~/components/atoms/IconBtn.vue'),
  },
})
export default class extends Vue {
  @Prop({ default: false })
  open!: boolean

  @Prop({ required: true })
  imageCount!: number

  @Prop({ default: false })
  userStatus!: boolean

  @Prop({ required: true })
  isParent!: boolean

  @Prop()
  selectedFacility!: Facility.ListInLocal

  @Prop({ required: true })
  updateDispPriority!: Function

  private isClicked: boolean = false

  private icon: { [key: string]: string } = {
    left: mdiChevronLeft,
    closeIcon: mdiClose,
  }

  get checkStatus(): boolean {
    return this.imageCount >= 5 && this.userStatus
  }

  @Emit('clicked')
  private async clickPublicBtn(isActive: boolean): Promise<boolean> {
    if (this.isClicked || !this.checkStatus) return false
    this.isClicked = true
    await this.updateDispPriority(this.selectedFacility, isActive)
    this.isClicked = false
    return true
  }

  @Emit()
  private closeModal(): boolean {
    return true
  }
}
</script>
