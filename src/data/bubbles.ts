import bubble1 from "../assets/bubbles/bubble-1.png";
import bubble2 from "../assets/bubbles/bubble-2.png";
import bubble3 from "../assets/bubbles/bubble-3.png";
import bubble4 from "../assets/bubbles/bubble-4.png";

export { bubble1, bubble2, bubble3, bubble4 };

export type BubbleBgItem = { src: ImageMetadata; class: string };

/**
 * ページ背景のシャボン玉。
 * 縦が短いページ（404 など）は sparse を使い、窮屈にならないようにする。
 */
export const BACKGROUND_BUBBLES = {
  /** TOP・コンテンツが長いページ向け（上下に分散） */
  default: [
    { src: bubble1, class: "w-28 md:w-40 opacity-70 top-[2%] left-[-4%]" },
    { src: bubble3, class: "w-16 md:w-24 opacity-55 top-[14%] left-[2%]" },
    { src: bubble2, class: "w-32 md:w-48 opacity-65 top-[3%] right-[-5%]" },
    { src: bubble4, class: "w-20 md:w-28 opacity-50 top-[16%] right-[1%]" },
    { src: bubble4, class: "w-36 md:w-52 opacity-60 top-[36%] left-[-6%]" },
    { src: bubble1, class: "w-14 md:w-20 opacity-50 top-[50%] left-[3%]" },
    { src: bubble3, class: "w-28 md:w-40 opacity-60 top-[40%] right-[-4%]" },
    { src: bubble2, class: "w-16 md:w-22 opacity-50 top-[54%] right-[2%]" },
    { src: bubble2, class: "w-36 md:w-52 opacity-60 top-[70%] left-[-6%]" },
    { src: bubble4, class: "w-16 md:w-24 opacity-50 top-[82%] left-[2%]" },
    { src: bubble1, class: "w-28 md:w-44 opacity-60 top-[73%] right-[-4%]" },
    { src: bubble3, class: "w-14 md:w-20 opacity-50 top-[87%] right-[2%]" },
  ],
  /** 縦が短いページ向け（数は少なめ・上下左右に均等配置） */
  sparse: [
    { src: bubble1, class: "w-24 md:w-32 opacity-50 top-[18%] left-[-3%]" },
    { src: bubble2, class: "w-28 md:w-36 opacity-45 top-[28%] right-[-4%]" },
    { src: bubble3, class: "w-20 md:w-28 opacity-45 top-[62%] left-[-2%]" },
    { src: bubble4, class: "w-24 md:w-32 opacity-50 top-[72%] right-[-3%]" },
  ],
} as const satisfies Record<string, BubbleBgItem[]>;

export type BubbleBackgroundDensity = keyof typeof BACKGROUND_BUBBLES;

/**
 * セクション装飾用シャボン玉のプリセット。
 * SectionBubbles + このデータで position/opacity を集約する。
 */
export const BUBBLE_DECORATIONS = {
  activity: [
    { src: bubble1, class: "-left-10 top-[15%] z-0 w-32 md:w-48 opacity-70" },
    { src: bubble3, class: "-left-6 top-[55%] z-0 w-20 md:w-32 opacity-60" },
    { src: bubble2, class: "-right-10 top-[25%] z-0 w-36 md:w-52 opacity-65" },
    { src: bubble4, class: "-right-6 bottom-[8%] z-0 w-24 md:w-36 opacity-55" },
  ],
  representative: [
    { src: bubble1, class: "-left-10 top-[8%] z-0 w-32 md:w-52 opacity-70" },
    { src: bubble3, class: "-left-6 top-[60%] z-0 w-20 md:w-36 opacity-60" },
    { src: bubble2, class: "-right-8 top-[12%] z-0 w-28 md:w-44 opacity-65" },
    { src: bubble4, class: "-right-6 top-[65%] z-0 w-24 md:w-40 opacity-55" },
  ],
  news: [
    {
      src: bubble2,
      class: "-left-8 top-[42%] z-0 w-24 md:w-36 opacity-60",
    },
    { src: bubble4, class: "-right-6 top-1/3 z-0 w-20 md:w-32 opacity-55" },
  ],
  results: [
    { src: bubble1, class: "-left-10 top-[20%] z-0 w-28 md:w-44 opacity-65" },
    { src: bubble4, class: "-right-8 top-[50%] z-0 w-24 md:w-40 opacity-55" },
  ],
  sns: [
    { src: bubble3, class: "-left-8 top-[30%] z-0 w-24 md:w-36 opacity-60" },
    { src: bubble2, class: "-right-8 top-[45%] z-0 w-28 md:w-40 opacity-55" },
  ],
} as const satisfies Record<string, { src: ImageMetadata; class: string }[]>;

export type BubbleDecorationVariant = keyof typeof BUBBLE_DECORATIONS;
