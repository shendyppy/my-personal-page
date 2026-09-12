import gsap from "gsap";
import { describe, expect, test } from "vitest";
import { TIMELINES } from "@/lib/dive/timelines";

/** A reef stage with `n` dive-site wrappers, matching DiveSiteRecord's markup. */
const stage = (n: number) => {
  const section = document.createElement("section");
  section.innerHTML = Array.from(
    { length: n },
    (_, i) =>
      `<div class="site" data-beat="${i}"><div data-site-record></div><div data-site-image></div></div>`
  ).join("");
  return section;
};

const build = (n: number) => {
  const section = stage(n);
  const tl = gsap.timeline({ paused: true, defaults: { ease: "none" } });
  TIMELINES.reef(tl, gsap.utils.selector(section), section);
  return { tl, sites: [...section.querySelectorAll<HTMLElement>("[data-beat]")] };
};

const tweensFor = (tl: gsap.core.Timeline, el: Element) =>
  tl.getChildren().filter((c) => (c as gsap.core.Tween).targets().includes(el));

describe("TIMELINES.reef", () => {
  test("stretches the timeline to one unit per site", () => {
    // The tweens alone only reach 2.3 for three sites; the spacer pulls the
    // timeline out to n so the beats line up with the snap increment.
    expect(build(3).tl.duration()).toBe(3);
    expect(build(5).tl.duration()).toBe(5);
  });

  test("beat boundaries land on the 1/n progress steps ChapterFrame snaps to", () => {
    // ScrollTrigger scrubs totalProgress, so this is the contract that makes
    // `snapTo: 1 / beats` settle on a site instead of mid-cross-fade.
    const { tl } = build(4);
    for (let i = 0; i <= 4; i += 1) {
      tl.progress(i / 4);
      expect(tl.time()).toBeCloseTo(i, 5);
    }
  });

  test("adds nothing at all when the stack is empty", () => {
    const { tl } = build(0);
    expect(tl.getChildren()).toHaveLength(0);
    expect(tl.duration()).toBe(0);
  });

  test("the first site only exits — it is already visible in server HTML", () => {
    const { tl, sites } = build(3);
    const tweens = tweensFor(tl, sites[0]) as gsap.core.Tween[];
    expect(tweens).toHaveLength(1);
    expect(tweens[0].vars.opacity).toBe(0);
    expect(tweens[0].startTime()).toBe(0.8);
  });

  test("a middle site fades in on its beat and back out late in it", () => {
    const { tl, sites } = build(3);
    const tweens = tweensFor(tl, sites[1]) as gsap.core.Tween[];
    expect(tweens.map((t) => [t.startTime(), t.vars.opacity])).toEqual([
      [1, 1],
      [1.8, 0],
    ]);
    const record = sites[1].querySelector("[data-site-record]")!;
    expect((tweensFor(tl, record) as gsap.core.Tween[]).map((t) => t.vars.y)).toEqual([0, -40]);
    const image = sites[1].querySelector("[data-site-image]")!;
    const imageTweens = tweensFor(tl, image) as gsap.core.Tween[];
    expect(imageTweens).toHaveLength(1);
    expect(imageTweens[0].vars.scale).toBe(1);
  });

  test("the last site only enters — nothing follows it to exit for", () => {
    const { tl, sites } = build(3);
    const tweens = tweensFor(tl, sites[2]) as gsap.core.Tween[];
    expect(tweens).toHaveLength(1);
    expect(tweens[0].vars.opacity).toBe(1);
    expect(tweens[0].startTime()).toBe(2);
  });

  test("a lone site neither enters nor exits, but still fills its beat", () => {
    const { tl, sites } = build(1);
    expect(tweensFor(tl, sites[0])).toHaveLength(0);
    expect(tl.duration()).toBe(1);
  });
});
