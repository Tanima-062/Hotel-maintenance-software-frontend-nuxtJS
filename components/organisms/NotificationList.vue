<template>
  <div>
    <div class="h-6 flex items-center justify-between mt-5 mb-2">
      <div class="text-sm font-light text-black">
        {{ $t('notification.pageDescription') }}
      </div>
      <div class="flex items-center">
        <IconBtn
          :disabled="pageNum < 1"
          class="rounded-full bg-menuColor"
          :icon="prevBtn"
          color="text-btnColor-cancel"
          @click="prevPage"
        />
        <span class="mx-6 text-sm font-light text-pagingColor-text">{{
          pageInfo
        }}</span>
        <IconBtn
          :disabled="pageSize * (pageNum + 1) >= noticeList.length"
          class="rounded-full bg-menuColor"
          :icon="nextBtn"
          color="text-btnColor-cancel"
          @click="nextPage"
        />
      </div>
    </div>
    <ul class="h-72 border-t-2 border-b-2 border-btnColor-cancel">
      <li
        v-for="(notice, index) in updatedNoticeList"
        :key="notice.notification_id"
        class="border-bdColor cursor-pointer"
        :class="index !== 4 && 'border-b'"
        @click="toggleNotificationInfo(notice.notificationId)"
      >
        <div class="flex justify-center p-4">
          <div v-if="notice.isLatest" class="mr-4">
            <span class="w-6 px-1 rounded-md text-alert border border-alert">
              {{ $t('notification.newText') }}
            </span>
          </div>
          <div class="font-light text-black pr-5 truncate">
            {{ notice.noticeTitle }}
          </div>
          <div class="font-light text-black-light ml-auto">
            {{ notice.createdAt }}
          </div>
        </div>
      </li>
    </ul>
    <div class="my-10 p-7 border border-bdColor bg-menuColor">
      <div class="flex mb-5">
        <h1 class="text-lg font-bold text-black-dark whitespace-no-wrap">
          {{ $t('notification.contactInfo.title') }}
        </h1>
      </div>
      <div class="flex flex-row justify-between mt-1">
        <div
          v-for="contact in $t('notification.contactInfo.contactList')"
          :key="contact.contactType"
          class="flex-1 mr-4 border-r border-dotted border-btnColor-cancel last:border-none last:mr-0"
        >
          <div class="h-18">
            <div class="font-normal text-black">
              【 {{ contact.contactType }} 】
            </div>
            <div class="pl-2 text-sm text-black-light">
              {{ contact.contactDescription }}
            </div>
          </div>
          <div
            v-for="(information, index) in contact.contactInformation"
            :key="index"
            class="pl-2"
          >
            <div v-if="information.contactSubDescription" class="mt-2">
              {{ information.contactSubDescription }}
            </div>
            <div class="mr-5 text-black-dark mt-2">
              Tel : {{ information.contactTel }}
            </div>
            <div class="text-black-dark mt-2">
              E-mail :
              <a :href="`mailto:${information.contactEmail}`">{{
                information.contactEmail
              }}</a>
            </div>
            <div class="text-black-dark mt-2 mb-8">
              {{ information.contactOpenTime }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
      v-show="manualList.length"
      class="mb-10 p-7 border border-bdColor bg-menuColor"
    >
      <h1 class="text-lg font-bold text-black-dark">
        {{ $t('notification.manualInfo.title') }}
      </h1>
      <ul class="mt-4 border border-bdColor">
        <li
          v-for="manual in manualList"
          :key="manual.filename"
          rel="js-v-for"
          class="border-b border-bdColor last:border-b-0"
        >
          <div class="flex items-center justify-center h-18 p-4 bg-white">
            <div class="mr-6 text-black-light">
              {{ manual.createdAt }}
            </div>
            <div class="text-black pr-5 truncate">
              {{ manual.filename }}
            </div>
            <Btn color="blue" class="h-9 w-36 ml-auto">
              <a :href="manual.url" :download="manual.filename">{{
                $t('notification.manualInfo.downloadText')
              }}</a>
            </Btn>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Emit } from 'vue-property-decorator'
import { mdiChevronLeft, mdiChevronRight } from '@mdi/js'
import { Notice } from '~/types'

@Component({
  components: {
    IconBtn: () => import('~/components/atoms/IconBtn.vue'),
    Btn: () => import('~/components/atoms/Btn.vue'),
  },
})
export default class NoticeList extends Vue {
  @Prop({ required: true })
  noticeList!: Notice.Info[]

  @Prop()
  manualList!: Notice.ManualInfo[]

  private prevBtn: string = mdiChevronLeft
  private nextBtn: string = mdiChevronRight
  private currentNoticeList: Notice.Info[] = []
  private pageNum: number = 0
  private pageSize: number = 5

  private nextPage(): void {
    this.pageNum++
  }

  private prevPage(): void {
    this.pageNum--
  }

  get updatedNoticeList(): Notice.Info[] {
    this.currentNoticeList = [...this.noticeList]
    this.currentNoticeList = this.currentNoticeList.splice(
      this.pageNum * this.pageSize,
      this.pageSize
    )
    return this.currentNoticeList
  }

  get pageInfo() {
    const currentPage = this.pageNum * this.pageSize + 1
    const pageLength = Math.min(
      currentPage + this.pageSize - 1,
      this.noticeList.length
    )
    return `${currentPage}-${pageLength} / ${this.noticeList.length}`
  }

  @Emit()
  private toggleNotificationInfo(
    notificationId: number
  ): object & { value: boolean; notificationId: number } {
    return { value: true, notificationId }
  }
}
</script>
