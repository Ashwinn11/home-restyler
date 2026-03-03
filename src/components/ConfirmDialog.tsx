"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

interface ConfirmDialogProps {
    open: boolean;
    title: string;
    description: string;
    confirmLabel?: string;
    cancelLabel?: string;
    destructive?: boolean;
    loading?: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}

export default function ConfirmDialog({
    open,
    title,
    description,
    confirmLabel = "Confirm",
    cancelLabel = "Cancel",
    destructive = false,
    loading = false,
    onConfirm,
    onCancel,
}: ConfirmDialogProps) {
    const overlayRef = useRef<HTMLDivElement>(null);

    // Close on Escape
    useEffect(() => {
        if (!open) return;
        const handler = (e: KeyboardEvent) => {
            if (e.key === "Escape") onCancel();
        };
        document.addEventListener("keydown", handler);
        return () => document.removeEventListener("keydown", handler);
    }, [open, onCancel]);

    // Prevent body scroll while open
    useEffect(() => {
        if (open) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => { document.body.style.overflow = ""; };
    }, [open]);

    if (!open) return null;

    const dialog = (
        <div
            ref={overlayRef}
            className="fixed inset-0 z-[9998] flex items-center justify-center p-4"
            onClick={(e) => {
                if (e.target === overlayRef.current) onCancel();
            }}
        >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-ink/80 backdrop-blur-md" />

            {/* Panel */}
            <div className="relative w-full max-w-sm animate-reveal-up rounded-2xl border border-parchment-faint/15 bg-ink-raised p-7 shadow-2xl">
                {/* Title */}
                <h2 className="font-display text-xl font-semibold text-parchment">
                    {title}
                </h2>

                {/* Description */}
                <p className="mt-3 text-sm text-parchment-muted leading-relaxed">
                    {description}
                </p>

                {/* Actions */}
                <div className="mt-7 flex gap-3 justify-end">
                    <button
                        onClick={onCancel}
                        disabled={loading}
                        className="border border-parchment-faint/20 px-5 py-2 text-xs font-medium text-parchment-muted transition-all hover:bg-ink-elevated disabled:opacity-50"
                    >
                        {cancelLabel}
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={loading}
                        className={`px-5 py-2 text-xs font-semibold transition-all disabled:opacity-50 ${destructive
                            ? "border border-rose/30 bg-rose/10 text-rose hover:bg-rose/20"
                            : "bg-gold text-ink hover:bg-gold-soft"
                            }`}
                    >
                        {loading ? (
                            <span className="flex items-center gap-2">
                                <svg className="h-3 w-3 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <path d="M12 2a10 10 0 110 20 10 10 0 010-20z" opacity="0.25" />
                                    <path d="M12 2a10 10 0 019.5 7" />
                                </svg>
                                Processing...
                            </span>
                        ) : confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );

    return typeof document !== "undefined"
        ? createPortal(dialog, document.body)
        : null;
}
