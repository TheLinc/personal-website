import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import snapshot from "@/data/contributions.json";
import type { Calendar } from "@/lib/contributions";

// The link preview, built like the hero: name on the left, the bust in its shades on the right, quiet lines behind.
export const alt = "Lincoln Laylor, full-stack engineer who ships with agents, shown as a stone bust in yellow shutter shades";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const cal = snapshot as Calendar;
const og = (f: string) => readFileSync(join(process.cwd(), "assets/og", f));
const bust = `data:image/png;base64,${og("bust.png").toString("base64")}`;
const line = "#e2dccf";

export default function OGImage() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", position: "relative", background: "#fbfaf7", color: "#1d1c1a", fontFamily: "Plex" }}>
        {/* Background lines: horizon, guide, and the arc behind the head */}
        <div style={{ position: "absolute", left: 0, right: 0, top: 532, height: 1, background: line }} />
        <div style={{ position: "absolute", top: 0, bottom: 0, left: 72, width: 1, background: line }} />
        <div style={{ position: "absolute", left: 640, top: 130, width: 520, height: 520, borderRadius: 999, border: `1px solid ${line}` }} />

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={bust} alt="" width={674} height={600} style={{ position: "absolute", left: 540, bottom: 0 }} />

        <div style={{ position: "absolute", left: 72, top: 64, bottom: 56, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, alignSelf: "flex-start", background: "#fff", border: "1px solid #e8e3da", borderRadius: 999, padding: "10px 20px", fontSize: 21, color: "#4a4741" }}>
            <div style={{ width: 11, height: 11, borderRadius: 99, background: "#11a37f" }} />
            Shipping · {cal.total.toLocaleString("en-US")} contributions this year
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", flexDirection: "column", fontFamily: "Archivo", fontWeight: 800, fontSize: 132, lineHeight: 0.9, letterSpacing: -6.6 }}>
              <span>Lincoln</span>
              <span>Laylor.</span>
            </div>
            <div style={{ display: "flex", marginTop: 30, fontFamily: "Archivo", fontWeight: 700, fontSize: 40, letterSpacing: -1 }}>Ships with agents.</div>
            <div style={{ display: "flex", marginTop: 10, fontSize: 24, color: "#6d6962" }}>Full-stack engineer · Ottawa, Canada</div>
          </div>
          <div style={{ display: "flex", fontSize: 20, color: "#8a8478" }}>lincolnlaylor.com</div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Archivo", data: og("archivo-800.ttf"), weight: 800 },
        { name: "Archivo", data: og("archivo-700.ttf"), weight: 700 },
        { name: "Plex", data: og("plex-400.ttf"), weight: 400 },
      ],
    },
  );
}
