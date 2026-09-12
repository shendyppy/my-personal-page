import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { RecordPanel } from "@/components/molecules/RecordPanel";

describe("RecordPanel", () => {
  test("renders the title and the code when given", () => {
    render(<RecordPanel title="DIVER IDENTIFICATION" code="ID-01" rows={[]} />);
    expect(screen.getByText("DIVER IDENTIFICATION")).toBeInTheDocument();
    expect(screen.getByText("ID-01")).toBeInTheDocument();
  });

  test("renders no code element when code is omitted", () => {
    render(<RecordPanel title="DIVER IDENTIFICATION" rows={[]} />);
    expect(screen.queryByText("ID-01")).not.toBeInTheDocument();
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
