import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Astra Arcade",
  description: "A private, owner-curated browser game catalogue."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
