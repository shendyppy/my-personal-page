import { render, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, test, vi } from "vitest";
import { DiveShell } from "@/components/organisms/DiveShell";

// Lenis observes its wrapper's size; jsdom has no ResizeObserver.
vi.stubGlobal(
  "ResizeObserver",
  class {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
);

const shell = () =>
  render(
    <DiveShell beats={[1, 5, 1.5, 3, 1.5, 1]}>
      <main id="main-content" />
    </DiveShell>
  );

describe("DiveShell chapter hash", () => {
  afterEach(() => window.history.replaceState(null, "", "/"));

  test("consumes an entry hash (/#dive-reef) so it does not stick while diving", () => {
    window.history.replaceState({ keep: 1 }, "", "/?q=1#dive-reef");
    shell();
    expect(window.location.hash).toBe("");
    expect(window.location.search).toBe("?q=1");
    // The router's history state survives the rewrite.
    expect(window.history.state).toEqual({ keep: 1 });
  });

  test("clears a chapter hash written later by an in-page anchor", async () => {
    shell();
    window.location.hash = "#dive-surface";
    await waitFor(() => expect(window.location.hash).toBe(""));
  });

  test("leaves unrelated hashes alone", async () => {
    shell();
    window.location.hash = "#main-content";
    await new Promise((r) => setTimeout(r, 20));
    expect(window.location.hash).toBe("#main-content");
  });
});
