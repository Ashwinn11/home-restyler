"use client";

import { useState } from "react";

const STYLES = [
  {
    name: "Modern Minimalist",
    description: "Clean lines, neutral tones, minimal furniture",
    tag: "MINIMAL",
  },
  {
    name: "Japandi",
    description: "Japanese + Scandinavian, warm wood, simple forms",
    tag: "HYBRID",
  },
  {
    name: "Bohemian",
    description: "Colorful textiles, plants, eclectic mix",
    tag: "ECLECTIC",
  },
  {
    name: "Industrial",
    description: "Exposed brick, metal accents, raw concrete",
    tag: "RAW",
  },
  {
    name: "Mid-Century Modern",
    description: "Retro furniture, warm colors, organic shapes",
    tag: "RETRO",
  },
  {
    name: "Coastal",
    description: "Light blues, whites, natural textures",
    tag: "ORGANIC",
  },
];

interface StyleSelectorProps {
  onStyleSelected: (style: string, customPrompt?: string) => void;
  disabled?: boolean;
}

export default function StyleSelector({
  onStyleSelected,
  disabled,
}: StyleSelectorProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const [customStyle, setCustomStyle] = useState("");

  const handleSelect = (style: (typeof STYLES)[number]) => {
    setSelected(style.name);
    setCustomStyle("");
    onStyleSelected(style.name);
  };

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {STYLES.map((style, i) => (
          <button
            key={style.name}
            onClick={() => handleSelect(style)}
            disabled={disabled}
            className={`group relative text-left p-5 sm:p-6 min-h-28 rounded-lg border transition-all duration-250 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed animate-reveal-up focus:outline-none focus:ring-2 focus:ring-gold/40 overflow-hidden ${selected === style.name
              ? "bg-gold border-gold shadow-[0_0_20px_rgba(201,168,76,0.15)]"
              : "border-parchment-faint/15 hover:border-parchment-faint/30 bg-ink-elevated hover:bg-ink-elevated/80"
              }`}
            style={{ animationDelay: `${i * 45}ms` }}
          >
            <span className={`text-[9px] uppercase tracking-[0.2em] font-medium transition-colors duration-250 ${selected === style.name ? "text-ink/60" : "text-parchment-muted"}`}>
              {style.tag}
            </span>
            <h3 className={`font-display text-lg mt-2 leading-tight font-medium transition-colors duration-250 ${selected === style.name ? "text-ink" : "text-parchment"}`}>
              {style.name}
            </h3>
            <p className={`text-xs mt-1.5 leading-relaxed font-light transition-colors duration-250 ${selected === style.name ? "text-ink/80" : "text-parchment/75"}`}>
              {style.description}
            </p>
          </button>
        ))}
      </div>

      {/* Custom style input */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center bg-ink-elevated border border-parchment-faint/15 rounded-lg p-3.5">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Describe your own style..."
            value={customStyle}
            onChange={(e) => setCustomStyle(e.target.value)}
            disabled={disabled}
            className="w-full bg-transparent border-b border-parchment-faint/25 focus:border-gold px-0 py-3 text-sm text-parchment placeholder:text-parchment-muted/50 focus:outline-none transition-colors disabled:opacity-40"
            onKeyDown={(e) => {
              if (e.key === "Enter" && customStyle.trim()) {
                setSelected(null);
                onStyleSelected("Custom", customStyle.trim());
              }
            }}
          />
        </div>
        <button
          onClick={() => {
            if (customStyle.trim()) {
              setSelected(null);
              onStyleSelected("Custom", customStyle.trim());
            }
          }}
          disabled={disabled || !customStyle.trim()}
          className="w-full sm:w-auto px-6 py-3 min-h-11 bg-gold text-ink text-[10px] uppercase tracking-[0.18em] font-semibold hover:bg-gold-soft disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gold/40"
        >
          Apply
        </button>
      </div>
    </div>
  );
}
