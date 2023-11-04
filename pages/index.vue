<template>
  <main class="flex-1 pt-8 px-3">
    <h1 class="text-3xl text-black-dark font-bold">
      {{ $t('notification.pageName') }}
    </h1>
    <NotificationList
      :notice-list="noticeInfoList"
      :manual-list="manualList"
      @toggle-notification-info="toggleNotificationInfo"
    />
    <NotificationModal
      v-show="isShowNotification"
      :notice-info="noticeInformation"
      @close-notification-info="toggleNotificationInfo"
    />
  </main>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { differenceInDays } from 'date-fns'
import { NoticeRepository, BookingRepository } from '~/repositories'
import { formatDate } from '~/utils/date'
import {
  WHOLESALER_ID_TL,
  WHOLESALER_ID_TEMA,
  WHOLESALER_ID_NEPPAN,
  WHOLESALER_ID_DIRECT,
  NOTIFICATION_NEW_TAG,
  WHOLESALER_ID_RAKU2,
} from '~/utils/const'
import { Notice } from '~/types'
import { accountStore } from '~/store'
@Component({
  layout: 'AfterLogin',
  middleware: ['auth'],
  components: {
    NotificationList: () =>
      import('~/components/organisms/NotificationList.vue'),
    NotificationModal: () =>
      import('~/components/organisms/NotificationModal.vue'),
  },
})
export default class Notification extends Vue {
  head() {
    return {
      title: `${this.$t('global.title.dashboard') as string} | Skyticket ${
        this.$t('global.title.admin') as string
      }`,
    }
  }

  private noticeRepository = new NoticeRepository()
  private bookingRepository = new BookingRepository()
  private isShowNotification: boolean = false
  private noticeList: Notice.Info[] = []
  private isLoadingInfo: boolean = false
  private serverTime: string = ''
  private noticeInfo: Notice.Info = {
    notificationId: 0,
    noticeTitle: '',
    noticeBody: '',
    status: 0,
    isLatest: false,
    createdAt: '',
  }

  private manualList: Notice.ManualInfo[] = []

  get noticeInformation(): Notice.Info {
    this.noticeInfo.createdAt =
      this.noticeInfo.createdAt && formatDate(this.noticeInfo.createdAt)
    return this.noticeInfo
  }

  get noticeInfoList(): Notice.Info[] {
    this.noticeList.map((notice: Notice.Info) => {
      notice.createdAt = formatDate(notice.createdAt)
    })
    return this.noticeList
  }

  async created(): Promise<void> {
    this.serverTime = await this.bookingRepository.getServerTime()
    this.noticeList = await this.fetchNoticeList()
    await this.checkNewTag(true)
    const wholesalerId = accountStore.currentWholesalerId
    switch (wholesalerId) {
      case WHOLESALER_ID_TL:
        this.manualList = [
          {
            createdAt: '2023/08/22',
            url: '/pdf/hm_manual_tl.pdf',
            filename: '【マニュアル】TLリンカーン×スカイチケット管理画面.pdf',
          },
          {
            createdAt: '2021/04/07',
            url: '/pdf/site_controller_manual_tl.pdf',
            filename: '「skyticket 」スタートガイド.pdf',
          },
        ]
        break
      case WHOLESALER_ID_TEMA:
        this.manualList = [
          {
            createdAt: '2023/08/22',
            url: '/pdf/hm_manual_tema.pdf',
            filename: '【マニュアル】手間いらず×スカイチケット管理画面.pdf',
          },
          {
            createdAt: '2021/04/07',
            url: '/pdf/site_controller_manual_tema.pdf',
            filename: '20210308_一元在庫_施設様向け利用ガイド',
          },
        ]
        break
      case WHOLESALER_ID_NEPPAN:
        this.manualList = [
          {
            createdAt: '2023/08/22',
            url: '/pdf/hm_manual_neppan.pdf',
            filename: '【マニュアル】ねっぱん！×スカイチケット管理画面.pdf',
          },
        ]
        break
      case WHOLESALER_ID_DIRECT:
        this.manualList = [
          {
            createdAt: '2023/08/22',
            url: '/pdf/hm_manual_direct.pdf',
            filename: '【マニュアル】スカイチケット管理画面.pdf',
          },
        ]
        break
      case WHOLESALER_ID_RAKU2:
        this.manualList = [
          {
            createdAt: '2023/08/22',
            url: '/pdf/hm_manual_raku2.pdf',
            filename: '【らく通】スカイチケット管理画面マニュアル.pdf',
          },
        ]
        break
    }
    this.manualList.push({
      createdAt: '2022/11/07',
      url: '/pdf/zenkokushien_manual_new.pdf',
      filename: '【マニュアル】全国旅行支援×スカイチケット.pdf',
    })
  }

  private async toggleNotificationInfo(
    value: boolean,
    notificationId: number = 0
  ): Promise<void> {
    if (value) {
      document.body.classList.add('swal2-shown')
      this.$nuxt.$loading.start()
      this.noticeInfo = await this.noticeRepository.fetchInfo(notificationId)
      await this.checkNewTag(false)
      this.$nuxt.$loading.finish()
      this.isShowNotification = value
    } else {
      document.body.classList.remove('swal2-shown')
      this.isShowNotification = value
    }
  }

  private async fetchNoticeList(): Promise<Notice.Info[]> {
    const noticeList = await this.noticeRepository.fetchNoticeList()
    noticeList.sort((a: Notice.Info, b: Notice.Info) => {
      return b.notificationId - a.notificationId
    })
    return noticeList
  }

  private checkNewTag(isNoticeList: boolean): void {
    const compareTime = new Date(this.serverTime)
    if (isNoticeList) {
      this.noticeList = this.noticeList.map((notice) => {
        if (notice.isLatest) {
          notice.isLatest =
            differenceInDays(compareTime, new Date(notice.createdAt)) <
            NOTIFICATION_NEW_TAG
        }
        return notice
      })
    } else if (this.noticeInfo.isLatest) {
      this.noticeInfo.isLatest =
        differenceInDays(compareTime, new Date(this.noticeInfo.createdAt)) <
        NOTIFICATION_NEW_TAG
    }
  }
}
</script>
