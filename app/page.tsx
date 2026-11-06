"use client";
import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Download, DollarSign, Eye, HelpCircle, Smartphone, Sparkles, Wand2, Zap } from "lucide-react";
import SiteHeader from "@/components/layout/SiteHeader";


const ACQUISITION_SESSION_KEY = "ndjc_acquisition_session_id";

export default function Home() {
  const previewScreens = ["home", "services", "chat", "announcement"] as const;
  const navItems = [
    { id: "how-it-works", label: "How it works" },
    { id: "features", label: "AI workflow" },
    { id: "faq", label: "FAQ" },
    { id: "trust", label: "Trust" },
  ] as const;

  const [activePreview, setActivePreview] = useState<(typeof previewScreens)[number]>("home");
  const [isHeaderCompact, setIsHeaderCompact] = useState(false);
  const [activeSection, setActiveSection] = useState<(typeof navItems)[number]["id"] | null>(null);
  
    useEffect(() => {
    try {
      let sessionId = window.localStorage.getItem(ACQUISITION_SESSION_KEY);

      if (!sessionId) {
        sessionId =
          typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
            ? crypto.randomUUID()
            : `ndjc_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;

        window.localStorage.setItem(ACQUISITION_SESSION_KEY, sessionId);
      }

      const url = new URL(window.location.href);

      void fetch("/api/track-acquisition", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sessionId,
          landingPath: `${url.pathname}${url.search}`,
          referrer: document.referrer || null,
          utmSource: url.searchParams.get("utm_source"),
          utmMedium: url.searchParams.get("utm_medium"),
          utmCampaign: url.searchParams.get("utm_campaign"),
        }),
      });
    } catch (error) {
      console.error("NDJC home: failed to track acquisition", error);
    }
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActivePreview((current) => {
        const currentIndex = previewScreens.indexOf(current);
        return previewScreens[(currentIndex + 1) % previewScreens.length];
      });
    }, 2600);

    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsHeaderCompact(currentScrollY > 24);

      const probeY = currentScrollY + 140;
      let nextActiveSection: (typeof navItems)[number]["id"] | null = null;

      for (const item of navItems) {
        const element = document.getElementById(item.id);
        if (!element) continue;

        const sectionTop = element.offsetTop;
        const sectionBottom = sectionTop + element.offsetHeight;

        if (probeY >= sectionTop && probeY < sectionBottom) {
          nextActiveSection = item.id;
          break;
        }
      }

      setActiveSection((prev) => (prev === nextActiveSection ? prev : nextActiveSection));
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [navItems]);

  const handleNavClick = (sectionId: (typeof navItems)[number]["id"]) => {
    const element = document.getElementById(sectionId);
    if (!element) return;

    const headerOffset = 104;
    const targetTop = element.getBoundingClientRect().top + window.scrollY - headerOffset;

    window.scrollTo({
      top: targetTop,
      behavior: "smooth",
    });
  };

  const headerNavItems = useMemo(
    () =>
      navItems.map((item) => ({
        label: item.label,
        isActive: activeSection === item.id,
        onClick: () => handleNavClick(item.id),
      })),
    [activeSection]
  );

  return (
    <main className="relative min-h-screen bg-[#f8fafc] text-[#0f172a]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "ChangeLatch",
            url: "https://www.thinkitdoneapp.com/",
          }).replace(/</g, "\\u003c"),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: "ChangeLatch",
            url: "https://www.thinkitdoneapp.com/",
            applicationCategory: "DeveloperApplication",
            operatingSystem: "Windows",
            description:
              "ChangeLatch is a local Windows tool for reviewing and applying AI-generated PATCH changes with exact matching, project verification, and optional GitHub syncing.",
            publisher: {
              "@type": "Organization",
              name: "Think It Done",
            },
          }).replace(/</g, "\\u003c"),
        }}
      />

      <div className="fixed inset-0 -z-10 bg-[linear-gradient(135deg,#ffffff_0%,#f1f5f9_48%,#d7dde8_100%),radial-gradient(circle_at_top,rgba(99,102,241,0.18),transparent_38%)]" />

      <SiteHeader
        compact={isHeaderCompact}
        navItems={headerNavItems}
      />

      <div className="relative">
        <section className="relative z-10 mx-auto grid max-w-7xl items-center gap-10 px-5 pb-14 pt-10 sm:px-6 md:min-h-[78vh] md:grid-cols-[minmax(0,640px)_1fr] md:gap-12 md:py-16">
          <div className="max-w-[640px]">
            <div className="mb-4 inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium tracking-[0.06em] text-[#64748b]">
              AI-ASSISTED CODE WORKFLOW
            </div>

            <h1 className="mb-6 text-[38px] font-extrabold leading-[0.98] tracking-[-0.045em] sm:text-5xl md:mb-8 md:text-7xl md:leading-[0.96]">
              ChangeLatch
              <br />
              <span className="text-[28px] text-[#0f172a]/60 sm:text-4xl md:text-6xl">Review AI Code Changes. Apply with Control.</span>
            </h1>

            <p className="max-w-[600px] text-base leading-[1.8] text-[#475569] md:text-lg md:leading-[1.9]">
              Generate AI PATCH instructions using GitHub or an optional project ZIP. Review changes, apply them precisely, run verification, and optionally push updates to GitHub.
            </p>

            <p className="mt-4 max-w-[600px] text-sm leading-7 text-[#64748b] md:text-[15px]">
              Built for developers using web-based AI assistants who want precise code changes, local control, and no separate AI API setup.
            </p>

            <div className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:gap-4">
<button
  type="button"
  onClick={() => {
    window.location.href = "/pricing";
  }}
  className="group relative inline-flex w-full justify-center overflow-hidden rounded-full bg-gradient-to-r from-purple-500 via-fuchsia-500 to-pink-500 px-7 py-3.5 text-sm font-semibold text-white shadow-[0_18px_42px_rgba(236,72,153,0.22)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_24px_52px_rgba(236,72,153,0.30)] active:scale-[0.985] sm:w-auto"
>
  <div className="absolute inset-0 bg-[linear-gradient(120deg,transparent_0%,rgba(255,255,255,0.16)_40%,transparent_72%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
  <div className="relative flex items-center justify-center gap-2">
    <span className="text-[15px] font-bold tracking-[-0.01em]">Get ChangeLatch</span>
    <ArrowRight className="h-[15px] w-[15px] text-white/80 transition-transform duration-300 group-hover:translate-x-0.5" />
  </div>
</button>

              <div className="hidden text-[11px] font-semibold uppercase tracking-[0.08em] text-[#94a3b8] sm:flex items-center gap-1.5">
                <span className="text-indigo-500">Prepare</span>
                <span className="opacity-40">→</span>
                <span>Match</span>
                <span className="opacity-40">→</span>
                <span>Apply</span>
              </div>
            </div>
          </div>

          <div className="relative flex items-center justify-center md:mt-0">
            <div className="pointer-events-none absolute inset-8 rounded-[48px] bg-[radial-gradient(circle_at_50%_42%,rgba(99,102,241,0.18),rgba(236,72,153,0.10),transparent_72%)] blur-3xl" />

            <div className="relative w-full max-w-[500px] overflow-hidden rounded-[30px] border border-white/80 bg-white/90 shadow-[0_32px_90px_rgba(15,23,42,0.15)] backdrop-blur-xl">
              <div className="flex items-center justify-between border-b border-slate-200/80 bg-white/85 px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center">
                    <img
                      src="/logo.png"
                      alt="ChangeLatch logo"
                      className="h-9 w-9 object-contain"
                    />
                  </div>
                  <div>
                    <div className="text-sm font-extrabold tracking-[-0.02em] text-[#0f172a]">ChangeLatch</div>
                    <div className="text-[11px] font-medium text-[#94a3b8]">my-project</div>
                  </div>
                </div>

                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1.5 text-[11px] font-semibold text-emerald-600">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  Completed
                </div>
              </div>

              <div className="grid grid-cols-[104px_minmax(0,1fr)]">
                <div className="border-r border-slate-200/80 bg-slate-50/80 p-3">
                  <div className="space-y-1.5">
                    <div className="rounded-xl px-3 py-2.5 text-[11px] font-medium text-[#64748b]">
                      Project
                    </div>
                    <div className="rounded-xl px-3 py-2.5 text-[11px] font-medium text-[#64748b]">
                      Patch
                    </div>
                    <div className="rounded-xl px-3 py-2.5 text-[11px] font-medium text-[#64748b]">
                      Verify
                    </div>
                    <div className="rounded-xl bg-indigo-50 px-3 py-2.5 text-[11px] font-semibold text-indigo-600">
                      History
                    </div>
                  </div>

                  <div className="mt-20 rounded-xl border border-slate-200 bg-white px-3 py-3">
                    <div className="text-[9px] font-semibold uppercase tracking-[0.14em] text-[#94a3b8]">Project</div>
                    <div className="mt-1 truncate text-[10px] font-semibold text-[#475569]">my-project</div>
                  </div>
                </div>

                <div className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-indigo-500">
                        Completed workflow
                      </div>
                      <h3 className="mt-1.5 text-xl font-extrabold tracking-[-0.035em] text-[#0f172a]">
                        PATCH applied successfully
                      </h3>
                    </div>
                    <div className="rounded-full bg-emerald-50 px-3 py-1.5 text-[10px] font-semibold text-emerald-600">
                      Checks passed
                    </div>
                  </div>

                  <div className="mt-5 rounded-[20px] border border-indigo-100 bg-[linear-gradient(135deg,rgba(238,242,255,0.96),rgba(250,245,255,0.90))] p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-indigo-500">Result</div>
                        <div className="mt-1 text-[22px] font-extrabold tracking-[-0.04em] text-[#0f172a]">
                          12 / 12 selected changes matched
                        </div>
                      </div>
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500 text-xl font-bold text-white shadow-[0_10px_24px_rgba(16,185,129,0.24)]">
                        ✓
                      </div>
                    </div>
                    <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-white">
                      <div className="h-full w-full rounded-full bg-gradient-to-r from-indigo-500 to-emerald-400" />
                    </div>
                  </div>

                  <div className="mt-4 space-y-2.5">
                    <div className="flex items-center gap-3 rounded-[16px] border border-slate-200/80 bg-white px-4 py-3">
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-xs font-bold text-emerald-600">
                        ✓
                      </div>
                      <div>
                        <div className="text-[12px] font-semibold text-[#0f172a]">12 changes applied</div>
                        <div className="mt-0.5 text-[10px] text-[#94a3b8]">Selected PATCH changes were applied successfully</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 rounded-[16px] border border-slate-200/80 bg-white px-4 py-3">
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-xs font-bold text-emerald-600">
                        ✓
                      </div>
                      <div>
                        <div className="text-[12px] font-semibold text-[#0f172a]">Automatic backup created</div>
                        <div className="mt-0.5 text-[10px] text-[#94a3b8]">Original files are protected</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 rounded-[16px] border border-slate-200/80 bg-white px-4 py-3">
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-xs font-bold text-emerald-600">
                        ✓
                      </div>
                      <div>
                        <div className="text-[12px] font-semibold text-[#0f172a]">Verification checks passed</div>
                        <div className="mt-0.5 text-[10px] text-[#94a3b8]">Applicable project checks passed</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 rounded-[16px] border border-slate-200/80 bg-white px-4 py-3">
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-xs font-bold text-indigo-600">
                        ↶
                      </div>
                      <div>
                        <div className="text-[12px] font-semibold text-[#0f172a]">Rollback last patch available</div>
                        <div className="mt-0.5 text-[10px] text-[#94a3b8]">Rollback when safety checks allow</div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 flex items-center gap-3">
                    <button
                      type="button"
                      className="inline-flex flex-1 items-center justify-center rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 px-4 py-3 text-[11px] font-semibold text-white shadow-[0_10px_24px_rgba(99,102,241,0.20)]"
                    >
                      View history
                    </button>
                    <button
                      type="button"
                      className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-3 text-[11px] font-semibold text-[#64748b]"
                    >
                      Rollback last patch
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-center gap-1.5 border-t border-slate-200/80 bg-slate-50/80 px-5 py-3 text-[10px] font-semibold text-emerald-600">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                12 changes applied · Checks passed · Rollback available
              </div>
            </div>
          </div>
        </section>
      </div>

      <div className="flex flex-col">
      <section id="features" className="order-3 scroll-mt-28 mx-auto max-w-7xl px-5 py-14 sm:px-6 md:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-3 text-center text-sm font-semibold tracking-[0.14em] text-indigo-400">
            AI code workflow
          </div>
          <h2 className="text-center text-[34px] font-extrabold leading-[1.06] tracking-[-0.045em] text-[#0f172a] sm:text-4xl md:text-[54px] md:leading-[1.04]">
            From AI-generated changes to safely applied code
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-[1.8] text-[#64748b] md:mt-6 md:text-[17px] md:leading-[1.9]">
            Turn AI-generated code changes into reviewable PATCH workflows with multi-file operations and project verification.
          </p>
        </div>

        <div className="mt-10 grid gap-4 md:mt-14 md:gap-5 lg:grid-cols-3">
          <div className="group relative overflow-hidden rounded-[26px] border border-indigo-100/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.96)_0%,rgba(246,248,255,0.92)_100%)] p-6 shadow-[0_24px_70px_rgba(99,102,241,0.12)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_30px_82px_rgba(99,102,241,0.16)] md:rounded-[34px] md:p-8">
            <div className="absolute -right-16 -top-16 h-44 w-44 rounded-full bg-indigo-100/70 blur-3xl" />
            <div className="absolute -bottom-20 left-8 h-48 w-48 rounded-full bg-fuchsia-100/50 blur-3xl" />
            <div className="absolute right-8 top-7 text-6xl font-semibold tracking-[-0.06em] text-indigo-100/80">01</div>

            <div className="relative z-10">
              <div className="flex items-start justify-between gap-4">
                <div className="inline-flex rounded-full border border-indigo-100 bg-white/82 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-indigo-500 shadow-[0_10px_26px_rgba(99,102,241,0.08)]">
                  Prepare
                </div>
              </div>

              <h3 className="mt-8 text-3xl font-extrabold tracking-[-0.04em] leading-[1.06] text-[#0f172a]">
                Prepare your project
              </h3>

              <p className="mt-4 text-[15px] leading-[1.85] text-[#64748b]">
                Select your project and prepare AI code context using GitHub or an optional ZIP package.
              </p>

              <div className="mt-8 flex flex-wrap gap-2">
                <span className="rounded-full border border-indigo-100 bg-white/82 px-3 py-1.5 text-xs font-semibold text-indigo-500">
                  Project files
                </span>
                <span className="rounded-full border border-indigo-100 bg-white/82 px-3 py-1.5 text-xs font-semibold text-indigo-500">
                  Smart exclude
                </span>
                <span className="rounded-full border border-indigo-100 bg-white/82 px-3 py-1.5 text-xs font-semibold text-indigo-500">
                  GitHub / ZIP
                </span>
              </div>
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-[26px] border border-sky-100/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.96)_0%,rgba(240,249,255,0.90)_100%)] p-6 shadow-[0_24px_70px_rgba(14,165,233,0.10)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_30px_82px_rgba(14,165,233,0.14)] md:rounded-[34px] md:p-8">
            <div className="absolute -right-16 -top-16 h-44 w-44 rounded-full bg-sky-100/70 blur-3xl" />
            <div className="absolute -bottom-20 left-8 h-48 w-48 rounded-full bg-cyan-100/50 blur-3xl" />
            <div className="absolute right-8 top-7 text-6xl font-semibold tracking-[-0.06em] text-sky-100/90">02</div>

            <div className="relative z-10">
              <div className="flex items-start justify-between gap-4">
                <div className="inline-flex rounded-full border border-sky-100 bg-white/82 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-sky-500 shadow-[0_10px_26px_rgba(14,165,233,0.08)]">
                  Locate
                </div>
              </div>

              <h3 className="mt-8 text-3xl font-extrabold tracking-[-0.04em] leading-[1.06] text-[#0f172a]">
                Generate AI request
              </h3>

              <p className="mt-4 text-[15px] leading-[1.85] text-[#64748b]">
                Generate structured AI prompts with your code source, change requirements, and customizable engineering rules.
              </p>

              <div className="mt-8 flex flex-wrap gap-2">
                <span className="rounded-full border border-sky-100 bg-white/82 px-3 py-1.5 text-xs font-semibold text-sky-500">
                  AI prompt
                </span>
                <span className="rounded-full border border-sky-100 bg-white/82 px-3 py-1.5 text-xs font-semibold text-sky-500">
                  Engineering rules
                </span>
                <span className="rounded-full border border-sky-100 bg-white/82 px-3 py-1.5 text-xs font-semibold text-sky-500">
                  PATCH generation
                </span>
              </div>
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-[26px] border border-fuchsia-100/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.96)_0%,rgba(253,244,255,0.90)_100%)] p-6 shadow-[0_24px_70px_rgba(217,70,239,0.10)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_30px_82px_rgba(217,70,239,0.14)] md:rounded-[34px] md:p-8">
            <div className="absolute -right-16 -top-16 h-44 w-44 rounded-full bg-fuchsia-100/70 blur-3xl" />
            <div className="absolute -bottom-20 left-8 h-48 w-48 rounded-full bg-rose-100/50 blur-3xl" />
            <div className="absolute right-8 top-7 text-6xl font-semibold tracking-[-0.06em] text-fuchsia-100/90">03</div>

            <div className="relative z-10">
              <div className="flex items-start justify-between gap-4">
                <div className="inline-flex rounded-full border border-fuchsia-100 bg-white/82 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-fuchsia-500 shadow-[0_10px_26px_rgba(217,70,239,0.08)]">
                  Apply
                </div>
              </div>

              <h3 className="mt-7 text-[24px] font-extrabold leading-[1.08] tracking-[-0.04em] text-[#0f172a] md:mt-8 md:text-3xl md:leading-[1.06]">
                Apply changes safely
              </h3>

              <p className="mt-4 text-[15px] leading-[1.85] text-[#64748b]">
                Review exact matches and diffs, apply selected code or file changes, and run project verification.
              </p>

              <div className="mt-8 flex flex-wrap gap-2">
                <span className="rounded-full border border-fuchsia-100 bg-white/82 px-3 py-1.5 text-xs font-semibold text-fuchsia-500">
                  Exact match
                </span>
                <span className="rounded-full border border-fuchsia-100 bg-white/82 px-3 py-1.5 text-xs font-semibold text-fuchsia-500">
                  Selective apply
                </span>
                <span className="rounded-full border border-fuchsia-100 bg-white/82 px-3 py-1.5 text-xs font-semibold text-fuchsia-500">
                  Project verification
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="order-2 mx-auto max-w-6xl px-5 py-14 sm:px-6 md:py-16">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-3 text-sm font-semibold tracking-[0.14em] text-indigo-400">
            AI Coding Comparison
          </div>
          <h2 className="text-center text-[34px] font-extrabold leading-[1.06] tracking-[-0.045em] text-[#0f172a] sm:text-4xl md:text-[54px] md:leading-[1.04]">
            See how AI coding workflows compare
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-center text-base leading-[1.8] text-[#64748b] md:mt-6 md:text-[17px] md:leading-[1.9]">
            Compare typical manual editing, autonomous-agent workflows, and ChangeLatch. Features and setup requirements vary by tool.
          </p>
        </div>

        <div className="mt-8 overflow-hidden rounded-[24px] border border-white/50 bg-white/62 shadow-[0_20px_62px_rgba(15,23,42,0.07)] backdrop-blur-xl md:mt-10 md:rounded-[32px]">
          <div className="overflow-x-auto">
            <table className="min-w-[760px] w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-slate-200/80">
                  <th className="w-[42%] px-5 py-4 text-[13px] font-extrabold tracking-[-0.01em] text-[#0f172a]">
                    Comparison
                  </th>
                  <th className="px-5 py-4 text-center text-[13px] font-extrabold tracking-[-0.01em] text-[#0f172a]">
                    Chat AI + Manual Editing
                  </th>
                  <th className="px-5 py-4 text-center text-[13px] font-extrabold tracking-[-0.01em] text-[#0f172a]">
                    AI agent
                  </th>
                  <th className="px-5 py-4 text-center text-[13px] font-extrabold tracking-[-0.01em] text-[#0f172a]">
                    ChangeLatch
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-slate-100/90">
                  <td className="px-5 py-4 text-[14px] font-bold tracking-[-0.015em] text-[#0f172a]">
                    One-click multi-file changes
                  </td>
                  <td className="px-5 py-4 text-center">
                    <span className="text-[25px] font-black leading-none text-rose-500">
                      ×
                    </span>
                  </td>
                  <td className="px-5 py-4 text-center">
                    <span className="inline-flex h-5 w-5 items-center justify-center rounded-md bg-emerald-500 text-[13px] font-black leading-none text-white">
                      ✓
                    </span>
                  </td>
                  <td className="px-5 py-4 text-center">
                    <span className="inline-flex h-5 w-5 items-center justify-center rounded-md bg-emerald-500 text-[13px] font-black leading-none text-white">
                      ✓
                    </span>
                  </td>
                </tr>

                <tr className="border-b border-slate-100/90">
                  <td className="px-5 py-4 text-[14px] font-bold tracking-[-0.015em] text-[#0f172a]">
                    Automated multi-file editing
                  </td>
                  <td className="px-5 py-4 text-center">
                    <span className="text-[25px] font-black leading-none text-rose-500">
                      ×
                    </span>
                  </td>
                  <td className="px-5 py-4 text-center">
                    <span className="inline-flex h-5 w-5 items-center justify-center rounded-md bg-emerald-500 text-[13px] font-black leading-none text-white">
                      ✓
                    </span>
                  </td>
                  <td className="px-5 py-4 text-center">
                    <span className="inline-flex h-5 w-5 items-center justify-center rounded-md bg-emerald-500 text-[13px] font-black leading-none text-white">
                      ✓
                    </span>
                  </td>
                </tr>

                <tr className="border-b border-slate-100/90">
                  <td className="px-5 py-4 text-[14px] font-bold tracking-[-0.015em] text-[#0f172a]">
                    User-approved code changes
                  </td>
                  <td className="px-5 py-4 text-center">
                    <span className="inline-flex h-5 w-5 items-center justify-center rounded-md bg-emerald-500 text-[13px] font-black leading-none text-white">
                      ✓
                    </span>
                  </td>
                  <td className="px-5 py-4 text-center">
                    <span className="text-xs font-semibold text-slate-500">Varies</span>
                  </td>
                  <td className="px-5 py-4 text-center">
                    <span className="inline-flex h-5 w-5 items-center justify-center rounded-md bg-emerald-500 text-[13px] font-black leading-none text-white">
                      ✓
                    </span>
                  </td>
                </tr>

                <tr className="border-b border-slate-100/90">
                  <td className="px-5 py-4 text-[14px] font-bold tracking-[-0.015em] text-[#0f172a]">
                    Exact-match checks before applying
                  </td>
                  <td className="px-5 py-4 text-center">
                    <span className="text-[25px] font-black leading-none text-rose-500">
                      ×
                    </span>
                  </td>
                  <td className="px-5 py-4 text-center">
                    <span className="text-xs font-semibold text-slate-500">Varies</span>
                  </td>
                  <td className="px-5 py-4 text-center">
                    <span className="inline-flex h-5 w-5 items-center justify-center rounded-md bg-emerald-500 text-[13px] font-black leading-none text-white">
                      ✓
                    </span>
                  </td>
                </tr>

                <tr className="border-b border-slate-100/90">
                  <td className="px-5 py-4 text-[14px] font-bold tracking-[-0.015em] text-[#0f172a]">
                    Web AI without a separate API key
                  </td>
                  <td className="px-5 py-4 text-center">
                    <span className="inline-flex h-5 w-5 items-center justify-center rounded-md bg-emerald-500 text-[13px] font-black leading-none text-white">
                      ✓
                    </span>
                  </td>
                  <td className="px-5 py-4 text-center">
                    <span className="text-xs font-semibold text-slate-500">Varies</span>
                  </td>
                  <td className="px-5 py-4 text-center">
                    <span className="inline-flex h-5 w-5 items-center justify-center rounded-md bg-emerald-500 text-[13px] font-black leading-none text-white">
                      ✓
                    </span>
                  </td>
                </tr>

                <tr>
                  <td className="px-5 py-4 text-[14px] font-bold tracking-[-0.015em] text-[#0f172a]">
                    No local coding agent setup required
                  </td>
                  <td className="px-5 py-4 text-center">
                    <span className="inline-flex h-5 w-5 items-center justify-center rounded-md bg-emerald-500 text-[13px] font-black leading-none text-white">
                      ✓
                    </span>
                  </td>
                  <td className="px-5 py-4 text-center">
                    <span className="text-xs font-semibold text-slate-500">Varies</span>
                  </td>
                  <td className="px-5 py-4 text-center">
                    <span className="inline-flex h-5 w-5 items-center justify-center rounded-md bg-emerald-500 text-[13px] font-black leading-none text-white">
                      ✓
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="order-4 mx-auto max-w-5xl px-5 py-12 sm:px-6 md:py-14">
        <div className="text-center">
          <div className="mb-3 text-center text-sm font-semibold tracking-[0.14em] text-indigo-400">Use cases</div>
          <h2 className="text-center text-[34px] font-extrabold leading-[1.06] tracking-[-0.045em] text-[#0f172a] sm:text-4xl md:text-[54px] md:leading-[1.04]">
            A safer workflow for AI-assisted coding
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-center text-base leading-[1.8] text-[#64748b] md:mt-6 md:text-[17px] md:leading-[1.9]">
            Use GitHub or an optional ZIP to provide code context to AI, receive structured PATCH instructions, and review, apply, and verify changes locally.
          </p>
        </div>

        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <div className="rounded-full border border-indigo-200/60 bg-indigo-50/60 px-3 py-1.5 text-sm font-medium text-indigo-600">ChatGPT Workflow</div>
          <div className="rounded-full border border-indigo-200/60 bg-indigo-50/60 px-3 py-1.5 text-sm font-medium text-indigo-600">Claude Workflow</div>
          <div className="rounded-full border border-indigo-200/60 bg-indigo-50/60 px-3 py-1.5 text-sm font-medium text-indigo-600">GitHub / ZIP → PATCH</div>
          <div className="rounded-full border border-indigo-200/60 bg-indigo-50/60 px-3 py-1.5 text-sm font-medium text-indigo-600">Safe Code Changes</div>
          <div className="rounded-full border border-indigo-200/60 bg-indigo-50/60 px-3 py-1.5 text-sm font-medium text-indigo-600">Large Projects</div>
        </div>
      </section>



      <section id="how-it-works" className="order-1 scroll-mt-28 mx-auto max-w-7xl px-5 py-14 sm:px-6 md:py-20">
        <div className="mb-9 md:mb-12">
          <div className="mb-3 text-center text-sm font-semibold tracking-[0.14em] text-indigo-400">Why ChangeLatch</div>
          <h2 className="text-center text-[34px] font-extrabold leading-[1.06] tracking-[-0.045em] text-[#0f172a] sm:text-4xl md:text-[54px] md:leading-[1.04]">Make AI-assisted development faster, safer, and more cost-effective</h2>
          <div className="mt-6 h-px w-10 bg-gradient-to-r from-indigo-300/22 via-indigo-200/16 to-transparent" />
        </div>

        <div className="relative grid gap-6 md:grid-cols-3">

          <div className="group relative overflow-hidden rounded-[28px] border border-white/40 bg-white/50 p-6 shadow-[0_14px_40px_rgba(15,23,42,0.05)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1.5 hover:border-indigo-200/60 hover:shadow-[0_20px_48px_rgba(99,102,241,0.07)]">
            <div className="absolute right-5 top-4 text-6xl font-semibold tracking-[-0.06em] text-indigo-100/70">01</div>
            <div className="relative z-10 mb-8 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#6172d6] to-[#7c88e8] text-white shadow-[0_10px_22px_rgba(99,102,241,0.13)]">
              <Wand2 className="h-5 w-5" />
            </div>
            <div className="relative z-10 mb-3 text-sm font-semibold uppercase tracking-[0.16em] text-indigo-400">Efficiency</div>
            <h3 className="relative z-10 mb-3 text-xl font-semibold tracking-tight text-[#0f172a]">Apply multi-file PATCH changes</h3>
            <p className="relative z-10 mb-5 text-[17px] leading-[1.85] text-[#475569]">
              Apply selected code changes across files, including creating, deleting, moving, and renaming files through PATCH instructions.
            </p>
            <div className="relative z-10 text-sm text-[#94a3b8]">Reduce repetitive work and speed up your development workflow.</div>
          </div>

          <div className="group relative overflow-hidden rounded-[28px] border border-white/40 bg-white/50 p-6 shadow-[0_14px_40px_rgba(15,23,42,0.05)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1.5 hover:border-indigo-200/60 hover:shadow-[0_20px_48px_rgba(99,102,241,0.07)]">
            <div className="absolute right-5 top-4 text-6xl font-semibold tracking-[-0.06em] text-indigo-100/70">02</div>
            <div className="relative z-10 mb-8 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#6172d6] to-[#7c88e8] text-white shadow-[0_10px_22px_rgba(99,102,241,0.13)]">
              <Sparkles className="h-5 w-5" />
            </div>
            <div className="relative z-10 mb-3 text-sm font-semibold uppercase tracking-[0.16em] text-indigo-400">Security</div>
            <h3 className="relative z-10 mb-3 text-xl font-semibold tracking-tight text-[#0f172a]">Review, verify, and recover</h3>
            <p className="relative z-10 mb-5 text-[17px] leading-[1.85] text-[#475569]">
              Review diffs and risk indicators, run project checks, and keep backups for guarded rollback.
            </p>
            <div className="relative z-10 text-sm text-[#94a3b8]">Keep your project safe with controlled and verifiable changes.</div>
          </div>

          <div className="group relative overflow-hidden rounded-[28px] border border-white/40 bg-white/50 p-6 shadow-[0_14px_40px_rgba(15,23,42,0.05)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1.5 hover:border-indigo-200/60 hover:shadow-[0_20px_48px_rgba(99,102,241,0.07)]">
            <div className="absolute right-5 top-4 text-6xl font-semibold tracking-[-0.06em] text-indigo-100/70">03</div>
            <div className="relative z-10 mb-8 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#6172d6] to-[#7c88e8] text-white shadow-[0_10px_22px_rgba(99,102,241,0.13)]">
              <Download className="h-5 w-5" />
            </div>
            <div className="relative z-10 mb-3 text-sm font-semibold uppercase tracking-[0.16em] text-indigo-400">Flexible Workflow</div>
            <h3 className="relative z-10 mb-3 text-xl font-semibold tracking-tight text-[#0f172a]">Work with AI without local agents</h3>
            <p className="relative z-10 mb-5 text-[17px] leading-[1.85] text-[#475569]">
              Use GitHub or an optional ZIP to work with web-based AI without configuring a local coding agent.
            </p>
            <div className="relative z-10 text-sm text-[#94a3b8]">GitHub or ZIP · No local coding agent · No separate AI API.</div>
          </div>
        </div>
      </section>
      </div>

            <section id="faq" className="scroll-mt-28 mx-auto max-w-4xl px-5 py-14 sm:px-6 md:py-20">
        <div className="mb-9 text-center md:mb-12">
          <div className="mb-3 text-center text-sm font-semibold tracking-[0.14em] text-indigo-400">FAQ</div>
          <h2 className="text-center text-[34px] font-extrabold leading-[1.06] tracking-[-0.045em] text-[#0f172a] sm:text-4xl md:text-[54px] md:leading-[1.04]">Common questions</h2>
          <div className="mx-auto mt-6 h-px w-10 bg-gradient-to-r from-indigo-300/22 via-indigo-200/16 to-transparent" />
        </div>

        <div className="space-y-5">
          <div className="group rounded-[30px] border border-white/40 bg-white/55 p-6 shadow-[0_14px_40px_rgba(15,23,42,0.05)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-indigo-200/60 hover:shadow-[0_18px_40px_rgba(99,102,241,0.06)] md:p-7">
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <div className="mb-2 inline-flex rounded-full border border-indigo-200/55 bg-indigo-50/70 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.16em] text-indigo-500">
                  Overview
                </div>
                <h3 className="text-[20px] font-semibold leading-[1.18] tracking-[-0.03em] text-[#0f172a] md:text-[30px] md:leading-[1.12]">What is ChangeLatch?</h3>
              </div>
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#6172d6] to-[#7c88e8] text-white shadow-[0_8px_18px_rgba(99,102,241,0.11)]">
                <HelpCircle className="h-5 w-5" />
              </div>
            </div>
            <p className="text-[17px] leading-[1.85] text-[#475569]">
              ChangeLatch is a local Windows tool for reviewing and applying AI-generated PATCH changes. It supports multi-file operations, exact-match review, backups, project verification, repair prompts, and optional GitHub syncing.
            </p>
          </div>

          <div className="group rounded-[30px] border border-white/40 bg-white/55 p-6 shadow-[0_14px_40px_rgba(15,23,42,0.05)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-indigo-200/60 hover:shadow-[0_18px_40px_rgba(99,102,241,0.06)] md:p-7">
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <div className="mb-2 inline-flex rounded-full border border-indigo-200/55 bg-indigo-50/70 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.16em] text-indigo-500">
                  Comparison
                </div>
                <h3 className="text-[20px] font-semibold leading-[1.18] tracking-[-0.03em] text-[#0f172a] md:text-[30px] md:leading-[1.12]">What is the difference between ChangeLatch and ChatGPT/Cursor?</h3>
              </div>
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#6172d6] to-[#7c88e8] text-white shadow-[0_8px_18px_rgba(99,102,241,0.11)]">
                <HelpCircle className="h-5 w-5" />
              </div>
            </div>
            <p className="text-[17px] leading-[1.85] text-[#475569]">
              ChangeLatch does not replace AI coding assistants. It works with tools like ChatGPT and Cursor by turning AI-generated code changes into precise patches that can be safely applied to your project.
            </p>
          </div>

          <div className="group rounded-[30px] border border-white/40 bg-white/55 p-6 shadow-[0_14px_40px_rgba(15,23,42,0.05)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-indigo-200/60 hover:shadow-[0_18px_40px_rgba(99,102,241,0.06)] md:p-7">
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <div className="mb-2 inline-flex rounded-full border border-indigo-200/55 bg-indigo-50/70 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.16em] text-indigo-500">
                  Requirements
                </div>
                <h3 className="text-[20px] font-semibold leading-[1.18] tracking-[-0.03em] text-[#0f172a] md:text-[30px] md:leading-[1.12]">Does ChangeLatch require an AI API key?</h3>
              </div>
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#6172d6] to-[#7c88e8] text-white shadow-[0_8px_18px_rgba(99,102,241,0.11)]">
                <HelpCircle className="h-5 w-5" />
              </div>
            </div>
            <p className="text-[17px] leading-[1.85] text-[#475569]">
              No. ChangeLatch does not require an AI API key or a local AI model setup. You can use your existing web-based AI assistants to generate code changes.
            </p>
          </div>

          <div className="group rounded-[30px] border border-white/40 bg-white/55 p-6 shadow-[0_14px_40px_rgba(15,23,42,0.05)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-indigo-200/60 hover:shadow-[0_18px_40px_rgba(99,102,241,0.06)] md:p-7">
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <div className="mb-2 inline-flex rounded-full border border-indigo-200/55 bg-indigo-50/70 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.16em] text-indigo-500">
                  GitHub / ZIP
                </div>
                <h3 className="text-[20px] font-semibold leading-[1.18] tracking-[-0.03em] text-[#0f172a] md:text-[30px] md:leading-[1.12]">Can I use GitHub instead of a project ZIP?</h3>
              </div>
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#6172d6] to-[#7c88e8] text-white shadow-[0_8px_18px_rgba(99,102,241,0.11)]">
                <HelpCircle className="h-5 w-5" />
              </div>
            </div>
            <p className="text-[17px] leading-[1.85] text-[#475569]">
              Yes. ChangeLatch can include a GitHub repository and branch in AI prompts, or prepare an optional project ZIP. Your AI service must be able to access the selected code source.
            </p>
          </div>

          <div className="group rounded-[30px] border border-white/40 bg-white/55 p-6 shadow-[0_14px_40px_rgba(15,23,42,0.05)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-indigo-200/60 hover:shadow-[0_18px_40px_rgba(99,102,241,0.06)] md:p-7">
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <div className="mb-2 inline-flex rounded-full border border-indigo-200/55 bg-indigo-50/70 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.16em] text-indigo-500">
                  AI Costs
                </div>
                <h3 className="text-[20px] font-semibold leading-[1.18] tracking-[-0.03em] text-[#0f172a] md:text-[30px] md:leading-[1.12]">Does ChangeLatch increase AI usage costs?</h3>
              </div>
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#6172d6] to-[#7c88e8] text-white shadow-[0_8px_18px_rgba(99,102,241,0.11)]">
                <HelpCircle className="h-5 w-5" />
              </div>
            </div>
            <p className="text-[17px] leading-[1.85] text-[#475569]">
              ChangeLatch does not require a separate AI API key. You can use web-based AI assistants, while any AI service usage costs depend on your chosen provider and plan.
            </p>
          </div>

          <div className="group rounded-[30px] border border-white/40 bg-white/55 p-6 shadow-[0_14px_40px_rgba(15,23,42,0.05)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-indigo-200/60 hover:shadow-[0_18px_40px_rgba(99,102,241,0.06)] md:p-7">
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <div className="mb-2 inline-flex rounded-full border border-indigo-200/55 bg-indigo-50/70 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.16em] text-indigo-500">
                  Security
                </div>
                <h3 className="text-[20px] font-semibold leading-[1.18] tracking-[-0.03em] text-[#0f172a] md:text-[30px] md:leading-[1.12]">Is my code safe with ChangeLatch?</h3>
              </div>
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#6172d6] to-[#7c88e8] text-white shadow-[0_8px_18px_rgba(99,102,241,0.11)]">
                <HelpCircle className="h-5 w-5" />
              </div>
            </div>
            <p className="text-[17px] leading-[1.85] text-[#475569]">
              ChangeLatch provides exact matching, change review, risk checks, backups, verification, and guarded rollback. Users remain in control of which changes to apply.
            </p>
          </div>

          <div className="group rounded-[30px] border border-white/40 bg-white/55 p-6 shadow-[0_14px_40px_rgba(15,23,42,0.05)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-indigo-200/60 hover:shadow-[0_18px_40px_rgba(99,102,241,0.06)] md:p-7">
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <div className="mb-2 inline-flex rounded-full border border-indigo-200/55 bg-indigo-50/70 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.16em] text-indigo-500">
                  AI agents
                </div>
                <h3 className="text-[20px] font-semibold leading-[1.18] tracking-[-0.03em] text-[#0f172a] md:text-[30px] md:leading-[1.12]">How does ChangeLatch compare to AI agents?</h3>
              </div>
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#6172d6] to-[#7c88e8] text-white shadow-[0_8px_18px_rgba(99,102,241,0.11)]">
                <HelpCircle className="h-5 w-5" />
              </div>
            </div>
            <p className="text-[17px] leading-[1.85] text-[#475569]">
              ChangeLatch complements AI assistants rather than replacing them. It focuses on reviewing, applying, verifying, and optionally syncing AI-generated changes without requiring a local coding agent.
            </p>

          </div>
        </div>
      </section>

      <section id="trust" className="scroll-mt-28 mx-auto max-w-7xl px-5 pb-12 pt-2 sm:px-6">
        <div className="mb-10 text-center">
          <div className="mb-3 text-center text-sm font-semibold tracking-[0.14em] text-indigo-400">
            Trust &amp; Security
          </div>
          <h2 className="text-center text-[34px] font-extrabold leading-[1.06] tracking-[-0.045em] text-[#0f172a] sm:text-4xl md:text-[54px] md:leading-[1.04]">
            Built for safer, controlled code changes
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-center text-base leading-[1.8] text-[#64748b] md:mt-6 md:text-[17px] md:leading-[1.9]">
            ChangeLatch provides change review, backups, project verification, and guarded rollback for supported PATCH operations.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          <div className="group rounded-[24px] border border-white/40 bg-white/55 p-5 shadow-[0_14px_40px_rgba(15,23,42,0.05)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-indigo-200/60 hover:shadow-[0_18px_40px_rgba(99,102,241,0.06)] md:rounded-[30px] md:p-6">
            <div className="mb-3 inline-flex rounded-full border border-indigo-200/55 bg-indigo-50/70 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.16em] text-indigo-500">
              Exact matching
            </div>
            <h3 className="text-xl font-semibold tracking-[-0.03em] text-[#0f172a]">
              Changes are checked before application
            </h3>
            <p className="mt-3 text-sm leading-7 text-[#64748b]">
              ChangeLatch checks exact code replacements and applies safety checks to file operations before changes are made.
            </p>
          </div>

          <div className="group rounded-[24px] border border-white/40 bg-white/55 p-5 shadow-[0_14px_40px_rgba(15,23,42,0.05)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-indigo-200/60 hover:shadow-[0_18px_40px_rgba(99,102,241,0.06)] md:rounded-[30px] md:p-6">
            <div className="mb-3 inline-flex rounded-full border border-indigo-200/55 bg-indigo-50/70 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.16em] text-indigo-500">
              Review &amp; control
            </div>
            <h3 className="text-xl font-semibold tracking-[-0.03em] text-[#0f172a]">
              Review diffs and select changes
            </h3>
            <p className="mt-3 text-sm leading-7 text-[#64748b]">
              Review code differences and risk indicators, then choose which eligible PATCH changes to apply.
            </p>
          </div>

          <div className="group rounded-[24px] border border-white/40 bg-white/55 p-5 shadow-[0_14px_40px_rgba(15,23,42,0.05)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-indigo-200/60 hover:shadow-[0_18px_40px_rgba(99,102,241,0.06)] md:rounded-[30px] md:p-6">
            <div className="mb-3 inline-flex rounded-full border border-indigo-200/55 bg-indigo-50/70 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.16em] text-indigo-500">
              Protection
            </div>
            <h3 className="text-xl font-semibold tracking-[-0.03em] text-[#0f172a]">
              Backups, project verification, and guarded rollback
            </h3>
            <p className="mt-3 text-sm leading-7 text-[#64748b]">
              Applied changes are recorded in PATCH history, supported project checks can run after application, and rollback is available when safety checks permit.
            </p>
          </div>
        </div>

      </section>

      <section className="mx-auto max-w-5xl px-5 pb-16 pt-4 sm:px-6 md:pb-20">
        <div className="px-0 py-8 text-center md:px-12 md:py-12">
          <div className="mb-3 text-center text-sm font-semibold tracking-[0.14em] text-indigo-400">Ready to start?</div>
          <h2 className="mt-3 text-center text-[34px] font-extrabold leading-[1.06] tracking-[-0.045em] text-[#0f172a] sm:text-4xl md:text-[54px] md:leading-[1.04]">
            Make AI changes easier to review, apply, and verify
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-center text-base leading-[1.8] text-[#64748b] md:mt-6 md:text-[17px] md:leading-[1.9]">
            Use your preferred web-based AI with ChangeLatch to review and apply PATCH changes without a local coding agent or separate AI API key.
          </p>
          <div className="mt-8 flex justify-center">
            <button
              type="button"
              onClick={() => {
                window.location.href = "/pricing";
              }}
              className="group relative inline-flex w-full justify-center overflow-hidden rounded-full bg-gradient-to-r from-purple-500 via-fuchsia-500 to-pink-500 px-7 py-3.5 text-sm font-semibold text-white shadow-[0_18px_42px_rgba(236,72,153,0.22)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_24px_52px_rgba(236,72,153,0.30)] active:scale-[0.985] sm:w-auto"
            >
              <div className="absolute inset-0 bg-[linear-gradient(120deg,transparent_0%,rgba(255,255,255,0.16)_40%,transparent_72%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <div className="relative flex items-center justify-center gap-2">
                <span className="text-[15px] font-bold tracking-[-0.01em]">Get ChangeLatch</span>
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
              </div>
            </button>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10 px-5 py-8 text-center text-sm font-medium tracking-[0.02em] text-[#94s3b8] sm:px-6">
        <div>© 2026 Think It Done.</div>
        <div className="mt-1">ChangeLatch is a product of Think It Done.</div>

        <div className="mt-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
          <a className="transition hover:text-[#0f172a]" href="/privacy">
            Privacy Policy
          </a>
          <a className="transition hover:text-[#0f172a]" href="/terms">
            Terms of Service
          </a>
          <a className="transition hover:text-[#0f172a]" href="/refund">
            Refund Policy
          </a>
          <a className="transition hover:text-[#0f172a]" href="/trust">
            Trust &amp; Security
          </a>
        </div>

        <div className="mt-3">
          Need help or have questions? Contact{" "}
          <a className="transition hover:text-[#0f172a]" href="mailto:support@thinkitdoneapp.com">
            support@thinkitdoneapp.com
          </a>
          .
        </div>
      </footer>
    </main>
  );
}
