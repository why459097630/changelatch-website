import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Pricing | ChangeLatch",
  description:
    "Get a ChangeLatch personal license for reviewing and safely applying AI-generated BEFORE/AFTER code patches locally.",
  alternates: {
    canonical: "/pricing",
  },
};

export default function PricingLayout({ children }: { children: ReactNode }) {
  return children;
}