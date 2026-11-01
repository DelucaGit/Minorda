import { parseCollectionParams, type AvailableFilter } from "@shopify/hydrogen";
import type { ProductFilter as StorefrontApiProductFilter } from "@shopify/hydrogen/storefront-api-types";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";

import { CollectionBrowser } from "@/components/collection/CollectionBrowser";
import { COLLECTION_QUERY, PAGE_SIZE } from "@/lib/catalog-queries";
import { toURLSearchParams, type SearchParamsInput } from "@/lib/search-params";
import { getStorefrontClient } from "@/lib/storefront";

type Props = {
  params: Promise<{ handle: string }>;
  searchParams: Promise<SearchParamsInput>;
};

const loadCollection = cache(async (handle: string, search: string) => {
  const urlSearch = new URLSearchParams(search);
  const browse = parseCollectionParams(urlSearch);
  const after = urlSearch.get("after") || undefined;
  const storefront = await getStorefrontClient();
  const { data, errors } = await storefront.graphql(COLLECTION_QUERY, {
    variables: {
      handle,
      first: PAGE_SIZE,
      after,
      filters: browse.filters.length > 0 ? (browse.filters as StorefrontApiProductFilter[]) : undefined,
      sortKey: browse.sortKey,
      reverse: browse.reverse || undefined,
    },
  });
  if (errors) {
    console.error("[hydrogen] Collection query failed", errors);
    throw new Error("Collection query failed");
  }
  return data ?? null;
});

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { handle } = await params;
  const data = await loadCollection(handle, toURLSearchParams(await searchParams).toString());
  return { title: data?.collection?.title ?? "Collection not found" };
}

export default async function CollectionPage({ params, searchParams }: Props) {
  const { handle } = await params;
  const urlSearch = toURLSearchParams(await searchParams);
  const data = await loadCollection(handle, urlSearch.toString());
  const collection = data?.collection;
  if (!data || !collection) notFound();

  return (
    <main className="mx-auto w-full max-w-7xl px-5 py-12">
      <CollectionBrowser
        mode="collection"
        handle={collection.handle}
        products={collection.products.nodes}
        availableFilters={collection.products.filters as AvailableFilter[]}
        currencyCode={data.shop.paymentSettings.currencyCode}
        dataSearch={urlSearch.toString()}
        endCursor={collection.products.pageInfo.endCursor ?? null}
        hasNextPage={collection.products.pageInfo.hasNextPage}
        header={
          <div className="space-y-2">
            <span className="font-heading text-sm font-bold uppercase tracking-[0.08em] text-brand">Collection</span>
            <h1 className="font-heading text-4xl font-bold uppercase tracking-tight text-slate-950">{collection.title}</h1>
            {collection.description ? <p className="max-w-2xl text-muted">{collection.description}</p> : null}
          </div>
        }
      />
    </main>
  );
}
