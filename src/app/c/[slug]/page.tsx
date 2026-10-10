import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Shop from "@/components/Shop";
import { categories, inCategory } from "@/lib/products";

export const generateStaticParams = () => categories.map((c) => ({ slug: c.slug }));
export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  return { title: categories.find((c) => c.slug === params.slug)?.label ?? "Shop" };
}
export default function Category({ params }: { params: { slug: string } }) {
  const cat = categories.find((c) => c.slug === params.slug);
  if (!cat) notFound();
  return <div className="pt-12"><Shop products={inCategory(cat.slug)} title={cat.label} filters /></div>;
}
