import { expect, test } from "vitest";
import { earliestYear } from "./career";

test("picks the smallest 4-digit year found in any period string", () => {
  expect(earliestYear(["Jan 2024 – Present", "Mar 2021 – Dec 2023", "2022"])).toBe(2021);
});
test("returns null when no year is present", () => {
  expect(earliestYear(["n/a"])).toBeNull();
});
