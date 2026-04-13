"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Image from "next/image";

const STATS = [
  { num: "4+", label: "Years of experience" },
  { num: "5",  label: "Companies worked at" },
  { num: "10+", label: "Projects shipped" },
  { num: "∞",  label: "Coffees consumed" },
];

export default function About() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const up = (delay = 0) => ({
    initial: { opacity: 0, y: 40 },
    animate: inView ? { opacity: 1, y: 0 } : {},
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as [number, number, number, number], delay },
  });

  return (
    <section ref={ref} id="about" className="py-20 md:py-32 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">

        {/* Section label */}
        <motion.div {...up(0)} className="flex items-center gap-4 mb-4">
          <span
            className="text-xs tracking-[0.25em] uppercase"
            style={{ color: "var(--accent)", fontFamily: "var(--font-mono)" }}
          >
            01 / About
          </span>
          <div
            className="h-px w-14"
            style={{ background: "var(--border-accent)" }}
          />
        </motion.div>

        {/* Heading */}
        <motion.h2
          {...up(0.1)}
          className="text-4xl sm:text-5xl md:text-7xl font-bold mb-10 md:mb-16 leading-[1.05]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          A developer who
          <br />
          <span className="text-gradient">sweats the details.</span>
        </motion.h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16 items-start">

          {/* ── Left column ────────────────────────────────── */}
          <motion.div {...up(0.2)} className="flex flex-col gap-6">

            {/* Photo */}
            <div
              className="relative rounded-3xl overflow-hidden"
              style={{ border: "1px solid var(--border)", background: "var(--surface)" }}
            >
              <Image
                src="/images/about/action-figure.png"
                alt="Lincoln Laylor"
                width={1024}
                height={1536}
                className="w-full max-w-xs mx-auto object-cover"
                style={{ filter: "grayscale(15%) contrast(1.02)", maxHeight: 420 }}
              />
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    "linear-gradient(to top, rgba(8,8,8,0.65) 0%, transparent 45%)",
                }}
              />
            </div>

            {/* Currently building */}
            <div
              className="rounded-2xl p-5"
              style={{
                border: "1px solid rgba(139,92,246,0.2)",
                background: "rgba(139,92,246,0.04)",
              }}
            >
              <div className="flex items-center gap-2 mb-3">
                <span
                  className="pulse-dot w-2 h-2 rounded-full bg-green-400"
                  style={{ boxShadow: "0 0 7px rgba(74,222,128,0.7)" }}
                />
                <span
                  className="text-xs tracking-[0.2em] uppercase"
                  style={{ color: "#4ade80", fontFamily: "var(--font-mono)" }}
                >
                  Currently Building
                </span>
              </div>
              <p
                className="font-bold text-lg mb-1.5"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Follow<span style={{ fontFamily: "var(--font-mono)", fontWeight: 700 }}>IQ</span>
              </p>
              <p
                className="text-sm leading-relaxed"
                style={{ color: "var(--muted)" }}
              >
                An AI-powered recruiter tool that generates personalised 3-email
                follow-up sequences via Claude. Recruiters manage a full
                candidate pipeline and get tailored outreach copy in seconds.
              </p>
              <div className="flex flex-wrap gap-2 mt-4">
                {["Next.js", "TypeScript", "Claude API", "Stripe", "Drizzle", "Neon"].map((t) => (
                  <span
                    key={t}
                    className="text-xs px-2.5 py-1 rounded-full"
                    style={{
                      background: "rgba(139,92,246,0.1)",
                      border: "1px solid rgba(139,92,246,0.22)",
                      color: "var(--accent)",
                      fontFamily: "var(--font-mono)",
                    }}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Currently learning */}
            <div
              className="rounded-2xl p-5"
              style={{
                border: "1px solid rgba(34,211,238,0.15)",
                background: "rgba(34,211,238,0.03)",
              }}
            >
              <div className="flex items-center gap-2 mb-3">
                <span
                  className="pulse-dot w-2 h-2 rounded-full bg-cyan-400"
                  style={{ boxShadow: "0 0 7px rgba(34,211,238,0.7)" }}
                />
                <span
                  className="text-xs tracking-[0.2em] uppercase"
                  style={{ color: "#22d3ee", fontFamily: "var(--font-mono)" }}
                >
                  Currently Learning
                </span>
              </div>
              <p
                className="text-sm leading-relaxed"
                style={{ color: "var(--muted)" }}
              >
                Deepening my understanding of how to integrate large language
                models into real products — prompt engineering, agentic
                workflows, RAG pipelines, and designing UX that makes AI feel
                natural rather than bolted on.
              </p>
            </div>
          </motion.div>

          {/* ── Right column ───────────────────────────────── */}
          <motion.div {...up(0.3)} className="flex flex-col gap-10">

            {/* Bio */}
            <div
              className="space-y-5 text-base md:text-lg leading-relaxed"
              style={{ color: "var(--muted)" }}
            >
              <p>
                Hey — I&apos;m Lincoln, a full-stack developer based in Canada
                with a passion for building software that feels as good as it
                performs. I care about accessibility, performance, and the
                details most people skip.
              </p>
              <p>
                Over 4 years I&apos;ve shipped production software at{" "}
                <strong style={{ color: "var(--text)" }}>
                  startups and government agencies
                </strong>{" "}
                alike — from responsive UI overhauls and custom Chrome extensions
                to Docker deployments on AWS and ML-powered IoT hardware.
              </p>
              <p>
                Great software lives at the intersection of engineering rigour
                and design sensibility. If it&apos;s slow, inaccessible, or
                ugly — it&apos;s not done.
              </p>
              <p
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.875rem",
                  color: "var(--subtle)",
                }}
              >
                #PoweredByCoffee ☕
              </p>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 gap-4">
              {STATS.map((s, i) => (
                <motion.div
                  key={s.label}
                  className="rounded-2xl p-5"
                  style={{ border: "1px solid var(--border)", background: "var(--surface)" }}
                  initial={{ opacity: 0, scale: 0.93 }}
                  animate={inView ? { opacity: 1, scale: 1 } : {}}
                  transition={{
                    delay: 0.38 + i * 0.09,
                    duration: 0.5,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  <div
                    className="text-4xl font-bold mb-1 text-gradient"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {s.num}
                  </div>
                  <div
                    className="text-xs tracking-wide"
                    style={{ color: "var(--muted)", fontFamily: "var(--font-mono)" }}
                  >
                    {s.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
