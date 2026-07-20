/**
 * トップページのテキスト・画像コンテンツ（唯一の定義元）。
 * 文言を変えるときはこのファイルだけ編集すれば OK。
 */
import activityEventImg from "../assets/sections/activity-event.jpg";
import activityCommunityImg from "../assets/sections/activity-community.jpg";
import heroCloudImg from "../assets/sections/hero-cloud.png";
import heroBubblesImg from "../assets/bubbles/hero-bubbles.png";
import representativeImg from "../assets/members/fuuka.png";

export const HERO = {
  cloudImg: heroCloudImg,
  bubblesImg: heroBubblesImg,
  cloudAlt: "誰もが福祉の一員である",
  /** SP（横書き）用。配列の各要素が1行 */
  lines: [
    "誰もが、誰かの幸せを、",
    "気づかないうちに紡いでいる。",
    "そんな幸せの営み＝「福祉」を、",
    "みんなの暮らしの中で表現します。",
  ],
  /** PC（縦書き）用。配列の各要素が1カラム */
  verticalColumns: [
    "誰もが、誰かの幸せを、気づかないうちに紡いでいる。",
    "そんな幸せの営み＝「福祉」を、みんなの暮らしの中で表現します。",
  ],
} as const;

export const MEMBER_RECRUIT_CTA = {
  title: "新規メンバー募集",
  headline: "おもしろそう、やってみたい…\nやっちゃおう！",
  body: "本気で遊びながらイベントを作るチームに参加してみませんか？",
  buttonLabel: "詳しく見る",
  href: "/member",
  images: [
    { src: activityCommunityImg, alt: "コミュニティの様子" },
    { src: activityEventImg, alt: "イベントの様子" },
  ],
} as const;

export type ActivityItem = {
  id: string;
  title: string;
  image: ImageMetadata;
  alt: string;
  /** 改行は \n */
  body: string;
};

export const ACTIVITY_ITEMS: ActivityItem[] = [
  {
    id: "event",
    title: "イベント",
    image: activityEventImg,
    alt: "イベントの様子",
    body: [
      "福祉の団体なのに、福祉っぽくない。",
      "「おもしろそう」から始まる、福祉の入り口をイベントで表現しています。",
      "担い手は大学生をメインに、サークルや企業とコラボしながら活動中です。",
      "活動拠点は大阪府吹田市を中心に、2026年は兵庫県伊丹市、大阪府大阪市などにも拠点を広げていく予定です。",
      "子ども向けのイベントが多いですが、参加するメンバーの関心に合わせてイベントを計画します。",
      "当日運営以外の企画はオンラインなので、全国各地から参加可能。",
      "福祉に関わるオンラインイベントも多数実施してきています。",
      "0→1がやりたい人、当日参加のみなど、関わり方も柔軟に。",
      "ガチだけでは終わらない経験をともに！",
    ].join("\n"),
  },
  {
    id: "community",
    title: "コミュニティ",
    image: activityCommunityImg,
    alt: "コミュニティの様子",
    body: [
      "障害や病に関係なく、誰もが抱える人生の凸凹をともに過ごすコミュニティを醸成中！",
      "働き方や生き方を考えたり、頑張れない時間を頑張らずに過ごす方法を考えたり。",
      "とにかく自分の幸せ＝福祉を考えるコミュニティです。",
      "2026年度は、他団体とのコラボの中で、私たち「さぽちむ」というコミュニティは何かを探索する一年にします！",
      "凸凹を抱える私たちはマイノリティ。",
      "だからこそ、オンラインで広く繋がり、モデルロールやニッチな相談ができる場所。",
      "オフラインの場でも他団体とのコラボという形で、直接的な支援ができる体制を目指します。",
    ].join("\n"),
  },
];

export const REPRESENTATIVE = {
  image: representativeImg,
  imageAlt: "代表ふうか",
  nameLabel: "代表：ふうか",
  intro: [
    "社会に貢献したい意思があるけど、急にしんどくなる時がある。",
    "自分でもどうにも頑張れない時期＝障害が現れるときは、誰にでもある。",
    "さぽちむは、そんな「誰もが抱える/抱えうる痛みや弱さを認め合い、支え合う社会」を目指します。",
  ].join("\n"),
  folds: [
    {
      title: "凸凹をもったままで、社会に貢献したい",
      body: [
        "自分自身にはどうにもならない特性や環境、病を抱える人は、意外と多く存在しています。",
        "私自身も、鬱や発達傾向を持ちながら、パラレルワーカーや社会人大学院生など、面白い生き方をしています！",
        "ひとりひとりの状態に合わせ、スピードもタスクも柔軟に変化させ、チームで補う体制を表現する。",
        "そして、凸凹を抱えている人でも社会に貢献する方法があることを実験し続け、証明します。",
      ].join("\n"),
    },
    {
      title: "頑張るとき、休むときの居場所をつなぐ",
      body: [
        "頑張りすぎて、疲れちゃう人。頑張りたいのに、頑張れるチャンスがない人。",
        "そんなメンバーに、多様な働き方や社会貢献の姿を表現することで、ひとりひとりの幸せをじっくり考え、選び、悩み、深化する過程を応援し合うコミュニティをデザインします。",
        "たくさんの団体とコラボすることで、さぽちむ自体をハブとして、自分に合った居場所に、できるだけたくさん出会うことを目指します。",
      ].join("\n"),
    },
  ],
} as const;
