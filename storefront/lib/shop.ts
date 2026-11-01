import "server-only";

import { gql, type ShopifyScriptsI18n, type ShopifyScriptsShop } from "@shopify/hydrogen";

import { i18n, storeDomain } from "./env";
import { staticStorefrontClient } from "./storefront-static";

const SHOP_QUERY = gql(`
  query ShopIdentity {
    shop {
      id
    }
  }
`);

let shopIdPromise: Promise<string> | undefined;

// mock.shop has no SHOP_ID env var, so read the Shop GID from the API once.
function getShopId() {
  shopIdPromise ??= staticStorefrontClient.graphql(SHOP_QUERY).then(({ data, errors }) => {
    if (errors || !data?.shop.id) {
      shopIdPromise = undefined;
      throw new Error("Could not load the shop id from the Storefront API");
    }
    return data.shop.id;
  });
  return shopIdPromise;
}

// Built on the server and passed to the client as serialized props.
export async function getShopifyScriptsConfig(): Promise<{
  shop: ShopifyScriptsShop;
  i18n: ShopifyScriptsI18n;
}> {
  return {
    shop: {
      shopId: await getShopId(),
      // No provisioned Hydrogen storefront for mock.shop.
      storefrontId: "",
      myshopifyDomain: storeDomain,
    },
    i18n: { country: i18n.country, language: i18n.language },
  };
}
