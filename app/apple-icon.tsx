import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 180,
          height: 180,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#080808",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Purple aurora — top left */}
        <div
          style={{
            position: "absolute",
            top: -30,
            left: -30,
            width: 140,
            height: 140,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(139,92,246,0.38) 0%, transparent 68%)",
            filter: "blur(28px)",
          }}
        />
        {/* Cyan aurora — bottom right */}
        <div
          style={{
            position: "absolute",
            bottom: -20,
            right: -20,
            width: 110,
            height: 110,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(34,211,238,0.28) 0%, transparent 68%)",
            filter: "blur(22px)",
          }}
        />

        {/* "LL" monogram */}
        <svg
          width="108"
          height="90"
          viewBox="0 0 108 90"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ position: "relative" }}
        >
          <defs>
            <linearGradient id="g" x1="0" y1="0" x2="108" y2="90" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#a78bfa" />
              <stop offset="100%" stopColor="#22d3ee" />
            </linearGradient>
          </defs>
          {/* First L */}
          <rect x="0"  y="0" width="16" height="70" rx="5" fill="url(#g)" />
          <rect x="0"  y="55" width="42" height="16" rx="5" fill="url(#g)" />
          {/* Second L */}
          <rect x="56" y="0" width="16" height="70" rx="5" fill="url(#g)" />
          <rect x="56" y="55" width="42" height="16" rx="5" fill="url(#g)" />
        </svg>
      </div>
    ),
    { ...size }
  );
}
