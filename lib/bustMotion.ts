// How the hero bust moves: scroll turns it to face you, the mouse swings it side to side,
// and hovering the head floats "thought" spheres out of it.

export const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
export const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

export const scrollProgress = (scrollY: number, span = 520) => clamp01(scrollY / span);

/** One frame of a smoothed follow: closes `k` of the gap each frame. */
export const approach = (cur: number, target: number, k: number) => cur + (target - cur) * k;

/** Y rotation: turned toward the name at the top of the page, facing forward after 40% of the scroll, plus the mouse swing. */
export const yaw = (p: number, mx: number) => -0.55 * (1 - easeOut(clamp01(p / 0.4))) + mx * 0.32;

/** The pointer is on the head (face included) when it hits the bust above the chin (rig-local units, bust is 2.2 tall). */
export const isHead = (localY: number, chin = 0.12) => localY > chin;

/** Draw rank for each bubble from its view-space depth (more negative = farther): farthest draws first. */
export function drawOrder(depths: number[]): number[] {
  const rank = new Array<number>(depths.length);
  depths.map((d, i) => [d, i] as const).sort((a, b) => a[0] - b[0]).forEach(([, i], r) => (rank[i] = r));
  return rank;
}

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

/** Touch and pen pointers are scrolling the page, not steering the bust. */
export const followsPointer = (pointerType: string) => pointerType === "mouse";

/** A client point in normalized device coordinates (-1..1, y up) against the canvas box as it is now. */
export function toNdc(clientX: number, clientY: number, box: { left: number; top: number; width: number; height: number }): [number, number] {
  return [((clientX - box.left) / box.width) * 2 - 1, -((clientY - box.top) / box.height) * 2 + 1];
}

type Look = { x: number; y: number; yaw: number };
/** The triangle hit test is costly; redo it only when the pointer moved or the bust turned noticeably. */
export const needsRaycast = (last: Look, now: Look) =>
  last.x !== now.x || last.y !== now.y || Math.abs(last.yaw - now.yaw) > 1e-3;

/** Nothing on screen will change next frame: scroll turn and mouse swing have caught up, and the bubbles are
 *  tucked away (while out they bob every frame). Lets the scene stop drawing until something moves. */
export const isSettled = (s: { p: number; pTo: number; mx: number; mxTo: number; hover: number; over: number }) =>
  !s.over && s.hover < 1e-3 && Math.abs(s.p - s.pTo) < 1e-4 && Math.abs(s.mx - s.mxTo) < 1e-4;
