import Link from "next/link";
import type { Metadata } from "next";
import { AlertTriangle, BarChart3, IndianRupee, Package, Star, TrendingDown } from "lucide-react";
import { categories, products } from "@/lib/products";
import { inrCompact, num } from "@/lib/format";
import insights from "@/data/insights.json";

export const metadata: Metadata = { title: "Sales insights", description: "Data-driven sales insights for the Rushh catalog." };

type Item = { label: string; sub?: string; value: number; display: string; href?: string };

function BarList({ items }: { items: Item[] }) {
  const max = Math.max(...items.map((i) => i.value), 1);
  return (
    <ul className="space-y-4">
      {items.map((i) => (
        <li key={i.label}>
          <div className="flex items-baseline justify-between gap-3 text-sm">
            {i.href ? <Link href={i.href} className="font-medium hover:text-brand">{i.label}</Link> : <span className="font-medium">{i.label}</span>}
            <span className="shrink-0 tabular-nums">{i.display}</span>
          </div>
          {i.sub && <p className="text-xs text-sub">{i.sub}</p>}
          <div className="mt-1.5 h-2 rounded-full bg-muted" role="img" aria-label={`${i.label}: ${i.display}`}>
            <div className="h-2 rounded-full bg-brand" style={{ width: `${Math.max(2, (i.value / max) * 100)}%` }} />
          </div>
        </li>
      ))}
    </ul>
  );
}

function Card({ title, note, children }: { title: string; note?: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-line bg-surface p-6">
      <h2 className="font-display text-xl font-medium">{title}</h2>
      {note && <p className="mt-1 text-sm text-sub">{note}</p>}
      <div className="mt-6">{children}</div>
    </section>
  );
}

function Line({ data }: { data: number[] }) {
  const w = 640, h = 240, pl = 8, pb = 28, max = Math.max(...data);
  const x = (i: number) => pl + (i / (data.length - 1)) * (w - pl * 2);
  const y = (v: number) => 10 + (1 - v / max) * (h - pb - 20);
  const pts = data.map((v, i) => `${x(i)},${y(v)}`).join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full" role="img" aria-label="Units sold per month across all 748 products, falling from month 1 to month 12">
      {[0, 0.5, 1].map((t) => <line key={t} x1={pl} x2={w - pl} y1={y(max * t)} y2={y(max * t)} stroke="var(--line)" />)}
      <polygon points={`${x(0)},${h - pb} ${pts} ${x(data.length - 1)},${h - pb}`} fill="var(--brand)" opacity="0.12" />
      <polyline points={pts} fill="none" stroke="var(--brand)" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" />
      {data.map((v, i) => <circle key={i} cx={x(i)} cy={y(v)} r="3.5" fill="var(--brand)" />)}
      {data.map((_, i) => <text key={i} x={x(i)} y={h - 8} textAnchor="middle" fontSize="11" fill="var(--sub)">M{i + 1}</text>)}
    </svg>
  );
}

export default function Insights() {
  const rev = (p: (typeof products)[number]) => p.unitsSold * p.price;
  const units = products.reduce((n, p) => n + p.unitsSold, 0);
  const revenue = products.reduce((n, p) => n + rev(p), 0);
  const rating = products.reduce((n, p) => n + p.rating * p.unitsSold, 0) / units;
  const best = [...products].sort((a, b) => b.unitsSold - a.unitsSold);

  const cats = categories.map((c) => {
    const ps = products.filter((p) => p.category === c.slug);
    return { ...c, revenue: ps.reduce((n, p) => n + rev(p), 0), units: ps.reduce((n, p) => n + p.unitsSold, 0) };
  }).sort((a, b) => b.revenue - a.revenue);

  const brandMap = new Map<string, number>();
  products.forEach((p) => brandMap.set(p.brand, (brandMap.get(p.brand) ?? 0) + rev(p)));
  const brands = [...brandMap.entries()].sort((a, b) => b[1] - a[1]).slice(0, 6);

  const bands = [["Under ₹10,000", 0, 1e4], ["₹10,000 – ₹30,000", 1e4, 3e4], ["₹30,000 – ₹75,000", 3e4, 75e3], ["Above ₹75,000", 75e3, Infinity]] as const;
  const bandData = bands.map(([label, lo, hi]) => ({ label, units: products.filter((p) => p.price >= lo && p.price < hi).reduce((n, p) => n + p.unitsSold, 0) }));

  const m = insights.monthly, mTotal = m.reduce((a, b) => a + b, 0);
  const first3 = Math.round(((m[0] + m[1] + m[2]) / mTotal) * 100);
  const drop = Math.round((1 - m[11] / m[0]) * 100);
  const watch = [...products].filter((p) => p.stock < 40).sort((a, b) => b.unitsSold / b.stock - a.unitsSold / a.stock).slice(0, 5);
  const kpis = [
    { Icon: Package, label: "Units sold (12 months)", value: num(units) },
    { Icon: IndianRupee, label: "Estimated revenue", value: inrCompact(revenue) },
    { Icon: Star, label: "Average rating", value: rating.toFixed(1) + " / 5" },
    { Icon: BarChart3, label: "Top seller", value: `${best[0].brand} ${best[0].name}` },
  ];

  return (
    <div className="pt-12">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">Insights</p>
      <h1 className="mt-3 font-display text-4xl font-medium sm:text-5xl">The numbers behind Rushh.</h1>
      <p className="mt-3 max-w-2xl text-sub">What the sales data says about demand, categories and stock, built from the Kaggle online-sales dataset ({num(insights.products)} products).</p>

      <div className="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {kpis.map(({ Icon, label, value }) => (
          <div key={label} className="rounded-2xl border border-line bg-surface p-5">
            <Icon className="h-5 w-5 text-brand" strokeWidth={1.6} />
            <p className="mt-4 font-display text-2xl font-semibold leading-tight">{value}</p>
            <p className="mt-1 text-xs text-sub">{label}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="lg:col-span-2">
          <Card title="Demand falls fast after launch" note={`Units sold per month across all ${num(insights.products)} products in the dataset.`}>
            <Line data={m} />
            <div className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
              <p className="flex gap-2"><TrendingDown className="mt-0.5 h-4 w-4 shrink-0 text-brand" />Sales in month 12 are {drop}% below month 1.</p>
              <p>The first three months bring {first3}% of the year's units, so launches and early promotions matter most.</p>
              <p>The top 10% of products drive {insights.top10Share}% of all units, so a few hits carry the catalog.</p>
            </div>
          </Card>
        </div>

        <Card title="Revenue by category" note="Units sold × list price.">
          <BarList items={cats.map((c) => ({ label: c.label, sub: `${num(c.units)} units`, value: c.revenue, display: inrCompact(c.revenue), href: `/c/${c.slug}` }))} />
        </Card>
        <Card title="Top brands by revenue">
          <BarList items={brands.map(([b, v]) => ({ label: b, value: v, display: inrCompact(v) }))} />
        </Card>
        <Card title="Best sellers" note="Most units sold in 12 months.">
          <BarList items={best.slice(0, 8).map((p) => ({ label: `${p.brand} ${p.name}`, sub: `${p.rating} stars`, value: p.unitsSold, display: num(p.unitsSold), href: `/product/${p.slug}` }))} />
        </Card>
        <Card title="Units sold by price band" note="Where shoppers spend.">
          <BarList items={bandData.map((b) => ({ label: b.label, value: b.units, display: num(b.units) }))} />
        </Card>

        <div className="lg:col-span-2">
          <Card title="Restock watch" note="Low stock relative to demand. These sell out first.">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[480px] text-left text-sm">
                <thead className="text-xs uppercase tracking-wide text-sub"><tr><th className="pb-3 font-medium">Product</th><th className="pb-3 font-medium">Units sold</th><th className="pb-3 font-medium">In stock</th><th className="pb-3 font-medium">Status</th></tr></thead>
                <tbody className="divide-y divide-line">
                  {watch.map((p) => (
                    <tr key={p.slug}>
                      <td className="py-3"><Link href={`/product/${p.slug}`} className="font-medium hover:text-brand">{p.brand} {p.name}</Link></td>
                      <td className="py-3 tabular-nums">{num(p.unitsSold)}</td>
                      <td className="py-3 tabular-nums">{p.stock}</td>
                      <td className="py-3"><span className="inline-flex items-center gap-1 text-amber-600"><AlertTriangle className="h-4 w-4" />Reorder soon</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>

      <p className="mt-8 text-xs text-sub">About the data: the Kaggle file is anonymised, so each catalog product is paired with one dataset row for this demo. Revenue is units × list price and ratings are derived from demand. The trend chart uses every row in the dataset.</p>
    </div>
  );
}
