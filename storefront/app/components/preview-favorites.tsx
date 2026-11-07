"use client";

import { ProductGrid } from "@/app/components/product-grid";
import { usePreviewShop } from "@/app/components/preview-shop";
import { mockWrestlingProducts } from "@/app/lib/mock-products";

export function PreviewFavorites() {
  const shop = usePreviewShop();
  const products = mockWrestlingProducts.filter((product) =>
    shop.favorites.includes(product.handle),
  );

  return (
    <main className="mx-auto max-w-[1440px] px-6 py-12">
      <h1 className="font-display text-4xl font-bold uppercase">Favoriter</h1>
      <p className="mt-3 max-w-2xl text-[#707072]">
        Sparat i den här webbläsaren. Shopify har ingen favoritlista kopplad än.
      </p>
      <ProductGrid products={products} />
    </main>
  );
}
