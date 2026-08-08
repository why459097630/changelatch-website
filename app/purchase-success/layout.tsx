import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  alternates: {
    canonical: "/purchase-success",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function PurchaseSuccessLayout({ children }: { children: ReactNode }) {
  return children;
}