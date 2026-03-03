"use client";

import {
    createContext,
    useCallback,
    useContext,
    useRef,
    useState,
} from "react";

type ToastType = "success" | "error" | "info";

interface Toast {
    id: number;
    type: ToastType;
    title: string;
    message?: string;
}

interface ToastContextValue {
    success: (title: string, message?: string) => void;
    error: (title: string, message?: string) => void;
    info: (title: string, message?: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
    const ctx = useContext(ToastContext);
    if (!ctx) throw new Error("useToast must be used inside <ToastProvider>");
    return ctx;
}

const ICONS: Record<ToastType, React.ReactNode> = {
    success: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20,6 9,17 4,12" />
        </svg>
    ),
    error: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="15" y1="9" x2="9" y2="15" />
            <line x1="9" y1="9" x2="15" y2="15" />
        </svg>
    ),
    info: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
    ),
};

const STYLES: Record<ToastType, string> = {
    success: "border-olive/30 bg-olive/10 text-olive",
    error: "border-rose/30 bg-rose/10 text-rose",
    info: "border-gold/30 bg-gold/10 text-gold",
};

function ToastItem({ toast, onDismiss }: { toast: Toast; onDismiss: () => void }) {
    return (
        <div
            className={`flex items-start gap-3 rounded-lg border px-5 py-3 shadow-2xl backdrop-blur-md text-sm font-medium animate-reveal-up max-w-sm ${STYLES[toast.type]}`}
            style={{ animationDuration: "200ms" }}
        >
            <span className="shrink-0 mt-0.5">{ICONS[toast.type]}</span>
            <div className="flex-1 leading-snug">
                <span>{toast.title}</span>
                {toast.message && (
                    <p className="mt-0.5 text-xs opacity-75 font-normal">{toast.message}</p>
                )}
            </div>
            <button
                onClick={onDismiss}
                className="shrink-0 mt-0.5 opacity-60 hover:opacity-100 transition-opacity"
            >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
            </button>
        </div>
    );
}

export default function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);
    const counter = useRef(0);

    const dismiss = useCallback((id: number) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    const add = useCallback((type: ToastType, title: string, message?: string) => {
        const id = ++counter.current;
        setToasts((prev) => [...prev, { id, type, title, message }]);
        setTimeout(() => dismiss(id), 4000);
    }, [dismiss]);

    const api: ToastContextValue = {
        success: (title, message) => add("success", title, message),
        error: (title, message) => add("error", title, message),
        info: (title, message) => add("info", title, message),
    };

    return (
        <ToastContext.Provider value={api}>
            {children}

            {/* Toast Viewport — fixed bottom-right */}
            <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-2 pointer-events-none">
                {toasts.map((toast) => (
                    <div key={toast.id} className="pointer-events-auto">
                        <ToastItem
                            toast={toast}
                            onDismiss={() => dismiss(toast.id)}
                        />
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
}
