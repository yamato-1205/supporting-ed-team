export type RecruitRow = {
  label: string;
  /** 改行は \n で表現（箇条書きも \n 区切り） */
  value: string;
};

export type RecruitTeam = {
  num: string;
  title: string;
  /** ロール背景（イベント/SNS/その他）と対応する配色キー */
  accent: "event" | "sns" | "other";
  rows: RecruitRow[];
};

export const RECRUIT_TEAMS: RecruitTeam[] = [
  {
    num: "①",
    title: "イベント",
    accent: "event",
    rows: [
      {
        label: "活動内容",
        value:
          "年10回程度、対面／オンラインでのイベントを開催しています。子供や留学生など、多様な交流イベントの企画をしています。",
      },
      { label: "活動場所", value: "対面、オンライン（discord）" },
      { label: "活動頻度", value: "月3回程度のMTG（1時間程度）＋週1時間程度の作業" },
      { label: "費用", value: "無料" },
      {
        label: "こんな人歓迎！",
        value: "ON/OFF大事にできる人（やるときはやる、遊ぶときは遊ぶ）",
      },
    ],
  },
  {
    num: "②",
    title: "SNS",
    accent: "sns",
    rows: [
      {
        label: "活動内容",
        value:
          "マーケティング・投稿内容提案・媒体選定・デザイン・戦略・イベントのチラシ作成などをしています。（SNSはまだ未整備のため0→1の経験ができます！）",
      },
      { label: "活動場所", value: "オンライン（discord）" },
      { label: "活動頻度", value: "月3回程度のMTG（1時間程度）＋週1時間程度の作業" },
      { label: "費用", value: "無料" },
      {
        label: "こんな人歓迎！",
        value:
          "・マーケや企画に興味があるが、いきなりガチで始めるというよりは、試してみたい人\n・SNSをゆるくやって、ゆくゆく副業とかに活かせる実績を作りたい人",
      },
    ],
  },
  {
    num: "③",
    title: "その他",
    accent: "other",
    rows: [
      {
        label: "活動内容",
        value:
          "経験してみたいこと、さぽちむがより良い団体となるために提案したいことなど、自分とチームの「やりたい」を実現しています。（例：HP制作/名刺づくり、さぽちむの運営など）",
      },
      { label: "活動場所", value: "オンライン（discord）" },
      { label: "活動頻度", value: "月3回程度のMTG（1時間程度）＋週1時間程度の作業" },
      { label: "費用", value: "無料" },
      {
        label: "こんな人歓迎！",
        value: "・何かおもしろいことがしたい人\n・やりたいことがある人\n・何か挑戦してみたい人",
      },
    ],
  },
];
