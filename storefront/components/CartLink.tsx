"use client";

import Link from "next/link";

import { useCart } from "@/lib/cart";

export function CartLink() {
  const totalQuantity = useCart((state) => state.data.totalQuantity);
  const pending = useCart((state) => state.pending.lines.size > 0);

  return (
    <Link
      href="/cart"
      className="flex items-center gap-2 rounded border border-line bg-slate-100 px-3 py-2 font-heading text-xs font-bold uppercase text-slate-900 hover:bg-slate-200"
    >
      <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0047ff" strokeWidth="2">
        <path d="M6 7h12l-1 13H7L6 7Z" />
        <path d="M9 7a3 3 0 0 1 6 0" />
      </svg>
      <span className={pending ? "opacity-40" : undefined}>Cart ({totalQuantity ?? 0})</span>
    </Link>
  );
}
