import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://fincelio.com"),
  title: { default: "Fincelio — Your Numbers. Your Financial Clarity.", template: "%s | Fincelio" },
  description: "Free online business and ecommerce calculators for product costs, selling prices, profit margins, wholesale pricing and store performance.",
  alternates: { canonical: "/" },
  robots: { index: true, follow: true }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
