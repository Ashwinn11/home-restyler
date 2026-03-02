"use client";

import type { AppMode } from "@/lib/types";

const MODES: { key: AppMode; label: string; description: string }[] = [
  { key: "restyle", label: "Restyle Room", description: "New style, same layout" },
  { key: "paint", label: "Paint Walls", description: "Preview a new wall color" },
];

interface ModeTabsProps {
  activeMode: AppMode;
  onModeChange: (mode: AppMode) => void;
}

const MODE_HINTS: Record<AppMode, string> = {
  restyle:
    "Upload any room — furnished or empty. AI will redesign it in your chosen style, transforming furniture, materials, and decor while keeping the layout.",
  paint:
    "Upload any room. AI will change only the wall color and finish — all furniture and decor stay exactly as they are.",
};

export default function ModeTabs({ activeMode, onModeChange }: ModeTabsProps) {
  return (
    <div className="space-y-3">
      <div className="flex gap-1 bg-ink rounded-lg p-1 border border-parchment-faint/15">
        {MODES.map((mode) => (
          <button
            key={mode.key}
            onClick={() => onModeChange(mode.key)}
            className={`flex-1 px-3 py-3 rounded-md text-center transition-all duration-250 cursor-pointer focus:outline-none focus:ring-2 focus:ring-gold/40 ${activeMode === mode.key
              ? "bg-gold text-ink shadow-[0_0_12px_rgba(201,168,76,0.15)]"
              : "border border-transparent text-parchment-muted hover:text-parchment hover:bg-ink-elevated"
              }`}
          >
            <span className="block text-xs sm:text-sm font-medium">
              {mode.label}
            </span>
            <span className={`hidden sm:block text-[10px] mt-0.5 transition-colors duration-250 ${activeMode === mode.key ? "text-ink/60" : "text-parchment-muted"}`}>
              {mode.description}
            </span>
          </button>
        ))}
      </div>
      <p className="text-xs text-parchment-muted leading-relaxed px-1 font-light">
        {MODE_HINTS[activeMode]}
      </p>
    </div>
  );
}
