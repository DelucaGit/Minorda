// 100 wrestling products for the local preview.
// Photos are reused from the design, grouped by garment, because we do not
// have a unique picture for every name. Prices are placeholders in kronor.
// These products are not Shopify variants. The preview cart must not send them
// to Shopify.

import type { CatalogProduct } from "@/app/lib/catalog";
import { drops } from "@/app/lib/catalog-nav";
import {
  categoryTiles,
  heroImage,
  spotlightCards,
  storyImage,
} from "@/app/lib/home-design";

const teeWorn = heroImage.src;
const teeFlat =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDihFR4dCi9BetYE22l0JtkZR0DeNzspyzSLvHydbCLDaJZHl17sNJNZseUw_wIYx2T4gBK9kGJdOamV9igd7HxjXglLGZrWiNuKylCkF10bgaWTHY6Ew6C2hqGkdpPemC0K9bJ8Ql6v5RrPbTzWn0zu54_sK-U1pmaDWIxk1rxys_Ensi3YT8TbhUBX6QtL2sGOkwJcjPZQxcdXNWYeRurCdhWl-Gyzw8kjb7WjPMV";
const rashguard = categoryTiles[0].image;
const singletWorn = spotlightCards[1].image;
const singletFlat = categoryTiles[1].image;
const shortsWorn = spotlightCards[2].image;
const shortsFlat = categoryTiles[2].image;
const shoeMacro = categoryTiles[3].image;
const shoeSide =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBse9zGQBOtpahq9t1A82w3PA5DbBzJAzY-kGxLuf5lwWfBoxdWCnQ2gXBcNiEEgSqd-ACZF6TUKrJAokkw9-t_yGTw86qvodLgh1vYM3-vFSADHVrhgsUkRYUOUkIP9b_nB64o_HjM2Rpxyh70BcSND5zS7Pn5bE4bNCoFzUSuCIlCy_t3CG7ULPiCVR4FmkAwLrMHRXmX_yky3otv7KfNWKWYB3eSudpxJ6bgHBAa";

const apparelSizes = ["S", "M", "L", "XL", "2XL"];
const shoeSizes = ["40", "41", "42", "43", "44", "45"];
const lines = ["Apex", "Vanguard", "Volt", "Iron Forge", "Kinetic", "Cobalt", "Dual Ply", "Mat Flex", "NCAA", "Split Hem"];
const marks = ["Pro", "Elite", "Comp", "Mat", "Grip", "Core", "Tour", "Club", "Open", "Prime"];

type CategoryPlan = {
  handle: string;
  title: string;
  noun: string;
  count: number;
  price: number;
  images: string[];
  sizes: string[];
  first?: { handle: string; title: string };
};

const categories: CategoryPlan[] = [
  { handle: "brottarskor", title: "Brottarskor", noun: "Brottarsko", count: 8, price: 1190, images: [shoeSide, shoeMacro], sizes: shoeSizes },
  { handle: "mattskor", title: "Mattskor", noun: "Mattsko", count: 8, price: 1090, images: [shoeMacro, shoeSide], sizes: shoeSizes },
  {
    handle: "tavlingstrikåer",
    title: "Tävlingstrikåer",
    noun: "Brottartrikå",
    count: 10,
    price: 920,
    images: [singletWorn, singletFlat],
    sizes: apparelSizes,
    first: { handle: "vanguard-elite-brottartrika", title: "Vanguard Elite Brottartrikå" },
  },
  { handle: "greppstrumpor", title: "Greppstrumpor", noun: "Greppstrumpa", count: 6, price: 149, images: [shoeMacro], sizes: ["S", "M", "L"] },
  { handle: "rashguards", title: "Rashguards", noun: "Rashguard", count: 10, price: 799, images: [rashguard, teeWorn], sizes: apparelSizes },
  {
    handle: "brottarshorts",
    title: "Brottarshorts",
    noun: "Fightshorts",
    count: 10,
    price: 599,
    images: [shortsWorn, shortsFlat],
    sizes: apparelSizes,
    first: { handle: "kinetic-combat-fightshorts", title: "Kinetic Combat Fightshorts" },
  },
  {
    handle: "traningstrojor",
    title: "Träningströjor",
    noun: "Träningströja",
    count: 10,
    price: 649,
    images: [teeWorn, teeFlat],
    sizes: apparelSizes,
    first: { handle: "apex-pro-performance-tee", title: "Apex Pro Performance Tee" },
  },
  { handle: "trikaset", title: "Trikåset", noun: "Trikåset", count: 8, price: 1290, images: [singletFlat, singletWorn], sizes: apparelSizes },
  { handle: "vaskor", title: "Väskor", noun: "Väska", count: 8, price: 499, images: [storyImage], sizes: ["One size"] },
  { handle: "knaskydd", title: "Knäskydd", noun: "Knäskydd", count: 8, price: 349, images: [shortsFlat], sizes: ["S", "M", "L"] },
  { handle: "handdukar", title: "Handdukar", noun: "Handduk", count: 7, price: 199, images: [storyImage], sizes: ["One size"] },
  { handle: "ledstod", title: "Ledstöd", noun: "Ledstöd", count: 7, price: 299, images: [rashguard], sizes: ["S", "M", "L"] },
];

function slug(value: string): string {
  return value
    .toLowerCase()
    .replaceAll("å", "a")
    .replaceAll("ä", "a")
    .replaceAll("ö", "o")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function kronor(amount: number): string {
  return new Intl.NumberFormat("sv-SE", {
    style: "currency",
    currency: "SEK",
    maximumFractionDigits: 0,
  }).format(amount);
}

function buildProducts(): CatalogProduct[] {
  const products: CatalogProduct[] = [];
  let index = 0;

  for (const category of categories) {
    for (let item = 0; item < category.count; item += 1) {
      const line = lines[item % lines.length];
      const mark = marks[item % marks.length];
      const drop = drops[index % drops.length];
      const title = item === 0 && category.first
        ? category.first.title
        : `${line} ${mark} ${category.noun}`;
      const handle = item === 0 && category.first
        ? category.first.handle
        : slug(`${title}-${category.handle}`);
      const amount = category.price + (item % 5) * 50;
      const imageUrl = category.images[item % category.images.length];

      products.push({
        id: `mock-${handle}`,
        handle,
        title,
        description: `${title} för brottning och kamp. Tillhör ${drop.title}.`,
        price: kronor(amount),
        priceAmount: amount,
        imageUrl,
        imageAlt: title,
        categoryHandle: category.handle,
        categoryTitle: category.title,
        collectionHandle: drop.handle,
        collectionTitle: drop.title,
        sizes: category.sizes,
      });
      index += 1;
    }
  }

  return products;
}

export const mockWrestlingProducts = buildProducts();
