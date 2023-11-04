<template>
  <main class="flex-1 pt-8 px-3">
    <Breadcrumb :breadcrumb-list="breadcrumbList" class="mb-8" />
    <CancelPolicyInput
      v-if="!isLoadingRequest"
      :is-default="false"
      :is-loading-request="isLoadingRequest"
      :cancel-policy-info="cancelPolicyInfo"
      :save-cancel-policy="createCancelPolicy"
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
import { CANCELPOLICY_DEFAULT_CONDITION } from '~/utils/const'

@Component({
  layout: 'AfterLogin',
  middleware: ['auth'],
  components: {
    Breadcrumb: () => import('~/components/molecules/Breadcrumb.vue'),
    CancelPolicyInput: () =>
      import('~/components/organisms/CancelPolicyInput.vue'),
    Empty: () => import('~/components/molecules/Empty.vue'),
  },
})
export default class extends Mixins(alert) {
  head() {
    return {
      title: `${this.$t('global.title.cancelPolicy') as string} | Skyticket ${
        this.$t('global.title.admin') as string
      }`,
    }
  }

  private breadcrumbList: Global.BreadCrumb[] = accountStore.currentBreadCrumbs
  private cancelPolicyRepository = new CancelPolicyRepository()
  private isLoadingRequest: boolean = false
  private cancelPolicyInfo: CancelPolicy.Settings = {
    additionalCases: [],
    caseOfCancellationToday: { rate: 100 },
    caseOfNoShow: { rate: 100 },
    deposit: 0,
    nonRefundable: 0,
  }

  created() {
    this.fillDefaultAdditionalCases()
  }

  private fillDefaultAdditionalCases() {
    for (
      let index = 0;
      this.cancelPolicyInfo.additionalCases.length <
      CANCELPOLICY_DEFAULT_CONDITION;
      index++
    ) {
      this.cancelPolicyInfo.additionalCases.push({
        endDays: '',
        rate: '',
        startDays: '',
      })
    }
  }

  private async createCancelPolicy(
    cancelPolicyName: string,
    cancelPolicyInput: CancelPolicy.Settings
  ): Promise<void> {
    const resConfirm = await this.mixinConfirm(
      this.$t('alert.confirm') as string,
      this.$t('alert.saveContent') as string,
      this.$t('alert.yes') as string,
      this.$t('alert.no') as string
    )
    if (resConfirm) {
      cancelPolicyInput.deposit = Number(cancelPolicyInput.deposit)
      cancelPolicyInput.caseOfCancellationToday.rate = Number(
        cancelPolicyInput.caseOfCancellationToday.rate
      )
      cancelPolicyInput.caseOfNoShow.rate = Number(
        cancelPolicyInput.caseOfNoShow.rate
      )
      // 返金不可の場合は返金追加条件をリセットする
      if (cancelPolicyInput.nonRefundable) {
        cancelPolicyInput.additionalCases = []
      } else {
        cancelPolicyInput.additionalCases = cancelPolicyInput.additionalCases.filter(
          (policy) => policy.endDays && policy.rate && policy.startDays
        )
      }
      this.$nuxt.$loading.start()
      const res = await this.cancelPolicyRepository.createCancelPolicy(
        cancelPolicyName,
        accountStore.activeFacilityInfo.propertyId,
        cancelPolicyInput
      )
      if (res === 200) {
        await this.mixinAlert(
          'success',
          this.$t('alert.done') as string,
          this.$t('cancelPolicy.alert.successContent') as string
        )
        this.$router.push('/cancel-policy')
      } else {
        this.mixinAlert(
          'error',
          this.$t('alert.error') as string,
          this.$t('alert.errorContent') as string
        )
        this.$nuxt.$loading.finish()
      }
    }
  }
}
</script>
