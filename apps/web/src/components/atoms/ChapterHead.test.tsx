import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { ChapterHead } from "@/components/atoms/ChapterHead";

describe("ChapterHead", () => {
  test("zero-pads the index to two digits", () => {
    render(<ChapterHead index={2} category="WORK" label="DIVE SITES" />);
    expect(screen.getByText(/02 · WORK/)).toBeInTheDocument();
  });

  test("renders the category and label text", () => {
    render(<ChapterHead index={0} category="HERO" label="DEEP FIELD" />);
    expect(screen.getByText(/HERO/)).toBeInTheDocument();
    expect(screen.getByText("DEEP FIELD")).toBeInTheDocument();
  });

  test("carries data-reveal", () => {
    const { container } = render(<ChapterHead index={0} category="HERO" label="DEEP FIELD" />);
    expect(container.querySelector("[data-reveal]")).not.toBeNull();
  });
});
