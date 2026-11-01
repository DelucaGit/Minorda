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
