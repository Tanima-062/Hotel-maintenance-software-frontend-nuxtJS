import { $axios } from '~/utils/api'
import { Facility } from '~/types'

export default class FacilityRepository {
  // ログインし、API接続用のTokenを取得
  async fetchFacilityList(): Promise<Facility.List[]> {
    const res = await $axios.get(`${process.env.apiUrlPrefix}/facility/init`)
    return res.data.map((data: any) => ({
      name: data.name,
      propertyId: data.property_id,
      dispPriority: !!data.disp_priority,
      stateProvinceName: data.state_province_name,
      city: data.city,
      line1: data.line_1,
      line2: data.line_2,
      line3: data.line_3,
      wholesalerId: data.wholesaler_id,
    }))
  }

  async checkUserConnect(
    propertyId: number,
    wholesalerId: number
  ): Promise<boolean> {
    const res = await $axios.get(
      `${process.env.apiUrlPrefix}/connect/${propertyId}?wholesaler_id=${wholesalerId}`
    )
    return res.data
  }

  async updateDispPriority(
    propertyId: number,
    dispPriority: boolean,
    wholesalerId: number
  ): Promise<number> {
    try {
      const res = await $axios.put(
        `${process.env.apiUrlPrefix}/facility/disp-priority`,
        {
          property_id: propertyId,
          disp_priority: dispPriority,
          wholesaler_id: wholesalerId,
        }
      )
      return res.status
    } catch (e) {
      return 400
    }
  }

  async fetchFacilityBaseInfo(
    propertyId: number
  ): Promise<Facility.FacilityBaseInfo> {
    const res = await $axios.get(
      `${process.env.apiUrlPrefix}/facility/baseinfo/${propertyId}`
    )
    return {
      city: res.data.city,
      connectId: res.data.connect_id,
      connectPassword: res.data.connect_password,
      fax: res.data.fax,
      line1: res.data.line_1,
      line2: res.data.line_2,
      line3: res.data.line_3,
      name: res.data.name,
      phone: res.data.phone,
      postalCode: res.data.postal_code,
      propertyId: res.data.property_id,
      stateProvinceName: res.data.state_province_name,
      categoryName: res.data.category_name,
    }
  }

  async updateFacilityBaseInfo(
    facilityBaseInfo: Facility.FacilityBaseInfo
  ): Promise<number> {
    try {
      const res = await $axios
        .put(`${process.env.apiUrlPrefix}/facility/baseinfo`, {
          property_id: facilityBaseInfo.propertyId,
          name: facilityBaseInfo.name,
          postal_code: facilityBaseInfo.postalCode,
          state_province_name: facilityBaseInfo.stateProvinceName,
          city: facilityBaseInfo.city,
          line_1: facilityBaseInfo.line1,
          line_2: facilityBaseInfo.line2,
          line_3: facilityBaseInfo.line3,
          phone: facilityBaseInfo.phone,
          fax: facilityBaseInfo.fax,
          connect_id: facilityBaseInfo.connectId,
          connect_password: facilityBaseInfo.connectPassword,
        })
        .then((response) => {
          return response
        })
        .catch(function (error) {
          return error.response
        })
      return res.status
    } catch (e) {
      return 400
    }
  }

  async fetchFacilityDetailInfo(
    propertyId: number
  ): Promise<Facility.FacilityDetailInfo> {
    const res = await $axios.get(
      `${process.env.apiUrlPrefix}/facility/detail/${propertyId}`
    )
    return {
      propertyId: res.data.property_id,
      checkinBegin: res.data.checkin_begin,
      checkinEnd: res.data.checkin_end,
      checkout: res.data.checkout,
      descriptionAmenity: res.data.description_amenity,
      descriptionAttractions: res.data.description_attractions,
      descriptionBusinessAmenities: res.data.description_business_amenities,
      descriptionDining: res.data.description_dining,
      descriptionHeadline: res.data.description_headline,
      descriptionLocation: res.data.description_location,
      descriptionRooms: res.data.description_rooms,
      feeMandatory: res.data.fee_mandatory,
      feeOptional: res.data.fee_optional,
      instructions: res.data.instructions,
      policyKnowBeforeYouGo: res.data.policy_know_before_you_go,
      specialInstructions: res.data.special_instructions,
      amenities: res.data.amenities
        ? res.data.amenities.map((amenity: any) => ({
            amenityId: amenity.property_amenity_id,
            name: amenity.amenity_name,
            isSelected: true,
          }))
        : [],
    }
  }

  async fetchFacilityAmenities(): Promise<Facility.Amenity[]> {
    const res = await $axios.get(
      `${process.env.apiUrlPrefix}/facility/amenities`
    )
    return res.data.map((data: any) => ({
      amenityId: data.property_amenity_id,
      name: data.amenity_name,
      isSelected: false,
    }))
  }

  async updateFacilityDetailInfo(
    facilityDetailInfo: Facility.FacilityDetailInfo
  ): Promise<number> {
    try {
      const res = await $axios.put(
        `${process.env.apiUrlPrefix}/facility/detail`,
        {
          property_id: facilityDetailInfo.propertyId,
          checkin_begin: facilityDetailInfo.checkinBegin,
          checkin_end: facilityDetailInfo.checkinEnd,
          checkout: facilityDetailInfo.checkout,
          description_amenity: facilityDetailInfo.descriptionAmenity,
          description_attractions: facilityDetailInfo.descriptionAttractions,
          description_business_amenities:
            facilityDetailInfo.descriptionBusinessAmenities,
          description_dining: facilityDetailInfo.descriptionDining,
          description_headline: facilityDetailInfo.descriptionHeadline,
          description_location: facilityDetailInfo.descriptionLocation,
          description_rooms: facilityDetailInfo.descriptionRooms,
          fee_mandatory: facilityDetailInfo.feeMandatory,
          fee_optional: facilityDetailInfo.feeOptional,
          instructions: facilityDetailInfo.instructions,
          policy_know_before_you_go: facilityDetailInfo.policyKnowBeforeYouGo,
          special_instructions: facilityDetailInfo.specialInstructions,
          amenities: facilityDetailInfo.amenities.map((amenity: any) => ({
            property_amenity_id: amenity.amenityId,
            amenity_name: amenity.name,
          })),
        }
      )
      return res.status
    } catch (e) {
      return 400
    }
  }
}
