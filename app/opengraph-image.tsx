import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Lincoln Laylor — Full Stack Developer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#080808",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px 90px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Purple aurora blob — top left */}
        <div
          style={{
            position: "absolute",
            top: -120,
            left: -80,
            width: 560,
            height: 560,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(139,92,246,0.28) 0%, transparent 68%)",
            filter: "blur(60px)",
          }}
        />
        {/* Cyan aurora blob — bottom right */}
        <div
          style={{
            position: "absolute",
            bottom: -100,
            right: -60,
            width: 480,
            height: 480,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(34,211,238,0.22) 0%, transparent 68%)",
            filter: "blur(60px)",
          }}
        />

        {/* Content */}
        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          {/* Eyebrow */}
          <div
            style={{
              fontSize: 16,
              color: "rgba(139,92,246,0.9)",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              fontFamily: "monospace",
              marginBottom: 24,
            }}
          >
            lincolnlaylor.com
          </div>

          {/* Name */}
          <div
            style={{
              fontSize: 88,
              fontWeight: 800,
              color: "#efefef",
              lineHeight: 1,
              letterSpacing: "-0.03em",
              marginBottom: 20,
            }}
          >
            Lincoln Laylor
          </div>

          {/* Title with gradient via layered divs */}
          <div
            style={{
              fontSize: 32,
              fontWeight: 600,
              background: "linear-gradient(120deg, #a78bfa 0%, #22d3ee 100%)",
              backgroundClip: "text",
              color: "transparent",
              marginBottom: 44,
              letterSpacing: "-0.01em",
            }}
          >
            Full Stack Developer
          </div>

          {/* Skill pills */}
          <div style={{ display: "flex", gap: 12 }}>
            {["React", "Next.js", "TypeScript", "Node.js", "React Native"].map(
              (tag) => (
                <div
                  key={tag}
                  style={{
                    fontSize: 15,
                    padding: "6px 16px",
                    borderRadius: 9999,
                    background: "rgba(139,92,246,0.12)",
                    border: "1px solid rgba(139,92,246,0.3)",
                    color: "#a78bfa",
                    fontFamily: "monospace",
                  }}
                >
                  {tag}
                </div>
              )
            )}
          </div>
        </div>

        {/* Bottom-right: available label */}
        <div
          style={{
            position: "absolute",
            bottom: 48,
            right: 90,
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: "#4ade80",
              boxShadow: "0 0 8px rgba(74,222,128,0.8)",
            }}
          />
          <span
            style={{
              fontSize: 14,
              color: "rgba(239,239,239,0.45)",
              fontFamily: "monospace",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
            }}
          >
            Available for opportunities
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}
