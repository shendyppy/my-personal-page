import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { LogDetail } from "@/components/molecules/LogDetail";

const experience = {
  title: "Front End Developer",
  company: "PT. Daya Dimensi Indonesia (DDI)",
  location: "Jakarta, Indonesia - Remote",
  projects: ["EnGauge – Assessment Platform", "Learning Hub – Learning Platform"],
  responsibilities: ["Built 80+ features."],
  techStack: "React.js, Redux , Axios",
};

describe("LogDetail", () => {
  test("the toggle counts the projects", () => {
    render(<LogDetail experience={experience} />);
    expect(screen.getByRole("button", { name: /2 PROJECTS · STACK/ })).toHaveAttribute("aria-expanded", "false");
  });

  test("clicking opens the full log as a dialog, and Escape or the close button shuts it", () => {
    render(<LogDetail experience={experience} />);
    fireEvent.click(screen.getByRole("button", { name: /PROJECTS/ }));
    const dialog = screen.getByRole("dialog", { name: /Front End Developer/ });
    expect(within(dialog).getByText("Built 80+ features.")).toBeInTheDocument();
    fireEvent.keyDown(window, { key: "Escape" });
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /PROJECTS/ }));
    fireEvent.click(within(screen.getByRole("dialog")).getByRole("button", { name: "Close" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  test("an experience with no projects still opens its log", () => {
    render(<LogDetail experience={{ ...experience, projects: [] }} />);
    expect(screen.getByRole("button", { name: /OPEN LOG/ })).toBeInTheDocument();
  });
});
