"use client";

import { useState } from "react";

const PRESET_COLORS = [
  { hex: "#F0EBE3", name: "Warm White" },
  { hex: "#E8DDD3", name: "Linen" },
  { hex: "#D4C5B2", name: "Sandstone" },
  { hex: "#C4B5A0", name: "Wheat" },
  { hex: "#8A9A6C", name: "Sage" },
  { hex: "#6B7F6E", name: "Eucalyptus" },
  { hex: "#4A6670", name: "Teal" },
  { hex: "#2C3E50", name: "Navy" },
  { hex: "#34495E", name: "Slate Blue" },
  { hex: "#5D4E60", name: "Plum" },
  { hex: "#C9A84C", name: "Gold" },
  { hex: "#8B4513", name: "Saddle Brown" },
  { hex: "#B22222", name: "Firebrick" },
  { hex: "#2F4F4F", name: "Dark Slate" },
  { hex: "#0D0F0E", name: "Charcoal" },
  { hex: "#F0E68C", name: "Khaki" },
];

const FINISHES = ["Matte", "Satin", "Semi-Gloss"] as const;

interface ColorPickerProps {
  onColorSelected: (colorHex: string, finish: string) => void;
  disabled?: boolean;
}

export default function ColorPicker({
  onColorSelected,
  disabled,
}: ColorPickerProps) {
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [customHex, setCustomHex] = useState("");
  const [finish, setFinish] = useState<(typeof FINISHES)[number]>("Matte");

  const handleSelect = (hex: string) => {
    setSelectedColor(hex);
    setCustomHex("");
    onColorSelected(hex, finish);
  };

  const handleCustomApply = () => {
    const hex = customHex.trim();
    if (!hex) return;
    const normalized = hex.startsWith("#") ? hex : `#${hex}`;
    setSelectedColor(normalized);
    onColorSelected(normalized, finish);
  };

  const handleFinishChange = (f: (typeof FINISHES)[number]) => {
    setFinish(f);
    if (selectedColor) {
      onColorSelected(selectedColor, f);
    }
  };

  return (
    <div className="space-y-6">
      {/* Color swatches */}
      <div>
        <p className="text-[10px] uppercase tracking-[0.2em] text-gold/80 font-medium mb-1">
          Wall Color
        </p>
        <p className="text-[11px] text-parchment-muted/70 mb-4 font-light">
          Pick a color below or enter a custom hex. Clicking a swatch
          immediately generates a preview.
        </p>
        <div className="grid grid-cols-8 gap-2.5">
          {PRESET_COLORS.map((color) => (
            <button
              key={color.hex}
              onClick={() => handleSelect(color.hex)}
              disabled={disabled}
              title={color.name}
              className={`aspect-square rounded-full border-2 transition-all duration-200 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-gold/40 ${selectedColor === color.hex
                ? "border-gold scale-115 shadow-[0_0_14px_rgba(201,168,76,0.35)]"
                : "border-parchment-faint/20 hover:border-parchment-faint/40 hover:scale-110"
                }`}
              style={{ backgroundColor: color.hex }}
            />
          ))}
        </div>
      </div>

      {/* Custom hex input */}
      <div className="flex gap-3 items-center bg-ink-elevated border border-parchment-faint/15 rounded-lg p-3.5">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="#XXXXXX or hex value"
            value={customHex}
            onChange={(e) => setCustomHex(e.target.value)}
            disabled={disabled}
            className="w-full bg-transparent border-b border-parchment-faint/25 focus:border-gold px-0 py-2.5 text-sm text-parchment placeholder:text-parchment-muted/50 focus:outline-none transition-colors disabled:opacity-40"
            onKeyDown={(e) => {
              if (e.key === "Enter") handleCustomApply();
            }}
          />
        </div>
        {customHex.trim() && (
          <div
            className="w-9 h-9 rounded-full border-2 border-parchment-faint/20"
            style={{
              backgroundColor: customHex.startsWith("#")
                ? customHex
                : `#${customHex}`,
            }}
          />
        )}
        <button
          onClick={handleCustomApply}
          disabled={disabled || !customHex.trim()}
          className="px-5 py-2.5 bg-gold text-ink text-[10px] uppercase tracking-[0.18em] font-semibold hover:bg-gold-soft disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gold/40"
        >
          Apply
        </button>
      </div>

      {/* Finish selector */}
      <div>
        <p className="text-[10px] uppercase tracking-[0.2em] text-gold/80 font-medium mb-1">
          Finish
        </p>
        <p className="text-[11px] text-parchment-muted/70 mb-3 font-light">
          Matte has no shine, Satin has a soft sheen, Semi-Gloss is reflective.
        </p>
        <div className="flex gap-2">
          {FINISHES.map((f) => (
            <button
              key={f}
              onClick={() => handleFinishChange(f)}
              disabled={disabled}
              className={`px-4 py-2 text-xs rounded-full border transition-all duration-200 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-gold/40 ${finish === f
                ? "bg-gold border-gold text-ink shadow-[0_0_8px_rgba(201,168,76,0.2)]"
                : "border-parchment-faint/25 text-parchment-muted hover:border-parchment-faint/40 hover:text-parchment"
                }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
