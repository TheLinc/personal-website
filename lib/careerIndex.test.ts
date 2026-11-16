import { test } from "node:test";
import assert from "node:assert/strict";
import { grep, suggest } from "./careerIndex.ts";

const paths = (q: string) => grep(q).map((h) => h.path);

test("finds the exact skill", () => {
  assert.ok(paths("Stripe").includes("cover-me/billing"));
});

test("aliases map common shorthand to skills", () => {
  assert.ok(paths("payments").includes("opinion-system/billing"));
  assert.ok(paths("payments").includes("cover-me/billing"));
  assert.ok(paths("postgres").includes("cover-me/backend"));
  assert.ok(paths("ts").length >= 3);
});

test("an unknown skill returns nothing rather than a stretch", () => {
  assert.deepEqual(paths("rust"), []);
  assert.deepEqual(grep(""), []);
});

test("typos get a suggestion", () => {
  assert.ok(suggest("typscript").includes("typescript"));
});
