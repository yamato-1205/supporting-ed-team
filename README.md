# さぽちむ HP

任意団体「さぽちむ（Supporting/ed TEAM）」公式サイトです。
[Astro](https://astro.build) + [Tailwind CSS](https://tailwindcss.com) + [microCMS](https://microcms.io) で構築しています。

## 🚀 プロジェクト構成

```text
/
├── public/                # そのまま配信される静的ファイル
├── src
│   ├── assets/             # 画像（Astroのビルドパイプラインで最適化される）
│   ├── components/         # ページを構成するUIコンポーネント
│   ├── data/                # ナビゲーション・SNSリンク・装飾など、複数コンポーネントで共有するデータ
│   ├── layouts/             # 全ページ共通のレイアウト（Header/Footer/背景を含む）
│   ├── library/             # microCMS・note RSS 連携や日付フォーマットなどのロジック
│   ├── pages/                # ルーティングされるページ（index.astro がトップページ）
│   └── styles/               # グローバルCSS（Tailwindのテーマ・共通ユーティリティ）
└── package.json
```

## 🔧 セットアップ

microCMS のお知らせ機能を使う場合は `.env.example` を `.env` にコピーし、APIキーを設定してください。

```sh
cp .env.example .env
# .env を開き、MICROCMS_API_KEY に microCMS 管理画面の API キーを設定
```

> **注意:** `.env` は Git に含めません（`.gitignore` で除外済み）。  
> GitHub Actions など CI でビルドする場合は、リポジトリの **Secrets** に `MICROCMS_API_KEY` を登録してください。

## 🧞 コマンド

すべてプロジェクトルートで実行します：

| コマンド                  | 内容                                             |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | 依存パッケージのインストール                      |
| `npm run dev`             | 開発サーバーを起動（`localhost:4321`）             |
| `npm run build`           | 本番用に `./dist/` へビルド                        |
| `npm run preview`         | ビルド結果をローカルでプレビュー                   |
| `npm run astro ...`       | Astro CLI コマンドの実行                           |

## 👀 参考

- [Astro ドキュメント](https://docs.astro.build)
- [Tailwind CSS ドキュメント](https://tailwindcss.com/docs)
- [microCMS ドキュメント](https://document.microcms.io)
