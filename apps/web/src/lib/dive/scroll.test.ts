import { describe, expect, test, vi } from "vitest";
import { scroller } from "@/lib/dive/scroll";

describe("scroller", () => {
  test("to() before any install is a no-op and does not throw", () => {
    expect(() => scroller.to("reef")).not.toThrow();
  });

  test("after install(fn), to(id) calls fn exactly once with id", () => {
    const fn = vi.fn();
    scroller.install(fn);
    scroller.to("reef");
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith("reef");
  });

  test("a second install replaces the first implementation", () => {
    const first = vi.fn();
    const second = vi.fn();
    scroller.install(first);
    scroller.install(second);
    scroller.to("seafloor");
    expect(second).toHaveBeenCalledTimes(1);
    expect(second).toHaveBeenCalledWith("seafloor");
    expect(first).not.toHaveBeenCalled();
  });
});
