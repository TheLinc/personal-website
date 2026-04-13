import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#080808",
          borderRadius: 7,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Subtle purple glow behind the letters */}
        <div
          style={{
            position: "absolute",
            top: -6,
            left: -6,
            width: 28,
            height: 28,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(139,92,246,0.45) 0%, transparent 70%)",
            filter: "blur(4px)",
          }}
        />

        {/* "LL" monogram — gradient fill via SVG */}
        <svg
          width="22"
          height="18"
          viewBox="0 0 22 18"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ position: "relative" }}
        >
          <defs>
            <linearGradient id="g" x1="0" y1="0" x2="22" y2="18" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#a78bfa" />
              <stop offset="100%" stopColor="#22d3ee" />
            </linearGradient>
          </defs>
          {/* First L */}
          <rect x="0" y="0" width="3" height="14" rx="1" fill="url(#g)" />
          <rect x="0" y="11" width="8" height="3" rx="1" fill="url(#g)" />
          {/* Second L */}
          <rect x="11" y="0" width="3" height="14" rx="1" fill="url(#g)" />
          <rect x="11" y="11" width="8" height="3" rx="1" fill="url(#g)" />
        </svg>
      </div>
    ),
    { ...size }
  );
}
