<template>
  <main class="flex-1 pt-8 px-3">
    <Breadcrumb :breadcrumb-list="breadcrumbList" class="mb-8" />
    <div v-if="!isLoadingRequest">
      <p class="text-sm text-black w-full mb-2.5">
        {{ $t('settlement.pageNavigation') }}
      </p>
      <SettlementInput
        :settlement-info="settlementInfo"
        :available-bank="availableBank"
        :available-branch-bank="availableBranchBank"
        :selected-bank="selectedBank"
        :selected-branch-bank="selectedBranchBank"
        @update-settlement-info="updateSettlementInfo"
        @on-input-bank-name="onInputBankName"
        @on-input-branch-bank-name="onInputBranchBankName"
        @on-leaved-bank="onLeavedBank"
        @on-leaved-branch-bank="onLeavedBranchBank"
      />
    </div>
    <Empty v-else> {{ $t('settlement.isLoading') }} </Empty>
  </main>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import { zenkaku2Hankaku } from '../../utils/string'
import alert from '~/mixins/alert'
import { Global, Settlement } from '~/types'
import { SETTLEMENT_DEFAULT_EMAIL } from '~/utils/const'
import { accountStore } from '~/store'
import { SettlementRepository } from '~/repositories'
import { BankRepository } from '~/repositories/bank'

@Component({
  layout: 'AfterLogin',
  middleware: ['auth'],
  components: {
    Breadcrumb: () => import('~/components/molecules/Breadcrumb.vue'),
    SettlementInput: () => import('~/components/organisms/SettlementInput.vue'),
    Empty: () => import('~/components/molecules/Empty.vue'),
  },
})
export default class extends Mixins(alert) {
  head() {
    return {
      title: `${this.$t('global.title.settlementInfo') as string} | Skyticket ${
        this.$t('global.title.admin') as string
      }`,
    }
  }

  private breadcrumbList: Global.BreadCrumb[] = accountStore.currentBreadCrumbs
  private settlementRepository = new SettlementRepository()
  private bankRepository = new BankRepository()
  private isLoadingRequest: boolean = false
  private availableBank: Settlement.AvailableBank[] = []
  private availableBranchBank: Settlement.AvailableBank[] = []
  private currentBankName: string = ''
  private currentBranchBankName: string = ''
  private waitingBankNameRequest: ReturnType<typeof setTimeout> | null = null
  private waitingBranchBankNameRequest: ReturnType<
    typeof setTimeout
  > | null = null

  private settlementInfo: Settlement.Info = {
    propertyId: 0,
    wholesalerId: 0,
    accountId: 0,
    addressee: '',
    invoiceNumber: '',
    bankAccountHolder: '',
    bankAccountNumber: '',
    bankAccountType: '',
    bankBranch: '',
    bankBranchCode: '',
    bankBranchRuby: '',
    bankCode: '',
    bankName: '',
    bankNameRuby: '',
    emails: [],
  }

  private zenkaku2Hankaku: Function = zenkaku2Hankaku

  private async fetchSettlementInfo(): Promise<Settlement.Info> {
    return await this.settlementRepository.fetchSettlementInfo(
      accountStore.activeFacilityInfo.propertyId
    )
  }

  private async updateSettlementInfo(
    inputSettlementInfo: Settlement.Info
  ): Promise<void> {
    const resConfirm = await this.mixinConfirm(
      this.$t('alert.confirm') as string,
      this.$t('alert.saveContent') as string,
      this.$t('alert.yes') as string,
      this.$t('alert.no') as string
    )
    if (resConfirm) {
      this.$nuxt.$loading.start()
      inputSettlementInfo.wholesalerId =
        accountStore.activeFacilityInfo.wholesalerId
      const res = await this.settlementRepository.updateSettlementInfo(
        inputSettlementInfo
      )
      this.$nuxt.$loading.finish()
      if (res === 200) {
        this.settlementInfo = await this.settlementRepository.fetchSettlementInfo(
          accountStore.activeFacilityInfo.propertyId
        )
        this.mixinAlert(
          'success',
          this.$t('alert.done') as string,
          this.$t('settlement.alert.successContent') as string
        )
      } else {
        this.mixinAlert(
          'error',
          this.$t('alert.error') as string,
          this.$t('alert.errorContent') as string
        )
      }
    }
  }

  private onInputBankName(keyword: string): void {
    if (this.waitingBankNameRequest) {
      clearTimeout(this.waitingBankNameRequest)
    }

    this.waitingBankNameRequest = setTimeout(async () => {
      this.currentBankName = keyword
      const res = await this.bankRepository.fetchAvailableBanksByKeyword(
        keyword
      )
      this.availableBank = res
    }, 300)

    this.availableBranchBank = []
  }

  private onInputBranchBankName(keyword: string): void {
    if (!this.selectedBank) {
      return
    }
    if (this.waitingBranchBankNameRequest) {
      clearTimeout(this.waitingBranchBankNameRequest)
    }

    const bankId: Number = this.selectedBank!.bankId as Number
    this.waitingBranchBankNameRequest = setTimeout(async () => {
      this.currentBranchBankName = keyword
      const res = await this.bankRepository.fetchAvailableBranchBanksByKeyword(
        bankId,
        keyword
      )
      this.availableBranchBank = res
    }, 300)
  }

  private onLeavedBank(): void {
    this.availableBank = []
  }

  private onLeavedBranchBank(): void {
    this.availableBranchBank = []
  }

  get selectedBank(): Settlement.AvailableBank | null {
    const item = this.availableBank.filter((e: Settlement.AvailableBank) => {
      return (
        this.zenkaku2Hankaku(e.bankName) ===
        this.zenkaku2Hankaku(this.currentBankName)
      )
    })

    if (item.length !== 0) {
      return item[0]
    }

    return null
  }

  get selectedBranchBank(): Settlement.AvailableBank | null {
    const item = this.availableBranchBank.filter(
      (e: Settlement.AvailableBank) => {
        return (
          this.zenkaku2Hankaku(e.bankName) ===
          this.zenkaku2Hankaku(this.currentBranchBankName)
        )
      }
    )

    if (item.length !== 0) {
      return item[0]
    }

    return null
  }

  async created() {
    this.isLoadingRequest = true
    this.settlementInfo = await this.settlementRepository.fetchSettlementInfo(
      accountStore.activeFacilityInfo.propertyId
    )
    if (!this.settlementInfo.emails.length) {
      for (let index = 0; index < SETTLEMENT_DEFAULT_EMAIL; index++) {
        this.settlementInfo.emails.push('')
      }
    }
    this.isLoadingRequest = false
  }
}
</script>
