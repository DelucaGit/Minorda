import Link from "next/link";
import { Suspense } from "react";

import { ProductActions } from "@/app/components/product-actions";
import { loadStorefrontProduct, usesShopifyCatalog } from "@/app/lib/catalog";

export default function ProductPage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  return (
    <Suspense
      fallback={<p className="px-6 py-16 text-[#707072]">Hämtar produkten…</p>}
    >
      <ProductDetails params={params} />
    </Suspense>
  );
}

async function ProductDetails({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;
  const result = await loadStorefrontProduct(handle).then(
    (product) => ({ ok: true as const, product }),
    (error: unknown) => ({
      ok: false as const,
      message: error instanceof Error ? error.message : String(error),
    }),
  );

  if (!result.ok) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-16">
        <p>Katalogen gick inte att läsa: {result.message}</p>
      </main>
    );
  }

  if (!result.product) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="font-display text-3xl font-bold uppercase">
          Produkten finns inte
        </h1>
        <p className="mt-3 text-[#707072]">
          Den här adressen matchar ingen produkt i katalogen.
        </p>
        <Link href="/collections" className="mt-6 inline-block font-bold text-[#0047ff]">
          Tillbaka till alla produkter
        </Link>
      </main>
    );
  }

  const product = result.product;

  return (
    <main className="mx-auto grid max-w-[1440px] gap-10 px-6 py-12 md:grid-cols-2">
      <div className="overflow-hidden rounded-xl bg-[#f5f5f5]">
        {product.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.imageUrl}
            alt={product.imageAlt}
            className="h-full w-full object-cover"
          />
        ) : null}
      </div>
      <div>
        {product.collectionHandle ? (
          <Link
            href={`/collections/${product.collectionHandle}`}
            className="font-display text-[12px] font-bold tracking-widest text-[#0047ff] uppercase"
          >
            {product.collectionTitle}
          </Link>
        ) : (
          <p className="font-display text-[12px] font-bold tracking-widest text-[#0047ff] uppercase">
            Minorda
          </p>
        )}
        <h1 className="font-display mt-2 text-4xl font-bold uppercase">
          {product.title}
        </h1>
        <p className="font-display mt-4 text-2xl font-bold text-[#0047ff]">
          {product.price}
        </p>
        {product.description ? (
          <p className="mt-6 max-w-xl text-[16px] leading-7 text-[#707072]">
            {product.description}
          </p>
        ) : null}
        {usesShopifyCatalog() ? (
          <p className="mt-8 text-sm text-[#707072]">
            Storlek och lägg i varukorg kopplas till Shopify när butiken är i produktion.
          </p>
        ) : (
          <ProductActions handle={product.handle} sizes={product.sizes ?? ["M"]} />
        )}
      </div>
    </main>
  );
}
