"use client";

import type { MoodBoardData } from "@/lib/types";

interface MoodBoardProps {
  data: MoodBoardData | null;
  isLoading: boolean;
}

export default function MoodBoard({ data, isLoading }: MoodBoardProps) {
  if (isLoading) {
    return (
      <div className="space-y-3 animate-reveal-up">
        <div className="flex items-center gap-3">
          <div className="h-px flex-1 bg-parchment-faint/15" />
          <h3 className="text-[10px] uppercase tracking-[0.2em] text-parchment-muted font-medium">
            Analyzing design...
          </h3>
          <div className="h-px flex-1 bg-parchment-faint/15" />
        </div>
        <div className="flex gap-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="w-10 h-10 rounded-full bg-ink border border-parchment-faint/12 skeleton-shimmer"
            />
          ))}
        </div>
      </div>
    );
  }

  if (!data || (data.colors.length === 0 && !data.summary)) return null;

  return (
    <div className="space-y-5 animate-reveal-up bg-ink border border-parchment-faint/12 rounded-lg p-5">
      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-parchment-faint/15" />
        <h3 className="text-[10px] uppercase tracking-[0.2em] text-gold/70 font-medium">
          Mood Board
        </h3>
        <div className="h-px flex-1 bg-parchment-faint/15" />
      </div>
      <p className="text-[11px] text-parchment-muted/60 font-light">
        AI-extracted design breakdown — use these colors, materials, and style names to find matching products in real life.
      </p>

      {/* Color palette */}
      {data.colors.length > 0 && (
        <div>
          <p className="text-[10px] uppercase tracking-[0.2em] text-parchment-muted mb-3 font-medium">
            Color Palette
          </p>
          <div className="flex gap-3 flex-wrap">
            {data.colors.map((color, i) => (
              <div key={i} className="flex flex-col items-center gap-1.5">
                <div
                  className="w-9 h-9 rounded-full border-2 border-parchment-faint/15"
                  style={{ backgroundColor: color.hex }}
                  title={color.name}
                />
                <span className="text-[9px] text-parchment-muted text-center max-w-[4rem] leading-tight">
                  {color.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Materials */}
      {data.materials.length > 0 && (
        <div>
          <p className="text-[10px] uppercase tracking-[0.2em] text-parchment-muted mb-3 font-medium">
            Materials
          </p>
          <div className="flex gap-2 flex-wrap">
            {data.materials.map((m, i) => (
              <span
                key={i}
                className="px-3 py-1.5 text-[11px] text-parchment bg-gold/8 border border-gold/15 rounded-full"
              >
                {m}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Furniture styles */}
      {data.furnitureStyles.length > 0 && (
        <div>
          <p className="text-[10px] uppercase tracking-[0.2em] text-parchment-muted mb-3 font-medium">
            Style
          </p>
          <div className="flex gap-2 flex-wrap">
            {data.furnitureStyles.map((s, i) => (
              <span
                key={i}
                className="px-3 py-1.5 text-[11px] text-parchment bg-gold/8 border border-gold/15 rounded-full"
              >
                {s}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Summary */}
      {data.summary && (
        <p className="font-display text-sm text-parchment-muted leading-relaxed italic">
          {data.summary}
        </p>
      )}
    </div>
  );
}
