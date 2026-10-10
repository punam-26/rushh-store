"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { useStore } from "@/lib/store";
import { inr } from "@/lib/format";

export default function OrderDetail() {
  const { id } = useParams<{ id: string }>();
  const { orders, ready } = useStore();
  if (!ready) return <div className="py-32" />;
  const o = orders.find((x) => x.id === id);
  if (!o) return <div className="py-28 text-center"><h1 className="font-display text-3xl font-medium">Order not found</h1><Link href="/orders" className="btn mt-6">Your orders</Link></div>;
  const eta = new Date(new Date(o.date).getTime() + 4 * 864e5).toLocaleDateString("en-IN", { dateStyle: "medium" });
  return (
    <div className="mx-auto max-w-2xl pt-14">
      <CheckCircle2 className="h-12 w-12 text-emerald-500" />
      <h1 className="mt-4 font-display text-4xl font-medium">Order confirmed</h1>
      <p className="mt-2 text-sub">Thanks, {o.address.name.split(" ")[0]}. Order <b className="text-ink">{o.id}</b> arrives by {eta}.</p>
      <ul className="mt-8 divide-y divide-line rounded-xl border border-line bg-surface">
        {o.lines.map((l) => <li key={l.slug} className="flex justify-between gap-3 p-4 text-sm"><span>{l.brand} {l.name} × {l.qty}</span><span>{inr(l.price * l.qty)}</span></li>)}
        <li className="flex justify-between p-4 font-display font-semibold"><span>Total paid via {o.payment}</span><span>{inr(o.total)}</span></li>
      </ul>
      <p className="mt-6 text-sm text-sub">Delivering to {o.address.name}, {o.address.line1}, {o.address.city}, {o.address.state} {o.address.pin}</p>
      <div className="mt-8 flex gap-3"><Link href="/" className="btn">Keep shopping</Link><Link href="/orders" className="btn btn-ghost">All orders</Link></div>
    </div>
  );
}
