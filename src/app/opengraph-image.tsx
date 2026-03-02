import { ImageResponse } from "next/og";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 56,
          backgroundColor: "#1C1917",
          backgroundImage:
            "radial-gradient(circle at 80% 20%, rgba(196,101,58,0.35), transparent 45%), radial-gradient(circle at 20% 80%, rgba(139,155,126,0.32), transparent 40%)",
          color: "#F5F0EB",
          fontFamily: "Georgia, serif",
        }}
      >
        <div
          style={{
            fontSize: 24,
            letterSpacing: 3,
            textTransform: "uppercase",
            opacity: 0.9,
          }}
        >
          Room Restyler
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ fontSize: 72, lineHeight: 1.05, maxWidth: 900 }}>
            AI Interior Design From One Room Photo
          </div>
          <div
            style={{
              fontSize: 28,
              lineHeight: 1.3,
              opacity: 0.9,
              fontFamily: "Helvetica Neue, Arial, sans-serif",
            }}
          >
            Upload. Restyle. Refine. Export.
          </div>
        </div>

        <div
          style={{
            alignSelf: "flex-start",
            padding: "10px 18px",
            border: "1px solid rgba(245, 240, 235, 0.3)",
            borderRadius: 999,
            fontSize: 18,
            letterSpacing: 2,
            textTransform: "uppercase",
            fontFamily: "Helvetica Neue, Arial, sans-serif",
          }}
        >
          AI Room Makeovers
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
