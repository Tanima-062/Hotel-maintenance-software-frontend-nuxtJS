import { TranslateResult } from 'vue-i18n'

export module Global {
  export type BreadCrumb = {
    name: string
    href: string
  }
  export type SelectboxItem = {
    name: string
    value: number | string
  }
  export type CheckboxItem = {
    name: string
    value: boolean
    id?: number | number[]
    option?: number | number[]
  }
  export type RadioItem = {
    text: string
    value: number | string | boolean
  }

  export type FileType = {
    src: string
    name: string
  }

  export type ManualItem = {
    [manualName: string]: {
      title: string
      imageList: string[]
      separateOption: string
    }
  }

  export type TabCategory = {
    value: string
    name: string
    disable?: boolean
  }

  export type PAGE_STRUCTURE_TOP = {
    key: string
    name: TranslateResult
    items: PAGE_STRUCTURE_CHILD[]
  }

  export type PAGE_STRUCTURE_CHILD = {
    href: string
    name: TranslateResult
    isShowOnMenu: boolean
    items?: PAGE_STRUCTURE_CHILD[]
  }

  export type BtnGroup = {
    name: string
    value: number | boolean
  }

  export type ToggleBtn = {
    name: string
    value: boolean
  }
}
