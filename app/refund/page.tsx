import type { Metadata } from "next";
import LegalPageShell from "@/components/legal/LegalPageShell";

export const metadata: Metadata = {
  title: "Refund Policy | ChangeLatch",
  description: "Refund Policy for ChangeLatch software licenses and digital purchases.",
};

export default function RefundPage() {
  return (
    <LegalPageShell
      badge="Refund"
      title="Refund Policy"
      description="Think It Done provides licenses for the ChangeLatch desktop software. This Refund Policy explains refund conditions for digital purchases and payment issues."
    >
      <div className="space-y-8 text-[15px] leading-[1.85] text-[#475569]">
        <section>
          <h2 className="text-xl font-bold tracking-[-0.02em] text-[#0f172a]">
            Digital software purchases
          </h2>
          <p className="mt-3">
            ChangeLatch is a digital software product. Because license information and digital access may be delivered immediately after purchase, completed purchases are generally non-refundable after successful license delivery.
          </p>
          <p className="mt-3">
            If you experience a technical issue that prevents normal use of the software, contact support so the issue can be reviewed.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold tracking-[-0.02em] text-[#0f172a]">
            Eligible refund requests
          </h2>
          <p className="mt-3">
            Refund requests may be considered for cases such as duplicate payments, accidental duplicate purchases, payment processing errors, or confirmed technical problems that cannot be resolved.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold tracking-[-0.02em] text-[#0f172a]">
            License activation issues
          </h2>
          <p className="mt-3">
            If you cannot activate your ChangeLatch license after purchase, contact support with the email address used during payment and relevant purchase information. We will review the issue and provide assistance.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold tracking-[-0.02em] text-[#0f172a]">
            Refund request information
          </h2>
          <p className="mt-3">
            Please include your purchase email, payment date, payment provider, order information if available, and a description of the problem when submitting a refund request.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold tracking-[-0.02em] text-[#0f172a]">
            Contact
          </h2>
          <p className="mt-3">
            Send refund and billing questions to{" "}
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