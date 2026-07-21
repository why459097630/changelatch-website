import type { Metadata } from "next";
import LegalPageShell from "@/components/legal/LegalPageShell";

export const metadata: Metadata = {
  title: "Privacy Policy | PatchPilot",
  description: "Privacy Policy for the PatchPilot website and desktop software license service.",
};

export default function PrivacyPage() {
  return (
    <LegalPageShell
      badge="Privacy"
      title="Privacy Policy"
      description="This Privacy Policy explains how PatchPilot handles information related to website usage, software licensing, payments, support requests, and account management."
    >
      <div className="space-y-8 text-[15px] leading-[1.85] text-[#475569]">
        <section>
          <h2 className="text-xl font-bold tracking-[-0.02em] text-[#0f172a]">
            Information we collect
          </h2>
          <p className="mt-3">
            We may collect email addresses, license information, purchase status, device activation information, support messages, and technical information needed to operate the service, provide licensing, maintain security, and improve product reliability.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold tracking-[-0.02em] text-[#0f172a]">
            How we use information
          </h2>
          <p className="mt-3">
            We use collected information to process purchases, deliver and manage licenses, provide customer support, verify activation status, prevent abuse, maintain security, troubleshoot issues, and improve PatchPilot.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold tracking-[-0.02em] text-[#0f172a]">
            Payment information
          </h2>
          <p className="mt-3">
            Payments may be processed by third-party payment providers. PatchPilot does not store complete payment card details. Payment providers process payment information according to their own privacy policies and security practices.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold tracking-[-0.02em] text-[#0f172a]">
            Project files and source code
          </h2>
          <p className="mt-3">
            PatchPilot processes project files locally on your device. We do not upload, store, or access your source code through our servers as part of the code patching workflow.
          </p>
          <p className="mt-3">
            Users may choose to provide project files directly to external AI services such as ChatGPT or Claude according to their own usage decisions and the policies of those services.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold tracking-[-0.02em] text-[#0f172a]">
            License and device information
          </h2>
          <p className="mt-3">
            To activate and manage licenses, we may store license key information, activation status, and device identification information required for license management.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold tracking-[-0.02em] text-[#0f172a]">
            Data sharing
          </h2>
          <p className="mt-3">
            We do not sell personal information. Limited information may be shared with service providers when required for payment processing, hosting, email delivery, analytics, security, customer support, or other necessary service operations.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold tracking-[-0.02em] text-[#0f172a]">
            Data retention
          </h2>
          <p className="mt-3">
            We retain information only as long as necessary to provide services, manage licenses, comply with legal obligations, resolve disputes, prevent abuse, and maintain business records.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold tracking-[-0.02em] text-[#0f172a]">
            Contact
          </h2>
          <p className="mt-3">
            For privacy questions, contact{" "}
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