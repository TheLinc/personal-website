import { ImageResponse } from "next/og";
import snapshot from "@/data/contributions.json";
import { maxCount, type Calendar } from "@/lib/contributions";

export const alt = "Lincoln Laylor — full-stack engineer building agentic AI tooling";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const cal = snapshot as Calendar;

export default function OGImage() {
  const max = maxCount(cal);
  const days = (y: number) => cal.weeks.map((w) => w[y]);
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0b0b0a",
          color: "#ecebe6",
          padding: "64px 72px",
          fontFamily: "monospace",
        }}
      >
        <div style={{ display: "flex", fontSize: 18, letterSpacing: 2, color: "rgba(236,235,230,0.55)" }}>
          FIG. 1 — {cal.total.toLocaleString("en-US")} GITHUB CONTRIBUTIONS, LAST 12 MONTHS
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 112, fontWeight: 800, letterSpacing: -4, lineHeight: 1 }}>
            LINCOLN LAYLOR
          </div>
          <div style={{ display: "flex", fontSize: 30, marginTop: 20, color: "#ecebe6" }}>
            Full-stack engineer. I build agentic AI tooling and the products around it.
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {Array.from({ length: 7 }, (_, y) => (
            <div key={y} style={{ display: "flex", gap: 4 }}>
              {days(y).map((d, x) => {
                const t = d && max > 0 ? Math.sqrt(d.count / max) : 0;
                return (
                  <div
                    key={x}
                    style={{
                      width: 15.5,
                      height: 15.5,
                      background: !d || d.count === 0 ? "rgba(236,235,230,0.07)" : "#ff5b1f",
                      opacity: !d || d.count === 0 ? 1 : 0.25 + 0.75 * t,
                    }}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>
    ),
    size,
  );
}
