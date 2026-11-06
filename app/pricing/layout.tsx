import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Pricing | ChangeLatch",
  description:
    "Get a ChangeLatch personal license to review, apply, and verify AI-generated PATCH changes with optional GitHub syncing.",
  alternates: {
    canonical: "/pricing",
  },
};

export default function PricingLayout({ children }: { children: ReactNode }) {
  return children;
}