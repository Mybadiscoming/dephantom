
 // Path: frontend/app/components/NLIAnalysis.tsx

import {
  BrainCircuit,
  CheckCircle2,
  AlertTriangle,
  CircleHelp,
  Info,
  ArrowRight,
} from "lucide-react";

export type NLIStatus = "entailment" | "contradiction" | "neutral";

export type NLIResult = {
  evidenceTitle?: string;
  status: NLIStatus;
  entailmentScore?: number;
  contradictionScore?: number;
  neutralScore?: number;
};

type NLIAnalysisProps = {
  results: NLIResult[];
};

const statusConfig = {
  entailment: {
    label: "ENTAILMENT",
    description: "Evidence supports the meaning of the claim.",
    icon: CheckCircle2,
    color: "text-cyan-300",
    border: "border-cyan-300/20",
    background: "bg-cyan-300/10",
  },
  contradiction: {
    label: "CONTRADICTION",
    description: "Evidence conflicts with the meaning of the claim.",
    icon: AlertTriangle,
    color: "text-pink-300",
    border: "border-pink-300/20",
    background: "bg-pink-400/10",
  },
  neutral: {
    label: "NEUTRAL",
    description: "Evidence neither clearly supports nor contradicts the claim.",
    icon: CircleHelp,
    color: "text-amber-300",
    border: "border-amber-300/20",
    background: "bg-amber-300/10",
  },
};

function ScoreBar({
  label,
  score,
  color,
}: {
  label: string;
  score?: number;
  color: string;
}) {
  if (score === undefined) return null;

  const percentage = Math.max(0, Math.min(100, score * 100));

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-bold text-white/50">
          {label}
        </span>
        <span className="text-xs font-black text-white">
          {percentage.toFixed(1)}%
        </span>
      </div>

      <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
        <div
          className={`h-full rounded-full ${color} transition-all duration-700`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

export default function NLIAnalysis({
  results,
}: NLIAnalysisProps) {
  const counts = {
    entailment: results.filter((r) => r.status === "entailment").length,
    contradiction: results.filter((r) => r.status === "contradiction").length,
    neutral: results.filter((r) => r.status === "neutral").length,
  };

  return (
    <section className="space-y-5">
      {/* Heading */}
      <div>
        <p className="text-[10px] font-black tracking-[3px] text-cyan-300">
          SECONDARY VERIFICATION
        </p>

        <h2 className="mt-2 text-2xl font-black text-white">
          NLI analysis<span className="text-pink-400">.</span>
        </h2>

        <p className="mt-2 text-sm text-white/45">
          Natural Language Inference evaluates the relationship between
          retrieved evidence and the analyzed claim.
        </p>
      </div>

      {/* Model banner */}
      <div className="relative overflow-hidden rounded-[26px] border border-pink-300/20 bg-gradient-to-br from-[#32145f]/80 to-[#080d58]/90 p-5 sm:p-6">
        <div className="pointer-events-none absolute -right-12 -top-12 h-44 w-44 rounded-full bg-pink-400/10 blur-[65px]" />

        <div className="relative flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="rounded-2xl border border-pink-300/20 bg-pink-400/10 p-3 text-pink-200">
              <BrainCircuit size={27} />
            </div>

            <div>
              <p className="text-[9px] font-black tracking-[2px] text-pink-200/60">
                SECONDARY ANALYSIS MODEL
              </p>
              <h3 className="mt-1 text-lg font-black text-white">
                DeBERTa-v3 NLI
              </h3>
              <p className="mt-1 text-xs text-white/40">
                Entailment · Contradiction · Neutral
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-white/10 bg-black/10 px-4 py-3">
            <p className="text-[9px] font-bold tracking-[1.5px] text-white/40">
              TOTAL EVALUATIONS
            </p>
            <p className="mt-1 text-2xl font-black text-white">
              {results.length}
            </p>
          </div>
        </div>
      </div>

      {/* Outcome counters */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        {[
          {
            label: "ENTAILMENT",
            value: counts.entailment,
            color: "text-cyan-300",
          },
          {
            label: "CONTRADICTION",
            value: counts.contradiction,
            color: "text-pink-300",
          },
          {
            label: "NEUTRAL",
            value: counts.neutral,
            color: "text-amber-300",
          },
        ].map((item) => (
          <div
            key={item.label}
            className="rounded-2xl border border-white/10 bg-[#080d58]/70 p-3 sm:p-4"
          >
            <p className="text-[8px] font-black tracking-[1px] text-white/40 sm:text-[9px]">
              {item.label}
            </p>
            <p className={`mt-2 text-2xl font-black ${item.color}`}>
              {item.value}
            </p>
          </div>
        ))}
      </div>

      {/* Individual NLI results */}
      <div className="space-y-3">
        <p className="text-[9px] font-black tracking-[2px] text-white/50">
          EVIDENCE RELATIONSHIP RESULTS
        </p>

        {results.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-[#080d58]/70 p-6 text-center text-sm text-white/40">
            No NLI evaluation results are available.
          </div>
        ) : (
          results.map((result, index) => {
            const config = statusConfig[result.status];
            const Icon = config.icon;

            return (
              <article
                key={index}
                className="rounded-2xl border border-white/10 bg-[#080d58]/75 p-5"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-[9px] font-black tracking-[1.5px] text-white/35">
                      NLI CHECK {String(index + 1).padStart(2, "0")}
                    </p>
                    <h4 className="mt-2 text-sm font-bold text-white">
                      {result.evidenceTitle || `Evidence item ${index + 1}`}
                    </h4>
                  </div>

                  <span
                    className={`flex items-center gap-1.5 rounded-full border ${config.border} ${config.background} px-3 py-1.5 text-[9px] font-black tracking-[1px] ${config.color}`}
                  >
                    <Icon size={12} />
                    {config.label}
                  </span>
                </div>

                <div className="mt-4 space-y-4">
                  <ScoreBar
                    label="ENTAILMENT"
                    score={result.entailmentScore}
                    color="bg-cyan-400"
                  />

                  <ScoreBar
                    label="CONTRADICTION"
                    score={result.contradictionScore}
                    color="bg-pink-400"
                  />

                  <ScoreBar
                    label="NEUTRAL"
                    score={result.neutralScore}
                    color="bg-amber-400"
                  />
                </div>

                <div className="mt-4 flex items-start gap-2 border-t border-white/10 pt-4">
                  <ArrowRight
                    size={13}
                    className={`mt-0.5 shrink-0 ${config.color}`}
                  />
                  <p className="text-[10px] leading-relaxed text-white/45">
                    {config.description}
                  </p>
                </div>
              </article>
            );
          })
        )}
      </div>

      {/* Methodology note */}
      <div className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-4">
        <Info size={16} className="mt-0.5 shrink-0 text-pink-300" />
        <p className="text-[10px] leading-relaxed text-white/45">
          NLI scores represent model confidence in linguistic relationships,
          not probabilities that a claim is true. Results should be interpreted
          alongside source credibility, relevance and HHEM consistency.
        </p>
      </div>
    </section>
  );
}
