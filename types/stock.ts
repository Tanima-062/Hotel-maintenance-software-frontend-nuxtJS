export module Stock {
  export type List = {
    roomTypeId: number
    name: string
    stockSettingStart: string
    stockSettingEnd: string
    isSettingStockYearRound: boolean
    stocks: { [key: string]: Detail }
  }
  export type Detail = {
    roomCount: number
    bookingCount: number
  }
  export type Day = {
    rowDate: string
    headerDate: string
    week: string
    isSaturday: boolean
    isHoliday: boolean
  }
  export type Input = {
    roomTypeId: number
    stocks: { [key: string]: Detail }
  }
  export type roomStocksCalendarData = { [key: string]: Input }
  export type InputError = {
    roomTypeId: number
    useDate: string
  }
}
