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
      className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-16"
    >
      <div className="mb-8 sm:mb-10">
        <p className="flex items-center gap-2.5 text-[10px] uppercase tracking-[0.25em] text-gold font-medium">
          <span className="w-6 h-px bg-gold/60" />
          Studio
        </p>
        <h2 className="font-display text-3xl sm:text-4xl font-medium tracking-tight text-parchment mt-3">
          Restyle your room now
        </h2>
        <p className="text-parchment-muted text-sm mt-3 max-w-2xl font-light leading-relaxed">
          Complete pipeline: upload, transform, iterate, compare, and export.
          Everything below is fully interactive and connected to the AI
          generation APIs.
        </p>
      </div>

      <div className="w-full space-y-8 sm:space-y-12">
        {/* Mode Tabs */}
        <section className="w-full animate-reveal-up">
          <ModeTabs activeMode={mode} onModeChange={onModeChange} />
        </section>

        {/* Step 01 — Upload */}
        <section className="w-full animate-reveal-up relative rounded-xl border-l-2 border-l-gold/30 border border-parchment-faint/12 bg-ink-raised p-5 sm:p-7">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-[10px] uppercase tracking-[0.2em] text-gold font-medium">
              01
            </span>
            <div className="h-px flex-1 bg-parchment-faint/15" />
            <span className="text-[10px] uppercase tracking-[0.2em] text-parchment-muted">
              Upload
            </span>
          </div>
          <p className="text-[11px] text-parchment-muted/70 mb-5 font-light">
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

        {/* Step 02 — Style / Color */}
        {originalImage && (
          <section
            className="w-full animate-reveal-up relative rounded-xl border-l-2 border-l-gold/30 border border-parchment-faint/12 bg-ink-raised p-5 sm:p-7"
            style={{ animationDelay: "40ms" }}
          >
            <div className="flex items-center gap-3 mb-2">
              <span className="text-[10px] uppercase tracking-[0.2em] text-gold font-medium">
                02
              </span>
              <div className="h-px flex-1 bg-parchment-faint/15" />
              <span className="text-[10px] uppercase tracking-[0.2em] text-parchment-muted">
                {mode === "paint" ? "Color" : "Style"}
              </span>
            </div>
            <p className="text-[11px] text-parchment-muted/70 mb-5 font-light">
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

        {/* Error */}
        {error && (
          <div className="border border-rose/30 bg-rose/8 rounded-lg px-5 py-4 text-rose text-sm animate-reveal-up">
            {error}
          </div>
        )}

        {/* Variations */}
        {showVariations && (
          <section
            className="w-full animate-reveal-up relative rounded-xl border-l-2 border-l-gold/30 border border-parchment-faint/12 bg-ink-raised p-5 sm:p-7"
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

        {/* Step 03 — Result */}
        {restyledImage && !showVariations && (
          <section
            className="w-full animate-reveal-up relative rounded-xl border-l-2 border-l-gold/30 border border-parchment-faint/12 bg-ink-raised p-5 sm:p-7"
            style={{ animationDelay: "40ms" }}
          >
            <div className="flex items-center gap-3 mb-2">
              <span className="text-[10px] uppercase tracking-[0.2em] text-gold font-medium">
                03
              </span>
              <div className="h-px flex-1 bg-parchment-faint/15" />
              <span className="text-[10px] uppercase tracking-[0.2em] text-parchment-muted">
                {currentStyle}
              </span>
            </div>
            <p className="text-[11px] text-parchment-muted/70 mb-5 font-light">
              {mode === "paint"
                ? "Drag the slider to compare before and after. Pick another swatch to instantly test a different paint direction."
                : "Drag the slider to compare before/after. Then refine by chat, or branch into 4 new design interpretations."}
            </p>

            <BeforeAfter before={originalImage} after={restyledImage} />

            {!isGenerating && (
              <div className="mt-5 flex items-center justify-between flex-wrap gap-2">
                {mode !== "paint" && (
                  <div className="flex items-center gap-2">
                    {variations.length > 0 && (
                      <button
                        onClick={onBackToVariations}
                        title="Go back to the 2x2 grid to pick a different variation"
                        className="flex items-center gap-1.5 px-3.5 py-2 text-xs text-parchment border border-parchment-faint/25 bg-ink rounded-full hover:border-gold/50 hover:bg-gold/8 transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-gold/40"
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
                      className="flex items-center gap-1.5 px-3.5 py-2 text-xs text-parchment border border-parchment-faint/25 bg-ink rounded-full hover:border-olive/60 hover:bg-olive/12 transition-all duration-200 cursor-pointer disabled:opacity-25 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-olive/40"
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
                        className="flex items-center gap-1.5 px-3.5 py-2 text-xs text-parchment border border-parchment-faint/25 bg-ink rounded-full hover:border-gold/50 hover:bg-gold/8 transition-all duration-200 cursor-pointer disabled:opacity-25 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-gold/40"
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
                        className="flex items-center gap-1.5 px-3.5 py-2 text-xs text-parchment border border-parchment-faint/25 bg-ink rounded-full hover:border-gold/50 hover:bg-gold/8 transition-all duration-200 cursor-pointer disabled:opacity-25 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-gold/40"
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
                      <span className="text-[10px] text-parchment-faint/50 ml-1">
                        {versionIndex === -1 ? versions.length : versionIndex + 1} / {versions.length}
                      </span>
                    </>
                  )}
                </div>
              </div>
            )}

            {mode !== "paint" && (moodBoard || moodBoardLoading) && (
              <div className="mt-7">
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
