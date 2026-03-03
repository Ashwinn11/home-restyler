"use client";

import Link from "next/link";
import { useAuth } from "@/components/AuthProvider";

export default function Navbar() {
    const { user, credits, loading, signOut, openAuthModal } = useAuth();

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 border-b border-parchment-faint/10 bg-ink/80 backdrop-blur-xl">
            <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
                {/* Logo */}
                <Link
                    href="/"
                    className="flex items-center gap-2.5 font-display text-lg font-semibold text-parchment transition-colors hover:text-gold"
                >
                    <img
                        src="/icon.png"
                        alt="Home Restyler"
                        className="h-7 w-7 rounded-sm object-cover"
                    />
                    Home Restyler
                </Link>

                {/* Right side */}
                <div className="flex items-center gap-3">
                    {loading ? (
                        <div className="h-8 w-24 animate-pulse rounded-full bg-ink-elevated" />
                    ) : user ? (
                        <>
                            {/* Credits Badge */}
                            <div
                                className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-all ${credits <= 5
                                    ? "border-rose/40 bg-rose/10 text-rose animate-pulse"
                                    : "border-gold/20 bg-gold/5 text-gold"
                                    }`}
                            >
                                <svg
                                    width="12"
                                    height="12"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                >
                                    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                                </svg>
                                {credits} credits
                            </div>

                            {/* Studio Link */}
                            <Link
                                href="/studio"
                                className="px-3 py-1.5 text-xs font-medium text-parchment-muted transition-colors hover:bg-ink-elevated hover:text-parchment"
                            >
                                Studio
                            </Link>

                            {/* Gallery Link */}
                            <Link
                                href="/gallery"
                                className="px-3 py-1.5 text-xs font-medium text-parchment-muted transition-colors hover:bg-ink-elevated hover:text-parchment"
                            >
                                Gallery
                            </Link>

                            {/* Profile / Avatar */}
                            <Link
                                href="/profile"
                                className="flex items-center gap-2 rounded-lg px-2 py-1 transition-colors hover:bg-ink-elevated"
                            >
                                {user.user_metadata?.avatar_url ? (
                                    <img
                                        src={user.user_metadata.avatar_url}
                                        alt=""
                                        className="h-7 w-7 rounded-full border border-parchment-faint/20"
                                    />
                                ) : (
                                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gold/20 text-xs font-semibold text-gold">
                                        {(user.email?.[0] || "U").toUpperCase()}
                                    </div>
                                )}
                            </Link>

                            {/* Sign Out */}
                            <button
                                onClick={signOut}
                                className="rounded-lg px-3 py-1.5 text-xs font-medium text-parchment-faint transition-colors hover:bg-ink-elevated hover:text-parchment"
                            >
                                Sign out
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={openAuthModal}
                            className="border border-gold/30 bg-gold/10 px-4 py-1.5 text-xs font-semibold text-gold transition-all hover:bg-gold/20 hover:border-gold/50"
                        >
                            Sign in
                        </button>
                    )}
                </div>
            </div>
        </nav>
    );
}
