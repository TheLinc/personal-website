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
          background: "#fbfaf7",
          color: "#1d1c1a",
          fontSize: 84,
          fontWeight: 800,
          fontFamily: "monospace",
        }}
      >
        LL<span style={{ color: "#5b5bf0" }}>/</span>
      </div>
    ),
    size,
  );
}
