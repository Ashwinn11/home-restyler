"use client";

import { useCallback, useRef, useState } from "react";
import GeneratingOverlay from "@/components/GeneratingOverlay";
import AppWorkspace from "@/components/home/AppWorkspace";
import MarketingLanding from "@/components/home/MarketingLanding";
import type {
  AppMode,
  ChatMessage,
  ConversationTurn,
  ElementFilter,
  MoodBoardData,
  Snapshot,
} from "@/lib/types";

export default function HomeClient() {
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

  const [variations, setVariations] = useState<
    { image: string; text?: string }[]
  >([]);
  const [showVariations, setShowVariations] = useState(false);
  const [variationsLoading, setVariationsLoading] = useState(false);
  const [selectedVariation, setSelectedVariation] = useState<number | null>(
    null
  );

  const [moodBoard, setMoodBoard] = useState<MoodBoardData | null>(null);
  const [moodBoardLoading, setMoodBoardLoading] = useState(false);

  const [versions, setVersions] = useState<Snapshot[]>([]);
  const [versionIndex, setVersionIndex] = useState(-1);

  const conversationHistory = useRef<ConversationTurn[]>([]);
  const styleRequestId = useRef(0);

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
        if (requestId === styleRequestId.current) {
          setMoodBoard(data);
        }
      } catch {
        // Mood board is optional.
      } finally {
        if (requestId === styleRequestId.current) {
          setMoodBoardLoading(false);
        }
      }
    })();
  }, []);

  const handleStyleSelected = useCallback(
    async (style: string, customPrompt?: string) => {
      if (!originalImage) return;
      const requestId = ++styleRequestId.current;
      setIsGenerating(true);
      setError("");
      resetGenerationState();
      setCurrentStyle(style);

      try {
        const body: Record<string, string> = {
          image: originalImage,
          mimeType: originalMimeType,
          style,
          mode,
        };
        if (customPrompt) body.customPrompt = customPrompt;

        const res = await fetch("/api/restyle", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Generation failed");
        if (requestId !== styleRequestId.current) return;
        setRestyledImage(data.image);

        const initialHistory = [
          {
            role: "user",
            parts: [
              {
                inlineData: {
                  mimeType: originalMimeType,
                  data: originalImage,
                },
              },
              {
                text: `Restyle this room in ${style} style.`,
              },
            ],
          },
        ];
        conversationHistory.current = initialHistory;

        const initialMessages: ChatMessage[] = data.text
          ? [{ role: "assistant", text: data.text }]
          : [];
        setChatMessages(initialMessages);

        setVersions([
          {
            image: data.image,
            messages: initialMessages,
            history: [...initialHistory],
          },
        ]);
        setVersionIndex(-1);

        void (async () => {
          try {
            const suggestionsRes = await fetch("/api/suggestions", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                image: data.image,
                mimeType: "image/png",
                style,
                customPrompt,
              }),
            });
            if (!suggestionsRes.ok || requestId !== styleRequestId.current) {
              return;
            }
            const suggestionsData = await suggestionsRes.json();
            if (
              requestId === styleRequestId.current &&
              suggestionsData.suggestions
            ) {
              setSuggestions(suggestionsData.suggestions);
            }
          } catch {
            // Suggestions are optional.
          }
        })();

        fetchMoodBoard(data.image, requestId);
      } catch (err) {
        if (requestId !== styleRequestId.current) return;
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        if (requestId === styleRequestId.current) {
          setIsGenerating(false);
        }
      }
    },
    [
      originalImage,
      originalMimeType,
      mode,
      resetGenerationState,
      fetchMoodBoard,
    ]
  );

  const handlePaintSelected = useCallback(
    async (colorHex: string, finish: string) => {
      setPaintColor(colorHex);
      setPaintFinish(finish);

      if (!originalImage) return;
      const requestId = ++styleRequestId.current;
      setIsGenerating(true);
      setError("");
      setRestyledImage("");
      setChatMessages([]);
      setSuggestions([]);
      setVersions([]);
      setVersionIndex(-1);
      setVariations([]);
      setShowVariations(false);
      setSelectedVariation(null);
      setMoodBoard(null);
      setCurrentStyle(`${colorHex} ${finish}`);
      conversationHistory.current = [];

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

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Generation failed");
        if (requestId !== styleRequestId.current) return;
        setRestyledImage(data.image);
      } catch (err) {
        if (requestId !== styleRequestId.current) return;
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        if (requestId === styleRequestId.current) {
          setIsGenerating(false);
        }
      }
    },
    [originalImage, originalMimeType]
  );

  const hasEditsAfterVariation =
    variations.length > 0 && selectedVariation !== null && versions.length > 1;

  const handleGenerateVariations = useCallback(async () => {
    if (!originalImage) return;

    if (hasEditsAfterVariation) {
      const confirmed = window.confirm(
        "You have chat edits on this variation. Regenerating will discard them and create 4 fresh options from your original image. Continue?"
      );
      if (!confirmed) return;
    }

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

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Generation failed");
      setVariations(data.variations || []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to generate variations"
      );
      setShowVariations(false);
    } finally {
      setVariationsLoading(false);
    }
  }, [
    originalImage,
    originalMimeType,
    mode,
    currentStyle,
    paintColor,
    paintFinish,
    hasEditsAfterVariation,
  ]);

  const handleVariationSelect = useCallback(
    (variation: { image: string; text?: string }) => {
      const idx = variations.indexOf(variation);
      setSelectedVariation(idx);
      setRestyledImage(variation.image);
      setShowVariations(false);

      const initialMessages: ChatMessage[] = variation.text
        ? [{ role: "assistant", text: variation.text }]
        : [];
      setChatMessages(initialMessages);

      const initialHistory = [
        {
          role: "user",
          parts: [
            {
              inlineData: {
                mimeType: originalMimeType,
                data: originalImage,
              },
            },
            { text: `Selected variation for ${currentStyle}.` },
          ],
        },
      ];
      conversationHistory.current = initialHistory;

      setVersions([
        {
          image: variation.image,
          messages: initialMessages,
          history: [...initialHistory],
        },
      ]);
      setVersionIndex(-1);

      fetchMoodBoard(variation.image, styleRequestId.current);
    },
    [variations, originalMimeType, originalImage, currentStyle, fetchMoodBoard]
  );

  const handleBackToVariations = useCallback(() => {
    setShowVariations(true);
  }, []);

  const canUndo =
    versionIndex > 0 || (versionIndex === -1 && versions.length > 0);
  const canRedo = versionIndex >= 0 && versionIndex < versions.length - 1;

  const navigateVersion = useCallback(
    (index: number) => {
      const snap = versions[index];
      if (!snap) return;
      setVersionIndex(index);
      setRestyledImage(snap.image);
      setChatMessages(snap.messages);
      conversationHistory.current = [...snap.history];
    },
    [versions]
  );

  const handleUndo = useCallback(() => {
    if (!canUndo) return;
    const target = versionIndex === -1 ? versions.length - 2 : versionIndex - 1;
    if (target >= 0) navigateVersion(target);
  }, [canUndo, versionIndex, versions.length, navigateVersion]);

  const handleRedo = useCallback(() => {
    if (!canRedo) return;
    navigateVersion(versionIndex + 1);
  }, [canRedo, versionIndex, navigateVersion]);

  const handleRefine = useCallback(
    async (message: string, elementFilter?: ElementFilter) => {
      if (!restyledImage) return;

      const currentVersions =
        versionIndex === -1 ? versions : versions.slice(0, versionIndex + 1);

      const snapshot: Snapshot = {
        image: restyledImage,
        messages: [...chatMessages],
        history: [...conversationHistory.current],
      };
      const newVersions = [...currentVersions, snapshot];

      setChatMessages((prev) => [...prev, { role: "user", text: message }]);
      setIsGenerating(true);
      setError("");

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

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Refinement failed");

        conversationHistory.current.push({
          role: "user",
          parts: [
            { inlineData: { mimeType: "image/png", data: restyledImage } },
            { text: `Edit this room image: ${message}` },
          ],
        });

        const newMessages = data.text
          ? [
              ...chatMessages,
              { role: "user" as const, text: message },
              { role: "assistant" as const, text: data.text },
            ]
          : [...chatMessages, { role: "user" as const, text: message }];

        const resultSnapshot: Snapshot = {
          image: data.image,
          messages: newMessages,
          history: [
            ...conversationHistory.current,
            {
              role: "user",
              parts: [
                {
                  inlineData: { mimeType: "image/png", data: restyledImage },
                },
                { text: `Edit this room image: ${message}` },
              ],
            },
          ],
        };

        conversationHistory.current = resultSnapshot.history;
        setRestyledImage(data.image);
        setChatMessages(newMessages);
        setVersions([...newVersions, resultSnapshot]);
        setVersionIndex(-1);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
        setChatMessages((prev) => [
          ...prev,
          { role: "assistant", text: "Failed to refine. Try again." },
        ]);
        setVersions(currentVersions);
      } finally {
        setIsGenerating(false);
      }
    },
    [restyledImage, chatMessages, versions, versionIndex]
  );

  const overlayText = variationsLoading
    ? "Generating variations"
    : restyledImage
      ? "Refining your room"
      : mode === "paint"
        ? "Painting your walls"
        : "Restyling your room";

  return (
    <main className="min-h-screen bg-charcoal flex flex-col">
      <header className="sticky top-0 z-30 border-b border-warm-gray/25 bg-charcoal-light/90 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div>
            <p className="font-display text-2xl sm:text-3xl font-semibold tracking-tight text-cream">
              Room Restyler
            </p>
            <p className="text-warm-gray-light text-xs mt-0.5 font-light">
              AI design studio for instantly upgraded spaces
            </p>
          </div>
          <a
            href="#app-workspace"
            className="px-4 py-2 min-h-10 inline-flex items-center justify-center bg-terracotta text-cream text-[11px] uppercase tracking-[0.16em] font-medium hover:bg-terracotta-light transition-colors"
          >
            Start Restyling
          </a>
        </div>
      </header>

      <MarketingLanding />

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

      <footer className="border-t border-warm-gray/25 mt-auto bg-charcoal-light">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 grid sm:grid-cols-2 gap-6 items-center">
          <div>
            <p className="font-display text-2xl text-cream">Room Restyler</p>
            <p className="text-xs uppercase tracking-[0.15em] text-warm-gray-light mt-1">
              AI Interior Design Workflow
            </p>
          </div>
          <div className="text-xs text-warm-gray-light sm:text-right">
            <p>Upload. Restyle. Refine. Export.</p>
            <p className="mt-1">
              Powered by Gemini image generation and conversational editing.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
