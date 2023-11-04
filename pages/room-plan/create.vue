<template>
  <main class="flex-1 pt-8 px-3">
    <Breadcrumb :breadcrumb-list="breadcrumbList" class="mb-8" />
    <div>
      <Tabs
        class="-mb-px"
        :tab-data="tabData"
        :active-tab="activeTab"
        position="right"
        tab-width="w-57"
        @click="clickTab"
      >
        <p class="text-sm text-black w-full">
          {{ $t('room.formNavigation') }}
        </p>
      </Tabs>
    </div>
    <RoomInput
      v-if="isOpen && isRoomTab"
      :room-detail="roomDetail"
      :amenities="amenities"
      :room-kinds="roomKinds"
      :save-room="saveRoom"
      :property-id="propertyId"
      :is-direct="isDirect"
      :images-room-list="images"
      :is-copy="isCopy"
    />
    <PlanInput
      v-if="isOpen && isPlanTab"
      :plan-detail="planDetail"
      :rooms="rooms"
      :save-plan="savePlan"
      :images="images"
      :is-direct="isDirect"
      :is-copy="isCopy"
      :set-tab="setTab"
      :is-hide-stock-price="isHideStockPrice"
      :cancel-policies="cancelPolicies"
      :fetch-room-info-preview="fetchRoomInfoPreview"
      :fetch-room-amenity-list="fetchRoomAmenityList"
      :fetch-cancel-policy-info="fetchCancelPolicyInfo"
    />
    <div
      v-if="!isOpen"
      class="border border-solid border-bdColor p-0 mb-6 w-full"
    >
      <Empty> {{ $t('room.isLoading') }} </Empty>
    </div>
  </main>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import {
  RoomRepository,
  ImageRepository,
  PlanRepository,
  CancelPolicyRepository,
} from '~/repositories'
import { Global, Room, Plan, ImageManage, CancelPolicy } from '~/types'
import { accountStore, roomAndPlanStore } from '~/store'
import { WHOLESALER_ID_DIRECT } from '~/utils/const'
import { PERMISSION_NOT_STOCK_PRICE, PERMISSION_LIST } from '~/utils/permission'

@Component({
  layout: 'AfterLogin',
  middleware: ['auth'],
  components: {
    Breadcrumb: () => import('~/components/molecules/Breadcrumb.vue'),
    Tabs: () => import('~/components/molecules/Tabs.vue'),
    Icon: () => import('~/components/atoms/Icon.vue'),
    RoomInput: () => import('~/components/organisms/RoomInput.vue'),
    PlanInput: () => import('~/components/organisms/PlanInput.vue'),
    Empty: () => import('~/components/molecules/Empty.vue'),
  },
})
export default class extends Vue {
  head() {
    return {
      title: `${this.$t('global.title.roomPlanCreate') as string} | Skyticket ${
        this.$t('global.title.admin') as string
      }`,
    }
  }

  private tabData: Global.TabCategory[] = [
    {
      value: '1',
      name: this.$t('roomPlan.tab.roomCreate') as string,
    },
    {
      value: '2',
      name: this.$t('roomPlan.tab.planCreate') as string,
      disable: false,
    },
  ]

  private amenities: Room.Amenity[] = []
  private roomKinds: Room.RoomKind[] = []
  private images: ImageManage.Main[] = []
  private breadcrumbList: Global.BreadCrumb[] = accountStore.currentBreadCrumbs
  private activeTab: string = this.tabData[0].value
  private roomDetail: Room.Detail | null = null
  private planDetail: Plan.Detail | null = null
  private isOpen: boolean = false
  private isCopy: boolean = false
  private rooms: Room.RoomForPlanEdit[] = []
  private cancelPolicies: CancelPolicy.Item[] = []
  private cancelPolicyRepository = new CancelPolicyRepository()
  private roomRepository = new RoomRepository()
  private defaultCancelPolicy: CancelPolicy.Item[] = [
    {
      id: 0,
      propertyId: accountStore.activeFacilityInfo.propertyId.toString(),
      name: this.$t('cancelPolicy.policyList.default') as string,
      isDefault: true,
    },
  ]

  get propertyId(): number {
    return accountStore.activeFacilityInfo.propertyId
  }

  get isRoomTab(): boolean {
    return this.activeTab === this.tabData[0].value
  }

  get isPlanTab(): boolean {
    return this.activeTab === this.tabData[1].value
  }

  get isDirect(): boolean {
    return WHOLESALER_ID_DIRECT === accountStore.wholesalerId
  }

  get isHideStockPrice(): boolean {
    return (
      PERMISSION_LIST[accountStore.wholesalerId] === PERMISSION_NOT_STOCK_PRICE
    )
  }

  async created(): Promise<void> {
    const imageRepository = new ImageRepository()

    this.amenities = await this.roomRepository.fetchRoomAmenities()
    this.roomKinds = await this.roomRepository.fetchRoomKinds()

    this.images = await imageRepository.fetchImages({
      propertyId: this.propertyId,
    })

    const resCancelPolicyList = await this.cancelPolicyRepository.fetchCancelPolicyList(
      accountStore.activeFacilityInfo.propertyId
    )
    this.cancelPolicies = [...this.defaultCancelPolicy, ...resCancelPolicyList]

    // 部屋の一覧取得
    // 部屋がない場合、プラン作成は表示しない
    const fetchedRoom = await this.roomRepository.fetchRoomList(this.propertyId)
    this.tabData[1].disable = fetchedRoom.length === 0
    this.rooms = fetchedRoom.map(
      (roomData): Room.RoomForPlanEdit => ({
        roomTypeId: roomData.roomTypeId,
        name: roomData.name,
        roomTypeCode: roomData.roomTypeCode,
      })
    )

    // 部屋のコピー
    // コピーするデータがあれば、部屋情報をRoomInputに送る
    const copyRoomData = roomAndPlanStore.getCopyRoomData
    if (copyRoomData.roomTypeId > 0) {
      this.roomDetail = { ...copyRoomData, roomTypeCode: '', roomTypeId: 0 }
      this.amenities.forEach((amenity, index) => {
        this.amenities[index].isSelected =
          this.roomDetail!.amenityIdList &&
          this.roomDetail!.amenityIdList.some(
            (amenityId) => amenityId === amenity.amenityId
          )
      })
      this.isCopy = true
      roomAndPlanStore.clearCopyRoomData()
    }

    // プランのコピー
    // コピーするデータがあれば、プラン情報をPlanInputに送る
    const copyPlanData = roomAndPlanStore.getCopyPlanData
    if (copyPlanData.planId > 0) {
      this.planDetail = { ...copyPlanData, planId: 0, planCode: '', images: [] }
      roomAndPlanStore.clearCopyPlanData()
      this.activeTab = this.tabData[1].value
      this.isCopy = true
    }
    this.isOpen = true
  }

  private async fetchRoomAmenityList(): Promise<Room.Amenity[]> {
    return await this.roomRepository.fetchRoomAmenities()
  }

  private async fetchRoomInfoPreview(
    roomTypeId: number[]
  ): Promise<Room.Detail[]> {
    const roomsData: Room.Detail[] = []
    for await (const roomId of roomTypeId) {
      const resRoomDetail: Room.Detail = await this.roomRepository.fetchRoomDetail(
        this.propertyId,
        roomId
      )
      roomsData.push(resRoomDetail)
    }
    return roomsData
  }

  private async fetchCancelPolicyInfo(
    cancelPolicyId: number
  ): Promise<CancelPolicy.SettingsWithName | null> {
    return await this.cancelPolicyRepository.fetchCancelPolicy(
      accountStore.activeFacilityInfo.propertyId,
      cancelPolicyId
    )
  }

  private async saveRoom(inputData: Room.Input): Promise<string> {
    const roomRepository = new RoomRepository()
    inputData.propertyId = this.propertyId
    return await roomRepository.createRoom(inputData)
  }

  private async savePlan(inputData: Plan.Input): Promise<string> {
    inputData.propertyId = this.propertyId
    const planRepository = new PlanRepository()
    return await planRepository.createPlan(inputData)
  }

  private clickTab(value: string): void {
    if (!value) return
    this.activeTab = value
  }

  private setTab() {
    roomAndPlanStore.setActiveTab('2')
  }
}
</script>
