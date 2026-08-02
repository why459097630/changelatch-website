import type { Metadata } from "next";
import LegalPageShell from "@/components/legal/LegalPageShell";

export const metadata: Metadata = {
  title: "Trust & Security | ChangeLatch",
  description: "How ChangeLatch handles software security, license protection, project safety, and user data.",
};

export default function TrustPage() {
  return (
    <LegalPageShell
      badge="Trust"
      title="Trust & Security"
      description="ChangeLatch is designed to help developers apply AI-generated code changes through a controlled workflow with safety checks, backups, and rollback support."
    >
      <div className="space-y-8 text-[15px] leading-[1.85] text-[#475569]">
        <section>
          <h2 className="text-xl font-bold tracking-[-0.02em] text-[#0f172a]">
            Controlled code change workflow
          </h2>
          <p className="mt-3">
            ChangeLatch applies AI-generated PATCH instructions through a structured workflow. Changes are matched against project files before replacement, helping prevent unintended modifications.
          </p>
          <p className="mt-3">
            ChangeLatch does not automatically rewrite your project or make independent coding decisions. Users review and apply generated PATCH changes through the application workflow.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold tracking-[-0.02em] text-[#0f172a]">
            Project safety
          </h2>
          <p className="mt-3">
            Before applying changes, ChangeLatch creates backups and keeps change history records so users can review previous states and restore earlier versions when needed.
          </p>
          <p className="mt-3">
            Users remain responsible for reviewing AI-generated changes and maintaining appropriate backups of their own projects.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold tracking-[-0.02em] text-[#0f172a]">
            License protection
          </h2>
          <p className="mt-3">
            ChangeLatch uses license activation and device verification to help protect purchased software access and prevent unauthorized sharing.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold tracking-[-0.02em] text-[#0f172a]">
            Data handling
          </h2>
          <p className="mt-3">
            ChangeLatch is designed as a local desktop workflow tool. Project files are processed according to the application's workflow and are not used to train AI models.
          </p>
          <p className="mt-3">
            Payment and account-related information may be handled by third-party service providers required for licensing and payment processing.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold tracking-[-0.02em] text-[#0f172a]">
            Support
          </h2>
          <p className="mt-3">
            For security questions, license issues, payment problems, or technical support, contact{" "}
            <a className="font-semibold text-[#0f172a] underline underline-offset-4" href="mailto:support@thinkitdoneapp.com">
              support@thinkitdoneapp.com
            </a>
            .
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold tracking-[-0.02em] text-[#0f172a]">
            Independent developer notice
          </h2>
          <p className="mt-3">
            ChangeLatch is developed and maintained by Think It Done, an independent software publisher. The product is continuously improved based on developer feedback, testing, and practical usage scenarios.
          </p>
        </section>
      </div>
    </LegalPageShell>
  );
}