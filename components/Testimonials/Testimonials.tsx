"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const PLACEHOLDERS = [
  {
    quote:
      "I’ve had the pleasure of working closely with Lincoln Laylor at Opinion System, and he’s genuinely great to collaborate with. He brings strong technical expertise, a lot of patience, and a positive attitude to everything he does. Lincoln quickly understands challenges and always comes forward with thoughtful solutions that improve both the product and the team’s workflow. I’ve seen him grow from a front-end developer into a confident full stack leader, and working with him has been an awesome experience",
    name: "Arif Lalani",
    role: "Lead UI/UX Designer, Opinion System",
    initial: "A",
  },
  {
    quote:
      "Working with Lincoln over the past 3 years at Opinion System has been a great experience. Starting as a frontend developer, he quickly grew into a strong full stack developer capable of handling complex projects across the stack. Lincoln consistently demonstrates strong technical skills, ownership, and a collaborative mindset. He’s reliable, adaptable, and someone I trust to deliver high-quality work on challenging problems.",
    name: "Mathieu Martel",
    role: "Senior Software Developer, Opinion System",
    initial: "M",
  },
  {
    quote:
      "Lincoln translated our Figma designs into pixel-perfect React components faster than anyone I've worked with. He also flagged a data-flow issue in the REST integration that would have been a headache to debug later. Great instincts all around.",
    name: "Amélie Fontaine",
    role: "Lead Developer, Trading Central",
    initial: "A",
  },
];

export default function Testimonials() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section
      ref={ref}
      id="testimonials"
      className="py-20 md:py-32 px-6 md:px-12"
    >
      <div className="max-w-7xl mx-auto">
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
            05 / Testimonials
          </span>
          <div
            className="h-px w-14"
            style={{ background: "var(--border-accent)" }}
          />
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="text-4xl sm:text-5xl md:text-7xl font-bold mb-10 md:mb-16 leading-[1.05]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          What people <span className="text-gradient">say.</span>
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {PLACEHOLDERS.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.65,
                delay: 0.15 + i * 0.12,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="rounded-2xl p-6 flex flex-col gap-5"
              style={{
                border: "1px solid var(--border)",
                background: "var(--surface)",
              }}
            >
              {/* Opening quote */}
              <span
                className="text-5xl font-bold leading-none"
                style={{
                  color: "rgba(139,92,246,0.18)",
                  fontFamily: "var(--font-display)",
                  lineHeight: 0.9,
                }}
              >
                &ldquo;
              </span>

              <p
                className="text-sm leading-relaxed flex-1 italic"
                style={{ color: "var(--muted)" }}
              >
                {item.quote}
              </p>

              {/* Attribution */}
              <div
                className="flex items-center gap-3 pt-4"
                style={{ borderTop: "1px solid var(--border)" }}
              >
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
                  style={{
                    background: "rgba(139,92,246,0.14)",
                    color: "var(--accent)",
                    fontFamily: "var(--font-display)",
                  }}
                >
                  {item.initial}
                </div>
                <div>
                  <p
                    className="text-sm font-semibold"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {item.name}
                  </p>
                  <p
                    className="text-xs mt-0.5"
                    style={{
                      color: "var(--muted)",
                      fontFamily: "var(--font-mono)",
                    }}
                  >
                    {item.role}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
