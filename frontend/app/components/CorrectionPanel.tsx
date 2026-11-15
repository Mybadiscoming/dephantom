
 // Path: frontend/app/components/CorrectionPanel.tsx

"use client";

import { useState } from "react";
import {
  Lightbulb,
  Copy,
  Check,
  FileText,
  ExternalLink,
  Info,
  Sparkles,
} from "lucide-react";

export type CorrectionEvidence = {
  title: string;
  url: string;
  snippet?: string;
};

type CorrectionPanelProps = {
  originalClaim: string;
  suggestedCorrection?: string | null;
  explanation?: string;
  evidence?: CorrectionEvidence[];
};

export default function CorrectionPanel({
  originalClaim,
  suggestedCorrection,
  explanation,
  evidence = [],
}: CorrectionPanelProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!suggestedCorrection) return;

    try {
      await navigator.clipboard.writeText(suggestedCorrection);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  if (!suggestedCorrection) {
    return (
      <section className="rounded-[24px] border border-white/10 bg-[#080d58]/70 p-5 sm:p-6">
        <div className="flex items-center gap-3">
          <div className="rounded-xl border border-cyan-300/20 bg-cyan-300/10 p-3 text-cyan-200">
            <Lightbulb size={22} />
          </div>

          <div>
            <h3 className="font-bold text-white">
              No correction suggestion available
            </h3>
            <p className="mt-1 text-xs text-white/45">
              The current evidence does not provide enough material for a
              suggested revision.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-5 rounded-[26px] border border-pink-300/20 bg-gradient-to-br from-[#251052]/80 to-[#080d58]/90 p-5 shadow-[0_20px_60px_rgba(0,0,70,.2)] sm:p-7">
      {/* Heading */}
      <div className="flex items-start gap-4">
        <div className="rounded-2xl border border-pink-300/20 bg-pink-400/10 p-3 text-pink-200">
          <Lightbulb size={25} />
        </div>

        <div>
          <p className="text-[9px] font-black tracking-[2.5px] text-pink-300">
            EVIDENCE-BASED SUGGESTION
          </p>

          <h3 className="mt-1 text-xl font-black text-white sm:text-2xl">
            Improve this claim<span className="text-pink-400">.</span>
          </h3>

          <p className="mt-1 text-xs leading-relaxed text-white/45">
            Review the retrieved evidence before using this suggested revision.
          </p>
        </div>
      </div>

      {/* Original claim */}
      <div className="rounded-2xl border border-white/10 bg-black/10 p-4">
        <p className="mb-2 text-[9px] font-black tracking-[2px] text-white/40">
          ORIGINAL CLAIM
        </p>

        <p className="text-sm leading-relaxed text-white/65">
          {originalClaim}
        </p>
      </div>

      {/* Suggested correction */}
      <div className="relative overflow-hidden rounded-2xl border border-cyan-300/25 bg-cyan-300/[0.07] p-4 sm:p-5">
        <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-cyan-300/10 blur-[50px]" />

        <div className="relative">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
            <p className="flex items-center gap-2 text-[9px] font-black tracking-[2px] text-cyan-200">
              <Sparkles size={13} />
              SUGGESTED REVISION
            </p>

            <button
              type="button"
              onClick={handleCopy}
              className="flex items-center gap-2 rounded-lg border border-cyan-300/20 bg-cyan-300/10 px-3 py-2 text-[10px] font-bold text-cyan-100 transition hover:bg-cyan-300/20"
            >
              {copied ? <Check size={13} /> : <Copy size={13} />}
              {copied ? "COPIED" : "COPY"}
            </button>
          </div>

          <p className="text-sm font-medium leading-relaxed text-white sm:text-base">
            {suggestedCorrection}
          </p>
        </div>
      </div>

      {/* Explanation */}
      {explanation && (
        <div>
          <p className="mb-2 text-[9px] font-black tracking-[2px] text-white/45">
            WHY THIS SUGGESTION?
          </p>

          <p className="text-xs leading-relaxed text-white/60">
            {explanation}
          </p>
        </div>
      )}

      {/* Supporting evidence */}
      {evidence.length > 0 && (
        <div>
          <div className="mb-3 flex items-center gap-2">
            <FileText size={15} className="text-cyan-300" />
            <p className="text-[9px] font-black tracking-[2px] text-white/50">
              REFERENCE EVIDENCE
            </p>
          </div>

          <div className="space-y-2">
            {evidence.map((source, index) => (
              <div
                key={`${source.url}-${index}`}
                className="rounded-xl border border-white/10 bg-black/10 p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <p className="text-xs font-bold leading-relaxed text-white/80">
                    {source.title}
                  </p>

                  {source.url && (
                    <a
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="shrink-0 text-cyan-300 transition hover:text-cyan-100"
                      aria-label={`Open ${source.title}`}
                    >
                      <ExternalLink size={14} />
                    </a>
                  )}
                </div>

                {source.snippet && (
                  <p className="mt-2 text-[11px] leading-relaxed text-white/45">
                    {source.snippet}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Disclaimer */}
      <div className="flex items-start gap-2 border-t border-white/10 pt-4">
        <Info size={14} className="mt-0.5 shrink-0 text-pink-300" />

        <p className="text-[10px] leading-relaxed text-white/40">
          This suggestion is based on retrieved evidence and may be an
          extractive summary. It is not an independently verified replacement
          for the original claim. Check the cited sources before relying on it.
        </p>
      </div>
    </section>
  );
}
