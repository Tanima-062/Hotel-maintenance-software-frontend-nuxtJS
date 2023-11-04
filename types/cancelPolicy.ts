export module CancelPolicy {
  export type AdditionalCase = {
    endDays: string
    rate: string
    startDays: string
  }

  export type Item = {
    id: number
    propertyId: string
    name: string
    isDefault: boolean
  }

  export type SettingsWithName = {
    name: string
    settings: Settings
  }

  export type Settings = {
    additionalCases: AdditionalCase[]
    caseOfCancellationToday: { [key: string]: number | string }
    caseOfNoShow: { [key: string]: number | string }
    deposit: number
    nonRefundable: number
  }
}
