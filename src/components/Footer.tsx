import Link from "next/link";
import { Logo } from "./Header";
import { categories } from "@/lib/products";

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-line">
      <div className="mx-auto flex max-w-[1400px] flex-wrap justify-between gap-10 px-4 py-12 sm:px-8 lg:px-14">
        <div><Logo className="text-4xl" /><p className="mt-2 text-sm text-sub">Power your Pace.</p></div>
        <div className="flex gap-16 text-sm">
          <ul className="space-y-2"><li className="font-display font-medium">Shop</li>{categories.map((c) => <li key={c.slug}><Link className="text-sub hover:text-brand" href={`/c/${c.slug}`}>{c.label}</Link></li>)}</ul>
          <ul className="space-y-2"><li className="font-display font-medium">Account</li>
            <li><Link className="text-sub hover:text-brand" href="/account">Sign in</Link></li>
            <li><Link className="text-sub hover:text-brand" href="/orders">Your orders</Link></li>
            <li><Link className="text-sub hover:text-brand" href="/wishlist">Wishlist</Link></li></ul>
        </div>
      </div>
      <p className="mx-auto max-w-[1400px] border-t border-line px-4 py-6 text-xs text-sub sm:px-8 lg:px-14">© {new Date().getFullYear()} Rushh. All rights reserved.</p>
    </footer>
  );
}
