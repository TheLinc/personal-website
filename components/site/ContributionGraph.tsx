import { maxCount, type Calendar } from "@/lib/contributions";

export const fmtDay = (iso: string) =>
  new Date(iso + "T00:00:00Z").toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" });

export function contributionStats(cal: Calendar) {
  const days = cal.weeks.flat();
  const busiest = days.reduce((a, d) => (d.count > a.count ? d : a), days[0]);
  let streak = 0;
  let best = 0;
  for (const d of days) {
    streak = d.count > 0 ? streak + 1 : 0;
    best = Math.max(best, streak);
  }
  const last = [...days].reverse().find((d) => d.count > 0);
  const daysAgo = last ? Math.round((Date.parse(days.at(-1)!.date) - Date.parse(last.date)) / 864e5) : null;
  return { busiest, best, daysAgo };
}

/** GitHub-style year grid. The data agent paints it column by column via --r (see site.css). */
export default function ContributionGraph({ cal }: { cal: Calendar }) {
  const max = maxCount(cal);
  return (
    // rtl scroll container: on narrow screens the graph starts scrolled to the most recent weeks.
    <div data-build="data" data-label="contribution graph" className="-mx-1 overflow-x-auto px-1 pb-1" dir="rtl">
      <div
        dir="ltr"
        className="inline-grid grid-flow-col gap-[3px]"
        style={{ gridTemplateRows: "repeat(7, var(--cell))" }}
        role="img"
        aria-label={`${cal.total.toLocaleString("en-US")} GitHub contributions in the last year`}
      >
        {cal.weeks.map((w, x) =>
          w.map((d, y) => {
            const t = max ? Math.sqrt(d.count / max) : 0;
            return (
              <span
                key={d.date}
                title={`${fmtDay(d.date)}: ${d.count} contributions`}
                className="cell block rounded-[3px]"
                style={{
                  ["--col" as string]: x,
                  width: "var(--cell)",
                  height: "var(--cell)",
                  gridRow: y + 1,
                  background: d.count === 0 ? "#efebe3" : `rgba(91, 91, 240, ${0.25 + 0.75 * t})`,
                }}
              />
            );
          }),
        )}
      </div>
    </div>
  );
}
