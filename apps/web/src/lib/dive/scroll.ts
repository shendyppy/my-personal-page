import type { ChapterId } from "@/constants/dive";

type To = (id: ChapterId) => void;
let impl: To = () => {};

/** DiveShell installs the Lenis implementation; everything else just calls scroller.to(). */
export const scroller = {
  install: (fn: To) => {
    impl = fn;
  },
  to: (id: ChapterId) => impl(id),
};
