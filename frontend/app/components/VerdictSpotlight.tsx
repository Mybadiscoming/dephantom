
 // Path: frontend/app/components/VerdictSpotlight.tsx

import {
  ShieldCheck,
  ShieldAlert,
  CircleHelp,
  ArrowRight,
  Sparkles,
} from "lucide-react";

export type VerdictType =
  | "supported"
  | "contradicted"
  | "unverified";

type VerdictSpotlightProps = {
  verdict: VerdictType;
  title?: string;
  description?: string;
  consistencyScore?: number | null;
  supportPercentage?: number | null;
  compact?: boolean;
};

const verdictConfig = {
  supported: {
    label: "Evidence supports this claim",
    shortLabel: "SUPPORTED",
    description:
      "The retrieved evidence shows consistency with the claim.",
    icon: ShieldCheck,
    accent: "text-cyan-300",
    border: "border-cyan-300/30",
    background: "bg-cyan-300/10",
    glow: "bg-cyan-400/10",
  },
  contradicted: {
    label: "Conflicting evidence detected",
    shortLabel: "CONTRADICTED",
    description:
      "The retrieved evidence contains information that conflicts with the claim.",
    icon: ShieldAlert,
    accent: "text-pink-300",
    border: "border-pink-300/30",
    background: "bg-pink-400/10",
    glow: "bg-pink-400/10",
  },
  unverified: {
    label: "Evidence remains inconclusive",
    shortLabel: "UNVERIFIED",
    description:
      "There is not enough relevant evidence to establish support or contradiction.",
    icon: CircleHelp,
    accent: "text-amber-300",
    border: "border-amber-300/30",
    background: "bg-amber-300/10",
    glow: "bg-amber-300/10",
  },
};

export default function VerdictSpotlight({
  verdict,
  title,
  description,
  consistencyScore,
  supportPercentage,
  compact = false,
}: VerdictSpotlightProps) {
  const config = verdictConfig[verdict];
  const Icon = config.icon;

  return (
    <section
      className={`relative overflow-hidden rounded-[28px] border ${config.border} ${config.background} ${
        compact ? "p-5" : "p-6 sm:p-8"
      }`}
    >
      {/* Decorative glow */}
      <div
        className={`pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full ${config.glow} blur-[80px]`}
      />

      <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-4">
          <div
            className={`flex shrink-0 items-center justify-center rounded-2xl border ${config.border} bg-black/10 ${
              compact ? "h-12 w-12" : "h-16 w-16"
            } ${config.accent}`}
          >
            <Icon size={compact ? 23 : 30} />
          </div>

          <div className="min-w-0">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <span
                className={`text-[9px] font-black tracking-[2.5px] ${config.accent}`}
              >
                {config.shortLabel}
              </span>
              <Sparkles size={12} className="text-white/35" />
            </div>

            <h3
              className={`font-black tracking-tight text-white ${
                compact ? "text-lg" : "text-2xl sm:text-3xl"
              }`}
            >
              {title || config.label}
            </h3>

            <p className="mt-2 max-w-xl text-sm leading-relaxed text-white/60">
              {description || config.description}
            </p>
          </div>
        </div>

        {!compact && (
          <div className="flex shrink-0 flex-col gap-3 sm:items-end">
            {consistencyScore !== undefined &&
              consistencyScore !== null && (
                <div className="rounded-2xl border border-white/10 bg-black/10 px-4 py-3">
                  <p className="text-[9px] font-bold tracking-[2px] text-white/45">
                    EVIDENCE CONSISTENCY
                  </p>
                  <p className="mt-1 text-2xl font-black text-white">
                    {(consistencyScore * 100).toFixed(1)}%
                  </p>
                </div>
              )}

            {supportPercentage !== undefined &&
              supportPercentage !== null && (
                <div className="rounded-2xl border border-white/10 bg-black/10 px-4 py-3">
                  <p className="text-[9px] font-bold tracking-[2px] text-white/45">
                    EVIDENCE SUPPORT SHARE
                  </p>
                  <p className="mt-1 text-xl font-black text-white">
                    {supportPercentage.toFixed(1)}%
                  </p>
                </div>
              )}
          </div>
        )}
      </div>

      <div className="relative mt-5 flex items-start gap-2 border-t border-white/10 pt-4 text-[10px] leading-relaxed text-white/40">
        <ArrowRight size={13} className="mt-0.5 shrink-0" />
        Scores describe model-evaluated evidence consistency and source support,
        not the probability that a claim is true.
      </div>
    </section>
  );
}
