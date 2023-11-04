<template>
  <div class="bg-white flex items-center justify-between">
    <Selectbox
      :items="pageCountItems"
      :active-item="selectedCount"
      box-position="bottom"
      @select-item="selectItem"
    />
    <nav class="flex items-center justify-center" aria-label="Pagination">
      <a
        :class="
          currentPageNum === 1
            ? 'bg-pagingColor-disable cursor-not-allowed'
            : 'bg-pagingColor-icon cursor-pointer'
        "
        class="flex items-center rounded-md mr-3"
        @click="checkLeft"
      >
        <Icon :icon="leftIcon" color="text-white" />
      </a>
      <div v-for="i in maxPageNum" :key="i">
        <a
          v-if="
            i === 1 ||
            i === itemsLength ||
            (currentPageNum - 3 < i && i < currentPageNum + 3)
          "
          class="flex items-center justify-center rounded px-2 py-1 w-8 hover:bg-pagingColor-active hover:text-white mr-3 cursor-pointer"
          :class="styles(i)"
          @click="clickPageNum(i)"
        >
          {{ i }}
        </a>
        <a
          v-else-if="currentPageNum - 3 === i || i === currentPageNum + 3"
          class="flex items-center justify-center rounded px-2 py-1 w-8 text-pagingColor-text cursor-default"
        >
          ...
        </a>
      </div>
      <a
        :class="
          maxPageNum === currentPageNum
            ? 'bg-pagingColor-disable cursor-not-allowed'
            : 'bg-pagingColor-icon cursor-pointer'
        "
        class="flex items-center rounded-md"
        @click="checkRight"
      >
        <Icon :icon="rightIcon" color="text-white" />
      </a>
    </nav>
    <div>
      <p class="text-sm text-pagingColor-text">
        {{ pageInfo }}
      </p>
    </div>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop, Emit } from 'nuxt-property-decorator'
import { mdiMenuRight, mdiMenuLeft } from '@mdi/js'
import { Global } from '~/types'

@Component({
  components: {
    Selectbox: () => import('~/components/molecules/Selectbox.vue'),
    Icon: () => import('~/components/atoms/Icon.vue'),
  },
})
export default class extends Vue {
  @Prop({ default: [], required: true })
  pageCountItems!: Global.SelectboxItem[]

  @Prop({ default: {}, required: true })
  selectedCount!: Global.SelectboxItem

  @Prop({ default: 1 })
  currentPageNum!: number

  @Prop({ default: 10 })
  itemsLength!: number

  @Prop({ default: '' })
  currentPageInfo!: string

  private rightIcon: string = mdiMenuRight
  private leftIcon: string = mdiMenuLeft

  get maxPageNum(): number {
    if (Number.isNaN(Number(this.selectedCount.value))) return 0

    return Math.ceil(this.itemsLength / Number(this.selectedCount.value))
  }

  get pageInfo(): string {
    if (this.currentPageInfo) return this.currentPageInfo
    const currentCount = Number(this.selectedCount.value)
    if (Number.isNaN(currentCount)) return '- / -'
    const currentPage = currentCount * (this.currentPageNum - 1) + 1
    const pageLength = Math.min(
      this.currentPageNum * currentCount,
      this.itemsLength
    )
    return `${currentPage}-${pageLength} / ${this.itemsLength}`
  }

  private styles(value: number): string {
    const classList = []

    classList.push(
      this.currentPageNum !== value
        ? 'text-pagingColor-text bg-white'
        : 'text-white bg-pagingColor-active'
    )

    return classList.join(' ')
  }

  private checkLeft(e: Event) {
    if (this.currentPageNum > 1) {
      this.clickLeft(e)
    }
  }

  private checkRight(e: Event) {
    if (this.currentPageNum < this.maxPageNum) {
      this.clickRight(e)
    }
  }

  @Emit()
  selectItem(value: number): number {
    return value
  }

  @Emit()
  clickPageNum(pageNum: number): number {
    return pageNum
  }

  @Emit()
  clickLeft(e: Event): Event {
    return e
  }

  @Emit()
  clickRight(e: Event): Event {
    return e
  }
}
</script>
