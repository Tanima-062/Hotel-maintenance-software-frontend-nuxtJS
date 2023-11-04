export module Room {
  export type List = {
    roomTypeId: number
    roomTypeCode: string
    name: string
    stockSettingStart: string
    stockSettingEnd: string
    isSettingStockYearRound: boolean
    isStopSales: boolean
    isSmoking: boolean
    roomDesc: string
    href: string
    imageLength: number
    amenityNames: string[],
    amenityIds: number[]
  }
  export type Detail = {
    propertyId: number
    roomTypeId: number
    roomTypeCode: string
    name: string
    roomKindId: number
    roomDesc: string
    stockSettingStart: string
    stockSettingEnd: string
    isSettingStockYearRound: boolean
    ocuMin: number
    ocuMax: number
    isSmoking: boolean
    isStopSales: boolean
    amenityIdList: number[]
    images?: Image[]
  }
  export type Amenity = {
    amenityId: number
    name: string
    isSelected: boolean
  }
  export type RoomKind = {
    roomKindId: number
    kindName: string
  }
  // Request with snake ID
  export type Image = {
    // eslint-disable-next-line camelcase
    imageId: number
    order: number
    caption: string
    href: string
  }

  export type Input = {
    propertyId: number
    roomTypeId?: number
    roomTypeCode: string
    name: string
    roomKindId: number
    roomDesc: string
    stockSettingStart: string
    stockSettingEnd: string
    isSettingStockYearRound: boolean
    ocuMin: number
    ocuMax: number
    isSmoking: boolean
    isStopSales: boolean
    images: Image[]
    amenityIdList: number[]
  }

  export type RoomForPlanEdit = {
    roomTypeId: number
    name: string
    roomTypeCode: string
  }
}
