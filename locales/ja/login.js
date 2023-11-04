import { serverError } from './validate'

export default {
  headline: 'ログインが必要です。',
  ID: {
    label: 'ログインID',
    placeholder: 'ログインIDを入力してください',
  },
  PW: {
    label: 'パスワード',
    placeholder: 'パスワードを入力してください',
  },
  button: 'ログイン',
  saveLonginInfoCheckbox: 'ログインIDを記憶する',
  pwChangeLabel: 'パスワードを忘れた方は、次のメールアドレスまで',
  pwChangeLabelNext: 'ご連絡ください。',
  pwChangeLink: 'パスワード変更',
  loginError: serverError.loginError,
}
