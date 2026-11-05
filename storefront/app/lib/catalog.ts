// Public catalog read. apparel-athleisure.mock.shop does not use a token.
// Titles, photos, and prices come from this response. We do not invent them.

const CATALOG_URL =
  "https://apparel-athleisure.mock.shop/api/2026-10/graphql.json";

export type CatalogProduct = {
  id: string;
  handle: string;
  title: string;
  description: string;
  price: string;
  imageUrl: string | null;
  imageAlt: string;
};

type Money = { amount: string; currencyCode: string };

type ProductNode = {
  id: string;
  handle: string;
  title: string;
  description?: string | null;
  featuredImage?: {
    url: string;
    altText?: string | null;
  } | null;
  priceRange?: { minVariantPrice?: Money | null } | null;
};

type CatalogPayload = {
  data?: {
    products?: { nodes?: ProductNode[] };
    product?: ProductNode | null;
  };
  errors?: Array<{ message?: string }>;
};

const PRODUCT_FIELDS = `
  id
  handle
  title
  description
  featuredImage { url altText }
  priceRange { minVariantPrice { amount currencyCode } }
`;

function formatPrice(amount: string, currencyCode: string): string {
  const value = Number(amount);
  if (!Number.isFinite(value)) return `${amount} ${currencyCode}`;

  try {
    return new Intl.NumberFormat("sv-SE", {
      style: "currency",
      currency: currencyCode,
    }).format(value);
  } catch {
    return `${amount} ${currencyCode}`;
  }
}

function toProduct(node: ProductNode): CatalogProduct {
  const money = node.priceRange?.minVariantPrice;
  return {
    id: node.id,
    handle: node.handle,
    title: node.title,
    description: node.description ?? "",
    price: money ? formatPrice(money.amount, money.currencyCode) : "Pris saknas",
    imageUrl: node.featuredImage?.url ?? null,
    imageAlt: node.featuredImage?.altText || node.title,
  };
}

async function storefront(
  query: string,
  variables?: Record<string, string | number>,
): Promise<CatalogPayload> {
  let response: Response;
  try {
    response = await fetch(CATALOG_URL, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ query, variables }),
      next: { revalidate: 3600 },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Kunde inte nå katalogen: ${message}`);
  }

  if (!response.ok) {
    throw new Error(
      `Katalogen svarade ${response.status} ${response.statusText}`,
    );
  }

  const payload = (await response.json()) as CatalogPayload;
  if (payload.errors?.length) {
    const message = payload.errors
      .map((error) => error.message)
      .filter(Boolean)
      .join("; ");
    throw new Error(message || "Katalogen returnerade ett fel");
  }

  return payload;
}

export async function loadProducts(first = 8): Promise<CatalogProduct[]> {
  const payload = await storefront(
    `query Products($first: Int!) {
      products(first: $first) { nodes { ${PRODUCT_FIELDS} } }
    }`,
    { first },
  );

  return (payload.data?.products?.nodes ?? [])
    .filter((product) => product.featuredImage?.url)
    .map(toProduct);
}

export async function loadProduct(
  handle: string,
): Promise<CatalogProduct | null> {
  const payload = await storefront(
    `query Product($handle: String!) {
      product(handle: $handle) { ${PRODUCT_FIELDS} }
    }`,
    { handle },
  );

  const product = payload.data?.product;
  if (!product) return null;
  return toProduct(product);
}

export async function searchProducts(query: string): Promise<CatalogProduct[]> {
  const payload = await storefront(
    `query SearchProducts($query: String!) {
      products(first: 12, query: $query) { nodes { ${PRODUCT_FIELDS} } }
    }`,
    { query },
  );

  return (payload.data?.products?.nodes ?? []).map(toProduct);
}
