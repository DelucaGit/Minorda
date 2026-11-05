import Link from "next/link";
import { Suspense } from "react";

import { searchProducts } from "@/app/lib/catalog";

export const metadata = {
  title: "Sök · Minorda",
};

export default function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  return (
    <Suspense
      fallback={<p className="px-6 py-16 text-[#707072]">Söker…</p>}
    >
      <SearchResults searchParams={searchParams} />
    </Suspense>
  );
}

async function SearchResults({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = q?.trim() ?? "";

  if (!query) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="font-display text-4xl font-bold uppercase">Sök</h1>
        <p className="mt-3 text-[#707072]">Skriv vad du letar efter.</p>
        <form action="/search" className="mt-6">
          <input
            name="q"
            type="search"
            placeholder="Sök utrustning..."
            className="w-full border border-[#111] px-4 py-3"
          />
        </form>
      </main>
    );
  }

  const result = await searchProducts(query).then(
    (products) => ({ ok: true as const, products }),
    (error: unknown) => ({
      ok: false as const,
      message: error instanceof Error ? error.message : String(error),
    }),
  );

  return (
    <main className="mx-auto max-w-[1440px] px-6 py-12">
      <h1 className="font-display text-4xl font-bold uppercase">
        Sökresultat
      </h1>
      <p className="mt-3 text-[#707072]">Visar träffar för “{query}”.</p>
      {!result.ok ? (
        <p className="mt-8">Sökningen gick inte att läsa: {result.message}</p>
      ) : result.products.length === 0 ? (
        <p className="mt-8">Inga produkter matchade sökningen.</p>
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
                <h2 className="font-display font-bold group-hover:text-[#0047ff]">
                  {product.title}
                </h2>
                <p className="font-display font-bold">{product.price}</p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
