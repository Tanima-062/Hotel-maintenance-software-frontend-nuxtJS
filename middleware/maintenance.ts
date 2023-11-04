import { Route } from 'vue-router'
import { IS_MAINTENANCE } from '~/utils/const'

export default function ({
  redirect,
  route,
}: {
  redirect: Function
  route: Route
}): void {
  if (IS_MAINTENANCE && route.path !== '/maintenance') {
    redirect('/maintenance')
  }
}
