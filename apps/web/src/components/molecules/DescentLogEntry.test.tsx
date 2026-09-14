import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { DescentLogEntry } from "@/components/molecules/DescentLogEntry";
import type { ExperienceDto } from "@/server/queries/experiences";

const experience = (over: Partial<ExperienceDto> = {}): ExperienceDto => ({
  id: "e1",
  company: "PT. Daya Dimensi Indonesia (DDI)",
  companyLogo: "/assets/img/content/ddi-logo.webp",
  title: "Front End Developer",
  location: "Jakarta, Indonesia - Remote",
  period: "February 2022 - Present",
  current: false,
  description: "Human resources consultant.",
  responsibilities: [],
  projects: [],
  techStack: "React.js",
  employmentType: "Full Time",
  isPublished: true,
  order: 1,
  ...over,
});

const entry = (container: HTMLElement) => container.querySelector("li")!;

describe("DescentLogEntry", () => {
  test("renders period, role, company, description and employment type", () => {
    render(<DescentLogEntry experience={experience()} index={0} side="left" />);
    expect(screen.getByText("February 2022 - Present")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 3 })).toHaveTextContent("Front End Developer");
    expect(screen.getByText("PT. Daya Dimensi Indonesia (DDI)")).toBeInTheDocument();
    expect(screen.getByText("Human resources consultant.")).toBeInTheDocument();
    expect(screen.getByText("Full Time")).toBeInTheDocument();
  });

  test("binds to its beat and side, which the timeline and layout key off", () => {
    const { container } = render(<DescentLogEntry experience={experience()} index={2} side="right" />);
    expect(entry(container)).toHaveAttribute("data-beat", "2");
    expect(entry(container)).toHaveClass("log-entry", "log-entry--right");
  });

  test("the period is accent only for the current role", () => {
    const { rerender } = render(
      <DescentLogEntry experience={experience({ current: true })} index={0} side="left" />
    );
    expect(screen.getByText("February 2022 - Present")).toHaveClass("text-accent");
    rerender(<DescentLogEntry experience={experience({ current: false })} index={0} side="left" />);
    expect(screen.getByText("February 2022 - Present")).not.toHaveClass("text-accent");
  });
});
