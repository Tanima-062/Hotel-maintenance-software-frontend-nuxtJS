<template>
  <div>
    <div class="border border-solid border-bdColor mb-6">
      <div v-for="rIndex in currentPageItems" :key="`room-and-plan-${rIndex}`">
        <div
          v-if="roomsAndPlans[rIndex]"
          class="flex items-start justify-start flex-wrap w-full"
        >
          <div
            class="flex items-start justify-start flex-col flex-wrap w-58 p-3"
            :class="
              rIndex % selectedItem.value !== 0
                ? 'border-t border-solid border-bdColor'
                : ''
            "
          >
            <div class="relative overflow-y-hidden flex items-start justify-start">
              <Picture
                :image-id="roomsAndPlans[rIndex].roomTypeId"
                width="w-51"
                height="h-27"
                :href="roomsAndPlans[rIndex].roomImageHref"
                :is-not-rounded="true"
                :draggable="false"
              />
              <div v-if="roomsAndPlans[rIndex].roomIsStopSales">
                <div
                  class="isNotSale-white absolute bg-white opacity-80 w-52 h-30"
                />
                <div
                  class="isNotSale-text absolute text-alert text-lg font-bold whitespace-no-wrap"
                >
                  {{ $t('plan.stopSaleImage') }}
                </div>
              </div>
            </div>
            <p class="text-black-dark text-lg font-bold w-full break-words">
              {{ roomsAndPlans[rIndex].roomName }}
              <span v-if="roomsAndPlans[rIndex].roomIsStopSales">{{ $t('plan.list.isStopSalesLabel') }}</span>
            </p>
            <Tag
              v-if="
                wholesalerId != wholesalerId_TL &&
                wholesalerId != wholesalerId_TEMA
              "
              :color="`${
                roomsAndPlans[rIndex].roomIsStopSales ? 'red' : 'blue'
              }`"
              class="mt-2 pt-1 w-full text-center border"
              py="py-1"
              height="small"
              text-size="text-base"
              font-weight="font-normal"
            >
              {{
                roomsAndPlans[rIndex].roomIsStopSales
                  ? $t('plan.list.isStopSales')
                  : $t('plan.list.isOnSale')
              }}
            </Tag>
          </div>
          <div
            class="flex-auto border-l border-solid border-bdColor"
            :class="
              rIndex % selectedItem.value !== 0
                ? 'border-t border-solid border-bdColor'
                : ''
            "
          >
            <div
              v-for="(plan, pIndex) in roomsAndPlans[rIndex].plans"
              :key="plan.planId"
              class="flex-auto items-start justify-start flex-col m-3"
              :class="pIndex > 0 ? 'border-t border-solid border-bdColor' : ''"
            >
              <ListTitle class="w-full mb-3">
                <div class="flex items-center justify-start text-center">
                  <Tag
                    v-if="
                      wholesalerId != wholesalerId_TL &&
                      wholesalerId != wholesalerId_TEMA
                    "
                    :color="`${plan.isStopSales ? 'red' : 'blue'}`"
                    class="w-16 h-7 mr-3 border whitespace-no-wrap"
                    height="small"
                    text-size="text-sm"
                    font-weight="font-normal"
                  >
                    {{
                      plan.isStopSales
                        ? $t('plan.list.isStopSales')
                        : $t('plan.list.isOnSale')
                    }}
                  </Tag>
                  <p
                    class="text-black-dark text-lg font-bold w-full max-w-37.15 text-left"
                  >
                  {{ plan.planCode }} | {{ plan.name }}
                  </p>
                </div>
                <div class="flex items-center justify-center">
                  <Btn
                    color="none"
                    class="mr-3"
                    height="small"
                    @click="$router.push('/stock-rate')"
                  >
                    {{ $t('plan.list.menu.rateCheck') }}
                  </Btn>
                  <div
                    v-if="!isHideStockPrice"
                    class="border-l border-solid border-bdColor h-6 mr-3"
                  />
                  <Btn
                    v-if="!isHideStockPrice"
                    color="none"
                    class="mr-3"
                    height="small"
                    @click="copy(plan.planId, true)"
                  >
                    {{ $t('plan.list.menu.rateSetting') }}
                  </Btn>
                  <div class="border-l border-solid border-bdColor h-6 mr-3" />
                  <Btn
                    v-if="
                      wholesalerId != wholesalerId_TL &&
                      wholesalerId != wholesalerId_TEMA
                    "
                    color="none"
                    class="mr-3"
                    height="small"
                    :is-copy="true"
                    @click="copy(plan.planId)"
                  >
                    {{ $t('plan.list.menu.copy') }}
                  </Btn>
                  <IconBtn
                    v-if="
                      wholesalerId != wholesalerId_TL &&
                      wholesalerId != wholesalerId_TEMA
                    "
                    class="mr-3"
                    :icon="icon.edit"
                    color="text-white"
                    bg-color="bg-btnColor"
                    padding="p-1.5"
                    icon-width="17.5"
                    icon-height="17.5"
                    @click="$router.push(`/plan/edit/${plan.planId}`)"
                  />
                  <IconBtn
                    v-if="
                      wholesalerId == wholesalerId_TL ||
                      wholesalerId == wholesalerId_TEMA
                    "
                    class="mr-3"
                    :icon="icon.view"
                    color="text-white"
                    bg-color="bg-btnColor"
                    padding="p-1.5"
                    icon-width="17.5"
                    icon-height="17.5"
                    @click="$router.push(`/plan/details/${plan.planId}`)"
                  />
                  <IconBtn
                    v-if="
                      wholesalerId != wholesalerId_TL &&
                      wholesalerId != wholesalerId_TEMA
                    "
                    :icon="icon.delete"
                    color="text-white"
                    bg-color="bg-btnColor-red"
                    padding="p-1.5"
                    icon-width="17.5"
                    icon-height="17.5"
                    @click="deletePlan(plan, roomsAndPlans[rIndex].roomName)"
                  />
                </div>
              </ListTitle>
              <div>
                <p class="text-default font-bold mb-1">
                  <span v-if="plan.isAccommodatedYearRound" class="mr-3">{{
                    $t('plan.list.stayPeriodYearRound')
                  }}</span>
                  <span v-else class="mr-3"
                    >{{ formatDay(plan.accommodationPeriodStart) }} ~
                    {{ formatDay(plan.accommodationPeriodEnd) }}</span
                  >
                  <span class="mr-3">{{ showMealCondition(plan) }}</span>
                  <span v-if="wholesalerId != 3 && plan.isPackage">{{
                    $t('plan.list.packagePlan')
                  }}</span>
                </p>
                <div
                  class="relative max-h-34 min-h-34 overflow-y-hidden flex items-start justify-start"
                >
                  <Picture
                    :image-id="plan.images[0].imageId"
                    class="mr-3"
                    width="w-51"
                    height="h-30"
                    :href="plan.images[0].href"
                    :is-not-rounded="true"
                    :draggable="false"
                  />
                  <div v-if="plan.isStopSales">
                    <div
                      class="isNotSale-white absolute bg-white opacity-80 w-52 h-30"
                    />
                    <div
                      class="isNotSale-text absolute text-alert text-lg font-bold whitespace-no-wrap"
                    >
                      {{ $t('plan.stopSaleImage') }}
                    </div>
                  </div>
                  <span
                    class="absolute whitespace-pre-line leading-6 w-full pl-60 pr-3"
                    >{{ plan.description }}</span
                  >
                  <div class="absolute bottom-0 h-32 white-gradation w-full" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div key="pagination" class="w-full mb-9">
      <Pagination
        :page-count-items="selectData"
        :selected-count="selectedCount"
        :items-length="roomsAndPlans.length"
        :current-page-num="currentPageNum"
        :current-page-info="pageInfo"
        @select-item="selectEvent"
        @click-page-num="clickPageNum"
        @click-left="clickLeft"
        @click-right="clickRight"
      />
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { mdiEye } from '@mdi/js'
import { mdiCog } from '@mdi/js'
import { format } from 'date-fns'
import { Global, Plan } from '~/types'
import { accountStore, roomAndPlanStore } from '~/store'
import {
  DATE_FORMAT,
  WHOLESALER_ID_TL,
  WHOLESALER_ID_TEMA,
} from '~/utils/const'

@Component({
  components: {
    ListTitle: () => import('~/components/atoms/ListTitle.vue'),
    Btn: () => import('~/components/atoms/Btn.vue'),
    Tag: () => import('~/components/atoms/Tag.vue'),
    IconBtn: () => import('~/components/atoms/IconBtn.vue'),
    Picture: () => import('~/components/molecules/Picture.vue'),
    Pagination: () => import('~/components/molecules/Pagination.vue'),
  },
})
export default class extends Vue {
  @Prop()
  roomsAndPlans!: Plan.List[]

  @Prop({ default: [] })
  selectData!: Global.SelectboxItem[]

  @Prop()
  copy!: Function

  @Prop()
  deletePlan!: Function

  @Prop({ default: false })
  isHideStockPrice!: boolean

  // eslint-disable-next-line camelcase
  readonly wholesalerId_TL: number = WHOLESALER_ID_TL
  // eslint-disable-next-line camelcase
  readonly wholesalerId_TEMA: number = WHOLESALER_ID_TEMA
  readonly wholesalerId: number = accountStore.wholesalerId
  private currentPageNum: number = 1
  private selectedItem: Global.SelectboxItem =
    roomAndPlanStore.getSelectedShowPlan || this.selectData[3]

  private icon: { [key: string]: string } = {
    edit: mdiCog,
    view: mdiEye,
    delete:
      'M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zm2.46-7.12l1.41-1.41L12 12.59l2.12-2.12 1.41 1.41L13.41 14l2.12 2.12-1.41 1.41L12 15.41l-2.12 2.12-1.41-1.41L10.59 14l-2.13-2.12zM15.5 4l-1-1h-5l-1 1H5v2h14V4z',
  }

  get selectedCount(): Global.SelectboxItem {
    return !Object.keys(this.selectedItem).length
      ? this.selectData[3]
      : this.selectedItem
  }

  get currentPageItems(): number[] {
    const currentCount = Number(this.selectedItem.value)
    if (Number.isNaN(currentCount)) return []
    return [...Array(currentCount)].map(
      (_, i) => i + currentCount * (this.currentPageNum - 1)
    )
  }

  get pageInfo(): string {
    const currentCount = Number(this.selectedCount.value)
    if (Number.isNaN(currentCount)) return '- / -'
    const currentPageStart = currentCount * (this.currentPageNum - 1) + 1
    const currentPageEnd = currentCount * this.currentPageNum + 1

    let totalPlanCountSoFar = 0
    let totalPlanCount = 0
    let currentPlanCount = 0

    this.roomsAndPlans.forEach((room, index) => {
      if (currentPageStart > index + 1) {
        totalPlanCountSoFar += room.plans.length
      }
      if (index + 1 >= currentPageStart && currentPageEnd > index + 1) {
        currentPlanCount += room.plans.length
      }
      totalPlanCount += room.plans.length
    })
    return `${totalPlanCountSoFar + 1}-${
      totalPlanCountSoFar + currentPlanCount
    } / ${totalPlanCount}`
  }

  private showMealCondition(plan: Plan.Detail): string {
    const response: string[] = []
    if (plan.mealConditionBreakfast) {
      response.push(this.$t('plan.list.breakfast') as string)
    }
    if (plan.mealConditionLunch) {
      response.push(this.$t('plan.list.lunch') as string)
    }
    if (plan.mealConditionDinner) {
      response.push(this.$t('plan.list.dinner') as string)
    }
    if (response.length > 0) {
      return response.join('/')
    }
    return this.$t('plan.list.noMeal') as string
  }

  private formatDay(day: string): string {
    if (!day) return ''
    return format(new Date(day), DATE_FORMAT)
  }

  private selectEvent(value: number): void {
    this.selectedItem =
      this.selectData.find((item) => item.value === value) || this.selectData[3]
    roomAndPlanStore.setSelectedShowPlan(this.selectedItem)
    this.currentPageNum = 1
  }

  private clickPageNum(num: number): void {
    this.currentPageNum = num
  }

  private clickLeft(): void {
    this.currentPageNum--
  }

  private clickRight(): void {
    this.currentPageNum++
  }
}
</script>
<style lang="sass" scoped>
.isNotSale-text
  top: 40px
  left: 50px
  z-index: 5

.isNotSale-white
  left: -1px
  z-index: 5

.room-list-enter-active
  transition: opacity .2s

.room-list-enter, .room-list-leave-to
  opacity: 0

.white-gradation
  background: linear-gradient(rgba(255, 255, 255, 0) 0,rgba(255, 255, 255, .4) 20%,rgba(255, 255, 255, .95) 85%, white 90%)
</style>
