"use client";

import { useId, useState } from "react";

const SHOWN = 4;

function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="space-y-1.5 text-[15px] leading-snug text-[#3a3733]">
      {items.map((pt) => (
        <li key={pt} className="grid grid-cols-[14px_1fr]">
          <span className="text-[#5b5bf0]" aria-hidden="true">
            ›
          </span>
          <span>{pt}</span>
        </li>
      ))}
    </ul>
  );
}

/** First few points; the rest grow open smoothly (grid-rows 0fr → 1fr) instead of snapping. */
export default function RolePoints({ points }: { points: string[] }) {
  const [open, setOpen] = useState(false);
  const id = useId();
  const rest = points.slice(SHOWN);
  return (
    <div className="mt-2">
      <Bullets items={points.slice(0, SHOWN)} />
      {rest.length > 0 && (
        <>
          <div
            id={id}
            className="grid transition-[grid-template-rows,opacity] duration-500 ease-out motion-reduce:transition-none"
            style={{ gridTemplateRows: open ? "1fr" : "0fr", opacity: open ? 1 : 0 }}
            inert={!open}
          >
            <div className="min-h-0 overflow-hidden">
              <div className="pt-1.5">
                <Bullets items={rest} />
              </div>
            </div>
          </div>
          <button
            type="button"
            aria-expanded={open}
            aria-controls={id}
            onClick={() => setOpen((o) => !o)}
            className="mt-1.5 text-sm font-medium text-[#5b5bf0] hover:underline"
          >
            {open ? "Show less ↑" : `Show ${rest.length} more ↓`}
          </button>
        </>
      )}
    </div>
  );
}
