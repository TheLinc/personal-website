// Shutter shades geometry: the lens outline, where each slat meets it, and the wrap around the head.

type Pt = { x: number; y: number };

/** Leftmost and rightmost crossing of the horizontal line at `y` with a closed polygon, or null. */
export function rowExtent(poly: Pt[], y: number): [number, number] | null {
  const xs: number[] = [];
  for (let i = 0; i < poly.length; i++) {
    const a = poly[i];
    const b = poly[(i + 1) % poly.length];
    if ((a.y - y) * (b.y - y) < 0) xs.push(a.x + ((y - a.y) * (b.x - a.x)) / (b.y - a.y));
  }
  if (xs.length < 2) return null;
  return [Math.min(...xs), Math.max(...xs)];
}

/** Wrap a flat point (x across, z depth) around a cylinder of radius R so the frame follows the face. */
export function bendPoint(x: number, z: number, R: number): [number, number] {
  const a = x / R;
  return [(R + z) * Math.sin(a), (R + z) * Math.cos(a) - R];
}

/** Closed Catmull-Rom curve through the control points, sampled densely so bending stays smooth. */
function closedSpline(ctrl: [number, number][], per = 10): Pt[] {
  const n = ctrl.length, out: Pt[] = [];
  for (let i = 0; i < n; i++) {
    const [p0, p1, p2, p3] = [ctrl[(i - 1 + n) % n], ctrl[i], ctrl[(i + 1) % n], ctrl[(i + 2) % n]];
    for (let s = 0; s < per; s++) {
      const t = s / per, t2 = t * t, t3 = t2 * t;
      const f = (a: number, b: number, c: number, d: number) => 0.5 * (2 * b + (-a + c) * t + (2 * a - 5 * b + 4 * c - d) * t2 + (-a + 3 * b - 3 * c + d) * t3);
      out.push({ x: f(p0[0], p1[0], p2[0], p3[0]), y: f(p0[1], p1[1], p2[1], p3[1]) });
    }
  }
  return out;
}

const mirror = (pts: [number, number][]) => pts.map(([x, y]) => [-x, y] as [number, number]).reverse();

// Right half of the front, clockwise from the top centre: straight brow bar, rounded outer end, then a lens
// bottom that sweeps lowest toward the nose (aviator taper), up the inner edge to a wide nose arch.
const RIGHT_HALF: [number, number][] = [
  [0.12, 0.105], [0.25, 0.105], [0.33, 0.103], [0.357, 0.09], [0.368, 0.06], [0.366, 0.0], [0.348, -0.048], [0.312, -0.088],
  [0.258, -0.114], [0.2, -0.127], [0.14, -0.132], [0.088, -0.122], [0.058, -0.094], [0.044, -0.054], [0.036, -0.014], [0.022, 0.006],
];

/** The whole front of the shades as one closed outline (both lenses and the bridge). */
export function frontOutline(): Pt[] {
  return closedSpline([[0, 0.105], ...RIGHT_HALF, [0, 0.013], ...mirror(RIGHT_HALF)]);
}

/** The open area inside one lens frame (sx = 1 right, -1 left), where the slats sit. */
export function lensOpening(sx: 1 | -1): Pt[] {
  // Thick brow bar on top (~0.043), rim ~0.026 around the sides and bottom.
  const right: [number, number][] = [
    [0.066, 0.062], [0.2, 0.062], [0.303, 0.06], [0.329, 0.046], [0.339, 0.018], [0.335, -0.022], [0.316, -0.06], [0.284, -0.084],
    [0.236, -0.098], [0.175, -0.106], [0.12, -0.104], [0.09, -0.088], [0.072, -0.055], [0.066, -0.01],
  ];
  return closedSpline(sx === 1 ? right : mirror(right));
}

export type Bar = { x0: number; x1: number; y0: number; y1: number };

/** The horizontal slats across one opening: gaps are `gap`× a slat's height, a gap first under the brow bar,
 *  and each slat runs `embed` into the frame on both ends so it reads as one moulded piece. */
export function slatBars(opening: Pt[], slats: number, gap = 0.9, embed = 0.008): Bar[] {
  // Use the usable height (where the opening is reasonably wide), not tiny spline bumps at the very top/bottom.
  const ys = opening.map((p) => p.y);
  const width = (y: number) => { const e = rowExtent(opening, y); return e ? e[1] - e[0] : 0; };
  let maxW = 0;
  for (let y = Math.min(...ys); y < Math.max(...ys); y += 0.001) maxW = Math.max(maxW, width(y));
  let top = Math.max(...ys), bottom = Math.min(...ys);
  while (top > bottom && width(top) < 0.6 * maxW) top -= 0.001;
  while (bottom < top && width(bottom) < 0.35 * maxW) bottom += 0.001;
  const bar = (top - bottom) / (slats + gap * (slats + 1));
  const bars: Bar[] = [];
  for (let k = 0; k < slats; k++) {
    const y1 = top - gap * bar * (k + 1) - bar * k, y0 = y1 - bar;
    const a = rowExtent(opening, y1), b = rowExtent(opening, y0);
    if (!a || !b) continue;
    bars.push({ x0: Math.min(a[0], b[0]) - embed, x1: Math.max(a[1], b[1]) + embed, y0, y1 });
  }
  return bars;
}

/** How far to move the glasses forward (negative: back) so their nearest point clears the face by `clearance`. */
export function restOffset(samples: { gz: number; fz: number | null }[], clearance: number): number {
  const need = samples.filter((s) => s.fz !== null).map((s) => (s.fz as number) + clearance - s.gz);
  return need.length ? Math.max(...need) : 0;
}

/** Even-odd point-in-polygon test. */
export function insidePoly(pt: Pt, poly: Pt[]): boolean {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const a = poly[i], b = poly[j];
    if (a.y > pt.y !== b.y > pt.y && pt.x < ((b.x - a.x) * (pt.y - a.y)) / (b.y - a.y) + a.x) inside = !inside;
  }
  return inside;
}
