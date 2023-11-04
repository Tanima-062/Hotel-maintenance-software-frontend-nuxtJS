export const IMAGE_CATEGORY: { [key: string]: string } = {
  GUEST: '客室',
  GEN: '外観',
  COM: 'ロビー',
  BAR: 'バー/ダイニング/食事',
  ONSEN: '風呂',
  DEP: 'フィットネス・レジャー',
  ETC: 'その他',
}
export const DATE_FORMAT: string = 'yyyy/MM/dd'
export const DATE_PICKER_FORMAT: string = 'YYYY/MM/DD'
export const API_DATE_FORMAT: string = 'yyyy-MM-dd'
export const PARSE_DATE_FORMAT: string = "yyyy-MM-dd'T'HH:mm:ss+09:00"

export const NOTIFICATION_NEW_TAG: number = 11

export const CALENDAR_PLAN_PRICE_MAX_LENGTH = 6
export const CALENDAR_ROOM_STOCK_MAX_LENGTH = 3

export const DEFAULT_DATE: string = '0001/01/01 00:00:00'
export const ROOM_IMAGE_TYPE: string = 'GUEST'

export const SETTLEMENT_MAX_EMAIL = 5
export const SETTLEMENT_DEFAULT_EMAIL = 2

export const CANCELPOLICY_MAX_CONDITION = 8
export const CANCELPOLICY_DEFAULT_CONDITION = 2

export const CHILD_A_TYPE: number = 1 // 小学校高学年
export const CHILD_B_TYPE: number = 2 // 小学校低学年
export const CHILD_C_TYPE: number = 3 // 幼児（食事・布団あり）
export const CHILD_D_TYPE: number = 4 // 幼児（食事あり・布団なし）
export const CHILD_E_TYPE: number = 5 // 幼児（食事なし・布団あり）
export const CHILD_F_TYPE: number = 6 // 乳児（食事・布団なし）

export const RESERVE_STATUS_RESERVED = 1 // ReserveStatusReserved 予約済み
export const RESERVE_STATUS_CANCEL = 2 // ReserveStatusCancel 予約キャンセル
export const RESERVE_STATUS_NOSHOW = 3 // ReserveStatusNoShow 予約NoShow
export const RESERVE_STATUS_STAYING = 4 // ReserveStatusStaying 宿泊中
export const RESERVE_STATUS_STAYED = 5 // ReserveStatusStayed 旅程終了

export const STOCK_DISPLAY_WEEK: number = 14
export const ROOM_MAX_PEOPLE: number = 6
export const AVAILABLE_CHARGE_MONTH: number = 12

// wholesalerID
export const SETTLEMENT_STATUS_APPROVE_FIXED: number = 2
export const SETTLEMENT_STATUS_APPROVE: number = 1
export const SETTLEMENT_STATUS_UNAPPROVE: number = 0

// wholesalerID
export const WHOLESALER_ID_TL: number = 3
export const WHOLESALER_ID_TEMA: number = 4
export const WHOLESALER_ID_NEPPAN: number = 6
export const WHOLESALER_ID_DIRECT: number = 7
export const WHOLESALER_ID_RAKU2: number = 8

export const CONNECT_PERM_ID: number[] = [
  WHOLESALER_ID_TEMA,
  WHOLESALER_ID_NEPPAN,
  WHOLESALER_ID_RAKU2,
]
export const PREFIX_CONNECT_LIST: { [key: string]: string } = {
  4: 'tema-',
}

// Cancel Policy Non List Target
export const CANCEL_POLICY_NON_LIST: number[] = [WHOLESALER_ID_TL]

export const DEFAULT_TIME_MINUTE = [0, 15, 30, 45]

// 在庫料金カレンダー編集リスト
export const CALENDAR_EDIT_PERMISSION: number[] = [WHOLESALER_ID_DIRECT]

// メンテナンスフラグ
export const IS_MAINTENANCE: boolean = false
