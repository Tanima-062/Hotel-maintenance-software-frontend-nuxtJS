export module Calendar {
  export type Price = {
    [type: string]: number
  }

  export type StockAndPrice = {
    [date: string]: {
      bookingCount: number
      prices: Price
      isEditMode: boolean
    }
  }

  export type FilterOption = {
    roomList: number[]
    planList: number[]
    sellingStatus: 0 | 1 | 2 | 3
    keyword: string
  }

  export type Plan = {
    planId: number
    planName: string
    isStopSales: boolean
    stockAndPrices: StockAndPrice
  }

  export type Stock = {
    [date: string]: {
      useDate: string
      roomCount: number
      bookingCount: number
      stock: number
      isStopSales: boolean
    }
  }

  export type Room = {
    roomTypeId: number
    roomName: string
    isStopSales: boolean
    stockSettingStart: string
    stockSettingEnd: string
    stocks: Stock
    plans: Plan[]
  }

  export type CalendarHeader = {
    defaultDate: string
    date: string
    dateApiFormat: string
    day: number
    dayName: string
    isHoliday: boolean
    isStopSales: boolean
    isRoomStocks: boolean
  }
}
