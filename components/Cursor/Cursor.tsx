"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function Cursor() {
  const [visible, setVisible] = useState(false);
  const [hovering, setHovering] = useState(false);

  const mx = useMotionValue(-200);
  const my = useMotionValue(-200);

  const dotX = useSpring(mx, { stiffness: 600, damping: 30, mass: 0.3 });
  const dotY = useSpring(my, { stiffness: 600, damping: 30, mass: 0.3 });
  const ringX = useSpring(mx, { stiffness: 160, damping: 22, mass: 0.6 });
  const ringY = useSpring(my, { stiffness: 160, damping: 22, mass: 0.6 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mx.set(e.clientX);
      my.set(e.clientY);
      setVisible(true);
    };

    const onOver = (e: MouseEvent) => {
      const el = e.target as HTMLElement;
      setHovering(
        !!el.closest('a, button, [role="button"], input, label, select, textarea')
      );
    };

    const onLeave = () => setVisible(false);
    const onEnter = () => setVisible(true);

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseover", onOver);
    document.documentElement.addEventListener("mouseleave", onLeave);
    document.documentElement.addEventListener("mouseenter", onEnter);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      document.documentElement.removeEventListener("mouseenter", onEnter);
    };
  }, [mx, my]);

  return (
    <div className="cursor-layer pointer-events-none" aria-hidden>
      {/* Dot */}
      <motion.div
        className="fixed z-[9999] rounded-full"
        style={{
          x: dotX,
          y: dotY,
          translateX: "-50%",
          translateY: "-50%",
          width: hovering ? 10 : 6,
          height: hovering ? 10 : 6,
          background: hovering ? "#22d3ee" : "#8b5cf6",
          opacity: visible ? 1 : 0,
          transition: "width 0.18s, height 0.18s, background 0.18s, opacity 0.25s",
        }}
      />
      {/* Ring */}
      <motion.div
        className="fixed z-[9998] rounded-full"
        style={{
          x: ringX,
          y: ringY,
          translateX: "-50%",
          translateY: "-50%",
          width: hovering ? 52 : 36,
          height: hovering ? 52 : 36,
          border: `1.5px solid ${hovering ? "rgba(34,211,238,0.45)" : "rgba(139,92,246,0.4)"}`,
          opacity: visible ? 1 : 0,
          transition: "width 0.22s, height 0.22s, border-color 0.18s, opacity 0.25s",
        }}
      />
    </div>
  );
}
