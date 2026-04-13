"use client";

import { useState, useEffect } from "react";
import {
  motion,
  useScroll,
  useMotionValueEvent,
  AnimatePresence,
  LayoutGroup,
} from "framer-motion";

const LINKS = [
  { label: "About",      href: "#about" },
  { label: "Skills",     href: "#skills" },
  { label: "Experience", href: "#experience" },
  { label: "Projects",   href: "#projects" },
  { label: "Contact",    href: "#contact" },
];

const SECTION_IDS = LINKS.map((l) => l.href.slice(1));

function scrollTo(href: string) {
  document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
}

export default function Nav() {
  const [scrolled, setScrolled]           = useState(false);
  const [open, setOpen]                   = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (v) => setScrolled(v > 80));

  // Track which section is in view — last one whose top is above 40 % vh wins
  useEffect(() => {
    const onScroll = () => {
      const threshold = window.innerHeight * 0.4;
      let active = "";
      for (const id of SECTION_IDS) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= threshold) active = id;
      }
      setActiveSection(active);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLink = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    scrollTo(href);
    setOpen(false);
  };

  return (
    <>
      {/*
        Header shell — always full-width, transparent.
        paddingInline / paddingTop animate via CSS transition so the pill
        floats 16 px from screen edges on all screen sizes once scrolled.
      */}
      <motion.header
        className="fixed top-0 left-0 right-0 z-[900] flex justify-center pointer-events-none"
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.3, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        style={{
          paddingLeft:  scrolled ? 16 : 0,
          paddingRight: scrolled ? 16 : 0,
          paddingTop:   scrolled ? 12 : 0,
          transition: "padding 0.5s cubic-bezier(0.22, 1, 0.36, 1)",
        }}
      >
        {/* Inner bar — Framer Motion owns geometry, CSS owns visuals */}
        <motion.div
          className="w-full flex items-center justify-between pointer-events-auto"
          animate={
            scrolled
              ? { maxWidth: 760,  borderRadius: 9999, paddingTop: 8,  paddingBottom: 8,  paddingLeft: 24, paddingRight: 24 }
              : { maxWidth: 1280, borderRadius: 0,    paddingTop: 20, paddingBottom: 20, paddingLeft: 24, paddingRight: 24 }
          }
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          style={{
            background:           scrolled ? "rgba(8,8,8,0.82)"                                                              : "transparent",
            backdropFilter:       scrolled ? "blur(24px) saturate(160%)"                                                     : "none",
            WebkitBackdropFilter: scrolled ? "blur(24px) saturate(160%)"                                                     : "none",
            border:               scrolled ? "1px solid rgba(255,255,255,0.08)"                                              : "1px solid transparent",
            boxShadow:            scrolled ? "0 8px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)"             : "none",
            transition: "background 0.35s, backdrop-filter 0.35s, -webkit-backdrop-filter 0.35s, border 0.3s, box-shadow 0.4s",
          }}
        >
          {/* Wordmark */}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="text-lg font-bold tracking-tight shrink-0"
            style={{ fontFamily: "var(--font-display)" }}
          >
            LL
          </a>

          {/* Desktop links + glass bubble */}
          <LayoutGroup id="nav">
            <nav className="hidden md:flex items-center gap-0.5">
              {LINKS.map((l) => {
                const isActive = activeSection === l.href.slice(1);
                return (
                  <a
                    key={l.href}
                    href={l.href}
                    onClick={(e) => handleLink(e, l.href)}
                    className="relative px-3.5 py-1.5 rounded-full text-sm transition-colors duration-200"
                    style={{
                      color: isActive ? "#fff" : "var(--muted)",
                      fontFamily: "var(--font-mono)",
                    }}
                  >
                    {/* Glass bubble — springs between active links via layoutId */}
                    {isActive && (
                      <motion.div
                        layoutId="glass-bubble"
                        className="absolute inset-0 rounded-full"
                        style={{
                          background:
                            "linear-gradient(160deg, rgba(255,255,255,0.19) 0%, rgba(255,255,255,0.07) 100%)",
                          backdropFilter:       "blur(18px) saturate(200%)",
                          WebkitBackdropFilter: "blur(18px) saturate(200%)",
                          border: "1px solid rgba(255,255,255,0.2)",
                          boxShadow: [
                            "0 2px 12px rgba(0,0,0,0.22)",           // outer drop shadow
                            "inset 0 1px 0 rgba(255,255,255,0.42)",  // top specular highlight
                            "inset 0 -1px 0 rgba(0,0,0,0.12)",      // bottom inner shadow
                            "inset 0 0 14px rgba(255,255,255,0.04)", // ambient inner glow
                          ].join(", "),
                        }}
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 32,
                          mass: 0.8,
                        }}
                      />
                    )}
                    <span className="relative z-10">{l.label}</span>
                  </a>
                );
              })}
            </nav>
          </LayoutGroup>

          {/* Hire Me CTA */}
          <a
            href="mailto:lincolnlaylor@gmail.com"
            className="hidden md:inline-flex items-center text-sm font-medium px-4 py-2 rounded-full transition-all duration-200 shrink-0"
            style={{
              fontFamily:  "var(--font-mono)",
              border:      "1px solid rgba(139,92,246,0.35)",
              color:       "var(--accent)",
              background:  "rgba(139,92,246,0.06)",
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.background  = "rgba(139,92,246,0.14)";
              el.style.borderColor = "rgba(139,92,246,0.65)";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.background  = "rgba(139,92,246,0.06)";
              el.style.borderColor = "rgba(139,92,246,0.35)";
            }}
          >
            Hire Me
          </a>

          {/* Hamburger (mobile) */}
          <button
            className="md:hidden flex flex-col gap-[5px] p-1"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle navigation"
          >
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="block w-6 h-px origin-center transition-all duration-300"
                style={{
                  background: "var(--text)",
                  transform:
                    i === 0 && open ? "rotate(45deg) translate(4px, 4px)"
                    : i === 2 && open ? "rotate(-45deg) translate(4px, -4px)"
                    : "none",
                  opacity: i === 1 && open ? 0 : 1,
                }}
              />
            ))}
          </button>
        </motion.div>
      </motion.header>

      {/* Mobile full-screen menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[800] flex flex-col items-center justify-center gap-10"
            style={{ background: "rgba(8,8,8,0.97)", backdropFilter: "blur(24px)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            {LINKS.map((l, i) => (
              <motion.a
                key={l.href}
                href={l.href}
                onClick={(e) => handleLink(e, l.href)}
                className="text-4xl font-bold"
                style={{
                  fontFamily: "var(--font-display)",
                  color: activeSection === l.href.slice(1) ? "transparent" : "var(--text)",
                  background: activeSection === l.href.slice(1)
                    ? "linear-gradient(120deg, #a78bfa 0%, #22d3ee 100%)"
                    : "none",
                  WebkitBackgroundClip: activeSection === l.href.slice(1) ? "text" : "unset",
                  backgroundClip: activeSection === l.href.slice(1) ? "text" : "unset",
                }}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 12 }}
                transition={{ delay: i * 0.07, ease: [0.22, 1, 0.36, 1], duration: 0.4 }}
              >
                {l.label}
              </motion.a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
