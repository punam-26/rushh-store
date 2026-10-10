"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { Banknote, CreditCard, Smartphone } from "lucide-react";
import { Address, useCartLines, useStore } from "@/lib/store";
import { inr } from "@/lib/format";

const methods = [
  { id: "UPI", label: "UPI", Icon: Smartphone }, { id: "Card", label: "Credit / debit card", Icon: CreditCard },
  { id: "Cash on delivery", label: "Cash on delivery", Icon: Banknote },
];

export default function Checkout() {
  const router = useRouter();
  const { ready, user, placeOrder } = useStore();
  const { lines, subtotal, discount, total } = useCartLines();
  const [a, setA] = useState<Address>({ name: user?.name ?? "", phone: "", line1: "", city: "", state: "", pin: "" });
  const [pay, setPay] = useState("UPI");
  const [errs, setErrs] = useState<Partial<Record<keyof Address, string>>>({});
  const [busy, setBusy] = useState(false);
  const set = (k: keyof Address) => (e: React.ChangeEvent<HTMLInputElement>) => setA((x) => ({ ...x, [k]: e.target.value }));

  if (!ready) return <div className="py-32" />;
  if (!lines.length && !busy)
    return <div className="py-28 text-center"><h1 className="font-display text-3xl font-medium">Nothing to check out</h1><Link href="/" className="btn mt-6">Browse products</Link></div>;

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const er: typeof errs = {};
    if (a.name.trim().length < 2) er.name = "Enter your full name";
    if (!/^[6-9]\d{9}$/.test(a.phone)) er.phone = "Enter a valid 10-digit mobile number";
    if (a.line1.trim().length < 5) er.line1 = "Enter your street address";
    if (!a.city.trim()) er.city = "Enter your city";
    if (!a.state.trim()) er.state = "Enter your state";
    if (!/^\d{6}$/.test(a.pin)) er.pin = "Enter a 6-digit PIN code";
    setErrs(er);
    if (Object.keys(er).length) return;
    setBusy(true);
    setTimeout(() => {
      const order = placeOrder({ lines: lines.map((l) => ({ slug: l.product.slug, name: l.product.name, brand: l.product.brand, qty: l.qty, price: l.product.price })), subtotal, discount, total, address: a, payment: pay });
      router.push(`/orders/${order.id}`);
    }, 1200);
  };

  const input = (k: keyof Address, label: string, props: React.InputHTMLAttributes<HTMLInputElement> = {}) => (
    <label className="block text-sm">
      <span className="mb-1 block font-medium">{label}</span>
      <input value={a[k]} onChange={set(k)} className="field" aria-invalid={!!errs[k]} {...props} />
      {errs[k] && <span className="mt-1 block text-xs text-red-500">{errs[k]}</span>}
    </label>
  );

  return (
    <form onSubmit={submit} className="pt-12" noValidate>
      <h1 className="font-display text-4xl font-medium">Checkout</h1>
      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_380px]">
        <div className="space-y-10">
          <section>
            <h2 className="font-display text-xl font-medium">Delivery address</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {input("name", "Full name", { autoComplete: "name" })}
              {input("phone", "Mobile number", { inputMode: "numeric", maxLength: 10, autoComplete: "tel" })}
              <div className="sm:col-span-2">{input("line1", "Address", { autoComplete: "street-address" })}</div>
              {input("city", "City")}{input("state", "State")}{input("pin", "PIN code", { inputMode: "numeric", maxLength: 6 })}
            </div>
          </section>
          <section>
            <h2 className="font-display text-xl font-medium">Payment</h2>
            <p className="mt-1 text-xs text-sub">Demo store: no real payment is taken.</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {methods.map(({ id, label, Icon }) => (
                <label key={id} className={`flex cursor-pointer items-center gap-3 rounded-lg border p-4 text-sm ${pay === id ? "border-brand bg-brand/5" : "border-line"}`}>
                  <input type="radio" name="pay" checked={pay === id} onChange={() => setPay(id)} className="accent-[var(--brand)]" /><Icon className="h-5 w-5" />{label}
                </label>
              ))}
            </div>
          </section>
        </div>
        <aside className="h-fit rounded-xl border border-line bg-surface p-6">
          <h2 className="font-display text-xl font-medium">Order summary</h2>
          <ul className="mt-4 space-y-3 text-sm">{lines.map(({ product: p, qty }) => <li key={p.slug} className="flex justify-between gap-3"><span>{p.name} × {qty}</span><span>{inr(p.price * qty)}</span></li>)}</ul>
          <dl className="mt-5 space-y-2 border-t border-line pt-4 text-sm">
            <div className="flex justify-between"><dt>Subtotal</dt><dd>{inr(subtotal)}</dd></div>
            {discount > 0 && <div className="flex justify-between text-emerald-600"><dt>Discount</dt><dd>−{inr(discount)}</dd></div>}
            <div className="flex justify-between"><dt>Delivery</dt><dd className="text-emerald-600">Free</dd></div>
            <div className="flex justify-between pt-2 font-display text-lg font-semibold"><dt>Total</dt><dd>{inr(total)}</dd></div>
          </dl>
          <button disabled={busy} className="btn mt-6 w-full disabled:opacity-60">{busy ? "Placing your order…" : `Place order · ${inr(total)}`}</button>
        </aside>
      </div>
    </form>
  );
}
