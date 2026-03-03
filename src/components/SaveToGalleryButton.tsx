"use client";

import { useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { useToast } from "@/components/ToastProvider";

interface SaveToGalleryButtonProps {
    image: string;
    originalImage?: string;
    style?: string;
    metadata?: Record<string, unknown>;
}

export default function SaveToGalleryButton({
    image,
    originalImage,
    style,
    metadata,
}: SaveToGalleryButtonProps) {
    const { user } = useAuth();
    const toast = useToast();
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    if (!user) return null;

    const handleSave = async () => {
        setSaving(true);
        try {
            const res = await fetch("/api/gallery", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    image,
                    originalImage,
                    title: style ? `${style} Restyle` : "Room Design",
                    style,
                    metadata,
                }),
            });

            if (res.ok) {
                setSaved(true);
                toast.success("Saved to gallery");
                setTimeout(() => setSaved(false), 3000);
            } else {
                toast.error("Couldn't save", "Please try again.");
            }
        } catch {
            toast.error("Couldn't save", "Please try again.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <button
            onClick={handleSave}
            disabled={saving || saved}
            className={`flex items-center gap-1.5 border px-3.5 py-2 text-xs font-medium transition-all disabled:opacity-70 ${saved
                ? "border-olive/30 bg-olive/10 text-olive"
                : "border-gold/20 bg-gold/5 text-gold hover:bg-gold/12 hover:border-gold/40"
                }`}
        >
            {saved ? (
                <>
                    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="20,6 9,17 4,12" />
                    </svg>
                    Saved!
                </>
            ) : saving ? (
                <>
                    <svg className="h-3.5 w-3.5 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 2a10 10 0 110 20 10 10 0 010-20z" opacity="0.25" />
                        <path d="M12 2a10 10 0 019.5 7" />
                    </svg>
                    Saving...
                </>
            ) : (
                <>
                    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" />
                        <polyline points="17,21 17,13 7,13 7,21" />
                        <polyline points="7,3 7,8 15,8" />
                    </svg>
                    Save to Gallery
                </>
            )}
        </button>
    );
}
