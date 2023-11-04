export module Booking {
  export type BookingSearchInfo = {
    propertyId: number
    wholesalerId: number
    applicationIds: string
    applicationStart: string
    applicationEnd: string
    checkinStart: string
    checkinEnd: string
    checkoutStart: string
    checkoutEnd: string
    status: number
    familyName: string
    givenName: string
    phone: string
  }

  export type BookingInfo = {
    applicationCd: string
    checkin: string
    checkout: string
    cmApplicationId: number
    givenName: string
    familyName: string
    phone: string
    status: number
    totalPayInTax: number
    tourId: number
  }

  export type BookingDetail = {
    applicationCd: string
    arrival: string
    wholesalerId: number
    cmApplicationId: number
    createdAt: string
    departure: string
    stays: number
    roomNum: number
    emailEnc: string
    familyNameEnc: string
    givenNameEnc: string
    phoneEnc: string
    tourId: number
    cancelFee: number
    cancelFeeSuggest: number
    cancelFlg: boolean
    discountCashAmount: number
    discountPaymentFlg: boolean
    noShowFee: number
    noShowFlg: boolean
    salePrice: number
    totalPayInTax: number
    status: number
    canceledDt: string
    rooms: RoomInfo[]
    flashSales: FlashSaleInfo[]
    personPrices: PersonPriceInfo[][]
  }

  export type RoomInfo = {
    roomId: string
    roomName: string
    planName: string
    familyName: string
    givenName: string
    numberOfAdults: number
    numberOfChilds: number
    childAges: string
    person: number
    child1Person: number
    child2Person: number
    child3Person: number
    child4Person: number
    child5Person: number
    child6Person: number
  }

  export type FlashSaleInfo = {
    saleName: string
    discountCashAmount: number
    discountCouponCount: number
  }

  export type PersonPriceInfo = {
    useDate: string
    person: number
    child1Person: number
    child2Person: number
    child3Person: number
    child4Person: number
    child5Person: number
    child6Person: number
    priceInTax: number
    childPrice1InTax: number
    childPrice2InTax: number
    childPrice3InTax: number
    childPrice4InTax: number
    childPrice5InTax: number
    childPrice6InTax: number
  }

  export type CancelRequest = {
    cmApplicationId: number
    cancelFee: number
    noShow: number
  }

  export type NoShowRequest = {
    cmApplicationId: number
    noShowFlg: boolean
  }

  export type BookingInfoDownload = {
    cmApplicationId: number
    htThApplicationId: number
    itineraryId: string
    cancelFlg: boolean
    cancelFee: number
    canceledDt: string
    noShowFlg: boolean
    noShowFee: number
    applicationCd: string
    tourId: number
    arrival: string
    departure: string
    stays: string
    givenNameEnc: string
    familyNameEnc: string
    phoneEnc: string
    emailEnc: string
    totalPayInTax: number
    salePrice: number
    discountPaymentFlg: boolean
    discountCashAmount: number
    paymentLimitDt: string
    paymentCount: number
    createdAt: string
    status: number
    rooms: RoomInfo[]
  }
}
