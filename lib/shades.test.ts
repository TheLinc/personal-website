import { test } from "node:test";
import assert from "node:assert/strict";
import { bendPoint, LENS, rowExtent } from "./shades.ts";

const square = [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 1, y: 1 }, { x: 0, y: 1 }];

test("rowExtent: where a slat at height y meets the lens edges", () => {
  assert.deepEqual(rowExtent(square, 0.5), [0, 1]);
  assert.equal(rowExtent(square, 2), null);
});

test("bendPoint wraps x around a cylinder: centre stays put, sides curve back", () => {
  assert.deepEqual(bendPoint(0, 0, 0.38), [0, 0]);
  assert.ok(bendPoint(0.1, 0, 0.38)[1] < 0);
});

test("LENS has the 11 outline points", () => {
  assert.equal(LENS.length, 11);
});
