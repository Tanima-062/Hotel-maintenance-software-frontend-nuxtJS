import { formatRFC3339 } from 'date-fns'
import { $axios } from '~/utils/api'
import { Room } from '~/types'
import { DEFAULT_DATE } from '~/utils/const'

export default class RoomRepository {
  async fetchRoomList(propertyId: number): Promise<Room.List[]> {
    const res = await $axios.get(
      `${process.env.apiUrlPrefix}/room/${propertyId}`
    )
    return res.data.map((data: any) => ({
      roomTypeId: data.room_type_id,
      roomTypeCode: data.room_type_code,
      name: data.name,
      stockSettingStart: data.stock_setting_start,
      stockSettingEnd: data.stock_setting_end,
      isSettingStockYearRound: data.is_setting_stock_year_round,
      isStopSales: data.is_stop_sales,
      isSmoking: data.is_smoking,
      roomDesc: data.room_desc,
      href: data.href,
      imageLength: data.image_length,
      amenityNames: data.amenity_names,
    }))
  }

  async fetchRoomListTl(propertyId: number): Promise<Room.List[]> {
    const res = await $axios.get(
      `${process.env.apiUrlPrefix}/room/${propertyId}`
    )
    return res.data.map((data: any) => ({
      roomTypeId: data.room_type_id,
      roomTypeCode: data.room_type_code,
      name: data.name,
      stockSettingStart: data.stock_setting_start,
      stockSettingEnd: data.stock_setting_end,
      isSettingStockYearRound: data.is_setting_stock_year_round,
      isStopSales: data.is_stop_sales,
      isSmoking: data.is_smoking,
      roomDesc: data.room_desc,
      href: data.href,
      imageLength: data.image_length,
      amenityNames: data.amenity_names,
      amenityIds: data.amenity_ids
    }))

  }

  async fetchRoomAmenities(): Promise<Room.Amenity[]> {
    const res = await $axios.get(`${process.env.apiUrlPrefix}/room-amenity`)
    return res.data.map((data: any) => ({
      amenityId: data.amenity_id,
      name: data.name,
      isSelected: false,
    }))
  }

  async fetchRoomKinds(): Promise<Room.RoomKind[]> {
    const res = await $axios.get(`${process.env.apiUrlPrefix}/room-kind`)
    return res.data.map((data: any) => ({
      roomKindId: data.room_kind_id,
      kindName: data.kind_name,
    }))
  }

  async createRoom(inputData: Room.Input): Promise<string> {
    const stockSettingStart = inputData.stockSettingStart || DEFAULT_DATE
    const stockSettingEnd = inputData.stockSettingEnd || DEFAULT_DATE
    const images = inputData.images.map((input) => ({
      image_id: input.imageId,
      href: input.href,
      order: input.order,
      caption: input.caption,
    }))
    try {
      await $axios.post(`${process.env.apiUrlPrefix}/room`, {
        property_id: inputData.propertyId,
        room_type_code: inputData.roomTypeCode,
        name: inputData.name,
        room_kind_id: inputData.roomKindId,
        room_desc: inputData.roomDesc,
        stock_setting_start: formatRFC3339(new Date(stockSettingStart)),
        stock_setting_end: formatRFC3339(new Date(stockSettingEnd)),
        is_setting_stock_year_round: inputData.isSettingStockYearRound,
        ocu_min: inputData.ocuMin,
        ocu_max: inputData.ocuMax,
        is_smoking: inputData.isSmoking,
        is_stop_sales: inputData.isStopSales,
        amenity_id_list: inputData.amenityIdList,
        images,
      })
      return ''
    } catch (e: any) {
      return e.response.data.message
    }
  }

  async updateRoom(inputData: Room.Input): Promise<string> {
    const stockSettingStart = inputData.stockSettingStart || DEFAULT_DATE
    const stockSettingEnd = inputData.stockSettingEnd || DEFAULT_DATE
    const images = inputData.images.map((input) => ({
      image_id: input.imageId,
      href: input.href,
      order: input.order,
      caption: input.caption,
    }))
    try {
      await $axios.put(`${process.env.apiUrlPrefix}/room`, {
        room_type_id: inputData.roomTypeId,
        property_id: inputData.propertyId,
        room_type_code: inputData.roomTypeCode,
        name: inputData.name,
        room_kind_id: inputData.roomKindId,
        room_desc: inputData.roomDesc,
        stock_setting_start: formatRFC3339(new Date(stockSettingStart)),
        stock_setting_end: formatRFC3339(new Date(stockSettingEnd)),
        is_setting_stock_year_round: inputData.isSettingStockYearRound,
        ocu_min: inputData.ocuMin,
        ocu_max: inputData.ocuMax,
        is_smoking: inputData.isSmoking,
        is_stop_sales: inputData.isStopSales,
        amenity_id_list: inputData.amenityIdList,
        images,
      })
      return ''
    } catch (e: any) {
      return e.response.data.message
    }
  }

  async fetchRoomDetail(
    propertyId: number,
    roomTypeId: number
  ): Promise<Room.Detail> {
    const res = await $axios.get(
      `${process.env.apiUrlPrefix}/room/detail/${propertyId}/${roomTypeId}`
    )

    return {
      propertyId: res.data.property_id,
      roomTypeId: res.data.room_type_id,
      roomTypeCode: res.data.room_type_code,
      name: res.data.name,
      roomKindId: res.data.room_kind_id,
      stockSettingStart: res.data.stock_setting_start,
      stockSettingEnd: res.data.stock_setting_end,
      isSettingStockYearRound: res.data.is_setting_stock_year_round,
      isStopSales: res.data.is_stop_sales,
      isSmoking: res.data.is_smoking,
      ocuMin: res.data.ocu_min,
      ocuMax: res.data.ocu_max,
      roomDesc: res.data.room_desc,
      amenityIdList: res.data.amenity_id_list,
      images:
        res.data.images &&
        res.data.images.map((image: any) => ({
          imageId: image.image_id,
          order: image.order,
          caption: image.caption,
          href: image.href,
        })),
    }
  }

  async changeRoomSales(roomTypeId: number, status: boolean): Promise<number> {
    try {
      const res = await $axios.put(
        `${process.env.apiUrlPrefix}/room/stop-sales`,
        {
          room_type_id: roomTypeId,
          is_stop_sales: status,
        }
      )
      return res.status
    } catch (e) {
      return 400
    }
  }

  async deleteRoom(roomTypeId: number): Promise<number> {
    try {
      const res = await $axios.delete(`${process.env.apiUrlPrefix}/room`, {
        method: 'delete',
        data: { room_type_id: roomTypeId },
      })
      return res.status
    } catch (e) {
      // システムエラー画面へ遷移させない
      return 400
    }
  }
}
