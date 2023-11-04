import { $axios } from '~/utils/api'
import { Settlement } from '~/types'

export class BankRepository {
  async fetchAvailableBanksByKeyword(
    keyword: string
  ): Promise<Settlement.AvailableBank[]> {
    if (!keyword) {
      return []
    }
    const res = await $axios.get(
      `${process.env.apiUrlPrefix}/api/v1/bank?keyword=${keyword}`
    )

    return res.data.map((data: any) => {
      return {
        bankId: data.BankId,
        branchBankId: data.BranchBankId,
        bankName: data.BankName,
        bankNameKana: data.BankNameKana,
      }
    })
  }

  async fetchAvailableBranchBanksByKeyword(
    bankId: Number,
    keyword: String
  ): Promise<Settlement.AvailableBank[]> {
    if (!keyword) {
      return []
    }

    const res = await $axios.get(
      `${process.env.apiUrlPrefix}/api/v1/bank/${bankId}/branch?keyword=${keyword}`
    )

    return res.data.map((data: any) => {
      return {
        bankId: data.BankId,
        branchBankId: data.BranchBankId,
        bankName: data.BankName,
        bankNameKana: data.BankNameKana,
      }
    })
  }
}
