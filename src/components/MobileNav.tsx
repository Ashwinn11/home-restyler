"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";

const links = [
    {
        href: "/studio", label: "Studio", icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 3v19M5 8h14M15 15h2a2 2 0 012 2v2a2 2 0 01-2 2H7a2 2 0 01-2-2v-2a2 2 0 012-2h2" />
            </svg>
        )
    },
    {
        href: "/gallery", label: "Gallery", icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21,15 16,10 5,21" />
            </svg>
        )
    },
    {
        href: "/profile", label: "Profile", icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                <circle cx="12" cy="7" r="4" />
            </svg>
        )
    },
];

export default function MobileNav() {
    const pathname = usePathname();
    const { user } = useAuth();

    if (!user) return null;

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 block sm:hidden">
            <div className="absolute inset-0 bg-ink/80 backdrop-blur-xl border-t border-parchment-faint/10" />
            <div className="relative flex items-center justify-around h-16 px-4">
                {links.map((link) => {
                    const isActive = pathname === link.href;
                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            rel="nofollow"
                            className={`flex flex-col items-center justify-center gap-1 w-16 transition-colors ${isActive ? "text-gold" : "text-parchment-muted"
                                }`}
                        >
                            <div className={`transition-transform duration-300 ${isActive ? "scale-110" : ""}`}>
                                {link.icon}
                            </div>
                            <span className="text-[10px] font-medium uppercase tracking-wider">{link.label}</span>
                            {isActive && (
                                <div className="absolute bottom-1 w-1 h-1 rounded-full bg-gold shadow-[0_0_8px_rgba(201,168,76,0.6)]" />
                            )}
                        </Link>
                    );
                })}
            </div>
            {/* Safe area padding for newer iPhones */}
            <div className="h-[env(safe-area-inset-bottom)] bg-ink/80" />
        </nav>
    );
}
