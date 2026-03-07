import { Suspense } from "react";
import type { Metadata } from "next";
import { SITE_URL, absoluteUrl } from "@/lib/seo";
import ProfileClient from "./ProfileClient";

export const metadata: Metadata = {
    metadataBase: new URL(SITE_URL),
    title: "Account & Credits | HomeRestyler",
    description:
        "Manage your HomeRestyler subscription, view your AI design credit balance, track usage history, and upgrade your plan.",
    alternates: { canonical: absoluteUrl("/profile") },
    robots: { index: false, follow: false },
};

export default function ProfilePage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-ink animate-pulse" />}>
            <ProfileClient />
        </Suspense>
    );
}
