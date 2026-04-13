"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCards } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-cards";

interface Project {
  name: string;
  desc: string;
  tags: string[];
  image: string;
  images?: string[];
  link?: string;
  inDev?: boolean;
  imageWidth?: number;
  imageHeight?: number;
  accent: string;
}

const PROJECTS: Project[] = [
  {
    name: "FollowIQ",
    desc: "AI-powered recruiter email sequence generator. Recruiters manage a candidate pipeline and generate personalized 3-email follow-up sequences via Claude in seconds.",
    tags: [
      "Next.js",
      "TypeScript",
      "Anthropic Claude",
      "Stripe",
      "Drizzle",
      "Neon",
    ],
    image: "/images/projects/followiq/followiq-icon-white-bg.png",
    images: [
      "/images/projects/followiq/today.png",
      "/images/projects/followiq/generation.png",
      "/images/projects/followiq/generation-pipeline-save.png",
      "/images/projects/followiq/candidate-profile.png",
      "/images/projects/followiq/pipeline.png",
      "/images/projects/followiq/linkedIn-generation.png",
      "/images/projects/followiq/candidates.png",
      "/images/projects/followiq/candidates-import.png",
    ],
    link: "https://followiq.app",
    inDev: true,
    imageWidth: 1000,
    imageHeight: 500,
    accent: "#6366f1",
  },
  {
    name: "Spotlight",
    desc: "Mobile app merging YouTube and Netflix features, enabling creators to upload and organize amateur content into structured shows.",
    tags: ["React Native", "Expo", "Firebase", "Supabase"],
    image: "/images/projects/spotlightV1/spotlight-logo.png",
    images: [
      "/images/projects/spotlightV1/spotlight1.png",
      "/images/projects/spotlightV1/spotlight2.png",
      "/images/projects/spotlightV1/spotlight3.png",
      "/images/projects/spotlightV1/spotlight4.png",
      "/images/projects/spotlightV1/spotlight5.png",
    ],
    imageWidth: 234,
    imageHeight: 506,
    accent: "#8b5cf6",
  },
  {
    name: "Mask Detection Model",
    desc: "ML model detecting mask-wearing in real time using TensorFlow, Keras, and Sklearn with deep learning layers for high classification accuracy.",
    tags: ["Python", "TensorFlow", "Keras", "Sklearn"],
    image: "/images/projects/maskDetection/mask.png",
    images: ["/images/projects/maskDetection/maskDetection1.png"],
    link: "https://github.com/TheLinc/Mask_Detection_ML",
    imageWidth: 1000,
    imageHeight: 500,
    accent: "#f59e0b",
  },
  {
    name: "NuViu — Smart Cane",
    desc: "IoT assistive device using ultrasonic sensors and NVIDIA Jetson to detect obstacles and read signs via ML, relaying audio feedback to the user.",
    tags: ["Arduino", "Python", "ML", "3D Printing", "XBee"],
    image: "/images/projects/white-cane.png",
    accent: "#10b981",
  },
];

// ─── Lightbox ──────────────────────────────────────────────────────────────

function Lightbox({
  images,
  initialIndex,
  projectName,
  imageWidth,
  imageHeight,
  onClose,
}: {
  images: string[];
  initialIndex: number;
  projectName: string;
  imageWidth: number;
  imageHeight: number;
  onClose: () => void;
}) {
  const [idx, setIdx] = useState(initialIndex);
  const hasPrev = idx > 0;
  const hasNext = idx < images.length - 1;

  // Lock body scroll while open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  // Keyboard: Escape = close, arrows = navigate
  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft" && hasPrev) setIdx((i) => i - 1);
      if (e.key === "ArrowRight" && hasNext) setIdx((i) => i + 1);
    },
    [hasPrev, hasNext, onClose],
  );
  useEffect(() => {
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [handleKey]);

  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center"
      style={{
        zIndex: 9990,
        background: "rgba(0,0,0,0.92)",
        backdropFilter: "blur(12px)",
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={onClose}
    >
      {/* Image */}
      <motion.div
        initial={{ scale: 0.93, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.93, opacity: 0 }}
        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        onClick={(e) => e.stopPropagation()}
        className="relative"
      >
        <Image
          src={images[idx]}
          alt={`${projectName} screenshot ${idx + 1}`}
          width={imageWidth}
          height={imageHeight}
          priority
          style={{
            maxWidth: "min(92vw, 1100px)",
            maxHeight: "82vh",
            width: "auto",
            height: "auto",
            display: "block",
            borderRadius: 10,
            boxShadow: "0 32px 80px rgba(0,0,0,0.7)",
          }}
        />

        {/* Slide counter */}
        {images.length > 1 && (
          <div
            className="absolute bottom-3 left-1/2 -translate-x-1/2 text-[11px] px-3 py-1 rounded-full pointer-events-none"
            style={{
              background: "rgba(0,0,0,0.55)",
              backdropFilter: "blur(6px)",
              color: "rgba(255,255,255,0.6)",
              fontFamily: "var(--font-mono)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            {idx + 1} / {images.length}
          </div>
        )}
      </motion.div>

      {/* Prev */}
      {hasPrev && (
        <motion.button
          onClick={(e) => {
            e.stopPropagation();
            setIdx((i) => i - 1);
          }}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.94 }}
          className="absolute top-1/2 -translate-y-1/2 left-3 md:left-5 w-10 h-10 rounded-full flex items-center justify-center"
          style={{
            background: "rgba(255,255,255,0.07)",
            border: "1px solid rgba(255,255,255,0.13)",
            color: "rgba(255,255,255,0.75)",
            fontSize: 18,
          }}
        >
          ←
        </motion.button>
      )}

      {/* Next */}
      {hasNext && (
        <motion.button
          onClick={(e) => {
            e.stopPropagation();
            setIdx((i) => i + 1);
          }}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.94 }}
          className="absolute top-1/2 -translate-y-1/2 right-3 md:right-5 w-10 h-10 rounded-full flex items-center justify-center"
          style={{
            background: "rgba(255,255,255,0.07)",
            border: "1px solid rgba(255,255,255,0.13)",
            color: "rgba(255,255,255,0.75)",
            fontSize: 18,
          }}
        >
          →
        </motion.button>
      )}

      {/* Close */}
      <motion.button
        onClick={onClose}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.92 }}
        className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center text-sm"
        style={{
          background: "rgba(255,255,255,0.07)",
          border: "1px solid rgba(255,255,255,0.13)",
          color: "rgba(255,255,255,0.7)",
        }}
      >
        ✕
      </motion.button>
    </motion.div>
  );
}

// ─── ProjectName ────────────────────────────────────────────────────────────

/** Renders a project name, swapping any trailing "IQ" to the mono font
 *  so the display font's stylised Q doesn't look out of place. */
function ProjectName({ name }: { name: string }) {
  if (!name.endsWith("IQ")) return <>{name}</>;
  return (
    <>
      {name.slice(0, -2)}
      <span style={{ fontFamily: "var(--font-mono)", fontWeight: 700 }}>
        IQ
      </span>
    </>
  );
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const inView = useInView(cardRef, { once: true, margin: "-60px" });
  const [hovered, setHovered] = useState(false);
  const [glowPos, setGlowPos] = useState({ x: "50%", y: "50%" });
  // Lightbox: null = closed, number = open at that slide index
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  // Track active Swiper slide so lightbox opens at the visible slide
  const [activeSlide, setActiveSlide] = useState(0);

  const hasImages = !!project.images?.length;
  const isLandscape = (project.imageWidth ?? 1) >= (project.imageHeight ?? 1);

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    setGlowPos({
      x: `${((e.clientX - r.left) / r.width) * 100}%`,
      y: `${((e.clientY - r.top) / r.height) * 100}%`,
    });
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 44 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.65,
        delay: Math.min(index * 0.08, 0.28),
        ease: [0.22, 1, 0.36, 1],
      }}
      className="relative rounded-3xl overflow-hidden"
      style={{
        border: "1px solid var(--border)",
        background: "var(--surface)",
      }}
      onMouseMove={onMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Cursor glow */}
      <div
        className="absolute inset-0 pointer-events-none z-10 rounded-3xl"
        style={{
          background: `radial-gradient(circle at ${glowPos.x} ${glowPos.y}, rgba(255,255,255,0.036) 0%, transparent 52%)`,
          opacity: hovered ? 1 : 0,
          transition: "opacity 0.3s",
        }}
      />

      {/* Accent top bar */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px] z-20"
        style={{
          background: `linear-gradient(to right, ${project.accent}00, ${project.accent}, ${project.accent}00)`,
          opacity: hovered ? 1 : 0,
          transition: "opacity 0.3s",
        }}
      />

      {/* ── Body ─────────────────────────────────────────── */}
      <div className="p-5 md:p-6 flex flex-col-reverse md:flex-row md:items-stretch gap-5 md:gap-6">
        {/* ── Left: info ───────────────────────────────── */}
        {/* relative so the ghost number is scoped inside this column */}
        <div className="relative flex flex-col flex-1 min-w-0">
          {/* Ghost number — top-right corner, purely decorative, never touches left-aligned content */}
          <div
            className="absolute top-0 right-0 select-none pointer-events-none leading-none"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(96px, 9vw, 130px)",
              color: `${project.accent}20`,
              letterSpacing: "-0.05em",
              lineHeight: 1,
              zIndex: 0,
              transform: "translate(4px, -6px)",
            }}
          >
            {String(index + 1).padStart(2, "0")}
          </div>

          {/* All readable content — left-aligned, clear of ghost number */}
          <div
            className="relative flex flex-col flex-1 min-w-0"
            style={{ zIndex: 1 }}
          >
            {/* Title row */}
            <div className="flex items-center gap-3 mb-3 flex-wrap">
              {/* Logo — 48 × 48, large enough to read clearly */}
              <div
                className="w-12 h-12 rounded-2xl overflow-hidden flex items-center justify-center shrink-0"
                style={{
                  background: "var(--surface-2)",
                  border: `1px solid ${project.accent}30`,
                }}
              >
                <Image
                  src={project.image}
                  alt={project.name}
                  width={42}
                  height={42}
                  style={{
                    width: "auto",
                    height: "auto",
                    objectFit: "contain",
                  }}
                />
              </div>

              <div className="flex flex-col gap-1">
                <h3
                  className="text-xl font-bold leading-tight"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  <ProjectName name={project.name} />
                </h3>
                {project.inDev && (
                  <span
                    className="text-[10px] px-2 py-0.5 rounded-full tracking-wide w-fit"
                    style={{
                      background: "rgba(74,222,128,0.1)",
                      border: "1px solid rgba(74,222,128,0.28)",
                      color: "#4ade80",
                      fontFamily: "var(--font-mono)",
                    }}
                  >
                    In Dev
                  </span>
                )}
              </div>
            </div>

            {/* Description */}
            <p
              className="text-sm leading-relaxed"
              style={{ color: "var(--muted)", maxWidth: "58ch" }}
            >
              {project.desc}
            </p>

            {/* Spacer pushes tags + CTA to the bottom */}
            <div className="flex-1 min-h-[16px]" />

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5 mb-3">
              {project.tags.map((t) => (
                <span
                  key={t}
                  className="text-[11px] px-2 py-0.5 rounded-full"
                  style={{
                    background: `${project.accent}12`,
                    border: `1px solid ${project.accent}26`,
                    color: project.accent,
                    fontFamily: "var(--font-mono)",
                  }}
                >
                  {t}
                </span>
              ))}
            </div>

            {/* CTA */}
            {project.link && (
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-medium w-fit"
                style={{
                  color: project.accent,
                  fontFamily: "var(--font-mono)",
                  opacity: 0.82,
                  transition: "opacity 0.15s",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.opacity = "1";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.opacity = "0.82";
                }}
              >
                <span>
                  {project.link.includes("github")
                    ? "View on GitHub"
                    : "Visit Project"}
                </span>
                <motion.span
                  animate={hovered ? { x: 4 } : { x: 0 }}
                  transition={{ duration: 0.18 }}
                >
                  →
                </motion.span>
              </a>
            )}
          </div>
        </div>

        {/* ── Right: screenshots ───────────────────────── */}
        {hasImages && (
          <div
            className={`flex items-center justify-center shrink-0 ${
              isLandscape ? "w-full md:w-[44%]" : "w-full md:w-auto"
            }`}
          >
            {isLandscape ? (
              /* Desktop / landscape screenshots */
              <div
                className="relative w-full rounded-xl"
                style={{
                  aspectRatio: "2 / 1",
                  overflow: "hidden",
                  cursor: "zoom-in",
                }}
              >
                <Swiper
                  grabCursor
                  loop={project.images!.length > 1}
                  onSlideChange={(s) => setActiveSlide(s.realIndex)}
                  style={{
                    width: "100%",
                    height: "100%",
                    borderRadius: "inherit",
                  }}
                >
                  {project.images!.map((img, i) => (
                    <SwiperSlide
                      key={i}
                      style={{
                        position: "relative",
                        width: "100%",
                        height: "100%",
                        overflow: "hidden",
                        borderRadius: "inherit",
                      }}
                      onClick={() => setLightboxIdx(activeSlide)}
                    >
                      <Image
                        src={img}
                        alt={`${project.name} screenshot ${i + 1}`}
                        fill
                        sizes="(max-width: 768px) 100vw, 44vw"
                        style={{
                          objectFit: "cover",
                          objectPosition: "top center",
                        }}
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>

                {/* Expand hint + slide count */}
                <div
                  className="absolute bottom-2 right-2 z-10 flex items-center gap-1.5 text-[10px] px-2 py-0.5 rounded-full pointer-events-none"
                  style={{
                    background: "rgba(0,0,0,0.52)",
                    backdropFilter: "blur(6px)",
                    color: "rgba(255,255,255,0.6)",
                    fontFamily: "var(--font-mono)",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  {project.images!.length > 1 && (
                    <span>{project.images!.length} screens · swipe ·</span>
                  )}
                  <span>click to expand</span>
                </div>
              </div>
            ) : (
              /* Mobile / portrait screenshots — card stack */
              <Swiper
                effect="cards"
                grabCursor
                modules={[EffectCards]}
                onSlideChange={(s) => setActiveSlide(s.realIndex)}
                style={{
                  width: "min(180px, 46vw)",
                  borderRadius: 14,
                  overflow: "hidden",
                  flexShrink: 0,
                  cursor: "zoom-in",
                }}
              >
                {project.images!.map((img, i) => (
                  <SwiperSlide
                    key={i}
                    style={{ borderRadius: 14, overflow: "hidden" }}
                    onClick={() => setLightboxIdx(activeSlide)}
                  >
                    <Image
                      src={img}
                      alt={`${project.name} screenshot ${i + 1}`}
                      width={project.imageWidth ?? 234}
                      height={project.imageHeight ?? 506}
                      style={{
                        width: "100%",
                        height: "auto",
                        display: "block",
                      }}
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            )}
          </div>
        )}
      </div>

      {/* Lightbox portal */}
      <AnimatePresence>
        {lightboxIdx !== null && project.images && (
          <Lightbox
            images={project.images}
            initialIndex={lightboxIdx}
            projectName={project.name}
            imageWidth={project.imageWidth ?? (isLandscape ? 1000 : 234)}
            imageHeight={project.imageHeight ?? (isLandscape ? 500 : 506)}
            onClose={() => setLightboxIdx(null)}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function Projects() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section ref={ref} id="projects" className="py-20 md:py-32 px-6 md:px-12">
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
            04 / Projects
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
          Things I&apos;ve <span className="text-gradient">built.</span>
        </motion.h2>

        <div className="flex flex-col gap-4">
          {PROJECTS.map((p, i) => (
            <ProjectCard key={p.name} project={p} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
