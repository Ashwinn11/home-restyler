import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Room Restyler",
    short_name: "Restyler",
    description:
      "AI interior design app to restyle rooms, visualize paint, and generate design variations.",
    start_url: "/",
    display: "standalone",
    background_color: "#1C1917",
    theme_color: "#1C1917",
    icons: [
      {
        src: "/icon",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/apple-icon",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  };
}
