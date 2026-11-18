import { test } from "node:test";
import assert from "node:assert/strict";
import { bendPoint, frontOutline, lensOpening, restOffset, rowExtent, slatBars, insidePoly } from "./shades.ts";

const square = [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 1, y: 1 }, { x: 0, y: 1 }];

test("rowExtent: where a slat at height y meets the lens edges", () => {
  assert.deepEqual(rowExtent(square, 0.5), [0, 1]);
  assert.equal(rowExtent(square, 2), null);
});

test("bendPoint wraps x around a cylinder: centre stays put, sides curve back", () => {
  assert.deepEqual(bendPoint(0, 0, 0.38), [0, 0]);
  assert.ok(bendPoint(0.1, 0, 0.38)[1] < 0);
});

test("frontOutline: one closed, mirror-symmetric outline, wider than tall like real shutter shades (~2.9:1)", () => {
  const o = frontOutline();
  const xs = o.map((p) => p.x), ys = o.map((p) => p.y);
  const w = Math.max(...xs) - Math.min(...xs), h = Math.max(...ys) - Math.min(...ys);
  assert.ok(w / h > 2.6 && w / h < 3.3, `ratio ${w / h}`);
  assert.ok(Math.abs(Math.max(...xs) + Math.min(...xs)) < 1e-6);
});

test("slatBars: chunky slats stacked with the requested gap ratio, tucked into the frame", () => {
  const inner = lensOpening(1);
  const bars = slatBars(inner, 5, 0.65);
  assert.equal(bars.length, 5);
  const ib = { x0: Math.min(...inner.map((q) => q.x)), x1: Math.max(...inner.map((q) => q.x)) };
  bars.forEach((b, i) => {
    assert.ok(b.x0 >= ib.x0 - 0.01 && b.x1 <= ib.x1 + 0.01, "slat sticks out of the frame");
    if (i) {
      const gapH = bars[i - 1].y0 - b.y1, barH = b.y1 - b.y0;
      assert.ok(Math.abs(gapH / barH - 0.65) < 1e-6, `gap ratio ${gapH / barH}`);
    }
  });
});

test("restOffset: push the glasses forward just enough to clear the face everywhere", () => {
  assert.equal(restOffset([{ gz: 0, fz: 0.1 }, { gz: 0.05, fz: 0.1 }], 0.01), 0.11);
  assert.equal(restOffset([{ gz: 0.5, fz: null }], 0.01), 0);
});

test("lens taper: the lowest point of each lens sits toward the nose, like aviator-style shutter shades", () => {
  const o = lensOpening(1);
  const low = o.reduce((a, p) => (p.y < a.y ? p : a));
  const xs = o.map((p) => p.x);
  assert.ok(low.x < (Math.min(...xs) + Math.max(...xs)) / 2, `lowest at x=${low.x}`);
});

test("insidePoly: points on the frame count, the gap under the nose arch does not", () => {
  const o = frontOutline();
  assert.equal(insidePoly({ x: 0, y: 0.08 }, o), true); // bridge
  assert.equal(insidePoly({ x: 0, y: -0.1 }, o), false); // under the nose arch
  assert.equal(insidePoly({ x: 0.2, y: -0.1 }, o), true); // lens bottom
});
