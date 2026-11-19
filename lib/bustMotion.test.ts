import { test } from "node:test";
import assert from "node:assert/strict";
import { drawOrder, followsPointer, isHead, needsRaycast, scrollProgress, thoughtPos, toNdc, yaw, isSettled } from "./bustMotion.ts";

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

test("isHead: anywhere on the head (face included), not the neck or shoulders", () => {
  assert.equal(isHead(0.7), true); // top of the head
  assert.equal(isHead(0.3), true); // face
  assert.equal(isHead(0.05), false); // neck and below
});

test("drawOrder: farther bubbles draw first so nearer ones (and their logos) cover them", () => {
  assert.deepEqual(drawOrder([-5, -3, -4]), [0, 2, 1]);
  assert.deepEqual(drawOrder([1]), [0]);
});

test("thoughtPos: hidden inside the head at rest, out at its slot when hovered", () => {
  const rest = thoughtPos([0.3, 1, 0.2], 0, 0, 0);
  assert.equal(rest.s, 0);
  assert.equal(rest.y, 0.62);
  const out = thoughtPos([0.3, 1, 0.2], 1, 0, 0);
  assert.equal(out.s, 1);
  assert.ok(Math.abs(out.x - 0.3) < 0.03);
});

test("followsPointer: only a real mouse steers the bust (touch scrolls the page)", () => {
  assert.equal(followsPointer("mouse"), true);
  assert.equal(followsPointer("touch"), false);
  assert.equal(followsPointer("pen"), false);
});

test("toNdc: client point to -1..1 against the canvas box as it is now", () => {
  assert.deepEqual(toNdc(150, 50, { left: 100, top: 0, width: 100, height: 100 }), [0, 0]);
  assert.deepEqual(toNdc(200, 0, { left: 100, top: 0, width: 100, height: 100 }), [1, 1]);
});

test("needsRaycast: skip the expensive hit test when nothing moved", () => {
  const a = { x: 10, y: 10, yaw: 0.1 };
  assert.equal(needsRaycast(a, { ...a }), false);
  assert.equal(needsRaycast(a, { ...a, x: 11 }), true);
  assert.equal(needsRaycast(a, { ...a, yaw: 0.1005 }), false);
  assert.equal(needsRaycast(a, { ...a, yaw: 0.105 }), true);
});

test("isSettled: nothing left to animate once the turn and swing have caught up and the bubbles are tucked away", () => {
  const still = { p: 1, pTo: 1, mx: 0.5, mxTo: 0.5, hover: 0, over: 0 };
  assert.equal(isSettled(still), true);
  assert.equal(isSettled({ ...still, p: 0.9 }), false); // still turning from a scroll
  assert.equal(isSettled({ ...still, mx: 0.49 }), false); // still swinging toward the mouse
  assert.equal(isSettled({ ...still, mx: 0.49999 }), true); // close enough that no pixel moves
  assert.equal(isSettled({ ...still, hover: 0.3 }), false); // bubbles still sinking back in
  assert.equal(isSettled({ ...still, hover: 1, over: 1 }), false); // bubbles out and bobbing
});
