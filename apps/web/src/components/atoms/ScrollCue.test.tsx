import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, test, vi } from "vitest";
import { ScrollCue } from "@/components/atoms/ScrollCue";
import { scroller } from "@/lib/dive/scroll";

// scroller is a module singleton, so a spy installed by one test outlives a
// failing assertion. Restore it unconditionally.
afterEach(() => scroller.install(() => {}));

describe("ScrollCue", () => {
  test('renders a button whose accessible name contains "SCROLL TO DIVE"', () => {
    render(<ScrollCue />);
    expect(screen.getByRole("button", { name: /scroll to dive/i })).toBeInTheDocument();
  });

  test('clicking it calls the installed scroller implementation exactly once with "reef"', () => {
    const spy = vi.fn();
    scroller.install(spy);
    render(<ScrollCue />);
    fireEvent.click(screen.getByRole("button", { name: /scroll to dive/i }));
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith("reef");
  });
});
