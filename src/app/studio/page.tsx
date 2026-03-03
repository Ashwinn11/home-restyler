import type { Metadata } from "next";
import StudioClient from "@/components/home/StudioClient";
import { SITE_URL, absoluteUrl } from "@/lib/seo";

export const metadata: Metadata = {
    metadataBase: new URL(SITE_URL),
    title: "Studio | Home Restyler",
    description: "AI-powered interior design studio. Upload a room photo, choose a style, and transform your space in seconds.",
    alternates: { canonical: absoluteUrl("/studio") },
    robots: { index: false, follow: false },
};

export default function StudioPage() {
    return <StudioClient />;
}
