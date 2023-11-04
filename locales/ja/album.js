export default {
  pageBreadcrumb: 'アルバム',
  mainImageSection: {
    mainImageSetting: 'メイン画像設定',
    firstDescription:
      '＊メイン１の画像がメイン画像の中でも代表になります。(ホテルリストに表示される画像、ページ内の一番大きく見える代表画像)',
    secondDescription:
      '＊「Xボタン」を押すとメイン設定から除外されます。（登録した画像自体が削除されることではありません）',
    thirdDescription:
      '＊メイン画像の設定は、以下のカテゴリーリストから該当画像にリスト番号を選択して設定できます。',
    Main: 'メイン',
    Represent: '(代表)',
    DropZoneFirstLine: '下のリストから',
    DropZoneSecondLine: '写真を指定してください',
  },
  addImageButton: '新しい画像を追加',
  albumModal: {
    modalTitle: '画像登録',
    dropZone: {
      firstDescription: '画像を登録してください（必須）',
      secondDescription:
        'スカイチケットが推奨する画像サイズは600px×400pxです。',
      addImageButton: '画像を選択する',
      fileName: 'ファイル名 :',
    },
    category: 'カテゴリ(必須)',
    mainSetting: 'メイン指定',
    caption: 'キャプション',
    modalButton: '登録する',
  },
  placeholder: {
    SelectCategory: 'カテゴリを選択してください',
    mainImage: 'メイン画像にする',
    notMainImage: 'メイン画像にしない',
    caption: '全角100文字以内に入力してください',
  },
  alert: {
    notImageAlert:
      '* 入力内容が間違っています。赤い領域の部分を確認してください。',
    notCategotySelect:
      '* 入力内容が間違っています。赤い領域の部分を確認してください。',
    errorMainImage: '* メイン画像は5つ以上は設定できません。',
  },
  mixinAlert: {
    editSuccess: '編集完了',
    editContent: '写真情報を更新しました。',
    title: '問題が発生しました。',
    notUpload:
      'この形式のファイルはアップロードできません <br/> JPG, PNG, JPEGのファイルでアップロードしてください。',
  },
  notImageList: {
    firstText: 'このカテゴリには登録されている写真がありません。',
    secondText: '右上の「新しい画像を追加」ボタンから写真を登録してください。',
  },
}
