<template>
  <div>
    <div
      class="border border-solid border-bdColor bg-menuColor px-6 pb-6 pt-4 mb-9"
    >
      <div class="flex items-center">
        <p class="text-lg font-bold whitespace-no-wrap">
          {{ $t('album.mainImageSection.mainImageSetting') }}
        </p>
        <IconBtn
          :icon="icon.questionIcon"
          color="text-white"
          bg-color="bg-btnColor-outline"
          :icon-width="11"
          :icon-height="11"
          :extra-class="'rounded-sm'"
          padding="p-0.7"
          class="ml-2"
          @click="openManualModal(manualData['mainImageSetting'])"
        />
      </div>
      <div class="pt-4">
        <p class="text-black">
          {{ $t('album.mainImageSection.firstDescription') }}
        </p>
        <p class="text-black">
          {{ $t('album.mainImageSection.secondDescription') }}
        </p>
        <p class="text-alert">
          {{ $t('album.mainImageSection.thirdDescription') }}
        </p>
      </div>
      <div class="flex items-center justify-between">
        <div v-for="i in 5" :key="i" class="pt-4 flex flex-col">
          <div class="flex items-baseline">
            <p class="text-lg font-bold whitespace-no-wrap">
              {{ mainImageHeadlineName(i) }}
            </p>
            <span v-if="mainImages[i - 1]" class="ml-2 text-sm">
              {{ categoryName(mainImages[i - 1].category) }}
            </span>
          </div>
          <div
            class="flex items-center justify-between w-full"
            @dblclick="mainImages[i - 1] && editAlbumDetail(mainImages[i - 1])"
          >
            <Picture
              v-if="mainImages[i - 1]"
              :image-id="String(mainImages[i - 1].id)"
              class="mt-2"
              :href="mainImages[i - 1].href"
              :is-clear="true"
              :drag-data-prefix="dragDataPrefix"
              @clear="clearMainImage"
              @drop="dropOnMainImage"
            />
            <SettingMainImage v-else class="mt-2" @drop="setMainImage" />
          </div>
        </div>
      </div>
    </div>

    <div class="mb-9">
      <div class="flex items-end justify-between">
        <Tabs
          class="-mb-px"
          :tab-data="tabData"
          :active-tab="activeTab"
          @click="clickTab"
        />
        <Btn class="w-48 mb-3" @click="clickAlbumModal(true)">{{
          $t('album.addImageButton')
        }}</Btn>
      </div>

      <div class="border border-solid border-bdColor p-4">
        <transition-group
          v-if="images[activeTab].length > 0"
          tag="div"
          name="album"
          class="grid grid-cols-4 gap-10"
        >
          <div
            v-for="index in currentPageItems"
            :key="activeTab + '-' + index"
            class="overflow-ellipsis"
          >
            <div @dblclick="editAlbumDetail(images[activeTab][index - 1])">
              <Picture
                v-if="images[activeTab][index - 1]"
                :key="images[activeTab][index - 1].id"
                :image-id="images[activeTab][index - 1].id"
                :main-number="
                  getMainImageNumber(images[activeTab][index - 1].id)
                "
                width="w-74"
                height="h-50"
                class="hover:opacity-80"
                :href="images[activeTab][index - 1].href"
                :is-clear="true"
                :is-main="images[activeTab][index - 1].isMain"
                @clear="clickClear(images[activeTab][index - 1].id)"
              />
              <p
                v-if="images[activeTab][index - 1]"
                class="text-black truncate"
              >
                {{ images[activeTab][index - 1].caption }}
              </p>
            </div>
            <br v-if="index % 4 === 0" />
          </div>
        </transition-group>
        <div
          v-if="images[activeTab].length === 0"
          class="flex items-center justify-center flex-col h-50"
        >
          <Icon
            :icon="icon.imageOffIcon"
            color="text-bdColor"
            class="mb-1"
            :icon-width="40"
            :icon-height="40"
          />
          <p class="text-center text-black-light">
            {{ $t('album.notImageList.firstText') }}<br />
            {{ $t('album.notImageList.secondText') }}
          </p>
        </div>
      </div>
    </div>

    <div class="mb-9">
      <Pagination
        :page-count-items="selectData"
        :selected-count="
          !Object.keys(selectedItem).length ? selectData[0] : selectedItem
        "
        :items-length="images[activeTab].length"
        :current-page-num="currentPageNum"
        @select-item="selectEvent"
        @click-page-num="clickPageNum"
        @click-left="clickLeft"
        @click-right="clickRight"
      />
    </div>
    <ManualModal
      v-show="isOpenManualModal"
      :is-open-manual-modal="isOpenManualModal"
      :manual-data="showManualImages"
      :close-manual-modal="closeManualModal"
    />
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Emit } from 'vue-property-decorator'
import { mdiImageOff, mdiHelp } from '@mdi/js'
import { Global, ImageManage } from '~/types'
import { IMAGE_CATEGORY } from '~/utils/const'

@Component({
  components: {
    Btn: () => import('~/components/atoms/Btn.vue'),
    Tabs: () => import('~/components/molecules/Tabs.vue'),
    Picture: () => import('~/components/molecules/Picture.vue'),
    Icon: () => import('~/components/atoms/Icon.vue'),
    IconBtn: () => import('~/components/atoms/IconBtn.vue'),
    Pagination: () => import('~/components/molecules/Pagination.vue'),
    ManualModal: () => import('~/components/molecules/ManualModal.vue'),
    SettingMainImage: () =>
      import('~/components/molecules/SettingMainImage.vue'),
  },
})
export default class extends Vue {
  @Prop({ default: {} })
  images!: { [key: string]: ImageManage.Detail[] }

  @Prop({ default: [] })
  mainImages!: ImageManage.Main[]

  @Prop({ default: 'GUEST' })
  activeTab!: string

  @Prop()
  setMainImage!: Function

  @Prop()
  clearMainImage!: Function

  @Prop()
  clearImage!: Function

  @Prop()
  isDeletingImage!: boolean

  @Prop()
  updateActiveTab!: Function

  @Prop()
  updateSortNum!: Function

  @Prop({ default: false })
  openAlbumModal!: boolean

  private dragDataPrefix: string = 'main:'
  private currentPageNum: number = 1

  private icon: { [key: string]: string } = {
    imageOffIcon: mdiImageOff,
    questionIcon: mdiHelp,
  }

  private selectData: Global.SelectboxItem[] = [
    {
      name: this.$t('global.maxShowItem.album.firstItem') as string,
      value: 12,
    },
    {
      name: this.$t('global.maxShowItem.album.secondItem') as string,
      value: 24,
    },
    {
      name: this.$t('global.maxShowItem.album.thirdItem') as string,
      value: 36,
    },
  ]

  private selectedItem: Global.SelectboxItem = this.selectData[0]

  private isOpenManualModal: boolean = false
  private showManualImages: Global.ManualItem = {}
  private manualData: Global.ManualItem = {
    mainImageSetting: {
      title: this.$t('manual.albumModal.mainImageSetting.title') as string,
      separateOption: 'dashed',
      imageList: ['/images/a-guide01.jpg', '/images/a-guide02.jpg'],
    },
  }

  // 画面上に表示するindexリスト
  get currentPageItems(): number[] {
    const currentCount = Number(this.selectedItem.value)
    if (Number.isNaN(currentCount)) return []
    let currentCountList = [...Array(currentCount)].map(
      (_, i) => i + currentCount * (this.currentPageNum - 1) + 1
    )
    const imageList = this.images[this.activeTab].slice(
      (this.currentPageNum - 1) * currentCount,
      this.currentPageNum * currentCount
    )
    if (currentCount > imageList.length) {
      currentCountList = currentCountList.slice(0, imageList.length)
    }
    return currentCountList
  }

  get tabData(): Global.TabCategory[] {
    return Object.entries(this.images).map(([key, value]) => ({
      value: key,
      name: `${IMAGE_CATEGORY[key]}(${value.length})`,
    }))
  }

  private openManualModal(manualShowData: Global.ManualItem): void {
    document.body.classList.add('swal2-shown')
    this.showManualImages = manualShowData
    this.isOpenManualModal = true
  }

  private closeManualModal(): void {
    document.body.classList.remove('swal2-shown')
    this.isOpenManualModal = false
  }

  private categoryName(key: string): string {
    return IMAGE_CATEGORY[key]
  }

  // (代表)が末尾につくかどうか
  private mainImageHeadlineName(key: number): string {
    return key === 1
      ? `${this.$t('album.mainImageSection.Main')}${key}${this.$t(
          'album.mainImageSection.Represent'
        )}`
      : `${this.$t('album.mainImageSection.Main')}${key}`
  }

  private getMainImageNumber(id: number): number {
    for (const index in this.mainImages) {
      if (this.mainImages[index].isMain && this.mainImages[index].id === id) {
        return Number(index) + 1
      }
    }
    return 0
  }

  private editAlbumDetail(albunDetail: ImageManage.Detail): void {
    this.clickAlbumModal(true, albunDetail)
  }

  private selectEvent(value: number): void {
    this.selectedItem = this.selectData.find(
      (item) => item.value === value
    ) || {
      name: this.$t('global.maxShowItem.album.firstItem') as string,
      value: 10,
    }
    this.currentPageNum = 1
  }

  private clickTab(value: string): void {
    this.currentPageNum = 1
    this.updateActiveTab(value)
  }

  private async clickClear(id: number): Promise<void> {
    if (!this.isDeletingImage) await this.clearImage(id)
  }

  private clickPageNum(num: number): void {
    this.currentPageNum = num
  }

  private clickLeft(): void {
    this.currentPageNum--
  }

  private clickRight(): void {
    this.currentPageNum++
  }

  // メイン画像ドロップ時のイベント
  private async dropOnMainImage(value: {
    from: string
    to: string
  }): Promise<void> {
    const { from, to } = value
    if (!from || from.indexOf(this.dragDataPrefix) !== 0) return

    const fromImageId = Number(from.replace(this.dragDataPrefix, ''))
    const toImageId = Number(to)
    if (!fromImageId || Number.isNaN(fromImageId)) return
    if (!toImageId || Number.isNaN(toImageId)) return

    // ドロップした先とドロップした画像の入れ替え
    const fromImage = this.mainImages.find((image) => image.id === fromImageId)
    const toImage = this.mainImages.find((image) => image.id === toImageId)

    this.mainImages.forEach((image, index) => {
      if (image.id === fromImageId) {
        this.$set(this.mainImages, index, toImage)
      }
      if (image.id === toImageId) {
        this.$set(this.mainImages, index, fromImage)
      }
    })
    const updateMainImages = this.mainImages.map((image, index) => ({
      imageId: image.id,
      sortNum: index + 1,
    }))
    // 入れ替えた後のメイン画像リストをAPIに投げて更新
    await this.updateSortNum(updateMainImages)
  }

  @Emit()
  private clickAlbumModal(
    value: boolean,
    albumDetail: ImageManage.Detail | null = null
  ): { value: boolean; albumDetail: ImageManage.Detail | null } {
    return {
      value,
      albumDetail,
    }
  }
}
</script>
<style lang="sass" scoped>
.album-enter-active
  transition: opacity .2s

.album-enter, .album-leave-to
  opacity: 0
</style>
