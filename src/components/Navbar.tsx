"use client";

import Link from "next/link";
import { useAuth } from "@/components/AuthProvider";
import { usePathname } from "next/navigation";

export default function Navbar() {
    const { user, credits, subscription, loading, signOut, openAuthModal } = useAuth();
    const pathname = usePathname();

    const isLinkActive = (href: string) => pathname === href;

    const formatDate = (dateStr: string | null) => {
        if (!dateStr) return "";
        return new Date(dateStr).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
        });
    };

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 border-b border-parchment-faint/10 bg-ink/80 backdrop-blur-xl">
            <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-3.5 sm:px-6">
                {/* Logo */}
                <Link
                    href="/"
                    className="flex items-center gap-2 font-display text-base sm:text-lg font-semibold text-parchment transition-colors hover:text-gold shrink-0"
                >
                    <img
                        src="/icon.png"
                        alt="Home Restyler"
                        className="h-6 w-6 sm:h-7 sm:w-7 rounded-sm object-cover"
                    />
                    <span className="truncate max-w-[120px] sm:max-w-none">Home Restyler</span>
                </Link>

                {/* Right side */}
                <div className="flex items-center gap-2 sm:gap-4">
                    {loading ? (
                        <div className="h-8 w-24 animate-pulse rounded-full bg-ink-elevated" />
                    ) : user ? (
                        <>
                            {/* Credits Badge */}
                            <div
                                className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] sm:text-xs font-medium transition-all ${credits <= 5
                                    ? "border-rose/40 bg-rose/10 text-rose animate-pulse"
                                    : "border-gold/20 bg-gold/5 text-gold"
                                    }`}
                            >
                                <svg
                                    width="10"
                                    height="10"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                    className="sm:w-3 sm:h-3"
                                >
                                    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                                </svg>
                                {credits} <span className="hidden xs:inline">credits</span>
                            </div>

                            {/* Cancellation Warning Badge */}
                            {subscription?.cancel_at_period_end && (
                                <div className="hidden md:flex items-center gap-1.5 rounded-full border border-rose/30 bg-rose/5 px-2 py-0.5 text-[9px] font-medium text-rose/80">
                                    <div className="h-1 w-1 rounded-full bg-rose animate-pulse" />
                                    Ending {formatDate(subscription.current_period_end)}
                                </div>
                            )}

                            {/* Desktop Links - Hidden on Mobile */}
                            <div className="hidden sm:flex items-center gap-1">
                                <Link
                                    href="/studio"
                                    className={`px-3 py-1.5 text-xs font-medium transition-colors rounded-md ${isLinkActive("/studio")
                                        ? "bg-gold/10 text-gold"
                                        : "text-parchment-muted hover:bg-ink-elevated hover:text-parchment"
                                        }`}
                                >
                                    Studio
                                </Link>
                                <Link
                                    href="/gallery"
                                    className={`px-3 py-1.5 text-xs font-medium transition-colors rounded-md ${isLinkActive("/gallery")
                                        ? "bg-gold/10 text-gold"
                                        : "text-parchment-muted hover:bg-ink-elevated hover:text-parchment"
                                        }`}
                                >
                                    Gallery
                                </Link>
                                <Link
                                    href="/profile"
                                    className={`px-3 py-1.5 text-xs font-medium transition-colors rounded-md ${isLinkActive("/profile")
                                        ? "bg-gold/10 text-gold"
                                        : "text-parchment-muted hover:bg-ink-elevated hover:text-parchment"
                                        }`}
                                >
                                    Profile
                                </Link>
                            </div>

                            {/* Avatar / Profile - Simple on Mobile */}
                            <Link
                                href="/profile"
                                className="flex items-center gap-2 rounded-lg p-0.5 sm:px-2 sm:py-1 transition-colors hover:bg-ink-elevated"
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

                            {/* Sign Out - Hidden on very small screens or moved to profile */}
                            <button
                                onClick={signOut}
                                className="hidden sm:block rounded-lg px-3 py-1.5 text-xs font-medium text-parchment-faint transition-colors hover:bg-ink-elevated hover:text-parchment"
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
