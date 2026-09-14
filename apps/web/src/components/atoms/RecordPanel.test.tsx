import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { RecordPanel } from "@/components/atoms/RecordPanel";

describe("RecordPanel", () => {
  test("renders the title and the code when given", () => {
    const { container } = render(
      <RecordPanel title="DIVER IDENTIFICATION" code="ID-01" rows={[]} />
    );
    expect(screen.getByText("DIVER IDENTIFICATION")).toBeInTheDocument();
    expect(screen.getByText("ID-01")).toBeInTheDocument();
    expect(container.querySelector(".record-head")?.children).toHaveLength(3);
  });

  test("renders no code element when code is omitted", () => {
    const { container } = render(<RecordPanel title="DIVER IDENTIFICATION" rows={[]} />);
    // The head holds title + rule + code; without a code there must be no
    // third child at all, not merely no "ID-01" text.
    expect(container.querySelector(".record-head")?.children).toHaveLength(2);
  });

  test("renders one dt/dd pair per row, in order, with the given labels and values", () => {
    const { container } = render(
      <RecordPanel
        title="DIVER IDENTIFICATION"
        rows={[
          { label: "SINCE", value: 2021 },
          { label: "BASE", value: "Tangerang Selatan, ID" },
        ]}
      />
    );
    const dts = container.querySelectorAll("dt");
    const dds = container.querySelectorAll("dd");
    expect(dts).toHaveLength(2);
    expect(dds).toHaveLength(2);
    expect(dts[0]).toHaveTextContent("SINCE");
    expect(dds[0]).toHaveTextContent("2021");
    expect(dts[1]).toHaveTextContent("BASE");
    expect(dds[1]).toHaveTextContent("Tangerang Selatan, ID");
  });

  test("accepts a ReactNode value", () => {
    render(
      <RecordPanel
        title="DIVER IDENTIFICATION"
        rows={[{ label: "TAGS", value: <span data-testid="x" /> }]}
      />
    );
    expect(screen.getByTestId("x")).toBeInTheDocument();
  });

  test("carries data-reveal on the root", () => {
    const { container } = render(<RecordPanel title="DIVER IDENTIFICATION" rows={[]} />);
    expect(container.querySelector("[data-reveal]")).not.toBeNull();
  });
});
