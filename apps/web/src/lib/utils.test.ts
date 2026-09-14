import { describe, expect, test } from "vitest";
import { cn } from "@/lib/utils";

describe("cn", () => {
  test("joins truthy class names", () => {
    expect(cn("a", "b")).toBe("a b");
  });
  test("drops falsy values", () => {
    expect(cn("a", false, undefined, null, "b")).toBe("a b");
  });
  test("later tailwind utilities win over earlier conflicting ones", () => {
    expect(cn("px-2", "px-4")).toBe("px-4");
  });
});
