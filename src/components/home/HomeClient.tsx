"use client";

import { useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import MarketingLanding from "@/components/home/MarketingLanding";
import { useAuth } from "@/components/AuthProvider";
import ExploreLinks from "@/components/seo/ExploreLinks";

function HomeInner() {
  const searchParams = useSearchParams();
  const { openAuthModal, user } = useAuth();

  // Open auth modal when redirected from protected pages or /login
  useEffect(() => {
    if (searchParams.get("modal") === "auth" && !user) {
      openAuthModal();
    }
  }, [searchParams, openAuthModal, user]);

  return (
    <main className="min-h-screen bg-ink flex flex-col">
      <MarketingLanding />

      {/* Footer */}
      <footer className="border-t border-parchment-faint/12 mt-auto bg-ink-raised pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
          <ExploreLinks />
          <div className="grid sm:grid-cols-3 gap-8 mt-16">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 border border-gold/20 flex items-center justify-center bg-ink-raised shrink-0 overflow-hidden">
                <img src="/icon.png" alt="" className="w-full h-full object-cover" />
              </div>
              <div>
                <p className="font-display text-xl text-parchment font-medium">HomeRestyler</p>
                <div className="w-8 h-px bg-gold/40 mt-2" />
                <p className="text-[10px] uppercase tracking-[0.2em] text-parchment-muted mt-2">
                  AI Interior Design Studio
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-parchment-faint mb-3">Product</p>
              <a href="/studio" className="block text-xs text-parchment-muted hover:text-parchment transition-colors">Studio</a>
              <a href="/gallery" className="block text-xs text-parchment-muted hover:text-parchment transition-colors">Gallery</a>
              <a href="/profile" className="block text-xs text-parchment-muted hover:text-parchment transition-colors">Profile</a>
            </div>

            <div className="space-y-2">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-parchment-faint mb-3">Legal</p>
              <a href="/privacy" className="block text-xs text-parchment-muted hover:text-parchment transition-colors">Privacy Policy</a>
              <a href="/terms" className="block text-xs text-parchment-muted hover:text-parchment transition-colors">Terms of Service</a>
              <a href="/refund-policy" className="block text-xs text-parchment-muted hover:text-parchment transition-colors">Refund Policy</a>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-parchment-faint/8 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-[11px] text-parchment-faint font-light">© {new Date().getFullYear()} HomeRestyler. All rights reserved.</p>
            <p className="text-[11px] text-parchment-faint font-light">
              Powered by Gemini AI
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}

export default function HomeClient() {
  return (
    <Suspense fallback={null}>
      <HomeInner />
    </Suspense>
  );
}
