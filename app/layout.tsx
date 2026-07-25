import { Suspense } from "react";
import "./globals.css";
import PageViewTracker from "@/components/analytics/PageViewTracker";

export const metadata = {
  title: "PatchPilot",
  description: "Safer, faster AI-assisted code patching",
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
