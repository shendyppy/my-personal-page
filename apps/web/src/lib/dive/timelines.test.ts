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
    // ScrollTrigger scrubs totalProgress, so this is half of what makes
    // `snapTo: 1 / beats` settle on a beat at all.
    const { tl } = build(4);
    for (let i = 0; i <= 4; i += 1) {
      tl.progress(i / 4);
      expect(tl.time()).toBeCloseTo(i, 5);
    }
  });

  test("exactly one site is on screen at every snap point", () => {
    // The other half, and the one that matters: landing on a beat must show a
    // site. Asserting tween start times cannot see this — a timeline whose
    // cross-fades are offset by one beat has identical start times and leaves
    // the stage blank at every point the user is snapped to.
    const n = 4;
    const { tl, sites } = build(n);
    const opacity = () => sites.map((s) => Number(gsap.getProperty(s, "opacity")));
    // From beat 1 up. Beat 0 is deliberately not asserted here: the builder
    // gives site 0 no entry tween, so at progress 0 its opacity comes from
    // `.site[data-beat="0"] { opacity: 1 }` in globals.css, which jsdom never
    // loads. Asserting it would pass on an unstyled default and stay green if
    // that rule were deleted.
    for (let i = 1; i < n; i += 1) {
      tl.progress(i / n);
      opacity().forEach((o, j) => {
        expect(o, `site ${j} at progress ${i}/${n}`).toBeCloseTo(j === i ? 1 : 0, 5);
      });
    }
  });

  test("the cross-fade between two beats never blanks the stage", () => {
    const n = 3;
    const { tl, sites } = build(n);
    // Walk the whole handover from beat 0 to beat 1 in small steps; the sum of
    // the two opacities must stay near 1 the whole way across.
    for (let t = 0.7; t <= 1.0001; t += 0.05) {
      tl.time(t);
      const sum = sites.reduce((a, s) => a + Number(gsap.getProperty(s, "opacity")), 0);
      expect(sum, `at t=${t.toFixed(2)}`).toBeGreaterThan(0.9);
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

  test("a middle site is fully in by its beat and exits late in it", () => {
    const { tl, sites } = build(3);
    const tweens = tweensFor(tl, sites[1]) as gsap.core.Tween[];
    expect(tweens.map((t) => [t.startTime(), t.vars.opacity])).toEqual([
      [0.7, 1],
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
    expect(tweens[0].startTime()).toBe(1.7);
  });

  test("a lone site neither enters nor exits, but still fills its beat", () => {
    const { tl, sites } = build(1);
    expect(tweensFor(tl, sites[0])).toHaveLength(0);
    expect(tl.duration()).toBe(1);
  });
});

/** A twilight stage with `n` `[data-reveal]` elements. */
const buildTwilight = (n: number) => {
  const section = document.createElement("section");
  section.innerHTML = Array.from({ length: n }, () => `<p data-reveal></p>`).join("");
  const tl = gsap.timeline({ paused: true, defaults: { ease: "none" } });
  TIMELINES.twilight(tl, gsap.utils.selector(section), section);
  return { tl, reveals: [...section.querySelectorAll<HTMLElement>("[data-reveal]")] };
};

const opacities = (els: HTMLElement[]) => els.map((e) => Number(gsap.getProperty(e, "opacity")));
const ys = (els: HTMLElement[]) => els.map((e) => Number(gsap.getProperty(e, "y")));

describe("TIMELINES.twilight", () => {
  test("spans exactly one unit, so its numbers read as chapter progress", () => {
    // Same reason as the reef spacer: ScrollTrigger scrubs totalProgress, so
    // only the timeline's own duration makes 0.8 mean "80% down the chapter".
    expect(buildTwilight(6).tl.duration()).toBe(1);
    expect(buildTwilight(1).tl.duration()).toBe(1);
  });

  test("the record is fully legible across the whole hold, not for one instant", () => {
    // The point of the chapter: a bio needs dwell, and twilight does not snap,
    // so the hold is all the reader gets. Tween start times cannot see this.
    const { tl, reveals } = buildTwilight(6);
    for (let p = 0.3; p <= 0.8001; p += 0.05) {
      tl.progress(p);
      opacities(reveals).forEach((o, i) => {
        expect(o, `reveal ${i} at ${p.toFixed(2)}`).toBeCloseTo(1, 5);
      });
      ys(reveals).forEach((y, i) => {
        expect(y, `reveal ${i} at ${p.toFixed(2)}`).toBeCloseTo(0, 5);
      });
    }
  });

  test("the reveal staggers in rather than arriving as one block", () => {
    const { tl, reveals } = buildTwilight(6);
    tl.progress(0.21);
    const o = opacities(reveals);
    expect(o[0]).toBeCloseTo(1, 5);
    expect(o[5]).toBeLessThan(1);
    expect(o[5]).toBeGreaterThan(0);
    // Monotonic: the first element is always at least as far along as the last.
    expect(o).toEqual([...o].sort((a, b) => b - a));
  });

  test("the reveals are held out at the chapter start and gone by its end", () => {
    const { tl, reveals } = buildTwilight(6);
    tl.progress(0.5); // scrub off 0 first so setting it back forces a render
    tl.progress(0);
    expect(opacities(reveals)).toEqual(Array(6).fill(0));
    expect(ys(reveals)).toEqual(Array(6).fill(32));
    tl.progress(1);
    expect(opacities(reveals)).toEqual(Array(6).fill(0));
    expect(ys(reveals)).toEqual(Array(6).fill(-24));
  });

  test("a chapter with a single reveal still holds it across the same window", () => {
    const { tl, reveals } = buildTwilight(1);
    tl.progress(0.2);
    expect(opacities(reveals)).toEqual([1]);
    tl.progress(0.8);
    expect(opacities(reveals)).toEqual([1]);
  });

  test("adds nothing at all when the stage has no reveals", () => {
    const { tl } = buildTwilight(0);
    expect(tl.getChildren()).toHaveLength(0);
    expect(tl.duration()).toBe(0);
  });
});
