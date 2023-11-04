import { Route } from 'vue-router'
import { IVueI18n } from 'vue-i18n'
import { accountStore } from '~/store'
import { AccountRepository } from '~/repositories'
import { checkAccessPermission } from '~/utils/permission'
import { getActiveMenuTab, getBreadCrumb } from '~/utils/pageStructure'

export default async function ({
  redirect,
  route,
  app: { i18n },
}: {
  redirect: Function
  route: Route
  app: { i18n: IVueI18n }
}): Promise<void> {
  const accountRepo = new AccountRepository()
  const res = await accountRepo.isLatestAppVersion()
  if (!res) {
    // NOTE: 非推奨だが、代替案が出るまではこれで…
    // tslint:disable-next-line
    window.location.reload(true)
  }
  if (!(await accountStore.checkToken())) {
    redirect('/login')
  }
  const routePathTarget = route.path.replace(/\/$/, '')
  if (
    checkAccessPermission(
      accountStore.isParentAccount ? 0 : accountStore.wholesalerId,
      routePathTarget
    )
  ) {
    redirect('/error')
  }

  const activeKey = getActiveMenuTab(
    i18n,
    route.path.replace(/^\/([^/]*).*$/, '$1')
  )
  accountStore.setMenuActiveKey(activeKey)
  const breadCrumbs = getBreadCrumb(i18n, route.path)
  accountStore.setBreadCrumbs(breadCrumbs)
}
