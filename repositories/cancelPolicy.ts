import { $axios } from '~/utils/api'
import { CancelPolicy } from '~/types'

export default class CancelPolicyRepository {
  async fetchCancelPolicyList(
    propertyId: number
  ): Promise<CancelPolicy.Item[]> {
    try {
      const res = await $axios.get(
        `${process.env.apiUrlPrefix}/cancel-policy/list/${propertyId}`
      )
      if (res.status === 200) {
        return res.data.map((item: any) => {
          return {
            id: item.policy_id,
            propertyId: propertyId.toString(),
            name: item.policy_name,
            isDefault: !!item.is_default,
          }
        })
      }
      return []
    } catch (error) {
      return []
    }
  }

  async fetchPlanRelationList(cancelPolicyId: number): Promise<string[]> {
    try {
      const res = await $axios.get(
        `${process.env.apiUrlPrefix}/cancel-policy/plan?plan_cancel_policy_id=${cancelPolicyId}`
      )
      if (res.status === 200) {
        const data = res.data || []
        return data.map((item: any) => item.plan_name)
      }
      return []
    } catch (error) {
      return []
    }
  }

  async fetchCancelPolicy(
    propertyId: number | null,
    cancelPolicyId: number | null
  ): Promise<CancelPolicy.SettingsWithName | null> {
    try {
      let res
      if (cancelPolicyId) {
        res = await $axios.get(
          `${process.env.apiUrlPrefix}/cancel-policy/detail?plan_cancel_policy_id=${cancelPolicyId}`
        )
      } else if (propertyId) {
        res = await $axios.get(
          `${process.env.apiUrlPrefix}/cancel-policy/detail?property_id=${propertyId}`
        )
      } else {
        return null
      }
      return {
        name: res.data.CancelPolicyName,
        settings: {
          // APIからのレスポンスで、rate 255 はデータ未登録の意味を示す
          // そのまま画面に出力してはいけないのでブランクにして返す
          caseOfCancellationToday: {
            rate:
              res.data.CancelPolicyJSON.Settings.CaseOfCancellationToday
                .Rate === 255 && res.data.CancelPolicyName === null
                ? ''
                : res.data.CancelPolicyJSON.Settings.CaseOfCancellationToday
                    .Rate,
          },
          caseOfNoShow: {
            rate:
              res.data.CancelPolicyJSON.Settings.CaseOfNoShow.Rate === 255 &&
              res.data.CancelPolicyName === null
                ? ''
                : res.data.CancelPolicyJSON.Settings.CaseOfNoShow.Rate,
          },
          deposit: res.data.CancelPolicyJSON.Settings.Deposit,
          nonRefundable: res.data.CancelPolicyJSON.Settings.NonRefundable,
          additionalCases: res.data.CancelPolicyJSON.Settings.AdditionalCases
            ? res.data.CancelPolicyJSON.Settings.AdditionalCases.map(
                (addCase: any) => ({
                  endDays: addCase.AdditionalCase.EndDays,
                  rate: addCase.AdditionalCase.Rate,
                  startDays: addCase.AdditionalCase.StartDays,
                })
              )
            : [],
        },
      }
    } catch (error) {
      return null
    }
  }

  async createCancelPolicy(
    cancelPolicyName: string,
    propertyId: number,
    cancelPolicyInput: CancelPolicy.Settings
  ): Promise<number> {
    try {
      const res = await $axios.post(
        `${process.env.apiUrlPrefix}/cancel-policy/plan`,
        {
          CancelPolicyName: cancelPolicyName,
          PropertyId: propertyId,
          Settings: {
            CaseOfCancellationToday: {
              Rate: cancelPolicyInput.caseOfCancellationToday.rate,
            },
            CaseOfNoShow: {
              Rate: cancelPolicyInput.caseOfNoShow.rate,
            },
            NonRefundable: cancelPolicyInput.nonRefundable,
            Deposit: cancelPolicyInput.deposit,
            AdditionalCases: cancelPolicyInput.additionalCases.map(
              (policyCase: CancelPolicy.AdditionalCase) => ({
                AdditionalCase: {
                  StartDays: policyCase.startDays,
                  EndDays: policyCase.endDays,
                  Rate: policyCase.rate,
                },
              })
            ),
          },
        }
      )
      return res.status
    } catch (e) {
      return 400
    }
  }

  async updateCancelPolicy(
    propertyId: number | null,
    PlanCancelPolicyId: number | null,
    cancelPolicyName: string,
    cancelPolicyInput: CancelPolicy.Settings
  ): Promise<number> {
    try {
      const settings = {
        CaseOfCancellationToday: {
          Rate: cancelPolicyInput.caseOfCancellationToday.rate,
        },
        CaseOfNoShow: {
          Rate: cancelPolicyInput.caseOfNoShow.rate,
        },
        NonRefundable: cancelPolicyInput.nonRefundable,
        Deposit: cancelPolicyInput.deposit,
        AdditionalCases: cancelPolicyInput.additionalCases.map(
          (policyCase: CancelPolicy.AdditionalCase) => ({
            AdditionalCase: {
              StartDays: policyCase.startDays,
              EndDays: policyCase.endDays,
              Rate: policyCase.rate,
            },
          })
        ),
      }

      let res
      if (PlanCancelPolicyId) {
        res = await $axios.put(
          `${process.env.apiUrlPrefix}/cancel-policy/detail`,
          {
            PlanCancelPolicyId,
            CancelPolicyName: cancelPolicyName,
            Settings: settings,
          }
        )
      } else if (propertyId) {
        res = await $axios.put(
          `${process.env.apiUrlPrefix}/cancel-policy/detail`,
          {
            PropertyID: propertyId,
            Settings: settings,
          }
        )
      } else {
        return 400
      }
      return res.status
    } catch (e) {
      return 400
    }
  }

  async deleteCancelPolicy(PlanCancelPolicyId: number): Promise<number> {
    try {
      const res = await $axios.delete(
        `${process.env.apiUrlPrefix}/cancel-policy/plan/${PlanCancelPolicyId}`
      )
      return res.status
    } catch (e) {
      return 400
    }
  }

  async setDefaultCancelPolicy(
    PlanCancelPolicyId: number | null
  ): Promise<number> {
    try {
      const res = await $axios.put(
        `${process.env.apiUrlPrefix}/cancel-policy/default`,
        {
          plan_cancel_policy_id: PlanCancelPolicyId,
        }
      )
      return res.status
    } catch (e) {
      return 400
    }
  }
}
