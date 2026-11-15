
 // Path: frontend/app/components/LiveProgress.tsx

"use client";

import {
  Check,
  Circle,
  Loader2,
  Search,
  FileSearch,
  BrainCircuit,
  ShieldCheck,
  ScanSearch,
} from "lucide-react";

export type InvestigationStage =
  | "idle"
  | "extracting"
  | "extracted"
  | "searching"
  | "search_complete"
  | "ranking"
  | "evaluating"
  | "reporting"
  | "complete"
  | "error";

type LiveProgressProps = {
  stage: InvestigationStage;
  evidenceFound?: number;
  claimsFound?: number;
  error?: string;
};

const stages = [
  {
    id: "extracting",
    label: "Claim extraction",
    description: "Breaking the response into verifiable claims",
    icon: ScanSearch,
  },
  {
    id: "searching",
    label: "Evidence discovery",
    description: "Searching for relevant supporting sources",
    icon: Search,
  },
  {
    id: "ranking",
    label: "Source intelligence",
    description: "Assessing source credibility and relevance",
    icon: ShieldCheck,
  },
  {
    id: "evaluating",
    label: "AI consistency analysis",
    description: "Evaluating evidence against individual claims",
    icon: BrainCircuit,
  },
  {
    id: "reporting",
    label: "Report generation",
    description: "Preparing claim-level findings and evidence",
    icon: FileSearch,
  },
];

const stageOrder: InvestigationStage[] = [
  "idle",
  "extracting",
  "extracted",
  "searching",
  "search_complete",
  "ranking",
  "evaluating",
  "reporting",
  "complete",
];

function getStageIndex(stage: InvestigationStage) {
  if (stage === "extracted") return 0;
  if (stage === "search_complete") return 1;
  return stageOrder.indexOf(stage);
}

export default function LiveProgress({
  stage,
  evidenceFound = 0,
  claimsFound = 0,
  error,
}: LiveProgressProps) {
  const currentIndex = getStageIndex(stage);
  const isComplete = stage === "complete";
  const isError = stage === "error";

  return (
    <section className="w-full rounded-[28px] border border-white/10 bg-[#080d58]/80 p-5 shadow-[0_20px_60px_rgba(0,0,80,.25)] backdrop-blur-2xl sm:p-7">
      {/* Header */}
      <div className="mb-7 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-[10px] font-black tracking-[3px] text-cyan-300">
            INVESTIGATION SEQUENCE
          </p>
          <h3 className="mt-2 text-xl font-bold text-white">
            {isComplete
              ? "Investigation complete"
              : isError
                ? "Investigation interrupted"
                : stage === "idle"
                  ? "System standing by"
                  : "Analyzing your content"}
          </h3>
        </div>

        <span
          className={`rounded-full border px-3 py-1.5 text-[9px] font-black tracking-[2px] ${
            isComplete
              ? "border-cyan-300/30 bg-cyan-300/10 text-cyan-200"
              : isError
                ? "border-pink-300/30 bg-pink-400/10 text-pink-200"
                : "border-pink-300/30 bg-pink-400/10 text-pink-200"
          }`}
        >
          {isComplete ? "COMPLETED" : isError ? "ERROR" : stage === "idle" ? "READY" : "LIVE"}
        </span>
      </div>

      {/* Progress line */}
      <div className="mb-7 h-1.5 overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-blue-400 to-pink-400 transition-all duration-700"
          style={{
            width: isComplete
              ? "100%"
              : isError
                ? `${Math.max(0, (currentIndex / stages.length) * 100)}%`
                : stage === "idle"
                  ? "0%"
                  : `${Math.min(95, ((currentIndex + 1) / stages.length) * 100)}%`,
          }}
        />
      </div>

      {/* Stage list */}
      <div className="space-y-5">
        {stages.map((item, index) => {
          const Icon = item.icon;
          const done = isComplete || (currentIndex > index);
          const active =
            !isComplete && !isError && currentIndex === index && stage !== "idle";

          return (
            <div key={item.id} className="flex items-start gap-4">
              <div
                className={`relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border transition-all duration-300 ${
                  done
                    ? "border-cyan-300/40 bg-cyan-300/15 text-cyan-200"
                    : active
                      ? "border-pink-300/50 bg-pink-400/15 text-pink-200 shadow-[0_0_22px_rgba(255,92,168,.16)]"
                      : "border-white/10 bg-white/[0.04] text-white/30"
                }`}
              >
                {done ? (
                  <Check size={18} />
                ) : active ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <Icon size={17} />
                )}
              </div>

              <div className="min-w-0 flex-1 pt-0.5">
                <div className="flex flex-wrap items-center gap-2">
                  <p
                    className={`text-sm font-bold ${
                      done
                        ? "text-cyan-100"
                        : active
                          ? "text-white"
                          : "text-white/45"
                    }`}
                  >
                    {item.label}
                  </p>

                  {active && (
                    <span className="text-[8px] font-black tracking-[2px] text-pink-300">
                      IN PROGRESS
                    </span>
                  )}
                  {done && (
                    <span className="text-[8px] font-black tracking-[2px] text-cyan-300">
                      DONE
                    </span>
                  )}
                </div>

                <p className="mt-1 text-xs leading-relaxed text-white/40">
                  {item.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Investigation counters */}
      <div className="mt-7 grid grid-cols-2 gap-3 border-t border-white/10 pt-5">
        <div className="rounded-2xl bg-white/[0.04] p-4">
          <p className="text-[9px] font-bold tracking-[2px] text-white/40">
            CLAIMS EXTRACTED
          </p>
          <p className="mt-2 text-2xl font-black text-white">
            {claimsFound}
          </p>
        </div>

        <div className="rounded-2xl bg-white/[0.04] p-4">
          <p className="text-[9px] font-bold tracking-[2px] text-white/40">
            EVIDENCE SOURCES
          </p>
          <p className="mt-2 text-2xl font-black text-cyan-300">
            {evidenceFound}
          </p>
        </div>
      </div>

      {isError && (
        <div className="mt-5 rounded-xl border border-pink-300/20 bg-pink-400/10 p-4 text-sm text-pink-100">
          {error || "Something interrupted the investigation. Please try again."}
        </div>
      )}
    </section>
  );
}
