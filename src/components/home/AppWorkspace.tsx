import ImageUpload from "@/components/ImageUpload";
import StyleSelector from "@/components/StyleSelector";
import ColorPicker from "@/components/ColorPicker";
import ModeTabs from "@/components/ModeTabs";
import BeforeAfter from "@/components/BeforeAfter";
import ChatRefine from "@/components/ChatRefine";
import VariationsGrid from "@/components/VariationsGrid";
import DownloadButton from "@/components/DownloadButton";
import SaveToGalleryButton from "@/components/SaveToGalleryButton";
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
      className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-16"
    >
      <div className="mb-8 sm:mb-10">
        <p className="flex items-center gap-2.5 text-[10px] uppercase tracking-[0.25em] text-gold font-medium">
          <span className="w-6 h-px bg-gold/60" />
          Studio
        </p>
        <h2 className="font-display text-2xl sm:text-4xl font-medium tracking-tight text-parchment mt-2.5 sm:mt-3">
          Restyle your room
        </h2>
        <p className="text-parchment-muted text-xs sm:text-sm mt-2.5 sm:mt-3 max-w-2xl font-light leading-relaxed">
          Upload, transform, iterate, and export.
          <span className="hidden sm:inline"> Everything below is fully interactive and connected to the AI generation APIs.</span>
        </p>
      </div>

      <div className="w-full space-y-6 sm:space-y-12">
        {/* Mode Tabs */}
        <section className="w-full animate-reveal-up">
          <ModeTabs activeMode={mode} onModeChange={onModeChange} />
        </section>

        {/* Step 01 — Upload */}
        <section className="w-full animate-reveal-up relative rounded-xl border-l-2 border-l-gold/30 border border-parchment-faint/12 bg-ink-raised p-4 sm:p-7">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-[10px] uppercase tracking-[0.2em] text-gold font-medium">
              01
            </span>
            <div className="h-px flex-1 bg-parchment-faint/15" />
            <span className="text-[10px] uppercase tracking-[0.2em] text-parchment-muted">
              Upload
            </span>
          </div>
          <p className="text-[10px] sm:text-[11px] text-parchment-muted/70 mb-4 sm:mb-5 font-light">
            {mode === "paint"
              ? "Upload room photo. AI repaints only walls."
              : "Upload room photo. AI redesigns style."}{" "}
            <span className="hidden xs:inline">Switching modes keeps your photo.</span>
          </p>
          <ImageUpload
            onImageSelected={onImageSelected}
            currentImage={originalImage}
          />
        </section>

        {/* Step 02 — Style / Color */}
        {originalImage && (
          <section
            className="w-full animate-reveal-up relative rounded-xl border-l-2 border-l-gold/30 border border-parchment-faint/12 bg-ink-raised p-4 sm:p-7"
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
            <p className="text-[10px] sm:text-[11px] text-parchment-muted/70 mb-4 sm:mb-5 font-light">
              {mode === "paint"
                ? "Choose wall color and finish."
                : "Choose a design style to generate redesign."}
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
          <div className="border border-rose/30 bg-rose/8 rounded-lg px-4 py-3.5 text-rose text-xs sm:text-sm animate-reveal-up">
            {error}
          </div>
        )}

        {/* Variations */}
        {showVariations && (
          <section
            className="w-full animate-reveal-up relative rounded-xl border-l-2 border-l-gold/30 border border-parchment-faint/12 bg-ink-raised p-4 sm:p-7"
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
            className="w-full animate-reveal-up relative rounded-xl border-l-2 border-l-gold/30 border border-parchment-faint/12 bg-ink-raised p-4 sm:p-7"
            style={{ animationDelay: "40ms" }}
          >
            <div className="flex items-center gap-3 mb-2">
              <span className="text-[10px] uppercase tracking-[0.2em] text-gold font-medium">
                03
              </span>
              <div className="h-px flex-1 bg-parchment-faint/15" />
              <span className="text-[10px] uppercase tracking-[0.2em] text-parchment-muted truncate max-w-[150px]">
                {currentStyle}
              </span>
            </div>
            <p className="text-[10px] sm:text-[11px] text-parchment-muted/70 mb-4 sm:mb-5 font-light">
              {mode === "paint"
                ? "Compare before and after. Pick another swatch to test."
                : "Compare results. Refine by chat or branch variations."}
            </p>

            <div className="relative group">
              <BeforeAfter before={originalImage} after={restyledImage} />
            </div>

            {!isGenerating && (
              <div className="mt-6 flex flex-col gap-4">
                {/* Primary Actions Row */}
                <div className="flex flex-wrap items-center gap-2">
                  <DownloadButton image={restyledImage} />
                  <SaveToGalleryButton
                    image={restyledImage}
                    originalImage={originalImage}
                    style={currentStyle}
                    metadata={{ mode }}
                  />

                  {mode !== "paint" && (
                    <button
                      onClick={onGenerateVariations}
                      disabled={variationsLoading}
                      className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 text-xs text-parchment border border-parchment-faint/25 bg-ink hover:border-gold/50 transition-all duration-200"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                      </svg>
                      <span className="sm:hidden">Variations</span>
                      <span className="hidden sm:inline">{variations.length > 0 ? "Regenerate" : "Generate 4 Variations"}</span>
                    </button>
                  )}
                </div>

                {/* Secondary / History Row */}
                <div className="flex items-center justify-between border-t border-parchment-faint/10 pt-4">
                  <div className="flex items-center gap-1.5">
                    {variations.length > 0 && mode !== "paint" && (
                      <button
                        onClick={onBackToVariations}
                        className="p-2.5 text-parchment-muted hover:text-parchment hover:bg-ink rounded-lg transition-all"
                        title="Back to variations"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                      </button>
                    )}

                    {versions.length > 0 && mode !== "paint" && (
                      <div className="flex items-center gap-1 ml-1 sm:ml-2">
                        <button
                          onClick={onUndo}
                          disabled={!canUndo}
                          className="p-2.5 text-parchment-muted hover:text-gold disabled:opacity-30 transition-all"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" /></svg>
                        </button>
                        <button
                          onClick={onRedo}
                          disabled={!canRedo}
                          className="p-2.5 text-parchment-muted hover:text-gold disabled:opacity-30 transition-all"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10h-10a8 8 0 00-8 8v2m18-10l-6 6m6-6l-6-6" /></svg>
                        </button>
                        <span className="text-[10px] text-parchment-faint font-mono ml-2">
                          {versionIndex === -1 ? versions.length : versionIndex + 1}/{versions.length}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {mode !== "paint" && (moodBoard || moodBoardLoading) && (
              <div className="mt-8">
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
