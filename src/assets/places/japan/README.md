# 日本地図アセット（/places2）

今の地図は `prefectures.svg`（都道府県の形）。出典は Geolonia の map-full。画面のクレジットは「地図データ: Geolonia」。

地方の土地のどこを押しても、その地方の viewBox に寄る。寄ったあと都道府県を押すと、下の一覧が絞られる。都道府県のさらなる拡大はしない。

差し替えるときは、各都道府県が `<g class="prefecture">` で、中に `<title>大阪 / Osaka</title>` がある形を保つ。色と件数ラベルは CSS / HTML。

`land.jpg` `land-main.jpg` `land-okinawa.jpg` `pin.svg` は以前の手描き版。今の画面では使っていない。
