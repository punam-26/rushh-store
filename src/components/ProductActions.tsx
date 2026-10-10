"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Heart, Minus, Plus } from "lucide-react";
import { useStore } from "@/lib/store";

export default function ProductActions({ slug, stock }: { slug: string; stock: number }) {
  const router = useRouter();
  const { add, wishlist, toggleWish } = useStore();
  const [qty, setQty] = useState(1);
  const liked = wishlist.includes(slug);
  const max = Math.min(10, stock);
  return (
    <div className="mt-6 space-y-4">
      <div className="flex items-center gap-4">
        <div className="flex items-center rounded-lg border border-line">
          <button aria-label="Decrease quantity" onClick={() => setQty((q) => Math.max(1, q - 1))} className="grid h-11 w-11 place-items-center"><Minus className="h-4 w-4" /></button>
          <span className="w-8 text-center font-medium" aria-live="polite">{qty}</span>
          <button aria-label="Increase quantity" onClick={() => setQty((q) => Math.min(max, q + 1))} className="grid h-11 w-11 place-items-center"><Plus className="h-4 w-4" /></button>
        </div>
        <button onClick={() => toggleWish(slug)} aria-pressed={liked} className="btn btn-ghost"><Heart className={`h-4 w-4 ${liked ? "fill-red-500 text-red-500" : ""}`} />{liked ? "Saved" : "Save for later"}</button>
      </div>
      <div className="flex flex-wrap gap-3">
        <button onClick={() => add(slug, qty)} className="btn btn-ghost flex-1">Add to bag</button>
        <button onClick={() => { add(slug, qty); router.push("/checkout"); }} className="btn flex-1">Buy now</button>
      </div>
    </div>
  );
}
