export module Settlement {
  export type Info = {
    propertyId: number
    wholesalerId: number
    accountId: number
    addressee: string
    invoiceNumber: string
    bankAccountHolder: string
    bankAccountNumber: string
    bankAccountType: string
    bankBranch: string
    bankBranchCode: string
    bankBranchRuby: string
    bankCode: string
    bankName: string
    bankNameRuby: string
    emails: string[]
  }
  export type List = {
    fixedDate: string
    isApprove: boolean
    issueDate: string
    settlementId: number
    status: number
    targetDate: string
  }
  export type AvailableBank = {
    bankId: number
    branchBankId: number
    bankName: string
    bankNameKana: string
  }
}
