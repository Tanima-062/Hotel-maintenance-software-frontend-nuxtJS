import { $axios, setToken } from '~/utils/api'
import { Account } from '~/types'

export default class AccountRepository {
  // ログインし、API接続用のTokenを取得
  async login({
    userId,
    password,
  }: Account.LoginInput): Promise<Account.LoginOutput> {
    const res = await $axios.post(`${process.env.apiUrlPrefix}/login`, {
      username: userId,
      password,
    })
    setToken(res.data.api_token)
    return {
      status: res.status,
      apiToken: res.data.api_token,
    }
  }

  // ログアウト処理
  async logout(): Promise<void> {
    try {
      await $axios.post(`${process.env.apiUrlPrefix}/logout`)
    } catch (e) {} // 意図的にエラー破棄
  }

  // hotelmanagerのデータを取得
  async fetchHotelManagerInfo(): Promise<Account.HotelManagerInfo | null> {
    const res = await $axios.get(`${process.env.apiUrlPrefix}/account`)

    if (res.status !== 200 || !res.data) {
      return null
    }
    return {
      firstname: res.data.first_name_enc,
      lastname: res.data.last_name_enc,
      email: res.data.email_enc,
      username: res.data.username_enc,
      hotelManagerId: res.data.hotel_manager_id,
      propertyId: res.data.property_id,
      wholesalerId: res.data.wholesaler_id,
    }
  }

  async checkToken(): Promise<Account.APIToken> {
    const res = await $axios.get(`${process.env.apiUrlPrefix}/token/check`)
    if (res.status !== 200) {
      return { apiToken: '' }
    }
    setToken(res.data.api_token)
    return { apiToken: res.data.api_token }
  }

  saveLoginInfo({ userId, isEnabled }: Account.UserIdInLocalStorage): void {
    localStorage.setItem(
      'HMLoginInfo',
      JSON.stringify({
        userId,
        isEnabled,
      })
    )
  }

  loadAccountInfo(): Account.UserIdInLocalStorage {
    const res = localStorage.getItem('HMLoginInfo')
    if (res) {
      return JSON.parse(res)
    }
    return { userId: '', isEnabled: false }
  }

  async isLatestAppVersion(): Promise<boolean> {
    const res = await $axios.get(
      `${process.env.webUrlPrefix}/json/revision.json`
    )
    if (!res || !res.data || !res.data.deployDate) {
      throw new Error('アプリのデプロイバージョンが取得できません。')
    }
    const storage = localStorage.getItem('HMAppDeployDate')
    if (storage) {
      const localData = JSON.parse(storage)
      if (localData.deployDate === res.data.deployDate) {
        return true
      }
    }
    localStorage.setItem(
      'HMAppDeployDate',
      JSON.stringify({
        deployDate: res.data.deployDate,
      })
    )
    return false
  }

  async changePassword({
    userId,
    oldPassword,
    newPassword,
  }: Account.ChangePassword): Promise<void> {
    await $axios.put(`${process.env.apiUrlPrefix}/password`, {
      username: userId,
      password: oldPassword,
      new_password: newPassword,
    })
  }

  async fetchParentCheck(propertyId: number): Promise<boolean> {
    const res = await $axios.get(
      `${process.env.apiUrlPrefix}/account/parent-check/${propertyId}`
    )
    return res.data
  }
}
