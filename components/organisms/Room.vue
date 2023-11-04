<template>
  <div v-if="rooms.length > 0">
    <transition-group
      tag="div"
      name="room-list"
      class="border border-solid border-bdColor p-3 mb-6"
    >
      <div
        v-for="index in currentPageItems"
        :key="'room-' + index"
        class="flex items-center justify-start flex-wrap w-full"
      >
        <div
          v-if="rooms[index]"
          class="flex items-center flex-col justify-center w-full"
          :class="`${showBorder(index)} ${isLastMargin(index, rooms.length)}`"
        >
          <ListTitle class="mb-3">
            <div class="flex items-center text-center">
              <Tag
                v-if="
                  wholesalerId != wholesalerId_TL &&
                  wholesalerId == wholesalerId_TEMA
                "
                :color="`${rooms[index].isStopSales ? 'red' : 'blue'}`"
                :class="`w-16 h-7 mr-3 font-normal border ${
                  rooms[index].isStopSales ? 'red' : 'blue'
                }`"
                height="small"
              >
                {{ showSalesName(rooms[index].isStopSales) }}
              </Tag>
              <p class="text-black-dark text-lg font-bold whitespace-no-wrap">
                {{ rooms[index].name }}
              </p>
            </div>
            <div class="flex items-center justify-center">
              <Btn
                color="none"
                class="mr-3"
                height="small"
                @click="$router.push('/stock-rate')"
              >
                {{ $t('room.list.menu.rateCheck') }}
              </Btn>
              <div class="border-l border-solid border-bdColor h-6 mr-3" />
              <Btn
                v-if="!isHideStockPrice"
                color="none"
                class="mr-3"
                height="small"
                @click="$router.push('/stock/edit')"
              >
                {{ $t('room.list.menu.rateSetting') }}
              </Btn>
              <div
                v-if="!isHideStockPrice"
                class="border-l border-solid border-bdColor h-6 mr-3"
              />
              <Btn
                v-if="
                  wholesalerId != wholesalerId_TL &&
                  wholesalerId != wholesalerId_TEMA
                "
                color="none"
                class="mr-3"
                height="small"
                @click="copy(rooms[index].roomTypeId)"
              >
                {{ $t('room.list.menu.copy') }}
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
                @click="$router.push(`/room/edit/${rooms[index].roomTypeId}`)"
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
                @click="
                  $router.push(`/room/details/${rooms[index].roomTypeId}`)
                "
              />
              <IconBtn
                v-if="
                  wholesalerId != wholesalerId_TL &&
                  wholesalerId != wholesalerId_TEMA
                "
                icon="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zm2.46-7.12l1.41-1.41L12 12.59l2.12-2.12 1.41 1.41L13.41 14l2.12 2.12-1.41 1.41L12 15.41l-2.12 2.12-1.41-1.41L10.59 14l-2.13-2.12zM15.5 4l-1-1h-5l-1 1H5v2h14V4z"
                color="text-white"
                bg-color="bg-btnColor-red"
                padding="p-1.5"
                icon-width="17.5"
                icon-height="17.5"
                @click="deleteRoom(rooms[index].roomTypeId, rooms[index].name)"
              />
            </div>
          </ListTitle>

          <div class="flex items-start justify-start w-full">
            <div class="relative overflow-hidden mb-1 mr-4 min-w-97">
              <Picture
                :image-id="rooms[index].roomTypeId"
                width="w-97"
                height="h-51"
                class="min-w-97"
                :href="rooms[index].href"
                :is-not-rounded="true"
                :is-images-count="true"
                :images-count="rooms[index].imageLength"
                :draggable="false"
              />
              <div v-if="rooms[index].isStopSales">
                <div class="absolute bg-white opacity-80 top-0 h-full w-full" />
                <div
                  class="absolute top-0 h-full w-full flex items-center justify-center text-center text-alert text-lg font-bold whitespace-no-wrap"
                >
                  {{ $t('room.stopSaleImage') }}
                </div>
              </div>
            </div>
            <div class="flex flex-col items-start justify-center">
              <div class="flex items-center justify-start mb-2">
                <p
                  v-if="
                    wholesalerId != wholesalerId_TL &&
                    wholesalerId != wholesalerId_TEMA &&
                    !rooms[index].isSettingStockYearRound
                  "
                  class="text-black mr-3 font-bold whitespace-no-wrap"
                >
                  {{ formatDay(rooms[index].stockSettingStart) }} ~
                  {{ formatDay(rooms[index].stockSettingEnd) }}
                </p>
                <p
                  v-else-if="
                    wholesalerId != wholesalerId_TL &&
                    wholesalerId != wholesalerId_TEMA
                  "
                  class="text-black mr-3 font-bold whitespace-no-wrap"
                >
                  {{ $t('room.list.stayPeriodYearRound') }}
                </p>
                <div
                  v-if="
                    wholesalerId != wholesalerId_TL &&
                    wholesalerId != wholesalerId_TEMA
                  "
                  class="border-l border-solid border-bdColor h-4 mr-3"
                />
                <p class="text-black">{{ rooms[index].roomTypeCode }}</p>
              </div>
              <div class="mb-4 relative max-h-24 min-h-24 overflow-y-hidden">
                <span class="whitespace-pre-line">
                  <p class="w-full whitespace-pre-line">{{ rooms[index].roomDesc }}</p>
                </span>
                <div class="absolute bottom-0 h-20 white-gradation w-full" />
              </div>
              <div
                v-if="
                  wholesalerId != wholesalerId_TL &&
                  wholesalerId != wholesalerId_TEMA
                "
                class="flex items-center justify-start max-h-14 truncate flex-wrap"
              >
                <Badge
                  v-if="rooms[index].isSmoking"
                  class="flex items-center justify-center mr-1 mb-1 px-2 py-0.5"
                  :outline="true"
                >
                  <Icon
                    :icon="icon.smoke"
                    color="text-tagColor-black"
                    icon-width="15"
                    icon-height="15"
                    class="mr-1"
                  />
                  <span class="text-black">{{ $t('room.list.smoke') }}</span>
                </Badge>
                <Badge
                  v-else
                  class="flex items-center justify-center mr-1 mb-1 px-3 py-0.5"
                  :outline="true"
                >
                  <Icon
                    :icon="icon.noSmoke"
                    color="text-tagColor-red"
                    icon-width="15"
                    icon-height="15"
                    class="mr-1"
                  />
                  <span class="text-tagColor-red">{{
                    $t('room.list.noSmoke')
                  }}</span>
                </Badge>
                <Badge
                  v-for="(amenity, ai) in rooms[index].amenityNames"
                  :ref="`badge${rooms[index].roomTypeId}`"
                  :key="ai"
                  class="flex items-center justify-center mr-1 mb-1 px-3 py-0.5"
                >
                  {{ amenity }}
                </Badge>
                <p v-if="amenityEnd[index]" class="mb-1 px-1 py-0.5">...</p>
              </div>
              <div
                v-else
                class="flex items-center justify-start max-h-14 truncate flex-wrap"
              >
              <div v-for="amenityId in rooms[index].amenityIds">
                <Badge
                  v-if="amenityId == 2"
                  class="flex items-center justify-center mr-1 mb-1 px-2 py-0.5"
                  :outline="true"
                >
                  <Icon
                    :icon="icon.smoke"
                    color="text-tagColor-black"
                    icon-width="15"
                    icon-height="15"
                    class="mr-1"
                  />
                  <span class="text-black">{{ $t('room.list.smoke') }}</span>
                </Badge>
                <Badge
                  v-else-if="amenityId == 1"
                  class="flex items-center justify-center mr-1 mb-1 px-3 py-0.5"
                  :outline="true"
                >
                  <Icon
                    :icon="icon.noSmoke"
                    color="text-tagColor-red"
                    icon-width="15"
                    icon-height="15"
                    class="mr-1"
                  />
                  <span class="text-tagColor-red">{{
                    $t('room.list.noSmoke')
                  }}</span>
                </Badge>
              </div>
              <Badge
                v-for="(amenity, ai) in rooms[index].amenityNames"
                :ref="`badge${rooms[index].roomTypeId}`"
                :key="ai"
                class="flex items-center justify-center mr-1 mb-1 px-3 py-0.5"
              >
                {{ amenity }}
              </Badge>
              <p v-if="amenityEnd[index]" class="mb-1 px-1 py-0.5">...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition-group>
    <div key="pagination" class="w-full mb-9">
      <Pagination
        :page-count-items="selectData"
        :selected-count="
          !Object.keys(selectedItem).length ? selectData[2] : selectedItem
        "
        :items-length="rooms.length"
        :current-page-num="currentPageNum"
        @select-item="selectEvent"
        @click-page-num="clickPageNum"
        @click-left="clickLeft"
        @click-right="clickRight"
      />
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { mdiCog, mdiEye, mdiSmoking, mdiSmokingOff } from '@mdi/js'
import * as df from 'date-fns'
import { Global, Room } from '~/types'
import { accountStore, roomAndPlanStore } from '~/store'
import {
  DATE_FORMAT,
  WHOLESALER_ID_TL,
  WHOLESALER_ID_TEMA,
} from '~/utils/const'

@Component({
  components: {
    Icon: () => import('~/components/atoms/Icon.vue'),
    ListTitle: () => import('~/components/atoms/ListTitle.vue'),
    Btn: () => import('~/components/atoms/Btn.vue'),
    Tag: () => import('~/components/atoms/Tag.vue'),
    Badge: () => import('~/components/molecules/Badge.vue'),
    IconBtn: () => import('~/components/atoms/IconBtn.vue'),
    Picture: () => import('~/components/molecules/Picture.vue'),
    Pagination: () => import('~/components/molecules/Pagination.vue'),
  },
})
export default class extends Vue {
  @Prop({ default: [] })
  rooms!: Room.List[]

  @Prop({ default: [] })
  selectData!: Global.SelectboxItem[]

  @Prop()
  deleteRoom!: Function

  @Prop({ default: false })
  isHideStockPrice!: boolean

  readonly wholesalerId_TL : number = WHOLESALER_ID_TL
  readonly wholesalerId_TEMA : number = WHOLESALER_ID_TEMA
  readonly wholesalerId: number = accountStore.wholesalerId
  private isHover: boolean = false
  private currentPageNum: number = 1
  private selectedItem: Global.SelectboxItem =
    roomAndPlanStore.getSelectedShowRoom || this.selectData[2]

  private icon: { [key: string]: string } = {
    edit: mdiCog,
    view: mdiEye,
    smoke: mdiSmoking,
    noSmoke: mdiSmokingOff,
  }

  private amenityEnd: { [key: string]: boolean } = {}
  get currentPageItems(): number[] {
    const currentCount = Number(this.selectedItem.value)
    if (Number.isNaN(currentCount)) return []
    return [...Array(currentCount)].map(
      (_, i) => i + currentCount * (this.currentPageNum - 1)
    )
  }

  mounted() {
    this.$nextTick(function () {
      this.amenityRendering()
    })
  }

  updated() {
    this.amenityRendering()
  }

  private amenityRendering() {
    this.currentPageItems.forEach((index: any) => {
      if (
        !this.rooms[index] ||
        !this.$refs[`badge${this.rooms[index].roomTypeId}`]
      )
        return

      const elList = this.$refs[`badge${this.rooms[index].roomTypeId}`] as Vue[]
      let num = 0
      elList.forEach((el: Vue) => {
        num += el.$el.clientWidth
      })
      if (num > 1370) {
        this.rooms[index].amenityNames.pop()
        this.amenityEnd[index] = true
      }
    })
  }

  private formatDay(day: string): string {
    if (!day) return ''
    return df.format(new Date(day), DATE_FORMAT)
  }

  private showBorder(index: number): string {
    return index !== 0 ? 'border-t border-solid border-bdColor' : ''
  }

  private isLastMargin(index: number, itemLength: number): string {
    return index === itemLength - 1 ? '' : 'mb-3'
  }

  private showSalesName(stopFlag: boolean): string {
    if (stopFlag) {
      return this.$t('room.list.isStopSales') as string
    } else {
      return this.$t('room.list.isOnSale') as string
    }
  }

  private selectEvent(value: number): void {
    this.selectedItem =
      this.selectData.find((item) => item.value === value) || this.selectData[2]
    roomAndPlanStore.setSelectedShowRoom(this.selectedItem)
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

  private async copy(roomTypeId: number) {
    await roomAndPlanStore.setCopyRoomData(roomTypeId)
    this.$router.push('/room-plan/create')
  }

}
</script>
<style lang="sass" scoped>
.room-list-enter-active
  transition: opacity .2s

.room-list-enter, .room-list-leave-to
  opacity: 0

.white-gradation
  background: linear-gradient(rgba(255, 255, 255, 0) 0,rgba(255, 255, 255, .4) 20%, white 97%)
</style>
