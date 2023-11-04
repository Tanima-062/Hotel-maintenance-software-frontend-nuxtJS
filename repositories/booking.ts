import { $axios } from '~/utils/api'
import { Booking } from '~/types'
import { stringToNumArray } from '~/utils/typeCasting'
import { formatTZDate } from '~/utils/date'

export default class BookingRepository {
  async fetchSearchBooking(
    searchInfo: Booking.BookingSearchInfo
  ): Promise<Booking.BookingInfo[]> {
    const applicationIds = stringToNumArray(searchInfo?.applicationIds, ' ')

    const apiParameter: any = {
      property_id: searchInfo.propertyId,
      wholesaler_id: searchInfo.wholesalerId,
      application_ids: applicationIds,
      application_start: searchInfo.applicationStart,
      application_end: searchInfo.applicationEnd,
      checkin_start: searchInfo.checkinStart,
      checkin_end: searchInfo.checkinEnd,
      checkout_start: searchInfo.checkoutStart,
      checkout_end: searchInfo.checkoutEnd,
      status: searchInfo.status,
      family_name: searchInfo.familyName,
      given_name: searchInfo.givenName,
      phone: searchInfo.phone,
    }
    Object.entries(apiParameter).map(([key, val]) => {
      if (val === 0 || val === '' || val === null) {
        delete apiParameter[key]
      }
    })

    try {
      const res = await $axios.post(`${process.env.apiUrlPrefix}/booking`, {
        ...apiParameter,
      })
      return res.data.map((data: any) => ({
        applicationCd: data.application_cd,
        checkin: data.checkin,
        checkout: data.checkout,
        cmApplicationId: data.cm_application_id,
        familyName: data.family_name,
        givenName: data.given_name,
        phone: data.phone,
        status: data.status,
        totalPayInTax: data.total_pay_in_tax,
        tourId: data.tour_id,
      }))
    } catch (e) {
      return []
    }
  }

  async fetchBookingDetail(
    propertyId: number,
    cmApplicationId: string,
    wholesalerId: number
  ): Promise<Booking.BookingDetail> {
    const res = await $axios.get(
      `${process.env.apiUrlPrefix}/booking/detail/${propertyId}/${cmApplicationId}?wholesaler_id=${wholesalerId}`
    )
    const personPriceRet: Booking.PersonPriceInfo[][] = []
    res.data.person_prices &&
      Object.values(res.data.person_prices).forEach((personPrices: any) => {
        const personPriceDateRet: Booking.PersonPriceInfo[] = []
        Object.values(personPrices).forEach((personPrice: any) => {
          const tempPersonPrice: Booking.PersonPriceInfo = {
            useDate: formatTZDate(
              personPrice.use_date,
              'yyyy/MM/dd',
              'yyyy-MM-dd'
            ),
            person: personPrice.person,
            child1Person: personPrice.child_1_person,
            child2Person: personPrice.child_2_person,
            child3Person: personPrice.child_3_person,
            child4Person: personPrice.child_4_person,
            child5Person: personPrice.child_5_person,
            child6Person: personPrice.child_6_person,
            priceInTax: personPrice.price_in_tax,
            childPrice1InTax: personPrice.child_price1_in_tax,
            childPrice2InTax: personPrice.child_price2_in_tax,
            childPrice3InTax: personPrice.child_price3_in_tax,
            childPrice4InTax: personPrice.child_price4_in_tax,
            childPrice5InTax: personPrice.child_price5_in_tax,
            childPrice6InTax: personPrice.child_price6_in_tax,
          }
          personPriceDateRet.push(tempPersonPrice)
        })
        personPriceRet.push(personPriceDateRet)
      })

    return {
      applicationCd: res.data.application_cd,
      arrival: res.data.arrival,
      wholesalerId: res.data.wholesaler_id,
      cmApplicationId: res.data.cm_application_id,
      createdAt: res.data.created_at,
      departure: res.data.departure,
      stays: res.data.stays,
      roomNum: res.data.room_num,
      emailEnc: res.data.email_enc,
      familyNameEnc: res.data.family_name_enc,
      givenNameEnc: res.data.given_name_enc,
      phoneEnc: res.data.phone_enc,
      tourId: res.data.tour_id,
      cancelFee: res.data.cancel_fee,
      cancelFeeSuggest: res.data.cancel_fee_suggest,
      cancelFlg: res.data.cancel_flg,
      discountCashAmount: res.data.discount_cash_amount,
      discountPaymentFlg: res.data.discount_payment_flg,
      noShowFee: res.data.noshow_fee,
      noShowFlg: res.data.noshow_flg,
      salePrice: res.data.sale_price,
      totalPayInTax: res.data.total_pay_in_tax,
      status: res.data.status,
      canceledDt: res.data.canceled_dt,
      rooms: res.data.rooms
        ? res.data.rooms.map((room: any) => ({
            roomId: room.room_id,
            roomName: room.room_name,
            planName: room.plan_name,
            familyName: room.family_name,
            givenName: room.given_name,
            numberOfAdults: room.number_of_adults,
            numberOfChilds: room.number_of_childs,
            childAges: room.child_ages,
            person: room.person,
            child1Person: room.child_1_person,
            child2Person: room.child_2_person,
            child3Person: room.child_3_person,
            child4Person: room.child_4_person,
            child5Person: room.child_5_person,
            child6Person: room.child_6_person,
          }))
        : [],
      flashSales: res.data.flash_sales
        ? res.data.flash_sales.map((flashSale: any) => ({
            saleName: flashSale.sale_name,
            discountCashAmount: flashSale.discount_cash_amount,
            discountCouponCount: flashSale.discount_coupon_count,
          }))
        : [],
      personPrices: personPriceRet,
    }
  }

  async updateBookingCancel(
    cancelInput: Booking.CancelRequest
  ): Promise<number> {
    try {
      const res = await $axios.put(
        `${process.env.apiUrlPrefix}/booking/cancel`,
        {
          cm_application_id: cancelInput.cmApplicationId,
          cancel_fee: cancelInput.cancelFee,
          noshow: cancelInput.noShow,
        }
      )
      return res.status
    } catch (e) {
      return 400
    }
  }

  async updateBookingNoshow(
    noShowInput: Booking.NoShowRequest
  ): Promise<number> {
    try {
      const res = await $axios.put(
        `${process.env.apiUrlPrefix}/booking/noshow`,
        {
          cm_application_id: noShowInput.cmApplicationId,
          noshow_flg: noShowInput.noShowFlg,
        }
      )
      return res.status
    } catch (e) {
      return 400
    }
  }

  // get Server Time
  async getServerTime(): Promise<string> {
    try {
      const res = await $axios.get(`${process.env.apiUrlPrefix}/servertime`)
      return res.data
    } catch (error) {
      return ''
    }
  }

  // fetch Booking Data for download as csv
  async fetchBookingInfoDownload(
    propertyId: number,
    wholesalerId: number,
    cmApplicationId: number[]
  ): Promise<Booking.BookingInfoDownload[]> {
    try {
      const res = await $axios.post(
        `${process.env.apiUrlPrefix}/booking/download`,
        {
          property_id: propertyId,
          wholesaler_id: wholesalerId,
          cm_application_ids: cmApplicationId,
        }
      )
      return res.data.map((booking: any) => {
        return {
          cmApplicationId: booking.cm_application_id,
          status: booking.status,
          cancelFlg: booking.cancel_flg,
          cancelFee: booking.cancel_fee,
          canceledDt: booking.canceled_dt,
          noShowFlg: booking.noshow_flg,
          noShowFee: booking.noshow_fee,
          applicationCd: booking.application_cd,
          tourId: booking.tour_id,
          arrival: booking.arrival,
          departure: booking.departure,
          stays: booking.stays,
          givenNameEnc: booking.given_name_enc,
          familyNameEnc: booking.family_name_enc,
          phoneEnc: booking.phone_enc,
          emailEnc: booking.email_enc,
          totalPayInTax: booking.total_pay_in_tax,
          salePrice: booking.sale_price,
          discountCashAmount: booking.discount_cash_amount,
          discountPaymentFlg: booking.discount_payment_flg,
          createdAt: booking.created_at,
          rooms: booking.rooms
            ? booking.rooms.map((room: any) => ({
                roomId: room.room_id,
                roomName: room.room_name,
                planName: room.plan_name,
                numberOfAdults: room.number_of_adults,
                numberOfChilds: room.number_of_childs,
              }))
            : [],
        }
      })
    } catch (error) {
      return []
    }
  }
}
