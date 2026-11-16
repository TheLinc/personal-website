import { ImageResponse } from "next/og";

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
          background: "#0b0b0a",
          color: "#ecebe6",
          fontSize: 84,
          fontWeight: 800,
          fontFamily: "monospace",
        }}
      >
        LL<span style={{ color: "#ff5b1f" }}>/</span>
      </div>
    ),
    size,
  );
}
