/**
 * 応援するページのコンテンツ（唯一の定義元）。
 * 寄付先URL・文言の変更はこのファイルだけで行う。
 */

/** Syncable 寄付フォーム */
export const DONATE_URL =
  "https://syncable.biz/associate/sapochimu1/donate";

export const SUPPORT_INTRO = {
  lead: "誰もが抱える/抱えうる弱さや痛みを受容できる社会を目指して。",
  paragraphs: [
    "私たちは、すべての“幸せに向かう営み”を「福祉」と捉えます。",
    "「福祉なのに福祉っぽくない」\nそんなイベントや対話の場を通して、\n誰もが“しんどさ”を抱えたまま関われる社会を目指しています。",
  ],
} as const;

export const SUPPORT_WHY = {
  title: "ご寄付が支えるもの",
  paragraphs: [
    "さぽちむの活動は、\nいろんな背景を抱えた人も、老若男女も問わず、\nできるだけ多くの人に開かれた場（イベントやコミュニティ）づくりを目指しています。",
    "だからこそ、イベント運営費・会場費・材料費などを、\n応援してくださる方々の支えで成り立たせています。",
    "ご寄付は、単なる資金ではなく、\n一人ひとりの「居場所」を支える力になります。",
  ],
} as const;

export const SUPPORT_USAGE = {
  title: "ご寄付の使い道",
  items: [
    "イベントの「無料参加枠」の維持",
    "イベント会場費",
    "子ども向け企画の材料費",
    "学生メンバーの交通費",
    "オンライン配信費",
  ],
} as const;

export type SupportAmount = {
  amount: string;
  /** 説明文。未設定の項目はページに出さない（内容が決まり次第追加する） */
  description?: string;
};

export const SUPPORT_AMOUNTS: SupportAmount[] = [
  // 内容が決まり次第 description を入れると表示される
  { amount: "500円" },
  { amount: "1,000円" },
  { amount: "3,000円で…", description: "子ども企画1回分の材料費に" },
  { amount: "5,000円で…", description: "対話イベントの会場費の一部に" },
  { amount: "毎月のご支援で…", description: "団体の継続した運営の基盤に" },
];

/** 表示対象（description があるものだけ） */
export const SUPPORT_AMOUNTS_VISIBLE = SUPPORT_AMOUNTS.filter(
  (item): item is SupportAmount & { description: string } =>
    Boolean(item.description),
);

export const SUPPORT_CLOSING =
  "応援してくださる一人ひとりが、場づくりのメンバーです。\nご寄付という形で、弱さや痛みを受容できる社会をともにつくりませんか。";
