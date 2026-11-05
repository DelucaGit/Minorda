import Link from "next/link";
import { Suspense } from "react";

import { loadProducts } from "@/app/lib/catalog";

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
  const result = await loadProducts(16).then(
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
        Namn, bild och pris kommer från demokatalogen. Kategorierna i menyn
        leder hit tills butiken har egna kollektioner.
      </p>
      {!result.ok ? (
        <p className="mt-8">Katalogen gick inte att läsa: {result.message}</p>
      ) : (
        <ul className="mt-8 grid grid-cols-2 gap-6 lg:grid-cols-4">
          {result.products.map((product) => (
            <li key={product.id}>
              <Link href={`/products/${product.handle}`} className="group block">
                <div className="mb-3 aspect-square overflow-hidden rounded-xl bg-[#f5f5f5]">
                  {product.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={product.imageUrl}
                      alt={product.imageAlt}
                      className="h-full w-full object-cover"
                    />
                  ) : null}
                </div>
                <div className="flex items-start justify-between gap-3">
                  <h2 className="font-display font-bold group-hover:text-[#0047ff]">
                    {product.title}
                  </h2>
                  <p className="font-display shrink-0 font-bold">{product.price}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
