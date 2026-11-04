// Live products for the clothing-rail try-out.
// This is a public read of apparel-athleisure.mock.shop. There is no token.
// The finished storefront will use the Hydrogen client. This file only exists
// so we can see the rack with real titles, prices, and photos.

const STORE_DOMAIN = "apparel-athleisure.mock.shop";
const CATALOG_URL = `https://${STORE_DOMAIN}/api/2026-10/graphql.json`;

const RAIL_PRODUCTS_QUERY = `
  query RailProducts {
    products(first: 14) {
      nodes {
        id
        handle
        title
        featuredImage {
          url
          altText
          width
          height
        }
        priceRange {
          minVariantPrice {
            amount
            currencyCode
          }
        }
      }
    }
  }
`;

export type HangingGarment = {
  id: string;
  handle: string;
  title: string;
  price: string;
  imageUrl: string;
  imageAlt: string;
  imageWidth: number;
  imageHeight: number;
};

type CatalogResponse = {
  data?: {
    products?: {
      nodes?: Array<{
        id: string;
        handle: string;
        title: string;
        featuredImage?: {
          url: string;
          altText?: string | null;
          width?: number | null;
          height?: number | null;
        } | null;
        priceRange?: {
          minVariantPrice?: {
            amount: string;
            currencyCode: string;
          } | null;
        } | null;
      }>;
    };
  };
  errors?: Array<{ message?: string }>;
};

function formatPrice(amount: string, currencyCode: string): string {
  const value = Number(amount);
  if (!Number.isFinite(value)) {
    return `${amount} ${currencyCode}`;
  }

  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currencyCode,
    }).format(value);
  } catch {
    return `${amount} ${currencyCode}`;
  }
}

export async function loadRailGarments(): Promise<HangingGarment[]> {
  let response: Response;
  try {
    response = await fetch(CATALOG_URL, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ query: RAIL_PRODUCTS_QUERY }),
      next: { revalidate: 3600 },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Could not reach mock.shop: ${message}`);
  }

  if (!response.ok) {
    throw new Error(
      `mock.shop responded ${response.status} ${response.statusText}`,
    );
  }

  const payload = (await response.json()) as CatalogResponse;
  if (payload.errors?.length) {
    const message = payload.errors
      .map((error) => error.message)
      .filter(Boolean)
      .join("; ");
    throw new Error(message || "mock.shop returned a GraphQL error");
  }

  const nodes = payload.data?.products?.nodes ?? [];

  return nodes
    .filter((product) => {
      if (!product.featuredImage?.url) return false;
      // The rail is for clothes. The demo catalog also includes a Pilates mat.
      return !/pilates mat/i.test(product.title);
    })
    .slice(0, 10)
    .map((product) => {
      const image = product.featuredImage!;
      const price = product.priceRange?.minVariantPrice;
      return {
        id: product.id,
        handle: product.handle,
        title: product.title,
        price: price
          ? formatPrice(price.amount, price.currencyCode)
          : "Price unavailable",
        imageUrl: image.url,
        imageAlt: image.altText || product.title,
        imageWidth: image.width || 768,
        imageHeight: image.height || 1344,
      };
    });
}
