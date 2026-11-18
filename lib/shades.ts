// Shutter shades geometry: the lens outline, where each slat meets it, and the wrap around the head.

type Pt = { x: number; y: number };

/** One lens, inner (nose) edge at x = 0, outer edge to the right. Units match the 2.2-tall bust. */
export const LENS: [number, number][] = [
  [0, 0.085], [0.15, 0.09], [0.265, 0.084], [0.305, 0.052], [0.302, 0], [0.272, -0.058],
  [0.205, -0.088], [0.11, -0.086], [0.05, -0.064], [0.022, -0.024], [0, 0.035],
];

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
