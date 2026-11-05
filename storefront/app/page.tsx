import { Suspense } from "react";

import { HomeStorefront } from "@/app/components/home-storefront";
import { loadProducts } from "@/app/lib/catalog";

export const metadata = {
  title: "Minorda",
  description: "Progress isn't linear. Rise is never flat.",
};

export default function HomePage() {
  return (
    <Suspense
      fallback={<p className="px-6 py-16 text-[#707072]">Hämtar produkterna…</p>}
    >
      <HomeProducts />
    </Suspense>
  );
}

async function HomeProducts() {
  const result = await loadProducts(8).then(
    (products) => ({ ok: true as const, products }),
    (error: unknown) => ({
      ok: false as const,
      message: error instanceof Error ? error.message : String(error),
    }),
  );

  if (!result.ok) {
    return (
      <p className="px-6 py-16">
        Katalogen gick inte att läsa: {result.message}
      </p>
    );
  }

  return <HomeStorefront products={result.products} />;
}
