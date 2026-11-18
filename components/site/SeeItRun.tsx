"use client";

import { useState, type ReactNode } from "react";

// The big demo stays folded away (and unloaded) until someone asks to see it.
export default function SeeItRun({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <details className="group mt-6" onToggle={(e) => setOpen(e.currentTarget.open)}>
      <summary className="chip w-fit cursor-pointer list-none !pl-3 text-sm font-semibold [&::-webkit-details-marker]:hidden">
        See it run <span className="transition-transform group-open:rotate-90">▸</span>
      </summary>
      {open && <div className="mt-4">{children}</div>}
    </details>
  );
}
