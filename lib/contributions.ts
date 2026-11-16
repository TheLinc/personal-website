// Pure contribution-calendar logic. No imports, so `node --test` can run it.

export type Day = { date: string; count: number };
/** weeks run oldest → newest, at most 7 days each. */
export type Calendar = { total: number; fetchedAt: string; weeks: Day[][] };

type RawDay = { date: string; contributionCount: number };

/** Map GitHub's GraphQL contributionCalendar response to a Calendar. Throws on a bad shape. */
export function parseCalendar(json: unknown, fetchedAt: string): Calendar {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const cal = (json as any)?.data?.user?.contributionsCollection?.contributionCalendar;
  if (!cal || !Array.isArray(cal.weeks) || typeof cal.totalContributions !== "number") {
    throw new Error("Unexpected contribution calendar shape");
  }
  return {
    total: cal.totalContributions,
    fetchedAt,
    weeks: cal.weeks.map((w: { contributionDays: RawDay[] }) =>
      w.contributionDays.map((d) => ({ date: d.date, count: d.contributionCount })),
    ),
  };
}

/** Column height in scene units. sqrt keeps one huge day from flattening the rest. */
export function heightFor(count: number, max: number): number {
  if (count <= 0 || max <= 0) return 0.08;
  return 0.25 + 4 * Math.sqrt(Math.min(count, max) / max);
}

export function maxCount(cal: Calendar): number {
  let max = 0;
  for (const week of cal.weeks) for (const d of week) max = Math.max(max, d.count);
  return max;
}

/** First week whose total reaches half the busiest week's total; null when there's no activity. */
export function spikeWeek(cal: Calendar): number | null {
  const sums = cal.weeks.map((w) => w.reduce((a, d) => a + d.count, 0));
  const peak = Math.max(0, ...sums);
  if (peak === 0) return null;
  return sums.findIndex((s) => s >= peak / 2);
}
