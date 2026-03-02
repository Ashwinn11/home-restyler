import { ImageResponse } from "next/og";

export const size = {
  width: 180,
  height: 180,
};

export const contentType = "image/png";

export default function AppleIcon() {
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
            width: 110,
            height: 110,
            borderRadius: 26,
            border: "2px solid rgba(245,240,235,0.5)",
            color: "#F5F0EB",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 54,
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
