<template>
  <div>
    <table class="w-full mb-6">
      <thead>
        <tr class="bg-menuColor text-black-dark">
          <th
            class="pl-2.5 w-1/6 text-left py-4 border-t font-light border-b border-bdColor"
          >
            {{ $t('settlement.table.yearAndMonthCategory') }}
          </th>
          <th
            class="w-1/6 text-left py-4 font-light border-t border-b border-bdColor"
          >
            {{ $t('settlement.table.issuedDate') }}
          </th>
          <th
            class="w-1/6 text-left py-4 font-light border-t border-b border-bdColor"
          >
            {{ $t('settlement.table.fixedDate') }}
          </th>
          <th
            class="w-1/6 text-left py-4 font-light border-t border-b border-bdColor"
          >
            {{ $t('settlement.table.status') }}
          </th>
          <th
            class="w-1/6 text-left py-4 font-light border-t border-b border-bdColor"
          >
            {{ $t('settlement.table.update') }}
          </th>
          <th
            class="w-1/6 text-left py-4 border-t font-light border-b border-bdColor"
          >
            {{ $t('settlement.table.download') }}
          </th>
        </tr>
      </thead>
      <tbody v-if="settlementList.length > 0">
        <tr v-for="index in currentPageItems" :key="index">
          <td class="pl-2.5 text-left py-4 border-b border-bdColor text-black">
            {{ addYearMonth(settlementList[index].targetDate)
            }}{{ $t('settlement.classification') }}
          </td>
          <td class="text-left py-4 border-b border-bdColor text-black">
            {{ changeFormatDate(settlementList[index].issueDate) }}
          </td>
          <td class="text-left py-4 border-b border-bdColor text-black">
            {{ changeFormatDate(settlementList[index].fixedDate) }}
          </td>
          <td class="text-left py-4 border-b border-bdColor text-black">
            <p
              :class="
                isUnApprove(settlementList[index].status) ? 'text-alert' : ''
              "
            >
              {{ getStatus(settlementList[index].status) }}
            </p>
          </td>
          <td class="text-left py-4 border-b border-bdColor text-black">
            <Btn
              v-if="isApproveFixed(settlementList[index].status)"
              class="w-30 h-8"
              color="gray"
              :is-disabled="true"
            >
              {{ $t('settlement.approval.fixed') }}
            </Btn>
            <Btn
              v-else
              class="w-30 h-8"
              :outline="true"
              :color="settlementList[index].isApprove ? 'gray' : 'blue'"
              @click="
                updateApprove(
                  settlementList[index].settlementId,
                  !settlementList[index].isApprove
                )
              "
            >
              {{
                settlementList[index].isApprove
                  ? $t('settlement.approval.fixedCancel')
                  : $t('settlement.approval.toBeFixed')
              }}
            </Btn>
          </td>
          <td class="py-4 border-b border-bdColor">
            <Btn
              class="w-30 h-8"
              @click="downloadSettlement(settlementList[index])"
              >{{ $t('settlement.name') }}</Btn
            >
          </td>
        </tr>
      </tbody>
    </table>
    <Empty
      v-if="settlementList.length === 0"
      class="w-full border-b border-solid border-bdColor"
    >
      {{ isInitLoading ? $t('settlement.isLoading') : $t('settlement.empty') }}
    </Empty>
    <div v-if="settlementList.length > 0" key="pagination" class="w-full mb-9">
      <Pagination
        :page-count-items="selectData"
        :selected-count="
          !Object.keys(selectedItem).length ? selectData[0] : selectedItem
        "
        :items-length="settlementList.length"
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
import { Component, Vue, Prop } from 'vue-property-decorator'
import { Global, Settlement } from '~/types'
import { formatDate } from '~/utils/date'
import {
  SETTLEMENT_STATUS_UNAPPROVE,
  SETTLEMENT_STATUS_APPROVE_FIXED,
  SETTLEMENT_STATUS_APPROVE,
} from '~/utils/const'

@Component({
  components: {
    Btn: () => import('~/components/atoms/Btn.vue'),
    Pagination: () => import('~/components/molecules/Pagination.vue'),
    Empty: () => import('~/components/molecules/Empty.vue'),
  },
})
export default class SettlementList extends Vue {
  @Prop({ default: [] })
  settlementList!: Settlement.List[]

  @Prop({ default: [] })
  selectData!: Global.SelectboxItem[]

  @Prop({ default: true })
  isInitLoading!: boolean

  @Prop()
  updateApprove!: Function

  @Prop()
  downloadSettlement!: Function

  @Prop()
  addYearMonth!: Function

  private currentPageNum: number = 1
  private selectedItem: Global.SelectboxItem = this.selectData[0]

  get currentPageItems(): number[] {
    const currentCount = Number(this.selectedItem.value)
    if (Number.isNaN(currentCount)) return []
    // loopCount = 表示する行の数
    const loopCount =
      currentCount * this.currentPageNum > this.settlementList.length
        ? this.settlementList.length - currentCount * (this.currentPageNum - 1)
        : currentCount
    // 行の数分の配列を作成
    return [...Array(loopCount)].map(
      (_, i) => i + currentCount * (this.currentPageNum - 1)
    )
  }

  private isUnApprove(status: number): boolean {
    return status === SETTLEMENT_STATUS_UNAPPROVE
  }

  private isApproveFixed(status: number): boolean {
    return status === SETTLEMENT_STATUS_APPROVE_FIXED
  }

  private getStatus(status: number): string {
    if (status === SETTLEMENT_STATUS_APPROVE_FIXED) {
      return this.$t('settlement.status.approveFixed') as string
    }
    if (status === SETTLEMENT_STATUS_APPROVE) {
      return this.$t('settlement.status.approve') as string
    }
    if (status === SETTLEMENT_STATUS_UNAPPROVE) {
      return this.$t('settlement.status.unApprove') as string
    }
    return ''
  }

  private selectEvent(value: number): void {
    this.selectedItem =
      this.selectData.find((item) => item.value === value) || this.selectData[0]
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

  private changeFormatDate(date: string): string {
    return formatDate(date)
  }
}
</script>
