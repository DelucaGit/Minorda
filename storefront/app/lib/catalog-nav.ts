// Every menu and footer label points at one of these handles.
// A handle is either a product group, a drop, or a category.

export const shopNav = [
  { href: "/#senaste", label: "Nyheter" },
  { href: "/collections/kamp-och-brottning", label: "Kamp och brottning" },
  { href: "/collections/herr", label: "Herr" },
  { href: "/collections/traning", label: "Träning" },
  { href: "/collections/utrustning", label: "Utrustning och tillbehör" },
  { href: "/collections", label: "Kollektioner" },
];

export const drops = [
  { handle: "apex-combat-drop-04", title: "Apex Combat Drop 04" },
  { handle: "vanguard-series", title: "Vanguard Series" },
  { handle: "svart-kapsel", title: "Svart kapsel" },
  { handle: "electric-volt", title: "Electric Volt" },
];

export const footerColumns = [
  {
    title: "Skor och tävling",
    links: [
      { href: "/collections/brottarskor", label: "Brottarskor" },
      { href: "/collections/mattskor", label: "Mattskor" },
      { href: "/collections/tavlingstrikåer", label: "Tävlingstrikåer" },
      { href: "/collections/greppstrumpor", label: "Greppstrumpor" },
    ],
  },
  {
    title: "Kläder",
    links: [
      { href: "/collections/rashguards", label: "Rashguards" },
      { href: "/collections/brottarshorts", label: "Brottarshorts" },
      { href: "/collections/traningstrojor", label: "Träningströjor" },
      { href: "/collections/trikaset", label: "Trikåset" },
    ],
  },
  {
    title: "Tillbehör",
    links: [
      { href: "/collections/vaskor", label: "Väskor" },
      { href: "/collections/knaskydd", label: "Knäskydd" },
      { href: "/collections/handdukar", label: "Handdukar" },
      { href: "/collections/ledstod", label: "Ledstöd" },
    ],
  },
  {
    title: "Kollektioner",
    links: drops.map((drop) => ({
      href: `/collections/${drop.handle}`,
      label: drop.title,
    })),
  },
];

const groups: Record<string, { title: string; categories?: string[] }> = {
  herr: { title: "Herr" },
  "kamp-och-brottning": {
    title: "Kamp och brottning",
    categories: [
      "tavlingstrikåer",
      "brottarshorts",
      "brottarskor",
      "mattskor",
      "greppstrumpor",
    ],
  },
  traning: {
    title: "Träning",
    categories: ["rashguards", "traningstrojor", "brottarshorts", "trikaset"],
  },
  utrustning: {
    title: "Utrustning och tillbehör",
    categories: ["vaskor", "knaskydd", "handdukar", "ledstod", "greppstrumpor"],
  },
};

const categoryTitles: Record<string, string> = {
  brottarskor: "Brottarskor",
  mattskor: "Mattskor",
  "tavlingstrikåer": "Tävlingstrikåer",
  greppstrumpor: "Greppstrumpor",
  rashguards: "Rashguards",
  brottarshorts: "Brottarshorts",
  traningstrojor: "Träningströjor",
  trikaset: "Trikåset",
  vaskor: "Väskor",
  knaskydd: "Knäskydd",
  handdukar: "Handdukar",
  ledstod: "Ledstöd",
};

export function titleForHandle(handle: string): string | null {
  return (
    groups[handle]?.title ??
    drops.find((drop) => drop.handle === handle)?.title ??
    categoryTitles[handle] ??
    null
  );
}

type GroupedProduct = {
  categoryHandle?: string;
  collectionHandle?: string;
};

// null means the handle is not a real page. An empty list means the page exists but has no products.
export function productsForHandle<T extends GroupedProduct>(
  products: T[],
  handle: string,
): T[] | null {
  const group = groups[handle];
  if (group) {
    if (!group.categories) return products;
    return products.filter((product) =>
      group.categories?.includes(product.categoryHandle ?? ""),
    );
  }

  if (drops.some((drop) => drop.handle === handle)) {
    return products.filter((product) => product.collectionHandle === handle);
  }

  if (categoryTitles[handle]) {
    return products.filter((product) => product.categoryHandle === handle);
  }

  return null;
}
