import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { SeafloorChapter } from "@/components/sections/dive/SeafloorChapter";
import { EXTERNAL_LINKS } from "@/constants/config";
import { DIVE_COPY } from "@/constants/dive";
import type { CvInfoDto } from "@/server/queries/about";

const cv: CvInfoDto = {
  id: "cv",
  title: "Curriculum Vitae",
  previewImage: "/assets/img/content/cv-preview.webp",
  downloadPath: "/cv.pdf",
};

describe("SeafloorChapter", () => {
  test("renders the real chapter shell with its section id and beats", () => {
    const section = render(<SeafloorChapter cv={null} />).container.querySelector("section");
    expect(section).toHaveAttribute("id", "dive-seafloor");
    expect(section).toHaveAttribute("data-chapter", "seafloor");
    expect(section).toHaveStyle({ "--beats": "1" });
  });

  test("renders the chapter head, headline and sub line", () => {
    const { container } = render(<SeafloorChapter cv={null} />);
    expect(container.querySelector(".chapter-head")?.textContent).toBe("06 · CONTACTSURFACE LINK");
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(DIVE_COPY.contactHeadline);
    expect(screen.getByText(DIVE_COPY.contactSub)).toBeInTheDocument();
  });

  test("four numbered channels link out; only the web ones open a new tab", () => {
    render(<SeafloorChapter cv={null} />);
    const link = (name: string) => screen.getByRole("link", { name: new RegExp(name) });
    expect(link("GITHUB")).toHaveAttribute("href", EXTERNAL_LINKS.github);
    expect(link("LINKEDIN")).toHaveAttribute("href", EXTERNAL_LINKS.linkedin);
    expect(link("CALENDLY")).toHaveAttribute("href", EXTERNAL_LINKS.calendly);
    expect(link("EMAIL")).toHaveAttribute("href", `mailto:${EXTERNAL_LINKS.email}`);
    expect(link("GITHUB")).toHaveAttribute("target", "_blank");
    expect(link("GITHUB")).toHaveAttribute("rel", "noopener noreferrer");
    expect(link("EMAIL")).not.toHaveAttribute("target");
    expect(screen.getByText("CH-01")).toBeInTheDocument();
    expect(screen.getByText("CH-04")).toBeInTheDocument();
  });

  test("the CV card renders only when there is a CV", () => {
    const { rerender } = render(<SeafloorChapter cv={null} />);
    expect(screen.queryByRole("link", { name: "Download CV" })).not.toBeInTheDocument();
    rerender(<SeafloorChapter cv={cv} />);
    expect(screen.getByRole("link", { name: "Download CV" })).toHaveAttribute("href", "/cv.pdf");
  });

  test("the footer carries the year, the author and a link back to the surface", () => {
    render(<SeafloorChapter cv={null} />);
    expect(screen.getByText(new RegExp(`© ${new Date().getFullYear()} SHENDY`))).toBeInTheDocument();
    expect(screen.getByRole("link", { name: DIVE_COPY.backToSurface })).toHaveAttribute("href", "#dive-surface");
    expect(screen.getByText(DIVE_COPY.dragCue)).toBeInTheDocument();
  });
});
