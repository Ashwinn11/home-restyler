import React from "react";

interface LandingHeroProps {
    title: string;
    description: string;
    room?: string;
    style?: string;
    city?: string;
    color?: string;
    competitor?: string;
    type?: "restyle" | "staging" | "paint" | "alternative";
}

export default function LandingHero({ title, description, room, style, city, color, competitor, type }: LandingHeroProps) {
    const isStaging = type === "staging";
    const isPaint = type === "paint";
    const isAlt = type === "alternative";

    let label = "AI-Driven Spatial Transformation";
    if (isStaging) label = "Professional Virtual Staging AI";
    if (isPaint) label = "Advanced AI Paint Visualizer";
    if (isAlt) label = "The Superior AI Design Choice";

    let ctaLabel = `Restyle ${room || "My Room"} Now`;
    if (isStaging) ctaLabel = `Stage My ${room || "Room"} Instantly`;
    if (isPaint) ctaLabel = `Paint My ${room || "Walls"} Now`;
    if (isAlt) ctaLabel = "Try HomeRestyler Now";

    const studioUrl = `/studio?room=${encodeURIComponent(room || "")}&style=${encodeURIComponent(style || "")}${color ? `&color=${encodeURIComponent(color)}` : ""}${type ? `&mode=${type === "paint" ? "paint" : "restyle"}` : ""}`;

    return (
        <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden py-16 px-4">
            {/* Immersive background elements */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(201,168,76,0.06),transparent_80%)]" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-full bg-gradient-to-b from-gold/30 via-gold/5 to-transparent z-0 opacity-40" />

            <div className="relative max-w-7xl mx-auto w-full z-10 flex flex-col items-center text-center">
                {/* Top Label */}
                <div className="mb-8 animate-reveal-up overflow-hidden">
                    <span className="inline-block text-[10px] uppercase tracking-[0.6em] text-gold font-bold px-6 py-2 border border-gold/20 rounded-full bg-gold/5 backdrop-blur-sm">
                        {label}
                    </span>
                </div>

                <h1 className="font-display text-4xl sm:text-6xl lg:text-8xl leading-[1.1] text-parchment font-medium tracking-tight animate-reveal-up px-2">
                    {title.split("|")[0]}
                </h1>

                <div className="mt-8 max-w-2xl animate-reveal-up px-4" style={{ animationDelay: '100ms' }}>
                    <p className="text-base sm:text-xl text-parchment-muted font-light leading-relaxed">
                        {description}
                        <br />
                        <span className="mt-4 inline-block font-normal text-gold">
                            {isAlt ? `Why ${competitor} users are switching to HomeRestyler.` : city ? `The #1 All-in-One AI Spatial Studio for homeowners in ${city}.` : `Experience the limitless potential of ${isPaint ? "wall painting" : isStaging ? "real estate" : "interior design"}.`}
                        </span>
                    </p>
                </div>

                <div className="mt-12 flex flex-col sm:flex-row justify-center gap-4 animate-reveal-up w-full px-6 sm:px-0" style={{ animationDelay: '200ms' }}>
                    <a
                        href={studioUrl}
                        rel="nofollow"
                        className="group relative px-12 py-5 bg-gold text-ink text-[11px] uppercase tracking-[0.3em] font-bold overflow-hidden transition-all duration-500 hover:shadow-[0_0_50px_rgba(201,168,76,0.3)] text-center"
                    >
                        <span className="relative z-10">{ctaLabel}</span>
                        <div className="absolute inset-x-0 bottom-0 h-0.5 bg-ink group-hover:h-full transition-all duration-300 -z-0 opacity-5" />
                    </a>
                </div>

                {/* Floating Accent Detail */}
                <div className="mt-16 flex items-center gap-8 animate-reveal-up opacity-40" style={{ animationDelay: '300ms' }}>
                    <div className="flex flex-col items-center">
                        <span className="text-[10px] uppercase tracking-[0.4em] text-gold font-bold">Accuracy</span>
                        <span className="text-parchment text-[9px] mt-1">PHOTOREAL PIPELINE</span>
                    </div>
                    <div className="w-px h-8 bg-gold/30" />
                    <div className="flex flex-col items-center">
                        <span className="text-[10px] uppercase tracking-[0.4em] text-gold font-bold">Speed</span>
                        <span className="text-parchment text-[9px] mt-1">SECONDS TO RENDER</span>
                    </div>
                </div>
            </div>
        </section>
    );
}
