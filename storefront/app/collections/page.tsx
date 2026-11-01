import type { Metadata } from "next";
import Link from "next/link";

import { ProductCard } from "@/components/ProductCard";
import { ALL_PRODUCTS_QUERY, PAGE_SIZE } from "@/lib/catalog-queries";
import { shopifyImageUrl } from "@/lib/image";
import type { SearchParamsInput } from "@/lib/search-params";
import { staticStorefrontClient } from "@/lib/storefront-static";

export const metadata: Metadata = { title: "Shop all" };

export default async function CollectionsPage({ searchParams }: { searchParams: Promise<SearchParamsInput> }) {
  const { after } = await searchParams;
  const cursor = typeof after === "string" && after ? after : undefined;

  const { data, errors } = await staticStorefrontClient.graphql(ALL_PRODUCTS_QUERY, {
    variables: { first: PAGE_SIZE, after: cursor },
  });
  if (errors) {
    console.error("[hydrogen] Collections query failed", errors);
    throw new Error("Collections query failed");
  }

  const collections = data?.collections.nodes ?? [];
  const products = data?.products.nodes ?? [];
  const pageInfo = data?.products.pageInfo;

  return (
    <main className="mx-auto w-full max-w-7xl px-5 py-12">
      <span className="font-heading text-sm font-bold uppercase tracking-[0.08em] text-brand">Shop</span>
      <h1 className="font-heading text-4xl font-bold uppercase tracking-tight text-slate-950 lg:text-5xl">Shop all</h1>

      {collections.length > 0 ? (
        <section className="mt-8" aria-labelledby="collections-heading">
          <h2 id="collections-heading" className="mb-4 font-heading text-xl font-bold uppercase">Collections</h2>
          <ul className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {collections.map((collection) => (
              <li key={collection.id}>
                <Link href={`/collections/${collection.handle}`} className="group block overflow-hidden rounded-lg border border-line bg-white hover:border-brand">
                  <div className="aspect-[4/3] overflow-hidden bg-slate-100">
                    {collection.image ? (
                      // eslint-disable-next-line @next/next/no-img-element -- Hydrogen image skill: plain <img> with Shopify CDN sizing params
                      <img
                        src={shopifyImageUrl(collection.image.url, { width: 600, height: 450, crop: "center" })}
                        alt={collection.image.altText ?? collection.title}
                        width={600}
                        height={450}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : null}
                  </div>
                  <p className="p-3 font-heading text-sm font-bold uppercase group-hover:text-brand">{collection.title}</p>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="mt-12" aria-labelledby="products-heading">
        <h2 id="products-heading" className="mb-4 font-heading text-xl font-bold uppercase">All products</h2>
        {products.length > 0 ? (
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => (
              <li key={product.id} className="flex">
                <ProductCard product={product} />
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-muted">No products yet.</p>
        )}
        <div className="mt-8 flex gap-4">
          {cursor ? (
            <Link href="/collections" className="rounded border-2 border-slate-900 px-5 py-3 font-heading text-sm font-bold uppercase">← First page</Link>
          ) : null}
          {pageInfo?.hasNextPage && pageInfo.endCursor ? (
            <Link href={`/collections?after=${encodeURIComponent(pageInfo.endCursor)}`} className="rounded bg-ink px-5 py-3 font-heading text-sm font-bold uppercase text-white">
              Next page →
            </Link>
          ) : null}
        </div>
      </section>
    </main>
  );
}
