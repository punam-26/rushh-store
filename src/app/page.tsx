import Link from "next/link";
import { AudioLines, ChevronRight, Headphones, Laptop, RotateCcw, ShieldCheck, Smartphone, Truck } from "lucide-react";
import Hero from "@/components/Hero";
import Shop from "@/components/Shop";
import ProductCard from "@/components/ProductCard";
import { bestSellers, categories, inCategory } from "@/lib/products";

const icons = { smartphones: Smartphone, laptops: Laptop, headphones: Headphones, earbuds: AudioLines };
const trust = [
  { Icon: Truck, t: "Delivered to your doorstep", s: "Your next upgrade, on its way" },
  { Icon: ShieldCheck, t: "Only the real deal", s: "Authenticity. Without compromise." },
  { Icon: RotateCcw, t: "Shop with peace of mind", s: "7-day returns, from start to finish" },
];

export default function Home() {
  return (
    <div className="pt-8">
      <Hero />
      <div className="mt-10 grid divide-y divide-line border-b border-line md:grid-cols-3 md:divide-x md:divide-y-0">
        {trust.map(({ Icon, t, s }) => (
          <div key={t} className="flex items-center justify-center gap-4 py-6">
            <Icon className="h-7 w-7 shrink-0" strokeWidth={1.4} />
            <div><p className="text-sm font-medium">{t}</p><p className="text-xs text-sub">{s}</p></div>
          </div>
        ))}
      </div>

      <section className="mt-14">
        <div className="flex items-baseline justify-between"><h2 className="font-display text-2xl font-medium">Find your category</h2><p className="hidden text-sm text-sub sm:block">Made for the way you move</p></div>
        <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {categories.map((c) => { const Icon = icons[c.slug]; return (
            <Link key={c.slug} href={`/c/${c.slug}`} className="flex items-center justify-between gap-3 rounded-xl border border-line bg-surface p-5 shadow-sm transition hover:border-brand">
              <span className="flex items-center gap-4"><Icon className="h-7 w-7" strokeWidth={1.4} /><span className="font-display text-lg">{c.label}</span></span>
              <ChevronRight className="h-4 w-4 text-sub" />
            </Link>); })}
        </div>
      </section>

      <div className="mt-16"><Shop products={bestSellers(8)} title="Worth the upgrade" subtitle="Our best sellers, picked by what people actually buy." /></div>

      {categories.map((c) => (
        <section key={c.slug} className="mt-20">
          <div className="flex items-end justify-between">
            <div><h2 className="font-display text-3xl font-medium">{c.label}</h2><p className="mt-1 text-sm text-sub">{c.blurb}</p></div>
            <Link href={`/c/${c.slug}`} className="flex items-center gap-1 text-sm font-medium text-brand hover:underline">View all<ChevronRight className="h-4 w-4" /></Link>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-4">
            {inCategory(c.slug).slice(0, 4).map((p) => <ProductCard key={p.id} p={p} />)}
          </div>
        </section>
      ))}

      <section className="mt-24 rounded-2xl bg-band p-10 text-white sm:p-14">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/50">Better tech. Better everyday.</p>
        <h2 className="mt-4 font-display text-4xl font-medium">Keep up? Set the pace.</h2>
        <p className="mt-3 text-sm text-white/60">The essentials that do more. So you can, too.</p>
      </section>
    </div>
  );
}
