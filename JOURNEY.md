# Minorda journey

A running log of what we build, what we decide, and why. This is source material for a later article, so each entry should say what happened and the reason behind it.

## 2026-11-01 — Saved the design prototype

The project folder only had a README. The real starting point is a set of HTML pages exported from a design tool. They show the look of the store. They are not a working shop: links go to `#`, and there is no shared cart or product data.

**Decision:** keep those pages untouched in `design-prototype/`, with names that match the screen.

| File | Screen |
| --- | --- |
| `home.html` | Home. Hero, categories, product drops, durability, newsletter. |
| `shop.html` | Shop all. Filters and product grid. |
| `product.html` | Product page for the Apex Pro Performance Tee. |
| `checkout-shipping.html` | Checkout step 1. Contact, address, shipping method. |
| `checkout-payment.html` | Checkout step 2. Payment and order review. |

**Why this shape:** renaming the temp files (`code (1).html` and so on) makes the set readable later. Leaving the HTML as exported means we still have the original design when we build the real site. The checkout pages use fake sample customers and card numbers. Those stay inside the prototype only. A real payment form is a later decision, and card numbers should never be stored by our own code.

`product.html` and `shop.html` are much larger than the other three because the export embedded images in the file. `home.html` and the checkout pages point at external image URLs instead.

**Not done yet:** no shared layout, no real navigation between pages, no Shopify store. Next step is still open.

## 2026-11-01 — Picked the stack: Next.js plus Hydrogen 2026-10

**Decision:** the storefront is a Next.js app (App Router, TypeScript, Tailwind) in `storefront/`. Shopify is the backend, reached only through Hydrogen `2026-10` (`@shopify/hydrogen` 2026.10.x). Until a real Shopify store exists, the catalog comes from the public demo store `apparel-athleisure.mock.shop`.

**What we are not building:** no Java, no second backend, no database of our own, no SQL. No card form either. Payment, address, and shipping method stay on Shopify Checkout, and the checkout pages in `design-prototype/` are only a look-and-feel reference.

**Security rules we keep from day one:**

- Private tokens stay server-only. They never get a `NEXT_PUBLIC_` prefix, and `.env` stays gitignored. mock.shop needs no token at all.
- Shopify text renders as React text. No `dangerouslySetInnerHTML`.
- Visitor input, like search text, goes into GraphQL variables, never into the query string.

**Why:** Shopify already runs the catalog, cart, and checkout. Building our own backend would mean storing orders and payment data we don't need to hold. Hydrogen gives Next.js the cart and checkout handlers, so the site stays one app.

## 2026-11-01 — Scaffolded the storefront and proved the catalog

**What changed:** `storefront/` is a Next.js 16 app (App Router, TypeScript, Tailwind, ESLint, `@/` alias) with `@shopify/hydrogen` 2026.10.2 on Node 24. `.env` points at `apparel-athleisure.mock.shop` with the token line commented out, and `.env` is gitignored (`.env.example` is committed). Hydrogen is wired the way its packaged skills describe: env read only in server modules (`lib/env.ts`), an empty route template manifest (we use Shopify's default paths), a tokenless public Storefront client, `proxy.ts` running `handleShopifyRoutes` with the cart handlers before Next routing, and `app/not-found.tsx` checking Shopify redirects only after a 404. The first page lists `products(first: 8)` from mock.shop with `formatMoney`. `/graphiql` answers 200.

**Why some things differ from the guide:**

- `npx @shopify/hydrogen setup` failed on Windows with `spawn npm ENOENT` when it tried to install the package. We installed `@shopify/hydrogen@latest` with npm ourselves and ran `setup` again, which then only synced the skills.
- `hydrogen gql check` fails on Windows in 2026.10.2: it hands gql.tada an absolute `C:\...` schema path, gql.tada reads `C:` as a URL scheme and tries to download it. `scripts/gql-check.mjs` runs the real `hydrogen gql check --fail-on-warn` on macOS/Linux, and on Windows runs the same gql.tada check with a relative schema path. It is chained into `npm run typecheck`, and we confirmed it fails on a made-up field.
- `cacheComponents` is off. The `/cart` page has to show items without JavaScript, and Cache Components would stream request-time data behind a Suspense fallback that a no-JS browser never replaces. Pages render on the server per request instead.

## 2026-11-01 — Shared chrome: tokens, fonts, header, footer

**What changed:** the Minorda colors from `design-prototype/home.html` (blue `#0047ff`, volt lime `#c3f400`, text `#0f172a`, muted `#475569`, borders `#e2e8f0`) are Tailwind theme tokens in `app/globals.css`. Space Grotesk (headings) and Chivo (body) load through `next/font`, so no CDN script or font link. Every page now shares one header (dark announcement bar, then a white bar with MINORDA, a Shop link to `/collections`, a search form that submits `GET /search?q=`, and a Cart link to `/cart`) and one footer (dark band, "Progress isn't linear.", and `ops@minorda.com` as a plain mailto link). `/collections`, `/search`, and `/cart` exist as plain pages for now.

**Why:** the prototype's announcement bar promises free shipping over $99. We have no shipping policy from Shopify yet, so the bar carries the brand line and says the catalog is a demo instead. The wishlist heart, account icon, and newsletter form are left out because wishlists, accounts, and storing messages are out of scope.

## 2026-11-01 — Home page rebuilt from the prototype

**What changed:** `/` now follows `design-prototype/home.html` in order: hero, marquee, doctrine, category grid, product row, durability, and the closing band. One Storefront API query loads collections and `products(first: 8)`. The hero card, the product row, and every image, title, and price on the page come from that query; prices go through Hydrogen's `formatMoney`.

**Category tiles:** the four prototype labels stay. A tile links to a real `/collections/{handle}` only when the API returns a collection whose title or handle matches it. Today only "Shirts & Rashguards" matches (`versatile-performance-tops`); the other three link to `/collections`, because mock.shop has no singlets, fight shorts, or footwear collections.

**What we dropped from the prototype, and why:** the made-up product names and prices (Apex Pro tee and friends), the "new drop / low stock (3 left)" badges, the size pills and quick filters on product cards, the spec badges (240 GSM, 3.8x evaporation), and the NCAA/UWW compliance claims. None of that comes from the catalog, and the plan says not to invent prices, stock, or filters. The newsletter strip is gone too, since we don't store messages. The prototype's stock photos are external images that aren't ours, so tiles without a matching collection show a numbered block instead.

## 2026-11-01 — Shop, search, and product pages

**What changed:** `/collections` lists the store's collections plus every product, with a "Next page" link that uses `?after=`. `/collections/{handle}` and `/search?q=` share one browser built on Hydrogen's collection helpers: a plain GET form (it works without JavaScript), sort, filter checkboxes and price inputs, removable filter chips, and next-page links. Changing a filter or sort always goes back to page one. The search term only reaches Shopify as a GraphQL variable. Search sorts only by relevance or price, since that is all Shopify's search supports. An empty search makes no API call and shows a prompt instead.

**Product page:** `/products/{handle}` shows the gallery (the chosen variant's image first), price, option buttons, and add to cart, all through Hydrogen's product form. Picking an option updates the URL (`?Color=Moss&Size=M`), so a variant can be shared and reloaded. Combinations that don't exist are shown greyed out. A product or collection that doesn't exist returns a real 404.

**Cart wiring:** the root layout now reads the cart on the server and hands it to Hydrogen's cart provider. Shopify's small runtime script is loaded (Standard Actions, which cart forms need), with analytics and WebMCP switched off. The header shows "Cart (n)".

**About filters:** the demo catalog (mock.shop) returns no filters for any collection or search, so the filter column shows only sorting today. The filter code is generic: it draws whatever filters Shopify sends, so filters appear on their own once a real store has them. We don't make up filters.

**Checked:** in headless Chrome, choosing Moss / M changed the URL, and add to cart turned "Cart (0)" into "Cart (1)" with no console errors. Sorting by price works on a collection and in search.
