"use client";

export default function GeneratingOverlay({ text }: { text?: string }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/75">
      <div className="w-[calc(100%-2rem)] max-w-sm bg-ink-raised border border-parchment-faint/15 rounded-2xl px-8 sm:px-12 py-8 sm:py-10 flex flex-col items-center gap-6 shadow-2xl">
        {/* Orbital animation */}
        <div className="relative w-20 h-20">
          <div
            className="absolute inset-0 border border-gold/15 rounded-full"
            style={{ animation: "orbit-glow 2.5s ease-in-out infinite" }}
          />
          <div
            className="absolute inset-2 border border-gold/25 rounded-full"
            style={{ animation: "orbit 5s linear infinite" }}
          >
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gold/60 rounded-full" />
          </div>
          <div
            className="absolute inset-5 border border-gold/40 rounded-full"
            style={{ animation: "orbit 3.5s linear infinite reverse" }}
          >
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-gold rounded-full" />
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-2 h-2 bg-gold rounded-full animate-pulse" />
          </div>
        </div>
        <div className="text-center space-y-2">
          <p className="font-display text-base text-parchment font-medium tracking-wide">
            {text || "Restyling your room"}
          </p>
          <p className="text-[11px] text-parchment-muted font-light">
            This usually takes 10 &#8211; 20 seconds
          </p>
        </div>
      </div>
    </div>
  );
}
