import { test } from "node:test";
import assert from "node:assert/strict";
import {
  parseCalendar,
  heightFor,
  maxCount,
  spikeWeek,
  type Calendar,
} from "./contributions.ts";

const fixture = {
  data: {
    user: {
      contributionsCollection: {
        contributionCalendar: {
          totalContributions: 7,
          weeks: [
            { contributionDays: [{ date: "2026-01-04", contributionCount: 2 }] },
            {
              contributionDays: [
                { date: "2026-01-11", contributionCount: 0 },
                { date: "2026-01-12", contributionCount: 5 },
              ],
            },
          ],
        },
      },
    },
  },
};

/** Build a calendar whose weeks have the given weekly sums (one day each). */
function weeksOf(sums: number[]): Calendar {
  return {
    total: sums.reduce((a, b) => a + b, 0),
    fetchedAt: "t",
    weeks: sums.map((count, i) => [{ date: `w${i}`, count }]),
  };
}

test("parseCalendar maps the GraphQL shape to weeks of days", () => {
  assert.deepEqual(parseCalendar(fixture, "2026-11-16T00:00:00Z"), {
    total: 7,
    fetchedAt: "2026-11-16T00:00:00Z",
    weeks: [
      [{ date: "2026-01-04", count: 2 }],
      [
        { date: "2026-01-11", count: 0 },
        { date: "2026-01-12", count: 5 },
      ],
    ],
  });
});

test("parseCalendar throws on a bad shape", () => {
  assert.throws(() => parseCalendar({}, "t"));
  assert.throws(() => parseCalendar({ data: { user: null } }, "t"));
});

test("heightFor: zero is a thin base tile, max is the tallest column", () => {
  assert.equal(heightFor(0, 10), 0.08);
  assert.equal(heightFor(10, 10), 4.25);
});

test("heightFor stays finite when max is zero", () => {
  assert.ok(Number.isFinite(heightFor(5, 0)));
  assert.ok(Number.isFinite(heightFor(0, 0)));
});

test("all-zero calendar has no max and no spike", () => {
  const cal = weeksOf([0, 0, 0]);
  assert.equal(maxCount(cal), 0);
  assert.equal(spikeWeek(cal), null);
});

test("spikeWeek is the first week reaching half the busiest week", () => {
  assert.equal(spikeWeek(weeksOf([0, 0, 1, 2, 30, 40, 10])), 4);
});

test("spikeWeek finds a single huge day", () => {
  assert.equal(spikeWeek(weeksOf([0, 0, 500, 0])), 2);
});
