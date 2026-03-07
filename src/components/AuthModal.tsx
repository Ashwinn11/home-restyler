"use client";

import { createClient } from "@/lib/supabase-browser";
import { createPortal } from "react-dom";
import { useEffect, useRef } from "react";

interface AuthModalProps {
    open: boolean;
    onClose: () => void;
    redirectTo?: string;
}

export default function AuthModal({ open, onClose, redirectTo }: AuthModalProps) {
    const overlayRef = useRef<HTMLDivElement>(null);

    const handleGoogleLogin = async () => {
        const supabase = createClient();
        const next = redirectTo || window.location.pathname;
        await supabase.auth.signInWithOAuth({
            provider: "google",
            options: {
                redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
            },
        });
    };

    useEffect(() => {
        if (!open) return;
        const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
        document.addEventListener("keydown", handler);
        document.body.style.overflow = "hidden";
        return () => {
            document.removeEventListener("keydown", handler);
            document.body.style.overflow = "";
        };
    }, [open, onClose]);

    if (!open) return null;

    const modal = (
        <div
            ref={overlayRef}
            className="fixed inset-0 z-[9998] flex items-center justify-center p-4"
            onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
        >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-ink/85 backdrop-blur-md" />

            {/* Panel */}
            <div className="relative w-full max-w-sm animate-reveal-up">
                {/* Close */}
                <button
                    onClick={onClose}
                    className="absolute -top-4 right-0 sm:-top-3 sm:-right-3 z-10 flex h-9 w-9 items-center justify-center border border-parchment-faint/20 bg-ink-raised text-parchment-muted transition-colors hover:text-parchment rounded-sm"
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                </button>

                <div className="border border-parchment-faint/15 bg-ink-raised p-6 sm:p-8 shadow-2xl">
                    {/* Logo */}
                    <div className="mb-8 text-center">
                        <div className="mx-auto mb-4 h-12 w-12 overflow-hidden border border-gold/20 bg-gold/5">
                            <img src="/icon.png" alt="homerestyler" className="h-full w-full object-cover" />
                        </div>
                        <h2 className="font-display text-2xl font-semibold text-parchment">
                            Welcome back
                        </h2>
                        <p className="mt-1.5 text-sm text-parchment-muted">
                            Sign in to start reimagining your spaces
                        </p>
                    </div>

                    {/* Google Sign In */}
                    <button
                        onClick={handleGoogleLogin}
                        className="flex w-full items-center justify-center gap-3 border border-parchment-faint/20 bg-ink px-4 py-3 text-sm font-medium text-parchment transition-all hover:border-parchment-faint/40 hover:bg-ink-elevated active:scale-[0.98]"
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                        </svg>
                        Continue with Google
                    </button>

                    {/* Benefits */}
                    <div className="mt-7 space-y-2.5">
                        {[
                            { icon: "★", text: "25 free credits to start designing" },
                            { icon: "▦", text: "Save favorite designs to your gallery" },
                            { icon: "◷", text: "Full design history & usage tracking" },
                        ].map((item) => (
                            <div key={item.text} className="flex items-center gap-3 border border-parchment-faint/5 bg-ink px-4 py-2.5">
                                <span className="text-gold text-xs">{item.icon}</span>
                                <span className="text-xs text-parchment-muted">{item.text}</span>
                            </div>
                        ))}
                    </div>

                    <p className="mt-6 text-center text-[10px] text-parchment-faint">
                        By signing in you agree to our{" "}
                        <a href="/terms" className="underline hover:text-parchment-muted">Terms</a>{" "}
                        and{" "}
                        <a href="/privacy" className="underline hover:text-parchment-muted">Privacy Policy</a>.
                    </p>
                </div>
            </div>
        </div>
    );

    return typeof document !== "undefined"
        ? createPortal(modal, document.body)
        : null;
}
