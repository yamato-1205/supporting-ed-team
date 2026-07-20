import bubble1 from "../assets/bubbles/bubble-1.png";
import bubble2 from "../assets/bubbles/bubble-2.png";
import bubble3 from "../assets/bubbles/bubble-3.png";
import bubble4 from "../assets/bubbles/bubble-4.png";

export { bubble1, bubble2, bubble3, bubble4 };

/**
 * セクション装飾用シャボン玉のプリセット。
 * SectionBubbles + このデータで position/opacity を集約する。
 */
export const BUBBLE_DECORATIONS = {
  activity: [
    { src: bubble1, class: "-left-10 top-[15%] w-32 md:w-48 opacity-70" },
    { src: bubble3, class: "-left-6 top-[55%] w-20 md:w-32 opacity-60" },
    { src: bubble2, class: "-right-10 top-[25%] w-36 md:w-52 opacity-65" },
    { src: bubble4, class: "-right-6 top-[65%] w-24 md:w-36 opacity-55" },
  ],
  representative: [
    { src: bubble1, class: "-left-10 top-[10%] w-32 md:w-52 opacity-70" },
    { src: bubble3, class: "-left-6 top-[60%] w-20 md:w-36 opacity-60" },
    { src: bubble2, class: "-right-8 top-[20%] w-28 md:w-44 opacity-65" },
    { src: bubble4, class: "-right-6 top-[65%] w-24 md:w-40 opacity-55" },
  ],
  news: [
    {
      src: bubble2,
      class: "-left-8 top-1/2 -translate-y-1/2 w-24 md:w-36 opacity-60",
    },
    { src: bubble4, class: "-right-6 top-1/3 w-20 md:w-32 opacity-55" },
  ],
  results: [
    { src: bubble1, class: "-left-10 top-[20%] w-28 md:w-44 opacity-65" },
    { src: bubble4, class: "-right-8 top-[50%] w-24 md:w-40 opacity-55" },
  ],
} as const satisfies Record<string, { src: ImageMetadata; class: string }[]>;

export type BubbleDecorationVariant = keyof typeof BUBBLE_DECORATIONS;
