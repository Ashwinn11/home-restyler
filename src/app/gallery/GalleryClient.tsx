"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { useToast } from "@/components/ToastProvider";
import ConfirmDialog from "@/components/ConfirmDialog";
import Link from "next/link";
import Image from "next/image";

interface GalleryItem {
    id: string;
    image_url: string;
    original_image_url: string | null;
    title: string;
    style: string | null;
    created_at: string;
}

export default function GalleryClient() {
    const { user } = useAuth();
    const toast = useToast();
    const [items, setItems] = useState<GalleryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
    const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
    const [showOriginal, setShowOriginal] = useState(false);

    useEffect(() => {
        if (!user) return;
        fetchGallery();
    }, [user]);

    const fetchGallery = async () => {
        try {
            const res = await fetch("/api/gallery");
            if (!res.ok) return;
            const data = await res.json();
            setItems(data.items || []);
        } catch (err) {
            console.error("Gallery fetch error:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteConfirm = async () => {
        if (!confirmDeleteId) return;
        const id = confirmDeleteId;
        setDeletingId(id);
        setConfirmDeleteId(null);
        try {
            const res = await fetch(`/api/gallery?id=${id}`, { method: "DELETE" });
            if (res.ok) {
                setItems(items.filter((item) => item.id !== id));
                if (selectedItem?.id === id) setSelectedItem(null);
                toast.success("Design removed from gallery");
            } else {
                toast.error("Failed to delete", "Please try again.");
            }
        } catch {
            toast.error("Failed to delete", "Please try again.");
        } finally {
            setDeletingId(null);
        }
    };

    if (!user) return null;

    const activeImageUrl = showOriginal && selectedItem?.original_image_url
        ? selectedItem.original_image_url
        : selectedItem?.image_url ?? "";

    return (
        <div className="min-h-screen bg-ink pt-20 pb-16">
            <div className="mx-auto max-w-6xl px-4 sm:px-6">

                {/* Header */}
                <div className="mb-8">
                    <h1 className="font-display text-3xl font-semibold text-parchment">
                        Your Gallery
                    </h1>
                    <p className="mt-1 text-sm text-parchment-muted">
                        Your saved AI room design transformations
                    </p>
                </div>

                {/* Loading skeleton */}
                {loading && (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="aspect-[4/3] animate-pulse bg-ink-raised" />
                        ))}
                    </div>
                )}

                {/* Empty state */}
                {!loading && items.length === 0 && (
                    <div className="mt-16 flex flex-col items-center text-center">
                        <div className="flex h-20 w-20 items-center justify-center border border-parchment-faint/10 bg-ink-raised">
                            <svg className="h-10 w-10 text-parchment-faint" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                                <circle cx="8.5" cy="8.5" r="1.5" />
                                <polyline points="21,15 16,10 5,21" />
                            </svg>
                        </div>
                        <h2 className="mt-4 font-display text-xl font-semibold text-parchment">
                            No designs saved yet
                        </h2>
                        <p className="mt-2 max-w-xs text-sm text-parchment-muted">
                            Start restyling rooms and save your favorites here for quick access.
                        </p>
                        <Link href="/studio" className="mt-6 border border-gold/30 bg-gold/10 px-6 py-2.5 text-sm font-semibold text-gold transition-all hover:bg-gold/20 hover:border-gold/50">
                            Open Studio
                        </Link>
                    </div>
                )}

                {/* Gallery grid */}
                {!loading && items.length > 0 && (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {items.map((item) => (
                            <div
                                key={item.id}
                                className="group relative overflow-hidden border border-parchment-faint/10 bg-ink-raised transition-all hover:border-gold/20"
                            >
                                <button onClick={() => setSelectedItem(item)} className="block w-full">
                                    <div className="relative aspect-[4/3] w-full overflow-hidden">
                                        <Image
                                            src={item.image_url}
                                            alt={`AI room design — ${item.style || "custom"} style room transformation`}
                                            fill
                                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                                        />
                                    </div>
                                </button>

                                {/* Overlay */}
                                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/90 to-transparent p-4 pt-12">
                                    <h3 className="text-sm font-semibold text-parchment">{item.title}</h3>
                                    <div className="mt-1 flex items-center justify-between">
                                        <p className="text-[10px] text-parchment-muted">
                                            {new Date(item.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                                        </p>
                                        {item.style && (
                                            <span className="border border-gold/20 bg-gold/5 px-2 py-0.5 text-[10px] text-gold">
                                                {item.style}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Delete button */}
                                <button
                                    onClick={(e) => { e.stopPropagation(); setConfirmDeleteId(item.id); }}
                                    disabled={deletingId === item.id}
                                    aria-label="Remove from gallery"
                                    className="absolute top-2 right-2 flex h-7 w-7 items-center justify-center bg-ink/60 text-parchment-muted opacity-0 backdrop-blur-sm transition-all hover:bg-rose/20 hover:text-rose group-hover:opacity-100 disabled:opacity-50"
                                >
                                    {deletingId === item.id ? (
                                        <svg className="h-3.5 w-3.5 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M12 2a10 10 0 110 20 10 10 0 010-20z" opacity="0.25" />
                                            <path d="M12 2a10 10 0 019.5 7" />
                                        </svg>
                                    ) : (
                                        <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="3,6 5,6 21,6" />
                                            <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
                                            <path d="M10 11v6" /><path d="M14 11v6" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {/* Lightbox */}
                {selectedItem && (
                    <div
                        className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-ink/95 backdrop-blur-md p-2 sm:p-4"
                        onClick={() => { setSelectedItem(null); setShowOriginal(false); }}
                    >
                        <div className="relative flex flex-col w-full max-w-5xl h-full max-h-[92vh] animate-reveal-up" onClick={(e) => e.stopPropagation()}>
                            {/* Close button - Top right for mobile reachability */}
                            <button
                                onClick={() => { setSelectedItem(null); setShowOriginal(false); }}
                                className="absolute -top-1 -right-1 sm:top-2 sm:right-2 z-[60] flex h-9 w-9 items-center justify-center bg-ink/80 text-parchment-muted border border-parchment-faint/20 rounded-full"
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                            </button>

                            <div className="relative flex-1 w-full overflow-hidden">
                                <Image
                                    src={activeImageUrl}
                                    alt={`${selectedItem.title} — AI room redesign`}
                                    fill
                                    sizes="100vw"
                                    className="object-contain"
                                    priority
                                />
                            </div>

                            {/* Controls */}
                            <div className="mt-2 sm:mt-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border border-parchment-faint/10 bg-ink-elevated/80 px-4 py-3 sm:py-4 backdrop-blur-sm rounded-lg">
                                <div className="hidden sm:block">
                                    <h3 className="text-sm font-semibold text-parchment truncate max-w-[200px]">{selectedItem.title}</h3>
                                    <p className="text-[10px] text-parchment-muted">{new Date(selectedItem.created_at).toLocaleDateString()}</p>
                                </div>
                                <div className="flex gap-2">
                                    {selectedItem.original_image_url && (
                                        <button
                                            onClick={() => setShowOriginal(!showOriginal)}
                                            className="flex-1 sm:flex-none border border-gold/30 bg-gold/10 px-6 py-2.5 text-xs font-semibold text-gold transition-all hover:bg-gold/20"
                                        >
                                            {showOriginal ? "Show Result" : "Show Original"}
                                        </button>
                                    )}
                                    <button
                                        onClick={() => { setSelectedItem(null); setShowOriginal(false); }}
                                        className="sm:hidden border border-parchment-faint/20 px-6 py-2.5 text-xs text-parchment-muted transition-all hover:bg-ink-elevated"
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Delete Confirm Dialog */}
            <ConfirmDialog
                open={!!confirmDeleteId}
                title="Remove from gallery?"
                description="This design will be permanently removed from your gallery. You can always save it again from the studio."
                confirmLabel="Remove"
                destructive
                loading={!!deletingId}
                onConfirm={handleDeleteConfirm}
                onCancel={() => setConfirmDeleteId(null)}
            />
        </div>
    );
}
