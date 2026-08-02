import type { Metadata } from "next";
import LegalPageShell from "@/components/legal/LegalPageShell";

export const metadata: Metadata = {
  title: "Terms of Service | ChangeLatch",
  description: "Terms of Service for using the ChangeLatch website and desktop software license service.",
};

export default function TermsPage() {
  return (
    <LegalPageShell
      badge="Terms"
      title="Terms of Service"
      description="These Terms govern your use of ChangeLatch, a software product developed and provided by Think It Done."
    >
      <div className="space-y-8 text-[15px] leading-[1.85] text-[#475569]">
        <section>
          <h2 className="text-xl font-bold tracking-[-0.02em] text-[#0f172a]">
            Service overview
          </h2>
          <p className="mt-3">
            ChangeLatch is a desktop software tool designed to help developers apply AI-generated code patches through a controlled workflow with matching checks, review steps, backups, build verification, history records, and rollback capabilities.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold tracking-[-0.02em] text-[#0f172a]">
            License
          </h2>
          <p className="mt-3">
            Each purchase grants a limited, non-exclusive, non-transferable license to use ChangeLatch according to the applicable license terms. License activation may be required to verify authorized use.
          </p>
          <p className="mt-3">
            You must not share, resell, distribute, bypass, modify, or attempt to reverse engineer license protection mechanisms.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold tracking-[-0.02em] text-[#0f172a]">
            User responsibilities
          </h2>
          <p className="mt-3">
            You are responsible for reviewing AI-generated PATCH instructions before applying changes to your projects. ChangeLatch provides tools for applying changes safely but does not guarantee that third-party AI-generated code will always be correct.
          </p>
          <p className="mt-3">
            You are responsible for maintaining backups, reviewing project changes, and ensuring that your use of the software complies with applicable laws and third-party service terms.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold tracking-[-0.02em] text-[#0f172a]">
            AI-generated content
          </h2>
          <p className="mt-3">
            ChangeLatch does not generate code itself. Users may use external AI services to create PATCH instructions. AI-generated changes should be reviewed before application.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold tracking-[-0.02em] text-[#0f172a]">
            Payments and licenses
          </h2>
          <p className="mt-3">
            Payments are processed through third-party payment providers. After successful payment, license information may be delivered through the email address provided during purchase.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold tracking-[-0.02em] text-[#0f172a]">
            Service changes
          </h2>
          <p className="mt-3">
            ChangeLatch may update, improve, limit, suspend, or discontinue parts of the service when needed for maintenance, security, product improvements, abuse prevention, or operational reasons.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold tracking-[-0.02em] text-[#0f172a]">
            Limitation of liability
          </h2>
          <p className="mt-3">
            To the fullest extent permitted by law, ChangeLatch is not responsible for indirect, incidental, special, consequential, or lost-profit damages arising from software use, AI-generated content, third-party services, project changes, or business outcomes.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold tracking-[-0.02em] text-[#0f172a]">
            Contact
          </h2>
          <p className="mt-3">
            For Terms of Service questions, contact{" "}
            <a className="font-semibold text-[#0f172a] underline underline-offset-4" href="mailto:support@thinkitdoneapp.com">
              support@thinkitdoneapp.com
            </a>
            .
          </p>
        </section>
      </div>
    </LegalPageShell>
  );
}