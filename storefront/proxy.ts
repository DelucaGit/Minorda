import {
  createShopifyRequestContext,
  createStorefrontClient,
  handleShopifyRoutes,
} from "@shopify/hydrogen";
import { NextResponse, type NextRequest } from "next/server";

import { cartHandlers } from "@/lib/cart-handlers";
import { i18n, publicStorefrontToken, storeDomain } from "@/lib/env";
import { routeTemplates } from "@/lib/route-templates";

// Hydrogen's request handlers run before Next routing: /api/cart, the
// Storefront API proxy, /checkout, cart permalinks (/cart/{id}:{qty}),
// /graphiql in development, and ?variant= product redirects.
export function proxy(request: NextRequest) {
  const requestContext = createShopifyRequestContext({
    request,
    i18n: { ...i18n },
  });
  const storefrontClient = createStorefrontClient({
    type: "public",
    requestContext,
    config: { storeDomain, publicStorefrontToken },
  });

  const shopifyRoute = handleShopifyRoutes({
    request,
    requestContext,
    storefrontClient,
    routeTemplates,
    handlers: [cartHandlers],
  });
  if (shopifyRoute) return shopifyRoute;

  const requestHeaders = requestContext.getForwardedRequestHeaders();
  const response = NextResponse.next({ request: { headers: requestHeaders } });
  requestContext.applyResponseHeaders(response.headers);
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|_next/data|favicon.ico).*)"],
};
