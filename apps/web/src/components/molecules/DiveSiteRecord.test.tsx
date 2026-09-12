import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { DiveSiteRecord } from "@/components/molecules/DiveSiteRecord";
import type { ProjectListItem } from "@/server/queries/projects";

const project = (over: Partial<ProjectListItem> = {}): ProjectListItem => ({
  id: "p1",
  slug: "uob-infinity",
  title: "UOB Infinity - Banking Platform",
  description: "A cross-border banking platform shipped to four markets.",
  image: "/assets/img/content/bg-uob-infinity.webp",
  year: "2021—25",
  tags: ["React", "Banking", "Jest"],
  ...over,
});

describe("DiveSiteRecord", () => {
  test("zero-pads the site index", () => {
    render(<DiveSiteRecord project={project()} index={3} />);
    expect(screen.getByText("SITE-03")).toBeInTheDocument();
  });

  test("does not pad an index that is already two digits", () => {
    render(<DiveSiteRecord project={project()} index={12} />);
    expect(screen.getByText("SITE-12")).toBeInTheDocument();
  });

  test("renders the title, the description and one chip per tag", () => {
    const { container } = render(
      <DiveSiteRecord project={project({ tags: ["React", "Banking", "Jest"] })} index={1} />
    );
    expect(screen.getByRole("heading", { level: 3 })).toHaveTextContent(
      "UOB Infinity - Banking Platform"
    );
    expect(
      screen.getByText("A cross-border banking platform shipped to four markets.")
    ).toBeInTheDocument();
    const chips = container.querySelectorAll("li");
    expect(chips).toHaveLength(3);
    expect([...chips].map((c) => c.textContent)).toEqual(["React", "Banking", "Jest"]);
  });

  test("renders the year when present", () => {
    render(<DiveSiteRecord project={project({ year: "2021—25" })} index={1} />);
    expect(screen.getByText("2021—25")).toBeInTheDocument();
  });

  test("omits the year element entirely when year is null", () => {
    const { container } = render(<DiveSiteRecord project={project({ year: null })} index={1} />);
    // The header holds the site code plus the year; with no year there must be
    // no second span at all, not merely an empty one.
    const header = container.querySelector("[data-site-record] > div");
    expect(header?.children).toHaveLength(1);
    expect(header?.textContent).toBe("SITE-01");
  });

  test("renders no tag list at all when tags is empty", () => {
    const { container } = render(<DiveSiteRecord project={project({ tags: [] })} index={1} />);
    expect(container.querySelector("ul")).toBeNull();
    expect(container.querySelectorAll("li")).toHaveLength(0);
  });

  test("the OPEN SITE LOG link points at the project page", () => {
    render(<DiveSiteRecord project={project({ slug: "nabunk" })} index={1} />);
    expect(screen.getByRole("link", { name: /OPEN SITE LOG/ })).toHaveAttribute(
      "href",
      "/projects/nabunk"
    );
  });

  test("the image uses the project title as its alt text", () => {
    render(<DiveSiteRecord project={project()} index={1} />);
    expect(screen.getByRole("img", { name: "UOB Infinity - Banking Platform" })).toBeInTheDocument();
  });

  test("the wrapper carries data-beat equal to index - 1", () => {
    const { container } = render(<DiveSiteRecord project={project()} index={4} />);
    const wrapper = container.querySelector(".site");
    expect(wrapper).toHaveAttribute("data-beat", "3");
    // The timeline hooks hang off this wrapper; both must be inside it.
    expect(wrapper?.querySelector("[data-site-record]")).not.toBeNull();
    expect(wrapper?.querySelector("[data-site-image]")).not.toBeNull();
  });
});
