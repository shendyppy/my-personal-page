import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import type { ToolGroup } from "@/components/molecules/SonarReadout";
import { SonarChart } from "@/components/organisms/SonarChart";
import { DIVE_COPY } from "@/constants/dive";

const groups: ToolGroup[] = [
  {
    category: "Frontend",
    label: "Frontend",
    tools: [
      { name: "React", level: 5, category: "Frontend", logo: "/assets/img/content/react.webp" },
      { name: "Claude", level: 5, category: "Frontend", logo: "https://cdn.simpleicons.org/claude" },
    ],
  },
  {
    category: "AI",
    label: "AI & Productivity",
    tools: [{ name: "Cursor", level: 4, category: "AI", logo: "" }],
  },
];

const blip = (name: string) => screen.getByRole("button", { name });
/** A mouse hover. */
const hover = (el: HTMLElement) => fireEvent.mouseEnter(el);
const readout = (c: HTMLElement) => c.querySelector<HTMLElement>(".sonar-readout")!;

describe("SonarChart", () => {
  test("one blip per group, labelled by the group's display label", () => {
    render(<SonarChart groups={groups} />);
    expect(screen.getAllByRole("button").map((b) => b.textContent)).toEqual(["Frontend", "AI & Productivity"]);
  });

  test("the readout idles with the prompt and announces politely", () => {
    const { container } = render(<SonarChart groups={groups} />);
    expect(readout(container)).toHaveAttribute("aria-live", "polite");
    expect(readout(container)).toHaveTextContent(DIVE_COPY.sonarIdle);
  });

  test("hovering a blip reads out its category, class and every tool", () => {
    const { container } = render(<SonarChart groups={groups} />);
    hover(blip("AI & Productivity"));
    const panel = within(readout(container));
    expect(panel.getByText("AI")).toBeInTheDocument();
    expect(panel.getByText("AI & Productivity")).toBeInTheDocument();
    expect(panel.getByText("Cursor")).toBeInTheDocument();
    expect(blip("AI & Productivity")).toHaveAttribute("aria-pressed", "true");
    expect(blip("Frontend")).toHaveAttribute("aria-pressed", "false");
  });

  test("focus selects a blip too, so the chart works from the keyboard", () => {
    const { container } = render(<SonarChart groups={groups} />);
    fireEvent.focus(blip("Frontend"));
    expect(within(readout(container)).getByText("React")).toBeInTheDocument();
  });

  test("clicking selects, and clicking the active blip again keeps it selected", () => {
    const { container } = render(<SonarChart groups={groups} />);
    fireEvent.click(blip("Frontend"));
    fireEvent.click(blip("Frontend"));
    expect(blip("Frontend")).toHaveAttribute("aria-pressed", "true");
    expect(within(readout(container)).getByText("React")).toBeInTheDocument();
  });

  test("tool logos render when present and are skipped when empty", () => {
    const { container } = render(<SonarChart groups={groups} />);
    hover(blip("Frontend"));
    const imgs = [...readout(container).querySelectorAll("img")];
    expect(imgs).toHaveLength(2);
    expect(imgs.some((i) => i.getAttribute("src") === "https://cdn.simpleicons.org/claude")).toBe(true);
    hover(blip("AI & Productivity"));
    expect(readout(container).querySelectorAll("img")).toHaveLength(0);
  });

  test("a tap selects the blip even though focus and mouseenter land before its click", () => {
    // On the page a tap fires pointerenter, pointerdown (which focuses the
    // button), mouseenter, then click. A toggling click cleared what the focus
    // and mouseenter had just selected.
    const { container } = render(<SonarChart groups={groups} />);
    fireEvent.focus(blip("Frontend"));
    fireEvent.mouseEnter(blip("Frontend"));
    fireEvent.click(blip("Frontend"));
    expect(blip("Frontend")).toHaveAttribute("aria-pressed", "true");
    expect(within(readout(container)).getByText("React")).toBeInTheDocument();
  });

  test("each label hangs off the outer side of its dot, so inner-ring neighbours never collide", () => {
    render(<SonarChart groups={[...groups, { ...groups[1], category: "DevOps", label: "DevOps" }]} />);
    // Three contacts: 12 o'clock, then 4 and 8 o'clock.
    expect(blip("Frontend")).toHaveClass("blip--center");
    expect(blip("AI & Productivity")).toHaveClass("blip--right");
    expect(blip("DevOps")).toHaveClass("blip--left");
  });
});
