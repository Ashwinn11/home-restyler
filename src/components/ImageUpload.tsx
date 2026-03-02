"use client";

import { useCallback, useState } from "react";

interface ImageUploadProps {
  onImageSelected: (base64: string, mimeType: string) => void;
  currentImage?: string;
}

export default function ImageUpload({
  onImageSelected,
  currentImage,
}: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = useCallback(
    (file: File) => {
      if (!file.type.startsWith("image/")) return;
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        const base64 = result.split(",")[1];
        onImageSelected(base64, file.type);
      };
      reader.readAsDataURL(file);
    },
    [onImageSelected]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  if (currentImage) {
    return (
      <div className="relative w-full h-[320px] sm:h-[380px] lg:h-[520px] group overflow-hidden rounded-lg border border-parchment-faint/20 bg-ink-elevated">
        <img
          src={`data:image/jpeg;base64,${currentImage}`}
          alt="Uploaded room"
          className="block w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <button
          onClick={() => onImageSelected("", "")}
          className="absolute bottom-4 right-4 bg-gold text-ink px-4 py-2.5 text-[10px] font-semibold uppercase tracking-[0.15em] opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-300 translate-y-0 sm:translate-y-2 sm:group-hover:translate-y-0 cursor-pointer hover:bg-gold-soft focus:outline-none focus:ring-2 focus:ring-gold/50"
        >
          Change photo
        </button>
      </div>
    );
  }

  return (
    <label
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      className={`relative flex flex-col items-center justify-center w-full h-[320px] sm:h-[380px] lg:h-[520px] rounded-lg cursor-pointer transition-all duration-300 group bg-ink-elevated focus-within:ring-2 focus-within:ring-gold/40 ${isDragging
          ? "border-2 border-gold bg-gold/6 scale-[0.99]"
          : "border border-parchment-faint/15 hover:border-gold/30"
        }`}
    >
      {/* Architectural corner brackets */}
      <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-gold/25 group-hover:border-gold/50 transition-colors duration-300" />
      <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-gold/25 group-hover:border-gold/50 transition-colors duration-300" />
      <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-gold/25 group-hover:border-gold/50 transition-colors duration-300" />
      <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-gold/25 group-hover:border-gold/50 transition-colors duration-300" />

      {/* Hover gradient sweep */}
      <div className="absolute inset-0 bg-gradient-to-t from-gold/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-lg" />

      <div className="relative flex flex-col items-center gap-5 text-parchment-muted group-hover:text-parchment transition-colors duration-300">
        <div className="relative">
          <svg
            className="w-10 h-10 transition-transform duration-300 group-hover:-translate-y-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth={0.8}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z"
            />
          </svg>
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-5 h-px bg-gold/30 transition-all duration-300 group-hover:w-9 group-hover:bg-gold/60" />
        </div>
        <div className="text-center space-y-1.5">
          <p className="text-[11px] uppercase tracking-[0.2em] font-medium text-parchment">
            Drop your room photo here
          </p>
          <p className="text-[11px] text-parchment-muted font-light">
            or click to browse
          </p>
        </div>
      </div>
      <input
        type="file"
        className="hidden"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
      />
    </label>
  );
}
