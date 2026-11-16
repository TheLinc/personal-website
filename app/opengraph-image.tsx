import { ImageResponse } from "next/og";
import snapshot from "@/data/contributions.json";
import { maxCount, type Calendar } from "@/lib/contributions";

export const alt = "Lincoln Laylor: full-stack engineer building AI products";
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
          background: "#fbfaf7",
          color: "#1d1c1a",
          padding: "64px 72px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 22, color: "#6d6962" }}>
          <div style={{ width: 12, height: 12, borderRadius: 99, background: "#11a37f" }} />
          Shipping · {cal.total.toLocaleString("en-US")} contributions this year
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 104, fontWeight: 700, letterSpacing: -3, lineHeight: 1 }}>Lincoln Laylor</div>
          <div style={{ display: "flex", fontSize: 34, marginTop: 20 }}>
            Full-stack engineer. I build AI products, and the agent workflows that ship them.
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
                      borderRadius: 3,
                      background: !d || d.count === 0 ? "#efebe3" : `rgba(91, 91, 240, ${0.25 + 0.75 * t})`,
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
