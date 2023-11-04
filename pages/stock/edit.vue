<template>
  <main class="flex-1 pt-8 px-3">
    <Breadcrumb :breadcrumb-list="breadcrumbList" class="mb-8" />
    <Stock
      v-if="stocks && stocks.length > 0"
      :rooms-and-stocks-prop="stocks"
      :save-stocks="saveStocks"
      :base-date="baseDate"
      :holiday="holiday"
      :show-previous="showPrevious"
      :change-base-date="changeDate"
    />
    <EmptyStock v-else-if="!isSaving">
      {{ $t('stock.isSaving') }}
    </EmptyStock>
  </main>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { format } from 'date-fns'
import { StockRepository, HolidayRepository } from '~/repositories'
import { Global, Holiday, Stock } from '~/types'
import { API_DATE_FORMAT } from '~/utils/const'
import { accountStore, roomAndPlanStore } from '~/store'

@Component({
  layout: 'AfterLogin',
  middleware: ['auth'],
  components: {
    Breadcrumb: () => import('~/components/molecules/Breadcrumb.vue'),
    Stock: () => import('~/components/organisms/Stock.vue'),
    EmptyStock: () => import('~/components/molecules/Empty.vue'),
  },
})
export default class extends Vue {
  head() {
    return {
      title: `${this.$t('global.title.stock') as string} | Skyticket ${
        this.$t('global.title.admin') as string
      }`,
    }
  }

  private breadcrumbList: Global.BreadCrumb[] = accountStore.currentBreadCrumbs
  private stocks: Stock.List[] | null = null
  private baseDate: string = ''
  private holiday: Holiday.HolidayDate = {}
  private stockRepository = new StockRepository()
  private isSaving: boolean = false
  private showPrevious: boolean = false

  async created() {
    // 部屋一覧と在庫情報を取得
    const holidayRepository = new HolidayRepository()
    this.holiday = await holidayRepository.fetchHolidayList()
    this.showPrevious = roomAndPlanStore.getIsShowGoBack
    roomAndPlanStore.setIsShowBack(false)
    this.baseDate = format(new Date(), API_DATE_FORMAT)
    await this.settingStocks()
  }

  private async settingStocks() {
    const { propertyId } = accountStore.activeFacilityInfo

    this.stocks = await this.stockRepository.fetchStocksEachRoom(
      propertyId,
      this.baseDate
    )
  }

  private async saveStocks(inputData: Stock.List[]): Promise<void> {
    this.isSaving = true
    await this.stockRepository.saveStocks(inputData)

    this.stocks!.splice(0, this.stocks!.length)
    await this.settingStocks()
    this.isSaving = false
  }

  private async changeDate(value: string) {
    this.baseDate = value
    await this.settingStocks()
  }
}
</script>
