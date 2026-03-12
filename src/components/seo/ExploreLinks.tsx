import React from "react";
import { ROOM_TYPES, DESIGN_STYLES, TOP_CITIES, slugify } from "@/lib/seo-data";

export default function ExploreLinks() {
  const topRooms = ROOM_TYPES.slice(0, 6);
  const topStyles = DESIGN_STYLES.slice(0, 6);
  const topCities = TOP_CITIES.slice(0, 5);

  return (
    <div className="border-t border-parchment-faint/8 mt-12 pt-10">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
        <div className="space-y-4">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gold mb-6 opacity-60">Top Rooms</p>
          <div className="space-y-3">
            {topRooms.map((room) => (
              <a
                key={room}
                href={`/ai-interior-design/${slugify(room)}`}
                className="block text-xs text-parchment-muted hover:text-gold transition-colors font-light"
              >
                AI {room} Design
              </a>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gold mb-6 opacity-60">Styles</p>
          <div className="space-y-3">
            {topStyles.map((style) => (
              <a
                key={style}
                href={`/ai-interior-design/style/${slugify(style)}`}
                className="block text-xs text-parchment-muted hover:text-gold transition-colors font-light"
              >
                {style}
              </a>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gold mb-6 opacity-60">Locations</p>
          <div className="space-y-3">
            {topCities.map((city) => (
              <a
                key={city}
                href={`/ai-interior-design/in/${slugify(city)}`}
                className="block text-xs text-parchment-muted hover:text-gold transition-colors font-light"
              >
                In {city}
              </a>
            ))}
            <a href="/explore" className="block text-[10px] font-black uppercase text-gold hover:underline tracking-widest pt-2">
              Browse All Cities →
            </a>
          </div>
        </div>

        <div className="space-y-4">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gold mb-6 opacity-60">Legal</p>
          <div className="space-y-3">
            <a href="/privacy" className="block text-xs text-parchment-muted hover:text-gold transition-colors font-light">Privacy Policy</a>
            <a href="/terms" className="block text-xs text-parchment-muted hover:text-gold transition-colors font-light">Terms of Service</a>
            <a href="/ai-interior-design/alternative-to/interior-ai" className="block text-xs text-parchment-muted hover:text-gold transition-colors font-light">vs Interior AI</a>
          </div>
        </div>
      </div>
    </div>
  );
}
