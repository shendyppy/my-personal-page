import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { MidnightChapter } from "@/components/sections/dive/MidnightChapter";
import type { Skill, SkillCategory } from "@/types";

const skill = (name: string, category: SkillCategory): Skill => ({ name, level: 3, category, logo: "" });

describe("MidnightChapter", () => {
  test("renders the real chapter shell with its section id and beats", () => {
    const section = render(<MidnightChapter skills={[]} />).container.querySelector("section");
    expect(section).toHaveAttribute("id", "dive-midnight");
    expect(section).toHaveAttribute("data-chapter", "midnight");
    expect(section).toHaveStyle({ "--beats": "1.5" });
  });

  test("renders the midnight chapter head", () => {
    const { container } = render(<MidnightChapter skills={[]} />);
    expect(container.querySelector(".chapter-head")?.textContent).toBe("05 · TOOLBOXSONAR");
  });

  test("groups skills into blips in toolbox order, not DB order, dropping empty categories", () => {
    render(
      <MidnightChapter
        skills={[
          skill("Jira", "Project Management"),
          skill("Postgres", "Database"),
          skill("React", "Frontend"),
          skill("Claude", "AI"),
          skill("Vue", "Frontend"),
        ]}
      />
    );
    expect(screen.getAllByRole("button").map((b) => b.textContent)).toEqual([
      "Frontend",
      "Database",
      "AI & Productivity",
      "Project Management",
    ]);
  });
});
