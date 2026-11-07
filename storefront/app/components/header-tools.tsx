"use client";

import Link from "next/link";

import { IconBag, IconHeart } from "@/app/components/icons";
import { usePreviewShop } from "@/app/components/preview-shop";

export function HeaderTools() {
  const shop = usePreviewShop();

  return (
    <>
      <Link
        href="/favorites"
        aria-label={`Favoriter, ${shop.favorites.length} sparade`}
        className="relative rounded-full p-2 hover:bg-[#f5f5f5]"
      >
        <IconHeart className="h-6 w-6" filled={shop.favorites.length > 0} />
        {shop.favorites.length > 0 ? (
          <span className="absolute top-0 right-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#0047ff] px-1 text-[10px] font-bold text-white">
            {shop.favorites.length}
          </span>
        ) : null}
      </Link>
      <Link
        href="/cart"
        aria-label={`Varukorg, ${shop.cartCount} varor`}
        className="relative rounded-full p-2 hover:bg-[#f5f5f5]"
      >
        <IconBag className="h-6 w-6" />
        {shop.cartCount > 0 ? (
          <span className="absolute top-0 right-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#0047ff] px-1 text-[10px] font-bold text-white">
            {shop.cartCount}
          </span>
        ) : null}
      </Link>
    </>
  );
}
