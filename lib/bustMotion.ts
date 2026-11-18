// How the hero bust moves: scroll turns it to face you, the mouse swings it side to side,
// and hovering the top of the head floats "thought" spheres out of it.

export const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
export const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

export const scrollProgress = (scrollY: number, span = 520) => clamp01(scrollY / span);

/** One frame of a smoothed follow: closes `k` of the gap each frame. */
export const approach = (cur: number, target: number, k: number) => cur + (target - cur) * k;

/** Y rotation: turned toward the name at the top of the page, facing forward after 40% of the scroll, plus the mouse swing. */
export const yaw = (p: number, mx: number) => -0.55 * (1 - easeOut(clamp01(p / 0.4))) + mx * 0.32;

/** The pointer is on the "brain" when it hits the bust above this height (rig-local units, bust is 2.2 tall). */
export const isBrain = (localY: number, threshold = 0.58) => localY > threshold;

/** Where thought sphere `i` sits: tucked in the head at rest, eased out to its slot (staggered) and bobbing when hovered. */
export function thoughtPos(slot: [number, number, number], hoverT: number, i: number, t: number) {
  const e = easeOut(clamp01(hoverT * 1.6 - i * 0.1));
  const ph = i * 1.7;
  return {
    x: slot[0] * e + Math.sin(t * 0.9 + ph) * 0.025,
    y: 0.62 + (slot[1] - 0.62) * e + Math.sin(t * 1.3 + ph) * 0.03,
    z: slot[2] * e,
    s: e,
  };
}
