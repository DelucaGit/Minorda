"use client";

import type { ShopifyScriptsI18n, ShopifyScriptsShop } from "@shopify/hydrogen";
import { ShopifyScripts } from "@shopify/hydrogen/react";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";

import { CartProvider } from "@/lib/cart";
import type { cartHandlers } from "@/lib/cart-handlers";
import { routeTemplates } from "@/lib/route-templates";

type CartData = Awaited<ReturnType<typeof cartHandlers.get>>["data"];

// Resolved cart data (not a promise) so the server HTML already contains the
// cart and /cart paints its lines without JavaScript.
export function Providers({ cartData, children }: { cartData: CartData; children: ReactNode }) {
  return <CartProvider initialData={cartData}>{children}</CartProvider>;
}

// Shopify's runtime scripts (Standard Actions power the cart forms). Storefront
// analytics and WebMCP are off: analytics consent is out of scope for this build.
export function ShopifyRuntime({ shop, i18n }: { shop: ShopifyScriptsShop; i18n: ShopifyScriptsI18n }) {
  const router = useRouter();
  return (
    <ShopifyScripts
      shop={shop}
      i18n={i18n}
      routes={routeTemplates}
      shopifyAnalytics={false}
      webMcp={false}
      analytics={{ channel: "headless" }}
      navigate={(url) => router.push(url)}
    />
  );
}
