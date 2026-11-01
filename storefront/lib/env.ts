// Server-only access to the store connection. Client components never import
// this module; they reach Shopify through Hydrogen's same-origin handlers.
export const storeDomain = process.env.NEXT_PUBLIC_STORE_DOMAIN ?? "";

// Leave undefined for tokenless access (mock.shop). An empty string is rejected
// by the Storefront client, so treat "" as "not set".
export const publicStorefrontToken =
  process.env.NEXT_PUBLIC_STOREFRONT_API_TOKEN || undefined;

export const i18n = { country: "US", language: "EN" } as const;

export const LOCALE = "en-US";

if (!storeDomain) {
  throw new Error("NEXT_PUBLIC_STORE_DOMAIN is not set. Copy .env.example to .env.");
}
