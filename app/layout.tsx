import type { Metadata } from "next";
import { Suspense } from "react";
import "./globals.css";
import PageViewTracker from "@/components/analytics/PageViewTracker";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.thinkitdoneapp.com"),
  title: "ChangeLatch – Review & Apply AI Code Patches Safely",
  description:
    "ChangeLatch is a local Windows tool for reviewing and safely applying AI-generated BEFORE/AFTER code patches with exact matching, backups, build verification, and rollback.",
  applicationName: "ChangeLatch",
  creator: "Think It Done",
  publisher: "Think It Done",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "ChangeLatch",
    title: "ChangeLatch – Review & Apply AI Code Patches Safely",
    description:
      "Review AI-generated code patches before applying them locally with exact matching, backups, build verification, and rollback.",
  },
  twitter: {
    card: "summary",
    title: "ChangeLatch – Review & Apply AI Code Patches Safely",
    description:
      "Review and safely apply AI-generated BEFORE/AFTER code patches locally with ChangeLatch.",
  },
};

export default function RootLayout({children}:{children:React.ReactNode}) {
  return (
    <html lang="en">
      <body>
        <Suspense fallback={null}>
          <PageViewTracker />
        </Suspense>
        {children}
      </body>
    </html>
  );
}
