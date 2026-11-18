import { test } from "node:test";
import assert from "node:assert/strict";
import { isBrain, scrollProgress, thoughtPos, yaw } from "./bustMotion.ts";

test("yaw: turned toward the name at the top, facing forward after 40% of the scroll", () => {
  assert.equal(yaw(0, 0), -0.55);
  assert.equal(yaw(1, 0), 0);
  assert.ok(Math.abs(yaw(0.4, 0.5) - 0.16) < 1e-9);
});

test("scrollProgress clamps to 0..1 over 520px", () => {
  assert.equal(scrollProgress(-10), 0);
  assert.ok(Math.abs(scrollProgress(260) - 0.5) < 1e-9);
  assert.equal(scrollProgress(9999), 1);
});

test("isBrain: only the top of the head", () => {
  assert.equal(isBrain(0.7), true);
  assert.equal(isBrain(0.5), false);
});

test("thoughtPos: hidden inside the head at rest, out at its slot when hovered", () => {
  const rest = thoughtPos([0.3, 1, 0.2], 0, 0, 0);
  assert.equal(rest.s, 0);
  assert.equal(rest.y, 0.62);
  const out = thoughtPos([0.3, 1, 0.2], 1, 0, 0);
  assert.equal(out.s, 1);
  assert.ok(Math.abs(out.x - 0.3) < 0.03);
});
