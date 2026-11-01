import type { Metadata } from "next";
import { Chivo, Space_Grotesk } from "next/font/google";

import { CartLink } from "@/components/CartLink";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Providers, ShopifyRuntime } from "@/components/Providers";
import { cartHandlers } from "@/lib/cart-handlers";
import { getShopifyScriptsConfig } from "@/lib/shop";
import { getStorefrontClient } from "@/lib/storefront";
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

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const storefrontClient = await getStorefrontClient();
  const [{ data: cartData }, scripts] = await Promise.all([
    cartHandlers.get({ storefrontClient }),
    getShopifyScriptsConfig(),
  ]);

  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${chivo.variable} h-full antialiased`}>
      <head>
        <ShopifyRuntime shop={scripts.shop} i18n={scripts.i18n} />
      </head>
      <body className="flex min-h-full flex-col bg-page text-ink">
        <Providers cartData={cartData}>
          <Header cartLink={<CartLink />} />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
