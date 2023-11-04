// https://typescript.nuxtjs.org/ja/cookbook/store/
import { Plugin } from '@nuxt/types'
import { initializeAxios } from '~/utils/api'

const accessor: Plugin = ({ $axios }) => {
  initializeAxios($axios)
}

export default accessor
