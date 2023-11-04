import { $axios } from '~/utils/api'
import { Holiday } from '~/types/holiday'
import { formatDate } from '~/utils/date'

export default class HolidayRepository {
  async fetchHolidayList(): Promise<Holiday.HolidayDate> {
    const res = await $axios.get(`${process.env.apiUrlPrefix}/holiday`)
    if (res.status === 200) {
      const holidayList: Holiday.HolidayDate = {}
      res.data.map((holiday: any) => {
        holidayList[formatDate(holiday.Date, 'yyyy-MM-dd')] = holiday.Name
      })
      return holidayList
    } else {
      return {}
    }
  }
}
