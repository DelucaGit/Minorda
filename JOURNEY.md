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

## 2026-11-04 — Tried a clothing rail

The client asked if products could hang the way clothes hang on a wardrobe rail, and if a shopper could move along them as if they were standing in the store.

**Decision:** build a try-out on the home page before treating it as part of the real shop. The motion has three parts. The row slides sideways. The piece nearest the middle turns to face you. A fast slide swings every piece from its hook, then a spring lets it settle.

**Why the photos hang as cards:** the demo catalog photos are studio shots with backgrounds. They are not cut out around the garment. Hanging the whole photo on a metal hanger tells us whether the *movement* feels right. Bare clothes on a rail need different photos later.

**What we left out on purpose:** this is not the finished home page from the plan. Titles, prices, and images come from `apparel-athleisure.mock.shop`. A Pilates mat in that catalog is skipped because it is not a garment. No prices or names were invented. The Hydrogen client is not wired yet, so this page reads the public catalog directly and formats the price with `Intl.NumberFormat`.

## 2026-11-05 — Swedish flagship replaces the rail try-out

The owner sent a new Stitch export, `minorda_flagship_storefront_svenska`. That screen is now the home page. The interface is Swedish. The slogan stays in English, exactly as written: Progress isn't linear. Rise is never flat.

**Why the product row still uses the catalog:** the big campaign cards (Apex, Vanguard, Kinetic) are design photos and marketing lines. They are not SKUs. “Populärt just nu” shows live titles, photos, and prices. The demo catalog is priced in USD, so the header says USD instead of pretending the prices are kronor.

**What we did not copy:** the checkout screen in the zip, the sample cart with two invented lines, wishlist counts, and stock badges such as “3 left”. Payment stays on Shopify later. The clothing rail try-out is no longer the home page.
