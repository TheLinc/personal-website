"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const LINKS = [
  {
    label: "lincolnlaylor@gmail.com",
    href:  "mailto:lincolnlaylor@gmail.com",
    accent: "var(--accent)",
    accentHover: "rgba(139,92,246,0.4)",
    bgHover: "rgba(139,92,246,0.05)",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="4" width="20" height="16" rx="2"/>
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
      </svg>
    ),
  },
  {
    label: "GitHub — TheLinc",
    href:  "https://github.com/TheLinc",
    external: true,
    accent: "var(--accent)",
    accentHover: "rgba(139,92,246,0.4)",
    bgHover: "rgba(139,92,246,0.05)",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C5.37 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23a11.5 11.5 0 0 1 3.003-.404c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href:  "https://www.linkedin.com/in/lincolnlaylor/",
    external: true,
    accent: "var(--accent-2)",
    accentHover: "rgba(34,211,238,0.4)",
    bgHover: "rgba(34,211,238,0.05)",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2zm2-5a2 2 0 1 1 0 4 2 2 0 0 1 0-4z"/>
      </svg>
    ),
  },
];

export default function Contact() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section ref={ref} id="contact" className="py-20 md:py-32 px-6 md:px-12 relative overflow-hidden">

      {/* Background glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none w-[900px] h-[450px]"
        style={{
          background:
            "radial-gradient(ellipse, rgba(139,92,246,0.08) 0%, transparent 68%)",
          filter: "blur(50px)",
        }}
      />

      <div className="max-w-7xl mx-auto relative z-10">

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
            06 / Contact
          </span>
          <div className="h-px w-14" style={{ background: "var(--border-accent)" }} />
        </motion.div>

        {/* Big heading */}
        <motion.h2
          initial={{ opacity: 0, y: 44 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="text-4xl sm:text-6xl md:text-8xl font-bold mb-6 md:mb-8 leading-[1]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Let&apos;s build
          <br />
          <span className="text-gradient">something great.</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.25 }}
          className="text-base md:text-lg max-w-xl mb-12 leading-relaxed"
          style={{ color: "var(--muted)" }}
        >
          I&apos;m always open to new projects, collaborations, or a good chat
          about tech. Drop me a line — I respond fast.
        </motion.p>

        {/* Contact links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.35 }}
          className="flex flex-col sm:flex-row flex-wrap gap-3"
        >
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              target={link.external ? "_blank" : undefined}
              rel={link.external ? "noopener noreferrer" : undefined}
              className="inline-flex items-center gap-3 px-6 py-4 rounded-2xl transition-all duration-200 min-w-0"
              style={{
                border: "1px solid var(--border)",
                background: "var(--surface)",
                color: link.accent,
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.borderColor = link.accentHover;
                el.style.background = link.bgHover;
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.borderColor = "var(--border)";
                el.style.background = "var(--surface)";
              }}
            >
              {link.icon}
              <span
                className="font-medium text-sm min-w-0 truncate"
                style={{ fontFamily: "var(--font-mono)", color: "var(--text)" }}
              >
                {link.label}
              </span>
            </a>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
