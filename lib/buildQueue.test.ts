import { test } from "node:test";
import assert from "node:assert/strict";
import { arrival } from "./buildQueue.ts";

test("arrival: below the fold waits", () => {
  assert.equal(arrival(900, 40, 900, 3, false), "wait");
});

test("arrival: an element above the screen finishes without taking an agent job", () => {
  assert.equal(arrival(-400, 60, 900, 3, false), "finish");
  assert.equal(arrival(-400, 60, 900, 3, true), "finish");
});

test("arrival: on screen, agents take it while jobs are open, then it fades", () => {
  assert.equal(arrival(300, 60, 900, 1, false), "agent");
  assert.equal(arrival(300, 60, 900, 0, false), "fade");
  assert.equal(arrival(-20, 60, 900, 1, false), "agent");
});

test("arrival: during a jump to a #link, agent work waits for the landing; with no jobs left nothing waits", () => {
  assert.equal(arrival(300, 60, 900, 3, true), "wait");
  assert.equal(arrival(300, 60, 900, 0, true), "fade");
});
