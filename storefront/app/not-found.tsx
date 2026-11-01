import { handleShopifyRedirects } from "@shopify/hydrogen";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

import { getStorefrontClient } from "@/lib/storefront";
import { routeTemplates } from "@/lib/route-templates";

export default async function NotFound() {
  await checkShopifyRedirect();

  return (
    <main className="mx-auto max-w-7xl px-5 py-24">
      <p className="font-heading text-sm font-bold uppercase tracking-widest text-brand">404</p>
      <h1 className="mt-2 font-heading text-4xl font-bold uppercase">Page not found</h1>
      <p className="mt-4 text-muted">We couldn&apos;t find that page or product.</p>
      <Link className="mt-8 inline-block rounded bg-brand px-6 py-3 font-heading font-bold uppercase text-white" href="/collections">
        Back to the shop
      </Link>
    </main>
  );
}

// After Next returns a 404, ask Shopify whether the URL has a redirect
// (admin, Storefront URL redirects). Runs only on 404s, never on every request.
async function checkShopifyRedirect() {
  const url = (await headers()).get("x-storefront-url");
  if (!url) return;

  const result = await handleShopifyRedirects({
    request: new Request(url),
    routeTemplates,
    storefrontClient: await getStorefrontClient(),
  });
  const location = result?.headers.get("location");
  if (location) redirect(location);
}
