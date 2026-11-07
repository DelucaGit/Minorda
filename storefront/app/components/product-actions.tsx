"use client";

import { useState } from "react";

import { FavoriteButton } from "@/app/components/favorite-button";
import { usePreviewShop } from "@/app/components/preview-shop";

export function ProductActions({
  handle,
  sizes,
}: {
  handle: string;
  sizes: string[];
}) {
  const shop = usePreviewShop();
  const [size, setSize] = useState(sizes[0] ?? "M");
  const [added, setAdded] = useState(false);

  return (
    <div className="mt-8 max-w-md space-y-4">
      <label className="block text-sm font-semibold" htmlFor="size">
        Storlek
      </label>
      <select
        id="size"
        value={size}
        className="w-full rounded-lg border border-[#111] px-4 py-3"
        onChange={(event) => {
          setSize(event.target.value);
          setAdded(false);
        }}
      >
        {sizes.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          className="font-display rounded-full bg-[#111] px-7 py-3 text-[14px] font-bold text-white uppercase"
          onClick={() => {
            shop.addToCart(handle, size);
            setAdded(true);
          }}
        >
          Lägg i varukorg
        </button>
        <FavoriteButton handle={handle} />
      </div>
      {added ? (
        <p className="text-sm text-[#707072]">
          Lade till storlek {size} i varukorgen. Det här sparas bara i din webbläsare.
        </p>
      ) : (
        <p className="text-sm text-[#707072]">
          Förhandsvisning. Betalning sker hos Shopify när butiken är kopplad.
        </p>
      )}
    </div>
  );
}
