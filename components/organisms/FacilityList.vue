<template>
  <table class="w-full text-black">
    <thead>
      <tr class="bg-menuColor text-black-dark">
        <th
          class="w-1/15 pl-3 py-4 border-t text-left font-light border-b border-bdColor"
        >
          {{ $t('facility.list.number') }}
        </th>
        <th
          class="w-5/15 text-left py-4 pr-5 font-light border-t border-b border-bdColor"
        >
          {{ $t('facility.list.hotelName') }}
        </th>
        <th
          class="w-5/15 text-left py-4 pr-5 font-light border-t border-b border-bdColor"
        >
          {{ $t('facility.list.hotelAddress') }}
        </th>
        <th class="w-2/15 py-4 border-t font-light border-b border-bdColor">
          {{ $t('facility.list.siteRelease') }}
        </th>
        <th class="w-2/15 py-4 border-t font-light border-b border-bdColor">
          {{ $t('facility.list.managedSelection') }}
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(facility, index) in facilityList" :key="index">
        <td class="pl-3 py-4 border-b border-bdColor text-left text-black">
          {{ index + 1 }}
        </td>
        <td
          class="max-w-420 pr-5 text-left border-b border-bdColor max-h-15 text-black break-words"
        >
          {{ facility.name }}
        </td>
        <td
          class="max-w-388 pr-5 text-left border-b border-bdColor max-h-15 text-black break-words"
        >
          {{ facility.stateProvinceName }} {{ facility.city
          }}{{ facility.line1 }}
        </td>
        <td class="py-4 border-b border-bdColor text-black">
          <ToggleBtn
            :is-active="facility.dispPriority"
            :toggle-menu="toggleMenu"
            class="h-8 w-25 m-auto"
            @click="clickToggleBtn($event, facility)"
          />
        </td>
        <td class="text-left py-4 border-b border-bdColor text-black">
          <Btn
            class="w-25 h-8 m-auto"
            :class="
              activePropertyId === facility.propertyId
                ? 'text-alert'
                : 'text-btnColor border'
            "
            color="none"
            @click="changeActiveFacility(facility.propertyId)"
          >
            {{
              activePropertyId === facility.propertyId
                ? $t('facility.button.selectBtnOn')
                : $t('facility.button.selectBtnOff')
            }}
          </Btn>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script lang="ts">
import { Component, Vue, Prop, Emit } from 'vue-property-decorator'
import { Facility, Global } from '~/types'

@Component({
  components: {
    Btn: () => import('~/components/atoms/Btn.vue'),
    ToggleBtn: () => import('~/components/molecules/ToggleBtn.vue'),
  },
})
export default class extends Vue {
  @Prop({ default: [], required: true })
  facilityList!: Facility.List[]

  @Prop({ required: true })
  activePropertyId!: number

  @Prop()
  makePrivate!: Function

  @Prop()
  makePublic!: Function

  private toggleMenu: Global.ToggleBtn[] = [
    {
      name: this.$t('facility.button.toggleBtnOn') as string,
      value: false,
    },
    {
      name: this.$t('facility.button.toggleBtnOff') as string,
      value: true,
    },
  ]

  private clickToggleBtn(
    isPublic: boolean,
    facility: Facility.ListInLocal
  ): void {
    if (isPublic) {
      this.makePublic(facility)
    } else {
      this.makePrivate(facility)
    }
  }

  @Emit()
  private changeActiveFacility(propertyId: number): number {
    return propertyId
  }
}
</script>
