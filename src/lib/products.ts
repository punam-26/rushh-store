import data from "@/data/products.json";

export type CategorySlug = "smartphones" | "laptops" | "headphones" | "earbuds";
export type Product = {
  id: number; slug: string; category: CategorySlug; brand: string; name: string; tag: string;
  price: number; mrp: number; blurb: string; specs: string[]; rating: number; reviews: number;
  unitsSold: number; monthlySales: number[]; stock: number;
};
export const products = data as unknown as Product[];
export const categories: { slug: CategorySlug; label: string; blurb: string }[] = [
  { slug: "smartphones", label: "Smartphones", blurb: "Flagships and favourites" },
  { slug: "laptops", label: "Laptops", blurb: "Built for work and play" },
  { slug: "headphones", label: "Headphones", blurb: "Silence, tuned to you" },
  { slug: "earbuds", label: "Earbuds", blurb: "Small, loud, unstoppable" },
];
export const bySlug = (slug: string) => products.find((p) => p.slug === slug);
export const inCategory = (c: string) => products.filter((p) => p.category === c);
export const bestSellers = (n = 8) => [...products].sort((a, b) => b.unitsSold - a.unitsSold).slice(0, n);
export const discountPct = (p: Product) => Math.round((1 - p.price / p.mrp) * 100);
