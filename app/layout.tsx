import type { Metadata } from "next";
import { Suspense } from "react";
import "./globals.css";
import PageViewTracker from "@/components/analytics/PageViewTracker";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.thinkitdoneapp.com"),
  title: "ChangeLatch – Review, Apply & Verify AI Code Patches",
  description:
    "Apply AI-generated PATCH changes locally with exact matching, diff review, project verification, backups, guarded rollback, and optional GitHub syncing.",
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
    title: "ChangeLatch – Review, Apply & Verify AI Code Patches",
    description:
      "Review AI-generated code patches with exact matching, project checks, backups, guarded rollback, and optional GitHub syncing.",
  },
  twitter: {
    card: "summary",
    title: "ChangeLatch – Review, Apply & Verify AI Code Patches",
    description:
      "Review, apply, and verify AI-generated PATCH changes locally with ChangeLatch.",
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
