<template>
  <div class="flex items-center py-2">
    <div class="flex items-center justify-between w-20">
      <Selectbox
        box-height="h-80"
        padding="py-1.5 px-3"
        :items="hourList"
        :active-item="selectedHour"
        :error="error"
        @select-item="selectTime($event, 0)"
      />
    </div>
    <span class="mr-3 text-black-light">{{ $t('plan.label.hour') }}</span>
    <div class="flex items-center justify-between w-20">
      <Selectbox
        box-height="h-auto"
        padding="py-1.5 px-3"
        :items="
          isResetLastMinute &&
          selectedTime.split(':')[0] === hourList[hourList.length - 1].value
            ? minuteList.slice(0, 1)
            : minuteList
        "
        :active-item="selectedMinute"
        :error="error"
        @select-item="selectTime($event, 1)"
      />
    </div>
    <span class="mr-3 text-black-light">{{ $t('plan.label.minute') }}</span>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit } from 'nuxt-property-decorator'
import { Global } from '~/types'

@Component({
  components: {
    Selectbox: () => import('~/components/molecules/Selectbox.vue'),
  },
})
export default class extends Vue {
  @Prop({ default: [] })
  hourOption!: Global.SelectboxItem[]

  @Prop({ default: [] })
  minuteOption!: Global.SelectboxItem[]

  @Prop({ default: '00:00' })
  selectedTime!: string

  @Prop({ default: true })
  isResetLastMinute!: boolean

  @Prop({ default: false })
  isAddDefault!: boolean

  @Prop({ default: false })
  error!: boolean

  get hourList(): Global.SelectboxItem[] {
    if (this.hourOption.length) {
      return this.isAddDefault
        ? [...[{ name: 'ー', value: 'ー' }], ...this.hourOption]
        : this.hourOption
    } else {
      return this.isAddDefault
        ? [...[{ name: 'ー', value: 'ー' }], ...Array(24)].map((_, i) => ({
            name: ('0' + i).slice(-2),
            value: ('0' + i).slice(-2),
          }))
        : [...Array(24)].map((_, i) => ({
            name: ('0' + i).slice(-2),
            value: ('0' + i).slice(-2),
          }))
    }
  }

  get minuteList(): Global.SelectboxItem[] {
    if (this.minuteOption.length) {
      return this.isAddDefault
        ? [...[{ name: 'ー', value: 'ー' }], ...this.minuteOption]
        : this.minuteOption
    } else {
      return this.isAddDefault
        ? [...[{ name: 'ー', value: 'ー' }], ...Array(60)].map((_, i) => ({
            name: ('0' + i).slice(-2),
            value: ('0' + i).slice(-2),
          }))
        : [...Array(60)].map((_, i) => ({
            name: ('0' + i).slice(-2),
            value: ('0' + i).slice(-2),
          }))
    }
  }

  get selectedHour(): Global.SelectboxItem {
    return {
      name: this.selectedTime.split(':')[0],
      value: this.selectedTime.split(':')[0],
    }
  }

  get selectedMinute(): Global.SelectboxItem {
    return {
      name: this.selectedTime.split(':')[1],
      value: this.selectedTime.split(':')[1],
    }
  }

  private selectTime(v: number | string, index: number): void {
    if (typeof v === 'number') return
    const timeSelected: string[] = this.selectedTime.split(':')
    timeSelected[index] = v
    if (
      this.isResetLastMinute &&
      index === 0 &&
      v === this.hourList[this.hourList.length - 1].value
    ) {
      timeSelected[1] = '00'
    }
    this.change(timeSelected.join(':'))
  }

  @Emit()
  private change(time: string): string {
    return time
  }
}
</script>
