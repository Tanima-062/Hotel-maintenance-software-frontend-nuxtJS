export default {
  pageBreadcrumb: '予約管理',
  pageName: '予約一覧',
  fileName: '予約リスト',
  searchBox: {
    headline: '検索パネル',
    clearButton: 'クリア',
    searchButton: '検索',
    bookingNumber: '申込番号',
    checkInDate: 'チェックイン日',
    checkOutDate: 'チェックアウト日',
    applicationDate: '申込日',
    tel: '電話番号',
    lastName: '予約者姓',
    firstName: '予約者名',
  },
  searchList: {
    tableName: {
      title: '予約リスト',
      downloadInfo:
        '* 現在表示されるリストをExcelファイルでダウンロードします。（一部詳細内容も含まれます）',
      btnDownload: 'データ出力',
      applicationId: '申込番号',
      applicationIds: '申込番号',
      status: 'ステータス',
      hotelName: 'ホテル名',
      roomType: '部屋タイプ',
      totalPrice: '金額(税込)',
      route: '予約経路',
      checkIn: 'チェックイン',
      checkOut: 'チェックアウト',
      lastName: '姓',
      firstName: '名',
      tel: 'Tel',
      showDetail: '詳細確認',
    },
    placeholder: {
      applicationIds: '複数検索：番号間に半角スペースをご使用ください。',
      name: 'ローマ字入力のみ',
      tel: '数字入力のみ',
    },
    routeType: {
      hotel: 'ホテル単体',
      tour: '国内ツアー',
      dp: '航空券＋ホテル',
    },
    detailText: '詳細',
    noBookingList: '予約情報がまだありません。',
    errorMessage: {
      applicationIdsMaxLength: '最大入力数は20個までとなります。',
      applicationIdsNumber: '半角数字・半角スペースのみ入力可能です。',
      nameAlphabet: 'ローマ字のみ',
    },
  },
  searchModal: {
    detailTitle: '予約詳細',
    basicTitle: '基本情報',
    priceTitle: '金額詳細',
    roomTitle: '客室詳細',
    cancelButton: 'キャンセル',
    saveButton: '登録する',
    applicationId: '申込番号',
    status: 'ステータス',
    route: '予約経路',
    bookDate: '予約日時',
    stayDate: '宿泊日程',
    stayCount: '泊数',
    roomCount: '部屋数',
    tel: '電話番号',
    totalPrice: '金額',
    customerName: '予約者',
    campaign: 'キャンペーン',
    roomName: '部屋名',
    fullName: '宿泊代表者名',
    guestNumber: '宿泊人数',
    adult: '大人',
    child: '子供',
    child1: '小学校高学年',
    child2: '小学校低学年',
    child3: '幼児（食事・布団あり）',
    child4: '幼児（食事あり・布団なし）',
    child5: '幼児（食事なし・布団あり）',
    child6: '幼児（食事・布団なし）',
    planName: 'プラン名',
    cancelCharge: 'キャンセル料',
    cancelBtn: '予約キャンセル',
    noShowBtn: 'ノーショーにする',
    bookingAmount: '予約金額',
    settlementAmount: '決済金額',
    discountAmount: '割引金額',
    cancelBtnText: '予約キャンセルする',
    noShowBtnText: 'ノーショーにする',
    noShowDesBtnText: 'ノーショーを解除する',
    currencyUnit: '円',
    stayUnit: '泊',
    roomUnit: '部屋',
    couponUnit: '枚',
    personUnit: '名',
    ageUnit: '歳',
    roomIndex: '部屋目',
    tourNotice:
      '※「国内ツアー」はパッケージ商品となりますため、決済金額・割引金額は非表示となります。',
    tourCancel:
      'ツアー商品はこの画面からキャンセルすることはできません。お申込者ご本人からコールセンター（国内ツアー：03-5224-8860）へキャンセルのご連絡をいただけますよう、ご案内をお願いいたします。',
  },
  alertBox: {
    confirmTitle: '確認が必要です',
    confirmBtnText: 'はい',
    cancelBtnText: 'いいえ',
    cancelContent: 'キャンセルしますか？',
    noShowContent: 'ノーショーにしますか？',
    noShowDesactivate: 'ノーショーを解除しますか？',
    defaultCancelPolicy:
      'をデフォルトのキャンセルポリシーに設定しますがいいですか？',
  },
  statusList: {
    title: 'ステータス',
    all: '全て',
    bookingDone: '予約完了',
    duringStay: '宿泊中',
    itineraryEnd: '旅程終了',
    cancel: 'キャンセル',
    noShow: 'ノーショー',
  },
  report: {
    applicationId: '予約番号',
    status: 'ステータス',
    cancelCharge: 'キャンセル料',
    route: '予約経路',
    bookDate: '予約日付',
    checkIn: 'チェックイン',
    checkOut: 'チェックアウト',
    stays: '宿泊日数',
    roomCount: '部屋数',
    adultCount: '宿泊人数（大人）',
    childCount: '宿泊人数（子供）',
    roomsName: '部屋名',
    plansName: 'プラン名',
    familyNameEnc: '予約者姓',
    givenNameEnc: '予約者名',
    bookingAmount: '予約金額',
    settlementAmount: '決済金額',
    discountAmount: '割引金額',
  },
}
