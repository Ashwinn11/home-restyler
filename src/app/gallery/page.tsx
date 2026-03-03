import type { Metadata } from "next";
import { SITE_URL, absoluteUrl } from "@/lib/seo";
import GalleryClient from "./GalleryClient";

export const metadata: Metadata = {
    metadataBase: new URL(SITE_URL),
    title: "My Design Gallery | Home Restyler",
    description:
        "View and manage your saved AI room designs. Download, compare before and after, and revisit your favorite room transformations.",
    alternates: { canonical: absoluteUrl("/gallery") },
    robots: { index: false, follow: false },
};

export default function GalleryPage() {
    return <GalleryClient />;
}
