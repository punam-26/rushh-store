"use client";
import Link from "next/link";
import { Heart, Plus, Star } from "lucide-react";
import { discountPct, Product } from "@/lib/products";
import { inr } from "@/lib/format";
import { useStore } from "@/lib/store";
import ProductImage from "./ProductImage";

export default function ProductCard({ p }: { p: Product }) {
  const { wishlist, toggleWish, add } = useStore();
  const liked = wishlist.includes(p.slug);
  return (
    <article>
      <div className="relative aspect-[1/0.87] overflow-hidden rounded-xl bg-[#14171c]">
        <Link href={`/product/${p.slug}`} aria-label={`View ${p.name}`} className="absolute inset-0">
          <ProductImage src={`/products/${p.slug}.jpg`} alt={p.name} category={p.category} brand={p.brand} />
        </Link>
        <span className="pointer-events-none absolute left-4 top-4 rounded bg-emerald-100 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-emerald-900">{p.tag}</span>
        <button
          onClick={() => { toggleWish(p.slug); }}
          aria-pressed={liked}
          aria-label={liked ? "Remove from wishlist" : "Add to wishlist"}
          className="absolute right-4 top-4 z-10 grid h-10 w-10 place-items-center rounded-full bg-white text-neutral-900 shadow transition hover:scale-105"
        >
          <Heart className={`h-5 w-5 ${liked ? "fill-red-500 text-red-500" : ""}`} />
        </button>
      </div>
      <div className="mt-4 flex items-start justify-between gap-2">
        <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-sub">{p.brand}</p>
        <p className="flex items-center gap-1 text-xs text-sub"><Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />{p.rating}</p>
      </div>
      <Link href={`/product/${p.slug}`} className="mt-1 block font-display text-lg font-medium leading-snug hover:text-brand">{p.name}</Link>
      <p className="mt-1 text-xs text-sub">{p.blurb}</p>
      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-baseline gap-2">
          <span className="font-display text-lg font-semibold">{inr(p.price)}</span>
          <span className="text-xs text-sub line-through">{inr(p.mrp)}</span>
          <span className="text-xs font-medium text-emerald-600">{discountPct(p)}% off</span>
        </div>
        <button onClick={() => add(p.slug)} aria-label={`Add ${p.name} to bag`} className="grid h-10 w-10 place-items-center rounded-full border border-line bg-surface shadow-sm transition hover:border-brand hover:text-brand">
          <Plus className="h-5 w-5" />
        </button>
      </div>
    </article>
  );
}
