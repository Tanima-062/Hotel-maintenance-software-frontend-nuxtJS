import { $axios } from '~/utils/api'
import { Stock } from '~/types'

export default class StockRepository {
  async fetchStocksEachRoom(
    propertyId: number,
    useDate: string
  ): Promise<Stock.List[]> {
    const res = await $axios.get(
      `${process.env.apiUrlPrefix}/stock/${propertyId}/${useDate}`
    )
    return res.data.map((data: any) => {
      const tempStocks: { [key: string]: Stock.Detail } = {}
      data.stocks &&
        Object.entries(data.stocks).forEach(
          ([key, value]: [key: string, value: any]) => {
            tempStocks[key] = {
              roomCount: value.room_count,
              bookingCount: value.booking_count,
            }
          }
        )

      return {
        roomTypeId: data.room_type_id,
        name: data.name,
        stockSettingStart: data.stock_setting_start,
        stockSettingEnd: data.stock_setting_end,
        isSettingStockYearRound: data.is_setting_stock_year_round,
        stocks: tempStocks,
      }
    })
  }

  async saveStocks(inputList: Stock.Input[]): Promise<number> {
    try {
      const postData = inputList.map((inputData) => {
        const tempStocks: { [key: string]: any } = {}
        inputData.stocks &&
          Object.entries(inputData.stocks).forEach(
            ([key, value]: [key: string, value: Stock.Detail]) => {
              if (
                Number.isNaN(Number(value.roomCount)) ||
                value.roomCount === null
              ) {
                return
              }
              tempStocks[key] = {
                room_count: value.roomCount,
              }
            }
          )
        return { room_type_id: inputData.roomTypeId, stocks: tempStocks }
      })
      const res = await $axios.post(
        `${process.env.apiUrlPrefix}/stock`,
        postData
      )
      return res.status
    } catch (e) {
      return 400
    }
  }

  async changeStockSales(
    roomIds: number[],
    useDate: string,
    status: boolean
  ): Promise<number> {
    try {
      const res = await $axios.put(
        `${process.env.apiUrlPrefix}/stock/stop-sales`,
        {
          room_type_ids: roomIds,
          use_date: useDate,
          is_stop_sales: status,
        }
      )
      return res.status
    } catch (e) {
      return 400
    }
  }
}
