import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { useWibClock } from "@/hooks/useWibClock";

describe("useWibClock", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-09-11T09:22:56Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  test("returns a non-empty string ending in WIB immediately after mount", () => {
    const { result } = renderHook(() => useWibClock());
    expect(result.current).not.toBe("");
    expect(result.current.endsWith(" WIB")).toBe(true);
  });

  test("formats the seeded UTC instant as Asia/Jakarta time", () => {
    const { result } = renderHook(() => useWibClock());
    expect(result.current).toBe("16:22:56 WIB");
  });

  test("advancing timers by 1000ms updates the clock", () => {
    const { result } = renderHook(() => useWibClock());
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(result.current).toBe("16:22:57 WIB");
  });

  test("unmounting clears the interval", () => {
    const { unmount } = renderHook(() => useWibClock());
    unmount();
    expect(vi.getTimerCount()).toBe(0);
  });
});
