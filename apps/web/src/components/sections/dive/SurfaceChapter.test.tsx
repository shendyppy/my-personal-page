import { render, screen, within } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { SurfaceChapter } from "@/components/sections/dive/SurfaceChapter";
import type { ExperienceDto } from "@/server/queries/experiences";

const experience = (period: string): ExperienceDto => ({
  id: period,
  company: "Acme",
  companyLogo: "",
  title: "Engineer",
  location: "Remote",
  period,
  current: false,
  description: "",
  responsibilities: [],
  projects: [],
  techStack: "",
  employmentType: "Full-time",
  isPublished: true,
  order: 0,
});

/** The value rendered on the record row whose label is `label`. */
const valueFor = (container: HTMLElement, label: string) => {
  const row = within(container).getByText(label).closest(".record-row");
  if (!row) throw new Error(`no .record-row for ${label}`);
  return row.querySelector("dd")?.textContent;
};

describe("SurfaceChapter", () => {
  test("renders the H1 as static text with Software and Engineer", () => {
    render(<SurfaceChapter projectCount={5} experiences={[]} />);
    const h1 = screen.getByRole("heading", { level: 1 });
    expect(h1).toHaveTextContent("Software");
    expect(h1).toHaveTextContent("Engineer");
  });

  test("the H1 carries data-hero-title, which the surface timeline scrubs", () => {
    const { container } = render(<SurfaceChapter projectCount={5} experiences={[]} />);
    expect(container.querySelector("[data-hero-title]")).toBe(
      screen.getByRole("heading", { level: 1 })
    );
  });

  test("renders the real chapter shell with its section id and beat count", () => {
    const { container } = render(<SurfaceChapter projectCount={5} experiences={[]} />);
    const section = container.querySelector("section");
    expect(section).toHaveAttribute("id", "dive-surface");
    expect(section).toHaveAttribute("data-chapter", "surface");
    expect(section).toHaveStyle({ "--beats": "1" });
    expect(section?.querySelector("[data-stage]")).not.toBeNull();
  });

  test("SINCE and EXPERIENCE are derived from the earliest year across experience periods", () => {
    const { container } = render(
      <SurfaceChapter
        projectCount={5}
        experiences={[experience("Mar 2021 – Dec 2023"), experience("Jan 2024 – Present")]}
      />
    );
    const years = new Date().getFullYear() - 2021;
    expect(valueFor(container, "SINCE")).toBe("2021");
    expect(valueFor(container, "EXPERIENCE")).toBe(`${years}+ yrs`);
  });

  test("DIVE SITES shows the passed projectCount", () => {
    const { container } = render(<SurfaceChapter projectCount={5} experiences={[]} />);
    expect(valueFor(container, "DIVE SITES")).toBe("5");
  });

  test("PATH and BASE come from DIVE_COPY", () => {
    const { container } = render(<SurfaceChapter projectCount={5} experiences={[]} />);
    expect(valueFor(container, "PATH")).toBe("Front-end → Full-stack");
    expect(valueFor(container, "BASE")).toBe("Tangerang Selatan, ID");
  });

  test("with an empty experiences array, SINCE and EXPERIENCE fall back to an em-dash, never NaN", () => {
    const { container } = render(<SurfaceChapter projectCount={5} experiences={[]} />);
    expect(screen.queryByText(/NaN/)).not.toBeInTheDocument();
    expect(valueFor(container, "SINCE")).toBe("—");
    expect(valueFor(container, "EXPERIENCE")).toBe("—");
  });
});
