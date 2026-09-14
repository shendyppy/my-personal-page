import { fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, test, vi } from "vitest";
import { DiveHud } from "@/components/organisms/DiveHud";
import { CHAPTERS } from "@/constants/dive";
import { dive } from "@/lib/dive/depth";
import { scroller } from "@/lib/dive/scroll";

const beats = CHAPTERS.map((c) => c.beats);

// The store is module-level and outlives any single test, and `dive.set()`
// early-returns when the progress is unchanged (no notification). Every test
// below seeds a *different* progress than the previous test left behind, and
// always seeds before render() — so the initial render reads the right state
// via dive.get() regardless of whether a notification fires.
describe("DiveHud", () => {
  afterEach(() => {
    dive.configure(beats);
    dive.set(0);
    scroller.install(() => {});
  });

  test('mode="dive" renders the depth zero-padded to four digits', () => {
    dive.configure(beats);
    dive.set(0.25); // 45% through the reef's 5..50 m band
    render(<DiveHud mode="dive" />);
    expect(screen.getByText("0025 m")).toBeInTheDocument();
  });

  test('mode="dive" renders a "Chapters" nav with six buttons, exactly one aria-current', () => {
    dive.configure(beats);
    dive.set(0.3);
    render(<DiveHud mode="dive" />);

    const nav = screen.getByRole("navigation", { name: "Chapters" });
    const buttons = within(nav).getAllByRole("button");
    expect(buttons).toHaveLength(6);

    const activeButtons = buttons.filter((b) => b.getAttribute("aria-current") === "true");
    expect(activeButtons).toHaveLength(1);

    const currentChapter = CHAPTERS.find((c) => c.id === dive.get().chapter)!;
    expect(within(activeButtons[0]).getByText(currentChapter.name)).toBeInTheDocument();
  });

  test("clicking a rail button calls the installed scroller implementation with that chapter id", () => {
    dive.configure(beats);
    dive.set(0.6);
    const spy = vi.fn();
    scroller.install(spy);
    render(<DiveHud mode="dive" />);

    const nav = screen.getByRole("navigation", { name: "Chapters" });
    const buttons = within(nav).getAllByRole("button");
    const seafloorButton = buttons[CHAPTERS.findIndex((c) => c.id === "seafloor")];

    fireEvent.click(seafloorButton);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith("seafloor");
  });

  test('mode="surface" renders the BACK TO DIVE link and no nav or depth readout', () => {
    dive.configure(beats);
    dive.set(0.8);
    render(<DiveHud mode="surface" />);

    const link = screen.getByRole("link", { name: /back to dive/i });
    expect(link).toHaveAttribute("href", "/#dive-reef");
    expect(screen.queryByRole("navigation")).not.toBeInTheDocument();
    expect(screen.queryByText(/^\d{4} m$/)).not.toBeInTheDocument();
  });
});
