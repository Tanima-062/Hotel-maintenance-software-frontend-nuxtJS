// https://typescript.nuxtjs.org/ja/cookbook/store/
import { NuxtAxiosInstance } from '@nuxtjs/axios'
import { Account } from '~/types'

let $axios: NuxtAxiosInstance // eslint-disable-line

export function initializeAxios(axiosInstance: NuxtAxiosInstance) {
  $axios = axiosInstance

  const session = window.sessionStorage.getItem('hotelManager')
  if (session) {
    const sessionHM: Account.SessionAPIToken = JSON.parse(session || '')
    if (sessionHM && sessionHM.account && sessionHM.account.apiToken) {
      setToken(sessionHM.account.apiToken)
    }
  }
}

export const setToken = (token: string): void => {
  $axios.setToken(token, 'Bearer')
}

export { $axios }
