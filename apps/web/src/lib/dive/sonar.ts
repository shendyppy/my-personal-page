/** Evenly spaced blip on a ring, index 0 at 12 o'clock, clockwise. */
export function blipPosition(
  index: number,
  count: number,
  ringRadius: number,
  cx = 0,
  cy = 0
): { x: number; y: number; angle: number } {
  const angle = -90 + (360 / Math.max(1, count)) * index;
  const rad = (angle * Math.PI) / 180;
  return { x: cx + Math.cos(rad) * ringRadius, y: cy + Math.sin(rad) * ringRadius, angle };
}
