import { test } from "node:test";
import assert from "node:assert/strict";
import { arrival } from "./buildQueue.ts";

test("arrival: below the fold waits", () => {
  assert.equal(arrival(900, 40, 900, 3), "wait");
});

test("arrival: an element above the screen finishes without taking an agent job", () => {
  assert.equal(arrival(-400, 60, 900, 3), "finish");
});

test("arrival: on screen, agents take it while jobs are open, then it fades", () => {
  assert.equal(arrival(300, 60, 900, 1), "agent");
  assert.equal(arrival(300, 60, 900, 0), "fade");
  assert.equal(arrival(-20, 60, 900, 1), "agent");
});
