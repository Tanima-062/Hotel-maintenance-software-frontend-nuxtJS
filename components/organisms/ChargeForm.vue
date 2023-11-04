<template>
  <div>
    <div class="text-sm font-light text-black">
      {{ $t('charge.description') }}
    </div>
    <div
      class="my-3 flex flex-row space-x-3 items-center py-3 px-5 bg-menuColor border border-bdColor"
    >
      <p class="w-20">{{ $t('charge.form.room') }}</p>
      <Selectbox
        width="w-full"
        padding="px-3 py-1"
        max-height="max-h-285px"
        :items="roomSelectItems"
        :active-item="roomSelectedItem"
        @select-item="selectedRoom"
      />
      <p class="w-40">{{ $t('charge.form.plan') }}</p>
      <Selectbox
        width="w-full"
        padding="px-3 py-1"
        max-height="max-h-285px"
        :items="planItems"
        :active-item="planSelectedItem"
        @select-item="selectedPlan"
      />
    </div>
    <div class="table border border-bdColor w-full text-sm">
      <div class="table-row-group">
        <div
          class="table-row font-bold text-center bg-menuColor text-black-dark"
        >
          <div class="table-cell border-bdColor p-3 w-50"></div>
          <div class="table-cell border-l border-bdColor p-3 text-btnColor-red">
            {{ $t('global.week.su') }}
          </div>
          <div class="table-cell border-l border-bdColor p-3">
            {{ $t('global.week.mo') }}
          </div>
          <div class="table-cell border-l border-bdColor p-3">
            {{ $t('global.week.tu') }}
          </div>
          <div class="table-cell border-l border-bdColor p-3">
            {{ $t('global.week.we') }}
          </div>
          <div class="table-cell border-l border-bdColor p-3">
            {{ $t('global.week.thu') }}
          </div>
          <div class="table-cell border-l border-bdColor p-3">
            {{ $t('global.week.fri') }}
          </div>
          <div class="table-cell border-l border-bdColor p-3 text-linkColor">
            {{ $t('global.week.sa') }}
          </div>
        </div>
        <div class="table-row">
          <div
            class="table-cell border-t border-b border-menuColor-active w-50"
          ></div>
          <div
            class="table-cell border-t border-b border-menuColor-active"
          ></div>
          <div
            class="table-cell border-t border-b border-menuColor-active"
          ></div>
          <div
            class="table-cell border-t border-b border-menuColor-active"
          ></div>
          <div
            class="table-cell border-t border-b border-menuColor-active"
          ></div>
          <div
            class="table-cell border-t border-b border-menuColor-active"
          ></div>
          <div
            class="table-cell border-t border-b border-menuColor-active"
          ></div>
          <div
            class="table-cell border-t border-b border-menuColor-active"
          ></div>
        </div>
        <div
          v-for="formData in formInputDataWeek"
          :key="formData.people"
          class="table-row text-center"
        >
          <div
            class="font-normal text-left table-cell py-3 pl-5 w-50 bg-bgColor-green-light"
          >
            {{ formData.showPeople }}
          </div>
          <div
            v-for="(formInput, index) in formData.prices"
            :key="index"
            class="table-cell py-2 px-3 border-l border-bdColor w-40"
          >
            <InputForm
              v-model="formData.prices[index]"
              :disabled="isLoadingRequest"
              :text-length="11"
              padding="py-1"
              class="text-right"
              type="number"
              label=""
              placeholder="-"
            />
          </div>
        </div>
      </div>
    </div>
    <div
      class="w-97 m-auto text-center bg-btnColor rounded-br-3xl rounded-bl-3xl cursor-pointer z-20"
      @click="applyPricesCalendar"
    >
      <p class="text-white font-normal p-3">{{ $t('charge.btnApplyForm') }}</p>
    </div>
    <div class="flex flex-col items-center">
      <Icon
        :icon="downIcon"
        color="text-btnColor-border"
        icon-width="50"
        icon-height="50"
        class="mx-auto -m-3"
      />
      <Icon
        :icon="downIcon"
        color="text-btnColor-border"
        icon-width="50"
        icon-height="50"
        class="mx-auto -m-5"
      />
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Emit, mixins } from 'nuxt-property-decorator'
import { mdiMenuDown } from '@mdi/js'
import alert from '~/mixins/alert'
import { Global, Plan, Charge } from '~/types'

@Component({
  components: {
    Btn: () => import('~/components/atoms/Btn.vue'),
    InputForm: () => import('~/components/molecules/InputForm.vue'),
    Icon: () => import('~/components/atoms/Icon.vue'),
    Selectbox: () => import('~/components/molecules/Selectbox.vue'),
  },
})
export default class extends mixins(alert) {
  @Prop()
  roomPlanList!: Plan.List[]

  @Prop({ default: [] })
  formInputDataWeek!: Charge.FormInputData[]

  @Prop({ default: false })
  isLoadingRequest!: boolean

  @Prop({ default: 0 })
  selectedRoomId!: number

  @Prop({ default: 0 })
  selectedPlanId!: number

  @Prop()
  applyPricesCalendar!: Function

  private defaultRoomItem: Global.SelectboxItem = {
    name: this.$t('charge.select.room') as string,
    value: 0,
  }

  private defaultPlanItem: Global.SelectboxItem = {
    name: this.$t('charge.select.plan') as string,
    value: 0,
  }

  private downIcon: string = mdiMenuDown
  private roomItems: Global.SelectboxItem[] = [this.defaultRoomItem]
  private planItems: Global.SelectboxItem[] = [this.defaultPlanItem]
  private activeRoom: Global.SelectboxItem = this.roomSelectedItem
  private activePlan: Global.SelectboxItem = this.planSelectedItem

  private getPricesPlan(): void {}

  private updateSelectBoxRoomPlan(roomId: number) {
    if (!this.activeRoom) return
    this.activeRoom =
      this.roomItems.find(
        (roomItem: Global.SelectboxItem) =>
          roomItem.value === this.selectedRoomId
      ) || this.activeRoom
    const planList: Plan.Detail[] =
      this.roomPlanList.find(
        (roomPlan: Plan.List) => roomPlan.roomTypeId === roomId
      )?.plans || []
    this.planItems = [this.defaultPlanItem]
    this.activePlan = this.planItems[0]
    planList.map((plan) => {
      this.planItems.push({
        name: plan.name,
        value: plan.planId,
      })
    })
  }

  get roomSelectItems(): Global.SelectboxItem[] {
    this.roomItems = [this.defaultRoomItem]
    this.roomPlanList &&
      this.roomPlanList.map((room) => {
        this.roomItems.push({
          name: room.roomName,
          value: room.roomTypeId,
        })
      })
    this.activeRoom = this.roomItems[0]
    return this.roomItems
  }

  get roomSelectedItem(): Global.SelectboxItem {
    return (
      this.roomSelectItems.find(
        (roomItem: Global.SelectboxItem) =>
          roomItem.value === this.selectedRoomId
      ) || this.activeRoom
    )
  }

  get planSelectedItem(): Global.SelectboxItem {
    this.updateSelectBoxRoomPlan(this.selectedRoomId)
    return (
      this.planItems.find(
        (planItem: Global.SelectboxItem) =>
          planItem.value === this.selectedPlanId
      ) || this.activePlan
    )
  }

  @Emit()
  private selectedRoom(roomId: number): number {
    this.updateSelectBoxRoomPlan(roomId)
    return roomId
  }

  @Emit()
  private selectedPlan(v: number): number {
    this.activePlan =
      this.planItems.find(
        (planItem: Global.SelectboxItem) => planItem.value === v
      ) || this.activePlan
    return Number(this.activePlan.value)
  }
}
</script>
