import { ROOM_TYPES, DESIGN_STYLES, TOP_CITIES, PAINT_COLORS, COMPETITORS, slugify } from "@/lib/seo-data";

export default function ExplorePage() {
    return (
        <main className="min-h-screen bg-ink text-parchment selection:bg-gold/20">
            <header className="py-24 border-b border-parchment-faint/10">
                <div className="max-w-7xl mx-auto px-4">
                    <h1 className="font-display text-5xl md:text-8xl uppercase tracking-tighter text-parchment mb-6">
                        Design <span className="text-gold">Directory</span>
                    </h1>
                    <p className="text-xl text-parchment-muted font-light max-w-2xl leading-relaxed">
                        A full technical index of our AI Spatial Design capabilities across rooms, styles, locations, and material pipelines.
                    </p>
                </div>
            </header>

            <section className="max-w-7xl mx-auto px-4 py-24">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-24">
                    {/* Category Column */}
                    <div className="space-y-16">
                        <div>
                            <h2 className="text-gold uppercase tracking-[0.3em] text-[10px] font-black mb-8 border-l-2 border-gold pl-4">Specialized Rooms</h2>
                            <div className="grid gap-4">
                                {ROOM_TYPES.map(room => (
                                    <a key={room} href={`/ai-interior-design/${slugify(room)}`} className="text-2xl font-display text-parchment hover:text-gold transition-colors">
                                        {room}
                                    </a>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h2 className="text-gold uppercase tracking-[0.3em] text-[10px] font-black mb-8 border-l-2 border-gold pl-4">Design Styles</h2>
                            <div className="grid grid-cols-2 gap-4">
                                {DESIGN_STYLES.map(style => (
                                    <a key={style} href={`/ai-interior-design/style/${slugify(style)}`} className="text-sm text-parchment-muted hover:text-parchment transition-colors font-light">
                                        {style}
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Middle Column */}
                    <div className="space-y-16">
                        <div>
                            <h2 className="text-gold uppercase tracking-[0.3em] text-[10px] font-black mb-8 border-l-2 border-gold pl-4">Global Locations</h2>
                            <div className="grid grid-cols-2 gap-x-8 gap-y-3 max-h-[1000px] overflow-y-auto pr-4 custom-scrollbar">
                                {TOP_CITIES.map(city => (
                                    <a key={city} href={`/ai-interior-design/in/${slugify(city)}`} className="text-sm text-parchment-muted hover:text-parchment transition-colors font-light">
                                        {city}
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-16">
                        <div>
                            <h2 className="text-gold uppercase tracking-[0.3em] text-[10px] font-black mb-8 border-l-2 border-gold pl-4">Staging & Paint</h2>
                            <div className="grid gap-6">
                                <a href="/ai-interior-design/virtual-staging/living-room" className="text-xl text-parchment hover:text-gold transition-colors">Virtual Staging Hub</a>
                                <a href="/ai-interior-design/paint-visualizer/navy-blue/living-room" className="text-xl text-parchment hover:text-gold transition-colors">Precision Paint Tool</a>
                            </div>
                        </div>

                        <div>
                            <h2 className="text-gold uppercase tracking-[0.3em] text-[10px] font-black mb-8 border-l-2 border-gold pl-4">Market Alternatives</h2>
                            <div className="grid gap-3">
                                {COMPETITORS.map(comp => (
                                    <a key={comp} href={`/ai-interior-design/alternative-to/${slugify(comp)}`} className="text-sm text-parchment-muted hover:text-parchment transition-colors font-light">
                                        vs {comp}
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
