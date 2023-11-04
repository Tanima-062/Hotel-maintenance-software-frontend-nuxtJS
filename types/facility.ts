export module Facility {
  export type ListInLocal = {
    name: string
    propertyId: number
    dispPriority: boolean
    wholesalerId: number
  }
  export type List = {
    name: string
    propertyId: number
    dispPriority: boolean
    stateProvinceName: string
    city: string
    line1: string
    line2: string
    line3: string
    wholesalerId: number
  }

  export type FacilityBaseInfo = {
    city: string
    connectId: string
    connectPassword: string
    fax: string
    line1: string
    line2: string
    line3: string
    name: string
    phone: string
    postalCode: string
    propertyId: number
    stateProvinceName: string
    categoryName: string
  }

  export type FacilityDetailInfo = {
    propertyId: number
    amenities: Amenity[]
    checkinBegin: string
    checkinEnd: string
    checkout: string
    descriptionAmenity: string
    descriptionAttractions: string
    descriptionBusinessAmenities: string
    descriptionDining: string
    descriptionHeadline: string
    descriptionLocation: string
    descriptionRooms: string
    feeMandatory: string
    feeOptional: string
    instructions: string
    policyKnowBeforeYouGo: string
    specialInstructions: string
  }

  export type Amenity = {
    amenityId: number
    name: string
    isSelected: boolean
  }
}
