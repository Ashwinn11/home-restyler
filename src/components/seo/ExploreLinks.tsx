import React from "react";
import { ROOM_TYPES, DESIGN_STYLES, slugify } from "@/lib/seo-data";

export default function ExploreLinks() {
  const topRooms = ROOM_TYPES.slice(0, 6);
  const topStyles = DESIGN_STYLES.slice(0, 6);

  return (
    <div className="border-t border-parchment-faint/8 mt-12 pt-10">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        <div className="space-y-3">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gold mb-4">Trending Rooms</p>
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
        
        <div className="space-y-3">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gold mb-4">Popular Styles</p>
          {topStyles.map((style) => (
            <a 
              key={style} 
              href={`/ai-interior-design/style/${slugify(style)}`}
              className="block text-xs text-parchment-muted hover:text-gold transition-colors font-light"
            >
              {style} Interior Design
            </a>
          ))}
        </div>

        <div className="space-y-3">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gold mb-4">Staging & Paint</p>
          <a href="/ai-interior-design/virtual-staging/living-room" className="block text-xs text-parchment-muted hover:text-gold transition-colors font-light">AI Virtual Staging</a>
          <a href="/ai-interior-design/paint-visualizer/navy-blue/living-room" className="block text-xs text-parchment-muted hover:text-gold transition-colors font-light">Paint Visualizer</a>
          <a href="/ai-interior-design/virtual-staging/bedroom" className="block text-xs text-parchment-muted hover:text-gold transition-colors font-light">Empty Room Staging</a>
          <a href="/ai-interior-design/paint-visualizer/sage-green/bedroom" className="block text-xs text-parchment-muted hover:text-gold transition-colors font-light">Wall Color Preview</a>
        </div>

        <div className="space-y-3">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gold mb-4">Alternatives</p>
          <a href="/ai-interior-design/alternative-to/interior-ai" className="block text-xs text-parchment-muted hover:text-gold transition-colors font-light">Interior AI Alternative</a>
          <a href="/ai-interior-design/alternative-to/roomgpt" className="block text-xs text-parchment-muted hover:text-gold transition-colors font-light">RoomGPT Alternative</a>
          <a href="/ai-interior-design/alternative-to/havely" className="block text-xs text-parchment-muted hover:text-gold transition-colors font-light">Havenly AI Alternative</a>
          <a href="/ai-interior-design/alternative-to/modsy" className="block text-xs text-parchment-muted hover:text-gold transition-colors font-light">Modsy Professional Alternative</a>
        </div>
      </div>
    </div>
  );
}
