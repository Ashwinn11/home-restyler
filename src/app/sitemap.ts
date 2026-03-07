import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/seo";
import {
  ROOM_TYPES,
  DESIGN_STYLES,
  TOP_CITIES,
  PAINT_COLORS,
  COMPETITORS,
  slugify
} from "@/lib/seo-data";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseEntries: MetadataRoute.Sitemap = [
    {
      url: absoluteUrl("/"),
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: absoluteUrl("/privacy"),
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: absoluteUrl("/terms"),
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: absoluteUrl("/refund-policy"),
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.2,
    },
  ];

  const programmaticEntries: MetadataRoute.Sitemap = [];

  // 1. Rooms
  ROOM_TYPES.forEach((room) => {
    programmaticEntries.push({
      url: absoluteUrl(`/ai-interior-design/${slugify(room)}`),
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    });
  });

  // 2. Styles
  DESIGN_STYLES.forEach((style) => {
    programmaticEntries.push({
      url: absoluteUrl(`/ai-interior-design/style/${slugify(style)}`),
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    });
  });

  // 3. Cities (All 100+ cities)
  TOP_CITIES.forEach((city) => {
    programmaticEntries.push({
      url: absoluteUrl(`/ai-interior-design/in/${slugify(city)}`),
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    });
  });

  // 4. Room x Style Combinations (High Intent)
  const topRooms = ROOM_TYPES.slice(0, 10);
  const topStyles = DESIGN_STYLES.slice(0, 10);
  topRooms.forEach((room) => {
    topStyles.forEach((style) => {
      programmaticEntries.push({
        url: absoluteUrl(`/ai-interior-design/${slugify(room)}/${slugify(style)}`),
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.6,
      });
    });
  });

  // 5. Virtual Staging
  ROOM_TYPES.slice(0, 10).forEach((room) => {
    programmaticEntries.push({
      url: absoluteUrl(`/ai-interior-design/virtual-staging/${slugify(room)}`),
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    });
  });

  // 6. Paint Visualizer
  PAINT_COLORS.forEach((color) => {
    programmaticEntries.push({
      url: absoluteUrl(`/ai-interior-design/paint-visualizer/${slugify(color)}`),
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    });
  });

  // 7. Competitor Alternatives
  COMPETITORS.forEach((comp) => {
    programmaticEntries.push({
      url: absoluteUrl(`/ai-interior-design/alternative-to/${slugify(comp)}`),
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    });
  });

  return [...baseEntries, ...programmaticEntries];
}
