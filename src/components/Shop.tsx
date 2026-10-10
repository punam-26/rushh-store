"use client";
import { useMemo, useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import { Product } from "@/lib/products";
import ProductCard from "./ProductCard";

const RANGES = [
  { label: "Any price", min: 0, max: Infinity }, { label: "Under ₹10,000", min: 0, max: 10000 },
  { label: "₹10,000 – ₹30,000", min: 10000, max: 30000 }, { label: "₹30,000 – ₹75,000", min: 30000, max: 75000 },
  { label: "Above ₹75,000", min: 75000, max: Infinity },
];

export default function Shop({ products, title, subtitle = "Standout tech. Thoughtfully picked.", filters = false }: { products: Product[]; title: string; subtitle?: string; filters?: boolean }) {
  const [sort, setSort] = useState("featured");
  const [brands, setBrands] = useState<string[]>([]);
  const [range, setRange] = useState(0);
  const [top, setTop] = useState(false);
  const allBrands = useMemo(() => Array.from(new Set(products.map((p) => p.brand))).sort(), [products]);

  const list = useMemo(() => {
    const r = RANGES[range];
    const l = products.filter((p) => (!brands.length || brands.includes(p.brand)) && p.price >= r.min && p.price <= r.max && (!top || p.rating >= 4.3));
    if (sort === "best") l.sort((a, b) => b.unitsSold - a.unitsSold);
    if (sort === "low") l.sort((a, b) => a.price - b.price);
    if (sort === "high") l.sort((a, b) => b.price - a.price);
    if (sort === "rating") l.sort((a, b) => b.rating - a.rating);
    return l;
  }, [products, sort, brands, range, top]);

  const reset = () => { setBrands([]); setRange(0); setTop(false); };

  return (
    <section>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">The Rushh edit</p>
          <h2 className="mt-3 font-display text-3xl font-medium sm:text-4xl">{title}</h2>
          <p className="mt-2 text-sm text-sub">{subtitle}</p>
        </div>
        <label className="flex items-center gap-2 text-sm">
          <SlidersHorizontal className="h-4 w-4 text-sub" />
          <span className="sr-only">Sort products</span>
          <select value={sort} onChange={(e) => setSort(e.target.value)} className="cursor-pointer rounded-md bg-transparent py-1 pr-2 font-medium">
            <option value="featured">Featured</option><option value="best">Best selling</option>
            <option value="low">Price: low to high</option><option value="high">Price: high to low</option>
            <option value="rating">Top rated</option>
          </select>
        </label>
      </div>

      <div className={`mt-8 ${filters ? "grid gap-10 lg:grid-cols-[220px_1fr]" : ""}`}>
        {filters && (
          <aside className="space-y-7 text-sm">
            <div>
              <h3 className="mb-3 font-display font-medium">Brand</h3>
              <div className="space-y-2">
                {allBrands.map((b) => (
                  <label key={b} className="flex cursor-pointer items-center gap-2">
                    <input type="checkbox" checked={brands.includes(b)} onChange={() => setBrands((x) => (x.includes(b) ? x.filter((y) => y !== b) : [...x, b]))} className="h-4 w-4 accent-[var(--brand)]" />{b}
                  </label>
                ))}
              </div>
            </div>
            <div>
              <h3 className="mb-3 font-display font-medium">Price</h3>
              <div className="space-y-2">
                {RANGES.map((r, i) => (
                  <label key={r.label} className="flex cursor-pointer items-center gap-2">
                    <input type="radio" name="price" checked={range === i} onChange={() => setRange(i)} className="h-4 w-4 accent-[var(--brand)]" />{r.label}
                  </label>
                ))}
              </div>
            </div>
            <label className="flex cursor-pointer items-center gap-2">
              <input type="checkbox" checked={top} onChange={() => setTop(!top)} className="h-4 w-4 accent-[var(--brand)]" />4.3 stars and above
            </label>
            <button onClick={reset} className="text-brand hover:underline">Clear filters</button>
          </aside>
        )}
        <div>
          {list.length === 0 ? (
            <div className="rounded-xl border border-dashed border-line p-12 text-center">
              <p className="font-display text-lg">Nothing matches those filters</p>
              <button onClick={reset} className="btn mt-4">Clear filters</button>
            </div>
          ) : (
            <div className={`grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 ${filters ? "xl:grid-cols-3" : "lg:grid-cols-4"}`}>
              {list.map((p) => <ProductCard key={p.id} p={p} />)}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
