import { serverError } from './validate'

export default {
  headline: '新しいパスワードを設定してください',
  ID: {
    label: 'ログインID',
    placeholder: 'ログインIDを入力してください',
  },
  oldPW: {
    label: '現在のパスワード',
    placeholder: '現在パスワードを入力してください',
  },
  newPW: {
    label: '新しいパスワード',
    placeholder: '新しいパスワードを入力してください',
  },
  cancelBtn: 'キャンセル',
  submitBtn: '変更',
  changePasswordSuccess: 'パスワードを更新しました。',
  changePasswordError: serverError.changePasswordError,
}
