"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import ProductImage from "./ProductImage";

const slides = [
  { eyebrow: "The sound of what's next", lines: ["Rushh.", "Power your"], accent: "pace.", body: ["Less noise. More you.", "Discover extraordinary sound for wherever life takes you."], cta: "Explore audio", href: "/c/headphones", img: "/hero/headphones.jpg", cat: "headphones" },
  { eyebrow: "Flagships, front and centre", lines: ["Capture more.", "Carry"], accent: "less.", body: ["The best cameras and chips in a phone.", "Find the one that fits your pocket and your pace."], cta: "Shop smartphones", href: "/c/smartphones", img: "/hero/smartphones.jpg", dark: true, cat: "smartphones" },
  { eyebrow: "Built to keep up", lines: ["Work fast.", "Play"], accent: "harder.", body: ["Thin, light and ready for all-day power.", "Laptops that move at your speed."], cta: "Shop laptops", href: "/c/laptops", img: "/hero/laptops.jpg", dark: true, cat: "laptops" },
];

export default function Hero() {
  const [i, setI] = useState(0);
  useEffect(() => { const t = setInterval(() => setI((x) => (x + 1) % slides.length), 6000); return () => clearInterval(t); }, []);
  const s = slides[i];
  return (
    <section aria-roledescription="carousel" className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${s.dark ? "from-[#1b1e24] to-[#090a0c] text-white" : "from-[#cfd5de] to-[#bcc4cf] dark:from-[#1a1f27] dark:to-[#0f1318]"}`}>
      <div className="grid min-h-[420px] items-center md:min-h-[600px] md:grid-cols-2">
        <div key={i} className="relative z-10 p-8 sm:p-14 lg:p-16">
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em]"><span className="h-1.5 w-1.5 rounded-full bg-brand" />{s.eyebrow}</p>
          <h1 className="mt-8 font-display text-5xl font-medium leading-[1.05] sm:text-6xl lg:text-7xl">
            {s.lines.map((l) => <span key={l} className="block">{l}</span>)}
            <span className="block text-brand">{s.accent}</span>
          </h1>
          <p className="mt-8 max-w-sm text-base leading-8">{s.body.map((b) => <span key={b} className="block">{b}</span>)}</p>
          <Link href={s.href} className="btn mt-8 !rounded-md">{s.cta}<ArrowUpRight className="h-4 w-4" /></Link>
          <div className="mt-1 flex gap-2" role="tablist" aria-label="Choose slide">
            {slides.map((_, n) => (
              <button key={n} role="tab" aria-selected={n === i} aria-label={`Slide ${n + 1}`} onClick={() => setI(n)} className={`h-1 rounded-full transition-all ${n === i ? "w-11 bg-brand" : s.dark ? "w-6 bg-white/25" : "w-6 bg-black/20 dark:bg-white/25"}`} />
            ))}
          </div>
        </div>
        <div className="absolute inset-y-0 right-0 hidden w-[58%] md:block">
          <ProductImage key={s.img} src={s.img} alt="" category={s.cat} className={s.dark ? "[mask-image:linear-gradient(to_right,transparent,#000_30%)]" : "object-contain object-right"} />
        </div>
      </div>
      <p className={`absolute bottom-6 right-8 text-xs ${s.dark ? "text-white/60" : "text-sub"}`}><span className={`font-semibold ${s.dark ? "text-white" : "text-ink"}`}>0{i + 1}</span> / 0{slides.length}</p>
    </section>
  );
}
