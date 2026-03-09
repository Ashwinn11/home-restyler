import React from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import LandingHero from "@/components/seo/LandingHero";
import {
    ROOM_TYPES,
    DESIGN_STYLES,
    TOP_CITIES,
    PAINT_COLORS,
    COMPETITORS,
    slugify,
    getSEOMetadata,
    getSEOContent,
    SEOParams
} from "@/lib/seo-data";
import { absoluteUrl } from "@/lib/seo";
import CrossLinks from "@/components/seo/CrossLinks";

interface PageProps {
    params: Promise<{ slug: string[] }>;
}

function Breadcrumbs({ params }: { params: SEOParams }) {
    const { room, style, city, color, competitor, type } = params;
    const items = [{ name: "Home", url: "/" }];

    if (type === "staging") {
        items.push({ name: "Virtual Staging", url: "/ai-interior-design/virtual-staging" });
        if (room) items.push({ name: room, url: `/ai-interior-design/virtual-staging/${slugify(room)}` });
    } else if (type === "paint") {
        items.push({ name: "Paint Visualizer", url: "/ai-interior-design/paint-visualizer" });
        if (color) items.push({ name: color, url: `/ai-interior-design/paint-visualizer/${slugify(color)}` });
        if (room) items.push({ name: room, url: `/ai-interior-design/paint-visualizer/${color ? slugify(color) : ""}/${slugify(room)}` });
    } else if (type === "alternative") {
        items.push({ name: "Alternatives", url: "/ai-interior-design/alternatives" });
        if (competitor) items.push({ name: competitor, url: `/ai-interior-design/alternative-to/${slugify(competitor)}` });
    } else {
        items.push({ name: "Interior Design", url: "/ai-interior-design/living-room" });
        if (room) items.push({ name: room, url: `/ai-interior-design/${slugify(room)}` });
        if (style) items.push({ name: style, url: `/ai-interior-design/${room ? slugify(room) : "style"}/${slugify(style)}` });
        if (city) items.push({ name: city, url: `/ai-interior-design/in/${slugify(city)}` });
    }

    const breadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": items.map((item, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "name": item.name,
            "item": absoluteUrl(item.url)
        }))
    };

    return (
        <nav className="max-w-7xl mx-auto px-4 py-8 flex items-center gap-2 text-[10px] uppercase tracking-widest text-parchment-faint/40 overflow-x-auto whitespace-nowrap scrollbar-hide">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
            />
            {items.map((item, i) => (
                <React.Fragment key={item.url}>
                    {i > 0 && <span>/</span>}
                    <a href={item.url} className="hover:text-gold transition-colors">{item.name}</a>
                </React.Fragment>
            ))}
        </nav>
    );
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const seoParams = parseSlug(slug);

    if (!seoParams) return notFound();

    const { title, description } = getSEOMetadata(seoParams);
    const path = `/ai-interior-design/${slug.join("/")}`;

    return {
        title,
        description,
        alternates: { canonical: absoluteUrl(path) },
        openGraph: {
            title,
            description,
            url: absoluteUrl(path),
            siteName: "homerestyler",
            type: "website",
        },
        robots: {
            index: true,
            follow: true,
            googleBot: {
                index: true,
                follow: true,
                'max-image-preview': 'large',
                'max-snippet': -1,
                'max-video-preview': -1,
            },
        },
    };
}

function parseSlug(slug: string[]): SEOParams | null {
    const res: SEOParams = {};

    const roomSlugs = ROOM_TYPES.map(slugify);
    const styleSlugs = DESIGN_STYLES.map(slugify);
    const citySlugs = TOP_CITIES.map(slugify);
    const colorSlugs = PAINT_COLORS.map(slugify);
    const competitorSlugs = COMPETITORS.map(slugify);

    let remaining = [...slug];

    // A. Check for specialized prefixes
    if (remaining[0] === "virtual-staging") {
        res.type = "staging";
        remaining.shift();
        // Optional room after staging
        const rIdx = roomSlugs.indexOf(remaining[0]);
        if (rIdx !== -1) {
            res.room = ROOM_TYPES[rIdx];
            remaining.shift();
        }
    } else if (remaining[0] === "paint-visualizer") {
        res.type = "paint";
        remaining.shift();
        // Optional color or room
        const cIdx = colorSlugs.indexOf(remaining[0]);
        if (cIdx !== -1) {
            res.color = PAINT_COLORS[cIdx];
            remaining.shift();
        }
        const rIdx = roomSlugs.indexOf(remaining[0]);
        if (rIdx !== -1) {
            res.room = ROOM_TYPES[rIdx];
            remaining.shift();
        }
    } else if (remaining[0] === "alternative-to") {
        res.type = "alternative";
        remaining.shift();
        const compIdx = competitorSlugs.indexOf(remaining[0]);
        if (compIdx !== -1) {
            res.competitor = COMPETITORS[compIdx];
            remaining.shift();
        }
    }

    // B. Standard combinations (if not already handled)
    if (!res.type) {
        res.type = "restyle";

        // 1. Check for Room Type
        const roomIdx = roomSlugs.indexOf(remaining[0]);
        if (roomIdx !== -1) {
            res.room = ROOM_TYPES[roomIdx];
            remaining.shift();
        }

        // 2. Check for Style (optionally prefixed with 'style')
        if (remaining[0] === "style" && remaining[1]) {
            const sIdx = styleSlugs.indexOf(remaining[1]);
            if (sIdx !== -1) {
                res.style = DESIGN_STYLES[sIdx];
                remaining.splice(0, 2);
            }
        } else if (remaining[0]) {
            const sIdx = styleSlugs.indexOf(remaining[0]);
            if (sIdx !== -1) {
                res.style = DESIGN_STYLES[sIdx];
                remaining.shift();
            }
        }

        // 3. Check for City (prefixed with 'in')
        if (remaining[0] === "in" && remaining[1]) {
            const cIdx = citySlugs.indexOf(remaining[1]);
            if (cIdx !== -1) {
                res.city = TOP_CITIES[cIdx];
                remaining.splice(0, 2);
            }
        }
    }

    // Valid if at least one parameter was found and no leftover slugs
    if ((res.room || res.style || res.city || res.color || res.competitor || res.type) && remaining.length === 0) {
        return res;
    }

    return null;
}

export default async function SEOLandingPage({ params }: PageProps) {
    const { slug } = await params;
    const seoParams = parseSlug(slug);

    if (!seoParams) return notFound();

    const { title, description } = getSEOMetadata(seoParams);
    const content = getSEOContent(seoParams);

    const serviceSchema = {
        "@context": "https://schema.org",
        "@type": "Service",
        "serviceType": "AI Interior Design",
        "provider": {
            "@type": "Organization",
            "name": "HomeRestyler",
            "url": "https://homerestyler.app"
        },
        "areaServed": seoParams.city ? {
            "@type": "City",
            "name": seoParams.city
        } : undefined,
        "description": description,
        "name": title.split("|")[0].trim()
    };

    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": (content as any).tips?.map((tip: string, i: number) => ({
            "@type": "Question",
            "name": `Professional Design Tip #${i + 1} for ${seoParams.room || "your room"}`,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": tip
            }
        }))
    };

    return (
        <main className="bg-ink min-h-screen">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
            />
            {(content as any).tips && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
                />
            )}
            <Breadcrumbs params={seoParams} />
            <LandingHero
                title={title}
                description={description}
                room={seoParams.room}
                style={seoParams.style}
                city={seoParams.city}
                color={seoParams.color}
                competitor={seoParams.competitor}
                type={seoParams.type}
            />

            <section className="max-w-7xl mx-auto px-4 py-24 border-t border-parchment-faint/10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                    <div className="space-y-6">
                        <h2 className="font-display text-4xl text-parchment">Professional AI {seoParams.room || "Interior"} Design</h2>
                        <p className="text-parchment-muted font-light leading-relaxed text-lg">
                            {content.intro}
                        </p>
                        <p className="text-parchment-muted font-light leading-relaxed">
                            {content.benefit1}
                        </p>
                        <p className="text-parchment-muted font-light leading-relaxed">
                            {content.benefit2}
                        </p>

                        {(content as any).tips && (
                            <div className="mt-12 pt-12 border-t border-parchment-faint/10">
                                <h3 className="text-gold uppercase tracking-widest text-xs font-bold mb-6">Expert Design Advice</h3>
                                <div className="space-y-6">
                                    {(content as any).tips.map((tip: string, i: number) => (
                                        <div key={i} className="flex gap-4">
                                            <div className="w-6 h-6 rounded-full border border-gold/30 flex items-center justify-center shrink-0">
                                                <div className="w-1 h-1 rounded-full bg-gold" />
                                            </div>
                                            <p className="text-parchment font-light italic text-sm">{tip}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="space-y-8">
                        <div className="flex gap-4">
                            <div className="w-12 h-12 rounded-lg bg-gold/10 border border-gold/20 flex items-center justify-center shrink-0">
                                <span className="text-gold font-bold">01</span>
                            </div>
                            <div>
                                <h3 className="text-parchment font-medium mb-1">Scale Your Vision</h3>
                                <p className="text-sm text-parchment-muted font-light">Whether you're redesigning a small {seoParams.room?.toLowerCase() || "apartment"} or a large property, our AI handles space planning with ease.</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="w-12 h-12 rounded-lg bg-gold/10 border border-gold/20 flex items-center justify-center shrink-0">
                                <span className="text-gold font-bold">02</span>
                            </div>
                            <div>
                                <h3 className="text-parchment font-medium mb-1">Material Integrity</h3>
                                <p className="text-sm text-parchment-muted font-light">Our engine recognizes over 500+ material types to ensure your {seoParams.style || "modern"} render looks physical and real.</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="w-12 h-12 rounded-lg bg-gold/10 border border-gold/20 flex items-center justify-center shrink-0">
                                <span className="text-gold font-bold">03</span>
                            </div>
                            <div>
                                <h3 className="text-parchment font-medium mb-1">Instant Prototyping</h3>
                                <p className="text-sm text-parchment-muted font-light">Get professional-grade spatial renders in under 60 seconds. Perfect for homeowners and interior designers alike.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <CrossLinks currentRoom={seoParams.room} currentStyle={seoParams.style} />
        </main>
    );
}

export async function generateStaticParams() {
    const params: { slug: string[] }[] = [];

    // 1. Core Rooms, Styles, Cities (Top 50)
    ROOM_TYPES.forEach(r => params.push({ slug: [slugify(r)] }));
    DESIGN_STYLES.forEach(s => params.push({ slug: ["style", slugify(s)] }));
    TOP_CITIES.slice(0, 50).forEach(c => params.push({ slug: ["in", slugify(c)] }));

    // 2. Room x Style (Top 10 rooms x Top 10 styles = 100)
    const midRooms = ROOM_TYPES.slice(0, 10);
    const midStyles = DESIGN_STYLES.slice(0, 10);
    midRooms.forEach(r => {
        midStyles.forEach(s => {
            params.push({ slug: [slugify(r), slugify(s)] });
        });
    });

    // 3. Room x City (Top 8 rooms x Top 20 cities = 160)
    const top20Cities = TOP_CITIES.slice(0, 20);
    midRooms.slice(0, 8).forEach(r => {
        top20Cities.forEach(c => {
            params.push({ slug: [slugify(r), "in", slugify(c)] });
        });
    });

    // 4. Style x City (Top 8 styles x Top 20 cities = 160)
    midStyles.slice(0, 8).forEach(s => {
        top20Cities.forEach(c => {
            params.push({ slug: ["style", slugify(s), "in", slugify(c)] });
        });
    });

    // 5. Virtual Staging (All rooms)
    ROOM_TYPES.forEach(r => {
        params.push({ slug: ["virtual-staging", slugify(r)] });
    });

    // 6. Paint Visualizer (Top 5 colors x Top 10 rooms = 50)
    PAINT_COLORS.slice(0, 5).forEach(color => {
        midRooms.forEach(room => {
            params.push({ slug: ["paint-visualizer", slugify(color), slugify(room)] });
        });
    });

    // 7. Alternatives (Top 5)
    COMPETITORS.slice(0, 5).forEach(comp => {
        params.push({ slug: ["alternative-to", slugify(comp)] });
    });

    return params;
}
