<template>
  <main class="flex-1 pt-8 px-3">
    <Breadcrumb :breadcrumb-list="breadcrumbList" class="mb-8" />
    <CancelPolicyList
      v-if="!isLoadingRequest"
      :policy-list="policyList"
      :on-delete="onDelete"
      :set-default-cancel-policy="setDefaultCancelPolicy"
    />
    <Empty v-else> {{ $t('cancelPolicy.loading') }} </Empty>
  </main>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import alert from '~/mixins/alert'
import { Global, CancelPolicy } from '~/types'
import { CancelPolicyRepository } from '~/repositories'
import { accountStore } from '~/store'

@Component({
  layout: 'AfterLogin',
  middleware: ['auth'],
  components: {
    Breadcrumb: () => import('~/components/molecules/Breadcrumb.vue'),
    CancelPolicyList: () =>
      import('~/components/organisms/CancelPolicyList.vue'),
    Empty: () => import('~/components/molecules/Empty.vue'),
  },
})
export default class extends Mixins(alert) {
  private breadcrumbList: Global.BreadCrumb[] = accountStore.currentBreadCrumbs
  private cancelPolicyRepository = new CancelPolicyRepository()
  private policyList: CancelPolicy.Item[] = []
  private isLoadingRequest: boolean = true
  private defaultCancelPolicy: CancelPolicy.Item[] = [
    {
      id: 0,
      propertyId: accountStore.activeFacilityInfo.propertyId.toString(),
      name: this.$t('cancelPolicy.policyList.default') as string,
      isDefault: false,
    },
  ]

  async created() {
    this.isLoadingRequest = true
    await this.fetchCancelPolicyList()
    this.isLoadingRequest = false
  }

  private async fetchCancelPolicyList(): Promise<void> {
    const resultCancelPolicyList: CancelPolicy.Item[] = await this.cancelPolicyRepository.fetchCancelPolicyList(
      accountStore.activeFacilityInfo.propertyId
    )
    this.defaultCancelPolicy[0].isDefault = !resultCancelPolicyList.some(
      (cancel) => cancel.isDefault
    )
    this.policyList = [...this.defaultCancelPolicy, ...resultCancelPolicyList]
  }

  private async setDefaultCancelPolicy(
    cancelPolicyId: number | null,
    cancelPolicyName: string
  ): Promise<void> {
    const selected = await this.mixinConfirm(
      this.$t('booking.alertBox.confirmTitle') as string,
      `${cancelPolicyName}${
        this.$t('booking.alertBox.defaultCancelPolicy') as string
      }`,
      this.$t('booking.alertBox.confirmBtnText') as string,
      this.$t('booking.alertBox.cancelBtnText') as string
    )
    if (selected) {
      this.$nuxt.$loading.start()
      const res = await this.cancelPolicyRepository.setDefaultCancelPolicy(
        cancelPolicyId || null
      )
      if (res && res !== 400) {
        await this.fetchCancelPolicyList()
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

  private async onDelete(
    cancelPolicyId: number,
    cancelPolicyName: string
  ): Promise<void> {
    const resPlanList = await this.cancelPolicyRepository.fetchPlanRelationList(
      cancelPolicyId
    )
    const planList = resPlanList.length
      ? `<br/><br/><p class="text-base font-bold">${
          this.$t('cancelPolicy.policyList.planListName') as string
        }</p>${resPlanList.slice(0, 5).join('<br/>')}`
      : ''
    const resConfirm = await this.mixinDeleteAlert(
      this.$t('cancelPolicy.policyList.policyName') +
        ': ' +
        cancelPolicyName +
        planList
    )
    if (resConfirm) {
      this.$nuxt.$loading.start()
      const res = await this.cancelPolicyRepository.deleteCancelPolicy(
        cancelPolicyId
      )
      if (res === 200) {
        await this.fetchCancelPolicyList()
        this.mixinAlert(
          'success',
          '',
          this.$t('cancelPolicy.alert.successDeleteContent') as string
        )
      } else {
        this.mixinAlert(
          'error',
          this.$t('alert.error') as string,
          this.$t('alert.errorDeleteContent') as string
        )
      }
      this.$nuxt.$loading.finish()
    }
  }
}
</script>
