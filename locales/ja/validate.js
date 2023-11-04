export default {
  messages: {
    alpha: (field) => `${field}はアルファベットのみ使用できます。`,
    alpha_num: (field) => `${field}は半角英数字のみ使用できます。`,
    alpha_dash: '{field}は英数字とハイフン、アンダースコアのみ使用できます',
    alpha_spaces: '{field}はアルファベットと空白のみ使用できます',
    between: '{field}は{min}から{max}の間でなければなりません',
    confirmed: '{field}が一致しません',
    digits: '{field}は{length}桁の数字でなければなりません',
    dimensions: '{field}は幅{width}px、高さ{height}px以内でなければなりません',
    email: (field) => `${field}は有効なメールアドレスではありません。`,
    excluded: '{field}は不正な値です',
    ext: '{field}は有効なファイル形式ではありません',
    image: '{field}は有効な画像形式ではありません',
    integer: (field) => `${field}は整数のみ使用できます。`,
    is: '{field}が一致しません',
    length: (field, value) => `${field}は${value.length}桁でご入力ください`,
    max_value: (field, value) =>
      `${field}は${value.max}以下でなければなりません。`,
    max: '{field}は{length}文字以内にしてください',
    mimes: '{field}は有効なファイル形式ではありません',
    min_value: (field, value) =>
      `${field}は${value.min}以上でなければなりません。`,
    min: '{field}は{length}文字以上でなければなりません',
    numeric: (field) => `${field}は半角数字のみ使用できます。`,
    one_of: '{field}は有効な値ではありません',
    regex: (field) => `${field}のフォーマットが正しくありません`,
    required: (field) => `${field}が入力されていません。`,
    required_if: (field) => `${field}は必須項目です。`,
    size: '{field}は{size}KB以内でなければなりません',
  },
}

export const serverError = {
  loginError: 'ユーザーIDもしくはパスワードが異なります。',
  changePasswordError: 'パスワードの変更に失敗しました。',
}
