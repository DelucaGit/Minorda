import "server-only";

import {
  createShopifyRequestContext,
  createStorefrontClient,
} from "@shopify/hydrogen";

import { i18n, publicStorefrontToken, storeDomain } from "./env";

// Module-scoped client for catalog reads that are the same for every visitor.
// mock.shop rejects private tokens, so this is a tokenless public client.
const requestContext = createShopifyRequestContext({
  request: { headers: new Headers() },
  i18n: { ...i18n },
});

export const staticStorefrontClient = createStorefrontClient({
  type: "public",
  requestContext,
  config: { storeDomain, publicStorefrontToken },
});
