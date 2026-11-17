# 伝言: 「福祉」マップ

日付: 2026-11-16  
状態: **メンバー確認用に `/places` のみ公開（TOP・ナビ非掲載）**

## いまの公開範囲

- `/places` … 直リンクで閲覧可（`noindex` + robots Disallow）
- TOP 活動内容・ヘッダー／フッターナビ … **リンクなし**
- メンバーには URL を共有して確認してもらう

## 地図

- Leaflet ハイブリッド（キー不要・無料）
  - 広域: 国土地理院 淡色（ピンが際立つ）
  - 拡大（ズーム12〜）: OSMFJ Bright-JA（駅・店など周辺がわかる）
- 右下にクレジット表示
- 日本付近にパン制限
- ※ Google マップ本体はカード登録＋従量課金のため未使用

## TOP 導線を出すとき

1. `src/data/home.ts` に活動内容カードを戻す
2. `Header` / `NAV_GROUPS` に `places` を追加
3. `places.astro` の `noindex` 解除、robots / sitemap から除外を外す
