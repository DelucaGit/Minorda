"use client";

import { IconHeart } from "@/app/components/icons";
import { usePreviewShop } from "@/app/components/preview-shop";

export function FavoriteButton({
  handle,
  className = "",
}: {
  handle: string;
  className?: string;
}) {
  const shop = usePreviewShop();
  const saved = shop.isFavorite(handle);

  return (
    <button
      type="button"
      aria-pressed={saved}
      aria-label={saved ? "Ta bort från favoriter" : "Spara som favorit"}
      className={`rounded-full bg-white/90 p-2 text-[#111] shadow-sm hover:text-[#0047ff] ${className}`}
      onClick={() => shop.toggleFavorite(handle)}
    >
      <IconHeart className="h-5 w-5" filled={saved} />
    </button>
  );
}
