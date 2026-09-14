/**
 * `count` xyz points spread uniformly through a box centred on `offset`, from
 * a seeded mulberry32 stream. Deterministic, so particle fields are pure to
 * build during render and identical across re-mounts.
 */
export const scatter = (
  count: number,
  size: [number, number, number],
  offset: [number, number, number] = [0, 0, 0],
  seed = 1
) => {
  let a = seed >>> 0;
  const rand = () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const out = new Float32Array(count * 3);
  for (let i = 0; i < out.length; i += 1) out[i] = (rand() - 0.5) * size[i % 3] + offset[i % 3];
  return out;
};
