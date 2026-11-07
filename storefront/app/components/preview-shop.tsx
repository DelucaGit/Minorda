"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

// Local preview only. Shopify never sees these lines.
// A real store uses Shopify's cart, which needs a real variant id.

const CART_KEY = "minorda-preview-cart";
const FAVORITE_KEY = "minorda-preview-favorites";

export type PreviewCartLine = {
  handle: string;
  size: string;
  quantity: number;
};

type PreviewShop = {
  cart: PreviewCartLine[];
  favorites: string[];
  cartCount: number;
  addToCart: (handle: string, size: string) => void;
  setQuantity: (handle: string, size: string, quantity: number) => void;
  removeFromCart: (handle: string, size: string) => void;
  clearCart: () => void;
  toggleFavorite: (handle: string) => void;
  isFavorite: (handle: string) => boolean;
};

const PreviewShopContext = createContext<PreviewShop | null>(null);

function readList<T>(key: string): T[] {
  try {
    const value = JSON.parse(localStorage.getItem(key) ?? "[]") as T[];
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

export function PreviewShopProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<PreviewCartLine[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setCart(readList<PreviewCartLine>(CART_KEY));
    setFavorites(readList<string>(FAVORITE_KEY));
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }, [cart, ready]);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(FAVORITE_KEY, JSON.stringify(favorites));
  }, [favorites, ready]);

  const shop = useMemo<PreviewShop>(() => {
    return {
      cart,
      favorites,
      cartCount: cart.reduce((sum, line) => sum + line.quantity, 0),
      addToCart(handle, size) {
        setCart((current) => {
          const existing = current.find(
            (line) => line.handle === handle && line.size === size,
          );
          if (!existing) return [...current, { handle, size, quantity: 1 }];
          return current.map((line) =>
            line.handle === handle && line.size === size
              ? { ...line, quantity: line.quantity + 1 }
              : line,
          );
        });
      },
      setQuantity(handle, size, quantity) {
        setCart((current) =>
          current.flatMap((line) => {
            if (line.handle !== handle || line.size !== size) return [line];
            if (quantity < 1) return [];
            return [{ ...line, quantity }];
          }),
        );
      },
      removeFromCart(handle, size) {
        setCart((current) =>
          current.filter((line) => line.handle !== handle || line.size !== size),
        );
      },
      clearCart() {
        setCart([]);
      },
      toggleFavorite(handle) {
        setFavorites((current) =>
          current.includes(handle)
            ? current.filter((item) => item !== handle)
            : [...current, handle],
        );
      },
      isFavorite(handle) {
        return favorites.includes(handle);
      },
    };
  }, [cart, favorites]);

  return (
    <PreviewShopContext.Provider value={shop}>
      {children}
    </PreviewShopContext.Provider>
  );
}

export function usePreviewShop(): PreviewShop {
  const shop = useContext(PreviewShopContext);
  if (!shop) {
    throw new Error("usePreviewShop must be used inside PreviewShopProvider");
  }
  return shop;
}
