export type Arrival = "wait" | "finish" | "agent" | "fade";

/**
 * What the page build does with an element: `top` is its distance from the top of the viewport,
 * `open` how many agent jobs are still unclaimed.
 */
export function arrival(top: number, h: number, vh: number, open: number): Arrival {
  if (top >= vh * 0.98) return "wait";
  // Above the screen on load (a #link or a restored scroll): nobody saw it, so it costs no agent job.
  if (top + h <= 0) return "finish";
  return open > 0 ? "agent" : "fade";
}
