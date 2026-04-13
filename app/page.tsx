"use client";

import { motion, useScroll } from "framer-motion";
import Cursor from "@/components/Cursor/Cursor";
import Nav from "@/components/Nav/Nav";
import Hero from "@/components/Hero/Hero";
import About from "@/components/About/About";
import Skills from "@/components/Skills/Skills";
import Experience from "@/components/Experience/Experience";
import Projects from "@/components/Projects/Projects";
import Testimonials from "@/components/Testimonials/Testimonials";
import Contact from "@/components/Contact/Contact";

export default function Home() {
  const { scrollYProgress } = useScroll();

  return (
    <>
      {/* Custom cursor — hidden on touch devices via CSS */}
      <Cursor />

      {/* Thin scroll-progress bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 z-[9997] h-[2px] origin-left"
        style={{
          scaleX: scrollYProgress,
          background: "linear-gradient(to right, #8b5cf6, #22d3ee)",
        }}
      />

      {/* Navigation */}
      <Nav />

      <main>
        <Hero />

        {/* Subtle divider between sections */}
        <div
          className="max-w-7xl mx-auto px-6 md:px-12"
          style={{ borderTop: "1px solid var(--border)" }}
        />

        <About />

        <div
          className="max-w-7xl mx-auto px-6 md:px-12"
          style={{ borderTop: "1px solid var(--border)" }}
        />

        <Skills />

        <div
          className="max-w-7xl mx-auto px-6 md:px-12"
          style={{ borderTop: "1px solid var(--border)" }}
        />

        <Experience />

        <div
          className="max-w-7xl mx-auto px-6 md:px-12"
          style={{ borderTop: "1px solid var(--border)" }}
        />

        <Projects />

        <div
          className="max-w-7xl mx-auto px-6 md:px-12"
          style={{ borderTop: "1px solid var(--border)" }}
        />

        <Testimonials />

        <div
          className="max-w-7xl mx-auto px-6 md:px-12"
          style={{ borderTop: "1px solid var(--border)" }}
        />

        <Contact />
      </main>

      <footer
        className="py-8 px-6 md:px-12 text-center"
        style={{
          borderTop: "1px solid var(--border)",
          color: "var(--subtle)",
          fontFamily: "var(--font-mono)",
          fontSize: "0.75rem",
          letterSpacing: "0.06em",
        }}
      >
        <p>© 2025 Lincoln Laylor — Built with Next.js, Tailwind CSS &amp; Framer Motion.</p>
      </footer>
    </>
  );
}
