import Link from "next/link";
import type { ReactNode } from "react";

export function Header({ cartLink }: { cartLink: ReactNode }) {
  return (
    <header className="sticky top-0 z-50 border-b border-line bg-white/95 backdrop-blur">
      <div className="bg-ink text-slate-300">
        <div className="mx-auto flex h-9 max-w-7xl items-center justify-between gap-4 px-5 font-heading text-[11px] font-bold uppercase tracking-[0.12em]">
          <p className="flex items-center gap-2 text-white">
            <span aria-hidden="true" className="inline-block h-1.5 w-1.5 rounded-full bg-volt" />
            Progress isn&apos;t linear • Rise is never flat
          </p>
          <p className="hidden sm:block">Demo catalog • Checkout takes no payment</p>
        </div>
      </div>
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-6 px-5">
        <div className="flex items-center gap-8">
          <Link href="/" className="group flex items-center gap-2" aria-label="Minorda home">
            <span aria-hidden="true" className="flex h-8 w-8 items-center justify-center rounded bg-ink font-heading text-lg font-bold text-volt">
              M
            </span>
            <span className="font-heading text-2xl font-bold uppercase tracking-tighter text-slate-950 group-hover:text-brand">
              Minorda
            </span>
          </Link>
          <nav aria-label="Main" className="flex items-center gap-1">
            <Link
              href="/collections"
              className="rounded px-3 py-2 font-heading text-sm font-bold uppercase tracking-[0.08em] text-slate-600 hover:bg-slate-100 hover:text-slate-950"
            >
              Shop
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <form action="/search" method="get" role="search" className="hidden items-center rounded border border-line bg-slate-100 px-3 py-1.5 focus-within:ring-2 focus-within:ring-brand md:flex">
            <label htmlFor="header-search" className="sr-only">
              Search products
            </label>
            <SearchIcon />
            <input
              id="header-search"
              name="q"
              type="search"
              placeholder="Search gear..."
              className="ml-2 w-36 bg-transparent font-heading text-xs font-medium uppercase placeholder:text-slate-400 focus:outline-none lg:w-48"
            />
          </form>
          <Link
            href="/search"
            aria-label="Search"
            className="rounded p-2 text-slate-600 hover:text-slate-950 md:hidden"
          >
            <SearchIcon />
          </Link>
          {cartLink}
        </div>
      </div>
    </header>
  );
}

function SearchIcon() {
  return (
    <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}
