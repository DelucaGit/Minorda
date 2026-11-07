"use client";

import Link from "next/link";

import { usePreviewShop } from "@/app/components/preview-shop";
import { mockWrestlingProducts } from "@/app/lib/mock-products";

function kronor(amount: number): string {
  return new Intl.NumberFormat("sv-SE", {
    style: "currency",
    currency: "SEK",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function PreviewCart() {
  const shop = usePreviewShop();
  const lines = shop.cart.flatMap((line) => {
    const product = mockWrestlingProducts.find((item) => item.handle === line.handle);
    if (!product) return [];
    return [{ line, product }];
  });
  const total = lines.reduce(
    (sum, item) => sum + (item.product.priceAmount ?? 0) * item.line.quantity,
    0,
  );

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="font-display text-4xl font-bold uppercase">Varukorg</h1>
          <p className="mt-3 text-[#707072]">
        Ingen betalning dras i den här testbutiken. Du kan ändå gå vidare till kassan
        och se hur beställningen avslutas.
      </p>
      {lines.length === 0 ? (
        <Link
          href="/collections"
          className="font-display mt-8 inline-block rounded-full bg-[#111] px-7 py-3 text-[14px] font-bold text-white uppercase"
        >
          Fortsätt handla
        </Link>
      ) : (
        <>
          <ul className="mt-8 divide-y divide-[#e5e5e5]">
            {lines.map(({ line, product }) => (
              <li key={`${line.handle}-${line.size}`} className="flex gap-4 py-4">
                <Link href={`/products/${product.handle}`} className="h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-[#f5f5f5]">
                  {product.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={product.imageUrl} alt="" className="h-full w-full object-cover" />
                  ) : null}
                </Link>
                <div className="min-w-0 flex-1">
                  <Link href={`/products/${product.handle}`} className="font-display font-bold hover:text-[#0047ff]">
                    {product.title}
                  </Link>
                  <p className="text-sm text-[#707072]">Storlek {line.size}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <button
                      type="button"
                      className="h-8 w-8 rounded-full bg-[#f5f5f5]"
                      aria-label="Minska antal"
                      onClick={() => shop.setQuantity(line.handle, line.size, line.quantity - 1)}
                    >
                      −
                    </button>
                    <span>{line.quantity}</span>
                    <button
                      type="button"
                      className="h-8 w-8 rounded-full bg-[#f5f5f5]"
                      aria-label="Öka antal"
                      onClick={() => shop.setQuantity(line.handle, line.size, line.quantity + 1)}
                    >
                      +
                    </button>
                    <button
                      type="button"
                      className="ml-2 text-sm font-semibold text-[#0047ff]"
                      onClick={() => shop.removeFromCart(line.handle, line.size)}
                    >
                      Ta bort
                    </button>
                  </div>
                </div>
                <p className="font-display font-bold">
                  {kronor((product.priceAmount ?? 0) * line.quantity)}
                </p>
              </li>
            ))}
          </ul>
          <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
            <Link href="/collections" className="font-semibold text-[#0047ff]">
              Fortsätt handla
            </Link>
            <div className="text-right">
              <p className="font-display text-2xl font-bold">Totalt {kronor(total)}</p>
              <Link
                href="/checkout"
                className="font-display mt-4 inline-block rounded-full bg-[#c1f100] px-7 py-3 text-[14px] font-bold text-[#111] uppercase"
              >
                Till kassan
              </Link>
            </div>
          </div>
        </>
      )}
    </main>
  );
}
