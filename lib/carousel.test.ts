import { test } from "node:test";
import assert from "node:assert/strict";
import { activeIndex } from "./carousel.ts";

test("activeIndex: which card the row is scrolled to", () => {
  assert.equal(activeIndex(0, 246, 8), 0);
  assert.equal(activeIndex(250, 246, 8), 1);
  assert.equal(activeIndex(99999, 246, 8), 7);
  assert.equal(activeIndex(10, 0, 8), 0);
});

test("activeIndex: scrolled all the way to the end counts as the last card, even when several fit on screen", () => {
  assert.equal(activeIndex(984, 246, 8, 984), 7); // 4 cards visible: the row stops with card 5 at the left edge
  assert.equal(activeIndex(983.4, 246, 8, 984), 7); // sub-pixel short of the end
  assert.equal(activeIndex(492, 246, 8, 984), 2);
});
