<template>
  <main class="flex-1 pt-8 px-3">
    <Breadcrumb :breadcrumb-list="breadcrumbList" class="mb-8" />
    <p class="mb-2 text-sm text-black w-full">
      {{ $t('plan.pageDescription') }}
    </p>
    <PlanInput
      v-if="planDetail"
      :plan-detail="planDetail"
      :save-plan="savePlan"
      :is-edit="true"
      :rooms="rooms"
      :is-direct="isDirect"
      :images="images"
      :set-tab="setTab"
      :fetch-room-info-preview="fetchRoomInfoPreview"
      :fetch-room-amenity-list="fetchRoomAmenityList"
      :is-hide-stock-price="isHideStockPrice"
      :cancel-policies="cancelPolicies"
      :fetch-cancel-policy-info="fetchCancelPolicyInfo"
    />
    <div
      v-if="isLoading"
      class="border border-solid border-bdColor p-0 mb-6 w-full"
    >
      <Empty> {{ $t('room.isLoading') }} </Empty>
    </div>
  </main>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import {
  PlanRepository,
  RoomRepository,
  ImageRepository,
  CancelPolicyRepository,
} from '~/repositories'
import { Global, Plan, Room, ImageManage, CancelPolicy } from '~/types'
import { accountStore, roomAndPlanStore } from '~/store'
import { WHOLESALER_ID_DIRECT } from '~/utils/const'
import { PERMISSION_NOT_STOCK_PRICE, PERMISSION_LIST } from '~/utils/permission'

@Component({
  layout: 'AfterLogin',
  middleware: ['auth'],
  components: {
    Breadcrumb: () => import('~/components/molecules/Breadcrumb.vue'),
    PlanInput: () => import('~/components/organisms/PlanInput.vue'),
    Empty: () => import('~/components/molecules/Empty.vue'),
  },
})
export default class extends Vue {
  head() {
    return {
      title: `${this.$t('global.title.planEdit') as string} | Skyticket ${
        this.$t('global.title.admin') as string
      }`,
    }
  }

  private breadcrumbList: Global.BreadCrumb[] = accountStore.currentBreadCrumbs
  private planDetail: Plan.Detail | null = null
  private isLoading: boolean = false
  private rooms: Room.RoomForPlanEdit[] = []
  private images: ImageManage.Main[] = []
  private cancelPolicies: CancelPolicy.Item[] = []
  private planRepository = new PlanRepository()
  private roomRepository = new RoomRepository()
  private cancelPolicyRepository = new CancelPolicyRepository()
  private defaultTime: string = '00:00'
  private defaultCancelPolicy: CancelPolicy.Item[] = [
    {
      id: 0,
      propertyId: accountStore.activeFacilityInfo.propertyId.toString(),
      name: this.$t('cancelPolicy.policyList.default') as string,
      isDefault: false,
    },
  ]

  get isDirect(): boolean {
    return WHOLESALER_ID_DIRECT === accountStore.wholesalerId
  }

  get propertyId(): number {
    return accountStore.activeFacilityInfo.propertyId
  }

  private async fetchCancelPolicyInfo(
    cancelPolicyId: number
  ): Promise<CancelPolicy.SettingsWithName | null> {
    return await this.cancelPolicyRepository.fetchCancelPolicy(
      accountStore.activeFacilityInfo.propertyId,
      cancelPolicyId
    )
  }

  async created(): Promise<void> {
    this.isLoading = true
    const imageRepository = new ImageRepository()

    const fetchedRoom = await this.roomRepository.fetchRoomList(this.propertyId)
    this.rooms = fetchedRoom.map(
      (roomData): Room.RoomForPlanEdit => ({
        roomTypeId: roomData.roomTypeId,
        name: roomData.name,
        roomTypeCode: roomData.roomTypeCode,
      })
    )

    this.images = await imageRepository.fetchImages({
      propertyId: this.propertyId,
    })

    const resCancelPolicyList = await this.cancelPolicyRepository.fetchCancelPolicyList(
      accountStore.activeFacilityInfo.propertyId
    )
    this.cancelPolicies = [...this.defaultCancelPolicy, ...resCancelPolicyList]

    const planId = Number(this.$route.params.planId)
    if (Number.isNaN(planId)) {
      this.$nuxt.error({ statusCode: 404 })
    }
    this.planDetail = await this.planRepository.fetchPlanDetail(
      this.propertyId,
      planId
    )
    this.planDetail.checkInStart =
      this.planDetail.checkInStart || this.defaultTime
    this.planDetail.checkInEnd = this.planDetail.checkInEnd || this.defaultTime
    this.planDetail.checkOut = this.planDetail.checkOut || this.defaultTime
    if (!this.planDetail.planId) {
      this.$nuxt.error({ statusCode: 404 })
    }
    this.isLoading = false
  }

  get isHideStockPrice(): boolean {
    return (
      PERMISSION_LIST[accountStore.wholesalerId] === PERMISSION_NOT_STOCK_PRICE
    )
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

  private async fetchRoomAmenityList(): Promise<Room.Amenity[]> {
    return await this.roomRepository.fetchRoomAmenities()
  }

  private setTab() {
    roomAndPlanStore.setActiveTab('2')
  }

  private async savePlan(inputData: Plan.Input): Promise<string> {
    inputData.propertyId = this.propertyId
    return await this.planRepository.updatePlan(inputData)
  }
}
</script>
