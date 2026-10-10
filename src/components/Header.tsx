"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { Heart, Moon, Search, ShieldCheck, ShoppingBag, Sun, User } from "lucide-react";
import { categories } from "@/lib/products";
import { useStore } from "@/lib/store";

export function Logo({ className = "text-4xl" }: { className?: string }) {
  return <span className={`font-display font-bold italic tracking-tight ${className}`}>rushh<span className="text-brand">.</span></span>;
}

export default function Header() {
  const router = useRouter();
  const path = usePathname();
  const { cartCount, wishlist, user, ready } = useStore();
  const [q, setQ] = useState("");
  const [dark, setDark] = useState(false);
  useEffect(() => setDark(document.documentElement.classList.contains("dark")), []);
  const toggle = () => {
    const next = !dark; setDark(next);
    document.documentElement.classList.toggle("dark", next);
    try { localStorage.setItem("rushh:theme", next ? "dark" : "light"); } catch {}
  };
  const submit = (e: FormEvent) => { e.preventDefault(); if (q.trim()) router.push(`/search?q=${encodeURIComponent(q.trim())}`); };
  const tabs = [{ href: "/", label: "All products" }, ...categories.map((c) => ({ href: `/c/${c.slug}`, label: c.label }))];

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg/90 backdrop-blur">
      <div className="mx-auto grid max-w-[1400px] grid-cols-[auto_1fr_auto] items-center gap-x-4 gap-y-3 px-4 py-4 sm:px-8 md:grid-cols-[1fr_minmax(0,540px)_1fr] lg:px-14">
        <Link href="/" aria-label="Rushh home"><Logo className="text-3xl md:text-4xl" /></Link>
        <form onSubmit={submit} role="search" className="order-last col-span-3 flex items-center gap-3 rounded-lg bg-muted px-4 py-3 md:order-none md:col-span-1">
          <Search className="h-5 w-5 text-sub" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Find your next upgrade" aria-label="Search products" className="w-full bg-transparent text-sm outline-none placeholder:text-sub" />
        </form>
        <nav aria-label="Account" className="flex items-center justify-end gap-1 sm:gap-2">
          <button onClick={toggle} aria-label={dark ? "Switch to light mode" : "Switch to dark mode"} className="grid h-10 w-10 place-items-center rounded-full hover:bg-muted">
            {dark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
          <Link href="/wishlist" aria-label="Wishlist" className="relative grid h-10 w-10 place-items-center rounded-full hover:bg-muted">
            <Heart className="h-5 w-5" />
            {ready && wishlist.length > 0 && <span className="absolute right-1 top-1 h-2.5 w-2.5 rounded-full bg-red-500" />}
          </Link>
          <Link href="/account" aria-label={user ? `Account of ${user.name}` : "Sign in"} className="grid h-10 w-10 place-items-center rounded-full hover:bg-muted"><User className="h-5 w-5" /></Link>
          <span className="mx-1 hidden h-6 w-px bg-line sm:block" />
          <Link href="/cart" className="flex items-center gap-2 rounded-full px-2 py-1.5 text-sm font-medium hover:bg-muted">
            <ShoppingBag className="h-5 w-5" /><span className="hidden sm:inline">Bag</span>
            <span className="grid h-6 min-w-6 place-items-center rounded-full bg-brand px-1.5 text-xs font-semibold text-white">{ready ? cartCount : 0}</span>
          </Link>
        </nav>
      </div>
      <div className="border-t border-line">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-4 sm:px-8 lg:px-14">
          <nav aria-label="Categories" className="no-scrollbar flex gap-8 overflow-x-auto">
            {tabs.map((t) => {
              const active = t.href === "/" ? path === "/" : path.startsWith(t.href);
              return <Link key={t.href} href={t.href} aria-current={active ? "page" : undefined} className={`-mb-px whitespace-nowrap border-b-2 py-4 text-sm ${active ? "border-brand font-medium text-brand" : "border-transparent hover:text-brand"}`}>{t.label}</Link>;
            })}
          </nav>
          <p className="hidden items-center gap-2 text-sm text-sub lg:flex"><ShieldCheck className="h-4 w-4" />Good tech. No second guesses.</p>
        </div>
      </div>
    </header>
  );
}
