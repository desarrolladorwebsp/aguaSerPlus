"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import type { CartItem } from "@/types/cart";

const STORAGE_KEY = "aguaser-cart";
const CART_EVENT = "aguaser-cart-change";

type AddItemInput = Omit<CartItem, "qty"> & { qty?: number };

type CartContextValue = {
  items: CartItem[];
  isOpen: boolean;
  hydrated: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addItem: (item: AddItemInput, options?: { open?: boolean }) => void;
  removeItem: (productId: string) => void;
  setQty: (productId: string, qty: number) => void;
  clear: () => void;
  totalItems: number;
  subtotal: number;
};

type CartSnapshot = {
  items: CartItem[];
  isOpen: boolean;
};

const CartContext = createContext<CartContextValue | null>(null);

let memorySnapshot: CartSnapshot = { items: [], isOpen: false };
let hasHydratedFromStorage = false;

function parseItems(raw: string | null): CartItem[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as CartItem[];
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item) =>
        item &&
        typeof item.productId === "string" &&
        typeof item.name === "string" &&
        typeof item.image === "string" &&
        typeof item.price === "number" &&
        typeof item.qty === "number" &&
        item.qty > 0,
    );
  } catch {
    return [];
  }
}

function ensureHydrated() {
  if (hasHydratedFromStorage || typeof window === "undefined") return;
  memorySnapshot = {
    items: parseItems(window.localStorage.getItem(STORAGE_KEY)),
    isOpen: false,
  };
  hasHydratedFromStorage = true;
}

function emitCartChange() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(CART_EVENT));
}

function writeItems(items: CartItem[]) {
  ensureHydrated();
  memorySnapshot = { ...memorySnapshot, items };
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  emitCartChange();
}

function writeOpen(isOpen: boolean) {
  ensureHydrated();
  memorySnapshot = { ...memorySnapshot, isOpen };
  emitCartChange();
}

function subscribe(onStoreChange: () => void) {
  if (typeof window === "undefined") return () => {};
  const handler = () => onStoreChange();
  window.addEventListener(CART_EVENT, handler);
  window.addEventListener("storage", handler);
  return () => {
    window.removeEventListener(CART_EVENT, handler);
    window.removeEventListener("storage", handler);
  };
}

function getSnapshot(): CartSnapshot {
  ensureHydrated();
  return memorySnapshot;
}

const EMPTY_SNAPSHOT: CartSnapshot = { items: [], isOpen: false };

function getServerSnapshot(): CartSnapshot {
  return EMPTY_SNAPSHOT;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const snapshot = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  // Real hydration flag: flips to true only once mounted on the client, one
  // tick after the initial hydration render. Consumers (e.g. checkout) rely
  // on this to avoid acting on the empty server snapshot before the store
  // has synced with localStorage.
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    setHydrated(true);
  }, []);

  const openCart = useCallback(() => writeOpen(true), []);
  const closeCart = useCallback(() => writeOpen(false), []);
  const toggleCart = useCallback(
    () => writeOpen(!getSnapshot().isOpen),
    [],
  );

  const addItem = useCallback(
    (item: AddItemInput, options?: { open?: boolean }) => {
      const qtyToAdd = Math.min(99, Math.max(1, item.qty ?? 1));
      const prev = getSnapshot().items;
      const existing = prev.find((p) => p.productId === item.productId);
      const next = existing
        ? prev.map((p) =>
            p.productId === item.productId
              ? { ...p, qty: Math.min(99, p.qty + qtyToAdd) }
              : p,
          )
        : [
            ...prev,
            {
              productId: item.productId,
              name: item.name,
              image: item.image,
              price: item.price,
              qty: qtyToAdd,
            },
          ];
      writeItems(next);

      const isDesktop =
        typeof window !== "undefined" &&
        window.matchMedia("(min-width: 1024px)").matches;
      const shouldOpen = options?.open ?? isDesktop;
      if (shouldOpen) writeOpen(true);
    },
    [],
  );

  const removeItem = useCallback((productId: string) => {
    writeItems(getSnapshot().items.filter((p) => p.productId !== productId));
  }, []);

  const setQty = useCallback((productId: string, qty: number) => {
    const nextQty = Math.min(99, Math.max(0, Math.floor(qty)));
    const prev = getSnapshot().items;
    writeItems(
      nextQty <= 0
        ? prev.filter((p) => p.productId !== productId)
        : prev.map((p) =>
            p.productId === productId ? { ...p, qty: nextQty } : p,
          ),
    );
  }, []);

  const clear = useCallback(() => writeItems([]), []);

  const totalItems = useMemo(
    () => snapshot.items.reduce((sum, item) => sum + item.qty, 0),
    [snapshot.items],
  );

  const subtotal = useMemo(
    () =>
      snapshot.items.reduce((sum, item) => sum + item.price * item.qty, 0),
    [snapshot.items],
  );

  const value = useMemo(
    () => ({
      items: snapshot.items,
      isOpen: snapshot.isOpen,
      hydrated,
      openCart,
      closeCart,
      toggleCart,
      addItem,
      removeItem,
      setQty,
      clear,
      totalItems,
      subtotal,
    }),
    [
      snapshot.items,
      snapshot.isOpen,
      hydrated,
      openCart,
      closeCart,
      toggleCart,
      addItem,
      removeItem,
      setQty,
      clear,
      totalItems,
      subtotal,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within CartProvider");
  }
  return ctx;
}
