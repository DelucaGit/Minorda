import Link from "next/link";
import { Suspense } from "react";

import { CatalogMenu } from "@/app/components/catalog-menu";
import { ProductGrid } from "@/app/components/product-grid";
import { loadCatalogProducts, usesShopifyCatalog } from "@/app/lib/catalog";
import { productsForHandle, titleForHandle } from "@/app/lib/catalog-nav";

export default function CollectionPage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  return (
    <Suspense
      fallback={<p className="px-6 py-16 text-[#707072]">Hämtar produkterna…</p>}
    >
      <CollectionDetails params={params} />
    </Suspense>
  );
}

async function CollectionDetails({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;
  const title = titleForHandle(handle);

  if (!title) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="font-display text-3xl font-bold uppercase">
          Kollektionen finns inte
        </h1>
        <Link href="/collections" className="mt-6 inline-block font-bold text-[#0047ff]">
          Till alla produkter
        </Link>
      </main>
    );
  }

  const result = await loadCatalogProducts().then(
    (products) => ({ ok: true as const, products }),
    (error: unknown) => ({
      ok: false as const,
      message: error instanceof Error ? error.message : String(error),
    }),
  );

  const products = result.ok ? productsForHandle(result.products, handle) ?? [] : [];

  return (
    <main className="mx-auto max-w-[1440px] px-6 py-12">
      <h1 className="font-display text-4xl font-bold tracking-tight uppercase">
        {title}
      </h1>
      <p className="mt-3 max-w-2xl text-[#707072]">
        {usesShopifyCatalog()
          ? "I produktion kommer den här sidan att följa Shopifys kollektioner."
          : `${products.length} produkter i den här listan.`}
      </p>
      <CatalogMenu current={handle} />
      {!result.ok ? (
        <p className="mt-8">Katalogen gick inte att läsa: {result.message}</p>
      ) : (
        <ProductGrid products={products} />
      )}
    </main>
  );
}
