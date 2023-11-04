export module Charge {
  export type FormInputData = {
    people: string
    showPeople: string
    prices: string[]
  }

  export type OverwriteData = { [people: string]: string[] }

  export type DatePricesCalendar = {
    [month: string]: [WeekPeoplePrices[]]
  }

  export type WeekPeoplePrices = {
    dates: DayHoliday[]
    people: string
    prices: string[]
    showPeople: string
  }

  export type DayHoliday = {
    date: string
    isHoliday: boolean
    isShow: boolean
    isBefore: boolean
  }

  export type Price = {
    type: string
    price: number
  }

  export type PlanPricesCalendarData = { [date: string]: PlanPricesData }

  export type PlanPricesData = {
    planId: number
    prices: { [date: string]: Price[] }
  }

  export type ShowPlanPrices = {
    [date: string]: ShowPrice
  }

  export type ShowPrice = {
    [type: string]: string
  }
}
