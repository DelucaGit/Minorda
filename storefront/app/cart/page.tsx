import type { Metadata } from "next";

import { CartPageContent } from "@/components/cart/CartPageContent";

export const metadata: Metadata = { title: "Cart" };

// The root layout seeds CartProvider with the resolved server cart,
// so this page paints its lines without JavaScript.
export default function CartPage() {
  return (
    <main className="mx-auto w-full max-w-7xl px-5 py-12">
      <span className="font-heading text-sm font-bold uppercase tracking-[0.08em] text-brand">Cart</span>
      <h1 className="mb-8 font-heading text-4xl font-bold uppercase tracking-tight text-slate-950">Your cart</h1>
      <CartPageContent />
    </main>
  );
}
