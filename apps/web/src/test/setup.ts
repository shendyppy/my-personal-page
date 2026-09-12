import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";

// jsdom ships no matchMedia, and gsap.registerPlugin reaches for it at module
// load. Without this, importing anything that pulls in ScrollTrigger throws
// "_win.matchMedia is not a function" and chapter components can only be
// tested behind a mocked ChapterFrame. Nothing matches by default, so
// gsap.matchMedia registers its queries and runs neither branch: the chapter
// renders its real server shell with no pin and no timeline.
if (!window.matchMedia) {
  window.matchMedia = (query: string) =>
    ({
      media: query,
      matches: false,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: () => false,
    }) as unknown as MediaQueryList;
}

afterEach(() => {
  cleanup();
});
