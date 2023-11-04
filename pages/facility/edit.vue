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
          {{ $t('room.formNavigation') }}
        </p>
      </Tabs>
    </div>
    <FacilityInput
      v-if="isFacilityTab && !isFacilityDetailTab"
      :is-connectable="isConnectable"
      :facility-base-info="facilityBaseInfo"
      :is-loading-request="isLoadingRequest"
      :fetch-facility-base-info="fetchFacilityBaseInfo"
      @save-facility="saveFacilityBaseInfo"
    />
    <FacilityDetailInput
      v-if="isFacilityDetailTab && !isFacilityTab"
      :amenities="amenities"
      :facility-base-info="facilityBaseInfo"
      :is-loading-request="isLoadingRequest"
      :facility-detail-info="facilityDetailInfo"
      :fetch-facility-detail-info="fetchFacilityDetailInfo"
      :fetch-main-image="fetchMainImage"
      @save-facility-detail="saveFacilityDetailInfo"
    />
  </main>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import alert from '~/mixins/alert'
import { Global, Facility, ImageManage } from '~/types'
import { CONNECT_PERM_ID, PREFIX_CONNECT_LIST } from '~/utils/const'
import { FacilityRepository, ImageRepository } from '~/repositories'
import { accountStore } from '~/store'

@Component({
  layout: 'AfterLogin',
  middleware: ['auth'],
  components: {
    Tabs: () => import('~/components/molecules/Tabs.vue'),
    Breadcrumb: () => import('~/components/molecules/Breadcrumb.vue'),
    FacilityInput: () => import('~/components/organisms/FacilityInput.vue'),
    FacilityDetailInput: () =>
      import('~/components/organisms/FacilityDetailInput.vue'),
  },
})
export default class extends Mixins(alert) {
  head() {
    return {
      title: `${this.$t('global.title.facilityInfo') as string} | Skyticket ${
        this.$t('global.title.admin') as string
      }`,
    }
  }

  private tabData: Global.TabCategory[] = [
    {
      value: '1',
      name: this.$t('facility.input.tab') as string,
    },
    {
      value: '2',
      name: this.$t('facility.detailinput.tab') as string,
    },
  ]

  private facilityBaseInfo: Facility.FacilityBaseInfo = {
    city: '',
    connectId: '',
    connectPassword: '',
    fax: '',
    line1: '',
    line2: '',
    line3: '',
    name: '',
    phone: '',
    postalCode: '',
    propertyId: 0,
    stateProvinceName: '',
    categoryName: '',
  }

  private facilityDetailInfo: Facility.FacilityDetailInfo = {
    propertyId: 0,
    amenities: [],
    checkinBegin: '',
    checkinEnd: '',
    checkout: '',
    descriptionAmenity: '',
    descriptionAttractions: '',
    descriptionBusinessAmenities: '',
    descriptionDining: '',
    descriptionHeadline: '',
    descriptionLocation: '',
    descriptionRooms: '',
    feeMandatory: '',
    feeOptional: '',
    instructions: '',
    policyKnowBeforeYouGo: '',
    specialInstructions: '',
  }

  private breadcrumbList: Global.BreadCrumb[] = accountStore.currentBreadCrumbs
  private amenities: Facility.Amenity[] = []
  private imageRepository = new ImageRepository()
  private facilityRepository = new FacilityRepository()
  private activeTab: string = this.tabData[0].value
  private isLoadingRequest: boolean = false
  private isConnectable: boolean = CONNECT_PERM_ID.includes(
    accountStore.wholesalerId
  )

  get isFacilityTab(): boolean {
    return this.activeTab === this.tabData[0].value
  }

  get isFacilityDetailTab(): boolean {
    return this.activeTab === this.tabData[1].value
  }

  private clickTab(value: string): void {
    if (!value) return
    this.activeTab = value
  }

  private async init(): Promise<void> {
    this.amenities = await this.facilityRepository.fetchFacilityAmenities()
  }

  private async fetchFacilityBaseInfo(loading: boolean = true): Promise<void> {
    this.isLoadingRequest = loading
    this.facilityBaseInfo = await this.facilityRepository.fetchFacilityBaseInfo(
      accountStore.activeFacilityInfo.propertyId
    )
    accountStore.updateActiveFacility({
      name: this.facilityBaseInfo.name,
      propertyId: this.facilityBaseInfo.propertyId,
      dispPriority: accountStore.activeFacilityInfo.dispPriority,
      wholesalerId: accountStore.activeFacilityInfo.wholesalerId,
    })
    // 連携ID対象のものにPrefixがある場合は設定する
    if (
      this.isConnectable &&
      this.facilityBaseInfo.connectId === '' &&
      PREFIX_CONNECT_LIST[accountStore.wholesalerId]
    ) {
      this.facilityBaseInfo.connectId =
        PREFIX_CONNECT_LIST[accountStore.wholesalerId]
    }
    this.isLoadingRequest = false
  }

  private async fetchFacilityDetailInfo(
    loading: boolean = true,
    callBack: Function | null = null
  ): Promise<void> {
    this.isLoadingRequest = loading
    this.facilityDetailInfo = await this.facilityRepository.fetchFacilityDetailInfo(
      accountStore.activeFacilityInfo.propertyId
    )
    if (callBack) callBack(this.facilityDetailInfo)
    this.isLoadingRequest = false
  }

  private async fetchMainImage(): Promise<string> {
    const rowImages: ImageManage.Main[] = await this.imageRepository.fetchImages(
      {
        propertyId: accountStore.activeFacilityInfo.propertyId,
      }
    )
    const mainImage = rowImages.find(
      (image) => image.isMain && image.sortNum === 1
    )
    return mainImage ? mainImage.href : ''
  }

  private async saveFacilityBaseInfo(
    inputData: Facility.FacilityBaseInfo
  ): Promise<void> {
    const resConfirm = await this.mixinConfirm(
      this.$t('alert.confirm') as string,
      this.$t('alert.saveContent') as string,
      this.$t('alert.yes') as string,
      this.$t('alert.no') as string
    )
    if (resConfirm) {
      this.$nuxt.$loading.start()
      const res = await this.facilityRepository.updateFacilityBaseInfo(
        inputData
      )
      if (res === 200) {
        await this.fetchFacilityBaseInfo(false)
        this.mixinAlert(
          'success',
          this.$t('alert.done') as string,
          this.$t('facility.alert.successBase') as string
        )
      } else if (res === 409) {
        this.mixinAlert(
          'error',
          this.$t('alert.error') as string,
          this.$t('facility.alert.errorAlreadyUsedConnectId') as string
        )
      } else {
        this.mixinAlert(
          'error',
          this.$t('alert.error') as string,
          this.$t('alert.errorContent') as string
        )
      }
      this.$nuxt.$loading.finish()
    }
  }

  private async saveFacilityDetailInfo(
    inputData: Facility.FacilityDetailInfo
  ): Promise<void> {
    const resConfirm = await this.mixinConfirm(
      this.$t('alert.confirm') as string,
      this.$t('alert.saveContent') as string,
      this.$t('alert.yes') as string,
      this.$t('alert.no') as string
    )
    if (resConfirm) {
      this.$nuxt.$loading.start()
      inputData.propertyId = inputData.propertyId
        ? inputData.propertyId
        : accountStore.activeFacilityInfo.propertyId
      const res = await this.facilityRepository.updateFacilityDetailInfo(
        inputData
      )
      if (res === 200) {
        await this.fetchFacilityDetailInfo(false)
        this.mixinAlert(
          'success',
          this.$t('alert.done') as string,
          this.$t('facility.alert.successDetail') as string
        )
      } else {
        this.mixinAlert(
          'error',
          this.$t('alert.error') as string,
          this.$t('alert.errorContent') as string
        )
      }
      this.$nuxt.$loading.finish()
    }
  }

  async created() {
    await this.init()
  }
}
</script>
