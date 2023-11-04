<template>
  <div>
    <div class="border border-solid border-bdColor table p-0 mb-6 w-full">
      <div class="table-row-group text-base">
        <div class="table-row">
          <div class="table-cell bg-bgColor-red pt-4 pl-4 w-60">
            <p class="text-black-dark">
              {{ $t('room.label.roomName') }}
            </p>
          </div>
          <div class="table-cell pt-4 px-4">
            <p class="w-full">{{ inputData.name }}</p>
          </div>
        </div>
        <div class="table-row">
          <div class="w-full border-b border-bdColor border-dotted" />
          <div class="table-cell">
            <div class="w-full border-b border-bdColor border-dotted" />
          </div>
        </div>

        <div class="table-row">
          <div class="table-cell bg-bgColor-red pt-4 pl-4 w-60">
            <p class="text-black-dark">
              {{ $t('room.label.roomKind') }}
            </p>
          </div>
          <div class="table-cell pt-4 px-4">
            <RadioGroup
                v-model="inputData.roomKindId"
                name="room-type"
                color="text-black"
                space-between="w-40 last:w-23"
                :radio-items="roomSelectKinds"
                class="flex items-center justify-between w-100 mr-3 h-10"
                :isDisabled=true
              />
          </div>
        </div>
        <div class="table-row">
          <div class="w-full border-b border-bdColor border-dotted" />
          <div class="table-cell">
            <div class="w-full border-b border-bdColor border-dotted" />
          </div>
        </div>
        <div class="table-row">
          <div class="table-cell bg-bgColor-red pt-4 pl-4 w-60">
            <p class="text-black-dark">
              {{ $t('room.label.roomTypeCode') }}
            </p>
          </div>
          <div class="table-cell pt-4 px-4">
            <p class="w-full" v-html="inputData.roomTypeCode"></p>
          </div>
        </div>
        <div class="table-row">
          <div class="w-full border-b border-bdColor border-dotted" />
          <div class="table-cell">
            <div class="w-full border-b border-bdColor border-dotted" />
          </div>
        </div>
        <div class="table-row">
          <div class="table-cell bg-bgColor-red pt-4 pl-4 w-60 align-top">
            <p class="text-black-dark">
              {{ $t('room.formTitle.roomDesc') }}
            </p>
          </div>
          <div class="table-cell pt-4 px-4">
            <p class="w-full whitespace-pre-line">{{ inputData.roomDesc }}</p>
          </div>
        </div>
        <div class="table-row">
          <div class="w-full border-b border-bdColor border-dotted" />
          <div class="table-cell">
            <div class="w-full border-b border-bdColor border-dotted" />
          </div>
        </div>
        <div class="table-row">
            <div class="table-cell bg-bgColor-red pt-4 pl-4 w-60">
              <p class="text-black-dark">
                {{ $t('room.label.roomSetting') }}
              </p>
            </div>
            <div class="table-cell p-4">
              <div class="flex items-center">
                <p class="text-black-light3 mr-7">
                  {{ $t('room.label.roomOcu') }}
                </p>
                <span class="text-black-light mr-3">{{
                  $t('room.label.ocuMin')
                }}</span>
                <span class="mr-3">{{ inputData.ocuMin }}</span>
                <span class="mr-5 text-black-light">{{
                  $t('room.label.people')
                }}</span>
                <span class="mr-5 text-black-light">/</span>
                <span class="mr-3 text-black-light">{{
                  $t('room.label.ocuMax')
                }}</span>
                <span class="mr-3">{{ inputData.ocuMax }}</span>
                <span class="text-black-light">{{
                  $t('room.label.people')
                }}</span>
              </div>
            </div>
        </div>
        <div class="table-row">
          <div class="w-full border-b border-bdColor border-dotted" />
          <div class="table-cell">
            <div class="w-full border-b border-bdColor border-dotted" />
          </div>
        </div>
        <div class="table-row">
          <div class="table-cell bg-bgColor-red pt-4 pl-4 w-60">
            <p class="text-black-dark">
              {{ $t('room.formTitle.roomAmenity') }}
            </p>
          </div>
          <div class="table-cell pt-4 px-4 pb-2">
            <AmenityBox
              class="w-full"
              :amenities="amenities"
              :isViewMode=true
            />
          </div>
        </div>
        <div class="table-row">
          <div class="w-full border-b border-bdColor border-dotted" />
          <div class="table-cell">
            <div class="w-full border-b border-bdColor border-dotted" />
          </div>
        </div>
        <div class="table-row">
          <div class="table-cell bg-bgColor-red py-4 pl-4 w-60">
            <p class="text-black-dark">
              {{ $t('room.formTitle.roomImages') }}
            </p>
          </div>
          <div class="table-cell p-4">
            <ImageBox
              class="w-full"
              :images-list="inputData.images"
              :duplicate-images="[]"
              :remove-image="()=>{}"
              :isViewMode="true"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="flex items-center justify-center mt-6 mb-8 w-full">
      <Btn
        color="gray"
        class="w-51 m-3"
        height="big"
        @click="$router.push('/room-plan')"
      >
        {{ $t('room.backBtnText') }}
      </Btn>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Mixins, Prop } from 'vue-property-decorator'
import alert from '~/mixins/alert'
import { formatDate } from '~/utils/date'


import { Global, Room, ImageManage } from '~/types'

@Component({
  components: {
    Btn: () => import('~/components/atoms/Btn.vue'),
    RadioGroup: () => import('~/components/molecules/RadioGroup.vue'),
    AmenityBox: () => import('~/components/organisms/AmenityBox.vue'),
    ImageBox: () => import('~/components/organisms/ImageBox.vue'),
  },
})
export default class extends Mixins(alert) {
  @Prop({ default: [] })
  amenities!: Room.Amenity[]

  @Prop({ default: [] })
  roomKinds!: Room.RoomKind[]

  @Prop()
  saveRoom!: Function

  @Prop({ default: false })
  isEdit!: boolean

  @Prop({ default: false })
  isCopy!: boolean

  @Prop({ default: null })
  roomDetail!: Room.Detail

  @Prop({ default: false })
  isDirect!: boolean

  @Prop({ default: [] })
  imagesRoomList!: ImageManage.Main[]

  private currentPageNum: number = 1

  private inputData: Room.Detail = {
    propertyId: 0,
    roomTypeId: 0,
    roomTypeCode: '',
    name: '',
    roomKindId: 0,
    roomDesc: '',
    stockSettingStart: '',
    stockSettingEnd: '',
    isSettingStockYearRound: false,
    ocuMin: 0,
    ocuMax: 0,
    isSmoking: false,
    isStopSales: false,
    amenityIdList: [],
    images: [],
  }

  private selectRoomKinds: Global.RadioItem[] = []

  private activeKind: Global.RadioItem = this.roomSelectedKind

  get roomSelectKinds(): Global.RadioItem[] {
    this.selectRoomKinds = []
    this.roomKinds &&
      this.roomKinds.map((kind) => {
        this.selectRoomKinds.push({
          text: kind.kindName,
          value: kind.roomKindId,
        })
      })
    this.activeKind = this.selectRoomKinds[0]
    return this.selectRoomKinds
  }

  get roomSelectedKind(): Global.RadioItem {
    return (
      this.roomSelectKinds.find(
        (roomKind: Global.RadioItem) =>
          roomKind.value === this.inputData.roomKindId
      ) || this.activeKind
    )
  }

  private created(): void {
    if (!this.roomDetail) return

    this.inputData = {
      ...this.roomDetail,
      stockSettingStart: formatDate(this.roomDetail.stockSettingStart),
      stockSettingEnd: formatDate(this.roomDetail.stockSettingEnd),
    }
  }
}
</script>
