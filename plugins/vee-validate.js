import Vue from 'vue'
import {
  ValidationProvider,
  ValidationObserver,
  localize,
  extend,
} from 'vee-validate' // 使用する機能
import * as defaultRules from 'vee-validate/dist/rules' // 使用するバリデーションルール
import ja from '~/locales/ja/validate.js' // エラーメッセージの日本語化用
// import ja from 'vee-validate/dist/locale/ja.json';

for (const rule in defaultRules) {
  extend(rule, { ...defaultRules[rule] }) // eslint-disable-line
}

extend('account-holder', {
  message: '口座名義人は半角カナ・英数字のみ使用できます。',
  validate: (value) => {
    // 半角英数, 半角カナ, カッコ, ハイフン, 半角スペースのみ許可する
    const regex = /^[a-zA-Z0-9\uFF61-\uFF9F()\-./]+$/
    let existsForbiddenChars = false
    const littleChars = ['ｧ', 'ｨ', 'ｩ', 'ｪ', 'ｫ', 'ｬ', 'ｭ', 'ｮ', '･']

    littleChars.forEach(
      (c) => (existsForbiddenChars = existsForbiddenChars || value.includes(c))
    )

    return regex.test(value) && !existsForbiddenChars
  },
})

Vue.component('ValidationProvider', ValidationProvider)
Vue.component('ValidationObserver', ValidationObserver)
localize('ja', ja)
