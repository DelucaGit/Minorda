import "server-only";

import {
  createShopifyRequestContext,
  createStorefrontClient,
} from "@shopify/hydrogen";
import { headers } from "next/headers";
import { cache } from "react";

import { i18n, publicStorefrontToken, storeDomain } from "./env";

// Request-scoped public client for personalized reads (cart) and pages that
// read request data. Public + tokenless is all mock.shop supports.
export const getStorefrontClient = cache(async () => {
  const requestHeaders = await headers();
  const requestContext = createShopifyRequestContext({
    request: { headers: requestHeaders },
    i18n: { ...i18n },
  });

  return createStorefrontClient({
    type: "public",
    requestContext,
    config: { storeDomain, publicStorefrontToken },
  });
});
