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
│   ├── pages/                # ルーティング（index / overview / member / contact / support）
│   └── styles/               # グローバルCSS（Tailwindのテーマ・共通ユーティリティ）
└── package.json
```

## ✏️ コンテンツの編集

### 団体概要ページ（`/overview`）

テキストは `src/data/overview.ts` の `OVERVIEW_SECTIONS` にまとまっています。見出しや本文を変えるときはこのファイルだけ編集すれば OK です。

```ts
{
  id: "existence",       // アンカーリンク用（例: /overview#existence）
  title: "存在意義",
  paragraphs: [
    "1段落目のテキスト",
    "2段落目。\n同じ段落内で改行したいときは \\n を使う",
  ],
}
```

- `paragraphs` の各要素が `<p>` タグ1つに対応します
- 段落内の改行は `\n` で指定します
- レイアウト（白カード・見出しの下線など）は `src/components/OverviewCard.astro` が担当します

### 応援するページ（`/support`）

テキスト・寄付先URLは `src/data/support.ts` にまとまっています。

- **本文・金額例・参加者の声** … 同ファイル内の各定数を編集
- **寄付ボタンの遷移先** … `DONATE_URL`（[Syncable 支援フォーム](https://syncable.biz/associate/sapochimu1/donate)）
- ページ内の「寄付で応援する」は `#donate`（寄付の方法セクション）へのアンカーです
- 風船ボタンは常に `/support`（ページトップ）へ遷移します

### メンバー募集ページ（`/member`）

- **各チームの募集内容（①イベント・②SNS・③その他）** … `src/data/recruit.ts` の `RECRUIT_TEAMS` を編集します。`value` 内の改行・箇条書きは `\n` で指定します。テーブルの見た目は `src/components/RecruitTable.astro` が担当します。
- **メンバー一覧** … microCMS の `member` エンドポイント（`name` / `roll` / `icon`）を**ビルド時に取得**して表示します。メンバーの追加・変更は microCMS 管理画面で行います（コード変更不要）。
- **ロールのマーカー背景** … `roll` は「役割名（`roll`）＋マーカー背景画像（`image`）」の繰り返しフィールドです。背景画像は microCMS 側で保持しているため、`src/components/MemberCard.astro` はその `image.url` をそのまま表示します（ローカル画像は使いません）。
- **チーム構成図** … `src/assets/さぽちむ簡易図.png` を使用しています。

### ナビゲーション

ヘッダー・フッター・ハンバーガーメニューのリンクは `src/data/navigation.ts` の `NAV_LINKS` が唯一の定義元です。メンバー募集ページへは、トップの「新規メンバー募集」内「詳しく見る」ボタンとハンバーガーメニューの「新規メンバー募集中！」から遷移します。

### SNSリンク

場所ごとのURLは **`src/data/sns.ts` の `SNS_URLS`** だけ編集すればOKです。

| キー | 表示場所 |
|------|----------|
| `hamburger` | ハンバーガーメニュー下部 |
| `footer` | フッターの家型アイコン |
| `representative` | TOP「代表の思い」 |

活動実績に埋め込むおすすめ投稿URLは `src/data/socialLinks.ts` です。

### トップページ

各セクションのテキストは `src/components/` 配下のコンポーネント（`ActivitySection.astro` など）に直接書かれています。

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
