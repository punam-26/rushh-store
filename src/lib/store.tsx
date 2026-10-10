"use client";
import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { bySlug } from "./products";

export type Address = { name: string; phone: string; line1: string; city: string; state: string; pin: string };
export type OrderLine = { slug: string; name: string; brand: string; qty: number; price: number };
export type Order = {
  id: string; date: string; lines: OrderLine[]; subtotal: number; discount: number; total: number;
  address: Address; payment: string; status: string;
};
export type User = { name: string; email: string } | null;
type State = { cart: { slug: string; qty: number }[]; wishlist: string[]; user: User; orders: Order[]; coupon: string | null };

const EMPTY: State = { cart: [], wishlist: [], user: null, orders: [], coupon: null };
const KEY = "rushh:v1";
export const COUPONS: Record<string, number> = { RUSHH10: 0.1 };

type Ctx = State & {
  ready: boolean; cartCount: number; toastMsg: string | null;
  add: (slug: string, qty?: number) => void; setQty: (slug: string, qty: number) => void; remove: (slug: string) => void;
  toggleWish: (slug: string) => void; applyCoupon: (code: string) => boolean; login: (u: NonNullable<User>) => void;
  logout: () => void; placeOrder: (o: Omit<Order, "id" | "date" | "status">) => Order; toast: (m: string) => void;
};
const StoreCtx = createContext<Ctx | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [s, setS] = useState<State>(EMPTY);
  const [ready, setReady] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  useEffect(() => {
    try { const raw = localStorage.getItem(KEY); if (raw) setS({ ...EMPTY, ...JSON.parse(raw) }); } catch {}
    setReady(true);
  }, []);
  useEffect(() => { if (ready) try { localStorage.setItem(KEY, JSON.stringify(s)); } catch {} }, [s, ready]);

  const toast = useCallback((m: string) => { setToastMsg(m); window.setTimeout(() => setToastMsg(null), 2200); }, []);
  const add = useCallback((slug: string, qty = 1) => {
    setS((p) => {
      const ex = p.cart.find((l) => l.slug === slug);
      const cart = ex ? p.cart.map((l) => (l.slug === slug ? { ...l, qty: Math.min(10, l.qty + qty) } : l)) : [...p.cart, { slug, qty }];
      return { ...p, cart };
    });
    toast(`${bySlug(slug)?.name ?? "Item"} added to your bag`);
  }, [toast]);
  const setQty = useCallback((slug: string, qty: number) =>
    setS((p) => ({ ...p, cart: qty < 1 ? p.cart.filter((l) => l.slug !== slug) : p.cart.map((l) => (l.slug === slug ? { ...l, qty: Math.min(10, qty) } : l)) })), []);
  const remove = useCallback((slug: string) => setS((p) => ({ ...p, cart: p.cart.filter((l) => l.slug !== slug) })), []);
  const toggleWish = useCallback((slug: string) =>
    setS((p) => ({ ...p, wishlist: p.wishlist.includes(slug) ? p.wishlist.filter((x) => x !== slug) : [...p.wishlist, slug] })), []);
  const applyCoupon = useCallback((code: string) => {
    const c = code.trim().toUpperCase();
    if (!(c in COUPONS)) return false;
    setS((p) => ({ ...p, coupon: c })); toast(`Coupon ${c} applied`); return true;
  }, [toast]);
  const login = useCallback((user: NonNullable<User>) => setS((p) => ({ ...p, user })), []);
  const logout = useCallback(() => setS((p) => ({ ...p, user: null })), []);
  const placeOrder = useCallback((o: Omit<Order, "id" | "date" | "status">) => {
    const order: Order = { ...o, id: "RSH" + Date.now().toString().slice(-8), date: new Date().toISOString(), status: "Confirmed" };
    setS((p) => ({ ...p, orders: [order, ...p.orders], cart: [], coupon: null }));
    return order;
  }, []);

  const value = useMemo<Ctx>(() => ({
    ...s, ready, toastMsg, cartCount: s.cart.reduce((n, l) => n + l.qty, 0),
    add, setQty, remove, toggleWish, applyCoupon, login, logout, placeOrder, toast,
  }), [s, ready, toastMsg, add, setQty, remove, toggleWish, applyCoupon, login, logout, placeOrder, toast]);

  return (
    <StoreCtx.Provider value={value}>
      {children}
      <div aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-6 z-50 flex justify-center px-4">
        {toastMsg && <div className="rounded-full bg-ink px-5 py-3 text-sm font-medium text-bg shadow-lg">{toastMsg}</div>}
      </div>
    </StoreCtx.Provider>
  );
}
export function useStore() {
  const c = useContext(StoreCtx);
  if (!c) throw new Error("useStore must be used inside StoreProvider");
  return c;
}

export function useCartLines() {
  const { cart, coupon } = useStore();
  const lines = cart.flatMap((l) => { const p = bySlug(l.slug); return p ? [{ product: p, qty: l.qty }] : []; });
  const subtotal = lines.reduce((n, l) => n + l.product.price * l.qty, 0);
  const discount = coupon ? Math.round(subtotal * (COUPONS[coupon] ?? 0)) : 0;
  return { lines, subtotal, discount, total: subtotal - discount, coupon };
}
