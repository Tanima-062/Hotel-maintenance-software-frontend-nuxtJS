import { $axios } from '~/utils/api'
// import { $axios } from '~/utils/api'
import { ImageManage } from '~/types'

export default class ImageRepository {
  async fetchImages({
    propertyId,
  }: {
    propertyId: number
  }): Promise<ImageManage.Main[]> {
    const res = await $axios.get(
      `${process.env.apiUrlPrefix}/image/${propertyId}`
    )
    if (!res.data || res.data.length === 0) {
      return []
    }
    return res.data.map((data: any) => ({
      id: data.image_id,
      href: data.href,
      isMain: data.is_main,
      sortNum: data.sort_num,
      caption: data.caption,
      category: data.category_cd,
    }))
  }

  async fetchImageCount(
    propertyId: number,
    wholesalerId: number
  ): Promise<number> {
    const res = await $axios.get(
      `${process.env.apiUrlPrefix}/image/main/${propertyId}?wholesaler_id=${wholesalerId}`
    )
    return res.data.count
  }

  async updateIsMain({
    imageId,
    isMain,
    sortNum,
  }: ImageManage.InputIsMain): Promise<number> {
    try {
      const res = await $axios.put(`${process.env.apiUrlPrefix}/image/main`, {
        image_id: imageId,
        is_main: isMain,
        sort_num: sortNum,
      })
      return res.status
    } catch (e) {
      // システムエラー画面へ遷移させない
      return 400
    }
  }

  async updateSortNum(images: ImageManage.InputSortNum[]): Promise<number> {
    try {
      const res = await $axios.put(
        `${process.env.apiUrlPrefix}/image/sort`,
        images.map((image) => ({
          image_id: image.imageId,
          sort_num: image.sortNum,
        }))
      )
      return res.status
    } catch (e) {
      // システムエラー画面へ遷移させない
      return 400
    }
  }

  async deleteImage({ imageId }: { imageId: number }): Promise<number> {
    try {
      const res = await $axios.delete(`${process.env.apiUrlPrefix}/image`, {
        method: 'delete',
        data: { image_id: imageId },
      })
      return res.status
    } catch (e) {
      // システムエラー画面へ遷移させない
      return 400
    }
  }

  async uploadFile(uploadFile: ImageManage.InputFile): Promise<number> {
    try {
      if (uploadFile.id) {
        const res = await $axios.put(`${process.env.apiUrlPrefix}/image`, {
          image_id: uploadFile.id,
          category_cd: uploadFile.categoryCd,
          is_main: uploadFile.isMain,
          caption: uploadFile.caption,
          sort_num: uploadFile.sortNum,
        })
        return res.status
      } else {
        const data = new FormData()
        data.append('isMain', JSON.stringify(uploadFile.isMain))
        data.append('sortNum', JSON.stringify(uploadFile.sortNum))
        data.append('caption', uploadFile.caption)
        data.append('categoryCd', JSON.stringify(uploadFile.categoryCd))
        data.append('contentType', JSON.stringify(uploadFile.file.type))
        data.append('imagefile', uploadFile.file)
        const headers = { 'content-type': 'multipart/form-data' }
        const res = await $axios.post(
          `${process.env.apiUrlPrefix}/image`,
          data,
          {
            headers,
          }
        )
        return res.status
      }
    } catch (e) {
      return 400
    }
  }
}
