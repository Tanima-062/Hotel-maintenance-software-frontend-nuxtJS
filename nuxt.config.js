require('dotenv').config()
// import path from 'path'
export default {
  telemetry: false,
  // Disable server-side rendering (https://go.nuxtjs.dev/ssr-mode)
  ssr: false,

  // Target (https://go.nuxtjs.dev/config-target)
  target: 'server',

  // https://ja.nuxtjs.org/docs/2.x/configuration-glossary/configuration-env/
  env: {
    apiUrlPrefix: process.env.API_URL_PREFIX,
    webUrlPrefix: process.env.WEB_SERVER_URL_PREFIX,
  },

  // https://ja.nuxtjs.org/docs/2.x/configuration-glossary/configuration-runtime-config/
  // 環境構築時点、便利そうで意外に使う用途がなかったため、ブランク
  publicRuntimeConfig: {
    baseURL:
      process.env.APP_ENV === 'development'
        ? `https://jp-fe01.skyticket.jp/hotel/detail/property_`
        : `https://skyticket.jp/hotel/detail/property_`,
  },
  privateRuntimeConfig: {},

  // Global page headers (https://go.nuxtjs.dev/config-head)
  head: {
    title: 'Skyticket',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: 'skyticket 施設様向け管理画面です。',
      },
      { name: 'robots', content: 'noindex,follow' },
    ],
    link: [
      {
        rel: 'icon',
        type: 'image/x-icon',
        href:
          process.env.APP_ENV === 'development'
            ? '/favicon.develop.ico'
            : process.env.APP_ENV === 'staging'
            ? '/favicon.staging.ico'
            : '/favicon.ico',
      },
      {
        rel: 'stylesheet',
        href:
          'https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@100;300;500&display=swap" rel="stylesheet',
      },
    ],
  },

  // Global CSS (https://go.nuxtjs.dev/config-css)
  css: [
    '~/assets/css/modern_css_reset',
    '~/assets/css/global',
    '~/assets/sass/overwrite-vue-sweetalert2.sass',
    '~/assets/sass/overwrite-vue-date-picker',
  ],

  // Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
  plugins: [
    '~/plugins/axios-accessor.ts',
    '~/plugins/sessionStorage.ts',
    '~/plugins/vee-validate.js',
    '~/plugins/i18n.ts',
    '~/plugins/datePicker.js',
  ],

  // Auto import components (https://go.nuxtjs.dev/config-components)
  components: false,

  // Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
  buildModules: [
    // https://go.nuxtjs.dev/typescript
    '@nuxt/typescript-build',
    // https://go.nuxtjs.dev/stylelint
    '@nuxtjs/stylelint-module',
    // https://go.nuxtjs.dev/tailwindcss
    '@nuxtjs/tailwindcss',
  ],

  // Modules (https://go.nuxtjs.dev/config-modules)
  modules: [
    '@nuxtjs/dotenv',
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    // https://i18n.nuxtjs.org
    [
      'nuxt-i18n',
      {
        // 使用する言語の設定
        locales: [
          { code: 'ja', name: 'Japanese', iso: 'ja_JP', file: 'ja/index.js' },
        ],
        defaultLocale: 'ja',
        langDir: 'locales/',
        strategy: 'prefix_except_default',
        vueI18n: {
          fallbackLocale: 'ja',
        },
        lazy: true,
        vueI18nLoader: true,
        vuex: false,
      },
    ],
    'nuxt-webfontloader',
    // https://github.com/avil13/vue-sweetalert2
    'vue-sweetalert2/nuxt',
  ],

  // https://github.com/Developmint/nuxt-webfontloader
  webfontloader: {
    google: {
      families: ['Noto+Sans+JP:100;300;500'],
    },
  },

  // Axios module configuration (https://go.nuxtjs.dev/config-axios)
  axios: {},

  // Build Configuration (https://go.nuxtjs.dev/config-build)
  build: {
    parallel: true,
    cache: true,
    hardSource: true,
    transpile: ['vee-validate/dist/rules'],
  },
  resolve: {
    extensions: ['.js', '.json', '.vue', '.ts'],
    alias: {
      '~': 'src',
    },
  },
  loading: '~/components/molecules/LoadingOverlay.vue',
  router: {
    middleware: 'maintenance',
  },
}
