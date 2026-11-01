import { getSelectedProductOptions } from "@shopify/hydrogen";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";

import { ProductDetails } from "@/components/product/ProductDetails";
import { PRODUCT_QUERY } from "@/lib/product-query";
import { toURLSearchParams, type SearchParamsInput } from "@/lib/search-params";
import { getStorefrontClient } from "@/lib/storefront";

type Props = {
  params: Promise<{ handle: string }>;
  searchParams: Promise<SearchParamsInput>;
};

const loadProduct = cache(async (handle: string, search: string) => {
  const selectedOptions = getSelectedProductOptions({
    searchParams: new URLSearchParams(search),
  });
  const storefront = await getStorefrontClient();
  const { data, errors } = await storefront.graphql(PRODUCT_QUERY, {
    variables: { handle, selectedOptions },
  });

  // GraphQL errors are a server failure (500), not a missing product.
  if (errors) {
    console.error("[hydrogen] Product query failed", errors);
    throw new Error("Product query failed");
  }
  return data?.product ?? null;
});

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { handle } = await params;
  const product = await loadProduct(handle, toURLSearchParams(await searchParams).toString());
  if (!product) return { title: "Product not found" };
  return { title: product.title, description: product.description.slice(0, 160) };
}

export default async function ProductPage({ params, searchParams }: Props) {
  const { handle } = await params;
  const product = await loadProduct(handle, toURLSearchParams(await searchParams).toString());
  if (!product) notFound();

  return (
    <main className="mx-auto w-full max-w-7xl px-5 py-10">
      <ProductDetails product={product} />
    </main>
  );
}
