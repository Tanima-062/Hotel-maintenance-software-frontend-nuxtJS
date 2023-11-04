import { $axios } from '~/utils/api'
import { Charge } from '~/types/charge'

export default class ChargeRepository {
  async fetchPricesByPlanId(
    planId: number,
    startDate: string,
    endDate: string
  ): Promise<Charge.PlanPricesData> {
    const res = await $axios.get(
      `${process.env.apiUrlPrefix}/price/${planId}/${startDate}/${endDate}`
    )
    const planPricesList: { [date: string]: Charge.Price[] } = {}
    for (const date in res.data.prices) {
      const resultMap = res.data.prices[date].filter(
        (priceData: Charge.Price) => priceData.price > 0
      )
      if (resultMap.length) {
        planPricesList[date] = resultMap
      }
    }
    return {
      planId: res.data.plan_id,
      prices: planPricesList,
    }
  }

  async updatePricesByPlanId(
    chargePrices: Charge.PlanPricesData[]
  ): Promise<number> {
    try {
      const res = await $axios.post(
        `${process.env.apiUrlPrefix}/price`,
        chargePrices.map((planData) => {
          return {
            plan_id: planData.planId,
            prices: planData.prices,
          }
        })
      )
      return res.status
    } catch (e) {
      return 400
    }
  }
}
