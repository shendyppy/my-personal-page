import { render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, test, vi } from "vitest";
import { SurfaceChapter } from "@/components/sections/dive/SurfaceChapter";
import type { ExperienceDto } from "@/server/queries/experiences";

// ChapterFrame mounts GSAP + ScrollTrigger via useGSAP, which calls
// window.matchMedia — jsdom doesn't implement it, so registerPlugin throws
// ("_win.matchMedia is not a function") before this component ever renders.
// Swap it for a plain wrapper so we can assert on SurfaceChapter's own output.
vi.mock("@/components/organisms/ChapterFrame", () => ({
  ChapterFrame: ({ children }: { children: ReactNode }) => <section>{children}</section>,
}));

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

describe("SurfaceChapter", () => {
  test("renders the H1 as static text with Software and Engineer", () => {
    render(<SurfaceChapter projectCount={5} experiences={[]} />);
    expect(screen.getByText("Software")).toBeInTheDocument();
    expect(screen.getByText(/Engineer/)).toBeInTheDocument();
  });

  test("SINCE and EXPERIENCE are derived from the earliest year across experience periods", () => {
    render(
      <SurfaceChapter
        projectCount={5}
        experiences={[experience("Mar 2021 – Dec 2023"), experience("Jan 2024 – Present")]}
      />
    );
    expect(screen.getByText("2021")).toBeInTheDocument();
    const years = new Date().getFullYear() - 2021;
    expect(screen.getByText(`${years}+ yrs`)).toBeInTheDocument();
  });

  test("DIVE SITES shows the passed projectCount", () => {
    render(<SurfaceChapter projectCount={5} experiences={[]} />);
    expect(screen.getByText("5")).toBeInTheDocument();
  });

  test("with an empty experiences array, SINCE renders the em-dash fallback, never NaN", () => {
    render(<SurfaceChapter projectCount={5} experiences={[]} />);
    expect(screen.queryByText("NaN")).not.toBeInTheDocument();
    expect(screen.getAllByText("—").length).toBeGreaterThan(0);
  });
});
