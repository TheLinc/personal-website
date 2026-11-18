import { test } from "node:test";
import assert from "node:assert/strict";
import { activeIndex } from "./carousel.ts";

test("activeIndex: which card the row is scrolled to", () => {
  assert.equal(activeIndex(0, 246, 8), 0);
  assert.equal(activeIndex(250, 246, 8), 1);
  assert.equal(activeIndex(99999, 246, 8), 7);
  assert.equal(activeIndex(10, 0, 8), 0);
});
