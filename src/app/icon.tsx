import { ImageResponse } from "next/og";

export const size = {
  width: 512,
  height: 512,
};

export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#1C1917",
          backgroundImage:
            "radial-gradient(circle at 80% 20%, rgba(196,101,58,0.35), transparent 45%), radial-gradient(circle at 20% 80%, rgba(139,155,126,0.32), transparent 40%)",
        }}
      >
        <div
          style={{
            width: 280,
            height: 280,
            borderRadius: 68,
            border: "4px solid rgba(245,240,235,0.5)",
            color: "#F5F0EB",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 120,
            fontFamily: "Georgia, serif",
            fontWeight: 700,
          }}
        >
          R
        </div>
      </div>
    ),
    size
  );
}
