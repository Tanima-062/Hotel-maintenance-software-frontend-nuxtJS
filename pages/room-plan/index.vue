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
          {{ $t('roomPlan.pageDescription') }}
        </p>
      </Tabs>
    </div>
    <div v-if="isRoomTab">
      <Room
        v-if="rooms.length > 0"
        :rooms="rooms"
        :select-data="selectRoomPage"
        :delete-room="deleteRoom"
        :copy="copyRoom"
        :is-hide-stock-price="isHideStockPrice"
      />

      <div v-else class="border border-solid border-bdColor p-6">
        <div class="flex items-center justify-center flex-col h-50">
          <Icon
            icon="M11 11h-1v2h2v-1l9.73 9.73L20.46 23 14 16.54V21H3v-2h2V7.54l-4-4 1.27-1.27L11 11zm3 .49L5.51 3H14v1h5v12.49l-2-2V6h-3v5.49z"
            color="text-bdColor"
            icon-width="43"
            icon-height="43"
          />

          <p class="text-center text-black-light">
            {{ $t('roomPlan.roomPlanList.roomDataAlertOne') }}<br />
            {{ $t('roomPlan.roomPlanList.roomDataAlertTwo') }}
          </p>
        </div>
      </div>
    </div>

    <div v-if="isPlanTab">
      <Plan
        v-if="roomsAndPlans.length > 0"
        :select-data="selectPlanPage"
        :rooms-and-plans="roomsAndPlans"
        :copy="copyPlan"
        :delete-plan="deletePlan"
        :is-hide-stock-price="isHideStockPrice"
      />
      <div v-else class="border border-solid border-bdColor p-6">
        <div class="flex items-center justify-center flex-col h-50">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            enable-background="new 0 0 24 24"
            height="43"
            viewBox="0 0 24 24"
            width="43"
            class="text-bdColor fill-current"
          >
            <g><rect fill="none" height="24" width="24" /></g>
            <g>
              <g>
                <path
                  d="M20,4H6.83l8,8H20v2h-3.17l4.93,4.93C21.91,18.65,22,18.34,22,18V6C22,4.9,21.1,4,20,4z"
                />
                <path
                  d="M1.04,3.87l1.2,1.2C2.09,5.35,2,5.66,2,6v12c0,1.1,0.9,2,2,2h13.17l2.96,2.96l1.41-1.41L2.45,2.45L1.04,3.87z M8,12v2H4 v-2H8z M14,16.83V18H4v-2h9.17L14,16.83z"
                />
              </g>
            </g>
          </svg>

          <p class="text-center text-black-light">
            {{ $t('roomPlan.roomPlanList.planDataAlertOne') }}<br />
            {{ $t('roomPlan.roomPlanList.planDataAlertTwo') }}
          </p>
        </div>
      </div>
    </div>
  </main>
</template>
<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import { RoomRepository, PlanRepository } from '~/repositories'
import { Global, Room, Plan } from '~/types'
import alert from '~/mixins/alert'
import { accountStore, roomAndPlanStore } from '~/store'
import {
  PERMISSION_NOT_STOCK_PRICE,
  PERMISSION_LIST,
  PERMISSION_FOR_TL_TEMA,
} from '~/utils/permission'
import { WHOLESALER_ID_TEMA, WHOLESALER_ID_TL } from '~/utils/const'

@Component({
  layout: 'AfterLogin',
  middleware: ['auth'],
  components: {
    Breadcrumb: () => import('~/components/molecules/Breadcrumb.vue'),
    Tabs: () => import('~/components/molecules/Tabs.vue'),
    Icon: () => import('~/components/atoms/Icon.vue'),
    Room: () => import('~/components/organisms/Room.vue'),
    Plan: () => import('~/components/organisms/Plan.vue'),
  },
})
export default class extends Mixins(alert) {
  head() {
    return {
      title: `${this.$t('global.title.roomPlanList') as string} | Skyticket ${
        this.$t('global.title.admin') as string
      }`,
    }
  }

  private breadcrumbList: Global.BreadCrumb[] = accountStore.currentBreadCrumbs
  private selectRoomPage: Global.SelectboxItem[] = [
    {
      name: this.$t('global.maxShowItem.other.firstItem') as string,
      value: 10,
    },
    {
      name: this.$t('global.maxShowItem.other.secondItem') as string,
      value: 20,
    },
    {
      name: this.$t('global.maxShowItem.other.thirdItem') as string,
      value: 30,
    },
  ]

  private selectPlanPage: Global.SelectboxItem[] = [
    {
      name: this.$t('global.maxShowItem.planList.firstItem') as string,
      value: 1,
    },
    {
      name: this.$t('global.maxShowItem.planList.secondItem') as string,
      value: 5,
    },
    {
      name: this.$t('global.maxShowItem.planList.thirdItem') as string,
      value: 10,
    },
    {
      name: this.$t('global.maxShowItem.planList.fourthItem') as string,
      value: 30,
    },
  ]

  private tabData: Global.TabCategory[] = [
    {
      value: '1',
      name: this.$t('roomPlan.roomPlantab.roomListTab') as string,
    },
    {
      value: '2',
      name: this.$t('roomPlan.roomPlantab.planListTab') as string,
    },
  ]

  private rooms: Room.List[] = []
  private roomsAndPlans: any[] = []
  private activeTab: string = this.tabData[0].value
  private roomRepository = new RoomRepository()
  private planRepository = new PlanRepository()

  get isRoomTab(): boolean {
    return this.activeTab === this.tabData[0].value
  }

  get isPlanTab(): boolean {
    return this.activeTab === this.tabData[1].value
  }

  get isHideStockPrice(): boolean {
    if(accountStore.wholesalerId == WHOLESALER_ID_TL || accountStore.wholesalerId == WHOLESALER_ID_TEMA){
        return (
        PERMISSION_LIST[accountStore.wholesalerId] === PERMISSION_FOR_TL_TEMA
      )
    }
    return (
      PERMISSION_LIST[accountStore.wholesalerId] === PERMISSION_NOT_STOCK_PRICE
    )
  }

  private async created() {
    this.activeTab = roomAndPlanStore.getActiveTab
    roomAndPlanStore.resetActiveTab()
    const { propertyId } = accountStore.activeFacilityInfo
    if(accountStore.wholesalerId == WHOLESALER_ID_TL){
      this.rooms = await this.roomRepository.fetchRoomListTl(propertyId)
    }else{
      this.rooms = await this.roomRepository.fetchRoomList(propertyId)
    }
    this.roomsAndPlans = await this.planRepository.fetchPlanList(propertyId)
  }

  private async deleteRoom(
    roomTypeId: number,
    roomName: string
  ): Promise<void> {
    const res = await this.mixinDeleteAlert(roomName)
    if (res) {
      const status = await this.roomRepository.deleteRoom(roomTypeId)
      if (status !== 200) {
        // エラー！
        return
      }
      this.rooms = await this.roomRepository.fetchRoomList(
        accountStore.activeFacilityInfo.propertyId
      )
    }
  }

  private async deletePlan(plan: Plan.Detail): Promise<void> {
    const res = await this.mixinDeleteAlert(
      `<p class="text-left text-base text-black-dark">${plan.name}</p></p>`
    )
    if (res) {
      const status = await this.planRepository.deletePlan(plan.planId)
      if (status !== 200) {
        // エラー！
        return
      }
      this.roomsAndPlans = await this.planRepository.fetchPlanList(
        accountStore.activeFacilityInfo.propertyId
      )
    }
  }

  private async clickTab(value: string): Promise<void> {
    this.activeTab = value

    if (this.isRoomTab) {
      this.rooms.splice(0, this.rooms.length)
      this.rooms = await this.roomRepository.fetchRoomList(
        accountStore.activeFacilityInfo.propertyId
      )
    } else if (this.isPlanTab) {
      this.roomsAndPlans.splice(0, this.rooms.length)
      this.roomsAndPlans = await this.planRepository.fetchPlanList(
        accountStore.activeFacilityInfo.propertyId
      )
    }
  }

  private async copyRoom(roomTypeId: number) {
    await roomAndPlanStore.setCopyRoomData(roomTypeId)
    this.$router.push('/room-plan/create')
  }

  private async copyPlan(planId: number, charge: boolean = false) {
    if (charge) {
      await roomAndPlanStore.setCopyPlanData(planId)
      this.$router.push('/charge/edit')
    } else {
      await roomAndPlanStore.setCopyPlanData(planId)
      roomAndPlanStore.setActiveTab(this.tabData[1].value)
      this.$router.push('/room-plan/create')
    }
  }
}
</script>
