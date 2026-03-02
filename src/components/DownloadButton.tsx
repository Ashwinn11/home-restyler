"use client";

import { useCallback } from "react";

interface DownloadButtonProps {
  image: string;
}

export default function DownloadButton({ image }: DownloadButtonProps) {
  const handleDownload = useCallback(() => {
    const link = document.createElement("a");
    link.download = "room-restyler.png";
    link.href = `data:image/png;base64,${image}`;
    link.click();
  }, [image]);

  return (
    <button
      onClick={handleDownload}
      title="Download the generated image as PNG"
      className="group flex items-center gap-1.5 px-3.5 py-2 text-xs text-parchment border border-gold/25 bg-ink rounded-full hover:border-gold/50 hover:bg-gold/8 transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-gold/40"
    >
      <svg
        className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-y-0.5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
        />
      </svg>
      Download
    </button>
  );
}
