export default {
  pageName: 'お知らせ',
  pageDescription: 'スカイチケットからのお知らせです。ご確認ください。',
  newText: 'New',
  contactInfo: {
    title: 'スカイチケット連絡先',
    contactList: [
      {
        contactType: 'オペレーション窓口',
        contactDescription: 'お客様の予約内容・当日のお問い合わせ',
        contactInformation: [
          {
            contactTel: '03-6277-0524',
            contactEmail: 'hotel-staff@skyticket.com',
            contactOpenTime: '受付時間 : 10:00～18:00',
          },
        ],
      },
      {
        contactType: 'クライアントサポート窓口',
        contactDescription: '管理画面の操作・精算・販売戦略・契約について',
        contactInformation: [
          {
            contactTel: '03-6277-2902',
            contactEmail: 'client-support@adventure-inc.co.jp',
            contactOpenTime: '受付時間 : 10:00～19:00/ 土日祝休',
          },
        ],
      },
      {
        contactType: 'スカイチケット カスタマーセンター',
        contactDescription:
          'お客様よりスカイチケットについてのお問い合わせを受けた場合、以下の連絡先をご案内ください。',
        contactInformation: [
          {
            contactSubDescription:
              '※「ホテル単体」「航空券＋ホテル」の予約について',
            contactTel: '03-5224-8854',
            contactEmail: 'hotel@skyticket.com',
            contactOpenTime: '受付時間 : 10:00～18:00',
          },
          {
            contactSubDescription: '※「国内ツアー」の予約について',
            contactTel: '03-5224-8860',
            contactEmail: 'tour@skyticket.com',
            contactOpenTime: '受付時間 : 10:00～18:00',
          },
        ],
      },
    ],
  },
  manualInfo: {
    title: 'マニュアルダウンロード',
    description: '* ご利用中のホールセラーのマニュアルをお使いください。',
    downloadText: 'ダウンロード',
  },
}
