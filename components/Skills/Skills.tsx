"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Image from "next/image";

const ALL_SKILLS = [
  { name: "React",       image: "/images/webDevSkills/react.png" },
  { name: "Next.js",     image: "/images/webDevSkills/nextjs.png" },
  { name: "TypeScript",  image: "/images/webDevSkills/ts.png" },
  { name: "Node.js",     image: "/images/webDevSkills/node.png" },
  { name: "JavaScript",  image: "/images/webDevSkills/js.png" },
  { name: "Angular",     image: "/images/webDevSkills/angular.png" },
  { name: "TailwindCSS", image: "/images/webDevSkills/tailwind.png" },
  { name: "Python",      image: "/images/backendDevSkills/python.png" },
  { name: "SQL",         image: "/images/backendDevSkills/sql.png" },
  { name: "AWS",         image: "/images/cloudSkills/aws.png" },
  { name: "Firebase",    image: "/images/cloudSkills/firebase.png" },
  { name: "Supabase",    image: "/images/cloudSkills/supabase.png" },
  { name: "Docker",      image: "/images/containerizationSkills/docker.png" },
  { name: "Git",         image: "/images/containerizationSkills/git.png" },
  { name: "Figma",       image: "/images/designSkills/figma.png" },
  { name: "Expo",        image: "/images/webDevSkills/expo.png" },
  { name: "Symfony",     image: "/images/backendDevSkills/symfony.png" },
  { name: "Bootstrap",   image: "/images/webDevSkills/bootstrap.png" },
];

// Desktop: 2 rows of 9 — doubled for seamless loop
const ROW_D1 = [...ALL_SKILLS.slice(0, 9), ...ALL_SKILLS.slice(0, 9)];
const ROW_D2 = [...ALL_SKILLS.slice(9),    ...ALL_SKILLS.slice(9)];

// Mobile: 3 rows of 6 — doubled for seamless loop
const ROW_M1 = [...ALL_SKILLS.slice(0, 6),  ...ALL_SKILLS.slice(0, 6)];
const ROW_M2 = [...ALL_SKILLS.slice(6, 12), ...ALL_SKILLS.slice(6, 12)];
const ROW_M3 = [...ALL_SKILLS.slice(12),    ...ALL_SKILLS.slice(12)];

const MASK = {
  maskImage:
    "linear-gradient(to right, transparent 0%, black 7%, black 93%, transparent 100%)",
  WebkitMaskImage:
    "linear-gradient(to right, transparent 0%, black 7%, black 93%, transparent 100%)",
} as const;

function Pill({ name, image }: { name: string; image: string }) {
  return (
    <div
      className="flex items-center gap-3 px-5 py-3 rounded-full shrink-0 mx-2 transition-colors duration-200"
      style={{
        border: "1px solid var(--border)",
        background: "var(--surface)",
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.borderColor = "rgba(139,92,246,0.3)";
        el.style.background = "var(--surface-2)";
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.borderColor = "var(--border)";
        el.style.background = "var(--surface)";
      }}
    >
      <Image
        src={image}
        alt={name}
        width={20}
        height={20}
        style={{ width: 20, height: 20, opacity: 0.85, objectFit: "contain" }}
      />
      <span
        className="text-sm font-medium whitespace-nowrap"
        style={{ color: "var(--muted)", fontFamily: "var(--font-mono)" }}
      >
        {name}
      </span>
    </div>
  );
}

function MarqueeRow({
  pills,
  direction,
  duration,
}: {
  pills: typeof ALL_SKILLS;
  direction: "fwd" | "rev";
  duration: number;
}) {
  return (
    <div className="overflow-hidden" style={MASK}>
      <div
        className={direction === "fwd" ? "flex marquee-fwd" : "flex marquee-rev"}
        style={{ animationDuration: `${duration}s` }}
      >
        {pills.map((s, i) => (
          <Pill key={i} {...s} />
        ))}
      </div>
    </div>
  );
}

export default function Skills() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section ref={ref} id="skills" className="py-20 md:py-32 overflow-hidden">
      {/* Heading */}
      <div className="px-6 md:px-12 max-w-7xl mx-auto mb-10 md:mb-16">
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
            02 / Skills
          </span>
          <div className="h-px w-14" style={{ background: "var(--border-accent)" }} />
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="text-4xl sm:text-5xl md:text-7xl font-bold leading-[1.05]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          The tools I{" "}
          <span className="text-gradient">reach for.</span>
        </motion.h2>
      </div>

      {/* Marquee rows */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        {/* ── Desktop: 2 rows of 9, 38 s ── */}
        <div className="hidden md:flex flex-col gap-4">
          <MarqueeRow pills={ROW_D1} direction="fwd" duration={38} />
          <MarqueeRow pills={ROW_D2} direction="rev" duration={38} />
        </div>

        {/* ── Mobile: 3 rows of 6, 20 s (faster) ── */}
        <div className="flex md:hidden flex-col gap-3">
          <MarqueeRow pills={ROW_M1} direction="fwd" duration={20} />
          <MarqueeRow pills={ROW_M2} direction="rev" duration={20} />
          <MarqueeRow pills={ROW_M3} direction="fwd" duration={20} />
        </div>
      </motion.div>
    </section>
  );
}
