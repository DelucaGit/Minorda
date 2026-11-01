import { createCartServerHandlers } from "@shopify/hydrogen";

// Hydrogen's cart server handlers own /api/cart. No customer session: customer
// accounts are out of scope and mock.shop has no Customer Account API.
export const cartHandlers = createCartServerHandlers();
