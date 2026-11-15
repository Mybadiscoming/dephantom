
 // Path: frontend/app/components/ClaimCard.tsx

import {
  ShieldCheck,
  ShieldAlert,
  CircleHelp,
  ChevronDown,
  ExternalLink,
  FileText,
} from "lucide-react";
import { useState } from "react";

export type ClaimVerdict =
  | "supported"
  | "contradicted"
  | "unverified";

export type ClaimEvidence = {
  title: string;
  url: string;
  snippet: string;
  publisher?: string;
  credibility?: number;
  hhemScore?: number | null;
  nliStatus?: string;
};

export type ClaimCardData = {
  claim: string;
  verdict: ClaimVerdict;
  evidence: ClaimEvidence[];
  explanation?: string;
  consistencyScore?: number | null;
};

type ClaimCardProps = {
  claim: ClaimCardData;
  index: number;
};

const verdictStyles = {
  supported: {
    label: "SUPPORTED",
    icon: ShieldCheck,
    color: "text-cyan-300",
    border: "border-cyan-300/30",
    background: "bg-cyan-300/10",
  },
  contradicted: {
    label: "CONTRADICTED",
    icon: ShieldAlert,
    color: "text-pink-300",
    border: "border-pink-300/30",
    background: "bg-pink-400/10",
  },
  unverified: {
    label: "UNVERIFIED",
    icon: CircleHelp,
    color: "text-amber-300",
    border: "border-amber-300/30",
    background: "bg-amber-300/10",
  },
};

export default function ClaimCard({ claim, index }: ClaimCardProps) {
  const [expanded, setExpanded] = useState(true);

  const config = verdictStyles[claim.verdict];
  const VerdictIcon = config.icon;

  return (
    <article className="overflow-hidden rounded-[26px] border border-white/10 bg-[#080d58]/75 shadow-[0_15px_45px_rgba(0,0,70,.2)] backdrop-blur-xl">
      {/* Claim header */}
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-start gap-4 p-5 text-left transition-colors hover:bg-white/[0.03] sm:p-6"
        aria-expanded={expanded}
      >
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-cyan-300/20 bg-cyan-300/10 text-sm font-black text-cyan-200">
          {String(index + 1).padStart(2, "0")}
        </div>

        <div className="min-w-0 flex-1">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <span
              className={`flex items-center gap-1.5 rounded-full border ${config.border} ${config.background} px-3 py-1 text-[9px] font-black tracking-[1.5px] ${config.color}`}
            >
              <VerdictIcon size={12} />
              {config.label}
            </span>

            <span className="text-[10px] text-white/35">
              {claim.evidence.length} evidence source
              {claim.evidence.length === 1 ? "" : "s"}
            </span>
          </div>

          <p className="text-sm font-semibold leading-relaxed text-white sm:text-base">
            {claim.claim}
          </p>
        </div>

        <ChevronDown
          size={19}
          className={`mt-1 shrink-0 text-white/40 transition-transform ${
            expanded ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Expanded details */}
      {expanded && (
        <div className="space-y-5 border-t border-white/10 px-5 py-5 sm:px-6">
          {claim.explanation && (
            <div>
              <p className="mb-2 text-[9px] font-black tracking-[2px] text-cyan-300">
                ANALYSIS
              </p>
              <p className="text-sm leading-relaxed text-white/65">
                {claim.explanation}
              </p>
            </div>
          )}

          {claim.consistencyScore !== undefined &&
            claim.consistencyScore !== null && (
              <div>
                <div className="mb-2 flex justify-between text-xs">
                  <span className="text-white/45">
                    Evidence consistency score
                  </span>
                  <span className="font-bold text-cyan-200">
                    {(claim.consistencyScore * 100).toFixed(1)}%
                  </span>
                </div>

                <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-blue-500"
                    style={{
                      width: `${Math.max(
                        0,
                        Math.min(100, claim.consistencyScore * 100)
                      )}%`,
                    }}
                  />
                </div>
              </div>
            )}

          {/* Evidence sources */}
          <div>
            <div className="mb-3 flex items-center gap-2">
              <FileText size={15} className="text-pink-300" />
              <p className="text-[9px] font-black tracking-[2px] text-white/55">
                RETRIEVED EVIDENCE
              </p>
            </div>

            {claim.evidence.length === 0 ? (
              <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 text-sm text-white/45">
                No relevant evidence sources were retrieved for this claim.
              </div>
            ) : (
              <div className="space-y-3">
                {claim.evidence.map((source, sourceIndex) => (
                  <div
                    key={`${source.url}-${sourceIndex}`}
                    className="rounded-2xl border border-white/10 bg-[#10176b]/60 p-4"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-bold leading-relaxed text-white">
                          {source.title || "Untitled source"}
                        </p>
                        {source.publisher && (
                          <p className="mt-1 text-[10px] text-cyan-200/60">
                            {source.publisher}
                          </p>
                        )}
                      </div>

                      {source.url && (
                        <a
                          href={source.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(event) => event.stopPropagation()}
                          className="flex shrink-0 items-center gap-1 text-[10px] font-bold text-pink-300 hover:text-pink-200"
                        >
                          OPEN SOURCE
                          <ExternalLink size={12} />
                        </a>
                      )}
                    </div>

                    {source.snippet && (
                      <p className="mt-3 text-xs leading-relaxed text-white/55">
                        {source.snippet}
                      </p>
                    )}

                    <div className="mt-3 flex flex-wrap gap-2">
                      {source.credibility !== undefined && (
                        <span className="rounded-lg bg-cyan-300/10 px-2.5 py-1 text-[9px] text-cyan-200">
                          Credibility:{" "}
                          {(source.credibility * 100).toFixed(0)}%
                        </span>
                      )}

                      {source.hhemScore !== undefined &&
                        source.hhemScore !== null && (
                          <span className="rounded-lg bg-blue-400/10 px-2.5 py-1 text-[9px] text-blue-200">
                            HHEM: {source.hhemScore.toFixed(2)}
                          </span>
                        )}

                      {source.nliStatus && (
                        <span className="rounded-lg bg-pink-400/10 px-2.5 py-1 text-[9px] text-pink-200">
                          NLI: {source.nliStatus}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </article>
  );
}
