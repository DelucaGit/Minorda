import type { Metadata } from "next";
import { Chivo, Space_Grotesk } from "next/font/google";
import Link from "next/link";

import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const chivo = Chivo({
  variable: "--font-chivo",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Minorda",
    template: "%s | Minorda",
  },
  description: "Minorda performance apparel. Progress isn't linear.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${chivo.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-page text-ink">
        <Header
          cartLink={
            <Link href="/cart" className="rounded border border-line bg-slate-100 px-3 py-2 font-heading text-xs font-bold uppercase text-slate-900 hover:bg-slate-200">
              Cart
            </Link>
          }
        />
        {children}
        <Footer />
      </body>
    </html>
  );
}
