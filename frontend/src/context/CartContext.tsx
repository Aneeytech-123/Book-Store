import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Book, CartItem } from "../types";

const CART_KEY = "shelflife.cart";
const MAX_QTY = 10;

interface CartState {
  items: CartItem[];
  count: number;
  subtotal: number;
  add: (book: Book) => void;
  setQuantity: (bookId: string, qty: number) => void;
  remove: (bookId: string) => void;
  clear: () => void;
}

const CartContext = createContext<CartState | null>(null);

function loadCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(CART_KEY);
    const parsed = raw ? (JSON.parse(raw) as CartItem[]) : [];
    return Array.isArray(parsed) ? parsed.filter((i) => i?.book?.id && i.quantity > 0) : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(loadCart);

  useEffect(() => {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(items));
    } catch {
      /* storage unavailable */
    }
  }, [items]);

  const add = useCallback((book: Book) => {
    setItems((cur) => {
      const found = cur.find((i) => i.book.id === book.id);
      if (found) return cur.map((i) => (i.book.id === book.id ? { ...i, quantity: Math.min(MAX_QTY, i.quantity + 1) } : i));
      return [...cur, { book, quantity: 1 }];
    });
  }, []);

  const setQuantity = useCallback((bookId: string, qty: number) => {
    setItems((cur) =>
      qty <= 0 ? cur.filter((i) => i.book.id !== bookId) : cur.map((i) => (i.book.id === bookId ? { ...i, quantity: Math.min(MAX_QTY, qty) } : i))
    );
  }, []);

  const remove = useCallback((bookId: string) => setItems((cur) => cur.filter((i) => i.book.id !== bookId)), []);
  const clear = useCallback(() => setItems([]), []);

  const value = useMemo(() => {
    const count = items.reduce((n, i) => n + i.quantity, 0);
    const subtotal = items.reduce((n, i) => n + i.quantity * i.book.price, 0);
    return { items, count, subtotal, add, setQuantity, remove, clear };
  }, [items, add, setQuantity, remove, clear]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
