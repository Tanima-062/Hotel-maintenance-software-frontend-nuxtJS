<template>
  <div class="flex justify-between items-center mb-2">
    <div class="flex">
      <Btn
        color="none"
        text-color="text-btnColor"
        class="items-center select-none flex flex-row mr-4"
        :is-disabled="isBeforeToday"
        :is-not-focus-line="true"
        @click="selectDate(-14)"
      >
        <Icon
          :icon="icon.doubleLeft"
          :color="`${
            isBeforeToday ? 'text-btnColor-disabled' : 'text-btnColor'
          }`"
        />
        {{ $t('calendar.pagination.twoWeekLeft') }}
      </Btn>
      <Btn
        color="none"
        text-color="text-btnColor"
        class="items-center select-none flex flex-row mr-4"
        :is-disabled="isBeforeToday"
        :is-not-focus-line="true"
        @click="selectDate(-1)"
      >
        <Icon
          :icon="icon.left"
          :color="`${
            isBeforeToday ? 'text-btnColor-disabled' : 'text-btnColor'
          }`"
        />
        {{ $t('calendar.pagination.leftButton') }}
      </Btn>
    </div>
    <div class="flex items-center">
      <Btn
        class="w-18 h-9 mr-2"
        :outline="true"
        color="blue"
        @click="checkAndChangeDate(today, true, true)"
      >
        {{ $t('calendar.searchDate.todayButton') }}
      </Btn>
      <date-picker
        ref="dateheader"
        v-model="dateValue"
        :value="dateSelected"
        format="YYYY/MM/DD"
        :disabled-date="isNotWithInAYear"
        type="date"
        :placeholder="$t('calendar.searchDate.selectDate')"
        @input="dateValue = $event"
      />

      <Btn
        class="w-18 h-9 ml-2"
        color="blue"
        @click="checkAndChangeDate(dateValue, false, true)"
      >
        {{ $t('calendar.searchDate.serachButton') }}
      </Btn>
    </div>
    <div class="flex">
      <Btn
        color="none"
        text-color="text-btnColor"
        class="items-center select-none flex flex-row mr-4"
        :is-disabled="isOneYearAfter"
        :is-not-focus-line="true"
        @click="selectDate(1)"
      >
        {{ $t('calendar.pagination.rightButton') }}
        <Icon
          :icon="icon.right"
          :color="`${
            isOneYearAfter ? 'text-pagingColor-disable' : 'text-btnColor'
          }`"
        />
      </Btn>
      <Btn
        color="none"
        text-color="text-btnColor"
        class="items-center select-none flex flex-row mr-4"
        :is-disabled="isOneYearAfter"
        :is-not-focus-line="true"
        @click="selectDate(14)"
      >
        {{ $t('calendar.pagination.twoWeekRight') }}
        <Icon
          :icon="icon.doubleRight"
          :color="`${
            isOneYearAfter ? 'text-pagingColor-disable' : 'text-btnColor'
          }`"
        />
      </Btn>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Emit } from 'vue-property-decorator'
import {
  mdiChevronDoubleLeft,
  mdiChevronLeft,
  mdiChevronRight,
  mdiChevronDoubleRight,
} from '@mdi/js'
import {
  isWithinInterval,
  startOfDay,
  endOfDay,
  addYears,
  addDays,
  isBefore,
  isAfter,
} from 'date-fns'

@Component({
  components: {
    Btn: () => import('~/components/atoms/Btn.vue'),
    Icon: () => import('~/components/atoms/Icon.vue'),
  },
})
export default class extends Vue {
  @Prop({ default: new Date() })
  dateSelected!: Date

  @Prop({
    default: () => true,
  })
  checkBeforeChange!: Function

  private dateValue: Date = new Date()
  private today: Date = addDays(new Date(), 0)
  private icon: { [key: string]: string } = {
    doubleLeft: mdiChevronDoubleLeft,
    left: mdiChevronLeft,
    right: mdiChevronRight,
    doubleRight: mdiChevronDoubleRight,
  }

  private isNotWithInAYear(date: Date): boolean {
    return !isWithinInterval(date, {
      start: startOfDay(this.today),
      end: startOfDay(addYears(this.today, 1)),
    })
  }

  get isBeforeToday(): boolean {
    return isBefore(startOfDay(this.dateSelected), endOfDay(this.today))
  }

  get isOneYearAfter(): boolean {
    return isAfter(
      endOfDay(this.dateSelected),
      startOfDay(addYears(this.today, 1))
    )
  }

  private async selectDate(daysToChange: number): Promise<void> {
    const isCheckedBefore = await this.checkBeforeChange()
    if (!isCheckedBefore) return
    if (this.isBeforeToday && this.isOneYearAfter) return

    const changedDate = addDays(this.dateSelected, daysToChange)
    const oneYearLater = addYears(this.today, 1)

    if (isAfter(endOfDay(changedDate), startOfDay(oneYearLater))) {
      this.dateValue = oneYearLater
      this.change(oneYearLater)
      return
    }
    if (isBefore(startOfDay(changedDate), endOfDay(this.today))) {
      this.dateValue = startOfDay(this.today)
      this.change(startOfDay(this.today))
      return
    }
    this.dateValue = startOfDay(changedDate)
    this.change(startOfDay(changedDate))
  }

  private async checkAndChangeDate(
    changeDate: Date,
    isToday: boolean = false,
    isNeedCheckBefore: boolean = false
  ): Promise<void> {
    if (isNeedCheckBefore) {
      const isCheckedBefore = await this.checkBeforeChange()
      if (!isCheckedBefore) return
    }
    this.change(changeDate, isToday)
  }

  @Emit()
  private change(changeDate: Date, isToday: boolean = false): Date {
    if (isToday || !changeDate) {
      this.dateValue = new Date()
      changeDate = this.dateValue
    }
    return changeDate
  }
}
</script>
