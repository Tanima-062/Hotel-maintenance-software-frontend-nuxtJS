<template>
  <main class="flex-1 pt-8 px-3">
    <Breadcrumb :breadcrumb-list="breadcrumbList" class="mb-8" />
    <PlanDetail
      v-if="planDetail"
      :plan-detail="planDetail"
      :rooms="rooms"
      :set-tab="setTab"
      :fetch-room-amenity-list="fetchRoomAmenityList"
      :is-hide-stock-price="isHideStockPrice"
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
  CancelPolicyRepository,
} from '~/repositories'
import { Global, Plan, Room, CancelPolicy } from '~/types'
import { accountStore, roomAndPlanStore } from '~/store'
import { WHOLESALER_ID_DIRECT } from '~/utils/const'
import { PERMISSION_NOT_STOCK_PRICE, PERMISSION_LIST } from '~/utils/permission'

@Component({
  layout: 'AfterLogin',
  middleware: ['auth'],
  components: {
    Breadcrumb: () => import('~/components/molecules/Breadcrumb.vue'),
    PlanDetail: () => import('~/components/organisms/PlanDetail.vue'),
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
  private planRepository = new PlanRepository()
  private roomRepository = new RoomRepository()
  private cancelPolicyRepository = new CancelPolicyRepository()
  private defaultTime: string = '00:00'

  get isDirect(): boolean {
    return WHOLESALER_ID_DIRECT === accountStore.wholesalerId
  }

  get propertyId(): number {
    return accountStore.activeFacilityInfo.propertyId
  }


  async created(): Promise<void> {
    this.isLoading = true

    const fetchedRoom = await this.roomRepository.fetchRoomList(this.propertyId)
    this.rooms = fetchedRoom.map(
      (roomData): Room.RoomForPlanEdit => ({
        roomTypeId: roomData.roomTypeId,
        name: roomData.name,
        roomTypeCode: roomData.roomTypeCode,
      })
    )

    const planId = Number(this.$route.params.planId)
    if (Number.isNaN(planId)) {
      this.$nuxt.error({ statusCode: 404 })
    }
    this.planDetail = await this.planRepository.fetchPlanDetail(
      this.propertyId,
      planId
    )
    console.log(this.planDetail);
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

  private async fetchRoomAmenityList(): Promise<Room.Amenity[]> {
    return await this.roomRepository.fetchRoomAmenities()
  }

  private setTab() {
    roomAndPlanStore.setActiveTab('2')
  }
}
</script>
