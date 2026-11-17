# 伝言: 「福祉」マップ

日付: 2026-11-17  
状態: **メンバー確認用（`PLACES_IS_PUBLIC = false`）**

## 正式公開（ワンフラグ）

`src/data/places-visibility.ts` の `PLACES_IS_PUBLIC` を `true` にするだけ。

連動するもの:

- TOP 活動内容カード
- ヘッダー / フッター / ハンバーガーのナビ
- `/places` の noindex 解除
- robots.txt の Disallow 解除
- sitemap 掲載

## いまの公開範囲（false 時）

- `/places` … 直リンクで閲覧可（`noindex` + robots Disallow）
- TOP・ナビ … リンクなし

## 地図

- Leaflet + OpenFreeMap Positron（キー不要・無料）
- ロジック: `src/lib/places/map-client.ts` / `filter-client.ts`
- 日本付近にパン制限

## 別件メモ（未着手）

オリジナル日本地図で都道府県・有名市町村レベルの大雑把な分布表示は可能。
既存の `japan-map.png` ＋都道府県重心のドット／SVG クリック領域で十分。ピン精密配置は不要。
