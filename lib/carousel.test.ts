import { test } from "node:test";
import assert from "node:assert/strict";
import { visibleCards } from "./carousel.ts";

// Desktop: 8 cards, 246px apart, 4 fit on screen, so the row scrolls 4 steps (984px).
test("visibleCards: several cards on screen, the range moves up one card per step", () => {
  assert.deepEqual(visibleCards(0, 246, 8, 984), [0, 3]);
  assert.deepEqual(visibleCards(246, 246, 8, 984), [1, 4]);
  assert.deepEqual(visibleCards(984, 246, 8, 984), [4, 7]); // end of the row shows the last card
  assert.deepEqual(visibleCards(983.4, 246, 8, 984), [4, 7]); // sub-pixel short of the end
});

// Phone: one card plus a peek of the next, so the row scrolls 7 steps.
test("visibleCards: one card on screen counts 1 to 8", () => {
  assert.deepEqual(visibleCards(0, 300, 8, 2100), [0, 0]);
  assert.deepEqual(visibleCards(2100, 300, 8, 2100), [7, 7]);
});

test("visibleCards: before layout (no step) shows the first card", () => {
  assert.deepEqual(visibleCards(10, 0, 8, 0), [0, 0]);
});

// Phone where the next card peeks about half way in: only fully shown cards count, and the end still reads 8.
test("visibleCards: a half-peeking card doesn't count as on screen", () => {
  assert.deepEqual(visibleCards(0, 280, 8, 1820), [0, 0]);
  assert.deepEqual(visibleCards(1680, 280, 8, 1820), [6, 6]);
  assert.deepEqual(visibleCards(1820, 280, 8, 1820), [7, 7]);
  assert.deepEqual(visibleCards(1819.5, 280, 8, 1820), [7, 7]);
});
