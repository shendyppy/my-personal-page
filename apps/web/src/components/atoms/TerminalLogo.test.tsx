import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { TerminalLogo } from "@/components/atoms/TerminalLogo";

describe("TerminalLogo", () => {
  test("renders the wordmark as a link to home by default", () => {
    render(<TerminalLogo />);
    const link = screen.getByRole("link", { name: /shendy/i });
    expect(link).toHaveAttribute("href", "/");
  });

  test("honours a custom href", () => {
    render(<TerminalLogo href="/projects/foo" />);
    expect(screen.getByRole("link", { name: /shendy/i })).toHaveAttribute("href", "/projects/foo");
  });
});
