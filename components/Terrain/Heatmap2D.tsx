import Link from "next/link";
import { maxCount, spikeWeek, type Calendar } from "@/lib/contributions";

const CELL = 10;
const GAP = 2;

/** Flat SVG version of the terrain: phones, no WebGL, lost context. */
export default function Heatmap2D({
  calendar,
  className,
}: {
  calendar: Calendar;
  className?: string;
}) {
  const max = maxCount(calendar);
  const spike = spikeWeek(calendar);
  const w = calendar.weeks.length * (CELL + GAP);
  const h = 7 * (CELL + GAP);
  const top = 22;

  return (
    <figure className={className}>
      <svg
        viewBox={`0 0 ${w} ${h + top}`}
        className="block h-auto w-full"
        role="img"
        aria-label={`${calendar.total.toLocaleString("en-US")} GitHub contributions in the last 12 months`}
      >
        {spike !== null && (
          <g className="font-mono" fill="var(--accent)">
            <line
              x1={spike * (CELL + GAP) + CELL / 2}
              x2={spike * (CELL + GAP) + CELL / 2}
              y1={10}
              y2={top - 3}
              stroke="var(--accent)"
              strokeWidth={1}
            />
            <circle cx={spike * (CELL + GAP) + CELL / 2} cy={10} r={1.6} />
          </g>
        )}
        {calendar.weeks.map((week, x) =>
          week.map((d, y) => {
            const t = max > 0 ? Math.sqrt(d.count / max) : 0;
            return (
              <rect
                key={d.date}
                x={x * (CELL + GAP)}
                y={top + y * (CELL + GAP)}
                width={CELL}
                height={CELL}
                fill={d.count === 0 ? "rgba(236,235,230,0.07)" : "var(--accent)"}
                fillOpacity={d.count === 0 ? 1 : 0.25 + 0.75 * t}
              >
                <title>{`${d.date} · ${d.count} contributions`}</title>
              </rect>
            );
          }),
        )}
      </svg>
      {spike !== null && (
        <figcaption className="fig mt-3">
          <Link href="/agents" className="text-accent">
            Parallel agents online →
          </Link>
        </figcaption>
      )}
    </figure>
  );
}
