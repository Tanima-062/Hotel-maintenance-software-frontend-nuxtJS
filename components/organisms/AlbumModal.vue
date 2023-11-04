<template>
  <transition>
    <div
      v-if="open"
      class="fixed top-0 left-0 flex items-center justify-center w-full h-full z-40"
    >
      <div
        class="w-modal p-5 bg-white flex items-center justify-center flex-col rounded z-20"
      >
        <ValidationObserver
          v-slot="{ handleSubmit }"
          tag="div"
          class="rounded bg-white pb-5 content-area flex flex-col justify-center items-center opacity-9"
        >
          <form @submit.once="handleSubmit(clickUpload)">
            <div class="w-full mb-5 flex items-center justify-between">
              <p class="text-lg text-black-dark font-bold">
                {{ $t('album.albumModal.modalTitle') }}
              </p>
              <IconBtn
                :icon="closeIcon"
                color="text-black-dark"
                hover-color="text-black-dark"
                class="mb-1"
                @click="closeAlbumModal"
              />
            </div>
            <div class="mb-6 w-full">
              <Picture
                v-if="previewFile.src"
                width="w-full"
                height="h-88"
                :image-id="previewFile.src"
                class="mt-2"
                :href="previewFile.src"
                :is-clear="!albumDetail"
                @clear="clearImage"
              />
              <SettingImage
                v-else
                width="w-full"
                height="h-88"
                nav-star="＊"
                :nav-title="$t('album.albumModal.dropZone.firstDescription')"
                :nav-text="$t('album.albumModal.dropZone.secondDescription')"
                :btn="true"
                :btn-text="$t('album.albumModal.dropZone.addImageButton')"
                btn-width="px-5"
                icon-width="60"
                icon-height="60"
                font-size="text-base"
                rules="required|required_if"
                :error="isImageError"
                :preview-file="previewFile"
                @change="settingFile"
                @drop="settingFile"
              />
              <p v-show="!albumDetail" class="text-black-light text-sm">
                {{ $t('album.albumModal.dropZone.fileName')
                }}<span class="ml-1">{{ previewFile.name }}</span>
              </p>
            </div>

            <div class="flex items-center justify-between w-full mb-4">
              <span class="text-alert">＊</span>
              <p class="mr-9">{{ $t('album.albumModal.category') }}</p>
              <Selectbox
                width="w-91"
                padding="px-3 py-1"
                :items="categories"
                rules="required|required_if"
                :error="isCategoryError"
                :active-item="activeCategory"
                @select-item="selectedCategory"
              />
            </div>
            <div class="flex items-center justify-between w-full mb-4">
              <p class="mr-2">{{ $t('album.albumModal.mainSetting') }}</p>
              <Selectbox
                width="w-91"
                padding="px-3 py-1"
                :items="mainList"
                :error="isMainListError"
                :active-item="activeMainList"
                @select-item="selectedMainList"
              />
            </div>
            <div class="flex items-start justify-between w-full mb-4">
              <p>{{ $t('album.albumModal.caption') }}</p>
              <InputTextarea
                v-model="captionText"
                :placeholder="$t('album.placeholder.caption')"
                class="w-91"
                maxlength="100"
              />
            </div>
            <ErrorText
              :err-text="errorMessage"
              class="flex justify-center w-full mb-4"
            />
            <div class="flex items-center justify-center w-full">
              <Btn color="blue" class="w-50" @click="clickUpload">{{
                fillAlbumInfo ? '編集する' : $t('album.albumModal.modalButton')
              }}</Btn>
            </div>
          </form>
        </ValidationObserver>
      </div>
      <div
        class="absolute top-0 left-0 opacity-40 bg-overlayColor w-full h-full z-10"
        @click="closeAlbumModal"
      />
    </div>
  </transition>
</template>
<script lang="ts">
import { Component, Vue, Prop, Emit } from 'vue-property-decorator'
import { mdiClose } from '@mdi/js'
import { Global, ImageManage } from '~/types'

@Component({
  components: {
    Btn: () => import('~/components/atoms/Btn.vue'),
    ErrorText: () => import('~/components/atoms/ErrorText.vue'),
    IconBtn: () => import('~/components/atoms/IconBtn.vue'),
    Picture: () => import('~/components/molecules/Picture.vue'),
    Selectbox: () => import('~/components/molecules/Selectbox.vue'),
    SettingImage: () => import('~/components/molecules/SettingImage.vue'),
    InputTextarea: () => import('~/components/atoms/InputTextarea.vue'),
  },
})
export default class extends Vue {
  @Prop({ default: false })
  open!: boolean

  @Prop({ default: [] })
  categories!: Global.SelectboxItem[]

  @Prop({ default: { name: '', value: 0 } })
  activeCategory!: Global.SelectboxItem

  @Prop({ default: [] })
  mainList!: Global.SelectboxItem[]

  @Prop({ default: { name: '', value: 0 } })
  activeMainList!: Global.SelectboxItem

  @Prop({ required: true })
  mainImageCount!: number

  @Prop()
  uploadImage!: Function

  @Prop({ default: null })
  albumDetail!: ImageManage.Main | null

  private closeIcon: string = mdiClose
  private captionText: string = ''
  private errorMessage: string = ''

  private isImageError: boolean = false
  private isCategoryError: boolean = false
  private isMainListError: boolean = false

  private uploadFile: File | null = null
  private previewFile: Global.FileType = { src: '', name: '' }

  // ドロップや画像選択したときのイベント
  private settingFile(file: File | null) {
    if (file === null) {
      this.isImageError = true
    } else {
      this.isImageError = false
      this.uploadFile = file
      const reader = new FileReader()
      reader.onload = (e: ProgressEvent<FileReader>): void => {
        if (typeof e.target!.result! === 'string') {
          this.previewFile = {
            src: e.target!.result,
            name: file.name,
          }
        }
      }
      reader.readAsDataURL(file)
    }
  }

  // 登録するボタンを押したときの動き
  private async clickUpload(): Promise<void> {
    if (!this.validateImageForm(this.uploadFile, this.activeCategory.value)) {
      return
    }
    if (Number.isNaN(Number(this.activeMainList.value))) return

    this.$nuxt.$loading.start()
    const res = await this.uploadImage({
      isMain: !!this.activeMainList.value,
      sortNum:
        this.albumDetail?.isMain && this.activeMainList.value === 1
          ? this.albumDetail.sortNum
          : this.activeMainList.value
          ? Number(this.mainImageCount) + 1
          : 0,
      caption: this.captionText,
      categoryCd: this.activeCategory.value,
      file: this.uploadFile,
      id: this.albumDetail?.id || null,
    })
    if (res) {
      this.uploadFile = null
      this.previewFile = { src: '', name: '' }
      this.captionText = ''
    }
    this.$nuxt.$loading.finish()
  }

  get fillAlbumInfo(): ImageManage.Detail | null {
    if (this.albumDetail) {
      this.uploadFile = null
      this.previewFile = {
        src: this.albumDetail.href,
        name: this.albumDetail.caption,
      }
      this.captionText = this.albumDetail.caption
      return this.albumDetail
    } else {
      return null
    }
  }

  private clearImage(): void {
    this.uploadFile = null
    this.previewFile = { src: '', name: '' }
  }

  private validateImageForm(
    image: File | null,
    category: string | number
  ): boolean {
    this.errorMessage = ''
    this.isMainListError = false
    if (!image && !this.albumDetail) {
      this.errorMessage = this.$t('album.alert.notImageAlert') as string
      this.isImageError = true
    }
    if (category === 0) {
      this.errorMessage = this.$t('album.alert.notCategotySelect') as string
      this.isCategoryError = true
    }
    if (this.albumDetail?.isMain && this.activeMainList.value === 1) {
    } else if (this.mainImageCount >= 5 && this.activeMainList.value === 1) {
      this.errorMessage = this.$t('album.alert.errorMainImage') as string
      this.isMainListError = true
    }
    return !(this.isImageError || this.isCategoryError || this.isMainListError)
  }

  @Emit()
  private selectedCategory(v: number | string): Global.SelectboxItem {
    this.isCategoryError = false
    return (
      this.categories.find(
        (category: Global.SelectboxItem) => category.value === v
      ) || this.activeCategory
    )
  }

  @Emit()
  private selectedMainList(v: number | string): Global.SelectboxItem {
    this.isMainListError = false
    return (
      this.mainList.find(
        (mainItem: Global.SelectboxItem) => mainItem.value === v
      ) || this.activeMainList
    )
  }

  @Emit()
  private closeAlbumModal(): boolean {
    this.uploadFile = null
    this.previewFile = { src: '', name: '' }
    this.captionText = ''
    this.isImageError = false
    this.isCategoryError = false
    this.isMainListError = false
    this.errorMessage = ''
    this.resetSelectBoxCategory()
    return false
  }

  @Emit()
  private resetSelectBoxCategory(): void {}
}
</script>
<style lang="sass" scoped>
.fade-modal-enter-active, .fade-modal-leave-active
  transition: all 0.4s
.fade-modal-enter, .fade-modal-leave-to
  opacity: 0
</style>
