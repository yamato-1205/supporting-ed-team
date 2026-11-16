# 伝言: 「福祉」マップ

日付: 2026-11-16  
状態: **メンバー確認用に `/places` のみ公開（TOP・ナビ非掲載）**

## いまの公開範囲

- `/places` … 直リンクで閲覧可（`noindex` + robots Disallow）
- TOP 活動内容・ヘッダー／フッターナビ … **リンクなし**
- メンバーには URL を共有して確認してもらう

## 地図

- Leaflet（BSD）+ CARTO Positron タイル（下地は OpenStreetMap データ）
- 地図右下に OpenStreetMap / CARTO のクレジット必須（表示済み）
- 日本付近にパン制限。領海線はタイル側の描画で完全削除は不可だが、Positron では目立たない

## TOP 導線を出すとき

1. `src/data/home.ts` に活動内容カードを戻す
2. `Header` / `NAV_GROUPS` に `places` を追加
3. `places.astro` の `noindex` 解除、robots / sitemap から除外を外す
