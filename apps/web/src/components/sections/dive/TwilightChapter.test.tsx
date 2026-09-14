import { render, screen, within } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { TwilightChapter } from "@/components/sections/dive/TwilightChapter";
import { SITE_CONFIG } from "@/constants/config";
import type { AboutBundle, AboutSectionDto, TechStackDto } from "@/server/queries/about";

const aboutSection = (key: string, content: string): AboutSectionDto => ({
  id: key,
  key,
  title: null,
  content,
});

const techStack = (name: string, order: number): TechStackDto => ({
  id: name,
  name,
  src: `/assets/img/content/${name.toLowerCase()}.webp`,
  order,
});

const bundle = (over: Partial<AboutBundle> = {}): AboutBundle => ({
  aboutSections: [],
  cvInfo: null,
  techStacks: [],
  ...over,
});

/** The value rendered on the record row whose label is `label`. */
const valueFor = (container: HTMLElement, label: string) => {
  const row = within(container).getByText(label).closest(".record-row");
  if (!row) throw new Error(`no .record-row for ${label}`);
  return row.querySelector("dd")?.textContent;
};

const lead = (container: HTMLElement) => container.querySelector(".twilight-lead")?.textContent;
const bodies = (container: HTMLElement) =>
  [...container.querySelectorAll(".twilight-body")].map((p) => p.textContent);

describe("TwilightChapter", () => {
  test("renders the real chapter shell with its section id and beat count", () => {
    const { container } = render(<TwilightChapter about={bundle()} />);
    const section = container.querySelector("section");
    expect(section).toHaveAttribute("id", "dive-twilight");
    expect(section).toHaveAttribute("data-chapter", "twilight");
    expect(section).toHaveStyle({ "--beats": "1.5" });
    expect(section?.querySelector("[data-stage]")).not.toBeNull();
  });

  test("renders the twilight chapter head", () => {
    const { container } = render(<TwilightChapter about={bundle()} />);
    expect(container.querySelector(".chapter-head")?.textContent).toBe("03 · ABOUTDIVER RECORD");
  });

  test("the bio splits on the first sentence boundary: lead, then body copy", () => {
    const { container } = render(
      <TwilightChapter
        about={bundle({
          aboutSections: [
            aboutSection("professional_bio", "I began as a civil engineer. Then curiosity won."),
          ],
        })}
      />
    );
    expect(lead(container)).toBe("I began as a civil engineer.");
    expect(bodies(container)).toEqual(["Then curiosity won."]);
  });

  test("only the first boundary splits — later sentences stay in the body copy", () => {
    const { container } = render(
      <TwilightChapter
        about={bundle({
          aboutSections: [aboutSection("professional_bio", "One. Two. Three.")],
        })}
      />
    );
    expect(lead(container)).toBe("One.");
    expect(bodies(container)).toEqual(["Two. Three."]);
  });

  test("a bio with no sentence boundary is all lead, with no empty second paragraph", () => {
    const { container } = render(
      <TwilightChapter
        about={bundle({
          aboutSections: [aboutSection("professional_bio", "One sentence, no boundary")],
        })}
      />
    );
    expect(lead(container)).toBe("One sentence, no boundary");
    expect(bodies(container)).toEqual([]);
  });

  test("a missing professional_bio renders an empty lead rather than throwing", () => {
    const { container } = render(<TwilightChapter about={bundle()} />);
    expect(lead(container)).toBe("");
    expect(bodies(container)).toEqual([]);
  });

  test("current_learning renders as the learning line when present", () => {
    const { container } = render(
      <TwilightChapter
        about={bundle({
          aboutSections: [
            aboutSection("professional_bio", "Lead. Body."),
            aboutSection("current_learning", "Nest.js and CI/CD"),
          ],
        })}
      />
    );
    expect(bodies(container)).toEqual(["Body."]);
    const [line, echo] = container.querySelectorAll(".twilight-learning p");
    expect(line.textContent).toBe("CURRENTLY LEARNING — Nest.js and CI/CD");
    expect(line.querySelector("span")).toHaveClass("text-accent");
    // The teleprompter's loop copy is decoration: screen readers hear it once.
    expect(echo).toHaveAttribute("aria-hidden");
    expect(echo.textContent).toBe(line.textContent);
  });

  test("the whole learning line is absent when current_learning is missing", () => {
    const { container } = render(
      <TwilightChapter
        about={bundle({ aboutSections: [aboutSection("professional_bio", "Lead. Body.")] })}
      />
    );
    expect(bodies(container)).toEqual(["Body."]);
    expect(screen.queryByText(/CURRENTLY LEARNING/)).not.toBeInTheDocument();
  });

  test("INSTRUMENTS joins the first six tech stacks and drops the rest", () => {
    const names = ["React", "TypeScript", "JavaScript", "Redux", "Axios", "Jest", "NodeJS", "NestJS"];
    const { container } = render(
      <TwilightChapter about={bundle({ techStacks: names.map(techStack) })} />
    );
    expect(valueFor(container, "INSTRUMENTS")).toBe(
      "React · TypeScript · JavaScript · Redux · Axios · Jest"
    );
    expect(screen.queryByText(/NodeJS/)).not.toBeInTheDocument();
    expect(screen.queryByText(/NestJS/)).not.toBeInTheDocument();
  });

  test("INSTRUMENTS is empty rather than broken when there are no tech stacks", () => {
    const { container } = render(<TwilightChapter about={bundle()} />);
    expect(valueFor(container, "INSTRUMENTS")).toBe("");
  });

  test("DIVER, ROLE, FOCUS and BASE come from the site config and DIVE_COPY", () => {
    const { container } = render(<TwilightChapter about={bundle()} />);
    expect(valueFor(container, "DIVER")).toBe(SITE_CONFIG.author);
    expect(valueFor(container, "ROLE")).toBe("Software Engineer");
    expect(valueFor(container, "FOCUS")).toBe("Front-end · Full-stack · 3D web");
    expect(valueFor(container, "BASE")).toBe("Tangerang Selatan, ID");
  });

  test("the portrait sits in the porthole with the author's name as its alt text", () => {
    const { container } = render(<TwilightChapter about={bundle()} />);
    const portrait = screen.getByRole("img", { name: SITE_CONFIG.author });
    expect(container.querySelector(".porthole")).toContainElement(portrait);
  });

  test("every animated element carries data-reveal, which the twilight timeline drives", () => {
    const { container } = render(
      <TwilightChapter
        about={bundle({
          aboutSections: [
            aboutSection("professional_bio", "Lead. Body."),
            aboutSection("current_learning", "Nest.js"),
          ],
          techStacks: [techStack("React", 1)],
        })}
      />
    );
    // head, lead, body, learning, porthole, record panel
    expect(container.querySelectorAll("[data-reveal]")).toHaveLength(6);
  });
});
