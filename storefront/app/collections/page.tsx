import { Suspense } from "react";

import { CatalogMenu } from "@/app/components/catalog-menu";
import { ProductGrid } from "@/app/components/product-grid";
import { loadCatalogProducts, usesShopifyCatalog } from "@/app/lib/catalog";

export const metadata = {
  title: "Handla · Minorda",
};

export default function CollectionsPage() {
  return (
    <Suspense
      fallback={<p className="px-6 py-16 text-[#707072]">Hämtar produkterna…</p>}
    >
      <CollectionGrid />
    </Suspense>
  );
}

async function CollectionGrid() {
  const result = await loadCatalogProducts().then(
    (products) => ({ ok: true as const, products }),
    (error: unknown) => ({
      ok: false as const,
      message: error instanceof Error ? error.message : String(error),
    }),
  );

  return (
    <main className="mx-auto max-w-[1440px] px-6 py-12">
      <h1 className="font-display text-4xl font-bold tracking-tight uppercase">
        Alla produkter
      </h1>
      <p className="mt-3 max-w-2xl text-[#707072]">
        {usesShopifyCatalog()
          ? "Namn, bild och pris kommer från Shopify."
          : result.ok
            ? `${result.products.length} produkter i den tillfälliga listan. I produktion hämtas de från Shopify.`
            : "Listan gick inte att läsa."}
      </p>
      <CatalogMenu />
      {!result.ok ? (
        <p className="mt-8">Katalogen gick inte att läsa: {result.message}</p>
      ) : (
        <ProductGrid products={result.products} />
      )}
    </main>
  );
}
