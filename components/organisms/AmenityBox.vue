<template>
  <div>
    <div
      :class="!isViewMode ? 'border border-solid border-bdColor': ''"
      class="rounded mb-3 px-3 grid gap-1 grid-cols-5 auto-cols-3 overflow-y-auto max-h-285px"
    >
      <Checkbox
        v-if="!isViewMode"
        v-for="amenity in amenities"
        :key="amenity.amenityId"
        :label="amenity.name"
        class="h-11 leading-4"
        color="black-dark2"
        :checked="amenity.isSelected"
        @change="change(amenity.amenityId, !amenity.isSelected)"
      />
      <Checkbox
        v-if="isViewMode"
        v-for="amenity in amenities"
        :key="amenity.amenityId"
        :label="amenity.name"
        class="h-11 leading-4"
        color="black-dark2"
        :checked="amenity.isSelected"
        :disabled="isViewMode"
      />
    </div>
    <div class="flex items-start justify-start flex-wrap" v-if="!isViewMode">
      <Badge
        v-for="amenity in selectedAmenityList"
        :key="amenity.amenityId"
        class="flex items-center justify-center mr-2 mb-2 px-3 py-2"
        :is-clear="true"
        bg-color="bg-btnColor-badge"
        :icon-width="16"
        :icon-height="16"
        @click="change(amenity.amenityId, false)"
      >
        {{ amenity.name }}
      </Badge>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Emit } from 'vue-property-decorator'
import { Room } from '~/types'

@Component({
  components: {
    Checkbox: () => import('~/components/molecules/Checkbox.vue'),
    Badge: () => import('~/components/molecules/Badge.vue'),
  },
})
export default class extends Vue {
  @Prop({ default: [] })
  amenities!: Room.Amenity[]

  @Prop({ default: false })
  isViewMode!: boolean

  private selectedAmenityList: Room.Amenity[] = this.selectedAmenities

  get selectedAmenities(): Room.Amenity[] {
    return this.amenities.filter((amenity) => amenity.isSelected)
  }

  @Emit()
  private change(amenityId: number, bool: boolean): Room.Amenity[] {
    this.amenities.some((obj, index) => {
      if (obj.amenityId === amenityId) {
        this.$set(this.amenities[index], 'isSelected', bool)
        if (bool) {
          this.selectedAmenityList.push(this.amenities[index])
        } else {
          this.selectedAmenityList = this.selectedAmenityList.filter(
            (amenity) => amenity.amenityId !== amenityId
          )
        }
        return true
      }
      return false
    })
    return this.selectedAmenities
  }
}
</script>
