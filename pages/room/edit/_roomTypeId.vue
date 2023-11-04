<template>
  <main class="flex-1 pt-8 px-3">
    <Breadcrumb :breadcrumb-list="breadcrumbList" class="mb-8" />
    <p class="mb-2 text-sm text-black w-full">
      {{ $t('room.formNavigation') }}
    </p>
    <RoomInput
      v-if="roomDetail"
      :room-detail="roomDetail"
      :select-data="selectData"
      :amenities="amenities"
      :room-kinds="roomKinds"
      :save-room="saveRoom"
      :is-edit="true"
      :images-room-list="imagesRoomList"
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

import { RoomRepository, ImageRepository } from '~/repositories'
import { Global, Room, ImageManage } from '~/types'
import { accountStore } from '~/store'

@Component({
  layout: 'AfterLogin',
  middleware: ['auth'],
  components: {
    Breadcrumb: () => import('~/components/molecules/Breadcrumb.vue'),
    RoomInput: () => import('~/components/organisms/RoomInput.vue'),
    Empty: () => import('~/components/molecules/Empty.vue'),
  },
})
export default class extends Vue {
  head() {
    return {
      title: `${this.$t('global.title.roomEdit') as string} | Skyticket ${
        this.$t('global.title.admin') as string
      }`,
    }
  }

  private breadcrumbList: Global.BreadCrumb[] = accountStore.currentBreadCrumbs
  private amenities: Room.Amenity[] = []
  private roomKinds: Room.RoomKind[] = []
  private isLoading: boolean = false
  private roomDetail: Room.Detail | null = null
  private imagesRoomList: ImageManage.Main[] = []
  private selectData: Global.SelectboxItem[] = [
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

  get propertyId(): number {
    return accountStore.activeFacilityInfo.propertyId
  }

  async created(): Promise<void> {
    this.isLoading = true
    const roomTypeId = Number(this.$route.params.roomTypeId)
    if (Number.isNaN(roomTypeId)) {
      this.$nuxt.error({ statusCode: 404 })
    }
    const roomRepository = new RoomRepository()
    const imageRepository = new ImageRepository()
    this.amenities = await roomRepository.fetchRoomAmenities()
    this.roomKinds = await roomRepository.fetchRoomKinds()
    this.roomDetail = await roomRepository.fetchRoomDetail(
      this.propertyId,
      roomTypeId
    )
    if (!this.roomDetail.roomTypeId) {
      this.$nuxt.error({ statusCode: 404 })
    }

    this.amenities.forEach((amenity, index) => {
      this.amenities[index].isSelected =
        this.roomDetail!.amenityIdList &&
        this.roomDetail!.amenityIdList.some(
          (amenityId) => amenityId === amenity.amenityId
        )
    })

    this.imagesRoomList = await imageRepository.fetchImages({
      propertyId: this.propertyId,
    })
    this.imagesRoomList = this.imagesRoomList.filter(
      (image) => image.category === 'GUEST'
    )
    this.isLoading = false
  }

  private async saveRoom(inputData: Room.Input): Promise<string> {
    const roomRepository = new RoomRepository()
    inputData.propertyId = this.propertyId
    return await roomRepository.updateRoom(inputData)
  }
}
</script>
