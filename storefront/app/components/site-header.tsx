import Link from "next/link";

import { HeaderTools } from "@/app/components/header-tools";
import { IconPerson, IconSearch } from "@/app/components/icons";
import { usesShopifyCatalog } from "@/app/lib/catalog";
import { shopNav } from "@/app/lib/catalog-nav";
import { brandLogo } from "@/app/lib/home-design";

export function SiteHeader() {
  return (
    <div className="sticky top-0 z-40 bg-white">
      <aside className="border-b border-[#e5e5e5] bg-[#f5f5f5] text-[12px]">
        <div className="mx-auto flex h-9 max-w-[1440px] items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-1.5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={brandLogo.src} alt="" className="h-3.5 w-auto" />
              <span className="font-display text-[11px] font-bold tracking-tight text-[#0047ff] uppercase">
                Pro Combat
              </span>
            </Link>
            <span className="text-slate-300">|</span>
            <span className="hidden text-[#707072] sm:inline">
              Fri frakt på beställningar över 990 kr · Officiellt certifierade tävlingskläder
            </span>
          </div>
          <div className="flex items-center gap-4 text-[#111111]">
            <span>{usesShopifyCatalog() ? "USD ($)" : "SEK"}</span>
            <span className="text-slate-300">|</span>
            <a className="hover:text-[#707072]" href="mailto:ops@minorda.com">
              Hjälp
            </a>
          </div>
        </div>
      </aside>

      <header className="border-b border-transparent bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2" aria-label="Minorda hem">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={brandLogo.src} alt="" className="h-7 w-auto" />
            <span className="font-display text-xl font-bold tracking-tighter uppercase">
              Minorda
            </span>
          </Link>

          <nav className="hidden items-center gap-7 text-[15px] font-semibold lg:flex">
            {shopNav.map((item) => (
              <Link key={item.label} href={item.href} className="hover:text-[#0047ff]">
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <form action="/search" className="hidden items-center sm:flex">
              <label className="flex items-center rounded-full bg-[#f5f5f5] px-3.5 py-1.5">
                <IconSearch className="mr-2 h-5 w-5 text-[#707072]" />
                <input
                  name="q"
                  type="search"
                  placeholder="Sök utrustning..."
                  className="w-28 bg-transparent text-[14px] outline-none placeholder:text-[#707072] lg:w-40"
                />
              </label>
            </form>
            <HeaderTools />
            <span className="rounded-full p-2" aria-hidden="true">
              <IconPerson className="h-6 w-6" />
            </span>
          </div>
        </div>
      </header>

      <div className="border-b border-[#e5e5e5] bg-[#f5f5f5] py-2 text-center text-[13px] font-semibold">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-center gap-2 px-4">
          <span className="rounded bg-[#c1f100] px-1.5 py-0.5 text-[10px] font-extrabold uppercase">
            Drop 04
          </span>
          <span>PROGRESS ISN&apos;T LINEAR · RISE IS NEVER FLAT — Fri retur inom 30 dagar</span>
          <Link href="/#senaste" className="font-bold underline hover:text-[#0047ff]">
            Shoppa nu
          </Link>
        </div>
      </div>
    </div>
  );
}
