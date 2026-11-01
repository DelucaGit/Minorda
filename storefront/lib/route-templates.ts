import { createShopifyRouteTemplates } from "@shopify/hydrogen";

// Shopify standard storefront routes are handled at their default paths
// (/products/:handle, /collections, /collections/:handle, /search, /cart).
// Add entries here only if the app moves a Shopify resource to a custom path.
export const routeTemplates = createShopifyRouteTemplates({});
