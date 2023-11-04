/*
 * ログインしているアカウントに紐づくstore
 */

import { VuexModule, Module, Mutation, Action } from 'vuex-module-decorators'
import { Account, Facility, Global } from '~/types'
import { AccountRepository, FacilityRepository } from '~/repositories'

export interface AccountState {
  username: string
  wholesalerId: number
  hotelManagerId: number
  apiToken: string
  activeFacility: Facility.ListInLocal
  userInfo: Account.UserInformation
  menuSelected: string
  breadCrumbs: Global.BreadCrumb[]
  isParentAccount: boolean
}

@Module({ stateFactory: true, namespaced: true, name: 'account' })
export default class extends VuexModule implements AccountState {
  breadCrumbs: Global.BreadCrumb[] = []
  menuSelected: string = ''
  username: string = ''
  wholesalerId: number = 0
  hotelManagerId: number = 0
  apiToken: string = ''
  isParentAccount = false
  activeFacility = {
    name: '',
    propertyId: 0,
    dispPriority: false,
    wholesalerId: 0,
  }

  userInfo = {
    firstname: '',
    lastname: '',
    email: '',
  }

  get currentWholesalerId(): number {
    return this.wholesalerId
  }

  get activeUsername(): string {
    return this.username
  }

  get userInformation(): Account.UserInformation {
    return this.userInfo
  }

  get activeFacilityInfo(): Facility.ListInLocal {
    return this.activeFacility
  }

  get activeMenu(): string {
    return this.menuSelected
  }

  get currentBreadCrumbs(): Global.BreadCrumb[] {
    return this.breadCrumbs
  }

  get checkIsParent(): boolean {
    return this.isParentAccount
  }

  @Mutation
  public CLEAR_STATE(): void {
    this.username = ''
    this.wholesalerId = 0
    this.hotelManagerId = 0
    this.apiToken = ''
    this.activeFacility = {
      name: '',
      propertyId: 0,
      dispPriority: false,
      wholesalerId: 0,
    }
    sessionStorage.clear()
  }

  @Mutation
  public SET_HOTEL_MANAGER_INFO({
    firstname,
    lastname,
    email,
    username,
    wholesalerId,
    hotelManagerId,
  }: Account.HotelManagerInfo): void {
    this.userInfo = {
      firstname,
      lastname,
      email,
    }
    this.username = username
    this.wholesalerId = wholesalerId
    this.hotelManagerId = hotelManagerId
  }

  @Mutation
  public SET_API_TOKEN(apiToken: string): void {
    this.apiToken = apiToken
  }

  @Mutation
  public SET_ACTIVE_FACILITY(facilityInfo: Facility.ListInLocal): void {
    this.activeFacility = facilityInfo
  }

  @Mutation
  public SET_MENU_ACTIVE_KEY(menuSelected: string): void {
    this.menuSelected = menuSelected
  }

  @Mutation
  public SET_IS_PARENT_ACCOUNT(status: boolean): void {
    this.isParentAccount = status
  }

  @Mutation
  public SET_BRAEDCRUMBS(bc: Global.BreadCrumb[]): void {
    this.breadCrumbs = bc
  }

  @Action({ rawError: true })
  public updateActiveFacility(facilityInfo: Facility.ListInLocal): void {
    this.SET_ACTIVE_FACILITY(facilityInfo)
  }

  @Action({ rawError: true })
  public async login({
    userId,
    password,
  }: Account.LoginInput): Promise<boolean> {
    const accountRepository = new AccountRepository()
    const facilityRepository = new FacilityRepository()
    try {
      const result: Account.LoginOutput = await accountRepository.login({
        userId,
        password,
      })
      if (result.status !== 200) {
        throw new Error('ログインエラー')
      }
      const [facilityList, hotelManagerInfo] = await Promise.all([
        facilityRepository.fetchFacilityList(),
        accountRepository.fetchHotelManagerInfo(),
      ])
      if (!hotelManagerInfo) {
        throw new Error('ログインエラー')
      }

      if (facilityList.length === 0) {
        throw new Error('ログインエラー')
      }
      const facility =
        hotelManagerInfo.propertyId === 0
          ? facilityList[0]
          : facilityList.find(
              (facility) => facility.propertyId === hotelManagerInfo.propertyId
            )!
      const activeFacility: Facility.ListInLocal = {
        ...facility,
      }
      this.SET_ACTIVE_FACILITY(activeFacility)
      this.SET_HOTEL_MANAGER_INFO(hotelManagerInfo)
      this.SET_API_TOKEN(result.apiToken)
      const parentStatus = await accountRepository.fetchParentCheck(
        hotelManagerInfo.hotelManagerId
      )
      this.SET_IS_PARENT_ACCOUNT(parentStatus)

      return true
    } catch (e) {
      sessionStorage.clear()
      console.error(e)
      return false
    }
  }

  @Action({ rawError: true })
  public async checkToken(): Promise<boolean> {
    const accountRepository = new AccountRepository()
    try {
      const res: Account.APIToken = await accountRepository.checkToken()
      if (!res.apiToken) {
        throw new Error('tokenが不正です。')
      }
      this.SET_API_TOKEN(res.apiToken)
      return true
    } catch (e) {
      this.CLEAR_STATE()
      console.error(e)
      return false
    }
  }

  @Action({ rawError: true })
  public loadAccountInfo(): Account.UserIdInLocalStorage {
    const accountRepository = new AccountRepository()
    return accountRepository.loadAccountInfo()
  }

  @Action({ rawError: true })
  public async changePassword({
    userId,
    oldPassword,
    newPassword,
  }: Account.ChangePassword): Promise<boolean> {
    try {
      const accountRepository = new AccountRepository()
      await accountRepository.changePassword({
        userId,
        oldPassword,
        newPassword,
      })
      return true
    } catch (error) {
      return false
    }
  }

  @Action({ rawError: true })
  public async logout(): Promise<void> {
    const accountRepository = new AccountRepository()
    await accountRepository.logout()
    this.CLEAR_STATE()
  }

  @Action({ rawError: true })
  public initLogin(): void {
    this.CLEAR_STATE()
  }

  @Action({ rawError: true })
  setMenuActiveKey(menuSelected: string) {
    this.SET_MENU_ACTIVE_KEY(menuSelected)
  }

  @Action({ rawError: true })
  setBreadCrumbs(breadCrumbs: Global.BreadCrumb[]) {
    this.SET_BRAEDCRUMBS(breadCrumbs)
  }
}
