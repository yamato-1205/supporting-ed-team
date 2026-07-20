/**
 * メンバー募集ページの静的テキスト（チーム募集表は recruit.ts）。
 */
import teamDiagramImg from "../assets/sections/team-diagram.png";

export const MEMBER_PAGE = {
  title: "メンバー募集",
  description:
    "さぽちむのメンバー募集ページ。イベント・SNS・その他の各チームの活動内容と、現在のメンバーを紹介します。",
  aboutTitle: "さぽちむとは",
  aboutParagraphs: [
    "全チーム：おおよそ週1で各チームごとに1時間のミーティング\n固定の曜日等ではなく、毎月バイト等の予定が出てからメンバー間で調整します！（固定でやっているチームも○）オンラインツールで適宜コミュニケーションをとります。",
  ],
  aboutList: [
    "ミーティング：オンライン（discord）",
    "対面イベント：GV津雲台（阪急山田駅）周辺メイン、その他活動したいところで挑戦できます",
    "オンラインイベント：zoomなどを使用（イベントに関しては、イベントチーム以外は参加は任意）",
    "不定期でオフ会を開催",
  ],
  diagram: {
    src: teamDiagramImg,
    alt: "さぽちむのチーム構成図（①イベント・②SNS・③その他）",
  },
  membersTitle: "メンバー一覧",
  membersEmpty: "現在メンバー情報を取得できません。",
  contactLabel: "お問い合わせ",
  contactHref: "/contact",
} as const;
