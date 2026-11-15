
"use client";

// Path: frontend/app/verify/page.tsx

import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowUpRight,
  Fingerprint,
  Sparkles,
} from "lucide-react";

import Navbar from "../components/Navbar";
import InvestigationWorkspace from "../components/InvestigationWorkspace";
import OrbVisual from "../components/OrbVisual";
import LiveProgress, {
  type InvestigationStage,
} from "../components/LiveProgress";
import InvestigationSummary from "../components/InvestigationSummary";
import ClaimCard, {
  type ClaimCardData,
  type ClaimVerdict,
} from "../components/ClaimCard";
import VerdictSpotlight from "../components/VerdictSpotlight";
import SourceIntelligence, {
  type IntelligenceSource,
} from "../components/SourceIntelligence";
import HHEMAnalysis, {
  type HHEMResult,
} from "../components/HHEMAnalysis";
import NLIAnalysis, {
  type NLIResult,
} from "../components/NLIAnalysis";
import CorrectionPanel from "../components/CorrectionPanel";

type Data = Record<string, unknown>;

type VerificationResponse = {
  total_claims?: number;
  results?: Data[];
};

type Progress = {
  stage: InvestigationStage;
  message: string;
  claimNumber: number;
  totalClaims: number;
  evidenceFound: number;
};

const initialProgress: Progress = {
  stage: "idle",
  message: "",
  claimNumber: 0,
  totalClaims: 0,
  evidenceFound: 0,
};

const examples = [
  {
    name: "Science",
    text: "The Sun revolves around the Earth.",
  },
  {
    name: "Technology",
    text: "Artificial intelligence always provides accurate answers.",
  },
  {
    name: "History",
    text: "The Great Wall of China is visible from the Moon.",
  },
];

const validStages: InvestigationStage[] = [
  "idle",
  "extracting",
  "extracted",
  "searching",
  "search_complete",
  "ranking",
  "evaluating",
  "reporting",
  "complete",
  "error",
];

function object(value: unknown): Data {
  return value !== null &&
    typeof value === "object" &&
    !Array.isArray(value)
    ? (value as Data)
    : {};
}

function textValue(value: unknown, fallback = ""): string {
  if (typeof value === "string" || typeof value === "number") {
    return String(value);
  }

  return fallback;
}

function numericValue(value: unknown): number | undefined {
  return typeof value === "number" && Number.isFinite(value)
    ? value
    : undefined;
}

function normalizeStage(value: unknown): InvestigationStage {
  const stage = textValue(value).toLowerCase();

  return validStages.includes(stage as InvestigationStage)
    ? (stage as InvestigationStage)
    : "extracting";
}

function getRawVerdict(value: unknown): string {
  if (typeof value === "string") return value.toLowerCase();

  const data = object(value);

  return textValue(
    data.verdict ?? data.status,
    "unverified"
  ).toLowerCase();
}

function getClaimVerdict(item: Data): ClaimVerdict {
  const raw = getRawVerdict(item.verdict);

  if (raw.includes("contradict")) return "contradicted";

  if (
    raw.includes("not_supported") ||
    raw.includes("not supported")
  ) {
    return "unverified";
  }

  if (raw.includes("support")) return "supported";

  return "unverified";
}

function getOverallVerdict(
  results: Data[]
): "supported" | "contradicted" | "unverified" {
  const verdicts = results.map(getClaimVerdict);

  if (verdicts.includes("contradicted")) return "contradicted";

  if (
    verdicts.length > 0 &&
    verdicts.every((verdict) => verdict === "supported")
  ) {
    return "supported";
  }

  return "unverified";
}

function getEvidence(item: Data): Data[] {
  return Array.isArray(item.evidence)
    ? item.evidence.map(object)
    : [];
}

function getHHEM(item: Data): Data[] {
  return Array.isArray(item.hhem_results)
    ? item.hhem_results.map(object)
    : [];
}

function getPublisher(url: string): string | undefined {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return undefined;
  }
}

function getHHEMStatus(value: unknown): HHEMResult["status"] {
  const status = textValue(value).toLowerCase();

  if (status.includes("support") && !status.includes("not")) {
    return "supported";
  }

  if (
    status.includes("not_supported") ||
    status.includes("not supported")
  ) {
    return "not_supported";
  }

  return "inconclusive";
}

function getNLIStatus(value: unknown): NLIResult["status"] {
  const status = textValue(value).toLowerCase();

  if (status.includes("contradict")) return "contradiction";
  if (status.includes("entail") || status.includes("support")) {
    return "entailment";
  }

  return "neutral";
}

function getClaimConsistency(item: Data): number | null {
  const scores = getHHEM(item)
    .map((result) => numericValue(result.score))
    .filter((score): score is number => score !== undefined);

  if (scores.length === 0) return null;

  return scores.reduce((sum, score) => sum + score, 0) / scores.length;
}

function mapClaim(item: Data): ClaimCardData {
  const evidence = getEvidence(item);
  const hhem = getHHEM(item);

  return {
    claim: textValue(item.claim, "Claim unavailable"),
    verdict: getClaimVerdict(item),
    explanation: textValue(
      object(item.verdict).reason ??
        object(item.verdict).explanation ??
        item.explanation
    ),
    consistencyScore: getClaimConsistency(item) ?? undefined,
    evidence: evidence.map((source, index) => {
      const url = textValue(source.url);
      const matchingHHEM = hhem[index];

      return {
        title: textValue(source.title, "Untitled source"),
        url,
        snippet: textValue(source.snippet),
        publisher: getPublisher(url),
        credibility: numericValue(source.credibility_score),
        hhemScore: numericValue(matchingHHEM?.score) ?? null,
        nliStatus: textValue(
          object(item.contradiction).status
        ) || undefined,
      };
    }),
  };
}

function mapAllSources(results: Data[]): IntelligenceSource[] {
  const uniqueSources = new Map<string, IntelligenceSource>();

  results.forEach((item) => {
    getEvidence(item).forEach((source) => {
      const url = textValue(source.url);
      if (!url) return;

      if (!uniqueSources.has(url)) {
        uniqueSources.set(url, {
          title: textValue(source.title, "Untitled source"),
          url,
          snippet: textValue(source.snippet),
          publisher: getPublisher(url),
          credibility: numericValue(source.credibility_score),
          relevance: numericValue(source.relevance_score),
        });
      }
    });
  });

  return Array.from(uniqueSources.values());
}

function mapAllHHEM(results: Data[]): HHEMResult[] {
  return results.flatMap((item) =>
    getHHEM(item).map((check) => ({
      evidenceTitle: textValue(check.source, "Evidence source"),
      score: numericValue(check.score) ?? null,
      status: getHHEMStatus(check.status),
    }))
  );
}

function mapAllNLI(results: Data[]): NLIResult[] {
  return results.flatMap((item) => {
    const contradiction = object(item.contradiction);

    if (Object.keys(contradiction).length === 0) return [];

    const scores = object(contradiction.scores);

    const status =
      contradiction.status ??
      contradiction.label ??
      contradiction.classification;

    return [
      {
        evidenceTitle: textValue(
          contradiction.matched_sentence,
          textValue(contradiction.source, "Claim evidence comparison")
        ),
        status: getNLIStatus(status),
        entailmentScore:
          numericValue(
            contradiction.entailment_score ??
              contradiction.entailment ??
              scores.entailment
          ),
        contradictionScore:
          numericValue(
            contradiction.contradiction_score ??
              contradiction.contradiction ??
              scores.contradiction
          ),
        neutralScore:
          numericValue(
            contradiction.neutral_score ??
              contradiction.neutral ??
              scores.neutral
          ),
      },
    ];
  });
}

function getAverageConsistency(results: Data[]): number | null {
  const scores = results
    .map(getClaimConsistency)
    .filter((score): score is number => score !== null);

  if (scores.length === 0) return null;

  return scores.reduce((sum, score) => sum + score, 0) / scores.length;
}

function getAverageSupportPercentage(results: Data[]): number | null {
  const scores = results
    .map((item) =>
      numericValue(object(item.verdict).support_percentage)
    )
    .filter((score): score is number => score !== undefined);

  if (scores.length === 0) return null;

  return scores.reduce((sum, score) => sum + score, 0) / scores.length;
}

export default function VerifyPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [response, setResponse] =
    useState<VerificationResponse | null>(null);

  const [progress, setProgress] =
    useState<Progress>(initialProgress);

  const reportRef = useRef<HTMLElement>(null);

  const results = response?.results ?? [];

  const supportedCount = results.filter(
    (item) => getClaimVerdict(item) === "supported"
  ).length;

  const contradictedCount = results.filter(
    (item) => getClaimVerdict(item) === "contradicted"
  ).length;

  const unverifiedCount = results.filter(
    (item) => getClaimVerdict(item) === "unverified"
  ).length;

  const totalEvidence = results.reduce(
    (sum, item) => sum + getEvidence(item).length,
    0
  );

  const overallVerdict = getOverallVerdict(results);

  const sources = useMemo(
    () => mapAllSources(results),
    [response]
  );

  const hhemResults = useMemo(
    () => mapAllHHEM(results),
    [response]
  );

  const nliResults = useMemo(
    () => mapAllNLI(results),
    [response]
  );

  const averageConsistency = getAverageConsistency(results);
  const averageSupportPercentage =
    getAverageSupportPercentage(results);

  useEffect(() => {
    if (response && reportRef.current) {
      const timer = window.setTimeout(() => {
        reportRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 300);

      return () => window.clearTimeout(timer);
    }
  }, [response]);

  async function handleInvestigate(text: string) {
    if (!text.trim() || loading) return;

    setLoading(true);
    setError("");
    setResponse(null);

    setProgress({
      stage: "extracting",
      message: "Extracting individual claims...",
      claimNumber: 0,
      totalClaims: 0,
      evidenceFound: 0,
    });

    try {
      const apiBase = (
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
      ).replace(/\/+$/, "");

      const result = await fetch(`${apiBase}/verify-stream`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "text/event-stream",
        },
        body: JSON.stringify({ text: text.trim() }),
      });

      if (!result.ok || !result.body) {
        throw new Error(`Backend returned ${result.status}`);
      }

      const reader = result.body.getReader();
      const decoder = new TextDecoder();

      let buffer = "";
      let completed = false;

      function processEvent(event: string) {
        const lines = event.split(/\r?\n/);

        const eventName = lines
          .find((line) => line.startsWith("event:"))
          ?.slice(6)
          .trim();

        const dataLine = lines
          .find((line) => line.startsWith("data:"))
          ?.slice(5)
          .trim();

        if (!eventName || !dataLine) return;

        const data = JSON.parse(dataLine);

        if (eventName === "progress") {
          setProgress((previous) => ({
            stage: normalizeStage(data.stage ?? previous.stage),
            message: textValue(data.message, previous.message),
            claimNumber:
              numericValue(data.claim_number) ?? previous.claimNumber,
            totalClaims:
              numericValue(data.total_claims) ?? previous.totalClaims,
            evidenceFound:
              numericValue(data.evidence_found) ?? previous.evidenceFound,
          }));
        }

        if (eventName === "complete") {
          const finalResponse = data as VerificationResponse;

          if (!Array.isArray(finalResponse.results)) {
            throw new Error(
              "The backend returned an invalid results array."
            );
          }

          completed = true;
          setResponse(finalResponse);

          const evidenceCount = finalResponse.results.reduce(
            (sum, item) =>
              sum + getEvidence(item).length,
            0
          );

          setProgress({
            stage: "complete",
            message: "Investigation completed. Your findings are ready.",
            claimNumber: finalResponse.results.length,
            totalClaims:
              finalResponse.total_claims ??
              finalResponse.results.length,
            evidenceFound: evidenceCount,
          });
        }

        if (eventName === "error") {
          throw new Error(
            textValue(data.message, "Verification failed.")
          );
        }
      }

      while (true) {
        const { value, done } = await reader.read();

        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        const events = buffer.split(/\r?\n\r?\n/);
        buffer = events.pop() || "";

        for (const event of events) {
          processEvent(event);
        }
      }

      buffer += decoder.decode();

      if (buffer.trim()) {
        processEvent(buffer);
      }

      if (!completed) {
        throw new Error(
          "The connection closed before the report was received."
        );
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while connecting to DePhantom."
      );

      setProgress((previous) => ({
        ...previous,
        stage: "error",
        message: "The investigation could not be completed.",
      }));
    } finally {
      setLoading(false);
    }
  }

  function resetInvestigation() {
    setResponse(null);
    setError("");
    setProgress(initialProgress);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#1016d8] text-white">
      {/* Ambient background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-40 top-20 h-[500px] w-[500px] rounded-full bg-[#4a37ff]/30 blur-[150px]" />
        <div className="absolute -right-40 top-[20%] h-[600px] w-[600px] rounded-full bg-[#00d9ff]/20 blur-[150px]" />
        <div className="absolute bottom-[-200px] left-[30%] h-[500px] w-[500px] rounded-full bg-[#f34eaa]/15 blur-[150px]" />
        <div className="absolute inset-0 opacity-[0.08] [background-image:radial-gradient(#ffffff_0.8px,transparent_0.8px)] [background-size:25px_25px]" />
      </div>

      {/* Navbar */}
      <div className="relative z-30">
        <Navbar />
      </div>

      {/* Investigation workspace */}
      <section className="relative z-10 mx-auto max-w-[1440px] px-6 pb-12 pt-8 lg:px-14 lg:pt-12">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-5">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-200/25 bg-cyan-200/10 px-4 py-2 text-[10px] font-black tracking-[2px] text-cyan-100">
              <Sparkles size={13} />
              QUESTION THE ANSWER
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  loading
                    ? "animate-pulse bg-cyan-300"
                    : "bg-[#ff82bd]"
                }`}
              />
            </div>

            <h1 className="text-5xl font-black leading-[0.95] tracking-[-3px] sm:text-6xl lg:text-7xl">
              Put AI under
              <br />
              <span className="text-[#00dcff]">
                the microscope.
              </span>
            </h1>

            <p className="mt-5 max-w-xl text-sm leading-7 text-blue-100/65">
              Examine individual claims, discover external evidence and
              investigate whether an AI-generated answer holds up.
            </p>
          </div>

          <div className="hidden items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-4 py-2.5 text-[10px] font-bold text-blue-100/65 sm:flex">
            <span
              className={`h-2 w-2 rounded-full ${
                loading
                  ? "animate-pulse bg-cyan-300"
                  : "bg-emerald-300"
              }`}
            />
            {loading ? "INVESTIGATION ACTIVE" : "SYSTEM READY"}
          </div>
        </div>

        <div className="grid items-start gap-6 lg:grid-cols-[1.12fr_0.88fr]">
          {/* Input component */}
          <InvestigationWorkspace
            onInvestigate={handleInvestigate}
            loading={loading}
            error={error || null}
          />

          {/* Orb and progress */}
          <div className="space-y-5">
            <OrbVisual
              active={loading}
              status={
                loading
                  ? "ANALYZING EVIDENCE"
                  : response
                    ? "INVESTIGATION COMPLETE"
                    : "READY TO INVESTIGATE"
              }
            />

            <LiveProgress
              stage={progress.stage}
              evidenceFound={progress.evidenceFound}
              claimsFound={progress.totalClaims}
              error={error}
            />
          </div>
        </div>

        {/* Example prompts */}
        {!response && (
          <div className="mt-8">
            <p className="mb-3 text-[9px] font-black tracking-[2px] text-blue-100/45">
              TRY AN EXAMPLE
            </p>

            <div className="flex flex-wrap gap-2">
              {examples.map((example) => (
                <button
                  key={example.name}
                  type="button"
                  disabled={loading}
                  onClick={() => {
                    const textarea =
                      document.querySelector<HTMLTextAreaElement>(
                        "textarea"
                      );

                    if (textarea) {
                      const nativeSetter = Object.getOwnPropertyDescriptor(
                        window.HTMLTextAreaElement.prototype,
                        "value"
                      )?.set;

                      nativeSetter?.call(textarea, example.text);
                      textarea.dispatchEvent(
                        new Event("input", { bubbles: true })
                      );
                    }
                  }}
                  className="rounded-full border border-white/20 bg-white/[0.05] px-4 py-2 text-[10px] font-bold text-blue-100/75 transition hover:border-pink-300/70 hover:bg-pink-300/10 hover:text-pink-200 disabled:opacity-30"
                >
                  + {example.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Investigation report */}
      {response && (
        <section
          id="report"
          ref={reportRef}
          className="relative z-10 scroll-mt-6 border-t border-white/10 bg-[#080e78]/90 px-6 py-14 lg:px-14"
        >
          <div className="mx-auto max-w-[1440px]">
            <div className="mb-10 flex flex-wrap items-end justify-between gap-5">
              <div>
                <span className="text-[10px] font-black tracking-[3px] text-cyan-300">
                  INVESTIGATION REPORT
                </span>

                <h2 className="mt-3 text-4xl font-black tracking-[-2px] sm:text-5xl">
                  Evidence & findings
                  <span className="text-pink-300">.</span>
                </h2>

                <p className="mt-3 text-sm text-blue-100/55">
                  {response.total_claims ?? results.length} claims examined
                  {" · "}
                  {totalEvidence} evidence items retrieved
                </p>
              </div>

              <button
                type="button"
                onClick={resetInvestigation}
                className="flex items-center gap-2 rounded-xl border border-white/20 px-4 py-3 text-xs font-bold transition hover:bg-white/10"
              >
                New investigation
                <ArrowUpRight size={15} />
              </button>
            </div>

            {results.length === 0 ? (
              <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-8 text-sm text-blue-100/60">
                No claims were extracted from the submitted text.
              </div>
            ) : (
              <div className="space-y-10">
                {/* Summary */}
                <InvestigationSummary
                  verdict={overallVerdict}
                  totalClaims={results.length}
                  supportedClaims={supportedCount}
                  contradictedClaims={contradictedCount}
                  unverifiedClaims={unverifiedCount}
                  totalEvidence={totalEvidence}
                />

                {/* Overall verdict */}
                <VerdictSpotlight
                  verdict={overallVerdict}
                  consistencyScore={averageConsistency}
                  supportPercentage={averageSupportPercentage}
                />

                {/* Claim-level results */}
                <section className="space-y-5">
                  <div>
                    <p className="text-[10px] font-black tracking-[3px] text-cyan-300">
                      CLAIM-BY-CLAIM BREAKDOWN
                    </p>
                    <h2 className="mt-2 text-2xl font-black text-white">
                      Individual findings
                      <span className="text-pink-400">.</span>
                    </h2>
                  </div>

                  <div className="space-y-4">
                    {results.map((item, index) => {
                      const claim = mapClaim(item);
                      const correction = object(item.correction);

                      return (
                        <div key={index} className="space-y-4">
                          <ClaimCard
                            claim={claim}
                            index={index}
                          />

                          {correction.correction_available === true && (
                            <CorrectionPanel
                              originalClaim={claim.claim}
                              suggestedCorrection={textValue(
                                correction.suggested_correction
                              )}
                              explanation={textValue(
                                correction.explanation
                              )}
                              evidence={getEvidence(item).map((source) => ({
                                title: textValue(
                                  source.title,
                                  "Evidence source"
                                ),
                                url: textValue(source.url),
                                snippet: textValue(source.snippet),
                              }))}
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </section>

                {/* Source intelligence */}
                <SourceIntelligence sources={sources} />

                {/* HHEM */}
                <HHEMAnalysis results={hhemResults} />

                {/* NLI */}
                <NLIAnalysis results={nliResults} />
              </div>
            )}

            <p className="mt-12 text-center text-[10px] leading-6 text-blue-100/40">
              DePhantom provides evidence-based assessments, not a guarantee
              of factual truth. Review original sources and context before
              relying on a finding.
            </p>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 bg-[#080d83] px-6 py-6 lg:px-14">
        <div className="mx-auto flex max-w-[1440px] flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2 text-sm font-black">
            <Fingerprint size={20} />
            dephantom
            <span className="text-pink-300">.</span>
          </div>

          <p className="text-[10px] text-blue-100/45">
            Question the answer. Follow the evidence.
          </p>

          <p className="text-[9px] font-bold tracking-widest text-blue-100/45">
            HACKNAUTS 2.0 · TEAM CANDY CRUSH
          </p>
        </div>
      </footer>
    </main>
  );
}
