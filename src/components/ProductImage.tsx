"use client";
import { useState } from "react";
import { AudioLines, Headphones, Laptop, Smartphone } from "lucide-react";

const icons = { smartphones: Smartphone, laptops: Laptop, headphones: Headphones, earbuds: AudioLines } as const;

/** Shows /public/products/<slug>.jpg (or any src); falls back to a dark placeholder if the file is missing. */
export default function ProductImage({ src, alt, category, brand, className = "" }: { src: string; alt: string; category?: string; brand?: string; className?: string }) {
  const [failed, setFailed] = useState(false);
  const Icon = icons[(category as keyof typeof icons) ?? "headphones"] ?? Headphones;
  if (failed)
    return (
      <div role="img" aria-label={alt} className={`flex h-full w-full flex-col items-center justify-center gap-3 bg-gradient-to-br from-[#0f1216] to-[#2b313a] text-white/70 ${className}`}>
        <Icon className="h-14 w-14" strokeWidth={1.2} />
        {brand && <span className="text-xs tracking-widest">{brand}</span>}
      </div>
    );
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt={alt} loading="lazy" onError={() => setFailed(true)} className={`h-full w-full object-cover ${className}`} />;
}
