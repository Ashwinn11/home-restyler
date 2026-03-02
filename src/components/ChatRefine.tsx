"use client";

import { useState, useRef, useEffect } from "react";
import type { ChatMessage, ElementFilter } from "@/lib/types";

const ELEMENT_FILTERS: { key: ElementFilter; label: string }[] = [
  { key: null, label: "All" },
  { key: "walls", label: "Walls only" },
  { key: "floor", label: "Floor only" },
  { key: "furniture", label: "Furniture only" },
];

interface ChatRefineProps {
  onSendMessage: (message: string, elementFilter?: ElementFilter) => Promise<void>;
  messages: ChatMessage[];
  isLoading: boolean;
  suggestions: string[];
}

export default function ChatRefine({
  onSendMessage,
  messages,
  isLoading,
  suggestions,
}: ChatRefineProps) {
  const [input, setInput] = useState("");
  const [activeFilter, setActiveFilter] = useState<ElementFilter>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const msg = input.trim();
    if (!msg || isLoading) return;
    const filter = activeFilter;
    setInput("");
    setActiveFilter(null);
    await onSendMessage(msg, filter);
  };

  const handleSuggestion = (text: string) => {
    if (isLoading) return;
    const filter = activeFilter;
    setActiveFilter(null);
    onSendMessage(text, filter);
  };

  return (
    <div className="space-y-4 bg-ink-elevated border border-parchment-faint/12 rounded-lg p-5 sm:p-6">
      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-parchment-faint/15" />
        <h3 className="text-[10px] uppercase tracking-[0.2em] text-parchment-muted font-medium">
          Refine your design
        </h3>
        <div className="h-px flex-1 bg-parchment-faint/15" />
      </div>
      <p className="text-[11px] text-parchment-muted/60 font-light">
        Describe what you want to change in plain language. Each edit creates a new version you can undo.
      </p>

      {/* Quick suggestions */}
      {suggestions.length > 0 && (
        <div className="space-y-2">
          <p className="text-[10px] uppercase tracking-[0.15em] text-gold/70 font-medium">
            Quick ideas
          </p>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((s) => (
              <button
                key={s}
                onClick={() => handleSuggestion(s)}
                disabled={isLoading}
                className="px-4 py-2 min-h-10 text-sm sm:text-xs text-parchment border border-gold/25 bg-ink rounded-full hover:border-gold/50 hover:bg-gold/8 transition-all duration-200 cursor-pointer disabled:opacity-30 focus:outline-none focus:ring-2 focus:ring-gold/40"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Messages */}
      {messages.length > 0 && (
        <div
          ref={scrollRef}
          className="space-y-2.5 max-h-52 overflow-y-auto chat-scroll pr-1"
        >
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`text-sm px-4 py-2.5 max-w-[92%] sm:max-w-[85%] w-fit animate-reveal-up ${msg.role === "user"
                ? "ml-auto bg-gold text-ink shadow-[0_4px_12px_rgba(201,168,76,0.1)] rounded-2xl rounded-br-sm"
                : "bg-ink-raised text-parchment border border-parchment-faint/15 rounded-2xl rounded-bl-sm"
                }`}
              style={{ animationDelay: `${i * 24}ms` }}
            >
              {msg.text}
            </div>
          ))}
          {isLoading && (
            <div className="bg-ink-raised text-parchment-muted border border-parchment-faint/15 rounded-2xl rounded-bl-sm px-4 py-2.5 w-fit text-sm">
              <span className="inline-flex gap-1">
                <span className="w-1.5 h-1.5 bg-gold/40 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-1.5 h-1.5 bg-gold/40 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-1.5 h-1.5 bg-gold/40 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </span>
            </div>
          )}
        </div>
      )}

      {/* Element filter pills */}
      <div className="space-y-1.5">
        <p className="text-[10px] uppercase tracking-[0.15em] text-parchment-muted font-medium">
          Focus on
        </p>
        <p className="text-[11px] text-parchment-muted/60 mb-1 font-light">
          Limit your edit to a specific part. &quot;All&quot; lets AI change anything. Resets after each message.
        </p>
        <div className="flex gap-1.5 flex-wrap">
          {ELEMENT_FILTERS.map((f) => (
            <button
              key={f.label}
              type="button"
              onClick={() => setActiveFilter(f.key)}
              disabled={isLoading}
              className={`px-3 py-1.5 text-[11px] rounded-full border transition-all duration-200 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-gold/40 ${activeFilter === f.key
                ? "bg-gold border-gold text-ink"
                : "border-parchment-faint/20 text-parchment-muted hover:border-parchment-faint/35 hover:text-parchment"
                }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="flex gap-3 items-stretch sm:items-end">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Describe a change..."
          disabled={isLoading}
          className="flex-1 bg-ink border-b border-parchment-faint/25 focus:border-gold px-1 py-3 text-sm text-parchment placeholder:text-parchment-muted/50 focus:outline-none transition-colors disabled:opacity-40"
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="group relative min-w-11 min-h-11 p-2.5 bg-gold text-ink hover:bg-gold-soft disabled:bg-parchment-faint/20 disabled:text-parchment-faint/50 transition-colors cursor-pointer disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-gold/40"
        >
          <svg
            className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
            />
          </svg>
        </button>
      </form>
    </div>
  );
}
