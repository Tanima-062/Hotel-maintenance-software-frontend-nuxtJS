<template>
  <div class="border border-solid border-bdColor bg-menuColor px-6 py-4 mb-4">
    <div v-if="!isOpenSearchBox" class="flex flex-row items-center">
      <p class="text-lg font-bold w-full">
        {{ $t('stock.searchBox.headline') }}
      </p>
      <IconBtn
        :icon="icon.open"
        hover-color="text-black"
        color="text-black"
        padding="p-0"
        icon-width="22"
        icon-height="22"
        @click="toggleSearchBox"
      />
    </div>
    <div v-if="isOpenSearchBox" class="relative">
      <div class="w-full flex flex-row mb-6">
        <div class="w-30 flex flex-col">
          <Checkbox
            :label="$t('stock.searchBox.sellingOn')"
            class="h-11 leading-4"
            color="black-dark2"
            :checked="statusSellingOn"
            @change="change('on', !statusSellingOn)"
          />
          <Checkbox
            :label="$t('stock.searchBox.sellingOff')"
            class="h-11 leading-4"
            color="black-dark2"
            :checked="statusSellingOff"
            @change="change('off', !statusSellingOff)"
          />
        </div>
        <div class="w-full">
          <div class="grid grid-cols-2 gap-10 mb-4">
            <CheckSelectbox
              :placeholder="$t('stock.searchBox.room')"
              padding="px-3 py-1.5"
              :items="selectedPlanIncludedRoom"
              class="text-base"
              width="w-full"
              box-position="top-0 mt-8"
              box-height="max-h-285px"
              @change="selectRoomCheckBox"
            />
            <CheckSelectbox
              :placeholder="$t('stock.searchBox.plan')"
              padding="px-3 py-1.5"
              :items="selectedRoomIncludedPlan"
              class="text-base"
              width="w-full"
              box-position="top-0 mt-8"
              box-height="max-h-285px"
              :empty-text="$t('roomPlan.roomPlanList.planNotSelectAvailable')"
              @change="selectPlanCheckBox"
            />
          </div>
          <div
            v-show="selectedRoomList.length || selectedPlanList.length"
            class="w-full mb-4 flex flex-row relative"
          >
            <div
              v-if="!isSelectedRoomAll"
              class="w-1/2 h-fit-content flex items-start justify-start flex-wrap text-xs"
            >
              <Badge
                v-for="(room, index) in selectedRoomList"
                :key="index"
                :outline="true"
                color="cancel"
                class="flex items-center justify-center mr-2 mb-2 px-3 py-2"
                :is-clear="true"
                bg-color="bg-btnColor-badge"
                :icon-width="16"
                :icon-height="16"
                @click="removeSelected(room.id, 'Room')"
              >
                {{ room.name }}
              </Badge>
            </div>
            <div
              v-if="isSelectedRoomAll"
              class="w-1/2 h-fit-content flex items-start justify-start flex-wrap text-xs"
            >
              <Badge
                :outline="true"
                color="cancel"
                class="flex items-center justify-center mr-2 mb-2 px-3 py-2"
                :is-clear="true"
                bg-color="bg-btnColor-badge"
                :icon-width="16"
                :icon-height="16"
                @click="removeSelected(0, 'Room')"
              >
                {{ $t('roomPlan.roomPlanList.selectAll') }}
              </Badge>
            </div>
            <div class="absolute border-r border-disabled h-full left-1/2" />
            <div
              v-if="!isSelectedPlanAll"
              class="w-1/2 h-fit-content flex items-start justify-start flex-wrap pl-6 text-xs"
            >
              <Badge
                v-for="(plan, index) in selectedPlanList"
                :key="index"
                :outline="true"
                color="cancel"
                class="flex items-center justify-center mr-2 mb-2 px-3 py-2"
                :is-clear="true"
                bg-color="bg-btnColor-badge"
                :icon-width="16"
                :icon-height="16"
                @click="removeSelected(plan.id, 'Plan')"
              >
                {{ plan.name }}
              </Badge>
            </div>
            <div
              v-if="isSelectedPlanAll"
              class="w-1/2 h-fit-content flex items-start justify-start flex-wrap pl-6 text-xs"
            >
              <Badge
                :outline="true"
                color="cancel"
                class="flex items-center justify-center mr-2 mb-2 px-3 py-2"
                :is-clear="true"
                bg-color="bg-btnColor-badge"
                :icon-width="16"
                :icon-height="16"
                @click="removeSelected(planList[0].id, 'Plan')"
              >
                {{ $t('roomPlan.roomPlanList.selectAll') }}
              </Badge>
            </div>
          </div>
          <InputText
            v-model="keywordSearchText"
            class="text-base w-full"
            :placeholder="$t('stock.searchBox.keywordSearch')"
          />
        </div>
      </div>
      <div class="flex space-x-3 justify-center">
        <Btn
          color="gray"
          class="w-50"
          height="big"
          @click="searchFilterStockRate(true)"
          >{{ $t('booking.searchBox.clearButton') }}</Btn
        >
        <Btn
          color="blue"
          class="w-50"
          height="big"
          type="submit"
          @click="searchFilterStockRate()"
          >{{ $t('booking.searchBox.searchButton') }}</Btn
        >
      </div>
      <IconBtn
        class="absolute right-0 bottom-0"
        :icon="icon.close"
        hover-color="text-black"
        color="text-black"
        padding="p-0"
        icon-width="22"
        icon-height="22"
        @click="toggleSearchBox"
      />
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Emit } from 'vue-property-decorator'
import { mdiPlusCircleOutline, mdiMinusCircleOutline } from '@mdi/js'
import { Global, Calendar } from '~/types'

@Component({
  components: {
    Btn: () => import('~/components/atoms/Btn.vue'),
    InputText: () => import('~/components/atoms/InputText.vue'),
    IconBtn: () => import('~/components/atoms/IconBtn.vue'),
    Checkbox: () => import('~/components/molecules/Checkbox.vue'),
    CheckSelectbox: () => import('~/components/molecules/CheckSelectbox.vue'),
    Badge: () => import('~/components/molecules/Badge.vue'),
  },
})
export default class extends Vue {
  @Prop({ default: [] })
  roomPlanList!: Calendar.Room[]

  private isOpenSearchBox: boolean = false
  private statusSellingOn: boolean = true
  private statusSellingOff: boolean = true
  private keywordSearchText: string = ''
  private icon: { [key: string]: string } = {
    open: mdiPlusCircleOutline,
    close: mdiMinusCircleOutline,
  }

  private roomList: Global.CheckboxItem[] = [
    {
      name: this.$t('roomPlan.roomPlanList.selectAll') as string,
      value: true,
      id: 0,
      option: [0],
    },
  ]

  private planList: Global.CheckboxItem[] = [
    {
      name: this.$t('roomPlan.roomPlanList.selectAll') as string,
      value: true,
      id: [0],
      option: [0],
    },
  ]

  private fillRoomPlanCheckList(): void {
    this.roomPlanList.map((room: Calendar.Room) => {
      const planId: number[] = []
      room.plans.map((plan: Calendar.Plan) => {
        planId.push(plan.planId)
        if (!this.planList.some((planAux) => planAux.name === plan.planName)) {
          this.planList.push({
            name: plan.planName,
            value: true,
            id: [plan.planId],
            option: [room.roomTypeId],
          })
        } else {
          const planIndex = this.planList.findIndex(
            (planAux) => planAux.name === plan.planName
          )
          if (planIndex >= 0 && this.planList[planIndex]) {
            const planIds = this.planList[planIndex].id as number[]
            const rommIds = this.planList[planIndex].option as number[]
            if (rommIds && planIds) {
              rommIds.push(room.roomTypeId)
              planIds.push(plan.planId)
            }
          }
        }
      })
      this.roomList.push({
        name: room.roomName,
        value: true,
        id: room.roomTypeId,
        option: planId,
      })
    })
  }

  get selectedRoomList(): Global.CheckboxItem[] {
    return this.roomList.filter((room) => room.value)
  }

  get selectedPlanList(): Global.CheckboxItem[] {
    return this.planList.filter((plan) => plan.value)
  }

  get isSelectedRoomAll(): boolean {
    return this.roomList.some((room) => room.id === 0 && room.value)
  }

  get isSelectedPlanAll(): boolean {
    return this.planList.some((plan) => {
      const planId = plan.id as number[]
      if (planId.includes(0) && plan.value) {
        return true
      }
      return false
    })
  }

  get selectedPlanIncludedRoom(): Global.CheckboxItem[] {
    let selectedPlanId: number[] = []
    this.planList
      .filter((plan: Global.CheckboxItem) => plan.value)
      .map((plan: Global.CheckboxItem) => {
        selectedPlanId = [...selectedPlanId, ...(plan.id as number[])]
      })
    if (selectedPlanId.includes(0)) {
      return this.roomList
    }
    let resultRoomList: Global.CheckboxItem[] = [this.roomList[0]]
    if (selectedPlanId.length) {
      selectedPlanId.map((selectedId: number) => {
        resultRoomList = [
          ...resultRoomList,
          ...this.roomList.filter((room: Global.CheckboxItem) => {
            if (room.option) {
              const roomData = room.option as number[]
              return roomData.includes(selectedId)
            }
            return false
          }),
        ]
      })
      resultRoomList = [...new Set(resultRoomList)]
      return resultRoomList
    } else {
      return this.roomList
    }
  }

  get selectedRoomIncludedPlan(): Global.CheckboxItem[] {
    const selectedRoomId: number[] = this.roomList
      .filter((room: Global.CheckboxItem) => room.value)
      .map((room: Global.CheckboxItem) => {
        return room.id || 0
      }) as number[]
    if (selectedRoomId.includes(0)) {
      return this.planList
    }
    let resultPlanList: Global.CheckboxItem[] = [this.planList[0]]
    if (selectedRoomId.length) {
      selectedRoomId.map((selectedId: number) => {
        resultPlanList = [
          ...resultPlanList,
          ...this.planList.filter((plan: Global.CheckboxItem) => {
            if (plan.option) {
              const planData = plan.option as number[]
              return planData.includes(selectedId)
            }
            return false
          }),
        ]
      })
      resultPlanList = [...new Set(resultPlanList)]
      return resultPlanList
    } else {
      return this.planList
    }
  }

  created() {
    this.fillRoomPlanCheckList()
  }

  private toggleSearchBox(): void {
    this.isOpenSearchBox = !this.isOpenSearchBox
  }

  private change(type: string, bool: boolean): void {
    switch (type) {
      case 'on':
        this.statusSellingOn = bool
        break
      case 'off':
        this.statusSellingOff = bool
        break
      default:
        break
    }
  }

  private selectRoomCheckBox(item: Global.CheckboxItem): void {
    const selected = this.roomList.find(
      (room: Global.CheckboxItem) => room.id === item.id
    )
    if (selected) {
      selected.value = item.value
      if (item.id === 0 && selected.value) {
        this.roomList = this.roomList.map((room) => {
          room.value = true
          return room
        })
      } else if (item.id !== 0) {
        if (this.roomList[0].value) {
          this.roomList[0].value = false
        } else {
          const checkedRoomList = this.roomList.filter((room) => !room.value)
          this.roomList[0].value =
            checkedRoomList.some((room) => room.id === 0) &&
            checkedRoomList.length === 1
        }
      } else if (item.id === 0 && !selected.value) {
        this.roomList = this.roomList.map((room) => {
          room.value = false
          return room
        })
      }
    }
  }

  private selectPlanCheckBox(item: Global.CheckboxItem): void {
    const selected = this.planList.find(
      (plan: Global.CheckboxItem) => plan.id === item.id
    )
    const planIds = item.id as number[]
    if (selected) {
      selected.value = item.value
      if (planIds.includes(0) && selected.value) {
        this.planList = this.planList.map((plan) => {
          plan.value = true
          return plan
        })
      } else if (!planIds.includes(0)) {
        if (this.planList[0].value) {
          this.planList[0].value = false
        } else {
          const checkedPlanList = this.planList.filter((plan) => !plan.value)
          this.planList[0].value =
            checkedPlanList.some((plan) => {
              const planId = plan.id as number[]
              return planId.includes(0)
            }) && checkedPlanList.length === 1
        }
      } else if (planIds.includes(0) && !selected.value) {
        this.planList = this.planList.map((plan) => {
          plan.value = false
          return plan
        })
      }
    }
  }

  private removeSelected(id: number | number[], type: 'Room' | 'Plan'): void {
    if (type === 'Room') {
      const roomTarget = this.roomList.find((room) => room.id === id)
      if (roomTarget && id !== 0) {
        roomTarget.value = false
      } else {
        this.roomList.map((room) => {
          room.value = false
          return room
        })
      }
    } else {
      const planSelectedId = id as number[]
      const planTarget = this.planList.find((plan) => plan.id === id)
      if (planTarget && !planSelectedId.includes(0)) {
        planTarget.value = false
      } else {
        this.planList.map((plan) => {
          plan.value = false
          return plan
        })
      }
    }
  }

  private clearFilter(): void {
    this.roomList = this.roomList.map((room: Global.CheckboxItem) => {
      room.value = true
      return room
    })
    this.planList = this.planList.map((plan: Global.CheckboxItem) => {
      plan.value = true
      return plan
    })
    this.planList[0].value = true
    this.keywordSearchText = ''
    this.statusSellingOn = true
    this.statusSellingOff = true
  }

  @Emit()
  private searchFilterStockRate(clear: boolean = false): Calendar.FilterOption {
    if (clear) {
      this.clearFilter()
    }
    let selectedRoomId: number[] = this.roomList
      .filter((room: Global.CheckboxItem) => room.value)
      .map((room: Global.CheckboxItem) => {
        return room.id || 0
      }) as number[]
    let selectedPlanIdList: number[][] = this.planList
      .filter((plan: Global.CheckboxItem) => plan.value)
      .map((plan: Global.CheckboxItem) => {
        return plan.id || 0
      }) as number[][]
    let selectedPlanIds: number[] = []
    selectedPlanIdList.map((selecedPlanList) => {
      selectedPlanIds = [...selectedPlanIds, ...selecedPlanList]
    })
    if (selectedPlanIds.includes(0)) {
      selectedPlanIdList = this.planList.map((plan: Global.CheckboxItem) => {
        return plan.id || 0
      }) as number[][]
      selectedPlanIds = []
      selectedPlanIdList.map((selecedPlanList) => {
        selectedPlanIds = [...selectedPlanIds, ...selecedPlanList]
      })
    }
    if (selectedRoomId.includes(0)) {
      if (!selectedPlanIds.includes(0)) {
        const filteredRoom = this.roomList.filter(
          (room: Global.CheckboxItem) => {
            const optionIds = room.option as number[]
            if (selectedPlanIds.some((r) => optionIds.includes(r))) {
              return true
            }
            return false
          }
        )
        selectedRoomId = filteredRoom.map((room: Global.CheckboxItem) => {
          return room.id || 0
        }) as number[]
      } else {
        selectedRoomId = this.roomList.map((room: Global.CheckboxItem) => {
          return room.id || 0
        }) as number[]
      }
    }
    return {
      roomList: selectedRoomId,
      planList: selectedPlanIds,
      sellingStatus:
        this.statusSellingOn && this.statusSellingOff
          ? 0
          : this.statusSellingOn && !this.statusSellingOff
          ? 1
          : !this.statusSellingOn && this.statusSellingOff
          ? 2
          : 3,
      keyword: this.keywordSearchText.trim(),
    }
  }
}
</script>
<style lang="sass" scoped>
.h-fit-content
  height: fit-content
</style>
