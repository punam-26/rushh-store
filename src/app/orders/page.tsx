"use client";
import Link from "next/link";
import { useStore } from "@/lib/store";
import { inr } from "@/lib/format";

export default function Orders() {
  const { orders, ready } = useStore();
  if (!ready) return <div className="py-32" />;
  return (
    <div className="pt-12">
      <h1 className="font-display text-4xl font-medium">Your orders</h1>
      {orders.length === 0 ? (
        <div className="py-20 text-center"><p className="text-sub">You haven't placed an order yet.</p><Link href="/" className="btn mt-6">Start shopping</Link></div>
      ) : (
        <ul className="mt-8 space-y-4">
          {orders.map((o) => (
            <li key={o.id}>
              <Link href={`/orders/${o.id}`} className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-line bg-surface p-5 transition hover:border-brand">
                <div><p className="font-display font-medium">{o.id}</p><p className="text-sm text-sub">{new Date(o.date).toLocaleDateString("en-IN", { dateStyle: "medium" })} · {o.lines.reduce((n, l) => n + l.qty, 0)} items</p></div>
                <div className="text-right"><p className="font-display font-semibold">{inr(o.total)}</p><p className="text-sm text-emerald-600">{o.status}</p></div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
