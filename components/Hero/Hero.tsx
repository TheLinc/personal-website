"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";

const ROLES = [
  "Full-Stack Developer",
  "React Native Engineer",
  "Frontend Craftsman",
  "Coffee Connoisseur ☕",
];

const LINE1 = "LINCOLN".split("");
const LINE2 = "LAYLOR".split("");

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const charVariant = {
  hidden: { opacity: 0, y: 70, rotateX: -25 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: {
      delay: 0.08 + i * 0.042,
      duration: 0.7,
      ease: EASE,
    },
  }),
};

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const [mounted, setMounted] = useState(false);
  const [roleIdx, setRoleIdx] = useState(0);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const bgY      = useTransform(scrollYProgress, [0, 1], ["0%", "22%"]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "14%"]);
  const opacity  = useTransform(scrollYProgress, [0, 0.55], [1, 0]);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    const id = setInterval(
      () => setRoleIdx((p) => (p + 1) % ROLES.length),
      2900
    );
    return () => clearInterval(id);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex flex-col justify-center overflow-hidden"
    >
      {/* ── Aurora orbs ────────────────────────────────────── */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ y: bgY }}
      >
        <motion.div
          className="absolute rounded-full"
          style={{
            top: "-15%",
            left: "-10%",
            width: 700,
            height: 700,
            background:
              "radial-gradient(circle, rgba(139,92,246,0.18) 0%, transparent 65%)",
            filter: "blur(70px)",
          }}
          animate={{ x: [0, 28, -18, 0], y: [0, -18, 28, 0], scale: [1, 1.07, 0.95, 1] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute rounded-full"
          style={{
            bottom: "5%",
            right: "-8%",
            width: 600,
            height: 600,
            background:
              "radial-gradient(circle, rgba(34,211,238,0.13) 0%, transparent 65%)",
            filter: "blur(70px)",
          }}
          animate={{ x: [0, -22, 16, 0], y: [0, 22, -12, 0], scale: [1, 0.96, 1.08, 1] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 3 }}
        />
      </motion.div>

      {/* ── Subtle grid ────────────────────────────────────── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.022) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.022) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          maskImage:
            "radial-gradient(ellipse 75% 75% at 50% 50%, black 10%, transparent 100%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 75% 75% at 50% 50%, black 10%, transparent 100%)",
        }}
      />

      {/* ── Main content ───────────────────────────────────── */}
      <motion.div
        className="relative z-10 px-6 md:px-12 max-w-7xl mx-auto w-full pt-24 md:pt-28 pb-16 md:pb-24"
        style={{ y: contentY, opacity }}
      >
        {/* Status pill */}
        <motion.div
          className="inline-flex items-center gap-2.5 mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <span
            className="pulse-dot w-2 h-2 rounded-full bg-green-400"
            style={{ boxShadow: "0 0 8px rgba(74,222,128,0.75)" }}
          />
          <span
            className="text-xs tracking-[0.22em] uppercase"
            style={{ color: "var(--muted)", fontFamily: "var(--font-mono)" }}
          >
            Available for opportunities
          </span>
        </motion.div>

        {/* Name — animated letter reveal */}
        <div style={{ perspective: "900px" }}>
          <h1
            className="leading-[0.86] tracking-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {/* LINCOLN */}
            <div className="overflow-hidden">
              <div
                className="flex"
                style={{
                  fontSize: "clamp(54px, 14vw, 168px)",
                  fontWeight: 800,
                }}
              >
                {mounted &&
                  LINE1.map((ch, i) => (
                    <motion.span
                      key={i}
                      custom={i}
                      variants={charVariant}
                      initial="hidden"
                      animate="visible"
                      style={{ display: "inline-block" }}
                    >
                      {ch}
                    </motion.span>
                  ))}
              </div>
            </div>
            {/* LAYLOR — gradient */}
            <div className="overflow-hidden">
              <div
                className="flex"
                style={{
                  fontSize: "clamp(54px, 14vw, 168px)",
                  fontWeight: 800,
                }}
              >
                {mounted &&
                  LINE2.map((ch, i) => (
                    <motion.span
                      key={i}
                      custom={LINE1.length + i}
                      variants={charVariant}
                      initial="hidden"
                      animate="visible"
                      className="text-gradient"
                      style={{ display: "inline-block" }}
                    >
                      {ch}
                    </motion.span>
                  ))}
              </div>
            </div>
          </h1>
        </div>

        {/* Role + description + CTAs */}
        <motion.div
          className="mt-8 md:mt-14 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-16 max-w-4xl"
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.82, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Left */}
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div
                className="h-px w-8 shrink-0"
                style={{ background: "linear-gradient(to right, #8b5cf6, #22d3ee)" }}
              />
              {/* Cycling role */}
              <div style={{ height: "1.4em", overflow: "hidden" }}>
                <AnimatePresence mode="wait">
                  <motion.span
                    key={roleIdx}
                    className="block text-sm tracking-[0.18em] uppercase"
                    style={{ color: "var(--muted)", fontFamily: "var(--font-mono)" }}
                    initial={{ y: 18, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -18, opacity: 0 }}
                    transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
                  >
                    {ROLES[roleIdx]}
                  </motion.span>
                </AnimatePresence>
              </div>
            </div>
            <p
              className="text-base leading-relaxed"
              style={{ color: "var(--muted)", fontFamily: "var(--font-body)" }}
            >
              4 years building fast, accessible, and scalable web and mobile
              applications. I care about the pixels, the milliseconds, and
              everything in between.
            </p>
          </div>

          {/* Right — CTAs */}
          <div className="flex flex-col justify-end gap-3 md:items-end">
            <div className="flex flex-wrap gap-3">
              <a
                href="#projects"
                onClick={(e) => {
                  e.preventDefault();
                  document
                    .querySelector("#projects")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
                className="px-6 py-3 rounded-full font-medium text-sm transition-all duration-200 hover:opacity-90 hover:scale-[1.02]"
                style={{
                  background: "linear-gradient(120deg, #8b5cf6, #22d3ee)",
                  color: "#fff",
                  fontFamily: "var(--font-mono)",
                }}
              >
                View Work
              </a>
              <a
                href="#contact"
                onClick={(e) => {
                  e.preventDefault();
                  document
                    .querySelector("#contact")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
                className="px-6 py-3 rounded-full font-medium text-sm transition-all duration-200"
                style={{
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: "var(--text)",
                  fontFamily: "var(--font-mono)",
                  background: "rgba(255,255,255,0.03)",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.borderColor = "rgba(139,92,246,0.5)";
                  el.style.background = "rgba(139,92,246,0.08)";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.borderColor = "rgba(255,255,255,0.1)";
                  el.style.background = "rgba(255,255,255,0.03)";
                }}
              >
                Get in Touch
              </a>
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          className="mt-10 md:mt-14 flex flex-wrap gap-8 md:gap-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.65 }}
        >
          {[
            { num: "4+",  label: "Years Experience" },
            { num: "5",   label: "Companies" },
            { num: "10+", label: "Projects Shipped" },
          ].map((s) => (
            <div key={s.label} className="flex flex-col">
              <span
                className="text-3xl font-bold"
                style={{ fontFamily: "var(--font-display)", color: "var(--text)" }}
              >
                {s.num}
              </span>
              <span
                className="text-xs tracking-widest mt-1 uppercase"
                style={{ color: "var(--muted)", fontFamily: "var(--font-mono)" }}
              >
                {s.label}
              </span>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* ── Scroll indicator ───────────────────────────────── */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6 }}
      >
        <span
          className="text-[10px] tracking-[0.28em] uppercase"
          style={{ color: "var(--subtle)", fontFamily: "var(--font-mono)" }}
        >
          Scroll
        </span>
        <motion.div
          className="w-px h-12"
          style={{
            background: "linear-gradient(to bottom, rgba(139,92,246,0.65), transparent)",
          }}
          animate={{ scaleY: [0.2, 1, 0.2], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>
    </section>
  );
}
