export type Arrival = "wait" | "finish" | "agent" | "fade";

/**
 * What the page build does with an element: `top` is its distance from the top of the viewport,
 * `open` how many agent jobs are still unclaimed.
 */
export function arrival(top: number, h: number, vh: number, open: number, scrolling: boolean): Arrival {
  if (top >= vh * 0.98) return "wait";
  // Already above the screen (a #link, a restored scroll, a fast jump): nobody saw it, so it costs no agent job.
  if (top + h <= 0) return "finish";
  if (open <= 0) return "fade";
  // A #link scrolls smoothly past whole sections; agents go to whatever is on screen once the page stops.
  return scrolling ? "wait" : "agent";
}
