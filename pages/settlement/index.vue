<template>
  <main class="flex-1 pt-8 px-3">
    <Breadcrumb :breadcrumb-list="breadcrumbList" class="mb-8" />
    <p class="text-sm text-black mb-7">
      {{ $t('settlement.list.nav1')
      }}<a
        href="mailto:client-support@adventure-inc.co.jp"
        class="underline text-btnColor"
        >client-support@adventure-inc.co.jp</a
      >{{ $t('settlement.list.nav2') }}
    </p>
    <SettlementList
      :is-init-loading="isInitLoading"
      :add-year-month="addYearMonth"
      :settlement-list="settlementList"
      :select-data="selectSettlementPage"
      :update-approve="updateApprove"
      :download-settlement="downloadSettlement"
    />
  </main>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import alert from '~/mixins/alert'
import { Global, Settlement } from '~/types'
import { accountStore } from '~/store'
import { SettlementRepository } from '~/repositories'

@Component({
  layout: 'AfterLogin',
  middleware: ['auth'],
  components: {
    Breadcrumb: () => import('~/components/molecules/Breadcrumb.vue'),
    SettlementList: () => import('~/components/organisms/SettlementList.vue'),
    Empty: () => import('~/components/molecules/Empty.vue'),
  },
})
export default class extends Mixins(alert) {
  head() {
    return {
      title: `${this.$t('global.title.settlementList') as string} | Skyticket ${
        this.$t('global.title.admin') as string
      }`,
    }
  }

  private breadcrumbList: Global.BreadCrumb[] = accountStore.currentBreadCrumbs
  private selectSettlementPage: Global.SelectboxItem[] = [
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

  private settlementRepository = new SettlementRepository()
  private settlementList: Settlement.List[] = []
  private isClicked: boolean = false
  private isInitLoading: boolean = true

  async created() {
    await this.fetchSettelementList()
    this.isInitLoading = false
  }

  private async fetchSettelementList(): Promise<void> {
    this.settlementList = await this.settlementRepository.fetchSettlementList(
      accountStore.activeFacilityInfo.propertyId,
      accountStore.activeFacilityInfo.wholesalerId
    )
  }

  private addYearMonth(date: string): string {
    const dateArray = date.split('-')
    return `${dateArray[0]}${this.$t('global.year')}${dateArray[1]}${this.$t(
      'global.month'
    )}`
  }

  private async downloadSettlement({
    settlementId,
    targetDate,
  }: {
    settlementId: number
    targetDate: string
  }): Promise<void> {
    if (this.isClicked) return
    this.isClicked = true
    this.$nuxt.$loading.start()
    const filename = `${this.addYearMonth(targetDate)}_${this.$t(
      'settlement.name'
    )}`
    const res = await this.settlementRepository.fetchSettlementDownload(
      settlementId,
      filename
    )
    if (res !== 200) {
      this.mixinAlert(
        'error',
        this.$t('settlement.alert.error') as string,
        this.$t('settlement.alert.errorContent') as string
      )
    }
    this.isClicked = false
    this.$nuxt.$loading.finish()
  }

  private async updateApprove(
    settlementId: number,
    isApprove: boolean
  ): Promise<void> {
    if (this.isClicked) return
    this.isClicked = true
    this.$nuxt.$loading.start()
    const res = await this.settlementRepository.updateSettlementApprove(
      settlementId,
      isApprove
    )
    if (res === 200) {
      await this.fetchSettelementList()
    } else {
      this.mixinAlert(
        'error',
        this.$t('settlement.alert.error') as string,
        this.$t('settlement.alert.errorContent') as string
      )
    }
    this.$nuxt.$loading.finish()
    this.isClicked = false
  }
}
</script>
