import { $axios } from '~/utils/api'
import { Calendar } from '~/types'

export default class CalendarRepository {
  async fetchSearchCalendar(dateStart: string): Promise<Calendar.Room[]> {
    try {
      const res = await $axios.get(
        `${process.env.apiUrlPrefix}/calendar/${dateStart}`
      )
      return res.data.map((data: any) => ({
        roomTypeId: data.room_type_id,
        roomName: data.room_name,
        isStopSales: data.is_stop_sales,
        stockSettingStart: data.stock_setting_start,
        stockSettingEnd: data.stock_setting_end,
        stocks: data.stocks,
        plans: data.plans,
      }))
    } catch (error) {
      return []
    }
  }
}
