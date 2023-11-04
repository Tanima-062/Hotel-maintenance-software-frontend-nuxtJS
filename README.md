# hotel-hm-frontend

## 利用技術

※　ある程度確定したらきれいに書きます

- Vue.js / Nuxt.js / Vuex
- vuex-persistedstate
- nuxt-webfontloader
- material design icons
  - https://dev.materialdesignicons.com/getting-started/vuejs
- Typescript
- tailwind CSS
  - 1 から作るのしんどいときは、以下を参考に。
  - https://www.creative-tim.com/learning-lab/tailwind-starter-kit/presentation
  - https://www.tailwind-kit.com/started
- vue-sweetalert2
- yarn( 統一させたいので、npm は利用禁止でお願いします )
- eslint-plugin-vue を楽に使いたかったので pug なし
- nuxt-i18n
- axios(nuxt module 使用)
- TODO: jest(テストの欄参照。e2e の必要が出てきたら、puppeteer ではなく cypress を使う予定)
- TODO: CSS の命名規則未定。今のホテルの HM の惨状を考えるに、強制力のある命名＆わかりやすいもの
- atomic design (https://speakerdeck.com/yamish123/nuxt-dot-jspuroziekutofalsegai-shan-tekunituku)
  - atoms
    - /components/atoms
    - API アクセス NG
    - store アクセス　 NG
    - ビジネスロジック NG
  - molecules
    - /components/molecules
    - API アクセス NG
    - store アクセス　 NG
    - ビジネスロジック NG
  - organisms
    - /components/organisms
    - API アクセス OK
    - store アクセス　 NG (今回の構造上、Header と Footer を除く)
    - ビジネスロジック OK
  - templates
    - layouts かな？と思ったが、地味に役割がちがう模様
    - 他社事例をみても積極的に使っていないようなので、画面全体を整える共通処理としてのみ利用
  - pages
    - /pages
    - API アクセス OK
    - store アクセス　 OK
    - ビジネスロジック OK
  - ファットストアを避ける為、以下を参考にしています。organisms で store 禁止にしているのはそのためです。
    - https://speakerdeck.com/yamish123/nuxt-dot-jspuroziekutofalsegai-shan-tekunituku?slide=14

## ディレクトリ構成

```
src
├── assets                // コンパイルされないファイル。リセットCSSとか
├── components            // atomic designあたり参照
│   ├── atoms
│   ├── molecules
│   └── organisms
├── layouts
├── locales               // 言語ファイル。現在日本語のみ
├── middleware            // ミドルウェア。認証等ページ共通で読みたい処理など
├── pages                 // atomic designあたり参照
├── plugins               // 外部JSfile等、拡張したいものがああれば随時追加していく箇所
├── static                // 静的ファイル(imageはgcs予定？要相談)
├── store                 // vuex。module化しています
├── tailwind.config.js    // デザインの定義をここでしています
├── test                  // testコード。最低限、molecules以下のUI、storeのロジックは書いていく予定
├── types                 // 型定義
├── repositories          // APIなど。テストのmockのしやすさを考え、repositoryパターン採用
├── mixins                // alert等、packageで追加した共通コンポーネント
└── yarn.lock
```

## コーディングルール

- 型について

  - 原則、types で型を定義すること。any はだめです。ただ、そもそもタイプがちゃんと定義されていない（プラグイン等）だったり、Nuxt の Context だったり明らかなものは細かく型定義しなくて大丈夫です
  - repository で API のやりとりをするところでは、いったん any で大丈夫です。  
    本当は受け渡しする JSON の定義をしておきたいです。  
    ただ、開発中の少ない工数を考慮し、重要なのは repository から各コンポーネント等に渡す際の定義が明確かどうかである、という判断をしました。

- 命名規則 参考

  - https://qiita.com/Ted-HM/items/7dde25dcffae4cdc7923

- スタイルガイド

  - https://jp.vuejs.org/v2/style-guide/index.html

- デザインルール

  - Zeplin https://app.zeplin.io/project/5fc4a76f4dc55709881dcd3b/screen/5ff510cf7526486b7690750f
  - エンジニアが自己判断でデザインしないこと。基本はデザイナーに確認の上、修正してください。（その上で自由にやって OK なら大丈夫です）
  - と思ったが、デザインが仕様を反映していないことも多々あるので、事業側に確認してOKなら問題ない方向で！

- URL 命名規則
  - https://developers.google.com/search/docs/advanced/guidelines/url-structure?hl=ja&topic=2370420&ctx=topic&visit_id=637477649520126999-2471745570&rd=1

## デプロイ

現状、developにマージされれば自動で開発環境へ反映されます。
ローカルで開発環境と同じ環境・状態で見たい場合は、上の階層にあるDockerfileを立ち上げてください

## HM2 次開発の流れ

1. `feature/HM_Secondary`ブランチから新しくブランチを切り、そこでローカル開発
2. 終わったら、`feature/HM_Secondary`宛に PR を出す
3. LGTM をもらったら、マージ
