// Tiny circle physics: gravity, bounce, stacking and grab-and-throw. No dependencies.
// ponytail: O(n²) pair checks, fine for ~25 bodies; use a spatial grid past ~200.

export type Body = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  angle: number;
  held: boolean;
  live: boolean; // launched yet
  still: number; // frames spent nearly motionless; asleep past SLEEP_FRAMES
};

export const GRAVITY = 2200; // px/s²
const RESTITUTION = 0.35;
const FRICTION = 0.9;
const ITERATIONS = 5;
const CONTACT_FRICTION = 0.25;
const SLEEP_SPEED = 14;
const SLEEP_FRAMES = 60;
const WAKE_IMPULSE = 60;

const asleep = (b: Body) => b.still > SLEEP_FRAMES;

/** Advance the world by dt seconds inside a box of width w; floor at h, no ceiling. */
export function step(bodies: Body[], dt: number, w: number, h: number) {
  for (const b of bodies) {
    if (!b.live || b.held || asleep(b)) continue;
    b.vy += GRAVITY * dt;
    b.vx *= 0.999;
    b.x += b.vx * dt;
    b.y += b.vy * dt;
    b.angle += (b.vx * dt) / b.r;
  }

  for (let it = 0; it < ITERATIONS; it++) {
    for (let i = 0; i < bodies.length; i++) {
      const a = bodies[i];
      if (!a.live) continue;
      for (let j = i + 1; j < bodies.length; j++) {
        const b = bodies[j];
        if (!b.live) continue;
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const min = a.r + b.r;
        const d2 = dx * dx + dy * dy;
        if (d2 >= min * min || d2 === 0) continue;
        const d = Math.sqrt(d2);
        const nx = dx / d;
        const ny = dy / d;
        const overlap = min - d;
        // A held body is immovable: it pushes, it doesn't get pushed.
        const wa = a.held || asleep(a) ? (b.held || asleep(b) ? 0.5 : 0) : b.held || asleep(b) ? 1 : 0.5;
        const wb = 1 - wa;
        a.x -= nx * overlap * wa;
        a.y -= ny * overlap * wa;
        b.x += nx * overlap * wb;
        b.y += ny * overlap * wb;
        const rel = (b.vx - a.vx) * nx + (b.vy - a.vy) * ny;
        if (rel < 0) {
          const imp = -(1 + RESTITUTION) * rel;
          a.vx -= imp * nx * wa;
          a.vy -= imp * ny * wa;
          b.vx += imp * nx * wb;
          b.vy += imp * ny * wb;
          // Friction along the contact, so piles grip instead of sliding apart.
          const tx = -ny;
          const ty = nx;
          const relT = (b.vx - a.vx) * tx + (b.vy - a.vy) * ty;
          const f = relT * CONTACT_FRICTION;
          a.vx += f * tx * wa;
          a.vy += f * ty * wa;
          b.vx -= f * tx * wb;
          b.vy -= f * ty * wb;
          // A hard hit wakes sleeping bodies.
          if (imp > WAKE_IMPULSE) {
            a.still = 0;
            b.still = 0;
          }
        }
      }
    }
    for (const b of bodies) {
      if (!b.live || b.held || asleep(b)) continue;
      if (b.y + b.r > h) {
        b.y = h - b.r;
        if (b.vy > 0) b.vy = -b.vy * RESTITUTION;
        b.vx *= FRICTION;
        if (Math.abs(b.vy) < 30) b.vy = 0;
      }
      if (b.x - b.r < 0) {
        b.x = b.r;
        if (b.vx < 0) b.vx = -b.vx * RESTITUTION;
      }
      if (b.x + b.r > w) {
        b.x = w - b.r;
        if (b.vx > 0) b.vx = -b.vx * RESTITUTION;
      }
    }
  }

  for (const b of bodies) {
    if (!b.live || b.held) continue;
    if (Math.hypot(b.vx, b.vy) < SLEEP_SPEED) b.still++;
    else b.still = 0;
    if (asleep(b)) b.vx = b.vy = 0;
  }
}

/** Wake a body (and so let it fall again), e.g. when the one under it is grabbed. */
export function wakeAll(bodies: Body[]) {
  for (const b of bodies) b.still = 0;
}

/** True when every launched body is asleep and nothing is held: stop the frame loop. */
export function settled(bodies: Body[]): boolean {
  return bodies.every((b) => !b.live || (!b.held && asleep(b)));
}
