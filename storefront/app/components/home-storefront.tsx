"use client";

import Link from "next/link";
import { useRef, type RefObject } from "react";

import { IconChevron } from "@/app/components/icons";
import type { CatalogProduct } from "@/app/lib/catalog";
import {
  categoryTiles,
  heroImage,
  spotlightCards,
  storyImage,
} from "@/app/lib/home-design";

function scrollByCard(row: HTMLDivElement | null, direction: number) {
  row?.scrollBy({ left: direction * 320, behavior: "smooth" });
}

function RowButtons({ target }: { target: RefObject<HTMLDivElement | null> }) {
  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        aria-label="Föregående"
        className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f5f5f5] hover:bg-[#e5e5e5]"
        onClick={() => scrollByCard(target.current, -1)}
      >
        <IconChevron className="h-5 w-5" direction="left" />
      </button>
      <button
        type="button"
        aria-label="Nästa"
        className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f5f5f5] hover:bg-[#e5e5e5]"
        onClick={() => scrollByCard(target.current, 1)}
      >
        <IconChevron className="h-5 w-5" direction="right" />
      </button>
    </div>
  );
}

export function HomeStorefront({ products }: { products: CatalogProduct[] }) {
  const spotlightRef = useRef<HTMLDivElement>(null);
  const popularRef = useRef<HTMLDivElement>(null);

  return (
    <main>
      <section className="mx-auto max-w-[1440px] px-4 pt-3 pb-12 sm:px-6">
        <div className="relative h-[420px] overflow-hidden rounded-xl bg-[#0c121e] sm:h-[560px] md:h-[620px]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={heroImage.src}
            alt={heroImage.alt}
            className="h-full w-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <div className="absolute top-6 left-6 flex items-center gap-2 rounded-full border border-white/10 bg-black/40 px-3 py-1.5 text-[11px] font-bold tracking-widest text-white uppercase">
            <span className="h-2 w-2 rounded-full bg-[#c1f100]" />
            Officiell kamputrustning
          </div>
        </div>

        <div className="mx-auto max-w-4xl px-4 pt-8 text-center">
          <p className="font-display mb-2 text-[14px] font-bold tracking-widest text-[#0047ff] uppercase">
            Apex Combat Drop 04
          </p>
          <h1 className="font-display mb-4 text-[40px] leading-[0.95] font-bold tracking-tight uppercase sm:text-[56px] md:text-[72px]">
            Progress isn&apos;t linear.
            <br />
            <span className="text-[#0047ff]">Rise is never flat.</span>
          </h1>
          <p className="mx-auto mb-6 max-w-2xl text-[16px] text-[#707072]">
            Konstruerade för brottare och kampsportare som tänjer på gränserna på
            mattan. Maximal draghållfasthet och kinetisk elasticitet.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <a
              href="#senaste"
              className="font-display rounded-full bg-[#111111] px-7 py-3 text-[14px] font-bold tracking-wide text-white uppercase"
            >
              Köp nu
            </a>
            <a
              href="#kategorier"
              className="font-display rounded-full border border-[#111111] bg-white px-7 py-3 text-[14px] font-bold tracking-wide uppercase"
            >
              Utforska kollektionen
            </a>
          </div>
        </div>
      </section>

      <section id="senaste" className="mx-auto max-w-[1440px] px-4 py-10 sm:px-6">
        <div className="mb-6 flex items-center justify-between gap-4">
          <h2 className="font-display text-[22px] font-bold tracking-tight uppercase sm:text-[28px]">
            Det senaste inom Minorda
          </h2>
          <RowButtons target={spotlightRef} />
        </div>
        <div
          ref={spotlightRef}
          className="flex snap-x gap-5 overflow-x-auto pb-2"
        >
          {spotlightCards.map((card) => (
            <Link
              key={card.title}
              href="/collections"
              className="group relative aspect-[4/5] w-[78%] shrink-0 snap-start overflow-hidden rounded-xl bg-[#111] sm:w-[46%] lg:w-[32%]"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={card.image}
                alt={card.alt}
                className="absolute inset-0 h-full w-full object-cover object-top"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
              <div className="relative z-10 flex h-full flex-col justify-end p-6 text-white">
                <p className="font-display text-[11px] font-bold tracking-wider text-[#c1f100] uppercase">
                  {card.eyebrow}
                </p>
                <h3 className="font-display mt-1 text-[22px] font-bold uppercase">
                  {card.title}
                </h3>
                <p className="mt-1 text-[14px] text-slate-300">{card.text}</p>
                <span className="font-display mt-4 inline-flex w-fit rounded-full bg-white px-5 py-2.5 text-[13px] font-bold text-[#111] uppercase">
                  {card.action}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section id="kategorier" className="mx-auto max-w-[1440px] px-4 py-10 sm:px-6">
        <h2 className="font-display mb-6 text-[22px] font-bold tracking-tight uppercase sm:text-[28px]">
          Handla efter kategori
        </h2>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {categoryTiles.map((tile) => (
            <Link
              key={tile.label}
              href="/collections"
              className="relative flex aspect-[3/4] items-end overflow-hidden rounded-xl bg-[#f0f0f2] p-5"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={tile.image}
                alt={tile.label}
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <span className="font-display relative z-10 rounded-full bg-white px-4 py-2 text-[13px] font-bold uppercase">
                {tile.label}
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-4 py-10 sm:px-6">
        <div className="mb-6 flex items-center justify-between gap-4">
          <h2 className="font-display text-[22px] font-bold tracking-tight uppercase sm:text-[28px]">
            Populärt just nu
          </h2>
          <RowButtons target={popularRef} />
        </div>
        {products.length === 0 ? (
          <p className="text-[#707072]">Katalogen skickade inga produkter.</p>
        ) : (
          <div ref={popularRef} className="flex snap-x gap-6 overflow-x-auto pb-2">
            {products.map((product) => (
              <article
                key={product.id}
                className="w-[78%] shrink-0 snap-start sm:w-[46%] lg:w-[23%]"
              >
                <Link href={`/products/${product.handle}`} className="group block">
                  <div className="relative mb-3 aspect-square overflow-hidden rounded-xl bg-[#f5f5f5]">
                    {product.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={product.imageUrl}
                        alt={product.imageAlt}
                        className="h-full w-full object-cover"
                      />
                    ) : null}
                  </div>
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-display text-[16px] font-bold group-hover:text-[#0047ff]">
                      {product.title}
                    </h3>
                    <p className="font-display shrink-0 text-[15px] font-bold">
                      {product.price}
                    </p>
                  </div>
                  <span className="font-display mt-3 block w-full rounded-full bg-[#f5f5f5] py-2 text-center text-[13px] font-bold uppercase group-hover:bg-[#111] group-hover:text-white">
                    Välj storlek
                  </span>
                </Link>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="mx-auto max-w-[1440px] px-4 py-12 sm:px-6">
        <div className="relative flex min-h-[460px] items-center overflow-hidden rounded-2xl bg-[#0c1322] text-white">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={storyImage}
            alt=""
            className="absolute inset-0 h-full w-full object-cover opacity-25"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0c1322] via-[#0c1322]/90 to-transparent" />
          <div className="relative z-10 max-w-2xl space-y-4 p-8 sm:p-14">
            <p className="font-display inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[12px] font-bold tracking-wider text-[#c1f100] uppercase">
              Behind the design · Innovationslabb
            </p>
            <h2 className="font-display text-[32px] leading-none font-bold tracking-tight uppercase sm:text-[46px]">
              Aggression möter
              <br />
              <span className="text-[#0047ff]">kinetisk disciplin</span>
            </h2>
            <p className="text-[16px] text-slate-300">
              Konstruerad för att tåla mattkampens påfrestningar. Testad i
              tävlingstempo för att hålla nere friktionen och hålla tyget helt.
            </p>
            <p className="font-display text-[13px] font-semibold tracking-wider text-slate-400 uppercase">
              UWW och NCAA godkänt
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
