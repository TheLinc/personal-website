/* eslint-disable @next/next/no-img-element */
import { ROLES } from "@/content/site";
import RolePoints from "./RolePoints";

const MAIN = "#cfc8bb";
const BRANCH = "#5b5bf0";
const DOT_Y = 30; // px from the top of each row, lined up with the card's first line

/** One commit dot. */
function Dot({ x, color }: { x: number; color: string }) {
  return (
    <span
      className="absolute size-3 rounded-full ring-[3px] ring-[#fbfaf7]"
      style={{ left: x - 6, top: DOT_Y - 6, background: color }}
    />
  );
}

/** `git log --graph` gutter. Fixed-size curves (never stretched), so rows can be any height. */
function Gutter({ index, last, branch, head }: { index: number; last: boolean; branch?: boolean; head?: boolean }) {
  return (
    <div className="relative w-10 shrink-0 sm:w-11" aria-hidden="true">
      {/* main line: starts at the HEAD commit, ends at the root commit */}
      <span
        className="absolute left-[11px] w-0.5"
        style={{ top: index === 0 ? DOT_Y : 0, bottom: last ? `calc(100% - ${DOT_Y}px)` : 0, background: MAIN }}
      />
      {branch ? (
        <>
          {/* leaves main, runs alongside as a contract, merges back */}
          <svg className="absolute left-0 top-0" width="44" height={DOT_Y} viewBox={`0 0 44 ${DOT_Y}`} fill="none">
            <path d={`M12 0 C12 ${DOT_Y * 0.6}, 32 ${DOT_Y * 0.4}, 32 ${DOT_Y}`} stroke={BRANCH} strokeWidth="2" />
          </svg>
          <span className="absolute left-[31px] w-0.5" style={{ top: DOT_Y, bottom: 24, background: BRANCH }} />
          <svg className="absolute bottom-0 left-0" width="44" height="24" viewBox="0 0 44 24" fill="none">
            <path d="M32 0 C32 12, 12 10, 12 24" stroke={BRANCH} strokeWidth="2" />
          </svg>
          <Dot x={32} color={BRANCH} />
        </>
      ) : (
        <Dot x={12} color={head ? "#11a37f" : "#1d1c1a"} />
      )}
    </div>
  );
}

export default function Experience() {
  return (
    <ol className="mt-10">
      {ROLES.map((r, i) => (
        <li key={r.company} id={r.company.toLowerCase().replace(/ /g, "-")} className="flex scroll-mt-6 gap-1.5 sm:gap-4" data-build="box" data-label={r.company}>
          <Gutter index={i} last={i === ROLES.length - 1} branch={r.branch} head={r.head} />
          <div className="card mb-4 min-w-0 flex-1 p-4 sm:p-5">
            {/* Phones: commit line on top, logo beside the company name, role and dates full width below, so no
                empty column under the logo. From sm up the logo sits beside all three lines. */}
            <div className="grid grid-cols-[auto_1fr] items-center gap-x-3 sm:gap-x-4">
              <img
                src={r.logo}
                alt=""
                className={`row-start-2 mt-2 size-10 shrink-0 rounded-xl sm:row-span-3 sm:row-start-1 sm:mt-0 sm:size-11 sm:self-start ${r.tile ? "object-cover" : "border border-[#e8e3da] bg-white object-contain p-1"}`}
              />
              <p className="mono col-span-2 row-start-1 flex flex-wrap items-center gap-1.5 text-[11px] text-[#6d6962] sm:col-span-1 sm:col-start-2">
                {r.hash}
                {r.head && <span className="rounded bg-[#e3f6ee] px-1.5 py-0.5 text-[#0d7a5f]">HEAD → main</span>}
                {r.branch && <span className="rounded bg-[#ecebfe] px-1.5 py-0.5 text-[#4646c8]">contract</span>}
              </p>
              <h3 className="col-start-2 row-start-2 mt-2 text-xl sm:mt-1">{r.company}</h3>
              <p className="col-span-2 row-start-3 mt-1 text-sm text-[#6d6962] sm:col-span-1 sm:col-start-2 sm:mt-0">
                {r.role} · {r.when}
              </p>
            </div>
            {/* Full card width on phones; lined up under the title from sm up. */}
            <div className="sm:pl-[60px]">
              <p className="mt-3 text-[15px] font-medium">{r.summary}</p>
              <RolePoints points={r.points} />
              <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Stack">
                {r.stack.map((t) => (
                  <li key={t} className="rounded-full border border-[#e8e3da] bg-[#fbfaf7] px-2.5 py-0.5 text-xs text-[#6d6962]">
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </li>
      ))}
    </ol>
  );
}
