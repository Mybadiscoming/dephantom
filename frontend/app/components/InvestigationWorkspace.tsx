
"use client";

// Path: frontend/app/components/InvestigationWorkspace.tsx

import { useState } from "react";
import {
  ArrowUpRight,
  ClipboardPaste,
  FileText,
  Loader2,
  ScanSearch,
  Sparkles,
  X,
} from "lucide-react";

type InvestigationWorkspaceProps = {
  onInvestigate: (text: string) => void | Promise<void>;
  loading?: boolean;
  error?: string | null;
};

const MAX_CHARACTERS = 10000;

export default function InvestigationWorkspace({
  onInvestigate,
  loading = false,
  error = null,
}: InvestigationWorkspaceProps) {
  const [text, setText] = useState("");

  const canInvestigate =
    text.trim().length > 0 &&
    text.length <= MAX_CHARACTERS &&
    !loading;

  const handlePaste = async () => {
    try {
      const clipboardText = await navigator.clipboard.readText();
      if (clipboardText) {
        setText((current) =>
          (current + clipboardText).slice(0, MAX_CHARACTERS)
        );
      }
    } catch {
      // Clipboard access may be blocked by browser permissions.
    }
  };

  const handleSubmit = async () => {
    if (!canInvestigate) return;
    await onInvestigate(text.trim());
  };

  const handleClear = () => {
    setText("");
  };

  return (
    <section className="relative overflow-hidden rounded-[30px] border border-cyan-200/20 bg-[#080d58]/85 p-5 shadow-[0_25px_80px_rgba(0,0,80,.3)] backdrop-blur-2xl sm:p-8">
      {/* Ambient background */}
      <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-cyan-400/10 blur-[90px]" />
      <div className="pointer-events-none absolute -bottom-20 -left-20 h-56 w-56 rounded-full bg-pink-500/10 blur-[90px]" />

      <div className="relative">
        {/* Heading */}
        <div className="mb-7 flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="mb-3 flex items-center gap-2">
              <span className="h-2 w-2 animate-pulse rounded-full bg-cyan-300 shadow-[0_0_12px_rgba(0,217,255,.8)]" />
              <p className="text-[9px] font-black tracking-[3px] text-cyan-200">
                DEPHANTOM ANALYSIS ENGINE
              </p>
            </div>

            <h2 className="text-2xl font-black tracking-tight text-white sm:text-3xl">
              What should we
              <span className="text-cyan-300"> investigate?</span>
            </h2>

            <p className="mt-2 max-w-xl text-sm leading-relaxed text-white/45">
              Paste an AI-generated response. DePhantom will extract claims,
              retrieve evidence and evaluate their consistency.
            </p>
          </div>

          <div className="hidden h-12 w-12 items-center justify-center rounded-2xl border border-pink-300/20 bg-pink-400/10 text-pink-200 sm:flex">
            <ScanSearch size={24} />
          </div>
        </div>

        {/* Input area */}
        <div className="overflow-hidden rounded-2xl border border-white/15 bg-[#050941]/75 transition focus-within:border-cyan-300/50 focus-within:shadow-[0_0_30px_rgba(0,217,255,.08)]">
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
            <div className="flex items-center gap-2">
              <FileText size={14} className="text-cyan-300" />
              <span className="text-[9px] font-black tracking-[2px] text-white/50">
                AI-GENERATED CONTENT
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handlePaste}
                disabled={loading}
                className="flex items-center gap-1.5 text-[10px] font-bold text-cyan-200 transition hover:text-white disabled:opacity-40"
              >
                <ClipboardPaste size={13} />
                Paste
              </button>

              <button
                type="button"
                onClick={handleClear}
                disabled={loading || !text}
                className="flex items-center gap-1 text-[10px] font-bold text-white/40 transition hover:text-pink-300 disabled:opacity-30"
              >
                <X size={13} />
                Clear
              </button>
            </div>
          </div>

          <textarea
            value={text}
            onChange={(event) =>
              setText(event.target.value.slice(0, MAX_CHARACTERS))
            }
            disabled={loading}
            placeholder={`Paste your AI-generated response here...

For example:
"The Sun revolves around the Earth. The Earth is the third planet from the Sun."

DePhantom will break this response into individual claims and investigate the available evidence.`}
            rows={9}
            className="min-h-[220px] w-full resize-y bg-transparent px-5 py-5 text-sm leading-7 text-white outline-none placeholder:text-white/25 disabled:cursor-not-allowed disabled:opacity-60"
          />

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 px-4 py-3">
            <p className="text-[10px] text-white/35">
              {text.length.toLocaleString()} / {MAX_CHARACTERS.toLocaleString()} characters
            </p>

            <span className="text-[9px] font-bold tracking-[1.5px] text-white/30">
              YOUR CONTENT IS ANALYZED CLAIM BY CLAIM
            </span>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div
            role="alert"
            className="mt-4 rounded-xl border border-pink-300/25 bg-pink-400/10 px-4 py-3 text-xs leading-relaxed text-pink-100"
          >
            {error}
          </div>
        )}

        {/* Submit */}
        <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-sm text-[10px] leading-relaxed text-white/35">
            Results depend on retrieved sources and model evaluations.
            DePhantom does not guarantee factual truth.
          </p>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={!canInvestigate}
            className="group flex items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-cyan-300 to-[#8aeaff] px-7 py-4 text-xs font-black tracking-[1px] text-[#1016a8] shadow-[0_8px_30px_rgba(0,217,255,.2)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(0,217,255,.35)] disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {loading ? (
              <>
                <Loader2 size={17} className="animate-spin" />
                INVESTIGATION RUNNING
              </>
            ) : (
              <>
                <Sparkles size={17} />
                INVESTIGATE CONTENT
                <ArrowUpRight
                  size={16}
                  className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
                />
              </>
            )}
          </button>
        </div>
      </div>
    </section>
  );
}
