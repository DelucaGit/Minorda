import Link from "next/link";

import { shopifyImageUrl, srcSetFor } from "@/lib/image";
import { formatPriceRange } from "@/lib/money";
import type { ProductCardData } from "@/lib/product-card";

export function ProductCard({ product }: { product: ProductCardData }) {
  const image = product.featuredImage;
  const { minVariantPrice, maxVariantPrice } = product.priceRange;

  return (
    <Link
      href={`/products/${product.handle}`}
      className="group flex flex-col overflow-hidden rounded-lg border border-line bg-white shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="relative aspect-square overflow-hidden border-b border-line bg-slate-50">
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element -- Hydrogen image skill: plain <img> with Shopify CDN sizing params
          <img
            src={shopifyImageUrl(image.url, { width: 600, height: 600, crop: "center" })}
            srcSet={srcSetFor(image.url, { width: 600, height: 600, crop: "center" })}
            alt={image.altText ?? product.title}
            width={600}
            height={600}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : null}
      </div>
      <div className="flex flex-1 items-start justify-between gap-3 p-4">
        <div>
          {product.productType ? (
            <span className="block font-heading text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
              {product.productType}
            </span>
          ) : null}
          <h3 className="font-heading text-base font-bold uppercase text-slate-950 group-hover:text-brand">
            {product.title}
          </h3>
        </div>
        <span className="shrink-0 font-heading text-sm font-bold text-brand">
          {formatPriceRange(minVariantPrice, maxVariantPrice)}
        </span>
      </div>
    </Link>
  );
}
