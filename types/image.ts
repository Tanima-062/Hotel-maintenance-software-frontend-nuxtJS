export module ImageManage {
  export type Detail = {
    id: number
    href: string
    isMain: boolean
    sortNum: number
    caption: string
  }
  export type Main = Detail & {
    category: string
  }

  export type InputIsMain = {
    imageId: number
    isMain: boolean
    sortNum: number
  }

  export type InputSortNum = {
    imageId: number
    sortNum: number
  }

  export type InputFile = {
    isMain: boolean
    sortNum: number
    caption: string
    file: File
    categoryCd: string
    href?: string
    id?: number | null
  }

  export type ImageCount = {
    count: number
  }
}
