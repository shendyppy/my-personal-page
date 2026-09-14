import { render, screen, within } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { CvRecord } from "@/components/molecules/CvRecord";

const cv = {
  title: "Curriculum Vitae",
  previewImage: "/assets/Screenshot_CV_Latest.webp",
  downloadPath: "/assets/CV_Shendy Putra Perdana Yohansah.pdf",
};

describe("CvRecord", () => {
  test("reads as a record: header code, file title and format rows", () => {
    const { container } = render(<CvRecord cv={cv} />);
    expect(container.querySelector(".record-head")).toHaveTextContent("CURRICULUM VITAE");
    expect(container.querySelector(".record-head")).toHaveTextContent("LATEST");
    const row = (label: string) => within(container).getByText(label).closest(".record-row")?.querySelector("dd");
    expect(row("FILE")).toHaveTextContent("Curriculum Vitae");
    expect(row("FORMAT")).toHaveTextContent("PDF · A4");
  });

  test("the download link points at the PDF and downloads it", () => {
    render(<CvRecord cv={cv} />);
    const link = screen.getByRole("link", { name: "Download CV" });
    expect(link).toHaveAttribute("href", cv.downloadPath);
    expect(link).toHaveAttribute("download");
  });

  test("the preview sits in the window short screens hide", () => {
    const { container } = render(<CvRecord cv={cv} />);
    expect(container.querySelector("[data-cv-preview] img")).toHaveAttribute("alt", "CV preview");
  });
});
