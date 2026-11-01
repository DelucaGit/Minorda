import { formatMoney, type MoneyV2 } from "@shopify/hydrogen";

// Single-market storefront: one fixed locale so server and client agree.
export const LOCALE = "en-US";

export function formatPrice(money: MoneyV2): string {
  return formatMoney(money, { locale: LOCALE }).toString();
}

export function formatPriceRange(min: MoneyV2, max: MoneyV2): string {
  if (min.amount === max.amount) return formatPrice(min);
  return formatMoney([min, max], { locale: LOCALE }).toString();
}
