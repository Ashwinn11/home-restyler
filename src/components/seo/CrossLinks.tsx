import React from "react";
import { ROOM_TYPES, DESIGN_STYLES, slugify } from "@/lib/seo-data";

interface CrossLinksProps {
    currentRoom?: string;
    currentStyle?: string;
}

export default function CrossLinks({ currentRoom, currentStyle }: CrossLinksProps) {
    // Find related rooms and styles
    const relatedRooms = ROOM_TYPES.filter(r => r !== currentRoom).slice(0, 8);
    const relatedStyles = DESIGN_STYLES.filter(s => s !== currentStyle).slice(0, 8);

    return (
        <section className="max-w-7xl mx-auto px-4 py-24 border-t border-parchment-faint/10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                <div>
                    <h3 className="font-display text-2xl text-parchment mb-6">Explore Other Rooms</h3>
                    <div className="grid grid-cols-2 gap-4">
                        {relatedRooms.map(room => (
                            <a
                                key={room}
                                href={`/ai-interior-design/${slugify(room)}${currentStyle ? `/${slugify(currentStyle)}` : ''}`}
                                className="p-4 border border-parchment-faint/10 rounded-lg hover:border-gold/30 hover:bg-gold/5 transition-all group"
                            >
                                <p className="text-xs text-gold uppercase tracking-widest mb-1">AI Design</p>
                                <p className="text-parchment group-hover:text-gold transition-colors">{currentStyle || ''} {room}</p>
                            </a>
                        ))}
                    </div>
                </div>

                <div>
                    <h3 className="font-display text-2xl text-parchment mb-6">Popular Design Styles</h3>
                    <div className="grid grid-cols-2 gap-4">
                        {relatedStyles.map(style => (
                            <a
                                key={style}
                                href={`/ai-interior-design/${currentRoom ? slugify(currentRoom) : 'style'}/${slugify(style)}`}
                                className="p-4 border border-parchment-faint/10 rounded-lg hover:border-gold/30 hover:bg-gold/5 transition-all group"
                            >
                                <p className="text-xs text-gold uppercase tracking-widest mb-1">{style}</p>
                                <p className="text-parchment group-hover:text-gold transition-colors">{currentRoom || 'Interior'} Design</p>
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
