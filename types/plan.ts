export module Plan {
  export type Detail = {
    planId: number
    planGroupId: number
    roomTypeId: number
    propertyId?: number
    planCode: string
    planCancelPolicyId?: number
    name: string
    checkInStart?: string
    checkInEnd?: string
    checkOut?: string
    description: string
    chargeCategory: number
    taxCategory: boolean
    accommodationPeriodStart: string
    accommodationPeriodEnd: string
    isAccommodatedYearRound: boolean
    publishingStartDate: string
    publishingEndDate: string
    isPublishedYearRound: boolean
    reserveAcceptDate: number
    reserveAcceptTime: string
    reserveDeadlineDate: number
    reserveDeadlineTime: string
    minStayNum: number
    maxStayNum: number
    mealConditionBreakfast: boolean
    mealConditionLunch: boolean
    mealConditionDinner: boolean
    isPackage: boolean
    isNoCancel: boolean
    planCancelPolicy?: string
    isStopSales?: boolean
    childA: ChildRate
    childB: ChildRate
    childC: ChildRate
    childD: ChildRate
    childE: ChildRate
    childF: ChildRate
    images?: Image[]
    roomName?: string
    selectedRooms?: number[]
  }
  export type List = {
    roomTypeId: number
    roomTypeCode: string
    roomName: string
    roomIsStopSales: boolean
    roomImageHref: string
    plans: Detail[]
  }
  export type ChildRate = {
    childRateId?: number
    receive: boolean
    rateCategory: number
    rate: number
    calcCategory: boolean
  }

  export type Input = Detail & {
    selectedRooms: number[]
    images: Image[]
  } & {
    planCancelPolicyId?: number | null
  }

  export type Image = {
    imageId: number
    order: number
    href: string
    caption: string
  }
}
