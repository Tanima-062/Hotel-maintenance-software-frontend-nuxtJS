import { $axios } from '~/utils/api'
import { Notice } from '~/types'

export default class NoticeRepository {
  async fetchNoticeList(): Promise<Notice.Info[]> {
    const res = await $axios.get(`${process.env.apiUrlPrefix}/notification`)
    return res.data.map((data: any) => ({
      notificationId: data.notification_id,
      noticeTitle: data.notice_title,
      status: data.status,
      isLatest: data.is_latest,
      createdAt: data.created_at,
    }))
  }

  async fetchInfo(notificationId: number): Promise<Notice.Info> {
    const res = await $axios.get(
      `${process.env.apiUrlPrefix}/notification/${notificationId}`
    )
    return {
      notificationId: res.data.notification_id,
      noticeTitle: res.data.notice_title,
      noticeBody: res.data.notice_body,
      status: res.data.status,
      isLatest: res.data.is_latest,
      createdAt: res.data.created_at,
    }
  }

  // TODO: Manual Download API (change after)
  async fetchManualInfo(): Promise<Notice.ManualInfo> {
    const res = await $axios.get(`${process.env.apiUrlPrefix}/`)
    return res.data.map((data: any) => ({
      createdAt: data.created_at,
      manualUrl: data.manual_url,
      manualName: data.manual_name,
    }))
  }
}
