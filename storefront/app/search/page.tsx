import { parseCollectionParams, type AvailableFilter } from "@shopify/hydrogen";
import type { ProductFilter as StorefrontApiProductFilter } from "@shopify/hydrogen/storefront-api-types";
import type { Metadata } from "next";

import { CollectionBrowser } from "@/components/collection/CollectionBrowser";
import { SEARCH_QUERY, PAGE_SIZE } from "@/lib/catalog-queries";
import type { ProductCardData } from "@/lib/product-card";
import { toURLSearchParams, type SearchParamsInput } from "@/lib/search-params";
import { getStorefrontClient } from "@/lib/storefront";

export const metadata: Metadata = { title: "Search" };

export default async function SearchPage({ searchParams }: { searchParams: Promise<SearchParamsInput> }) {
  const urlSearch = toURLSearchParams(await searchParams);
  const term = (urlSearch.get("q") ?? "").trim();

  let products: ProductCardData[] = [];
  let availableFilters: AvailableFilter[] = [];
  let currencyCode = "USD" as const as ProductCardData["priceRange"]["minVariantPrice"]["currencyCode"];
  let totalCount = 0;
  let endCursor: string | null = null;
  let hasNextPage = false;

  // Empty search: no Storefront API call, just the empty state.
  if (term) {
    const browse = parseCollectionParams(urlSearch);
    const sortKey = browse.sortKey === "PRICE" ? "PRICE" : "RELEVANCE";
    const storefront = await getStorefrontClient();
    const { data, errors } = await storefront.graphql(SEARCH_QUERY, {
      variables: {
        term,
        first: PAGE_SIZE,
        after: urlSearch.get("after") || undefined,
        filters: browse.filters.length > 0 ? (browse.filters as StorefrontApiProductFilter[]) : undefined,
        sortKey,
        reverse: sortKey === "PRICE" ? browse.reverse || undefined : undefined,
      },
    });
    if (errors) {
      console.error("[hydrogen] Search query failed", errors);
      throw new Error("Search query failed");
    }
    if (data) {
      products = data.search.nodes.flatMap((node) => (node.__typename === "Product" ? [node] : []));
      availableFilters = data.search.productFilters as AvailableFilter[];
      currencyCode = data.shop.paymentSettings.currencyCode;
      totalCount = data.search.totalCount;
      endCursor = data.search.pageInfo.endCursor ?? null;
      hasNextPage = data.search.pageInfo.hasNextPage;
    }
  }

  return (
    <main className="mx-auto w-full max-w-7xl px-5 py-12">
      <div className="mb-8 space-y-4">
        <span className="font-heading text-sm font-bold uppercase tracking-[0.08em] text-brand">Search</span>
        <h1 className="font-heading text-4xl font-bold uppercase tracking-tight text-slate-950">
          {term ? `Results for “${term}”` : "Search the shop"}
        </h1>
        <form action="/search" method="get" role="search" className="flex max-w-xl gap-2">
          <label htmlFor="search-page-input" className="sr-only">Search products</label>
          <input
            key={term}
            id="search-page-input"
            name="q"
            type="search"
            defaultValue={term}
            placeholder="Leggings, tees, shorts…"
            className="flex-1 rounded border border-line px-3 py-2"
          />
          <button type="submit" className="rounded bg-brand px-5 py-2 font-heading font-bold uppercase text-white">Search</button>
        </form>
      </div>
      {term ? (
        <CollectionBrowser
          mode="search"
          term={term}
          products={products}
          availableFilters={availableFilters}
          currencyCode={currencyCode}
          dataSearch={urlSearch.toString()}
          endCursor={endCursor}
          hasNextPage={hasNextPage}
          header={<p className="text-sm text-muted">{totalCount} {totalCount === 1 ? "product" : "products"}</p>}
        />
      ) : (
        <p className="rounded-lg border border-dashed border-line p-10 text-center text-muted">
          Type a word above to search the catalog.
        </p>
      )}
    </main>
  );
}
