import { Settlement } from '~/types'
import { $axios } from '~/utils/api'

export default class SettlementRepository {
  async fetchSettlementInfo(propertyId: number): Promise<Settlement.Info> {
    const res = await $axios.get(
      `${process.env.apiUrlPrefix}/settlement/info/${propertyId}`
    )
    return {
      propertyId,
      wholesalerId: 0,
      accountId: res.data.account_id,
      addressee: res.data.addressee,
      invoiceNumber: res.data.invoice_number,
      bankAccountHolder: res.data.bank_account_holder,
      bankAccountNumber: res.data.bank_account_number,
      bankAccountType: res.data.bank_account_type,
      bankBranch: res.data.bank_branch,
      bankBranchCode: res.data.bank_branch_code,
      bankBranchRuby: res.data.bank_branch_ruby,
      bankCode: res.data.bank_code,
      bankName: res.data.bank_name,
      bankNameRuby: res.data.bank_name_ruby,
      emails: res.data.emails ? res.data.emails : [],
    }
  }

  async fetchSettlementList(
    propertyId: number,
    wholesalerId: number
  ): Promise<Settlement.List[]> {
    const res = await $axios.get(
      `${process.env.apiUrlPrefix}/settlement/${propertyId}?wholesaler_id=${wholesalerId}`
    )
    return res.data.map((data: any) => ({
      fixedDate: data.fixed_date,
      isApprove: data.is_approve,
      issueDate: data.issue_date,
      settlementId: data.settlement_id,
      status: data.status,
      targetDate: data.target_date,
    }))
  }

  async fetchSettlementDownload(settlementId: number, fileName: string) {
    try {
      const res = await $axios.get(
        `${process.env.apiUrlPrefix}/settlement/download/${settlementId}`,
        {
          headers: { Accept: 'application/pdf' },
          responseType: 'blob',
        }
      )
      const blob = new Blob([res.data], { type: 'application/pdf' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${fileName}.pdf`
      a.click()
      a.remove()
      return 200
    } catch (error) {
      return 400
    }
  }

  async updateSettlementApprove(
    settlementId: number,
    isApprove: boolean
  ): Promise<number> {
    try {
      const res = await $axios.put(
        `${process.env.apiUrlPrefix}/settlement/approve`,
        {
          settlement_id: settlementId,
          is_approve: isApprove,
        }
      )
      return res.status
    } catch (e) {
      return 400
    }
  }

  async updateSettlementInfo(input: Settlement.Info): Promise<number> {
    try {
      const res = await $axios.put(
        `${process.env.apiUrlPrefix}/settlement/info`,
        {
          property_id: input.propertyId,
          wholesaler_id: input.wholesalerId,
          account_id: input.accountId,
          addressee: input.addressee,
          invoice_number: input.invoiceNumber,
          bank_name: input.bankName,
          bank_name_ruby: input.bankNameRuby,
          bank_code: input.bankCode,
          bank_branch: input.bankBranch,
          bank_branch_ruby: input.bankBranchRuby,
          bank_branch_code: input.bankBranchCode,
          bank_account_type: input.bankAccountType,
          bank_account_number: input.bankAccountNumber,
          bank_account_holder: input.bankAccountHolder,
          emails: input.emails,
        }
      )
      return res.status
    } catch (e) {
      return 400
    }
  }
}
