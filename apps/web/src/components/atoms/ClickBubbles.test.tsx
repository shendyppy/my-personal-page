import { fireEvent, render } from "@testing-library/react";
import { afterEach, describe, expect, test, vi } from "vitest";
import { ClickBubbles } from "@/components/atoms/ClickBubbles";

describe("ClickBubbles", () => {
  afterEach(() => vi.useRealTimers());

  test("a pointer click leaves a ring and bubbles at the pointer, cleared shortly after", () => {
    vi.useFakeTimers();
    render(<ClickBubbles />);
    fireEvent.click(document.body, { clientX: 120, clientY: 80, detail: 1 });
    const burst = document.querySelector<HTMLElement>(".click-burst")!;
    expect(burst.style.left).toBe("120px");
    expect(burst.style.top).toBe("80px");
    expect(burst.querySelectorAll(".click-ring")).toHaveLength(1);
    expect(burst.querySelectorAll(".click-bubble").length).toBeGreaterThan(0);
    vi.advanceTimersByTime(1400);
    expect(document.querySelector(".click-burst")).toBeNull();
  });

  test("a keyboard click (no pointer) makes no burst", () => {
    render(<ClickBubbles />);
    fireEvent.click(document.body, { detail: 0 });
    expect(document.querySelector(".click-burst")).toBeNull();
  });
});
