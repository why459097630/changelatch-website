import "./globals.css";

export const metadata = {
  title: "Code Replace Tool",
  description: "AI coding workflow tool",
};

export default function RootLayout({children}:{children:React.ReactNode}) {
  return <html lang="en"><body>{children}</body></html>;
}
