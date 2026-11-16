"use client";

// Open Room, drawn in code: five named agents at their desks working tickets and reporting back by
// voice. A button opens the real product demo video.

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { crew, crewById, type CrewId } from "@/components/Crew/crew";
import { CrewDesks, deskCentre, type DeskStatus } from "@/components/Crew/CrewDesks";
import { CrewFace } from "@/components/Crew/CrewFace";
import "@/components/Crew/crew.css";

const LINES: Record<CrewId, string> = {
  clawd: "PR #142 is up for review.",
  bit: "Tests pass. 1,104 of 1,104.",
  terminal: "Build finished in 38 s.",
  block: "Filed a ticket for the flaky upload test.",
  loop: "Worktree cleaned up. Next ticket?",
};
const STEP_MS = 2400;

/** At step k: agent k just finished and speaks, the next three are working, the last is idle. */
function desksAt(k: number): Record<CrewId, DeskStatus> {
  const out = {} as Record<CrewId, DeskStatus>;
  crew.forEach((c, i) => {
    const offset = (i - (k % crew.length) + crew.length) % crew.length;
    out[c.id] = offset === 0 ? "done" : offset <= 3 ? "working" : "idle";
  });
  return out;
}

export default function OpenRoomDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const inView = useInView(ref, { margin: "-10% 0px" });
  const reduced = useReducedMotion();
  const [k, setK] = useState(0);

  useEffect(() => {
    if (!inView || reduced) return;
    const t = setInterval(() => setK((n) => n + 1), STEP_MS);
    return () => clearInterval(t);
  }, [inView, reduced]);

  const open = () => {
    dialogRef.current?.showModal();
    videoRef.current?.play().catch(() => {});
  };
  const close = () => {
    videoRef.current?.pause();
    dialogRef.current?.close();
  };

  const speaker = crew[k % crew.length];
  return (
    <div ref={ref} className="flex h-full flex-col justify-between gap-5 rounded-2xl border border-[#e8e3da] bg-[#f6f3ee] p-5 sm:p-6">
      <p className="sr-only">
        Animation: Open Room&apos;s five agents, Clawd, Bit, Terminal, Block and Loop, working at their desks. As each
        finishes it turns around and reports back by voice.
      </p>
      <div aria-hidden="true">
        <CrewDesks desks={desksAt(k)} glancing={speaker.id} className="block h-auto w-full" />
        <div className="relative mt-2 h-4">
          {crew.map((c) => (
            <span
              key={c.id}
              className="absolute -translate-x-1/2 font-[family-name:var(--font-jetbrains)] text-[9px] uppercase tracking-[0.06em] sm:text-[10px]"
              style={{ left: `${deskCentre[c.id] * 100}%`, color: c.id === speaker.id ? c.color : "#a8a29a" }}
            >
              {c.name}
            </span>
          ))}
        </div>
        <div className="mt-5 flex justify-center">
          <p
            key={k}
            className="flex max-w-full items-center gap-2.5 rounded-full border border-[#e8e3da] bg-white px-3.5 py-2 text-[12px]"
            style={{ animation: reduced ? undefined : "crew-pill 400ms ease-out" }}
          >
            <CrewFace id={speaker.id} size={18} />
            <span className="shrink-0 font-semibold" style={{ color: crewById[speaker.id].color }}>
              {speaker.name}
            </span>
            <span className="truncate text-[#6d6962]">{LINES[speaker.id]}</span>
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={open}
        className="mx-auto flex items-center gap-2 rounded-full bg-[#1d1c1a] px-5 py-2.5 text-sm font-semibold text-white transition-transform hover:scale-[1.03]"
      >
        <span aria-hidden="true">▶</span> Watch the real demo
      </button>

      <dialog
        ref={dialogRef}
        onClick={(e) => e.target === dialogRef.current && close()}
        onCancel={close}
        aria-label="Open Room product demo"
        className="m-auto w-[min(1100px,94vw)] rounded-2xl bg-black p-0 backdrop:bg-black/70 backdrop:backdrop-blur-sm"
      >
        <video
          ref={videoRef}
          src="/assets/open-room-demo.mp4"
          poster="/assets/open-room-poster.jpg"
          controls
          playsInline
          preload="none"
          className="block aspect-video w-full"
        />
        <button
          type="button"
          onClick={close}
          className="absolute right-3 top-3 rounded-full bg-white/90 px-3 py-1 text-sm font-semibold text-[#1d1c1a]"
        >
          Close
        </button>
      </dialog>
    </div>
  );
}
