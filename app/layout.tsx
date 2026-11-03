import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Fincelio — Your Numbers. Your Financial Clarity.",
  description: "Free online financial calculators for loans, savings, interest, investments and everyday money decisions.",
  metadataBase: new URL("https://fincelio.com")
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
