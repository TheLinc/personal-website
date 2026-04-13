"use client";

import { useRef } from "react";
import { motion, useInView, useScroll, useTransform, MotionValue } from "framer-motion";
import Image from "next/image";

// ─── LineFill (stable component outside render scope) ─────────────────────
// Must live outside Experience so React never sees a new component type on
// re-renders — inline component definitions cause unmount/remount, which
// resets the scaleY transform and causes the visible line-thickness glitch.
function LineFill({ scaleY }: { scaleY: MotionValue<number> }) {
  return (
    <motion.div
      className="absolute inset-0 origin-top"
      style={{
        scaleY,
        background: "linear-gradient(to bottom, #8b5cf6, #22d3ee)",
      }}
    />
  );
}

const EXPERIENCE = [
  {
    image:     "/images/experience/os.png",
    company:   "Opinion System",
    role:      "Software Developer",
    period:    "2023 — Present",
    side:      "left" as const,
    highlights: [
      "Led responsive design overhaul with Next.js + Material UI",
      "Built a custom Chrome extension using the GitLab API",
      "Overhauled backend infrastructure with MySQL + Symfony",
      "Oversaw React Native mobile animation feature end-to-end",
      "Fostered cross-team communication and agile best practices",
    ],
  },
  {
    image:     "/images/experience/GBatteries.png",
    company:   "GBatteries",
    role:      "Full Stack Developer",
    period:    "2022",
    side:      "right" as const,
    highlights: [
      "Built Python hardware simulation app, cutting test error rates",
      "Deployed Dockerized services on Amazon ECS",
      "Published an internal PyPI library to improve DX",
      "Implemented real-time socket servers for hardware data collection",
    ],
  },
  {
    image:     "/images/experience/trading-central.png",
    company:   "Trading Central",
    role:      "Software Developer",
    period:    "2021",
    side:      "left" as const,
    highlights: [
      "Engineered React.js front-ends for financial data visualisation",
      "Built Angular components with advanced SVG integration",
      "Collaborated on REST API integration and data flow design",
      "Translated Figma designs into responsive, accessible layouts",
    ],
  },
  {
    image:     "/images/experience/cra.png",
    company:   "Canada Revenue Agency",
    role:      "IT Analyst & Developer",
    period:    "2020",
    side:      "right" as const,
    highlights: [
      "Researched advanced data masking and obfuscation strategies",
      "Automated testing workflows using UFT for custom Jira features",
      "Established vendor relationships for technology benchmarking",
      "Contributed to government-level data security policy",
    ],
  },
];

type ExpItem = (typeof EXPERIENCE)[number];

// ─── Dot shared style ──────────────────────────────────────────────────────
const DOT_STYLE = {
  background: "linear-gradient(135deg, #8b5cf6, #22d3ee)",
  boxShadow:  "0 0 14px rgba(139,92,246,0.55)",
} as const;

// ─── Card ──────────────────────────────────────────────────────────────────
function Card({ item, inView }: { item: ExpItem; inView: boolean }) {
  return (
    <motion.div
      className="rounded-2xl p-5 md:p-6 h-full"
      style={{ border: "1px solid var(--border)", background: "var(--surface)" }}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Header */}
      <div className="flex items-start gap-3 mb-5">
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: "var(--surface-2)", border: "1px solid var(--border)" }}
        >
          <Image
            src={item.image}
            alt={item.company}
            width={32}
            height={32}
            style={{ width: 32, height: 32, objectFit: "contain" }}
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3
              className="font-bold text-lg leading-tight"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {item.company}
            </h3>
            <span
              className="hidden md:inline-flex text-xs px-3 py-1.5 rounded-full shrink-0"
              style={{
                color: "var(--muted)",
                background: "var(--surface-2)",
                border: "1px solid var(--border)",
                fontFamily: "var(--font-mono)",
              }}
            >
              {item.period}
            </span>
          </div>

          <p
            className="text-sm mt-0.5"
            style={{ color: "var(--accent)", fontFamily: "var(--font-mono)" }}
          >
            {item.role}
          </p>

          <span
            className="inline-flex md:hidden text-xs px-2.5 py-1 rounded-full mt-2"
            style={{
              color: "var(--muted)",
              background: "var(--surface-2)",
              border: "1px solid var(--border)",
              fontFamily: "var(--font-mono)",
            }}
          >
            {item.period}
          </span>
        </div>
      </div>

      {/* Bullets */}
      <ul className="space-y-2.5">
        {item.highlights.map((h, i) => (
          <li
            key={i}
            className="flex items-start gap-2.5 text-sm leading-relaxed"
            style={{ color: "var(--muted)" }}
          >
            <span className="mt-[3px] shrink-0" style={{ color: "#a78bfa" }}>▸</span>
            {h}
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

// ─── TimelineRow ───────────────────────────────────────────────────────────
function TimelineRow({ item }: { item: ExpItem }) {
  const rowRef = useRef<HTMLDivElement>(null);
  const inView  = useInView(rowRef, { once: true, margin: "-60px" });

  return (
    <div
      ref={rowRef}
      className="grid grid-cols-1 md:grid-cols-[1fr_48px_1fr] items-start gap-0 mb-2"
    >
      {/*
        Left slot.

        Mobile:  a narrow dot-column (w-[22px]) sits over the left line,
                 followed by the card content. The 22px column centres the
                 dot exactly on the line (left: 11px  →  dot centre: 11px ✓).
        Desktop: only left-side items fill this slot, no dot column needed.
      */}
      <div className="py-3 md:py-5 md:pr-6">

        {/* ── Mobile layout ── */}
        <div className="md:hidden flex items-start">
          {/* Dot column — 22 px wide, centres on the left line at x=11 px */}
          <div className="w-[22px] shrink-0 flex flex-col items-center pt-6">
            <motion.div
              className="w-3 h-3 rounded-full z-10"
              style={DOT_STYLE}
              initial={{ scale: 0, opacity: 0 }}
              animate={inView ? { scale: 1, opacity: 1 } : {}}
              transition={{ delay: 0.1, duration: 0.4, type: "spring", stiffness: 320 }}
            />
          </div>
          {/* Card — takes remaining width */}
          <div className="flex-1 min-w-0 pl-3">
            <Card item={item} inView={inView} />
          </div>
        </div>

        {/* ── Desktop: left-side items only ── */}
        {item.side === "left" && (
          <div className="hidden md:block">
            <Card item={item} inView={inView} />
          </div>
        )}
      </div>

      {/* Center dot — desktop only */}
      <div className="hidden md:flex flex-col items-center pt-8">
        <motion.div
          className="w-3.5 h-3.5 rounded-full shrink-0 z-10"
          style={DOT_STYLE}
          initial={{ scale: 0, opacity: 0 }}
          animate={inView ? { scale: 1, opacity: 1 } : {}}
          transition={{ delay: 0.15, duration: 0.4, type: "spring", stiffness: 320 }}
        />
      </div>

      {/* Right slot — desktop only */}
      {item.side === "right" && (
        <div className="hidden md:block py-5 pl-6">
          <Card item={item} inView={inView} />
        </div>
      )}
    </div>
  );
}

// ─── Section ───────────────────────────────────────────────────────────────
export default function Experience() {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: "-60px" });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 85%", "end 15%"],
  });

  /*
    Use scaleY (GPU transform) instead of height (layout property).
    scaleY operates entirely on the compositing layer — no reflow,
    no paint — so the fill tracks the scroll position smoothly in
    both directions without any jank.
  */
  const lineScaleY = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section ref={sectionRef} id="experience" className="relative py-20 md:py-32 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">

        {/* Label */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-4 mb-4"
        >
          <span
            className="text-xs tracking-[0.25em] uppercase"
            style={{ color: "var(--accent)", fontFamily: "var(--font-mono)" }}
          >
            03 / Experience
          </span>
          <div className="h-px w-14" style={{ background: "var(--border-accent)" }} />
        </motion.div>

        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="text-4xl sm:text-5xl md:text-7xl font-bold mb-10 md:mb-16 leading-[1.05]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Where I&apos;ve{" "}
          <span className="text-gradient">made an impact.</span>
        </motion.h2>

        {/* Timeline */}
        <div className="relative">

          {/*
            Mobile left line — 2px wide to avoid sub-pixel rendering artefacts.
            Positioned at left: 10px so the 2px track centres on x=11px,
            matching the 22px dot-column used in each TimelineRow.
          */}
          <div
            className="absolute md:hidden top-0 bottom-0 left-[10px] w-[2px] overflow-hidden"
            style={{ background: "var(--border)" }}
          >
            <LineFill scaleY={lineScaleY} />
          </div>

          {/*
            Desktop centre line — 2px wide, centred precisely with a
            negative-margin offset instead of transform to avoid fractional
            pixel placement that causes apparent thickness variations.
          */}
          <div
            className="absolute hidden md:block top-0 bottom-0 w-[2px] overflow-hidden"
            style={{
              left: "calc(50% - 1px)",
              background: "var(--border)",
            }}
          >
            <LineFill scaleY={lineScaleY} />
          </div>

          {EXPERIENCE.map((item) => (
            <TimelineRow key={item.company} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}
