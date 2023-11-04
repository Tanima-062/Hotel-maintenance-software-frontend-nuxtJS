<template>
  <main class="flex-1 pt-8 px-3">
    <Breadcrumb :breadcrumb-list="breadcrumbList" class="mb-8" />
    <Album
      v-if="visible"
      :images="imagesFromAPI"
      :main-images="mainImages"
      :active-tab="activeTab"
      :set-main-image="setMainImage"
      :clear-main-image="clearMainImage"
      :update-active-tab="updateActiveTab"
      :update-sort-num="updateSortNum"
      :clear-image="clearImage"
      :is-deleting-image="isDeletingImage"
      :open-album-modal="openAlbumModal"
      @click-album-modal="toggleAlbumModal"
    />
    <AlbumModal
      :open="openAlbumModal"
      :categories="categories"
      :main-list="mainList"
      :active-category="activeCategory"
      :active-main-list="activeMainList"
      :upload-image="uploadImage"
      :main-image-count="mainImages.length"
      :album-detail="albumDetail"
      @close-album-modal="toggleAlbumModal"
      @selected-category="selectedCategory"
      @selected-main-list="selectedMainList"
      @submit="toggleAlbumModal"
      @reset-select-box-category="resetSelectBoxCategory"
    />
  </main>
</template>
<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import alert from '~/mixins/alert'
import { ImageManage, Global } from '~/types'
import { ImageRepository } from '~/repositories'
import { IMAGE_CATEGORY } from '~/utils/const'
import { accountStore } from '~/store'

@Component({
  layout: 'AfterLogin',
  middleware: ['auth'],
  components: {
    Breadcrumb: () => import('~/components/molecules/Breadcrumb.vue'),
    Album: () => import('~/components/organisms/Album.vue'),
    AlbumModal: () => import('~/components/organisms/AlbumModal.vue'),
  },
})
export default class extends Mixins(alert) {
  head() {
    return {
      title: `${this.$t('global.title.album') as string} | Skyticket ${
        this.$t('global.title.admin') as string
      }`,
    }
  }

  private breadcrumbList: Global.BreadCrumb[] = accountStore.currentBreadCrumbs
  private openAlbumModal: boolean = false
  private isDeletingImage: boolean = false
  private imageRepository = new ImageRepository()
  private imagesFromAPI: { [key: string]: ImageManage.Detail[] } = {}
  private mainImages: ImageManage.Main[] = []
  private visible: boolean = false
  private activeTab: string = 'GUEST'
  private albumDetail: ImageManage.Main | null = null
  private categories: Global.SelectboxItem[] = []
  private mainList: Global.SelectboxItem[] = [
    {
      name: this.$t('album.placeholder.notMainImage') as string,
      value: 0,
    },
    {
      name: this.$t('album.placeholder.mainImage') as string,
      value: 1,
    },
  ]

  private activeCategory: Global.SelectboxItem = {
    name: this.$t('album.placeholder.SelectCategory') as string,
    value: 0,
  }

  private activeMainList: Global.SelectboxItem = this.mainList[0]

  async created() {
    await this.init()
  }

  private async init() {
    const rowImages: ImageManage.Main[] = await this.imageRepository.fetchImages(
      {
        propertyId: accountStore.activeFacilityInfo.propertyId,
      }
    )

    // 画像データの初期化
    Object.keys(IMAGE_CATEGORY).forEach((category) => {
      this.$set(this.imagesFromAPI, category, [])
    })

    this.mainImages = []
    rowImages.forEach((image, index) => {
      if (!this.imagesFromAPI[rowImages[index].category]) {
        this.imagesFromAPI[rowImages[index].category] = []
      }
      const imageData: ImageManage.Detail = {
        ...rowImages[index],
      }
      this.imagesFromAPI[rowImages[index].category].push(imageData)
      if (image.isMain) {
        this.mainImages.push(rowImages[index])
      }
    })
    this.mainImages.sort((a, b) => {
      if (a.sortNum > b.sortNum) return 1
      if (a.sortNum < b.sortNum) return -1
      return 0
    })
    this.categories = Object.entries(IMAGE_CATEGORY).map(([key, value]) => ({
      name: value,
      value: key,
    }))

    this.visible = true
  }

  private updateActiveTab(value: string): void {
    this.activeTab = value
  }

  private async setMainImage(imageId: number): Promise<void> {
    const mainImage = this.imagesFromAPI[this.activeTab].find(
      (image) => !image.isMain && image.id === imageId
    )
    if (!mainImage) return

    const status = await this.imageRepository.updateIsMain({
      imageId,
      isMain: true,
      sortNum: this.mainImages.length + 1,
    })
    if (status !== 200) {
      return
    }

    Object.values(this.imagesFromAPI).forEach((images) => {
      images.forEach((image) => {
        if (image.id === imageId) {
          image.isMain = true
        }
      })
    })

    this.mainImages.push({ ...mainImage, category: this.activeTab })
  }

  private async updateSortNum(
    mainImages: ImageManage.InputSortNum[]
  ): Promise<void> {
    await this.imageRepository.updateSortNum(mainImages)
  }

  private async clearMainImage(id: string): Promise<void> {
    const imageId = Number(id)

    if (imageId && !Number.isNaN(imageId)) {
      const status = await this.imageRepository.updateIsMain({
        imageId,
        isMain: false,
        sortNum: 0,
      })
      if (status !== 200) {
        return
      }

      Object.values(this.imagesFromAPI).forEach((images) => {
        images.forEach((image) => {
          if (image.id === imageId) {
            image.isMain = false
          }
        })
      })
      this.mainImages.forEach((image, index) => {
        if (image.id === imageId) {
          this.mainImages.splice(index, 1)
        }
      })
    }
  }

  private async clearImage(imageId: number): Promise<void> {
    this.isDeletingImage = true
    if ((await this.imageRepository.deleteImage({ imageId })) !== 200) {
      this.isDeletingImage = false
      return
    }
    this.isDeletingImage = false
    this.init()
  }

  private resetSelectBoxCategory(): void {
    this.activeCategory = {
      name: this.$t('album.placeholder.SelectCategory') as string,
      value: 0,
    }
    this.activeMainList = {
      name: this.$t('album.placeholder.notMainImage') as string,
      value: 0,
    }
  }

  private async uploadImage(
    uploadData: ImageManage.InputFile
  ): Promise<boolean> {
    const status = await this.imageRepository.uploadFile(uploadData)
    if (status !== 200) {
      // this.openAlbumModal = false
      this.mixinAlert(
        'error',
        this.$t('alert.error') as string,
        this.$t('alert.errorContent') as string
      )
      return false
    }

    await this.init()
    this.updateActiveTab(uploadData.categoryCd)
    this.openAlbumModal = false
    if (uploadData.id) {
      this.mixinAlert(
        'success',
        this.$t('album.mixinAlert.editSuccess') as string,
        this.$t('album.mixinAlert.editContent') as string
      )
    }
    return true
  }

  private toggleAlbumModal({
    value,
    albumDetail = null,
  }: {
    value: boolean
    albumDetail: ImageManage.Main | null
  }): void {
    this.openAlbumModal = value
    this.albumDetail = albumDetail
    if (albumDetail) {
      this.activeCategory = {
        name: IMAGE_CATEGORY[albumDetail.category],
        value: albumDetail.category,
      }
      this.activeMainList = {
        name: albumDetail.isMain
          ? (this.$t('album.placeholder.mainImage') as string)
          : (this.$t('album.placeholder.notMainImage') as string),
        value: albumDetail.isMain ? 1 : 0,
      }
    }
  }

  private selectedCategory(v: Global.SelectboxItem): void {
    this.activeCategory = v
  }

  private selectedMainList(v: Global.SelectboxItem): void {
    this.activeMainList = v
  }
}
</script>
