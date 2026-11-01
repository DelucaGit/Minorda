import { formatMoney, gql } from "@shopify/hydrogen";

import { LOCALE } from "@/lib/env";
import { staticStorefrontClient } from "@/lib/storefront-static";

const PRODUCTS_QUERY = gql(`
  query Products {
    products(first: 8) {
      nodes {
        id
        title
        handle
        priceRange {
          minVariantPrice {
            amount
            currencyCode
          }
        }
      }
    }
  }
`);

export default async function Home() {
  const { data, errors } = await staticStorefrontClient.graphql(PRODUCTS_QUERY);
  if (errors) {
    console.error("[hydrogen] Products query failed", errors);
    throw new Error("Products query failed");
  }
  const products = data?.products.nodes ?? [];

  return (
    <main>
      <h1>Products</h1>
      <ul>
        {products.map((product) => (
          <li key={product.id}>
            <h2>{product.title}</h2>
            <p>
              {formatMoney(product.priceRange.minVariantPrice, { locale: LOCALE }).toString()}
            </p>
          </li>
        ))}
      </ul>
    </main>
  );
}
