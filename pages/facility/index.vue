<template>
  <main class="flex-1 pt-8 px-3">
    <h1 class="text-3xl text-black-dark font-bold mb-8">
      {{ $t('facility.facilityInformation.pageName') }}
    </h1>
    <p class="text-sm text-black mb-7">
      {{ $t('facility.facilityInformation.pageDescription') }}
    </p>
    <FacilityList
      v-if="!isLoadingRequest"
      :facility-list="facilityList"
      :active-property-id="activePropertyId"
      :make-public="makePublic"
      :make-private="makePrivate"
      @change-active-facility="changeActiveFacility"
    />
    <Empty v-else>
      {{ $t('facility.facilityInformation.isLoading') }}
    </Empty>
    <FacilityModal
      :open="openFacilityModal"
      :image-count="imageCount"
      :user-status="userStatus"
      :selected-facility="selectedFacility"
      :update-disp-priority="updateDispPriority"
      :is-parent="isParent"
      @close-modal="toggleFacilityModal"
      @clicked="toggleFacilityModal"
    />
  </main>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { Facility } from '~/types'
import { CONNECT_PERM_ID } from '~/utils/const'
import { FacilityRepository, ImageRepository } from '~/repositories'
import { accountStore } from '~/store'

@Component({
  layout: 'AfterLogin',
  middleware: ['auth'],
  components: {
    FacilityList: () => import('~/components/organisms/FacilityList.vue'),
    FacilityModal: () => import('~/components/organisms/FacilityModal.vue'),
    Empty: () => import('~/components/molecules/Empty.vue'),
  },
})
export default class extends Vue {
  head() {
    return {
      title: `${this.$t('global.title.facility') as string} | Skyticket ${
        this.$t('global.title.admin') as string
      }`,
    }
  }

  private facilityList: Facility.List[] = []
  private facilityRepository = new FacilityRepository()
  private imageRepository = new ImageRepository()
  private imageCount: number = 0
  private userStatus: boolean = true
  private openFacilityModal: boolean = false
  private selectedFacility: Facility.ListInLocal | null = null
  private isLoadingRequest: boolean = true
  private isClicked: boolean = false

  get activePropertyId(): number {
    return accountStore.activeFacilityInfo.propertyId
  }

  get isParent(): boolean {
    return accountStore.isParentAccount
  }

  async created() {
    this.facilityList = await this.facilityRepository.fetchFacilityList()
    this.isLoadingRequest = false
  }

  private toggleFacilityModal(value: boolean): void {
    if (!value) return
    this.selectedFacility = null
    this.openFacilityModal = false
  }

  private async updateDispPriority(
    facility: Facility.ListInLocal,
    isActive: boolean
  ): Promise<void> {
    this.$nuxt.$loading.start()
    const res = await this.facilityRepository.updateDispPriority(
      facility.propertyId,
      isActive,
      facility.wholesalerId
    )
    if (res === 200) {
      this.facilityList = await this.facilityRepository.fetchFacilityList()
      const facility = this.facilityList.find(
        (facility) => facility.propertyId === this.activePropertyId
      )!
      const activeFacility: Facility.ListInLocal = { ...facility }
      accountStore.updateActiveFacility(activeFacility)
    }
    this.$nuxt.$loading.finish()
    this.openFacilityModal = false
  }

  private changeActiveFacility(propertyId: number): void {
    const facility = this.facilityList.find(
      (facility) => facility.propertyId === propertyId
    )!
    const activeFacility: Facility.ListInLocal = { ...facility }
    accountStore.updateActiveFacility(activeFacility)
  }

  private async makePrivate(facility: Facility.ListInLocal): Promise<void> {
    if (this.isClicked) return
    this.isClicked = true
    await this.updateDispPriority(facility, false)
    this.isClicked = false
  }

  private async makePublic(facility: Facility.ListInLocal): Promise<void> {
    if (this.isClicked) return
    this.isClicked = true
    this.$nuxt.$loading.start()
    this.imageCount = await this.imageRepository.fetchImageCount(
      facility.propertyId,
      facility.wholesalerId
    )
    if (CONNECT_PERM_ID.includes(facility.wholesalerId)) {
      this.userStatus = await this.facilityRepository.checkUserConnect(
        facility.propertyId,
        facility.wholesalerId
      )
    }
    this.selectedFacility = facility
    this.openFacilityModal = true
    this.$nuxt.$loading.finish()
    this.isClicked = false
  }
}
</script>
