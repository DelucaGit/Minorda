import { gql } from "@shopify/hydrogen";
import Link from "next/link";

import { ProductCard } from "@/components/ProductCard";
import { shopifyImageUrl } from "@/lib/image";
import { formatPriceRange } from "@/lib/money";
import { PRODUCT_CARD_FRAGMENT } from "@/lib/product-card";
import { staticStorefrontClient } from "@/lib/storefront-static";

const HOME_QUERY = gql(
  `
  query Home($country: CountryCode, $language: LanguageCode)
  @inContext(country: $country, language: $language) {
    collections(first: 20) {
      nodes {
        id
        handle
        title
        image {
          url
          altText
        }
      }
    }
    products(first: 8) {
      nodes {
        ...ProductCard
      }
    }
  }
`,
  [PRODUCT_CARD_FRAGMENT],
);

type Collection = { id: string; handle: string; title: string; image?: { url: string; altText?: string | null } | null };

// Category tiles keep the prototype labels. A tile links to a real collection
// only when the API returns one whose title or handle matches its keywords;
// otherwise it links to /collections.
const CATEGORY_TILES = [
  {
    label: "Shirts & Rashguards",
    blurb: "Technical tees, rashguards, and second-skin tops.",
    keywords: ["top", "shirt", "tee", "rashguard"],
  },
  {
    label: "Wrestling Singlets",
    blurb: "Competition singlets and fight wear.",
    keywords: ["singlet"],
  },
  {
    label: "Fight Shorts & Bottoms",
    blurb: "Split-hem shorts and training bottoms.",
    keywords: ["short", "bottom"],
  },
  {
    label: "Mat Footwear & Gear",
    blurb: "Wrestling shoes, grip socks, and gear bags.",
    keywords: ["footwear", "shoe"],
  },
] as const;

function matchCollection(collections: Collection[], keywords: readonly string[]) {
  return collections.find((collection) => {
    const words = `${collection.title} ${collection.handle}`.toLowerCase().split(/[^a-z]+/);
    return keywords.some((keyword) => words.some((word) => word === keyword || word === `${keyword}s`));
  });
}

const MARQUEE = ["Rise is never flat", "Progress isn't linear"];

const DURABILITY = [
  {
    title: "4-way stretch compression",
    text: "Holds its shape without bagging or losing rebound after hard training sessions.",
  },
  {
    title: "Reinforced flatlock stitching",
    text: "Low-profile seams built to resist friction and heavy mat wear.",
  },
  {
    title: "Breathable moisture control",
    text: "Fast-drying fibers pull heat and moisture away so you stay focused.",
  },
  {
    title: "Mat-tough resistance",
    text: "A surface texture that resists snagging on canvas, rough mats, and Velcro straps.",
  },
];

export default async function Home() {
  const { data, errors } = await staticStorefrontClient.graphql(HOME_QUERY);
  if (errors) {
    console.error("[hydrogen] Home query failed", errors);
    throw new Error("Home query failed");
  }

  const collections = data?.collections.nodes ?? [];
  const products = data?.products.nodes ?? [];
  const heroProduct = products.find((product) => product.featuredImage) ?? null;

  return (
    <main className="flex w-full flex-col">
      {/* 1. Hero */}
      <section className="relative overflow-hidden border-b border-line bg-gradient-to-b from-slate-50 to-white">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#0047ff_1px,transparent_1px)] [background-size:24px_24px] opacity-20" />
        <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-5 py-12 lg:grid-cols-12 lg:py-16">
          <div className="flex flex-col items-start gap-5 lg:col-span-7">
            <p className="inline-flex items-center gap-2 rounded border border-slate-300 bg-white px-3 py-1 font-heading text-[11px] font-bold uppercase tracking-[0.12em] shadow-sm">
              <span aria-hidden="true" className="inline-block h-2 w-2 border border-slate-900/20 bg-volt" />
              [ Progress isn&apos;t linear / Rise is never flat ]
            </p>
            <h1 className="font-heading text-[54px] font-bold uppercase leading-none tracking-tighter text-slate-950 lg:text-[72px]">
              Progress isn&apos;t <span className="italic text-brand">linear.</span>
              <span className="block pt-2 text-[36px] tracking-tight text-slate-900 lg:text-[48px]">
                Rise is never <span className="text-brand">flat.</span>
              </span>
            </h1>
            <p className="max-w-xl text-lg leading-relaxed text-muted">
              Engineered for wrestlers, combat athletes, and relentless lifters. Technical apparel for athletes who keep showing up.
            </p>
            <div className="flex w-full flex-wrap gap-4 pt-2 sm:w-auto">
              <a href="#product-row" className="flex-1 rounded bg-brand px-6 py-4 text-center font-heading text-lg font-bold uppercase tracking-wider text-white shadow-md hover:bg-blue-700 sm:flex-initial">
                Shop new arrivals
              </a>
              <a href="#categories" className="flex-1 rounded border-2 border-slate-900 bg-white px-6 py-4 text-center font-heading text-lg font-bold uppercase tracking-wider text-slate-950 hover:bg-slate-900 hover:text-white sm:flex-initial">
                Explore gear
              </a>
            </div>
          </div>
          <div className="relative flex items-center justify-center lg:col-span-5">
            <div className="absolute -z-10 h-72 w-72 rounded-full bg-blue-100 blur-3xl" />
            {heroProduct?.featuredImage ? (
              <Link href={`/products/${heroProduct.handle}`} className="group relative block aspect-[4/5] w-full overflow-hidden rounded-lg border border-slate-300 bg-slate-100 shadow-xl">
                {/* eslint-disable-next-line @next/next/no-img-element -- Hydrogen image skill: plain <img> with Shopify CDN sizing params */}
                <img
                  src={shopifyImageUrl(heroProduct.featuredImage.url, { width: 800, height: 1000, crop: "center" })}
                  alt={heroProduct.featuredImage.altText ?? heroProduct.title}
                  width={800}
                  height={1000}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-x-4 bottom-4 flex items-center justify-between gap-4 rounded border border-slate-200 bg-white/95 p-4 shadow-lg backdrop-blur">
                  <div>
                    <span className="block font-heading text-[11px] font-bold uppercase tracking-[0.12em] text-brand">Featured</span>
                    <p className="font-heading text-lg font-bold uppercase text-slate-950">{heroProduct.title}</p>
                  </div>
                  <span className="shrink-0 font-heading text-sm font-bold text-brand">
                    {formatPriceRange(heroProduct.priceRange.minVariantPrice, heroProduct.priceRange.maxVariantPrice)}
                  </span>
                </div>
              </Link>
            ) : null}
          </div>
        </div>
      </section>

      {/* 2. Marquee */}
      <div className="w-full select-none overflow-hidden whitespace-nowrap border-y border-slate-900/10 bg-volt py-2.5 text-slate-950 shadow-sm" aria-hidden="true">
        <div className="animate-marquee inline-flex gap-8 py-1 font-heading text-lg font-bold uppercase tracking-widest">
          {Array.from({ length: 12 }, (_, i) => (
            <span key={i} className="inline-flex gap-8">
              <span>{MARQUEE[i % 2]}</span>
              <span className="text-brand">◆</span>
            </span>
          ))}
        </div>
      </div>

      {/* 3. Doctrine */}
      <section className="mx-auto w-full max-w-7xl px-5 py-16">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="flex flex-col justify-between rounded-lg border border-line bg-white p-6 shadow-sm lg:col-span-5">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="font-heading text-sm font-bold uppercase tracking-[0.08em] text-brand">01. Doctrine</span>
                <div className="h-px flex-1 bg-line" />
              </div>
              <h2 className="font-heading text-[36px] font-bold uppercase leading-tight tracking-tight text-slate-950 lg:text-[44px]">
                Aggression meets <span className="text-brand">kinetic discipline</span>
              </h2>
              <p className="leading-relaxed text-muted">
                Forged in wrestling rooms and punishing fight camps. Minorda closes the gap between relentless drive and technical fabric engineering. We don&apos;t build lifestyle silhouettes; we build gear for athletes who endure friction, torque, and maximum load.
              </p>
            </div>
            <p className="mt-6 border-t border-line pt-6 font-heading text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-700">
              Rise is never flat • Progress isn&apos;t linear
            </p>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:col-span-7">
            <div className="space-y-2 rounded-lg border border-line bg-white p-4 shadow-sm">
              <span className="font-heading text-[11px] font-bold uppercase tracking-[0.12em] text-brand">Motif 01: Shock wave</span>
              <h3 className="font-heading text-2xl font-bold uppercase text-slate-950">Angular sculpting</h3>
              <p className="text-sm text-muted">
                Seam lines follow how muscles actually move, reducing friction under the arms and across the lats during grappling transitions.
              </p>
            </div>
            <div className="space-y-2 rounded-lg bg-brand p-4 text-white shadow-md">
              <span className="font-heading text-[11px] font-bold uppercase tracking-[0.12em] text-volt">Doctrine: Core</span>
              <h3 className="font-heading text-2xl font-bold uppercase leading-tight">Progress isn&apos;t linear</h3>
              <p className="text-sm text-blue-100">
                Development happens through repeated impact, plateaus, and breakthroughs. Your gear has to survive every cycle.
              </p>
            </div>
            <div className="space-y-2 rounded-lg border border-line bg-white p-4 shadow-sm md:col-span-2">
              <span className="font-heading text-[11px] font-bold uppercase tracking-[0.12em] text-brand">Fabric lab</span>
              <h3 className="font-heading text-lg font-bold uppercase text-slate-950">Hydro-expulsion weave</h3>
              <p className="max-w-lg text-sm text-muted">
                A dual-phase knit that moves sweat away from the skin and keeps its grip on the mat.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Category grid */}
      <section id="categories" className="mx-auto w-full max-w-7xl px-5 py-10">
        <div className="flex flex-col justify-between gap-2 pb-6 md:flex-row md:items-end">
          <div>
            <span className="mb-1 block font-heading text-sm font-bold uppercase tracking-[0.08em] text-brand">02. Arsenal</span>
            <h2 className="font-heading text-[32px] font-bold uppercase tracking-tight text-slate-950 lg:text-[44px] lg:leading-[48px]">Shop by category</h2>
          </div>
          <p className="max-w-md font-medium text-muted">
            Athletic silhouettes for wrestling, no-gi, and the weight room.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CATEGORY_TILES.map((tile, index) => {
            const collection = matchCollection(collections, tile.keywords);
            const href = collection ? `/collections/${collection.handle}` : "/collections";
            return (
              <Link key={tile.label} href={href} className="group flex flex-col overflow-hidden rounded-lg border border-line bg-white transition-all hover:border-brand hover:shadow-lg">
                <div className="relative aspect-[3/4] overflow-hidden bg-slate-100">
                  {collection?.image ? (
                    // eslint-disable-next-line @next/next/no-img-element -- Hydrogen image skill: plain <img> with Shopify CDN sizing params
                    <img
                      src={shopifyImageUrl(collection.image.url, { width: 600, height: 800, crop: "center" })}
                      alt={collection.image.altText ?? collection.title}
                      width={600}
                      height={800}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div aria-hidden="true" className="flex h-full w-full items-end bg-ink p-4 font-heading text-6xl font-bold text-volt/80">
                      0{index + 1}
                    </div>
                  )}
                  <span className="absolute left-3 top-3 rounded border border-slate-200 bg-white/95 px-2 py-1 font-heading text-[11px] font-bold uppercase text-slate-900 shadow-sm">
                    Cat 0{index + 1}
                  </span>
                </div>
                <div className="space-y-2 p-4">
                  <h3 className="font-heading text-lg font-bold uppercase text-slate-950 group-hover:text-brand">{tile.label}</h3>
                  <p className="text-sm text-muted">{tile.blurb}</p>
                  <p className="pt-2 font-heading text-[11px] font-bold uppercase tracking-[0.12em] text-brand">
                    {collection ? `Explore ${collection.title}` : "Explore the shop"} →
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 5. Product row */}
      <section id="product-row" className="mx-auto w-full max-w-7xl px-5 py-16">
        <div className="flex flex-col justify-between gap-4 pb-6 md:flex-row md:items-end">
          <div>
            <span className="mb-1 block font-heading text-sm font-bold uppercase tracking-[0.08em] text-brand">03. Latest drops</span>
            <h2 className="font-heading text-[32px] font-bold uppercase tracking-tight text-slate-950 lg:text-[44px] lg:leading-[48px]">Featured products</h2>
          </div>
          <Link href="/collections" className="font-heading text-sm font-bold uppercase tracking-[0.08em] text-brand hover:underline">
            Shop all →
          </Link>
        </div>
        {products.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <p className="text-muted">No products yet.</p>
        )}
      </section>

      {/* 6. Durability */}
      <section className="mx-auto w-full max-w-7xl px-5 py-16">
        <div className="rounded-xl border border-line bg-slate-50 p-6 shadow-sm lg:p-10">
          <div className="flex flex-col justify-between gap-4 pb-6 lg:flex-row lg:items-center">
            <div>
              <span className="mb-1 block font-heading text-sm font-bold uppercase tracking-[0.08em] text-brand">04. Fabric craft</span>
              <h2 className="font-heading text-[32px] font-bold uppercase tracking-tight text-slate-950 lg:text-[44px] lg:leading-[48px]">Engineered for durability</h2>
            </div>
            <p className="flex items-center gap-2 font-heading text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">
              <span aria-hidden="true" className="inline-block h-2 w-2 rounded-full border border-slate-900/20 bg-volt" />
              Built to last on the mat
            </p>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            {DURABILITY.map((item) => (
              <div key={item.title} className="flex flex-col justify-between gap-4 rounded-lg border border-line bg-white p-4 shadow-sm">
                <div className="space-y-2">
                  <h3 className="font-heading text-lg font-bold uppercase text-slate-950">{item.title}</h3>
                  <p className="text-sm text-muted">{item.text}</p>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                  <div className="h-full w-full bg-volt" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Closing band */}
      <section className="relative overflow-hidden bg-brand">
        <div aria-hidden="true" className="absolute -right-24 top-0 h-full w-1/2 skew-x-[-12deg] bg-white/10" />
        <div className="relative mx-auto flex max-w-7xl flex-col items-start gap-5 px-5 py-16 text-white">
          <span className="font-heading text-[11px] font-bold uppercase tracking-[0.12em] text-volt">Combat ready • Built to compete</span>
          <h2 className="font-heading text-[36px] font-bold uppercase leading-tight tracking-tight lg:text-[56px]">
            Engineered for combat athletes
          </h2>
          <p className="max-w-xl text-lg text-blue-100">
            Apparel for wrestlers, grapplers, and athletes who push their limits every day.
          </p>
          <Link href="/collections" className="rounded bg-volt px-6 py-4 font-heading text-lg font-bold uppercase tracking-wider text-slate-950 shadow-md hover:bg-white">
            Shop the collection
          </Link>
        </div>
      </section>
    </main>
  );
}
