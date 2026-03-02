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
          padding: 80,
          backgroundColor: "#0D0F0E", // ink
          backgroundImage:
            "radial-gradient(circle at top right, rgba(201,168,76,0.15), transparent 70%), radial-gradient(circle at bottom left, rgba(138,154,108,0.08), transparent 60%)",
          color: "#F0EBE3", // parchment
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ width: 40, height: 1, backgroundColor: "#C9A84C" }} />
          <div
            style={{
              fontSize: 24,
              letterSpacing: 8,
              textTransform: "uppercase",
              fontFamily: "serif",
              color: "#C9A84C",
            }}
          >
            Room Restyler
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "baseline",
              fontSize: 88,
              lineHeight: 1,
              maxWidth: 1000,
              fontFamily: "serif",
            }}
          >
            Conceptual <span style={{ fontStyle: "italic", marginLeft: 20 }}>Refinement</span>.
          </div>
          <div
            style={{
              fontSize: 32,
              lineHeight: 1.4,
              opacity: 0.8,
              fontWeight: 300,
              maxWidth: 800,
            }}
          >
            Turn a single room photo into a photoreal design concept with AI tuned for interior designers.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 24,
          }}
        >
          <div
            style={{
              padding: "16px 32px",
              backgroundColor: "#C9A84C",
              color: "#0D0F0E",
              fontSize: 18,
              letterSpacing: 4,
              textTransform: "uppercase",
              fontWeight: 600,
            }}
          >
            Professional Studio
          </div>
          <div style={{ fontSize: 18, color: "#C9A84C", opacity: 0.6, letterSpacing: 2 }}>
            Photoreal AI Workflow
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
