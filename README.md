# さぽちむ HP

任意団体「さぽちむ（Supporting/ed TEAM）」公式サイトです。
[Astro](https://astro.build) + [Tailwind CSS](https://tailwindcss.com) + [microCMS](https://microcms.io) で構築しています。

## プロジェクト構成

```text
/
├── public/
├── src
│   ├── assets/              # 画像（用途別ディレクトリ・英語 kebab-case）
│   │   ├── brand/           # ロゴ・バナー
│   │   ├── bubbles/         # シャボン玉素材
│   │   ├── decorations/     # リボン・家・カード枠など
│   │   ├── icons/           # SNS アイコン
│   │   ├── members/         # メンバー写真（ローカル用）
│   │   ├── places/          # 居場所マップ用（日本地図など）
│   │   ├── rolls/           # メンバーロールのハイライト背景
│   │   ├── sections/        # ヒーロー・活動内容など
│   │   └── unused/          # 未使用素材の保管
│   ├── components/          # UI コンポーネント
│   ├── data/                # 変更しやすいコンテンツ・設定の定義元
│   ├── layouts/
│   ├── lib/                 # microCMS / note / 日付 / embed ロジック
│   ├── pages/
│   └── styles/
└── package.json
```

## コンテンツの編集（どこを触るか）

| 変更したいもの | 編集ファイル |
|----------------|--------------|
| サイト名・説明文・OGサムネ設定 | `src/data/site.ts` / `public/og-banner.png` / `src/layouts/Layout.astro` |
| メール・note・寄付URL・フォームURL・サイトURL・microCMS domain | `.env`（必須） |
| ナビゲーション（ヘッダー / フッター / ハンバーガー） | `src/data/navigation.ts` |
| SNS プロフィール URL・埋め込み投稿 URL | `src/data/sns.ts` |
| トップ（ヒーロー・活動内容・代表の思い・募集CTA） | `src/data/home.ts` |
| 団体概要の本文 | `src/data/overview.ts` |
| 応援するページの文言 | `src/data/support.ts` |
| メンバー募集の各チーム表 | `src/data/recruit.ts` |
| メンバー募集ページの説明文・ロール背景 | `src/data/member.ts` |
| 居場所マップの文言・地方区分 | `src/data/places.ts`（直リンク限定・ナビ非掲載） |
| お問い合わせ項目の選択肢 | `src/data/contact.ts` |
| シャボン玉装飾の位置 | `src/data/bubbles.ts` |

メンバー一覧・お知らせ・外部レポートは **microCMS** 管理画面で編集します（ビルド時取得）。

## セットアップ

```sh
cp .env.example .env
# .env を開き、一覧の変数をすべて設定（未設定だとビルド失敗）
```

> `.env` は Git に含めません。CI / Cloudflare Pages では同じキーを**すべて**登録してください。
>
> Cloudflare Pages では **Variable name** に `PUBLIC_DONATE_URL`、**Value** に URL だけ（`https://...`）を入れます。  
> `.env` の1行まるごと（`PUBLIC_DONATE_URL=https://...`）を Value に貼ると、リンクが壊れて相対パス扱いになります。

### `.env` に置くもの（すべて必須）

| 変数 | 用途 |
|------|------|
| `MICROCMS_API_KEY` | microCMS API キー（**秘密**） |
| `MICROCMS_SERVICE_DOMAIN` | microCMS サービスドメイン |
| `PUBLIC_CONTACT_FORM_URL` | GAS お問い合わせ送信先 |
| `PUBLIC_DONATE_URL` | Syncable 寄付 URL |
| `PUBLIC_CONTACT_EMAIL` | フッター等のメール |
| `PUBLIC_NOTE_ACCOUNT` | note アカウント名 |
| `PUBLIC_SITE_URL` | サイト正規 URL（OG・canonical・sitemap） |

`PUBLIC_*` はクライアントにも露出します。秘密鍵は置かないでください。

カスタムドメインに切り替えたら、Cloudflare Pages の `PUBLIC_SITE_URL` も合わせて更新してください。

## コマンド

| コマンド | 内容 |
| :------- | :--- |
| `npm install` | 依存パッケージのインストール |
| `npm run dev` | 開発サーバー（`localhost:4321`） |
| `npm run build` | 本番ビルド → `./dist/` |
| `npm run preview` | ビルド結果のプレビュー |

## 参考

- [Astro ドキュメント](https://docs.astro.build)
- [Tailwind CSS ドキュメント](https://tailwindcss.com/docs)
- [microCMS ドキュメント](https://document.microcms.io)
