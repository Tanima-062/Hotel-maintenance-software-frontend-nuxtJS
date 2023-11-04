export module Notice {
  export type Info = {
    notificationId: number
    noticeTitle: string
    noticeBody: string
    status: number
    isLatest: boolean
    createdAt: string
  }

  export type ManualInfo = {
    createdAt: string
    url: string
    filename: string
  }
}
