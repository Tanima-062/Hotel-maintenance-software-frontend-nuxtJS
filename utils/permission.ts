import { Global } from '~/types'
import {
  WHOLESALER_ID_TL, WHOLESALER_ID_TEMA
} from '~/utils/const'

// Permission Level
export const PERMISSION_ALL: number = 1
export const PERMISSION_BOOKING_SETTLEMENT_FACILITY: number = 2
export const PERMISSION_NOT_STOCK_PRICE: number = 3
export const PERMISSION_NOT_STOCK_PRICE_CANCELPOLICY: number = 4
export const PERMISSION_PARENT: number = 5
export const PERMISSION_FOR_TL_TEMA: number = 6

// ホールセラーにメニュー権限を設定
// 新しいホールセラー追加、メニュー権限をここで追加する
export const PERMISSION_LIST: { [wholesalerId: number]: number } = {
  0: 5, // PARENT ACCOUNT
  3: 6, // TL
  4: 6, // TEMA
  6: 3, // NEPPAN
  7: 1, // DIRECT
  8: 3, // RAKU2
}

// Menu Header Manager
const MENU_NOT_PEM_PARENT = ['sale', 'roomandplan', 'facility']
const MENU_NOT_PEM_SALE_ROOMPLAN = ['sale', 'roomandplan']
const MENU_NOT_STOCK_PRICE = ['/stock/edit', '/charge/edit']
const MENU_NOT_CREATE_ROOM_PLAN = ['/room-plan/create']
const MENU_NOT_STOCK_PRICE_CANCELPOLICY = [
  '/stock/edit',
  '/charge/edit',
  '/cancel-policy',
]

// Middleware確認用
// permissionLevel毎にアクセスを拒否するリスト
const ACCESS_DENY_LIST: { [permissionLevel: number]: string[] } = {
  1: [],
  2: [
    '/stock-rate',
    '/room-plan',
    '/room-plan/create',
    '/stock/edit',
    '/charge/edit',
  ],
  3: ['/stock/edit', '/charge/edit'],
  4: [
    '/room-plan',
    '/room-plan/create',
    '/stock-rate',
    '/stock/edit',
    '/charge/edit',
    '/cancel-policy',
  ],
  5: [
    '/facility/edit',
    '/album',
    '/stock-rate',
    '/room-plan',
    '/room-plan/create',
    '/stock/edit',
    '/charge/edit',
    '/cancel-policy',
  ],
  6:[
    '/room-plan/create',
    '/stock/edit',
    '/charge/edit',
    '/plan/edit',
    '/room/edit'
  ]
}

// メニュー表示可能をホールセラー毎に確認する
export const checkPermissionMenu = (
  menuDefault: Global.PAGE_STRUCTURE_TOP[],
  wholesalerId: number
): Global.PAGE_STRUCTURE_TOP[] => {
  // 権限が設定していなかった場合は全権限
  const permission = PERMISSION_LIST[wholesalerId]
    ? PERMISSION_LIST[wholesalerId]
    : 1
  switch (permission) {
    case PERMISSION_ALL:
      return menuDefault
    case PERMISSION_BOOKING_SETTLEMENT_FACILITY:
      menuDefault = menuDefault.filter(
        (parent) => !MENU_NOT_PEM_SALE_ROOMPLAN.includes(parent.key)
      )
      return menuDefault
    case PERMISSION_FOR_TL_TEMA:
      menuDefault = menuDefault.map((parent) => ({
        ...parent,
        items: parent.items.filter(
          (child) => !MENU_NOT_STOCK_PRICE.includes(child.href) && !MENU_NOT_CREATE_ROOM_PLAN.includes(child.href)
        ),
      }))
      return menuDefault
    case PERMISSION_NOT_STOCK_PRICE:
      menuDefault = menuDefault.map((parent) => ({
        ...parent,
        items: parent.items.filter(
          (child) => !MENU_NOT_STOCK_PRICE.includes(child.href)
        ),
      }))
      return menuDefault
    case PERMISSION_NOT_STOCK_PRICE_CANCELPOLICY:
      menuDefault = menuDefault.filter(
        (parent) => !MENU_NOT_PEM_SALE_ROOMPLAN.includes(parent.key)
      )
      menuDefault = menuDefault.map((parent) => ({
        ...parent,
        items: parent.items.filter(
          (child) => !MENU_NOT_STOCK_PRICE_CANCELPOLICY.includes(child.href)
        ),
      }))
      return menuDefault
    case PERMISSION_PARENT:
      menuDefault = menuDefault.filter(
        (parent) => !MENU_NOT_PEM_PARENT.includes(parent.key)
      )
      return menuDefault
    default:
      return menuDefault
  }
}

// Middlewareで権限を確認する
export const checkAccessPermission = (
  wholesalerId: number,
  path: string
): boolean => {
  const permission = PERMISSION_LIST[wholesalerId]
    ? PERMISSION_LIST[wholesalerId]
    : 1
  if(wholesalerId === WHOLESALER_ID_TL){
    for(let i=0; i < ACCESS_DENY_LIST[permission].length; i++){
      if(path.indexOf(ACCESS_DENY_LIST[permission][i]) != -1){
        return true
      }
    }
    return false
  }else{
    return ACCESS_DENY_LIST[permission].includes(path)
  }
}
