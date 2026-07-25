"use client";

import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Check,
  CheckCircle2,
  Copy,
  Download,
  RefreshCcw,
  TriangleAlert,
} from "lucide-react";
import SiteHeader from "@/components/layout/SiteHeader";

type CaptureLicenseOrderResponse = {
  ok: boolean;
  status?: "completed";
  licenseEmail?: string;
  licenseKey?: string;
  error?: string;
};

const RESULT_SUPPORT_MESSAGE = "We could not confirm your PayPal payment.";

export default function ResultPage() {
  const [licenseEmail, setLicenseEmail] = useState("");
  const [licenseKey, setLicenseKey] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copied, setCopied] = useState(false);

  const hasError = Boolean(error);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const paymentProvider = params.get("provider") || "";
    const paypalOrderId = params.get("token") || "";
    let cancelled = false;

    const captureLicenseOrder = async () => {
      try {
        if (paymentProvider !== "paypal" || !paypalOrderId) {
          throw new Error(RESULT_SUPPORT_MESSAGE);
        }

        const response = await fetch("/api/paypal/capture-license-order", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            paypalOrderId,
          }),
        });

        const data = (await response.json().catch(() => null)) as
          | CaptureLicenseOrderResponse
          | null;

        if (
          !response.ok ||
          !data?.ok ||
          data.status !== "completed" ||
          !data.licenseEmail ||
          !data.licenseKey
        ) {
          throw new Error(data?.error || RESULT_SUPPORT_MESSAGE);
        }

        if (cancelled) {
          return;
        }

        setLicenseEmail(data.licenseEmail);
        setLicenseKey(data.licenseKey);
        setError("");
      } catch {
        if (cancelled) {
          return;
        }

        setLicenseEmail("");
        setLicenseKey("");
        setError(RESULT_SUPPORT_MESSAGE);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void captureLicenseOrder();

    return () => {
      cancelled = true;
    };
  }, []);

  const handleCopyLicenseEmail = async () => {
    if (!licenseEmail) {
      return;
    }

    await navigator.clipboard.writeText(licenseEmail);
    setCopiedEmail(true);
    window.setTimeout(() => setCopiedEmail(false), 1800);
  };

  const handleCopyLicenseKey = async () => {
    if (!licenseKey) {
      return;
    }

    await navigator.clipboard.writeText(licenseKey);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  return (
    <main className="relative min-h-screen bg-[#f8fafc] text-[#0f172a]">
      <div className="fixed inset-0 -z-10 bg-[linear-gradient(135deg,#ffffff_0%,#f1f5f9_48%,#d7dde8_100%),radial-gradient(circle_at_top,rgba(99,102,241,0.18),transparent_38%)]" />

      <SiteHeader />

      <section className="relative z-10 mx-auto max-w-2xl px-6 py-16 text-center md:py-20">
        <div className="mb-6 flex justify-center">
          <div
            className={
              hasError
                ? "flex h-24 w-24 items-center justify-center rounded-full bg-white/65 shadow-[0_30px_80px_rgba(239,68,68,0.14)] backdrop-blur-xl"
                : "flex h-24 w-24 items-center justify-center rounded-full bg-white/65 shadow-[0_30px_80px_rgba(16,185,129,0.18)] backdrop-blur-xl"
            }
          >
            <div
              className={
                hasError
                  ? "flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-red-500 to-rose-400 text-white shadow-[0_28px_60px_rgba(239,68,68,0.20)] ring-8 ring-red-100/70"
                  : "flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-green-400 text-white shadow-[0_28px_60px_rgba(16,185,129,0.22)] ring-8 ring-emerald-100/70"
              }
            >
              {hasError ? (
                <TriangleAlert className="h-8 w-8" />
              ) : (
                <CheckCircle2 className="h-8 w-8" />
              )}
            </div>
          </div>
        </div>

        <h1 className="text-4xl font-extrabold tracking-[-0.05em] md:text-5xl">
          {hasError ? "Payment verification failed" : "Payment successful"}
        </h1>

        <p className="mt-3 text-lg text-[#64748b]">
          {hasError
            ? "We could not confirm your PayPal payment."
            : "Your PatchPilot license is ready."}
        </p>

        {!loading && !hasError ? (
          <p className="mt-2 text-sm text-slate-500">
            Save these details to activate PatchPilot.
          </p>
        ) : null}

        {loading ? (
          <div className="mt-8 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-500">
            Verifying your payment and preparing your license...
          </div>
        ) : null}

        {!loading && hasError ? (
          <div className="mt-8 text-center">
            <p className="text-sm font-medium leading-6 text-slate-600">
              Your license has not been created yet.
            </p>

            <div className="mx-auto mt-6 max-w-xl text-sm leading-6 text-slate-600">
              <p>Please retry verification or return to the pricing page.</p>
              <p>Contact support if the issue continues.</p>
            </div>

            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="flex h-[50px] items-center justify-center gap-2 rounded-[20px] border border-red-200 bg-red-50 px-5 text-sm font-semibold text-red-600 transition-all duration-300 hover:-translate-y-0.5 hover:border-red-300 hover:shadow-[0_14px_30px_rgba(239,68,68,0.12)] active:scale-[0.98]"
              >
                <RefreshCcw className="h-4 w-4" />
                <span>Retry verification</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  window.location.href = "/pricing";
                }}
                className="flex h-[50px] items-center justify-center gap-2 rounded-[20px] border border-slate-200 bg-white px-5 text-sm font-medium text-[#475569] transition-all duration-300 hover:-translate-y-0.5 hover:border-indigo-300 hover:text-indigo-600 hover:shadow-[0_14px_30px_rgba(15,23,42,0.08)] active:scale-[0.98]"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Pricing</span>
              </button>
            </div>

            <div className="mt-6 text-sm text-slate-500">
              Need help? Email{" "}
              <a
                className="font-semibold text-[#0f172a] underline underline-offset-4"
                href="mailto:support@thinkitdoneapp.com"
              >
                support@thinkitdoneapp.com
              </a>
            </div>
          </div>
        ) : null}

        {!loading && !hasError ? (
          <div className="mt-8 text-left">
            <div className="mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
              License details
            </div>

            <div className="relative overflow-hidden rounded-[26px] border border-slate-200/80 bg-[linear-gradient(135deg,rgba(255,255,255,0.94),rgba(248,250,252,0.84)_42%,rgba(245,243,255,0.76)_100%)] px-5 shadow-[0_24px_70px_rgba(99,102,241,0.10),0_0_42px_rgba(168,85,247,0.08)] backdrop-blur-xl md:px-6">
              <div className="pointer-events-none absolute -left-16 -top-20 h-48 w-48 rounded-full bg-sky-200/20 blur-3xl" />
              <div className="pointer-events-none absolute -right-20 bottom-0 h-48 w-48 rounded-full bg-violet-200/18 blur-3xl" />

              <div className="relative z-10 border-b border-slate-200/80 py-5">
                <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                  License email
                </div>
                <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <span className="break-all text-sm font-semibold text-[#0f172a]">
                    {licenseEmail || "License email unavailable"}
                  </span>
                  <button
                    type="button"
                    disabled={!licenseEmail}
                    onClick={handleCopyLicenseEmail}
                    className="inline-flex h-9 shrink-0 items-center justify-center gap-2 rounded-[13px] border border-slate-200 bg-white px-4 text-xs font-semibold text-slate-600 transition-all duration-300 hover:-translate-y-0.5 hover:border-fuchsia-300 hover:text-fuchsia-700 hover:shadow-[0_10px_24px_rgba(15,23,42,0.06)] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {copiedEmail ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                    <span>{copiedEmail ? "Copied" : "Copy"}</span>
                  </button>
                </div>
              </div>

              <div className="relative z-10 py-5">
                <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                  License Key
                </div>
                <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <code className="break-all text-sm font-semibold tracking-[0.08em] text-fuchsia-700">
                    {licenseKey || "License Key unavailable"}
                  </code>
                  <button
                    type="button"
                    disabled={!licenseKey}
                    onClick={handleCopyLicenseKey}
                    className="inline-flex h-9 shrink-0 items-center justify-center gap-2 rounded-[13px] border border-fuchsia-200 bg-white px-4 text-xs font-semibold text-fuchsia-700 transition-all duration-300 hover:-translate-y-0.5 hover:border-fuchsia-300 hover:bg-fuchsia-50 hover:shadow-[0_10px_24px_rgba(217,70,239,0.10)] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {copied ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                    <span>{copied ? "Copied" : "Copy"}</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="mb-3 mt-6 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
              Activate PatchPilot
            </div>

            <div className="relative grid overflow-hidden gap-5 rounded-[22px] border border-fuchsia-100/90 bg-[linear-gradient(135deg,rgba(255,255,255,0.94),rgba(253,244,255,0.70)_48%,rgba(255,241,242,0.56)_100%)] p-5 shadow-[0_24px_70px_rgba(217,70,239,0.10),0_0_42px_rgba(244,114,182,0.10)] backdrop-blur-xl sm:grid-cols-2 sm:gap-8">
              <div className="pointer-events-none absolute -left-16 bottom-0 h-40 w-40 rounded-full bg-rose-100/24 blur-3xl" />
              <div className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-fuchsia-200/20 blur-3xl" />
              <div className="pointer-events-none absolute bottom-5 left-1/2 top-5 hidden w-px -translate-x-1/2 bg-fuchsia-100/80 sm:block" />

              <div className="relative z-10 space-y-1 text-sm leading-6 text-slate-600">
                <p>Save your license email and License Key now.</p>
                <p>Open PatchPilot, enter both in the activation section, and activate your license.</p>
                <p>They may not be shown again after you leave this page.</p>
              </div>

              <div className="relative z-10">
                <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                  License benefits
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Your personal license includes:
                </p>

                <div className="mt-3 space-y-3">
                  <div className="flex items-center gap-2.5 text-sm text-slate-600">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
                    <span>One-time purchase</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-sm text-slate-600">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
                    <span>Use on up to 2 devices</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-sm text-slate-600">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
                    <span>No recurring subscription</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-7">
              <div className="grid gap-3 sm:grid-cols-2">
                <a
                  href="/downloads/PatchPilot-Setup.exe"
                  download
                  className="group flex h-[54px] w-full items-center justify-center gap-2 rounded-[20px] bg-gradient-to-r from-purple-500 via-fuchsia-500 to-pink-500 px-6 text-sm font-semibold text-white shadow-[0_28px_60px_rgba(236,72,153,0.28)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_35px_80px_rgba(236,72,153,0.40)] active:scale-[0.97]"
                >
                  <Download className="h-4 w-4" />
                  <span>Download PatchPilot</span>
                </a>

                <button
                  type="button"
                  onClick={() => {
                    window.location.href = "/";
                  }}
                  className="flex h-[54px] w-full items-center justify-center gap-2 rounded-[20px] border border-slate-200 bg-white px-5 text-sm font-medium text-[#475569] shadow-[0_8px_20px_rgba(15,23,42,0.03)] transition-all duration-300 hover:-translate-y-0.5 hover:border-indigo-300 hover:text-indigo-600 hover:shadow-[0_14px_30px_rgba(15,23,42,0.08)] active:scale-[0.98]"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Back to Home</span>
                </button>
              </div>

              <p className="mt-3 text-center text-xs font-medium text-slate-400">
                Windows Desktop App · v1.0.0
              </p>
            </div>

            <div className="mt-6 text-center text-xs text-slate-500">
              Need help? Email{" "}
              <a
                className="font-semibold text-[#0f172a] underline underline-offset-4"
                href="mailto:support@thinkitdoneapp.com"
              >
                support@thinkitdoneapp.com
              </a>
            </div>
          </div>
        ) : null}
      </section>
    </main>
  );
}
