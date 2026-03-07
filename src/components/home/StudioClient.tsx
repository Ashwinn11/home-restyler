"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useToast } from "@/components/ToastProvider";
import ConfirmDialog from "@/components/ConfirmDialog";
import GeneratingOverlay from "@/components/GeneratingOverlay";
import AppWorkspace from "@/components/home/AppWorkspace";
import { useAuth } from "@/components/AuthProvider";
import type {
    AppMode,
    ChatMessage,
    ConversationTurn,
    ElementFilter,
    MoodBoardData,
    Snapshot,
} from "@/lib/types";

export default function StudioClient() {
    const { refreshCredits } = useAuth();
    const toast = useToast();

    const [originalImage, setOriginalImage] = useState("");
    const [originalMimeType, setOriginalMimeType] = useState("");
    const [restyledImage, setRestyledImage] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState("");
    const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
    const [currentStyle, setCurrentStyle] = useState("");
    const [suggestions, setSuggestions] = useState<string[]>([]);

    const [mode, setMode] = useState<AppMode>("restyle");
    const [paintColor, setPaintColor] = useState("");
    const [paintFinish, setPaintFinish] = useState("Matte");

    const [variations, setVariations] = useState<{ image: string; text?: string }[]>([]);
    const [showVariations, setShowVariations] = useState(false);
    const [variationsLoading, setVariationsLoading] = useState(false);
    const [selectedVariation, setSelectedVariation] = useState<number | null>(null);

    const [moodBoard, setMoodBoard] = useState<MoodBoardData | null>(null);
    const [moodBoardLoading, setMoodBoardLoading] = useState(false);

    const [versions, setVersions] = useState<Snapshot[]>([]);
    const [versionIndex, setVersionIndex] = useState(-1);

    const conversationHistory = useRef<ConversationTurn[]>([]);
    const styleRequestId = useRef(0);
    const [confirmRegenerateVariations, setConfirmRegenerateVariations] = useState(false);

    const searchParams = useSearchParams();

    useEffect(() => {
        const room = searchParams.get("room");
        const style = searchParams.get("style");

        if (style) {
            setCurrentStyle(style);
        }
        // If room is present, we could pre-set it in a "room type" state if it existed.
        // Currently the app focuses on the image upload first.
    }, [searchParams]);

    const resetGenerationState = useCallback(() => {
        setRestyledImage("");
        setChatMessages([]);
        setError("");
        setCurrentStyle("");
        setSuggestions([]);
        setVersions([]);
        setVersionIndex(-1);
        setVariations([]);
        setShowVariations(false);
        setSelectedVariation(null);
        setMoodBoard(null);
        setMoodBoardLoading(false);
        conversationHistory.current = [];
    }, []);

    const handleImageSelected = useCallback(
        (base64: string, mimeType: string) => {
            styleRequestId.current += 1;
            setOriginalImage(base64);
            setOriginalMimeType(mimeType);
            resetGenerationState();
        },
        [resetGenerationState]
    );

    const handleModeChange = useCallback(
        (newMode: AppMode) => {
            setMode(newMode);
            resetGenerationState();
        },
        [resetGenerationState]
    );

    const fetchMoodBoard = useCallback((imageData: string, requestId: number) => {
        setMoodBoardLoading(true);
        void (async () => {
            try {
                const res = await fetch("/api/moodboard", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ image: imageData, mimeType: "image/png" }),
                });
                if (!res.ok || requestId !== styleRequestId.current) return;
                const data = await res.json();
                setMoodBoard(data);
            } catch {
                // Moodboard is optional, fail silently
            } finally {
                setMoodBoardLoading(false);
            }
        })();
    }, []);

    const fetchSuggestions = useCallback((imageData: string, style: string, requestId: number) => {
        void (async () => {
            try {
                const res = await fetch("/api/suggestions", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ image: imageData, mimeType: "image/png", style }),
                });
                if (!res.ok || requestId !== styleRequestId.current) return;
                const data = await res.json();
                setSuggestions(data.suggestions || []);
            } catch {
                // Suggestions are optional
            }
        })();
    }, []);

    const handleStyleSelected = useCallback(
        async (style: string, customPrompt?: string) => {
            const requestId = ++styleRequestId.current;
            setIsGenerating(true);
            resetGenerationState();
            setCurrentStyle(style);
            try {
                const body: Record<string, string> = {
                    image: originalImage,
                    mimeType: originalMimeType,
                    style,
                };
                if (customPrompt) body.customPrompt = customPrompt;

                const res = await fetch("/api/restyle", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(body),
                });

                if (res.status === 401) {
                    toast.error("Session expired", "Redirecting to sign in...");
                    setTimeout(() => { window.location.href = "/login"; }, 1500);
                    return;
                }
                if (res.status === 402) {
                    toast.error("Out of credits", "Upgrade your plan to keep designing.");
                    return;
                }

                const data = await res.json();
                if (!res.ok) throw new Error(data.error || "Generation failed");

                if (requestId !== styleRequestId.current) return;
                setRestyledImage(data.image);
                void refreshCredits();

                const initialHistory = [
                    {
                        role: "user",
                        parts: [
                            { inlineData: { mimeType: originalMimeType, data: originalImage } },
                            { text: `Restyle this room in ${style} style.` },
                        ],
                    },
                    {
                        role: "model",
                        parts: [{ inlineData: { mimeType: "image/png", data: data.image } }],
                    },
                ];
                conversationHistory.current = initialHistory;
                fetchMoodBoard(data.image, requestId);
                fetchSuggestions(data.image, style, requestId);
            } catch (err) {
                if (requestId !== styleRequestId.current) return;
                setError(err instanceof Error ? err.message : "Something went wrong");
            } finally {
                if (requestId === styleRequestId.current) setIsGenerating(false);
            }
        },
        [originalImage, originalMimeType, fetchMoodBoard, fetchSuggestions, refreshCredits, resetGenerationState, toast]
    );

    const handlePaintSelected = useCallback(
        async (colorHex: string, finish: string) => {
            const requestId = ++styleRequestId.current;
            setIsGenerating(true);
            resetGenerationState();
            setPaintColor(colorHex);
            setPaintFinish(finish);
            setCurrentStyle(`${colorHex} ${finish}`);
            try {
                const res = await fetch("/api/restyle", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        image: originalImage,
                        mimeType: originalMimeType,
                        mode: "paint",
                        colorHex,
                        finish,
                    }),
                });

                if (res.status === 401) {
                    toast.error("Session expired", "Redirecting to sign in...");
                    setTimeout(() => { window.location.href = "/login"; }, 1500);
                    return;
                }
                if (res.status === 402) {
                    toast.error("Out of credits", "Upgrade your plan to keep designing.");
                    return;
                }

                const data = await res.json();
                if (!res.ok) throw new Error(data.error || "Generation failed");

                if (requestId !== styleRequestId.current) return;
                setRestyledImage(data.image);
                void refreshCredits();
            } catch (err) {
                if (requestId !== styleRequestId.current) return;
                setError(err instanceof Error ? err.message : "Something went wrong");
            } finally {
                if (requestId === styleRequestId.current) setIsGenerating(false);
            }
        },
        [originalImage, originalMimeType, refreshCredits, resetGenerationState, toast]
    );

    const hasEditsAfterVariation =
        variations.length > 0 && selectedVariation !== null && versions.length > 1;

    const doGenerateVariations = useCallback(async () => {
        setVariationsLoading(true);
        setShowVariations(true);
        setSelectedVariation(null);
        setVariations([]);

        try {
            const body: Record<string, string> = {
                image: originalImage,
                mimeType: originalMimeType,
                mode,
            };
            if (mode === "paint") {
                body.colorHex = paintColor;
                body.finish = paintFinish;
            } else {
                body.style = currentStyle;
            }

            const res = await fetch("/api/variations", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });

            if (res.status === 401) {
                toast.error("Session expired", "Redirecting to sign in...");
                setTimeout(() => { window.location.href = "/login"; }, 1500);
                return;
            }
            if (res.status === 402) {
                toast.error("Out of credits", "Upgrade your plan to keep designing.");
                return;
            }

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Generation failed");
            setVariations(data.variations || []);
            void refreshCredits();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to generate variations");
            setShowVariations(false);
        } finally {
            setVariationsLoading(false);
        }
    }, [originalImage, originalMimeType, mode, paintColor, paintFinish, currentStyle, refreshCredits, toast]);

    const handleGenerateVariations = useCallback(async () => {
        if (!originalImage) return;
        if (hasEditsAfterVariation) {
            setConfirmRegenerateVariations(true);
            return;
        }
        void doGenerateVariations();
    }, [originalImage, hasEditsAfterVariation, doGenerateVariations]);

    const handleVariationSelect = useCallback(
        (variation: { image: string; text?: string }) => {
            const idx = variations.indexOf(variation);
            setSelectedVariation(idx);
            setRestyledImage(variation.image);
            setShowVariations(false);
            setChatMessages([]);
            setVersions([]);
            setVersionIndex(-1);
            setMoodBoard(null);
            conversationHistory.current = [];
        },
        [variations]
    );

    const handleBackToVariations = useCallback(() => {
        setShowVariations(true);
        setRestyledImage("");
    }, []);

    const currentVersions = versions.slice(0, versionIndex === -1 ? versions.length : versionIndex + 1);
    const canUndo = versions.length > 0 && versionIndex !== 0;
    const canRedo = versionIndex !== -1 && versionIndex < versions.length - 1;

    const handleUndo = useCallback(() => {
        const target = versionIndex === -1 ? versions.length - 2 : versionIndex - 1;
        if (target < 0) return;
        setVersionIndex(target);
        const snap = versions[target];
        setRestyledImage(snap.image);
        setChatMessages(snap.messages);
        conversationHistory.current = snap.history;
    }, [versions, versionIndex]);

    const handleRedo = useCallback(() => {
        if (versionIndex === -1 || versionIndex >= versions.length - 1) return;
        const target = versionIndex + 1;
        setVersionIndex(target);
        const snap = versions[target];
        setRestyledImage(snap.image);
        setChatMessages(snap.messages);
        conversationHistory.current = snap.history;
    }, [versions, versionIndex]);

    const handleRefine = useCallback(
        async (message: string, elementFilter?: ElementFilter) => {
            setIsGenerating(true);
            try {
                const res = await fetch("/api/refine", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        history: conversationHistory.current,
                        message,
                        currentImage: restyledImage,
                        currentImageMimeType: "image/png",
                        elementFilter: elementFilter || null,
                    }),
                });

                if (res.status === 401) {
                    toast.error("Session expired", "Redirecting to sign in...");
                    setTimeout(() => { window.location.href = "/login"; }, 1500);
                    return;
                }
                if (res.status === 402) {
                    toast.error("Out of credits", "Upgrade your plan to keep designing.");
                    return;
                }

                const data = await res.json();
                if (!res.ok) throw new Error(data.error || "Refinement failed");
                void refreshCredits();

                conversationHistory.current.push({
                    role: "user",
                    parts: [
                        { inlineData: { mimeType: "image/png", data: restyledImage } },
                        { text: `Edit this room image: ${message}` },
                    ],
                });

                const newMessages = data.text
                    ? [...chatMessages, { role: "user" as const, text: message }, { role: "assistant" as const, text: data.text }]
                    : [...chatMessages, { role: "user" as const, text: message }];

                const resultSnapshot: Snapshot = {
                    image: data.image,
                    messages: newMessages,
                    history: [
                        ...conversationHistory.current,
                        { role: "model", parts: [{ inlineData: { mimeType: "image/png", data: data.image } }] },
                        { role: "user", parts: [{ inlineData: { mimeType: "image/png", data: restyledImage } }, { text: `Edit this room image: ${message}` }] },
                    ],
                };

                conversationHistory.current = resultSnapshot.history;
                setRestyledImage(data.image);
                setChatMessages(newMessages);
                setVersions([...currentVersions, resultSnapshot]);
                setVersionIndex(-1);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Something went wrong");
                setChatMessages((prev) => [...prev, { role: "assistant", text: "Failed to refine. Try again." }]);
                setVersions(currentVersions);
            } finally {
                setIsGenerating(false);
            }
        },
        [restyledImage, chatMessages, versions, versionIndex, refreshCredits, currentVersions, toast]
    );

    const overlayText = variationsLoading
        ? "Generating variations"
        : restyledImage
            ? "Refining your room"
            : mode === "paint"
                ? "Painting your walls"
                : "Restyling your room";

    return (
        <div className="min-h-screen bg-ink">
            <AppWorkspace
                mode={mode}
                onModeChange={handleModeChange}
                originalImage={originalImage}
                onImageSelected={handleImageSelected}
                isGenerating={isGenerating}
                error={error}
                showVariations={showVariations}
                variations={variations}
                variationsLoading={variationsLoading}
                selectedVariation={selectedVariation}
                onVariationSelect={handleVariationSelect}
                onStyleSelected={handleStyleSelected}
                onPaintSelected={handlePaintSelected}
                restyledImage={restyledImage}
                currentStyle={currentStyle}
                onGenerateVariations={handleGenerateVariations}
                onBackToVariations={handleBackToVariations}
                versions={versions}
                versionIndex={versionIndex}
                canUndo={canUndo}
                canRedo={canRedo}
                onUndo={handleUndo}
                onRedo={handleRedo}
                moodBoard={moodBoard}
                moodBoardLoading={moodBoardLoading}
                chatMessages={chatMessages}
                suggestions={suggestions}
                onRefine={handleRefine}
            />

            {(isGenerating || variationsLoading) && (
                <GeneratingOverlay text={overlayText} />
            )}

            <ConfirmDialog
                open={confirmRegenerateVariations}
                title="Discard edits and regenerate?"
                description="You have chat edits on this variation. Regenerating will discard them and create 4 fresh options from your original image."
                confirmLabel="Regenerate"
                onConfirm={() => {
                    setConfirmRegenerateVariations(false);
                    void doGenerateVariations();
                }}
                onCancel={() => setConfirmRegenerateVariations(false)}
            />
        </div>
    );
}
