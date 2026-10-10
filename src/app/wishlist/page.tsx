"use client";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { bySlug, Product } from "@/lib/products";
import { useStore } from "@/lib/store";

export default function Wishlist() {
  const { wishlist, ready } = useStore();
  if (!ready) return <div className="py-32" />;
  const items = wishlist.map(bySlug).filter((p): p is Product => !!p);
  return (
    <div className="pt-12">
      <h1 className="font-display text-4xl font-medium">Wishlist</h1>
      {items.length === 0 ? (
        <div className="py-20 text-center"><p className="text-sub">Tap the heart on anything you like and it will show up here.</p><Link href="/" className="btn mt-6">Browse products</Link></div>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-4">{items.map((p) => <ProductCard key={p.id} p={p} />)}</div>
      )}
    </div>
  );
}
