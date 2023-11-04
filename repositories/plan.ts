import { formatRFC3339, format } from 'date-fns'
import { $axios } from '~/utils/api'
import { Plan } from '~/types'
import {
  CHILD_A_TYPE,
  CHILD_B_TYPE,
  CHILD_C_TYPE,
  CHILD_D_TYPE,
  CHILD_E_TYPE,
  CHILD_F_TYPE,
  DEFAULT_DATE,
  DATE_FORMAT,
} from '~/utils/const'

export default class PlanRepository {
  private DefaultPlanData: Plan.Detail = {
    planId: 0,
    planGroupId: 0,
    roomTypeId: 0,
    propertyId: 0,
    planCancelPolicyId: 0,
    planCode: '',
    name: '',
    description: '',
    chargeCategory: 1,
    taxCategory: false,
    checkInStart: '00:00',
    checkInEnd: '00:00',
    checkOut: '00:00',
    accommodationPeriodStart: '',
    accommodationPeriodEnd: '',
    isAccommodatedYearRound: false,
    publishingStartDate: '',
    publishingEndDate: '',
    isPublishedYearRound: false,
    reserveAcceptDate: 0,
    reserveAcceptTime: '',
    reserveDeadlineDate: 0,
    reserveDeadlineTime: '',
    minStayNum: 0,
    maxStayNum: 0,
    mealConditionBreakfast: false,
    mealConditionLunch: false,
    mealConditionDinner: false,
    isPackage: false,
    isNoCancel: false,
    isStopSales: false,
    childA: {
      receive: false,
      rateCategory: 0,
      rate: 0,
      calcCategory: false,
    },
    childB: {
      receive: false,
      rateCategory: 0,
      rate: 0,
      calcCategory: false,
    },
    childC: {
      receive: false,
      rateCategory: 0,
      rate: 0,
      calcCategory: false,
    },
    childD: {
      receive: false,
      rateCategory: 0,
      rate: 0,
      calcCategory: false,
    },
    childE: {
      receive: false,
      rateCategory: 0,
      rate: 0,
      calcCategory: false,
    },
    childF: {
      receive: false,
      rateCategory: 0,
      rate: 0,
      calcCategory: false,
    },
    images: [],
  }

  async fetchPlanList(propertyId: number): Promise<Plan.List[]> {
    const res = await $axios.get(
      `${process.env.apiUrlPrefix}/plan/${propertyId}`
    )
    return res.data.map((data: any) => ({
      roomTypeId: data.room_type_id,
      roomName: data.room_name,
      roomIsStopSales: data.room_is_stop_sales,
      roomImageHref: data.room_image_href,
      plans:
        data.plans &&
        data.plans.map((plan: any) => ({
          ...this.DefaultPlanData,
          planImageHref: plan.plan_image_href,
          planImageId: plan.plan_image_id,
          planId: plan.plan_id,
          planCode: plan.plan_code,
          name: plan.name,
          description: plan.description,
          chargeCategory: plan.charge_category,
          taxCategory: plan.tax_category,
          accommodationPeriodStart: plan.accommodation_period_start,
          accommodationPeriodEnd: plan.accommodation_period_end,
          isAccommodatedYearRound: plan.is_accommodated_year_round,
          mealConditionBreakfast: plan.meal_condition_breakfast,
          mealConditionLunch: plan.meal_condition_lunch,
          mealConditionDinner: plan.meal_condition_dinner,
          isPackage: plan.is_package,
          isStopSales: plan.is_stop_sales,
          images: [
            {
              imageId:
                plan.images && plan.images[0] ? plan.images[0].imageId : 0,
              href: plan.images && plan.images[0] ? plan.images[0].href : '',
            },
          ],
        })),
    }))
  }

  async createPlan(inputData: Plan.Input): Promise<string> {
    try {
      const images = inputData.images.map((image) => ({
        image_id: image.imageId,
        order: image.order,
        href: image.href,
      }))
      const accommodationPeriodStart = formatRFC3339(
        new Date(inputData.accommodationPeriodStart || DEFAULT_DATE)
      )
      const accommodationPeriodEnd = formatRFC3339(
        new Date(inputData.accommodationPeriodEnd || DEFAULT_DATE)
      )
      const publishingStartDate = formatRFC3339(
        new Date(inputData.publishingStartDate || DEFAULT_DATE)
      )
      const publishingEndDate = formatRFC3339(
        new Date(inputData.publishingEndDate || DEFAULT_DATE)
      )

      await $axios.post(`${process.env.apiUrlPrefix}/plan`, {
        property_id: inputData.propertyId,
        name: inputData.name,
        plan_code: inputData.planCode,
        selected_rooms: inputData.selectedRooms,
        description: inputData.description,
        charge_category: inputData.chargeCategory,
        tax_category: inputData.taxCategory,
        min_stay_category: inputData.minStayNum > 0,
        min_stay_num: inputData.minStayNum,
        max_stay_category: inputData.maxStayNum > 0,
        max_stay_num: inputData.maxStayNum,
        is_accommodated_year_round: inputData.isAccommodatedYearRound,
        accommodation_period_start: accommodationPeriodStart,
        accommodation_period_end: accommodationPeriodEnd,
        publishing_start_date: publishingStartDate,
        publishing_end_date: publishingEndDate,
        is_published_year_round: inputData.isPublishedYearRound,
        reserve_accept_date: inputData.reserveAcceptDate,
        reserve_accept_time: inputData.reserveAcceptTime,
        reserve_deadline_date: inputData.reserveDeadlineDate,
        reserve_deadline_time: inputData.reserveDeadlineTime,
        meal_condition_breakfast: inputData.mealConditionBreakfast,
        meal_condition_lunch: inputData.mealConditionLunch,
        meal_condition_dinner: inputData.mealConditionDinner,
        is_package: inputData.isPackage,
        is_no_cancel: inputData.isNoCancel,
        child_rates: [
          {
            child_rate_type: CHILD_A_TYPE,
            receive: inputData.childA.receive,
            rate_category: inputData.childA.rateCategory,
            rate: inputData.childA.rate,
            calc_category: inputData.childA.calcCategory,
          },
          {
            child_rate_type: CHILD_B_TYPE,
            receive: inputData.childB.receive,
            rate_category: inputData.childB.rateCategory,
            rate: inputData.childB.rate,
            calc_category: inputData.childB.calcCategory,
          },
          {
            child_rate_type: CHILD_C_TYPE,
            receive: inputData.childC.receive,
            rate_category: inputData.childC.rateCategory,
            rate: inputData.childC.rate,
            calc_category: inputData.childC.calcCategory,
          },
          {
            child_rate_type: CHILD_D_TYPE,
            receive: inputData.childD.receive,
            rate_category: inputData.childD.rateCategory,
            rate: inputData.childD.rate,
            calc_category: inputData.childD.calcCategory,
          },
          {
            child_rate_type: CHILD_E_TYPE,
            receive: inputData.childE.receive,
            rate_category: inputData.childE.rateCategory,
            rate: inputData.childE.rate,
            calc_category: inputData.childE.calcCategory,
          },
          {
            child_rate_type: CHILD_F_TYPE,
            receive: inputData.childF.receive,
            rate_category: inputData.childF.rateCategory,
            rate: inputData.childF.rate,
            calc_category: inputData.childF.calcCategory,
          },
        ],
        images,
        plan_cancel_policy_id: inputData.planCancelPolicyId || null,
        checkin_start: inputData.checkInStart,
        checkin_end: inputData.checkInEnd,
        checkout: inputData.checkOut,
      })
      return ''
    } catch (e: any) {
      return e.response.data.message
    }
  }

  async fetchPlanDetail(
    propertyId: number,
    planId: number
  ): Promise<Plan.Detail> {
    const res = await $axios.get(
      `${process.env.apiUrlPrefix}/plan/detail/${propertyId}/${planId}`
    )
    const initChildRate: Plan.ChildRate = {
      receive: true,
      rateCategory: 1,
      rate: 0,
      calcCategory: false,
    }
    let childA: Plan.ChildRate = JSON.parse(JSON.stringify(initChildRate))
    let childB: Plan.ChildRate = JSON.parse(JSON.stringify(initChildRate))
    let childC: Plan.ChildRate = JSON.parse(JSON.stringify(initChildRate))
    let childD: Plan.ChildRate = JSON.parse(JSON.stringify(initChildRate))
    let childE: Plan.ChildRate = JSON.parse(JSON.stringify(initChildRate))
    let childF: Plan.ChildRate = JSON.parse(JSON.stringify(initChildRate))
    res.data.child_rates &&
      res.data.child_rates.forEach((childRate: any) => {
        const temp = {
          childRateId: childRate.child_rate_id,
          receive: childRate.receive,
          rateCategory: childRate.rate_category,
          rate: childRate.rate,
          calcCategory: childRate.calc_category,
        }
        switch (childRate.child_rate_type) {
          case CHILD_A_TYPE:
            childA = temp
            break
          case CHILD_B_TYPE:
            childB = temp
            break
          case CHILD_C_TYPE:
            childC = temp
            break
          case CHILD_D_TYPE:
            childD = temp
            break
          case CHILD_E_TYPE:
            childE = temp
            break
          case CHILD_F_TYPE:
            childF = temp
        }
      })
    const accommodationPeriodStart =
      res.data.accommodation_period_start &&
      res.data.accommodation_period_start !== DEFAULT_DATE
        ? format(new Date(res.data.accommodation_period_start), DATE_FORMAT)
        : ''
    const accommodationPeriodEnd =
      res.data.accommodation_period_end &&
      res.data.accommodation_period_end !== DEFAULT_DATE
        ? format(new Date(res.data.accommodation_period_end), DATE_FORMAT)
        : ''
    const publishingStartDate =
      res.data.publishing_start_date &&
      res.data.publishing_start_date !== DEFAULT_DATE
        ? format(new Date(res.data.publishing_start_date), DATE_FORMAT)
        : ''
    const publishingEndDate =
      res.data.publishing_end_date &&
      res.data.publishing_end_date !== DEFAULT_DATE
        ? format(new Date(res.data.publishing_end_date), DATE_FORMAT)
        : ''

    // responseの画像データをコンポーネント内で使えるように変換
    const images = (imageData: any): Plan.Image[] => {
      if (!imageData) {
        return [
          {
            imageId: 0,
            order: 0,
            href: '',
            caption: '',
          },
        ]
      }
      return imageData.map((image: any) => ({
        imageId: image.image_id,
        order: image.order,
        href: image.href,
        caption: image.caption,
      }))
    }
    return {
      planId: res.data.plan_id,
      planGroupId: res.data.plan_group_id,
      roomTypeId: res.data.room_type_id,
      planCode: res.data.plan_code,
      planCancelPolicyId: res.data.plan_cancel_policy_id || 0,
      planCancelPolicy: res.data.cancel_policy || '',
      checkInStart: res.data.checkin_start || 'ー:ー',
      checkInEnd: res.data.checkin_end || 'ー:ー',
      checkOut: res.data.checkout || 'ー:ー',
      name: res.data.name,
      description: res.data.description,
      chargeCategory: res.data.charge_category,
      taxCategory: res.data.tax_category,
      minStayNum: res.data.min_stay_num,
      maxStayNum: res.data.max_stay_num,
      isAccommodatedYearRound: res.data.is_accommodated_year_round,
      accommodationPeriodStart,
      accommodationPeriodEnd,
      publishingStartDate,
      publishingEndDate,
      isPublishedYearRound: res.data.is_published_year_round,
      reserveAcceptDate: res.data.reserve_accept_date,
      reserveAcceptTime: res.data.reserve_accept_time || '00:00',
      reserveDeadlineDate: res.data.reserve_deadline_date,
      reserveDeadlineTime: res.data.reserve_deadline_time || '00:00',
      mealConditionBreakfast: res.data.meal_condition_breakfast,
      mealConditionLunch: res.data.meal_condition_lunch,
      mealConditionDinner: res.data.meal_condition_dinner,
      isPackage: res.data.is_package,
      isNoCancel: res.data.is_no_cancel,
      isStopSales: res.data.is_stop_sales,
      childA,
      childB,
      childC,
      childD,
      childE,
      childF,
      images: images(res.data.images),
      roomName: res.data.room_name || '',
      selectedRooms: res.data.active_rooms,
    }
  }

  async updatePlan(inputData: Plan.Input): Promise<string> {
    try {
      const images = inputData.images.map((image) => ({
        image_id: image.imageId,
        order: image.order,
        href: image.href,
      }))
      const accommodationPeriodStart = formatRFC3339(
        new Date(inputData.accommodationPeriodStart || DEFAULT_DATE)
      )
      const accommodationPeriodEnd = formatRFC3339(
        new Date(inputData.accommodationPeriodEnd || DEFAULT_DATE)
      )
      const publishingStartDate = formatRFC3339(
        new Date(inputData.publishingStartDate || DEFAULT_DATE)
      )
      const publishingEndDate = formatRFC3339(
        new Date(inputData.publishingEndDate || DEFAULT_DATE)
      )

      await $axios.put(`${process.env.apiUrlPrefix}/plan`, {
        plan_id: inputData.planId,
        plan_group_id: inputData.planGroupId,
        property_id: inputData.propertyId,
        plan_code: inputData.planCode,
        selected_rooms: inputData.selectedRooms,
        name: inputData.name,
        description: inputData.description,
        charge_category: inputData.chargeCategory,
        tax_category: inputData.taxCategory,
        min_stay_category: inputData.minStayNum > 0,
        min_stay_num: inputData.minStayNum,
        max_stay_category: inputData.maxStayNum > 0,
        max_stay_num: inputData.maxStayNum,
        is_accommodated_year_round: inputData.isAccommodatedYearRound,
        accommodation_period_start: accommodationPeriodStart,
        accommodation_period_end: accommodationPeriodEnd,
        publishing_start_date: publishingStartDate,
        publishing_end_date: publishingEndDate,
        is_published_year_round: inputData.isPublishedYearRound,
        reserve_accept_date: inputData.reserveAcceptDate,
        reserve_accept_time: inputData.reserveAcceptTime,
        reserve_deadline_date: inputData.reserveDeadlineDate,
        reserve_deadline_time: inputData.reserveDeadlineTime,
        meal_condition_breakfast: inputData.mealConditionBreakfast,
        meal_condition_lunch: inputData.mealConditionLunch,
        meal_condition_dinner: inputData.mealConditionDinner,
        is_package: inputData.isPackage,
        is_no_cancel: inputData.isNoCancel,
        child_rates: [
          {
            child_rate_id: inputData.childA.childRateId,
            child_rate_type: CHILD_A_TYPE,
            receive: inputData.childA.receive,
            rate_category: inputData.childA.rateCategory,
            rate: inputData.childA.rate,
            calc_category: inputData.childA.calcCategory,
          },
          {
            child_rate_id: inputData.childB.childRateId,
            child_rate_type: CHILD_B_TYPE,
            receive: inputData.childB.receive,
            rate_category: inputData.childB.rateCategory,
            rate: inputData.childB.rate,
            calc_category: inputData.childB.calcCategory,
          },
          {
            child_rate_id: inputData.childC.childRateId,
            child_rate_type: CHILD_C_TYPE,
            receive: inputData.childC.receive,
            rate_category: inputData.childC.rateCategory,
            rate: inputData.childC.rate,
            calc_category: inputData.childC.calcCategory,
          },
          {
            child_rate_id: inputData.childD.childRateId,
            child_rate_type: CHILD_D_TYPE,
            receive: inputData.childD.receive,
            rate_category: inputData.childD.rateCategory,
            rate: inputData.childD.rate,
            calc_category: inputData.childD.calcCategory,
          },
          {
            child_rate_id: inputData.childE.childRateId,
            child_rate_type: CHILD_E_TYPE,
            receive: inputData.childE.receive,
            rate_category: inputData.childE.rateCategory,
            rate: inputData.childE.rate,
            calc_category: inputData.childE.calcCategory,
          },
          {
            child_rate_id: inputData.childF.childRateId,
            child_rate_type: CHILD_F_TYPE,
            receive: inputData.childF.receive,
            rate_category: inputData.childF.rateCategory,
            rate: inputData.childF.rate,
            calc_category: inputData.childF.calcCategory,
          },
        ],
        images,
        plan_cancel_policy_id: inputData.planCancelPolicyId || null,
        checkin_start: inputData.checkInStart,
        checkin_end: inputData.checkInEnd,
        checkout: inputData.checkOut,
      })
      return ''
    } catch (e: any) {
      return e.response.data.message
    }
  }

  async changePlanSales(planId: number, status: boolean): Promise<number> {
    try {
      const res = await $axios.put(
        `${process.env.apiUrlPrefix}/plan/stop-sales`,
        {
          plan_id: planId,
          is_stop_sales: status,
        }
      )
      return res.status
    } catch (e) {
      return 400
    }
  }

  async deletePlan(planId: number): Promise<number> {
    try {
      const res = await $axios.delete(`${process.env.apiUrlPrefix}/plan`, {
        method: 'delete',
        data: { plan_id: planId },
      })
      return res.status
    } catch (e) {
      // システムエラー画面へ遷移させない
      return 400
    }
  }
}
