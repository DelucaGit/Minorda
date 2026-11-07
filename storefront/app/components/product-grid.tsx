"use client";

import Link from "next/link";

import { FavoriteButton } from "@/app/components/favorite-button";
import type { CatalogProduct } from "@/app/lib/catalog";

export function ProductGrid({ products }: { products: CatalogProduct[] }) {
  if (products.length === 0) {
    return <p className="mt-8 text-[#707072]">Inga produkter i den här listan.</p>;
  }

  return (
    <ul className="mt-8 grid grid-cols-2 gap-6 lg:grid-cols-4">
      {products.map((product) => (
        <li key={product.id} className="relative">
          <FavoriteButton
            handle={product.handle}
            className="absolute top-3 right-3 z-10"
          />
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
  );
}
