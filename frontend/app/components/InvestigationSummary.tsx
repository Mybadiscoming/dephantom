
 // Path: frontend/app/components/InvestigationSummary.tsx

import {
  ShieldCheck,
  ShieldAlert,
  CircleHelp,
  FileSearch,
  Layers3,
  ExternalLink,
} from "lucide-react";

export type OverallVerdict =
  | "supported"
  | "contradicted"
  | "unverified";

type InvestigationSummaryProps = {
  verdict: OverallVerdict;
  totalClaims: number;
  supportedClaims: number;
  contradictedClaims: number;
  unverifiedClaims: number;
  totalEvidence: number;
};

const verdictConfig = {
  supported: {
    label: "Mostly supported",
    description: "The available evidence generally supports the analyzed claims.",
    icon: ShieldCheck,
    color: "text-cyan-300",
    border: "border-cyan-300/30",
    background: "bg-cyan-300/10",
  },
  contradicted: {
    label: "Contradictory evidence found",
    description: "Credible evidence conflicts with one or more analyzed claims.",
    icon: ShieldAlert,
    color: "text-pink-300",
    border: "border-pink-300/30",
    background: "bg-pink-400/10",
  },
  unverified: {
    label: "Inconclusive",
    description: "The available evidence is insufficient to establish support or contradiction.",
    icon: CircleHelp,
    color: "text-amber-300",
    border: "border-amber-300/30",
    background: "bg-amber-300/10",
  },
};

export default function InvestigationSummary({
  verdict,
  totalClaims,
  supportedClaims,
  contradictedClaims,
  unverifiedClaims,
  totalEvidence,
}: InvestigationSummaryProps) {
  const config = verdictConfig[verdict];
  const VerdictIcon = config.icon;

  const stats = [
    {
      label: "TOTAL CLAIMS",
      value: totalClaims,
      icon: Layers3,
    },
    {
      label: "SUPPORTED",
      value: supportedClaims,
      icon: ShieldCheck,
    },
    {
      label: "CONTRADICTED",
      value: contradictedClaims,
      icon: ShieldAlert,
    },
    {
      label: "UNVERIFIED",
      value: unverifiedClaims,
      icon: CircleHelp,
    },
  ];

  return (
    <section className="space-y-5">
      {/* Section heading */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[10px] font-black tracking-[3px] text-cyan-300">
            INVESTIGATION REPORT
          </p>
          <h2 className="mt-2 text-2xl font-black tracking-tight text-white sm:text-3xl">
            Evidence overview<span className="text-pink-400">.</span>
          </h2>
        </div>

        <div className="flex items-center gap-2 text-xs text-white/40">
          <FileSearch size={15} />
          Claim-level analysis
        </div>
      </div>

      {/* Verdict spotlight */}
      <div
        className={`relative overflow-hidden rounded-[28px] border ${config.border} ${config.background} p-6 sm:p-8`}
      >
        <div className="pointer-events-none absolute -right-10 -top-16 h-48 w-48 rounded-full bg-cyan-300/10 blur-[70px]" />

        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <div className={`rounded-2xl border ${config.border} bg-black/10 p-3 ${config.color}`}>
              <VerdictIcon size={30} />
            </div>

            <div>
              <p className="text-[9px] font-black tracking-[3px] text-white/50">
                OVERALL ASSESSMENT
              </p>
              <h3 className={`mt-2 text-xl font-black sm:text-2xl ${config.color}`}>
                {config.label}
              </h3>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-white/65">
                {config.description}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-[#080d58]/40 px-4 py-3">
            <FileSearch className="text-cyan-300" size={20} />
            <div>
              <p className="text-[9px] font-bold tracking-[2px] text-white/40">
                EVIDENCE SOURCES
              </p>
              <p className="text-2xl font-black text-white">
                {totalEvidence}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Claim statistics */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.label}
              className="rounded-2xl border border-white/10 bg-[#080d58]/70 p-4 backdrop-blur-xl transition-colors hover:border-cyan-300/30 sm:p-5"
            >
              <div className="flex items-center justify-between gap-2">
                <p className="text-[9px] font-black tracking-[1.5px] text-white/40">
                  {stat.label}
                </p>
                <Icon size={16} className="text-cyan-300/70" />
              </div>

              <p className="mt-3 text-3xl font-black tracking-tight text-white">
                {stat.value}
              </p>
            </div>
          );
        })}
      </div>

      <p className="flex items-start gap-2 px-1 text-[11px] leading-relaxed text-white/40">
        <ExternalLink size={13} className="mt-0.5 shrink-0" />
        These findings describe evidence consistency, not a guarantee of factual truth.
        Review the individual claims and sources before drawing conclusions.
      </p>
    </section>
  );
}
