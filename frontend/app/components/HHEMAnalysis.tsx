
 // Path: frontend/app/components/HHEMAnalysis.tsx

import {
  BrainCircuit,
  Activity,
  Info,
  CheckCircle2,
  AlertTriangle,
  CircleHelp,
} from "lucide-react";

export type HHEMResult = {
  evidenceTitle?: string;
  score: number | null;
  status: "supported" | "not_supported" | "inconclusive";
};

type HHEMAnalysisProps = {
  results: HHEMResult[];
};

function getStatusConfig(status: HHEMResult["status"]) {
  switch (status) {
    case "supported":
      return {
        label: "CONSISTENT",
        description: "Evidence is consistent with the claim.",
        icon: CheckCircle2,
        color: "text-cyan-300",
        background: "bg-cyan-300/10",
        border: "border-cyan-300/20",
      };

    case "not_supported":
      return {
        label: "NOT CONSISTENT",
        description: "Evidence does not sufficiently support the claim.",
        icon: AlertTriangle,
        color: "text-pink-300",
        background: "bg-pink-400/10",
        border: "border-pink-300/20",
      };

    default:
      return {
        label: "INCONCLUSIVE",
        description: "The consistency evaluation could not be completed.",
        icon: CircleHelp,
        color: "text-amber-300",
        background: "bg-amber-300/10",
        border: "border-amber-300/20",
      };
  }
}

export default function HHEMAnalysis({
  results,
}: HHEMAnalysisProps) {
  const validScores = results
    .map((result) => result.score)
    .filter((score): score is number => score !== null);

  const averageScore =
    validScores.length > 0
      ? validScores.reduce((total, score) => total + score, 0) /
        validScores.length
      : null;

  return (
    <section className="space-y-5">
      {/* Heading */}
      <div>
        <p className="text-[10px] font-black tracking-[3px] text-cyan-300">
          MODEL EVALUATION
        </p>
        <h2 className="mt-2 text-2xl font-black text-white">
          HHEM analysis<span className="text-pink-400">.</span>
        </h2>
        <p className="mt-2 text-sm text-white/45">
          Evidence-premise and claim-hypothesis consistency evaluation.
        </p>
      </div>

      {/* Model overview */}
      <div className="relative overflow-hidden rounded-[26px] border border-cyan-300/20 bg-gradient-to-br from-[#10247b]/90 to-[#080d58]/90 p-5 sm:p-6">
        <div className="pointer-events-none absolute -right-12 -top-12 h-44 w-44 rounded-full bg-cyan-400/10 blur-[65px]" />

        <div className="relative flex flex-wrap items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <div className="rounded-2xl border border-cyan-300/20 bg-cyan-300/10 p-3 text-cyan-200">
              <BrainCircuit size={27} />
            </div>

            <div>
              <p className="text-[9px] font-black tracking-[2px] text-cyan-200/60">
                PRIMARY VERIFICATION MODEL
              </p>
              <h3 className="mt-1 text-lg font-black text-white">
                Vectara HHEM
              </h3>
              <p className="mt-1 text-xs text-white/40">
                Hallucination Evaluation Model
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/10 px-4 py-3">
            <p className="text-[9px] font-bold tracking-[1.5px] text-white/40">
              AVERAGE CONSISTENCY
            </p>
            <p className="mt-1 text-2xl font-black text-cyan-200">
              {averageScore === null
                ? "N/A"
                : `${(averageScore * 100).toFixed(1)}%`}
            </p>
          </div>
        </div>
      </div>

      {/* Individual evaluations */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-[9px] font-black tracking-[2px] text-white/50">
            EVIDENCE EVALUATIONS
          </p>
          <span className="text-[10px] text-white/35">
            {results.length} checks
          </span>
        </div>

        {results.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-[#080d58]/70 p-6 text-center text-sm text-white/40">
            No HHEM evaluation results are available.
          </div>
        ) : (
          results.map((result, index) => {
            const config = getStatusConfig(result.status);
            const StatusIcon = config.icon;

            return (
              <article
                key={index}
                className="rounded-2xl border border-white/10 bg-[#080d58]/70 p-5"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-[9px] font-black tracking-[1.5px] text-white/35">
                      EVIDENCE CHECK {String(index + 1).padStart(2, "0")}
                    </p>
                    <h4 className="mt-2 text-sm font-bold text-white">
                      {result.evidenceTitle || `Evidence item ${index + 1}`}
                    </h4>
                  </div>

                  <span
                    className={`flex items-center gap-1.5 rounded-full border ${config.border} ${config.background} px-3 py-1.5 text-[9px] font-black tracking-[1px] ${config.color}`}
                  >
                    <StatusIcon size={12} />
                    {config.label}
                  </span>
                </div>

                <div className="mt-5">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-[10px] font-bold tracking-[1px] text-white/40">
                      CONSISTENCY SCORE
                    </span>
                    <span className="text-sm font-black text-cyan-200">
                      {result.score === null
                        ? "N/A"
                        : `${(result.score * 100).toFixed(1)}%`}
                    </span>
                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-white/10">
                    {result.score !== null && (
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-700"
                        style={{
                          width: `${Math.max(
                            0,
                            Math.min(100, result.score * 100)
                          )}%`,
                        }}
                      />
                    )}
                  </div>

                  <p className="mt-2 text-[10px] text-white/40">
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
        <Info size={16} className="mt-0.5 shrink-0 text-cyan-300" />
        <p className="text-[10px] leading-relaxed text-white/45">
          HHEM evaluates consistency between evidence and a claim. A higher
          score does not prove that the claim is factually true, and a lower
          score alone does not prove that it is false.
        </p>
      </div>
    </section>
  );
}
