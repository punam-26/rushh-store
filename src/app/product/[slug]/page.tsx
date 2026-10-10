import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Check, RotateCcw, ShieldCheck, Star, Truck } from "lucide-react";
import ProductImage from "@/components/ProductImage";
import ProductActions from "@/components/ProductActions";
import ProductCard from "@/components/ProductCard";
import { bySlug, categories, discountPct, inCategory, products } from "@/lib/products";
import { inr } from "@/lib/format";

export const generateStaticParams = () => products.map((p) => ({ slug: p.slug }));
export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const p = bySlug(params.slug);
  return { title: p ? `${p.brand} ${p.name}` : "Product", description: p?.blurb };
}

function Trend({ data }: { data: number[] }) {
  const w = 320, h = 90, max = Math.max(...data, 1);
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - 8 - (v / max) * (h - 16)}`);
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-24 w-full" role="img" aria-label="Monthly demand over the last 12 months">
      <polyline points={pts.join(" ")} fill="none" stroke="var(--brand)" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
      <polygon points={`0,${h} ${pts.join(" ")} ${w},${h}`} fill="var(--brand)" opacity="0.1" />
    </svg>
  );
}

export default function ProductPage({ params }: { params: { slug: string } }) {
  const p = bySlug(params.slug);
  if (!p) notFound();
  const cat = categories.find((c) => c.slug === p.category)!;
  const related = inCategory(p.category).filter((x) => x.id !== p.id).slice(0, 4);
  return (
    <div className="pt-8">
      <nav className="text-sm text-sub" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-brand">Home</Link> / <Link href={`/c/${cat.slug}`} className="hover:text-brand">{cat.label}</Link> / <span className="text-ink">{p.name}</span>
      </nav>
      <div className="mt-6 grid gap-10 lg:grid-cols-2">
        <div className="relative aspect-square overflow-hidden rounded-2xl bg-[#14171c]">
          <ProductImage src={`/products/${p.slug}.jpg`} alt={`${p.brand} ${p.name}`} category={p.category} brand={p.brand} />
          <span className="absolute left-5 top-5 rounded bg-emerald-100 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-emerald-900">{p.tag}</span>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-sub">{p.brand}</p>
          <h1 className="mt-2 font-display text-4xl font-medium">{p.name}</h1>
          <p className="mt-3 flex items-center gap-2 text-sm"><Star className="h-4 w-4 fill-amber-400 text-amber-400" /><b>{p.rating}</b><span className="text-sub">· {p.reviews.toLocaleString("en-IN")} reviews · {p.unitsSold.toLocaleString("en-IN")} sold</span></p>
          <div className="mt-6 flex items-baseline gap-3">
            <span className="font-display text-4xl font-semibold">{inr(p.price)}</span>
            <span className="text-sub line-through">{inr(p.mrp)}</span>
            <span className="font-medium text-emerald-600">{discountPct(p)}% off</span>
          </div>
          <p className="mt-1 text-xs text-sub">Inclusive of all taxes. Free delivery.</p>
          <ul className="mt-6 flex flex-wrap gap-2">{p.specs.map((s) => <li key={s} className="rounded-full border border-line px-3 py-1 text-sm">{s}</li>)}</ul>
          <p className={`mt-6 text-sm font-medium ${p.stock < 15 ? "text-amber-600" : "text-emerald-600"}`}>{p.stock < 15 ? `Only ${p.stock} left in stock` : "In stock"}</p>
          <ProductActions slug={p.slug} stock={p.stock} />
          <div className="mt-8 grid gap-3 border-t border-line pt-6 text-sm sm:grid-cols-3">
            <p className="flex items-center gap-2"><Truck className="h-5 w-5 text-sub" />Delivery in 2–4 days</p>
            <p className="flex items-center gap-2"><RotateCcw className="h-5 w-5 text-sub" />7-day returns</p>
            <p className="flex items-center gap-2"><ShieldCheck className="h-5 w-5 text-sub" />1-year warranty</p>
          </div>
        </div>
      </div>
      <div className="mt-14 grid gap-10 lg:grid-cols-2">
        <section>
          <h2 className="font-display text-2xl font-medium">What's inside</h2>
          <ul className="mt-4 divide-y divide-line rounded-xl border border-line bg-surface">
            {p.specs.map((s) => <li key={s} className="flex items-center gap-3 px-5 py-3 text-sm"><Check className="h-4 w-4 text-brand" />{s}</li>)}
            <li className="flex items-center gap-3 px-5 py-3 text-sm"><Check className="h-4 w-4 text-brand" />Brand-authorised, sealed box</li>
          </ul>
        </section>
        <section>
          <h2 className="font-display text-2xl font-medium">Demand, last 12 months</h2>
          <div className="mt-4 rounded-xl border border-line bg-surface p-5">
            <Trend data={p.monthlySales} />
            <p className="mt-2 text-sm text-sub">{p.unitsSold.toLocaleString("en-IN")} units sold. Peak month: {Math.max(...p.monthlySales).toLocaleString("en-IN")} units.</p>
          </div>
        </section>
      </div>
      <section className="mt-20">
        <h2 className="font-display text-3xl font-medium">More in {cat.label}</h2>
        <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-4">{related.map((r) => <ProductCard key={r.id} p={r} />)}</div>
      </section>
    </div>
  );
}
