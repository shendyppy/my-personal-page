import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { ReefChapter } from "@/components/sections/dive/ReefChapter";
import type { ProjectListItem } from "@/server/queries/projects";

const project = (slug: string, title: string): ProjectListItem => ({
  id: slug,
  slug,
  title,
  description: `${title} description`,
  image: `/assets/img/content/${slug}.webp`,
  year: "2025",
  tags: ["React"],
});

const three = [
  project("ddi", "Daya Dimensi Indonesia"),
  project("nabunk", "Nabunk"),
  project("uob", "UOB Infinity"),
];

describe("ReefChapter", () => {
  test("renders the real chapter shell with its section id and beat count", () => {
    const { container } = render(<ReefChapter projects={three} beats={3} />);
    const section = container.querySelector("section");
    expect(section).toHaveAttribute("id", "dive-reef");
    expect(section).toHaveAttribute("data-chapter", "reef");
    expect(section).toHaveStyle({ "--beats": "3" });
    expect(section?.querySelector("[data-stage]")).not.toBeNull();
  });

  test("the beat count comes from the prop, not from the chapter constant", () => {
    const { container } = render(<ReefChapter projects={three.slice(0, 2)} beats={2} />);
    expect(container.querySelector("section")).toHaveStyle({ "--beats": "2" });
  });

  test("renders one dive site per project, numbered from one in order", () => {
    const { container } = render(<ReefChapter projects={three} beats={3} />);
    const sites = container.querySelectorAll(".site");
    expect(sites).toHaveLength(3);
    expect([...sites].map((s) => s.getAttribute("data-beat"))).toEqual(["0", "1", "2"]);
    expect([...sites].map((s) => s.querySelector(".text-accent")?.textContent)).toEqual([
      "SITE-01",
      "SITE-02",
      "SITE-03",
    ]);
    expect(screen.getByRole("heading", { name: "Daya Dimensi Indonesia" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "UOB Infinity" })).toBeInTheDocument();
  });

  test("renders the reef chapter head", () => {
    const { container } = render(<ReefChapter projects={three} beats={3} />);
    expect(container.querySelector(".chapter-head")?.textContent).toBe("02 · WORKDIVE SITES");
  });

  test("renders the stack but no sites when there are no projects", () => {
    const { container } = render(<ReefChapter projects={[]} beats={1} />);
    expect(container.querySelector(".reef-stack")).not.toBeNull();
    expect(container.querySelectorAll(".site")).toHaveLength(0);
  });
});
