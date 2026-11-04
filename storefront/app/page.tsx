import { Suspense } from "react";

import { ClothingRail } from "@/app/components/clothing-rail";
import { loadRailGarments } from "@/app/lib/catalog";

export const metadata = {
  title: "Minorda — clothing rail try-out",
  description:
    "A try-out of browsing Minorda products as if they were hanging on a shop rail.",
};

export default function HomePage() {
  return (
    <main className="min-h-full bg-white text-slate-950">
      <div className="bg-slate-900 text-slate-300">
        <p className="mx-auto flex h-9 max-w-7xl items-center px-5 text-[11px] font-bold tracking-[0.14em] uppercase">
          Try-out · walk the rack
        </p>
      </div>
      <header className="border-b border-slate-200">
        <div className="mx-auto flex h-20 max-w-7xl items-end justify-between px-5 pb-4">
          <p className="font-display text-2xl font-bold tracking-tight uppercase">
            Minorda
          </p>
          <p className="hidden text-sm text-slate-600 sm:block">
            Progress isn&apos;t linear.
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-5 pt-8 pb-4">
        <p className="text-[11px] font-bold tracking-[0.16em] text-[#0047ff] uppercase">
          Clothing rail
        </p>
        <h1 className="font-display mt-2 max-w-3xl text-4xl font-bold tracking-tight uppercase sm:text-5xl">
          Look along the rack
        </h1>
        <p className="mt-3 max-w-2xl text-base text-slate-600">
          These are live products from the demo catalog. The photos are studio
          shots, so each one hangs as a card on a hanger. Cut-out photos would
          look more like bare clothes.
        </p>
      </div>

      <Suspense
        fallback={
          <p className="px-5 py-24 text-slate-600">
            Fetching the rack from the catalog…
          </p>
        }
      >
        <Rack />
      </Suspense>
    </main>
  );
}

async function Rack() {
  const result = await loadRailGarments().then(
    (garments) => ({ ok: true as const, garments }),
    (error: unknown) => ({
      ok: false as const,
      message: error instanceof Error ? error.message : String(error),
    }),
  );

  if (!result.ok) {
    return (
      <p className="px-5 py-16 text-slate-800">
        The catalog query failed: {result.message}
      </p>
    );
  }

  if (result.garments.length === 0) {
    return (
      <p className="px-5 py-16 text-slate-700">
        The catalog returned no clothing photos to hang on the rack.
      </p>
    );
  }

  return <ClothingRail garments={result.garments} />;
}
