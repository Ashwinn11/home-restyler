import ImageUpload from "@/components/ImageUpload";
import StyleSelector from "@/components/StyleSelector";
import ColorPicker from "@/components/ColorPicker";
import ModeTabs from "@/components/ModeTabs";
import BeforeAfter from "@/components/BeforeAfter";
import ChatRefine from "@/components/ChatRefine";
import VariationsGrid from "@/components/VariationsGrid";
import DownloadButton from "@/components/DownloadButton";
import MoodBoard from "@/components/MoodBoard";
import type {
  AppMode,
  ChatMessage,
  ElementFilter,
  MoodBoardData,
  Snapshot,
} from "@/lib/types";

interface AppWorkspaceProps {
  mode: AppMode;
  onModeChange: (mode: AppMode) => void;
  originalImage: string;
  onImageSelected: (base64: string, mimeType: string) => void;
  isGenerating: boolean;
  error: string;
  showVariations: boolean;
  variations: { image: string; text?: string }[];
  variationsLoading: boolean;
  selectedVariation: number | null;
  onVariationSelect: (variation: { image: string; text?: string }) => void;
  onStyleSelected: (style: string, customPrompt?: string) => void;
  onPaintSelected: (colorHex: string, finish: string) => void;
  restyledImage: string;
  currentStyle: string;
  onGenerateVariations: () => void;
  onBackToVariations: () => void;
  versions: Snapshot[];
  versionIndex: number;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  moodBoard: MoodBoardData | null;
  moodBoardLoading: boolean;
  chatMessages: ChatMessage[];
  suggestions: string[];
  onRefine: (message: string, elementFilter?: ElementFilter) => Promise<void>;
}

export default function AppWorkspace({
  mode,
  onModeChange,
  originalImage,
  onImageSelected,
  isGenerating,
  error,
  showVariations,
  variations,
  variationsLoading,
  selectedVariation,
  onVariationSelect,
  onStyleSelected,
  onPaintSelected,
  restyledImage,
  currentStyle,
  onGenerateVariations,
  onBackToVariations,
  versions,
  versionIndex,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  moodBoard,
  moodBoardLoading,
  chatMessages,
  suggestions,
  onRefine,
}: AppWorkspaceProps) {
  return (
    <section
      id="app-workspace"
      className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-12"
    >
      <div className="mb-6 sm:mb-8">
        <p className="text-[10px] uppercase tracking-[0.2em] text-terracotta">
          Application Workspace
        </p>
        <h2 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight text-cream mt-2">
          Restyle your room now
        </h2>
        <p className="text-warm-gray-light text-sm mt-2 max-w-2xl">
          Complete pipeline: upload, transform, iterate, compare, and export.
          Everything below is fully interactive and connected to the AI
          generation APIs.
        </p>
      </div>

      <div className="w-full space-y-6 sm:space-y-10">
        <section className="w-full animate-fade-up">
          <ModeTabs activeMode={mode} onModeChange={onModeChange} />
        </section>

        <section className="w-full animate-fade-up bg-charcoal-light border border-warm-gray/30 rounded-xl p-4 sm:p-6">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-[10px] uppercase tracking-[0.2em] text-terracotta font-medium">
              01
            </span>
            <div className="h-px flex-1 bg-warm-gray/30" />
            <span className="text-[10px] uppercase tracking-[0.2em] text-warm-gray-light">
              Upload
            </span>
          </div>
          <p className="text-[11px] text-warm-gray-light/70 mb-4">
            {mode === "paint"
              ? "Upload a photo of any room. AI will change only wall color and preserve the rest of the scene."
              : "Upload a room image. AI redesigns style while preserving your layout and core room structure."}{" "}
            Switching modes keeps your uploaded photo.
          </p>
          <ImageUpload
            onImageSelected={onImageSelected}
            currentImage={originalImage}
          />
        </section>

        {originalImage && (
          <section
            className="w-full animate-fade-up bg-charcoal-light border border-warm-gray/30 rounded-xl p-4 sm:p-6"
            style={{ animationDelay: "40ms" }}
          >
            <div className="flex items-center gap-3 mb-2">
              <span className="text-[10px] uppercase tracking-[0.2em] text-terracotta font-medium">
                02
              </span>
              <div className="h-px flex-1 bg-warm-gray/30" />
              <span className="text-[10px] uppercase tracking-[0.2em] text-warm-gray-light">
                {mode === "paint" ? "Color" : "Style"}
              </span>
            </div>
            <p className="text-[11px] text-warm-gray-light/70 mb-4">
              {mode === "paint"
                ? "Choose wall color and finish to repaint only painted surfaces in your room."
                : "Choose a design direction or type a custom prompt to generate your first full redesign."}{" "}
              Selecting an option starts generation immediately.
            </p>
            {mode === "paint" ? (
              <ColorPicker
                onColorSelected={onPaintSelected}
                disabled={isGenerating}
              />
            ) : (
              <StyleSelector
                onStyleSelected={onStyleSelected}
                disabled={isGenerating}
              />
            )}
          </section>
        )}

        {error && (
          <div className="border border-red-900/30 bg-red-950/20 rounded-lg px-5 py-4 text-red-300 text-sm animate-fade-up">
            {error}
          </div>
        )}

        {showVariations && (
          <section
            className="w-full animate-fade-up bg-charcoal-light border border-warm-gray/30 rounded-xl p-4 sm:p-6"
            style={{ animationDelay: "40ms" }}
          >
            <VariationsGrid
              variations={variations}
              isLoading={variationsLoading}
              onSelect={onVariationSelect}
              selectedIndex={selectedVariation}
            />
          </section>
        )}

        {restyledImage && !showVariations && (
          <section
            className="w-full animate-fade-up bg-charcoal-light border border-warm-gray/30 rounded-xl p-4 sm:p-6"
            style={{ animationDelay: "40ms" }}
          >
            <div className="flex items-center gap-3 mb-2">
              <span className="text-[10px] uppercase tracking-[0.2em] text-terracotta font-medium">
                03
              </span>
              <div className="h-px flex-1 bg-warm-gray/30" />
              <span className="text-[10px] uppercase tracking-[0.2em] text-warm-gray-light">
                {currentStyle}
              </span>
            </div>
            <p className="text-[11px] text-warm-gray-light/70 mb-4">
              {mode === "paint"
                ? "Drag the slider to compare before and after. Pick another swatch to instantly test a different paint direction."
                : "Drag the slider to compare before/after. Then refine by chat, or branch into 4 new design interpretations."}
            </p>

            <BeforeAfter before={originalImage} after={restyledImage} />

            {!isGenerating && (
              <div className="mt-4 flex items-center justify-between flex-wrap gap-2">
                {mode !== "paint" && (
                  <div className="flex items-center gap-2">
                    {variations.length > 0 && (
                      <button
                        onClick={onBackToVariations}
                        title="Go back to the 2x2 grid to pick a different variation"
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-cream border border-warm-gray/40 bg-charcoal rounded-full hover:border-terracotta hover:bg-terracotta/20 transition-all duration-150 cursor-pointer focus:outline-none focus:ring-2 focus:ring-terracotta/60"
                      >
                        <svg
                          className="w-3.5 h-3.5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3"
                          />
                        </svg>
                        Back to variations
                      </button>
                    )}
                    <button
                      onClick={onGenerateVariations}
                      disabled={variationsLoading}
                      title={
                        variations.length > 0
                          ? "Discard current variations and generate 4 new ones from scratch"
                          : "Generate 4 different AI interpretations of this style to choose from"
                      }
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-cream border border-warm-gray/40 bg-charcoal rounded-full hover:border-sage hover:bg-sage/20 transition-all duration-150 cursor-pointer disabled:opacity-25 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-sage/60"
                    >
                      <svg
                        className="w-3.5 h-3.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z"
                        />
                      </svg>
                      {variations.length > 0
                        ? "Regenerate variations"
                        : "Generate 4 variations"}
                    </button>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <DownloadButton image={restyledImage} />

                  {versions.length > 0 && mode !== "paint" && (
                    <>
                      <button
                        onClick={onUndo}
                        disabled={!canUndo}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-cream border border-warm-gray/40 bg-charcoal rounded-full hover:border-terracotta hover:bg-terracotta/20 transition-all duration-150 cursor-pointer disabled:opacity-25 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-terracotta/60"
                      >
                        <svg
                          className="w-3.5 h-3.5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3"
                          />
                        </svg>
                        Undo
                      </button>
                      <button
                        onClick={onRedo}
                        disabled={!canRedo}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-cream border border-warm-gray/40 bg-charcoal rounded-full hover:border-terracotta hover:bg-terracotta/20 transition-all duration-150 cursor-pointer disabled:opacity-25 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-terracotta/60"
                      >
                        Redo
                        <svg
                          className="w-3.5 h-3.5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15 15l6-6m0 0l-6-6m6 6H9a6 6 0 000 12h3"
                          />
                        </svg>
                      </button>
                      <span className="text-[10px] text-warm-gray/40 ml-1">
                        {versionIndex === -1 ? versions.length : versionIndex + 1} / {versions.length}
                      </span>
                    </>
                  )}
                </div>
              </div>
            )}

            {mode !== "paint" && (moodBoard || moodBoardLoading) && (
              <div className="mt-6">
                <MoodBoard data={moodBoard} isLoading={moodBoardLoading} />
              </div>
            )}

            {mode !== "paint" && (
              <div className="mt-8">
                <ChatRefine
                  onSendMessage={onRefine}
                  messages={chatMessages}
                  isLoading={isGenerating}
                  suggestions={suggestions}
                />
              </div>
            )}
          </section>
        )}
      </div>
    </section>
  );
}
