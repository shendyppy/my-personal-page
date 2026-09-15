/**
 * Canvas pixels the dive scene may fill, about a 2560x1440 screen's worth.
 * The water is a full-screen fragment shader, so its cost is per pixel: a
 * 1920x1080 TV at 2x would be 8.3M of them.
 */
export const MAX_PIXELS = 2560 * 1440;
/** Past 2x the extra sharpness is invisible at arm's length and costs 2.25x the pixels. */
export const MAX_DPR = 2;

/**
 * The canvas pixel ratio for a device: its own ratio, up to `ceiling` and
 * within the pixel budget, never under 1. The old fixed 1x on touch devices
 * stretched the scene 3x on a phone and 2x on a Nest Hub, so the sub went
 * soft and jagged next to crisp HTML type.
 */
export const resolutionFor = (deviceRatio: number, width: number, height: number, ceiling = MAX_DPR) =>
  Math.max(1, Math.min(deviceRatio, ceiling, Math.sqrt(MAX_PIXELS / Math.max(1, width * height))));
