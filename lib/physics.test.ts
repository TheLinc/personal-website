import { test } from "node:test";
import assert from "node:assert/strict";
import { settled, step, type Body } from "./physics.ts";

const W = 1000;
const H = 600;
const R = 28;

/** 24 icons launched from both bottom corners, like the skills section. */
function launched(): Body[] {
  return Array.from({ length: 24 }, (_, i) => ({
    x: i % 2 ? W - R : R,
    y: H - R,
    vx: (i % 2 ? -1 : 1) * (350 + i * 15),
    vy: -1400 - (i % 5) * 60,
    r: R,
    angle: 0,
    held: false,
    live: true,
    still: 0,
  }));
}

function runUntilSettled(bodies: Body[], maxSeconds = 12): number {
  let n = 0;
  for (; n < 120 * maxSeconds && !(n > 120 && settled(bodies)); n++) step(bodies, 1 / 120, W, H);
  return n / 120;
}

const maxOverlap = (bodies: Body[]) =>
  Math.max(...bodies.flatMap((a, i) => bodies.slice(i + 1).map((b) => a.r + b.r - Math.hypot(a.x - b.x, a.y - b.y))));

test("launched icons settle into a pile inside the box without sinking into each other", () => {
  const bodies = launched();
  runUntilSettled(bodies);
  assert.ok(settled(bodies), "pile settles");
  assert.ok(bodies.every((b) => b.x >= R - 0.5 && b.x <= W - R + 0.5 && b.y <= H - R + 0.5), "stays in bounds");
  assert.ok(maxOverlap(bodies) < 4, `overlap ${maxOverlap(bodies).toFixed(2)}px`);
});

test("a thrown icon wakes the pile and it settles again", () => {
  const bodies = launched();
  runUntilSettled(bodies);
  Object.assign(bodies[0], { vx: 2500, vy: -500, still: 0 });
  runUntilSettled(bodies);
  assert.ok(settled(bodies));
  assert.ok(bodies.every((b) => Number.isFinite(b.x) && Number.isFinite(b.y)));
});

test("a held icon is not pulled by gravity", () => {
  const b: Body = { x: 500, y: 100, vx: 0, vy: 0, r: R, angle: 0, held: true, live: true, still: 0 };
  for (let i = 0; i < 120; i++) step([b], 1 / 120, W, H);
  assert.equal(b.y, 100);
  assert.equal(settled([b]), false, "the loop keeps running while something is held");
});
