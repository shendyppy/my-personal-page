import { render } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { DescentChapter } from "@/components/sections/dive/DescentChapter";
import type { ExperienceDto } from "@/server/queries/experiences";

const experience = (id: string): ExperienceDto => ({
  id,
  company: `Company ${id}`,
  companyLogo: "",
  title: `Role ${id}`,
  location: "",
  period: "2022 - Present",
  current: false,
  description: "",
  responsibilities: [],
  projects: [],
  techStack: "",
  employmentType: "Full Time",
  isPublished: true,
  order: 1,
});

const renderChapter = (n: number, depth = { start: 1650, end: 2420 }) =>
  render(
    <DescentChapter
      experiences={Array.from({ length: n }, (_, i) => experience(`e${i}`))}
      beats={Math.max(1, n)}
      depth={depth}
    />
  ).container;

const ticks = (c: HTMLElement) => [...c.querySelectorAll<HTMLElement>("[data-depth-tick]")];

describe("DescentChapter", () => {
  test("renders the real chapter shell with its section id and data-driven beats", () => {
    const section = renderChapter(3).querySelector("section");
    expect(section).toHaveAttribute("id", "dive-descent");
    expect(section).toHaveAttribute("data-chapter", "descent");
    expect(section).toHaveStyle({ "--beats": "3" });
  });

  test("renders the descent chapter head", () => {
    expect(renderChapter(1).querySelector(".chapter-head")?.textContent).toBe("04 · CAREERDESCENT LOG");
  });

  test("one log entry per experience, beats in order, sides alternating from the left", () => {
    const entries = [...renderChapter(3).querySelectorAll(".log-entry")];
    expect(entries.map((e) => e.getAttribute("data-beat"))).toEqual(["0", "1", "2"]);
    expect(entries.map((e) => e.classList.contains("log-entry--left"))).toEqual([true, false, true]);
  });

  test("the pressure line carries exactly one depth marker", () => {
    const c = renderChapter(2);
    expect(c.querySelectorAll(".pressure-line [data-depth-marker]")).toHaveLength(1);
  });

  test("ticks fall on every 200 m inside the chapter's depth range", () => {
    const c = renderChapter(2, { start: 1650, end: 2420 });
    expect(ticks(c).map((t) => t.textContent)).toEqual(["1800 M", "2000 M", "2200 M", "2400 M"]);
  });

  test("each tick sits at its depth's share of the line, where the marker passes it", () => {
    const c = renderChapter(2, { start: 1600, end: 2400 });
    expect(ticks(c).map((t) => t.style.top)).toEqual(["0%", "25%", "50%", "75%", "100%"]);
  });
});
