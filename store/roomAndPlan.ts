/*
 * ログインしているアカウントに紐づくstore
 */

import { VuexModule, Module, Mutation, Action } from 'vuex-module-decorators'
import { Global, Room, Plan } from '~/types'
import { RoomRepository, PlanRepository } from '~/repositories'
import { accountStore } from '~/store'

export interface RoomAndPlanState {
  copyRoomData: Room.Detail
  copyPlanData: Plan.Detail
  activeTabList: string
  isShowGoBack: boolean
  selectedShowRoom: Global.SelectboxItem | null
  selectedShowPlan: Global.SelectboxItem | null
}

const DEFAULT_ROOM = {
  propertyId: 0,
  roomTypeId: 0,
  roomTypeCode: '',
  name: '',
  roomKindId: 0,
  stockSettingStart: '',
  stockSettingEnd: '',
  isSettingStockYearRound: false,
  isStopSales: false,
  isSmoking: false,
  ocuMin: 0,
  ocuMax: 0,
  roomDesc: '',
  amenityIdList: [],
  images: [],
}

const DEFAULT_PLAN = {
  planId: 0,
  planGroupId: 0,
  roomTypeId: 0,
  propertId: 0,
  planCancelPolicyId: 0,
  name: '',
  planCode: '',
  selectedRooms: [],
  description: '',
  chargeCategory: 1,
  taxCategory: false,
  minStayNum: 0,
  maxStayNum: 0,
  isAccommodatedYearRound: false,
  accommodationPeriodStart: '',
  accommodationPeriodEnd: '',
  publishingStartDate: '',
  publishingEndDate: '',
  isPublishedYearRound: false,
  reserveAcceptDate: 0,
  reserveAcceptTime: '',
  reserveDeadlineDate: 0,
  reserveDeadlineTime: '',
  mealConditionBreakfast: false,
  mealConditionLunch: false,
  mealConditionDinner: false,
  isPackage: false,
  isNoCancel: false,
  isStopSales: false,
  childA: {
    receive: false,
    rateCategory: 0,
    rate: 0,
    calcCategory: false,
  },
  childB: {
    receive: false,
    rateCategory: 0,
    rate: 0,
    calcCategory: false,
  },
  childC: {
    receive: false,
    rateCategory: 0,
    rate: 0,
    calcCategory: false,
  },
  childD: {
    receive: false,
    rateCategory: 0,
    rate: 0,
    calcCategory: false,
  },
  childE: {
    receive: false,
    rateCategory: 0,
    rate: 0,
    calcCategory: false,
  },
  childF: {
    receive: false,
    rateCategory: 0,
    rate: 0,
    calcCategory: false,
  },
  image: {
    imageId: 0,
    order: 0,
    href: '',
  },
}

@Module({ stateFactory: true, namespaced: true, name: 'roomAndPlan' })
export default class extends VuexModule implements RoomAndPlanState {
  copyRoomData: Room.Detail = { ...DEFAULT_ROOM }
  copyPlanData: Plan.Detail = { ...DEFAULT_PLAN }
  activeTabList: string = '1'
  isShowGoBack: boolean = false
  selectedShowRoom: Global.SelectboxItem | null = null
  selectedShowPlan: Global.SelectboxItem | null = null

  get getCopyRoomData(): Room.Detail {
    return this.copyRoomData
  }

  get getCopyPlanData(): Plan.Detail {
    return this.copyPlanData
  }

  get getIsShowGoBack(): boolean {
    return this.isShowGoBack
  }

  get getActiveTab(): string {
    return this.activeTabList
  }

  get getSelectedShowRoom(): Global.SelectboxItem | null {
    return this.selectedShowRoom
  }

  get getSelectedShowPlan(): Global.SelectboxItem | null {
    return this.selectedShowPlan
  }

  @Mutation
  public SET_ROOMDATA(input: Room.Detail): void {
    this.copyRoomData = input
  }

  @Mutation
  public SET_PLANDATA(input: Plan.Detail): void {
    this.copyPlanData = input
  }

  @Mutation
  public SET_ACTIVE_TAB(tabSelected: string): void {
    this.activeTabList = tabSelected
  }

  @Mutation
  public SET_IS_SHOWBACK(status: boolean): void {
    this.isShowGoBack = status
  }

  @Mutation
  public SET_SELECTED_SHOW_ROOM(item: Global.SelectboxItem): void {
    this.selectedShowRoom = item
  }

  @Mutation
  public SET_SELECTED_SHOW_PLAN(item: Global.SelectboxItem): void {
    this.selectedShowPlan = item
  }

  @Mutation
  public CLEAR_STATE(): void {
    this.selectedShowRoom = null
    this.selectedShowPlan = null
  }

  @Action({ rawError: true })
  public async setCopyRoomData(roomTypeId: number): Promise<boolean> {
    const roomRepository = new RoomRepository()
    const roomDetail = await roomRepository.fetchRoomDetail(
      accountStore.activeFacilityInfo.propertyId,
      roomTypeId
    )
    if (!roomDetail.roomTypeId) {
      return false
    }

    this.SET_ROOMDATA(roomDetail)
    return true
  }

  @Action({ rawError: true })
  public async setCopyPlanData(planId: number): Promise<boolean> {
    const planRepository = new PlanRepository()
    const planDetail = await planRepository.fetchPlanDetail(
      accountStore.activeFacilityInfo.propertyId,
      planId
    )
    if (!planDetail.planId) {
      return false
    }

    this.SET_PLANDATA(planDetail)
    return true
  }

  @Action({ rawError: true })
  public clearCopyRoomData(): void {
    this.SET_ROOMDATA({ ...DEFAULT_ROOM })
  }

  @Action({ rawError: true })
  public clearCopyPlanData(): void {
    this.SET_PLANDATA({ ...DEFAULT_PLAN })
  }

  @Action({ rawError: true })
  public setActiveTab(tabSelected: string): void {
    this.SET_ACTIVE_TAB(tabSelected)
  }

  @Action({ rawError: true })
  public resetActiveTab(): void {
    this.SET_ACTIVE_TAB('1')
  }

  @Action({ rawError: true })
  public setIsShowBack(status: boolean): void {
    this.SET_IS_SHOWBACK(status)
  }

  @Action({ rawError: true })
  public setSelectedShowRoom(item: Global.SelectboxItem): void {
    this.SET_SELECTED_SHOW_ROOM(item)
  }

  @Action({ rawError: true })
  public setSelectedShowPlan(item: Global.SelectboxItem): void {
    this.SET_SELECTED_SHOW_PLAN(item)
  }

  @Action({ rawError: true })
  public initLogin(): void {
    this.CLEAR_STATE()
  }
}
