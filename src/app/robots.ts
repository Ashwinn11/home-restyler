import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/studio", "/gallery", "/profile", "/studio/", "/gallery/", "/profile/", "/*?*modal="],
      },
      {
        userAgent: ["GPTBot", "ChatGPT-User", "ClaudeBot", "anthropic-ai", "PerplexityBot", "Bingbot", "Googlebot"],
        allow: "/",
        disallow: ["/studio", "/gallery", "/profile", "/studio/", "/gallery/", "/profile/", "/*?*modal="],
      },
    ],
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
