import { describe, expect, test } from "vitest";
import { CHAPTERS, CHAPTER_IDS, chapterById } from "@/constants/dive";

describe("CHAPTERS", () => {
  test("covers every chapter id in order, with index matching its position", () => {
    expect(CHAPTERS.map((c) => c.id)).toEqual([...CHAPTER_IDS]);
    CHAPTERS.forEach((c, i) => expect(c.index).toBe(i));
  });

  test("chapterById finds the entry by id, not by position", () => {
    expect(chapterById("midnight").name).toBe("MIDNIGHT");
  });
});
