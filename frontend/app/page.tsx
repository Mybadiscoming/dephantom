
// Path: frontend/app/page.tsx

import {
  ArrowRight,
  ArrowUpRight,
  BrainCircuit,
  Check,
  ChevronRight,
  CircleAlert,
  FileSearch,
  Fingerprint,
  Globe2,
  Search,
  ShieldCheck,
  Sparkles,
  Target,
  Zap,
} from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Extract claims",
    description:
      "Break AI-generated responses into individual factual statements.",
    icon: Target,
  },
  {
    number: "02",
    title: "Find evidence",
    description:
      "Retrieve relevant external information and assess source credibility.",
    icon: Globe2,
  },
  {
    number: "03",
    title: "Evaluate",
    description:
      "Use hallucination evaluation and language inference models to examine evidence.",
    icon: BrainCircuit,
  },
  {
    number: "04",
    title: "Reveal findings",
    description:
      "Present claim-level verdicts with evidence and explanations.",
    icon: ShieldCheck,
  },
];

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#1016d8] text-white">
      {/* NAVIGATION */}
      <nav className="relative z-30 mx-auto flex max-w-[1440px] items-center justify-between px-6 py-6 lg:px-16">
        <a href="#" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-full border border-white/40">
            <Fingerprint size={21} />
          </div>
          <span className="text-xl font-black tracking-[-1px]">
            dephantom<span className="text-[#ff8dbc]">.</span>
          </span>
        </a>

        <div className="hidden items-center gap-9 text-xs font-semibold text-white/70 md:flex">
          <a href="#process" className="transition hover:text-white">
            Process
          </a>
          <a href="#technology" className="transition hover:text-white">
            Technology
          </a>
          <a href="#about" className="transition hover:text-white">
            About
          </a>
        </div>

        <a
          href="/verify"
          className="group flex items-center gap-2 rounded-lg border border-white/50 bg-white px-5 py-2.5 text-xs font-extrabold text-[#171bd8] transition hover:-translate-y-0.5 hover:bg-[#ffdaeb]"
        >
          Start Investigating
          <ArrowUpRight size={15} />
        </a>
      </nav>

      {/* HERO */}
      <section className="hero-gradient grid-texture relative isolate min-h-[740px]">
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="orbital-shape right-[7%] top-[9%]" />
          <div className="absolute -bottom-40 -left-20 h-[450px] w-[450px] rounded-full bg-[#3730ff] opacity-40 blur-[120px]" />
        </div>

        <div className="relative mx-auto grid max-w-[1440px] items-center gap-12 px-6 pb-24 pt-20 lg:grid-cols-[0.95fr_1.05fr] lg:px-16 lg:pb-32 lg:pt-24">
          {/* HERO TEXT */}
          <div className="relative z-10 max-w-[650px]">
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-[10px] font-bold tracking-[2px] text-cyan-100 backdrop-blur-md">
              <Sparkles size={14} />
              QUESTION THE ANSWER
              <span className="h-1.5 w-1.5 rounded-full bg-[#ff8dbc]" />
            </div>

            <h1 className="text-[58px] font-black leading-[0.98] tracking-[-3.5px] sm:text-7xl lg:text-[88px]">
              Supercharge
              <br />
              your trust
              <br />
              in <span className="text-[#00d9ff]">AI.</span>
            </h1>

            <p className="mt-8 max-w-[490px] text-base leading-8 text-blue-100/80 sm:text-lg">
              AI can sound certain and still get things wrong. DePhantom
              investigates AI-generated claims using external evidence,
              source credibility and intelligent verification.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-4">
              <a
                href="/verify"
                className="group flex items-center gap-3 rounded-lg bg-gradient-to-r from-white to-[#d9fbff] px-7 py-4 text-sm font-extrabold text-[#171bd8] shadow-xl shadow-blue-950/20 transition hover:-translate-y-1 hover:shadow-cyan-300/20"
              >
                Start Investigating
                <ArrowRight
                  size={18}
                  className="transition group-hover:translate-x-1"
                />
              </a>

              <a
                href="#process"
                className="flex items-center gap-2 px-4 py-4 text-sm font-bold text-white/80 transition hover:text-[#00d9ff]"
              >
                Discover the process <ChevronRight size={17} />
              </a>
            </div>

            <div className="mt-12 flex flex-wrap gap-x-7 gap-y-4 text-xs font-semibold text-blue-100/70">
              <span className="flex items-center gap-2">
                <Check size={15} className="text-[#00e3ff]" />
                Claim-level checks
              </span>
              <span className="flex items-center gap-2">
                <Check size={15} className="text-[#00e3ff]" />
                External evidence
              </span>
              <span className="flex items-center gap-2">
                <Check size={15} className="text-[#00e3ff]" />
                Transparent results
              </span>
            </div>
          </div>

          {/* HERO VISUAL */}
          <div className="relative mx-auto flex min-h-[570px] w-full max-w-[650px] items-center justify-center">
            <div className="absolute right-[8%] top-[2%] h-20 w-20 rounded-full bg-cyan-300/30 blur-3xl" />

            <div className="analysis-glass relative z-10 w-full max-w-[490px] rounded-[20px] p-5 sm:p-7">
              <div className="flex items-center justify-between border-b border-white/15 pb-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-300/15 text-[#00dcff]">
                    <ShieldCheck size={22} />
                  </div>
                  <div>
                    <p className="text-sm font-extrabold">DePhantom analysis</p>
                    <p className="mt-1 text-[10px] text-blue-100/50">
                      Illustrative verification preview
                    </p>
                  </div>
                </div>
                <span className="rounded-full border border-cyan-300/30 px-3 py-1.5 text-[9px] font-bold tracking-wider text-cyan-200">
                  LIVE CONCEPT
                </span>
              </div>

              <div className="mt-6">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-[10px] font-bold tracking-[2px] text-blue-100/50">
                    INPUT CLAIM
                  </span>
                  <FileSearch size={16} className="text-cyan-300" />
                </div>
                <div className="rounded-xl border border-white/10 bg-white/[0.07] p-4">
                  <p className="text-sm font-semibold leading-6 text-white">
                    &quot;The Sun revolves around the Earth.&quot;
                  </p>
                </div>
              </div>

              <div className="my-6 flex items-center gap-3">
                <div className="h-px flex-1 bg-white/15" />
                <span className="text-[9px] font-bold tracking-[2px] text-blue-100/50">
                  VERIFICATION PIPELINE
                </span>
                <div className="h-px flex-1 bg-white/15" />
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.05] p-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-300/15 text-cyan-300">
                    <Globe2 size={18} />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-bold">External evidence</p>
                    <p className="mt-1 text-[10px] text-blue-100/50">
                      Search and source evaluation
                    </p>
                  </div>
                  <Check size={17} className="text-cyan-300" />
                </div>

                <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.05] p-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#ff8dbc]/15 text-[#ff8dbc]">
                    <BrainCircuit size={18} />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-bold">AI consistency checks</p>
                    <p className="mt-1 text-[10px] text-blue-100/50">
                      HHEM and NLI evaluation
                    </p>
                  </div>
                  <Zap size={17} className="text-[#ff8dbc]" />
                </div>
              </div>

              <div className="mt-5 rounded-xl border border-[#ff8dbc]/30 bg-[#ff8dbc]/10 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[9px] font-extrabold tracking-[2px] text-[#ffb3d0]">
                      SAMPLE FINDING
                    </p>
                    <p className="mt-2 text-xl font-black text-[#ff8dbc]">
                      Contradicted
                    </p>
                  </div>
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#ff8dbc]/15 text-[#ff8dbc]">
                    <CircleAlert size={23} />
                  </div>
                </div>
                <p className="mt-3 text-[10px] leading-5 text-pink-100/70">
                  Available evidence conflicts with the submitted claim.
                  Review the sources and their context.
                </p>
              </div>

              <div className="mt-5 flex items-center justify-center gap-2 text-[9px] font-bold tracking-[2px] text-blue-100/40">
                <Fingerprint size={14} />
                FOLLOW THE EVIDENCE
              </div>
            </div>

            <div className="absolute -left-2 top-[15%] z-20 hidden items-center gap-2 rounded-lg border border-white/20 bg-[#1118a7]/90 px-4 py-3 shadow-xl backdrop-blur-md sm:flex">
              <Search size={17} className="text-cyan-300" />
              <span className="text-[11px] font-bold">Evidence search</span>
            </div>

            <div className="absolute -bottom-1 right-0 z-20 hidden items-center gap-2 rounded-lg border border-white/20 bg-[#1118a7]/90 px-4 py-3 shadow-xl backdrop-blur-md sm:flex">
              <Sparkles size={17} className="text-[#ff8dbc]" />
              <span className="text-[11px] font-bold">Intelligent analysis</span>
            </div>
          </div>
        </div>
      </section>

      {/* MESSAGE STRIP */}
      <section className="border-y border-white/10 bg-[#0b119f] px-6 py-6">
        <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-center gap-x-10 gap-y-3 text-center">
          <span className="text-sm font-black tracking-[1px]">
            CONFIDENCE IS NOT PROOF.
          </span>
          <span className="hidden h-5 w-px bg-white/25 sm:block" />
          <span className="text-xs font-medium text-blue-100/70">
            Evidence deserves the final word.
          </span>
          <span className="text-[#ff8dbc]">✳</span>
          <span className="text-xs font-bold tracking-widest text-cyan-200">
            DEPHANTOM
          </span>
        </div>
      </section>

      {/* PROCESS */}
      <section id="process" className="bg-[#f4f7ff] px-6 py-24 text-[#101b43] lg:px-16 lg:py-32">
        <div className="mx-auto max-w-[1300px]">
          <div className="max-w-2xl">
            <span className="text-[10px] font-black tracking-[3px] text-[#e64d91]">
              HOW IT WORKS
            </span>
            <h2 className="mt-5 text-4xl font-black tracking-[-2px] sm:text-6xl">
              Four steps.
              <br />
              <span className="text-[#2948ed]">A closer look.</span>
            </h2>
            <p className="mt-5 max-w-xl text-sm leading-7 text-[#697492]">
              A structured pipeline that examines claims, retrieves relevant
              information, evaluates evidence, and presents transparent
              findings.
            </p>
          </div>

          <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.number}
                  className="group rounded-2xl border border-[#e1e7f5] bg-white p-7 transition duration-300 hover:-translate-y-2 hover:border-[#2948ed]/40 hover:shadow-2xl hover:shadow-blue-950/10"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#eaf0ff] text-[#2948ed] transition group-hover:bg-[#2948ed] group-hover:text-white">
                      <Icon size={23} />
                    </div>
                    <span className="text-sm font-black text-[#b9c2db]">
                      {step.number}
                    </span>
                  </div>
                  <h3 className="mt-9 text-lg font-black">{step.title}</h3>
                  <p className="mt-3 text-xs leading-6 text-[#77819c]">
                    {step.description}
                  </p>
                  <div className="mt-7 h-1 w-9 rounded-full bg-[#ff8dbc] transition-all group-hover:w-16" />
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* TECHNOLOGY */}
      <section id="technology" className="bg-[#0c128d] px-6 py-24 lg:px-16 lg:py-28">
        <div className="mx-auto grid max-w-[1300px] items-center gap-16 lg:grid-cols-[1fr_0.85fr]">
          <div>
            <span className="text-[10px] font-black tracking-[3px] text-cyan-300">
              UNDER THE HOOD
            </span>
            <h2 className="mt-5 text-4xl font-black leading-tight tracking-[-2px] sm:text-6xl">
              Not just a verdict.
              <br />
              <span className="text-[#00d9ff]">An explanation.</span>
            </h2>
            <p className="mt-6 max-w-xl text-sm leading-8 text-blue-100/65">
              DePhantom combines multiple evaluation layers to help identify
              potentially misleading AI-generated statements. It considers
              retrieved evidence, source credibility, evidence consistency
              and natural language inference.
            </p>
            <a
              href="#about"
              className="mt-8 inline-flex items-center gap-3 text-sm font-bold text-white transition hover:text-cyan-300"
            >
              Learn about DePhantom <ArrowRight size={17} />
            </a>
          </div>

          <div className="relative">
            <div className="absolute -inset-8 rounded-full bg-cyan-400/10 blur-[70px]" />
            <div className="relative space-y-3">
              {[
                ["01", "Source credibility", "Heuristic source ranking"],
                ["02", "HHEM evaluation", "Evidence-claim consistency"],
                ["03", "NLI classification", "Entailment, contradiction, neutral"],
                ["04", "Verdict engine", "Combined evidence assessment"],
              ].map(([number, title, subtitle]) => (
                <div
                  key={number}
                  className="flex items-center gap-4 rounded-xl border border-white/10 bg-white/[0.06] p-5 backdrop-blur-md transition hover:border-cyan-300/50 hover:bg-white/10"
                >
                  <span className="text-xs font-black text-cyan-300">
                    {number}
                  </span>
                  <div className="flex-1">
                    <p className="text-sm font-extrabold">{title}</p>
                    <p className="mt-1 text-[10px] text-blue-100/50">
                      {subtitle}
                    </p>
                  </div>
                  <ChevronRight size={18} className="text-white/40" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="bg-[#f4f7ff] px-6 py-24 text-[#101b43] lg:px-16">
        <div className="mx-auto flex max-w-[1300px] flex-col items-start justify-between gap-8 rounded-[28px] bg-white p-8 shadow-xl shadow-blue-950/5 sm:p-12 lg:flex-row lg:items-center">
          <div className="max-w-2xl">
            <span className="text-[10px] font-black tracking-[3px] text-[#e64d91]">
              THE IDEA BEHIND DEPHANTOM
            </span>
            <h2 className="mt-5 text-3xl font-black tracking-[-1.5px] sm:text-5xl">
              Think critically.
              <br />
              <span className="text-[#2948ed]">Verify confidently.</span>
            </h2>
            <p className="mt-5 text-sm leading-7 text-[#77819c]">
              Our goal is not to ask people to blindly trust another AI
              system. It is to make the evidence behind AI-generated
              information easier to inspect.
            </p>
          </div>
          <div className="flex h-32 w-32 shrink-0 items-center justify-center rounded-[30px] bg-[#2948ed] text-white shadow-xl shadow-blue-200">
            <Fingerprint size={76} strokeWidth={1.2} />
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/10 bg-[#080d77] px-6 py-8 lg:px-16">
        <div className="mx-auto flex max-w-[1300px] flex-col items-center justify-between gap-5 sm:flex-row">
          <div className="flex items-center gap-2 text-lg font-black">
            <Fingerprint size={22} />
            dephantom<span className="text-[#ff8dbc]">.</span>
          </div>
          <p className="text-center text-[10px] font-medium text-blue-100/50">
            Question the answer. Follow the evidence.
          </p>
          <p className="text-[10px] font-bold tracking-wider text-blue-100/60">
            HACKNAUTS 2.0 · TEAM CANDY CRUSH
          </p>
        </div>
      </footer>
    </main>
  );
}
