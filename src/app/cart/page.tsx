"use client";
import Link from "next/link";
import { useState } from "react";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import ProductImage from "@/components/ProductImage";
import { useCartLines, useStore } from "@/lib/store";
import { inr } from "@/lib/format";

export default function Cart() {
  const { ready, setQty, remove, applyCoupon } = useStore();
  const { lines, subtotal, discount, total, coupon } = useCartLines();
  const [code, setCode] = useState("");
  const [err, setErr] = useState("");
  if (!ready) return <div className="py-32" />;
  if (!lines.length)
    return (
      <div className="py-28 text-center">
        <ShoppingBag className="mx-auto h-12 w-12 text-sub" strokeWidth={1.2} />
        <h1 className="mt-4 font-display text-3xl font-medium">Your bag is empty</h1>
        <p className="mt-2 text-sub">Add something worth the upgrade.</p>
        <Link href="/" className="btn mt-6">Browse products</Link>
      </div>
    );
  return (
    <div className="pt-12">
      <h1 className="font-display text-4xl font-medium">Your bag</h1>
      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_380px]">
        <ul className="divide-y divide-line border-y border-line">
          {lines.map(({ product: p, qty }) => (
            <li key={p.slug} className="flex gap-4 py-5">
              <Link href={`/product/${p.slug}`} className="h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-[#14171c] sm:h-28 sm:w-28"><ProductImage src={`/products/${p.slug}.jpg`} alt={p.name} category={p.category} brand={p.brand} /></Link>
              <div className="flex flex-1 flex-col justify-between">
                <div className="flex justify-between gap-3">
                  <div><p className="text-[11px] uppercase tracking-[0.14em] text-sub">{p.brand}</p><Link href={`/product/${p.slug}`} className="font-display text-lg">{p.name}</Link></div>
                  <p className="font-display text-lg font-semibold">{inr(p.price * qty)}</p>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center rounded-lg border border-line">
                    <button aria-label={`Decrease ${p.name}`} onClick={() => setQty(p.slug, qty - 1)} className="grid h-9 w-9 place-items-center"><Minus className="h-4 w-4" /></button>
                    <span className="w-7 text-center text-sm">{qty}</span>
                    <button aria-label={`Increase ${p.name}`} onClick={() => setQty(p.slug, qty + 1)} className="grid h-9 w-9 place-items-center"><Plus className="h-4 w-4" /></button>
                  </div>
                  <button onClick={() => remove(p.slug)} className="flex items-center gap-1 text-sm text-sub hover:text-red-500"><Trash2 className="h-4 w-4" />Remove</button>
                </div>
              </div>
            </li>
          ))}
        </ul>
        <aside className="h-fit rounded-xl border border-line bg-surface p-6">
          <h2 className="font-display text-xl font-medium">Order summary</h2>
          <form className="mt-5 flex gap-2" onSubmit={(e) => { e.preventDefault(); setErr(applyCoupon(code) ? "" : "That code isn't valid"); }}>
            <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="Coupon code (try RUSHH10)" aria-label="Coupon code" className="field" />
            <button className="btn btn-ghost">Apply</button>
          </form>
          {err && <p className="mt-2 text-sm text-red-500">{err}</p>}
          <dl className="mt-6 space-y-3 text-sm">
            <div className="flex justify-between"><dt>Subtotal</dt><dd>{inr(subtotal)}</dd></div>
            {discount > 0 && <div className="flex justify-between text-emerald-600"><dt>Coupon {coupon}</dt><dd>−{inr(discount)}</dd></div>}
            <div className="flex justify-between"><dt>Delivery</dt><dd className="text-emerald-600">Free</dd></div>
            <div className="flex justify-between border-t border-line pt-4 font-display text-lg font-semibold"><dt>Total</dt><dd>{inr(total)}</dd></div>
          </dl>
          <Link href="/checkout" className="btn mt-6 w-full">Checkout</Link>
        </aside>
      </div>
    </div>
  );
}
