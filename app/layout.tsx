import { Suspense } from "react";
import "./globals.css";
import PageViewTracker from "@/components/analytics/PageViewTracker";

export const metadata = {
  title: "ChangeLatch",
  description: "Review AI changes. Apply safely.",
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
