import { IVueI18n } from 'vue-i18n'
import { Global } from '~/types'
import { checkPermissionMenu } from '~/utils/permission'
import { CANCEL_POLICY_NON_LIST } from '~/utils/const'

const pageStructure = (
  i18n: IVueI18n,
  wholesalerId = 0
): Global.PAGE_STRUCTURE_TOP[] => {
  return [
    {
      key: 'booking',
      name: i18n.t('global.header.tabs.booking.name'),
      items: [
        {
          href: '/booking',
          name: i18n.t('global.header.tabs.booking.items.list'),
          isShowOnMenu: true,
        },
      ],
    },
    {
      key: 'settlement',
      name: i18n.t('global.header.tabs.payment.name'),
      items: [
        {
          href: '/settlement/edit',
          name: i18n.t('global.header.tabs.payment.items.info'),
          isShowOnMenu: true,
        },
        {
          href: '/settlement',
          name: i18n.t('global.header.tabs.payment.items.list'),
          isShowOnMenu: true,
        },
      ],
    },
    {
      key: 'facility',
      name: i18n.t('global.header.tabs.facility.name'),
      items: [
        {
          href: '/facility/edit',
          name: i18n.t('global.header.tabs.facility.items.info'),
          isShowOnMenu: true,
        },
        {
          href: '/album',
          name: i18n.t('global.header.tabs.facility.items.album'),
          isShowOnMenu: true,
        },
        {
          href: CANCEL_POLICY_NON_LIST.includes(wholesalerId)
            ? '/cancel-policy/edit'
            : '/cancel-policy',
          name: i18n.t('global.header.tabs.facility.items.cancelPolicy'),
          isShowOnMenu: true,
        },
        {
          href: '/cancel-policy/create',
          name: i18n.t('global.header.tabs.facility.items.cancelPolicyCreate'),
          isShowOnMenu: false,
        },
        {
          href: '/cancel-policy/edit',
          name: i18n.t('global.header.tabs.facility.items.cancelPolicyEdit'),
          isShowOnMenu: false,
        },
      ],
    },
    {
      key: 'roomandplan',
      name: i18n.t('global.header.tabs.roomandplan.name'),
      items: [
        {
          href: '/room-plan/create',
          name: i18n.t('global.header.tabs.roomandplan.items.create'),
          isShowOnMenu: true,
        },
        {
          href: '/room-plan',
          name: i18n.t('global.header.tabs.roomandplan.items.list'),
          isShowOnMenu: true,
          items: [
            {
              href: '/room/edit',
              name: i18n.t('global.header.tabs.roomandplan.items.edit'),
              isShowOnMenu: true,
            },
            {
              href: '/room/details',
              name: i18n.t('global.header.tabs.roomandplan.items.details'),
              isShowOnMenu: true,
            },
            {
              href: '/plan/edit',
              name: i18n.t('global.header.tabs.roomandplan.items.edit'),
              isShowOnMenu: true,
            },
            {
              href: '/plan/details',
              name: i18n.t('global.header.tabs.roomandplan.items.details'),
              isShowOnMenu: true,
            },
          ],
        },
      ],
    },
    {
      key: 'sale',
      name: i18n.t('global.header.tabs.sale.name'),
      items: [
        {
          href: '/stock-rate',
          name: i18n.t('global.header.tabs.sale.items.stockAndFee'),
          isShowOnMenu: true,
        },
        {
          href: '/charge/edit',
          name: i18n.t('global.header.tabs.sale.items.chargeManagement'),
          isShowOnMenu: true,
        },
        {
          href: '/stock/edit',
          name: i18n.t('global.header.tabs.sale.items.stockManagement'),
          isShowOnMenu: true,
        },
      ],
    },
  ]
}

export const getHeaderList = (
  i18n: IVueI18n,
  wholesalerId: number,
  parentAccount: boolean = false
) => {
  let pages = pageStructure(i18n, wholesalerId)
  // Check Permission
  pages = checkPermissionMenu(pages, parentAccount ? 0 : wholesalerId)
  const headers = pages.map((parent) => ({
    ...parent,
    items: parent.items.filter((child) => child.isShowOnMenu),
  }))

  return headers
}

export const getActiveMenuTab = (
  i18n: IVueI18n,
  currentPath: string
): string => {
  const pages = pageStructure(i18n)
  const page = pages.find((parent) =>
    parent.items.some(
      (child) => child.href.replace(/^\/([^/]*).*$/, '$1') === currentPath
    )
  )
  return !page ? '' : page.key
}

export const getBreadCrumb = (
  i18n: IVueI18n,
  currentPath: string
): Global.BreadCrumb[] => {
  const res: Global.BreadCrumb[] = []
  const pages = pageStructure(i18n)

  const paths = currentPath.split('/')
  const end = paths[paths.length - 1]
  let checkPath = ''
  if (!Number.isNaN(Number(end))) {
    paths.pop()
    checkPath = paths.join('/')
  } else {
    checkPath = currentPath
  }

  // ページのitemsが存在すれば探して、一致するものがあればパンくずにpushする処理
  const searchRecursive = (child: Global.PAGE_STRUCTURE_CHILD): boolean => {
    if (child.href === checkPath) {
      res.unshift({ name: child.name as string, href: child.href })
      return true
    }
    if (!!child.items && child.items.length) {
      const exist = child.items.some(searchRecursive)
      if (exist) {
        res.unshift({ name: child.name as string, href: child.href })
      }
      return exist
    }
    return false
  }

  pages.forEach((parent: Global.PAGE_STRUCTURE_TOP) => {
    if (parent.items.some(searchRecursive)) {
      res.unshift({ name: parent.name as string, href: '/' })
    }
  })
  return res
}
