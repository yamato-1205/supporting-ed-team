/**
 * さぽちむ 居場所マップ：Sheets ⟷ microCMS `location` 同期
 *
 * ===== セットアップ =====
 * 1. スプレッドシート → 拡張機能 → Apps Script
 * 2. このファイルを Code.gs として貼り付けて保存
 * 3. シートを再読み込み → メニュー「居場所マップ」
 * 4. 「設定を開く」でドメイン + APIキー（反映には POST / PATCH）
 * 5. 「シートを整える」→「microCMSから取り込む」
 *
 * ===== 複数選択（都道府県 / 分野 / カテゴリ）=====
 * チップUIは使わない。行を選択して
 *   居場所マップ → この行のタグを編集
 * チェックを付けて「シートに反映」。
 *
 * ===== 権限 =====
 * A〜D列（ID / 確認済 / ステータス / 反映日時）と「選択肢」は保護。
 * E「変更あり」は編集者がチェック。反映は管理者メニュー。
 * H〜J（都道府県・分野・カテゴリ）は紫＝メニュー「この行のタグを編集」専用。
 *
 * 列: A microCMS_ID | B 確認済 | C 反映ステータス | D 最終反映日時 | E 変更あり
 *     F 団体名 | G 住所 | H 都道府県 | I 分野 | J カテゴリ
 *     K 緯度 | L 経度 | M 一言解説 | N 詳細解説
 *     O note URL | P 公式サイト | Q X | R Instagram | S Facebook | T メモ
 *
 * getRange(row, column, numRows, numColumns) の第3・4引数は「行数・列数」。
 */

// ---------------------------------------------------------------------------
// 定数
// ---------------------------------------------------------------------------

var SHEET_NAME = '居場所';
var RULES_SHEET_NAME = '記入ルール';
var OPTIONS_SHEET_NAME = '選択肢';
var BEGINNER_SHEET_NAME = 'はじめての方へ';
var PROTECTION_DESC = 'sapochimu-admin-lock';

var HEADER = [
  'microCMS_ID',
  '確認済',
  '反映ステータス',
  '最終反映日時',
  '変更あり',
  '団体名',
  '住所',
  '都道府県',
  '分野',
  'カテゴリ',
  '緯度',
  '経度',
  '一言解説',
  '詳細解説',
  'note URL',
  '公式サイト',
  'X',
  'Instagram',
  'Facebook',
  'メモ',
];

var COL = {
  id: 1,
  confirmed: 2,
  status: 3,
  syncedAt: 4,
  changed: 5,
  name: 6,
  address: 7,
  prefectures: 8,
  field: 9,
  genre: 10,
  lat: 11,
  lng: 12,
  explanation: 13,
  explanationLong: 14,
  note: 15,
  hp: 16,
  twitter: 17,
  instagram: 18,
  facebook: 19,
  memo: 20,
};

/** 手編集したら「未反映」「変更あり」にする列（管理列・タグ列は含めない） */
var CONTENT_COLS = [
  COL.name,
  COL.address,
  COL.lat,
  COL.lng,
  COL.explanation,
  COL.explanationLong,
  COL.note,
  COL.hp,
  COL.twitter,
  COL.instagram,
  COL.facebook,
  COL.memo,
];

/** サイドバー専用（直接入力させない） */
var TAG_COLS = [COL.prefectures, COL.field, COL.genre];

var ALL_PREFECTURES = [
  '北海道', '青森県', '岩手県', '宮城県', '秋田県', '山形県', '福島県',
  '茨城県', '栃木県', '群馬県', '埼玉県', '千葉県', '東京都', '神奈川県',
  '新潟県', '富山県', '石川県', '福井県', '山梨県', '長野県', '岐阜県', '静岡県', '愛知県',
  '三重県', '滋賀県', '京都府', '大阪府', '兵庫県', '奈良県', '和歌山県',
  '鳥取県', '島根県', '岡山県', '広島県', '山口県',
  '徳島県', '香川県', '愛媛県', '高知県',
  '福岡県', '佐賀県', '長崎県', '熊本県', '大分県', '宮崎県', '鹿児島県', '沖縄県',
];

var REGION_GROUPS = [
  { name: '北海道・東北', prefs: ['北海道', '青森県', '岩手県', '宮城県', '秋田県', '山形県', '福島県'] },
  { name: '関東', prefs: ['茨城県', '栃木県', '群馬県', '埼玉県', '千葉県', '東京都', '神奈川県'] },
  { name: '中部', prefs: ['新潟県', '富山県', '石川県', '福井県', '山梨県', '長野県', '岐阜県', '静岡県', '愛知県'] },
  { name: '近畿', prefs: ['三重県', '滋賀県', '京都府', '大阪府', '兵庫県', '奈良県', '和歌山県'] },
  { name: '中国', prefs: ['鳥取県', '島根県', '岡山県', '広島県', '山口県'] },
  { name: '四国', prefs: ['徳島県', '香川県', '愛媛県', '高知県'] },
  { name: '九州・沖縄', prefs: ['福岡県', '佐賀県', '長崎県', '熊本県', '大分県', '宮崎県', '鹿児島県', '沖縄県'] },
];

var DEFAULT_FIELDS = ['地域'];
var DEFAULT_GENRES = ['阪大', '関西', 'コミュニティ', 'オンライン', '情報共有', '生きづらさ'];

// ---------------------------------------------------------------------------
// メニュー / トリガー
// ---------------------------------------------------------------------------

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('居場所マップ')
    .addItem('この行のタグを編集', 'openTagEditor')
    .addSeparator()
    .addSubMenu(
      SpreadsheetApp.getUi()
        .createMenu('管理者メニュー')
        .addItem('シートを整える（保護も含む）', 'setupSheets')
        .addItem('見た目だけ整える', 'restyleSheets')
        .addItem('microCMSから取り込む', 'pullFromMicroCms')
        .addItem('確認済をmicroCMSへ反映（新規・更新）', 'pushConfirmedToMicroCms')
        .addItem('選択肢をCMSから更新', 'refreshOptionsFromMicroCms')
        .addItem('列の保護をかけ直す', 'reapplyProtections')
        .addItem('設定を開く', 'openSettings')
    )
    .addToUi();
}

/**
 * - タグ列への直接入力は取り消して案内
 * - その他の内容列は「変更あり」オン
 */
function onEdit(e) {
  if (!e || !e.range) return;
  var range = e.range;
  if (range.getNumRows() !== 1 || range.getNumColumns() !== 1) return;

  var sheet = range.getSheet();
  if (sheet.getName() !== SHEET_NAME) return;
  if (range.getRow() < 2) return;

  var col = range.getColumn();

  // 都道府県・分野・カテゴリはサイドバー専用
  if (TAG_COLS.indexOf(col) !== -1) {
    var oldVal = e.oldValue === undefined ? '' : e.oldValue;
    range.setValue(oldVal);
    SpreadsheetApp.getActive().toast(
      '「居場所マップ → この行のタグを編集」から選んでください',
      'タグ列はメニューから',
      8
    );
    return;
  }

  if (CONTENT_COLS.indexOf(col) === -1) return;

  try {
    sheet.getRange(range.getRow(), COL.changed).setValue(true);
  } catch (err) {}
  try {
    sheet.getRange(range.getRow(), COL.status).setValue('未反映');
  } catch (err2) {}
}

function openSettings() {
  assertAdmin_();
  var props = PropertiesService.getScriptProperties();
  var ui = SpreadsheetApp.getUi();

  var domain = props.getProperty('MICROCMS_SERVICE_DOMAIN') || 'sapochimu';
  var domainRes = ui.prompt(
    '設定: サービスドメイン',
    'https://{ここ}.microcms.io の {ここ}\n現在: ' + domain,
    ui.ButtonSet.OK_CANCEL
  );
  if (domainRes.getSelectedButton() !== ui.Button.OK) return;
  domain = (domainRes.getResponseText() || '').trim() || domain;

  var keyRes = ui.prompt(
    '設定: APIキー',
    'microCMS の API キー（空欄なら変更なし）\n取り込み: GET / 反映: POST + PATCH',
    ui.ButtonSet.OK_CANCEL
  );
  if (keyRes.getSelectedButton() !== ui.Button.OK) return;

  var admins = props.getProperty('ADMIN_EMAILS') || Session.getEffectiveUser().getEmail() || '';
  var adminRes = ui.prompt(
    '設定: 管理者メール',
    '確認済・ID・ステータスを触れる人のメール（カンマ区切り）\n現在: ' + admins,
    ui.ButtonSet.OK_CANCEL
  );
  if (adminRes.getSelectedButton() !== ui.Button.OK) return;

  props.setProperty('MICROCMS_SERVICE_DOMAIN', domain);
  var key = (keyRes.getResponseText() || '').trim();
  if (key) props.setProperty('MICROCMS_API_KEY', key);
  var adminText = (adminRes.getResponseText() || '').trim();
  if (adminText) props.setProperty('ADMIN_EMAILS', adminText);

  applyProtections_();

  ui.alert(
    '保存しました',
    'ドメイン: ' +
      domain +
      '\nAPIキー: ' +
      (props.getProperty('MICROCMS_API_KEY') ? '設定済み' : '未設定') +
      '\n管理者: ' +
      (props.getProperty('ADMIN_EMAILS') || '（未設定）') +
      '\n列の保護も更新しました。',
    ui.ButtonSet.OK
  );
}

// ---------------------------------------------------------------------------
// タグ編集サイドバー（複数選択の本命）
// ---------------------------------------------------------------------------

function openTagEditor() {
  var sheet = getPlacesSheet_();
  var row = sheet.getActiveRange().getRow();
  if (row < 2) {
    SpreadsheetApp.getUi().alert('データ行（2行目以降）を選択してから実行してください。');
    return;
  }

  var name = String(sheet.getRange(row, COL.name).getValue() || '').trim() || '（名称未設定）';
  var state = {
    row: row,
    name: name,
    prefectures: splitList_(sheet.getRange(row, COL.prefectures).getValue()),
    field: splitList_(sheet.getRange(row, COL.field).getValue()),
    genre: splitList_(sheet.getRange(row, COL.genre).getValue()),
    options: readOptions_(),
    regions: REGION_GROUPS,
  };

  var html = HtmlService.createHtmlOutput(buildTagEditorHtml_(state))
    .setTitle('タグを編集')
    .setWidth(360);
  SpreadsheetApp.getUi().showSidebar(html);
}

/** サイドバーから呼ばれる */
function saveTagSelection(payload) {
  var sheet = getPlacesSheet_();
  var row = Number(payload.row);
  if (!row || row < 2) throw new Error('行番号が不正です');

  sheet.getRange(row, COL.prefectures).setValue(joinList_(payload.prefectures || []));
  sheet.getRange(row, COL.field).setValue(joinList_(payload.field || []));
  sheet.getRange(row, COL.genre).setValue(joinList_(payload.genre || []));
  try {
    sheet.getRange(row, COL.changed).setValue(true);
  } catch (err) {}
  try {
    sheet.getRange(row, COL.status).setValue('未反映');
  } catch (err2) {}

  return {
    ok: true,
    message:
      row +
      '行目（' +
      (sheet.getRange(row, COL.name).getValue() || '') +
      '）のタグを更新しました。「変更あり」にチェックが入っているので、管理者に一声かけてください。',
  };
}

function buildTagEditorHtml_(state) {
  var json = JSON.stringify(state).replace(/</g, '\\u003c');
  return [
    '<!DOCTYPE html><html><head><base target="_top">',
    '<style>',
    'body{font:13px/1.45 system-ui,sans-serif;margin:12px;color:#222}',
    'h1{font-size:14px;margin:0 0 8px}',
    'h2{font-size:12px;margin:14px 0 6px;color:#1b5e20;border-bottom:1px solid #c8e6c9;padding-bottom:2px}',
    'h3{font-size:11px;margin:8px 0 4px;color:#555}',
    '.meta{font-size:12px;color:#555;margin-bottom:10px}',
    '.grid{display:grid;grid-template-columns:1fr 1fr;gap:2px 8px}',
    'label{display:flex;gap:6px;align-items:flex-start;margin:2px 0;cursor:pointer}',
    'label span{word-break:break-all}',
    '.actions{position:sticky;bottom:0;background:#fff;padding:10px 0 4px;margin-top:12px;border-top:1px solid #ddd}',
    'button{width:100%;padding:10px;border:0;border-radius:8px;background:#2e7d32;color:#fff;font-weight:700;cursor:pointer}',
    'button:disabled{opacity:.6}',
    '.msg{margin-top:8px;font-size:12px;color:#1565c0}',
    '.err{color:#c62828}',
    '</style></head><body>',
    '<h1>タグを編集</h1>',
    '<div class="meta" id="meta"></div>',
    '<div id="root"></div>',
    '<div class="actions">',
    '<button type="button" id="save">シートに反映</button>',
    '<div class="msg" id="msg"></div>',
    '</div>',
    '<script>',
    'var STATE=' + json + ';',
    'function checkedSet(list){var s={};(list||[]).forEach(function(v){s[v]=true});return s;}',
    'function render(){',
    '  var pref=checkedSet(STATE.prefectures);',
    '  var field=checkedSet(STATE.field);',
    '  var genre=checkedSet(STATE.genre);',
    '  document.getElementById("meta").textContent=STATE.row+"行目 · "+STATE.name;',
    '  var html="";',
    '  html+="<h2>都道府県</h2>";',
    '  (STATE.regions||[]).forEach(function(g){',
    '    html+="<h3>"+esc(g.name)+"</h3><div class=\\"grid\\">";',
    '    (g.prefs||[]).forEach(function(p){',
    '      html+=item("pref",p,!!pref[p]);',
    '    });',
    '    html+="</div>";',
    '  });',
    '  html+="<h2>分野</h2><div class=\\"grid\\">";',
    '  (STATE.options.fields||[]).forEach(function(v){html+=item("field",v,!!field[v]);});',
    '  html+="</div>";',
    '  html+="<h2>カテゴリ</h2><div class=\\"grid\\">";',
    '  (STATE.options.genres||[]).forEach(function(v){html+=item("genre",v,!!genre[v]);});',
    '  html+="</div>";',
    '  document.getElementById("root").innerHTML=html;',
    '}',
    'function item(group,value,on){',
    '  return "<label><input type=\\"checkbox\\" data-g=\\""+group+"\\" value=\\""+escAttr(value)+"\\""+(on?" checked":"")+"><span>"+esc(value)+"</span></label>";',
    '}',
    'function esc(s){return String(s).replace(/[&<>]/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;"}[c];});}',
    'function escAttr(s){return esc(s).replace(/"/g,"&quot;");}',
    'function collect(group){',
    '  return Array.prototype.map.call(document.querySelectorAll("input[data-g=\\""+group+"\\"]:checked"),function(el){return el.value;});',
    '}',
    'document.getElementById("save").onclick=function(){',
    '  var btn=this; var msg=document.getElementById("msg");',
    '  btn.disabled=true; msg.className="msg"; msg.textContent="保存中…";',
    '  google.script.run',
    '    .withSuccessHandler(function(res){ btn.disabled=false; msg.textContent=(res&&res.message)||"保存しました"; })',
    '    .withFailureHandler(function(err){ btn.disabled=false; msg.className="msg err"; msg.textContent=String(err&&err.message||err); })',
    '    .saveTagSelection({',
    '      row: STATE.row,',
    '      prefectures: collect("pref"),',
    '      field: collect("field"),',
    '      genre: collect("genre")',
    '    });',
    '};',
    'render();',
    '</script></body></html>',
  ].join('');
}

// ---------------------------------------------------------------------------
// シート整備
// ---------------------------------------------------------------------------

function setupSheets() {
  assertAdmin_();
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
  sheet.setName(SHEET_NAME);

  // 保護があるとヘッダー更新などが失敗するため、いったん外す
  removeOurProtections_(sheet);
  migrateChangedColumnIfNeeded_(sheet);

  sheet.getRange(1, 1, 1, HEADER.length).setValues([HEADER]);
  sheet.setFrozenRows(1);
  sheet.getRange(1, 1, 1, HEADER.length).setFontWeight('bold').setBackground('#E8F5E9');
  // 管理列の見た目
  sheet.getRange(1, 1, 1, 4).setBackground('#FFECB3');
  // 編集者チェック
  sheet.getRange(1, COL.changed).setBackground('#E3F2FD');

  var maxRows = Math.max(sheet.getMaxRows(), 200);
  var dataRows = maxRows - 1;
  sheet.getRange(2, COL.confirmed, dataRows, 1).insertCheckboxes();
  sheet.getRange(2, COL.changed, dataRows, 1).insertCheckboxes();

  var statusRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(['未反映', '反映済', 'エラー'], true)
    .setAllowInvalid(true)
    .build();
  sheet.getRange(2, COL.status, dataRows, 1).setDataValidation(statusRule);

  sheet.getRange(2, COL.prefectures, dataRows, 1).clearDataValidations();
  sheet.getRange(2, COL.field, dataRows, 1).clearDataValidations();
  sheet.getRange(2, COL.genre, dataRows, 1).clearDataValidations();

  sheet.setColumnWidth(COL.id, 110);
  sheet.setColumnWidth(COL.confirmed, 70);
  sheet.setColumnWidth(COL.status, 100);
  sheet.setColumnWidth(COL.syncedAt, 140);
  sheet.setColumnWidth(COL.changed, 80);
  sheet.setColumnWidth(COL.name, 180);
  sheet.setColumnWidth(COL.address, 260);
  sheet.setColumnWidth(COL.prefectures, 140);
  sheet.setColumnWidth(COL.field, 100);
  sheet.setColumnWidth(COL.genre, 200);
  sheet.setColumnWidth(COL.lat, 100);
  sheet.setColumnWidth(COL.lng, 100);
  sheet.setColumnWidth(COL.explanation, 200);
  sheet.setColumnWidth(COL.explanationLong, 260);
  sheet.setColumnWidth(COL.memo, 140);

  sheet.getRange(1, COL.prefectures).setNote(
    'ここには直接書きません。「居場所マップ → この行のタグを編集」から選んでください'
  );
  sheet.getRange(1, COL.field).setNote('直接入力不可。メニュー「この行のタグを編集」から');
  sheet.getRange(1, COL.genre).setNote('直接入力不可。メニュー「この行のタグを編集」から');
  sheet.getRange(1, COL.id).setNote('管理者専用');
  sheet.getRange(1, COL.confirmed).setNote('管理者専用。内容確認後にチェック');
  sheet.getRange(1, COL.status).setNote('自動更新');
  sheet.getRange(1, COL.syncedAt).setNote('自動更新');
  sheet.getRange(1, COL.changed).setNote('編集したらオン。管理者への合図です');
  sheet.getRange(1, COL.lat).setNote('Googleマップで場所を右クリック → いちばん上の数字が緯度,経度');
  sheet.getRange(1, COL.lng).setNote('緯度の右隣の数字。右クリックでコピーできます');

  applyPlacesSheetDesign_(sheet);

  ensureOptionsSheet_(ss, [], []);
  ensureBeginnerSheet_(ss);
  ensureRulesSheet_(ss);
  trimEmptyTrailingRows_(sheet);
  rememberCurrentUserAsAdmin_();
  applyProtections_();

  SpreadsheetApp.getUi().alert(
    'シートを整えました',
    '・黄色い列（A〜D）は管理者用です\n' +
      '・水色の「変更あり」は編集者用です\n' +
      '・紫色の列（都道府県・分野・カテゴリ）はメニューから編集\n' +
      '・色分けとステータスの色も整えました\n' +
      '・くわしくは「はじめての方へ」タブへ',
    SpreadsheetApp.getUi().ButtonSet.OK
  );
}

/**
 * 居場所シートの見た目（色・交互行・条件付き書式・タブ色）
 * さぽちむっぽい緑基調で、列の役割が一目で分かるようにする。
 */
function applyPlacesSheetDesign_(sheet) {
  var maxRows = Math.max(sheet.getMaxRows(), 200);
  var dataRows = maxRows - 1;
  var lastCol = HEADER.length;

  sheet.setTabColor('#43A047');
  var all = sheet.getRange(1, 1, maxRows, lastCol);
  all.setFontFamily('Arial');
  all.setFontSize(10);
  all.setVerticalAlignment('middle');

  var body = sheet.getRange(2, 1, dataRows, lastCol);
  body.setBackground('#FFFFFF');
  body.setFontColor('#333333');
  body.setWrap(true);

  var header = sheet.getRange(1, 1, 1, lastCol);
  header
    .setFontWeight('bold')
    .setFontSize(10)
    .setFontColor('#1B4332')
    .setHorizontalAlignment('center')
    .setVerticalAlignment('middle');
  sheet.setRowHeight(1, 36);

  // A〜D 管理者帯
  sheet.getRange(1, 1, 1, 4).setBackground('#F0C987').setFontColor('#5D4037');
  sheet.getRange(2, 1, dataRows, 4).setBackground('#FFF8E8');

  // E 変更あり
  sheet.getRange(1, COL.changed).setBackground('#64B5F6').setFontColor('#0D47A1');
  sheet.getRange(2, COL.changed, dataRows, 1).setBackground('#E3F2FD');

  // F〜 本文ヘッダー
  sheet
    .getRange(1, COL.name, 1, lastCol - COL.name + 1)
    .setBackground('#66BB6A')
    .setFontColor('#FFFFFF');

  // タグ列（紫）：メニュー「この行のタグを編集」専用
  sheet
    .getRange(1, COL.prefectures, 1, 3)
    .setBackground('#AB47BC')
    .setFontColor('#FFFFFF');
  sheet.getRange(2, COL.prefectures, dataRows, 3).setBackground('#F3E5F5').setFontColor('#6A1B9A');

  sheet.getRange(2, COL.name, dataRows, 1).setFontWeight('bold');
  sheet.setFrozenColumns(COL.changed);

  sheet.clearConditionalFormatRules();
  var rules = [];
  // タグ列は色を固定したいので、条件付き書式の対象から外す
  var editRanges = [
    sheet.getRange(2, COL.name, dataRows, 2),
    sheet.getRange(2, COL.lat, dataRows, lastCol - COL.lat + 1),
  ];
  var statusRange = sheet.getRange(2, COL.status, dataRows, 1);

  rules.push(
    SpreadsheetApp.newConditionalFormatRule()
      .whenFormulaSatisfied('=$E2=TRUE')
      .setBackground('#E8F5E9')
      .setRanges(editRanges)
      .build()
  );
  rules.push(
    SpreadsheetApp.newConditionalFormatRule()
      .whenFormulaSatisfied('=ISEVEN(ROW())')
      .setBackground('#F4FBF6')
      .setRanges(editRanges)
      .build()
  );
  rules.push(
    SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo('エラー')
      .setBackground('#FFCDD2')
      .setFontColor('#B71C1C')
      .setRanges([statusRange])
      .build()
  );
  rules.push(
    SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo('未反映')
      .setBackground('#FFE0B2')
      .setFontColor('#E65100')
      .setRanges([statusRange])
      .build()
  );
  rules.push(
    SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo('反映済')
      .setBackground('#C8E6C9')
      .setFontColor('#1B5E20')
      .setRanges([statusRange])
      .build()
  );

  sheet.setConditionalFormatRules(rules);

  sheet.getRange(1, COL.name).setNote(
    '色の意味\nベージュ: 管理者用\n水色: 変更あり（編集者）\n緑ヘッダー: 直接編集OK\n紫ヘッダー: タグ（メニューから編集・直接入力不可）\n行が薄い緑: 変更ありオン'
  );
}

/** 旧レイアウト（E列が団体名）なら「変更あり」列を挿入してずらす */
function migrateChangedColumnIfNeeded_(sheet) {
  var lastCol = sheet.getLastColumn();
  if (lastCol < 1) return;
  var headers = sheet.getRange(1, 1, 1, lastCol).getValues()[0];
  var hasChanged = false;
  for (var i = 0; i < headers.length; i++) {
    if (String(headers[i]).trim() === '変更あり') {
      hasChanged = true;
      break;
    }
  }
  if (hasChanged) return;
  if (String(headers[4] || '').trim() === '団体名') {
    sheet.insertColumnBefore(5);
  }
}

function reapplyProtections() {
  assertAdmin_();
  rememberCurrentUserAsAdmin_();
  applyProtections_();
  SpreadsheetApp.getUi().alert('保護をかけ直しました。黄色い列（A〜D）と「選択肢」は管理者のみ編集できます。');
}

function restyleSheets() {
  assertAdmin_();
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = getPlacesSheet_();
  removeOurProtections_(sheet);
  applyPlacesSheetDesign_(sheet);
  ensureBeginnerSheet_(ss);
  ensureRulesSheet_(ss);
  var opt = ss.getSheetByName(OPTIONS_SHEET_NAME);
  if (opt) styleOptionsSheet_(opt);
  applyProtections_();
  SpreadsheetApp.getUi().alert('見た目を整えました（色・条件付き書式・タブ色）。');
}

function refreshOptionsFromMicroCms() {
  assertAdmin_();
  var cfg = getConfigOrThrow_();
  var contents = fetchAllLocations_(cfg);
  var collected = collectOptionsFromContents_(contents);
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  removeOurProtections_(ss.getSheetByName(OPTIONS_SHEET_NAME));
  ensureOptionsSheet_(ss, collected.fields, collected.genres);
  applyProtections_();
  SpreadsheetApp.getUi().alert(
    '選択肢を更新しました',
    '分野 ' + collected.fields.length + ' / カテゴリ ' + collected.genres.length + ' 件',
    SpreadsheetApp.getUi().ButtonSet.OK
  );
}

function ensureOptionsSheet_(ss, extraFields, extraGenres) {
  var sheet = ss.getSheetByName(OPTIONS_SHEET_NAME);
  if (!sheet) sheet = ss.insertSheet(OPTIONS_SHEET_NAME);
  removeOurProtections_(sheet);

  var existing = readOptionsFromSheet_(sheet);
  var fields = uniqueSorted_(DEFAULT_FIELDS.concat(existing.fields, extraFields || []));
  var genres = uniqueSorted_(DEFAULT_GENRES.concat(existing.genres, extraGenres || []));
  var prefs = ALL_PREFECTURES.slice();
  var height = Math.max(prefs.length, fields.length, genres.length, 1);

  sheet.clear();
  sheet.getRange(1, 1, 1, 3).setValues([['都道府県', '分野', 'カテゴリ']]);
  sheet.getRange(1, 1, 1, 3).setFontWeight('bold').setBackground('#E3F2FD');
  sheet.setFrozenRows(1);

  var rows = [];
  for (var i = 0; i < height; i++) {
    rows.push([prefs[i] || '', fields[i] || '', genres[i] || '']);
  }
  sheet.getRange(2, 1, rows.length, 3).setValues(rows);
  sheet.setColumnWidth(1, 120);
  sheet.setColumnWidth(2, 140);
  sheet.setColumnWidth(3, 160);
  sheet.getRange(height + 3, 1).setValue(
    '※ 管理者専用。タグ編集の候補です。語を増やしたら microCMS のセレクトにも同じ語を追加してください。'
  );
  styleOptionsSheet_(sheet);
}

function styleOptionsSheet_(sheet) {
  sheet.setTabColor('#42A5F5');
  var last = Math.max(sheet.getLastRow(), 1);
  sheet.getRange(1, 1, 1, 3)
    .setFontWeight('bold')
    .setBackground('#42A5F5')
    .setFontColor('#FFFFFF')
    .setHorizontalAlignment('center');
  if (last >= 2) {
    sheet.getRange(2, 1, last - 1, 3).setBackground('#F5FBFF');
  }
}

function ensureBeginnerSheet_(ss) {
  var sheet = ss.getSheetByName(BEGINNER_SHEET_NAME);
  if (!sheet) sheet = ss.insertSheet(BEGINNER_SHEET_NAME, 0);
  removeOurProtections_(sheet);
  sheet.clear();

  var lines = [
    ['はじめての方へ（居場所シート）'],
    [''],
    ['サイトに載せる居場所の情報を、いっしょに整えていくシートです。'],
    ['まずは下の手順どおりで大丈夫です。'],
    [''],
    ['━━━━━━━━━━━━━━━━━━━━━━━━'],
    ['基本の流れ'],
    ['━━━━━━━━━━━━━━━━━━━━━━━━'],
    [''],
    ['① 下のタブ「居場所」を開く'],
    ['② 直したい行を編集する（団体名、住所、解説、URL、メモなど）'],
    ['③ 都道府県・分野・カテゴリ（紫色の列）を変えるとき'],
    ['　・紫色の列には直接書きません'],
    ['　・その行をクリック'],
    ['　・上メニュー「居場所マップ」→「この行のタグを編集」'],
    ['　・チェックを付け外し →「シートに反映」'],
    ['　・欲しい分野・カテゴリがリストにないときは、やまちゃんに連絡してください'],
    ['④ 編集できたら、青い列「変更あり」にチェックを入れる'],
    ['⑤ 管理者に「直しました」と一声かける'],
    [''],
    ['（セルを編集したりタグを保存すると、「変更あり」は自動でオンになることもあります）'],
    [''],
    ['━━━━━━━━━━━━━━━━━━━━━━━━'],
    ['緯度・経度の入れ方'],
    ['━━━━━━━━━━━━━━━━━━━━━━━━'],
    [''],
    ['地図にピンを置くための数字です。次の手順でコピーできます。'],
    [''],
    ['1. パソコンで Google マップ（https://maps.google.com/）を開く'],
    ['2. 居場所の住所や名前で検索する'],
    ['3. 地図上のピン（またはだいたいの位置）を右クリックする'],
    ['4. メニューのいちばん上に「35.xxxx, 135.xxxx」のような数字が出る'],
    ['　・左側が緯度、右側が経度です'],
    ['5. その数字をクリックするとコピーできます'],
    ['6. シートの「緯度」「経度」列にそれぞれ貼り付ける'],
    [''],
    ['スマホの場合は表示が少し違うことがあります。わからなければ空欄のままでもOKです。'],
    [''],
    ['━━━━━━━━━━━━━━━━━━━━━━━━'],
    ['黄色い列について'],
    ['━━━━━━━━━━━━━━━━━━━━━━━━'],
    [''],
    ['microCMS_ID / 確認済 / 反映ステータス / 最終反映日時 は管理用です。'],
    ['ここは触らなくて大丈夫です（管理者だけが使います）。'],
    [''],
    ['━━━━━━━━━━━━━━━━━━━━━━━━'],
    ['新しい居場所を足すとき'],
    ['━━━━━━━━━━━━━━━━━━━━━━━━'],
    [''],
    ['1. 「居場所」のいちばん下の空行に団体名などを書く'],
    ['2. タグは「この行のタグを編集」で選ぶ'],
    ['3. 「変更あり」にチェック → 管理者に連絡'],
    ['　（microCMS_ID は空のままで大丈夫です）'],
    [''],
    ['困ったときは、近くの人や管理者に気軽に聞いてください。'],
  ];
  sheet.getRange(1, 1, lines.length, 1).setValues(lines);
  sheet.getRange(1, 1).setFontWeight('bold').setFontSize(14).setFontColor('#1B5E20');
  sheet.getRange(1, 1, lines.length, 1).setFontFamily('Arial').setFontSize(11);
  sheet.getRange(1, 1).setFontSize(16);
  sheet.setColumnWidth(1, 760);
  sheet.setTabColor('#81C784');
  sheet.setRowHeight(1, 32);
}

function ensureRulesSheet_(ss) {
  var sheet = ss.getSheetByName(RULES_SHEET_NAME);
  if (!sheet) sheet = ss.insertSheet(RULES_SHEET_NAME);
  removeOurProtections_(sheet);
  sheet.clear();
  var lines = [
    ['【メンバー】「はじめての方へ」タブを見てください'],
    [''],
    ['【管理者の流れ】'],
    ['1. 「変更あり」がオンの行を確認'],
    ['2. 内容OKなら黄色い「確認済」にチェック'],
    ['3. 管理者メニュー → 確認済をmicroCMSへ反映'],
    ['4. （任意）本番は Cloudflare の再ビルド or Deploy Hook'],
    [''],
    ['・A〜D列と「選択肢」は保護。E「変更あり」は編集者用'],
    ['・反映成功時、「確認済」「変更あり」は自動でオフ'],
    ['・選択肢に語を足したら microCMS のセレクトにも追加'],
    ['・IDあり=更新(PATCH) / ID空=新規(POST)'],
  ];
  sheet.getRange(1, 1, lines.length, 1).setValues(lines);
  sheet.getRange(1, 1).setFontWeight('bold').setFontSize(13).setFontColor('#5D4037');
  sheet.setColumnWidth(1, 720);
  sheet.setTabColor('#BCAAA4');
}

/** 中身のない確認済だけの行を末尾から削る（見た目のノイズ対策） */
function trimEmptyTrailingRows_(sheet) {
  var last = sheet.getLastRow();
  if (last < 2) return;
  var values = sheet.getRange(2, 1, last - 1, HEADER.length).getValues();
  var keep = values.length;
  while (keep > 0) {
    var row = values[keep - 1];
    var hasContent = false;
    for (var c = 0; c < row.length; c++) {
      if (c === COL.confirmed - 1 || c === COL.changed - 1) continue;
      if (row[c] !== '' && row[c] !== null && row[c] !== false) {
        hasContent = true;
        break;
      }
    }
    if (hasContent) break;
    keep--;
  }
  // 余白は残しつつ、表示上はデータ範囲だけ意識。削除は行が多すぎるときのみ
  var trailing = values.length - keep;
  if (trailing > 20) {
    sheet.deleteRows(keep + 2, trailing);
  }
}

// ---------------------------------------------------------------------------
// 同期
// ---------------------------------------------------------------------------

function pullFromMicroCms() {
  assertAdmin_();
  var cfg = getConfigOrThrow_();
  var contents = fetchAllLocations_(cfg);
  var sheet = getPlacesSheet_();
  removeOurProtections_(sheet);
  migrateChangedColumnIfNeeded_(sheet);
  sheet.getRange(1, 1, 1, HEADER.length).setValues([HEADER]);

  var memoById = {};
  var lastRow = sheet.getLastRow();
  if (lastRow >= 2) {
    var existingRows = lastRow - 1;
    var existing = sheet.getRange(2, 1, existingRows, HEADER.length).getValues();
    existing.forEach(function (row) {
      var id = String(row[COL.id - 1] || '').trim();
      var memo = row[COL.memo - 1];
      if (id && memo) memoById[id] = memo;
    });
    sheet.getRange(2, 1, existingRows, HEADER.length).clearContent();
    sheet.getRange(2, COL.confirmed, existingRows, 1).insertCheckboxes();
    sheet.getRange(2, COL.changed, existingRows, 1).insertCheckboxes();
  }

  if (!contents.length) {
    applyProtections_();
    SpreadsheetApp.getUi().alert('microCMS に location がありませんでした。');
    return;
  }

  var rows = contents.map(function (c) {
    return [
      c.id || '',
      false,
      '反映済',
      '',
      false,
      c.locationName || '',
      c.address || '',
      joinList_(c.prefectures),
      joinList_(c.field),
      joinList_(c.genre),
      c.lat != null ? c.lat : '',
      c.lng != null ? c.lng : '',
      c.explanation || '',
      c.explanationLong || '',
      c.note || '',
      c.hp || '',
      c.twitter || '',
      c.instagram || '',
      c.facebook || '',
      memoById[c.id] || '',
    ];
  });

  sheet.getRange(2, 1, rows.length, HEADER.length).setValues(rows);
  sheet.getRange(2, COL.confirmed, rows.length, 1).insertCheckboxes();
  sheet.getRange(2, COL.changed, rows.length, 1).insertCheckboxes();

  var collected = collectOptionsFromContents_(contents);
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  ensureOptionsSheet_(ss, collected.fields, collected.genres);
  applyProtections_();

  SpreadsheetApp.getUi().alert(
    '取り込み完了',
    contents.length + ' 件を取り込みました。保護も再適用済みです。',
    SpreadsheetApp.getUi().ButtonSet.OK
  );
}

function pushConfirmedToMicroCms() {
  assertAdmin_();
  var cfg = getConfigOrThrow_();
  var sheet = getPlacesSheet_();
  removeOurProtections_(sheet);

  var lastRow = sheet.getLastRow();
  if (lastRow < 2) {
    applyProtections_();
    SpreadsheetApp.getUi().alert('データ行がありません。');
    return;
  }

  var dataRows = lastRow - 1;
  var values = sheet.getRange(2, 1, dataRows, HEADER.length).getValues();
  var now = Utilities.formatDate(new Date(), 'Asia/Tokyo', 'yyyy-MM-dd HH:mm:ss');
  var ok = 0;
  var fail = 0;
  var messages = [];
  var pending = [];

  values.forEach(function (row, i) {
    var confirmed = row[COL.confirmed - 1] === true || row[COL.confirmed - 1] === 'TRUE';
    if (!confirmed) return;
    pending.push({ row: row, sheetRow: i + 2 });
  });

  if (!pending.length) {
    applyProtections_();
    SpreadsheetApp.getUi().alert('確認済の行がありません。B列にチェックを入れてから実行してください。');
    return;
  }

  pending.forEach(function (item, idx) {
    var row = item.row;
    var sheetRow = item.sheetRow;
    var id = String(row[COL.id - 1] || '').trim();
    var body = buildLocationBody_(row);

    if (!body.locationName) {
      fail++;
      messages.push('行' + sheetRow + ': 団体名が空です');
      sheet.getRange(sheetRow, COL.status).setValue('エラー');
      return;
    }

    try {
      var action;
      if (id) {
        microCmsRequest_(cfg, 'patch', '/api/v1/location/' + encodeURIComponent(id), body);
        action = '更新';
      } else {
        var result = microCmsRequest_(cfg, 'post', '/api/v1/location', body);
        if (result && result.id) {
          sheet.getRange(sheetRow, COL.id).setValue(result.id);
          id = result.id;
        }
        action = '新規';
      }
      sheet.getRange(sheetRow, COL.status).setValue('反映済');
      sheet.getRange(sheetRow, COL.syncedAt).setValue(now);
      sheet.getRange(sheetRow, COL.confirmed).setValue(false);
      sheet.getRange(sheetRow, COL.changed).setValue(false);
      ok++;
      messages.push('行' + sheetRow + ': ' + action + ' OK' + (id ? ' (' + id + ')' : ''));
    } catch (err) {
      fail++;
      messages.push('行' + sheetRow + ': ' + err.message);
      sheet.getRange(sheetRow, COL.status).setValue('エラー');
    }

    if (idx < pending.length - 1) {
      Utilities.sleep(350);
    }
  });

  applyProtections_();

  var summary = '成功 ' + ok + ' 件 / 失敗 ' + fail + ' 件';
  if (messages.length) summary += '\n\n' + messages.slice(0, 20).join('\n');
  SpreadsheetApp.getUi().alert('反映結果', summary, SpreadsheetApp.getUi().ButtonSet.OK);
}

function buildLocationBody_(row) {
  var body = {
    locationName: String(row[COL.name - 1] || '').trim(),
    address: String(row[COL.address - 1] || '').trim(),
    prefectures: splitList_(row[COL.prefectures - 1]),
    field: splitList_(row[COL.field - 1]),
    genre: splitList_(row[COL.genre - 1]),
  };

  var lat = toNumberOrNull_(row[COL.lat - 1]);
  var lng = toNumberOrNull_(row[COL.lng - 1]);
  if (lat != null) body.lat = lat;
  if (lng != null) body.lng = lng;

  setIfText_(body, 'explanation', row[COL.explanation - 1], true);
  setIfText_(body, 'explanationLong', row[COL.explanationLong - 1], true);
  setIfText_(body, 'note', row[COL.note - 1], true);
  setIfText_(body, 'hp', row[COL.hp - 1], true);
  setIfText_(body, 'twitter', row[COL.twitter - 1], true);
  setIfText_(body, 'instagram', row[COL.instagram - 1], true);
  setIfText_(body, 'facebook', row[COL.facebook - 1], true);

  return body;
}

// ---------------------------------------------------------------------------
// microCMS
// ---------------------------------------------------------------------------

function fetchAllLocations_(cfg) {
  var limit = 100;
  var offset = 0;
  var all = [];
  while (true) {
    var data = microCmsRequest_(cfg, 'get', '/api/v1/location?limit=' + limit + '&offset=' + offset, null);
    var contents = (data && data.contents) || [];
    all = all.concat(contents);
    if (contents.length < limit) break;
    offset += limit;
    if (offset > 5000) break;
  }
  return all;
}

function microCmsRequest_(cfg, method, path, body) {
  var url = 'https://' + cfg.domain + '.microcms.io' + path;
  var options = {
    method: method,
    headers: { 'X-MICROCMS-API-KEY': cfg.apiKey },
    muteHttpExceptions: true,
  };
  if (body) {
    options.contentType = 'application/json';
    options.payload = JSON.stringify(body);
  }
  var res = UrlFetchApp.fetch(url, options);
  var code = res.getResponseCode();
  var text = res.getContentText();
  if (code < 200 || code >= 300) {
    throw new Error('HTTP ' + code + ' ' + text.slice(0, 300));
  }
  if (!text) return {};
  return JSON.parse(text);
}

function getConfigOrThrow_() {
  var props = PropertiesService.getScriptProperties();
  var domain = (props.getProperty('MICROCMS_SERVICE_DOMAIN') || '').trim();
  var apiKey = (props.getProperty('MICROCMS_API_KEY') || '').trim();
  if (!domain || !apiKey) {
    SpreadsheetApp.getUi().alert('先に「設定を開く」でドメインと API キーを保存してください。');
    throw new Error('設定不足');
  }
  return { domain: domain, apiKey: apiKey };
}

// ---------------------------------------------------------------------------
// 管理者・保護
// ---------------------------------------------------------------------------

function assertAdmin_() {
  if (isAdminUser_()) return;
  SpreadsheetApp.getUi().alert(
    '管理者専用です',
    'この操作は管理者だけが実行できます。\nメンバーの方は「はじめての方へ」タブの手順で編集し、管理者に連絡してください。',
    SpreadsheetApp.getUi().ButtonSet.OK
  );
  throw new Error('管理者以外');
}

function isAdminUser_() {
  var email = getCurrentEmail_().toLowerCase();
  var admins = getAdminEmails_();
  if (email && admins.indexOf(email) >= 0) return true;

  try {
    var owner = SpreadsheetApp.getActiveSpreadsheet().getOwner();
    if (owner && email && owner.getEmail().toLowerCase() === email) return true;
  } catch (e) {}

  if (!email) {
    try {
      var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
      if (!sheet) return true;
      var cell = sheet.getRange(1, COL.id);
      var v = cell.getValue();
      cell.setValue(v);
      return true;
    } catch (e2) {
      return false;
    }
  }
  return false;
}

function getCurrentEmail_() {
  try {
    return Session.getActiveUser().getEmail() || Session.getEffectiveUser().getEmail() || '';
  } catch (e) {
    return '';
  }
}

function getAdminEmails_() {
  var raw = PropertiesService.getScriptProperties().getProperty('ADMIN_EMAILS') || '';
  return uniqueSorted_(
    raw
      .split(/[,、\s]+/)
      .filter(Boolean)
      .map(function (s) {
        return s.toLowerCase();
      })
  );
}

function rememberCurrentUserAsAdmin_() {
  var email = getCurrentEmail_();
  if (!email) return;
  var props = PropertiesService.getScriptProperties();
  var list = getAdminEmails_();
  if (list.indexOf(email.toLowerCase()) === -1) {
    list.push(email.toLowerCase());
    props.setProperty('ADMIN_EMAILS', list.join(','));
  }
}

function applyProtections_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var places = ss.getSheetByName(SHEET_NAME);
  if (places) {
    removeOurProtections_(places);
    var lastRow = Math.max(places.getMaxRows(), 2);
    var range = places.getRange(1, 1, lastRow, 4);
    protectRangeForAdmins_(range);
  }

  var opt = ss.getSheetByName(OPTIONS_SHEET_NAME);
  if (opt) {
    removeOurProtections_(opt);
    protectSheetForAdmins_(opt);
  }

  var beginner = ss.getSheetByName(BEGINNER_SHEET_NAME);
  if (beginner) {
    removeOurProtections_(beginner);
    protectSheetForAdmins_(beginner);
  }

  var rules = ss.getSheetByName(RULES_SHEET_NAME);
  if (rules) {
    removeOurProtections_(rules);
    protectSheetForAdmins_(rules);
  }
}

function protectRangeForAdmins_(range) {
  var p = range.protect().setDescription(PROTECTION_DESC);
  p.setWarningOnly(false);
  configureProtectionEditors_(p);
}

function protectSheetForAdmins_(sheet) {
  var p = sheet.protect().setDescription(PROTECTION_DESC);
  p.setWarningOnly(false);
  configureProtectionEditors_(p);
}

function configureProtectionEditors_(protection) {
  var emails = getAdminEmails_();
  var me = getCurrentEmail_();
  if (me) emails = uniqueSorted_(emails.concat([me.toLowerCase()]));

  try {
    var editors = protection.getEditors();
    for (var i = 0; i < editors.length; i++) {
      try {
        protection.removeEditor(editors[i]);
      } catch (e) {}
    }
  } catch (e2) {}

  for (var j = 0; j < emails.length; j++) {
    try {
      protection.addEditor(emails[j]);
    } catch (e3) {}
  }

  try {
    if (protection.canDomainEdit()) protection.setDomainEdit(false);
  } catch (e4) {}
}

function removeOurProtections_(sheet) {
  if (!sheet) return;
  try {
    var sheetPs = sheet.getProtections(SpreadsheetApp.ProtectionType.SHEET);
    for (var i = 0; i < sheetPs.length; i++) {
      if (sheetPs[i].getDescription() === PROTECTION_DESC && sheetPs[i].canEdit()) {
        sheetPs[i].remove();
      }
    }
  } catch (e) {}
  try {
    var rangePs = sheet.getProtections(SpreadsheetApp.ProtectionType.RANGE);
    for (var j = 0; j < rangePs.length; j++) {
      if (rangePs[j].getDescription() === PROTECTION_DESC && rangePs[j].canEdit()) {
        rangePs[j].remove();
      }
    }
  } catch (e2) {}
}

// ---------------------------------------------------------------------------
// ヘルパー
// ---------------------------------------------------------------------------

function getPlacesSheet_() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  if (!sheet) {
    SpreadsheetApp.getUi().alert('「' + SHEET_NAME + '」がありません。「シートを整える」を先に実行してください。');
    throw new Error('シートなし');
  }
  return sheet;
}

function readOptions_() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(OPTIONS_SHEET_NAME);
  if (!sheet) {
    return { fields: DEFAULT_FIELDS.slice(), genres: DEFAULT_GENRES.slice() };
  }
  return readOptionsFromSheet_(sheet);
}

function readOptionsFromSheet_(sheet) {
  var fields = [];
  var genres = [];
  if (sheet.getLastRow() >= 2) {
    var n = sheet.getLastRow() - 1;
    var existing = sheet.getRange(2, 1, n, 3).getValues();
    existing.forEach(function (row) {
      if (row[1]) fields.push(String(row[1]).trim());
      if (row[2]) genres.push(String(row[2]).trim());
    });
  }
  return {
    fields: uniqueSorted_(DEFAULT_FIELDS.concat(fields)),
    genres: uniqueSorted_(DEFAULT_GENRES.concat(genres)),
  };
}

function collectOptionsFromContents_(contents) {
  var fields = [];
  var genres = [];
  (contents || []).forEach(function (c) {
    (c.field || []).forEach(function (v) {
      fields.push(String(v).trim());
    });
    (c.genre || []).forEach(function (v) {
      genres.push(String(v).trim());
    });
  });
  return { fields: uniqueSorted_(fields), genres: uniqueSorted_(genres) };
}

function uniqueSorted_(arr) {
  var seen = {};
  var out = [];
  (arr || []).forEach(function (v) {
    var s = String(v || '').trim();
    if (!s || seen[s]) return;
    seen[s] = true;
    out.push(s);
  });
  out.sort(function (a, b) {
    return a < b ? -1 : a > b ? 1 : 0;
  });
  return out;
}

function joinList_(v) {
  if (!v) return '';
  if (Object.prototype.toString.call(v) === '[object Array]') {
    return v
      .map(function (x) {
        return String(x).trim();
      })
      .filter(Boolean)
      .join(', ');
  }
  return String(v);
}

function splitList_(v) {
  if (v == null || v === '') return [];
  return String(v)
    .split(/[,、]/)
    .map(function (s) {
      return s.trim();
    })
    .filter(Boolean);
}

function toNumberOrNull_(v) {
  if (v === '' || v == null) return null;
  var n = Number(v);
  return isNaN(n) ? null : n;
}

function setIfText_(obj, key, v, allowEmpty) {
  var s = v == null ? '' : String(v).trim();
  if (s || allowEmpty) obj[key] = s;
}
