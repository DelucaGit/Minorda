import { gql } from "@shopify/hydrogen";

import { PRODUCT_CARD_FRAGMENT } from "./product-card";

export const PAGE_SIZE = 24;

export const FILTER_FIELDS_FRAGMENT = gql(`
  fragment FilterFields on Filter {
    id
    label
    type
    presentation
    values {
      id
      label
      count
      input
    }
  }
`);

export const ALL_PRODUCTS_QUERY = gql(
  `
  query AllProducts($first: Int!, $after: String, $country: CountryCode, $language: LanguageCode)
  @inContext(country: $country, language: $language) {
    collections(first: 20) {
      nodes {
        id
        handle
        title
        image {
          url
          altText
        }
      }
    }
    products(first: $first, after: $after) {
      nodes {
        ...ProductCard
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`,
  [PRODUCT_CARD_FRAGMENT],
);

export const COLLECTION_QUERY = gql(
  `
  query Collection(
    $handle: String!
    $first: Int!
    $after: String
    $filters: [ProductFilter!]
    $sortKey: ProductCollectionSortKeys
    $reverse: Boolean
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    shop {
      paymentSettings {
        currencyCode
      }
    }
    collection(handle: $handle) {
      id
      handle
      title
      description
      products(first: $first, after: $after, filters: $filters, sortKey: $sortKey, reverse: $reverse) {
        filters {
          ...FilterFields
        }
        nodes {
          ...ProductCard
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
  }
`,
  [PRODUCT_CARD_FRAGMENT, FILTER_FIELDS_FRAGMENT],
);

// Visitor search text arrives only through the $term variable.
export const SEARCH_QUERY = gql(
  `
  query Search(
    $term: String!
    $first: Int!
    $after: String
    $filters: [ProductFilter!]
    $sortKey: SearchSortKeys
    $reverse: Boolean
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    shop {
      paymentSettings {
        currencyCode
      }
    }
    search(
      query: $term
      first: $first
      after: $after
      productFilters: $filters
      sortKey: $sortKey
      reverse: $reverse
      types: [PRODUCT]
    ) {
      totalCount
      productFilters {
        ...FilterFields
      }
      nodes {
        __typename
        ... on Product {
          ...ProductCard
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`,
  [PRODUCT_CARD_FRAGMENT, FILTER_FIELDS_FRAGMENT],
);
