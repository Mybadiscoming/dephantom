
 // Path: frontend/app/components/SourceIntelligence.tsx

import {
  Globe2,
  ExternalLink,
  ShieldCheck,
  Search,
  Award,
  Info,
} from "lucide-react";

export type IntelligenceSource = {
  title: string;
  url: string;
  snippet?: string;
  publisher?: string;
  credibility?: number;
  relevance?: number;
};

type SourceIntelligenceProps = {
  sources: IntelligenceSource[];
};

function formatScore(score?: number) {
  if (score === undefined || score === null) return "N/A";
  return `${(score * 100).toFixed(0)}%`;
}

function getCredibilityLabel(score?: number) {
  if (score === undefined || score === null) return "Not rated";
  if (score >= 0.8) return "High credibility";
  if (score >= 0.6) return "Moderate credibility";
  return "Lower credibility";
}

export default function SourceIntelligence({
  sources,
}: SourceIntelligenceProps) {
  const rankedSources = [...sources].sort(
    (a, b) => (b.credibility ?? -1) - (a.credibility ?? -1)
  );

  return (
    <section className="space-y-5">
      {/* Heading */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[10px] font-black tracking-[3px] text-cyan-300">
            SOURCE ANALYSIS
          </p>
          <h2 className="mt-2 text-2xl font-black text-white">
            Source intelligence<span className="text-pink-400">.</span>
          </h2>
          <p className="mt-2 text-sm text-white/45">
            A breakdown of retrieved sources and their heuristic assessments.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-xl border border-cyan-300/20 bg-cyan-300/10 px-3 py-2">
          <Globe2 size={16} className="text-cyan-300" />
          <span className="text-xs font-bold text-cyan-100">
            {sources.length} sources
          </span>
        </div>
      </div>

      {/* Empty state */}
      {rankedSources.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-[#080d58]/70 p-8 text-center">
          <Search size={28} className="mx-auto text-white/30" />
          <p className="mt-3 font-semibold text-white">
            No sources available
          </p>
          <p className="mt-1 text-xs text-white/40">
            No evidence sources were returned for this investigation.
          </p>
        </div>
      ) : (
        <div className="grid gap-3">
          {rankedSources.map((source, index) => {
            const credibilityLabel = getCredibilityLabel(source.credibility);

            return (
              <article
                key={`${source.url}-${index}`}
                className="rounded-2xl border border-white/10 bg-[#080d58]/75 p-5 transition-all hover:border-cyan-300/30"
              >
                <div className="flex items-start gap-4">
                  {/* Source number */}
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-cyan-300/20 bg-cyan-300/10 text-xs font-black text-cyan-200">
                    {String(index + 1).padStart(2, "0")}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <h3 className="text-sm font-bold leading-relaxed text-white">
                          {source.title || "Untitled source"}
                        </h3>

                        {source.publisher && (
                          <p className="mt-1 text-xs text-cyan-200/60">
                            {source.publisher}
                          </p>
                        )}
                      </div>

                      {source.url && (
                        <a
                          href={source.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex shrink-0 items-center gap-1 text-[10px] font-bold text-pink-300 hover:text-pink-200"
                        >
                          VISIT
                          <ExternalLink size={12} />
                        </a>
                      )}
                    </div>

                    {source.snippet && (
                      <p className="mt-3 text-xs leading-relaxed text-white/50">
                        {source.snippet}
                      </p>
                    )}

                    {/* Assessment metrics */}
                    <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <div className="rounded-xl border border-white/5 bg-white/[0.035] p-3">
                        <div className="mb-2 flex items-center justify-between gap-2">
                          <span className="flex items-center gap-1.5 text-[9px] font-bold tracking-[1.5px] text-white/45">
                            <ShieldCheck size={12} />
                            CREDIBILITY
                          </span>
                          <span className="text-xs font-black text-cyan-200">
                            {formatScore(source.credibility)}
                          </span>
                        </div>

                        {source.credibility !== undefined && (
                          <div className="h-1 overflow-hidden rounded-full bg-white/10">
                            <div
                              className="h-full rounded-full bg-cyan-400"
                              style={{
                                width: `${Math.max(
                                  0,
                                  Math.min(100, source.credibility * 100)
                                )}%`,
                              }}
                            />
                          </div>
                        )}

                        <p className="mt-2 text-[9px] text-white/40">
                          {credibilityLabel}
                        </p>
                      </div>

                      <div className="rounded-xl border border-white/5 bg-white/[0.035] p-3">
                        <div className="mb-2 flex items-center justify-between gap-2">
                          <span className="flex items-center gap-1.5 text-[9px] font-bold tracking-[1.5px] text-white/45">
                            <Search size={12} />
                            RELEVANCE
                          </span>
                          <span className="text-xs font-black text-pink-200">
                            {formatScore(source.relevance)}
                          </span>
                        </div>

                        {source.relevance !== undefined && (
                          <div className="h-1 overflow-hidden rounded-full bg-white/10">
                            <div
                              className="h-full rounded-full bg-pink-400"
                              style={{
                                width: `${Math.max(
                                  0,
                                  Math.min(100, source.relevance * 100)
                                )}%`,
                              }}
                            />
                          </div>
                        )}

                        <p className="mt-2 text-[9px] text-white/40">
                          Match with the analyzed claim
                        </p>
                      </div>
                    </div>

                    {source.credibility !== undefined &&
                      source.credibility >= 0.8 && (
                        <div className="mt-3 flex items-center gap-2 text-[10px] text-cyan-200/70">
                          <Award size={13} />
                          Higher heuristic credibility rating
                        </div>
                      )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Methodology note */}
      <div className="flex items-start gap-2 rounded-xl border border-white/10 bg-white/[0.03] p-4">
        <Info size={15} className="mt-0.5 shrink-0 text-cyan-300" />
        <p className="text-[10px] leading-relaxed text-white/45">
          Credibility is estimated using a domain-based heuristic, while
          relevance measures the match between a source and a claim. Neither
          score independently establishes whether an article or claim is true.
        </p>
      </div>
    </section>
  );
}
