"use client";

import { useRef } from "react";
import { useInView } from "framer-motion";
import { useReducedMotion } from "@/lib/useReducedMotion";
import type { DNode, Diagram } from "./diagrams";

const W = 170;
const H = 52;

/** Orthogonal path between two node borders, with one elbow. */
function pathBetween(a: DNode, b: DNode): string {
  const aw = a.w ?? W, bw = b.w ?? W;
  const acx = a.x + aw / 2, acy = a.y + H / 2;
  const bcx = b.x + bw / 2, bcy = b.y + H / 2;
  if (Math.abs(bcy - acy) < 1) {
    const [x1, x2] = bcx > acx ? [a.x + aw, b.x] : [a.x, b.x + bw];
    return `M${x1},${acy} H${x2}`;
  }
  if (Math.abs(bcx - acx) < 1) {
    const [y1, y2] = bcy > acy ? [a.y + H, b.y] : [a.y, b.y + H];
    return `M${acx},${y1} V${y2}`;
  }
  const x1 = bcx > acx ? a.x + aw : a.x;
  const mid = (x1 + (bcx > acx ? b.x : b.x + bw)) / 2;
  const x2 = bcx > acx ? b.x : b.x + bw;
  return `M${x1},${acy} H${mid} V${bcy} H${x2}`;
}

/** Label anchor: above horizontal runs, beside vertical ones. */
function labelPoint(a: DNode, b: DNode): [number, number, "middle" | "start"] {
  const aw = a.w ?? W, bw = b.w ?? W;
  const x = (a.x + aw / 2 + b.x + bw / 2) / 2;
  const y = (a.y + b.y) / 2 + H / 2;
  return Math.abs(a.x - b.x) < 1 ? [x + 8, y + 3, "start"] : [x, y - 8, "middle"];
}

export default function ArchDiagram({ diagram }: { diagram: Diagram }) {
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px" });
  const reduced = useReducedMotion();
  const byId = Object.fromEntries(diagram.nodes.map((n) => [n.id, n]));

  return (
    <figure>
      <div className="-mx-5 overflow-x-auto px-5 md:mx-0 md:px-0">
      <svg ref={ref} viewBox="0 0 800 360" className="block h-auto w-full min-w-[620px]" role="img" aria-label={diagram.fig}>
        <defs>
          <pattern id="dots" width="20" height="20" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="0.8" fill="rgba(236,235,230,0.08)" />
          </pattern>
        </defs>
        <rect width="800" height="360" fill="url(#dots)" />

        {diagram.edges.map((e, i) => {
          const a = byId[e.from], b = byId[e.to];
          const d = pathBetween(a, b);
          const [lx, ly, anchor] = labelPoint(a, b);
          return (
            <g key={i}>
              <path d={d} fill="none" stroke="rgba(236,235,230,0.28)" strokeWidth={1} />
              {e.label && (
                <text x={lx} y={ly} textAnchor={anchor} className="font-mono" fontSize={10} fill="rgba(236,235,230,0.55)">
                  {e.label.toUpperCase()}
                </text>
              )}
              {inView && !reduced && (
                <rect width={6} height={6} x={-3} y={-3} fill="var(--accent)">
                  <animateMotion dur={`${2.2 + (i % 3) * 0.5}s`} begin={`${i * 0.35}s`} repeatCount="indefinite" path={d} />
                </rect>
              )}
            </g>
          );
        })}

        {diagram.nodes.map((n) => (
          <g key={n.id} transform={`translate(${n.x} ${n.y})`}>
            <rect width={n.w ?? W} height={H} fill="var(--bg-2)" stroke="rgba(236,235,230,0.35)" strokeWidth={1} />
            <rect width={4} height={4} fill="var(--accent)" />
            <text x={14} y={23} className="font-mono" fontSize={12} fill="var(--ink)">
              {n.label.toUpperCase()}
            </text>
            {n.sub && (
              <text x={14} y={40} className="font-mono" fontSize={10} fill="rgba(236,235,230,0.55)">
                {n.sub}
              </text>
            )}
          </g>
        ))}
      </svg>
      </div>
      <figcaption className="fig mt-3">{diagram.fig}</figcaption>
    </figure>
  );
}
