import Shop from "@/components/Shop";
import { products } from "@/lib/products";

export const dynamic = "force-dynamic";
export const metadata = { title: "Search" };
export default function Search({ searchParams }: { searchParams: { q?: string } }) {
  const q = (searchParams.q ?? "").trim().toLowerCase();
  const terms = q.split(/\s+/).filter(Boolean);
  const hits = products.filter((p) => { const hay = `${p.brand} ${p.name} ${p.category} ${p.tag} ${p.blurb}`.toLowerCase(); return terms.every((t) => hay.includes(t)); });
  return <div className="pt-12"><Shop products={hits} title={q ? `Results for “${searchParams.q}”` : "All products"} subtitle={`${hits.length} product${hits.length === 1 ? "" : "s"} found`} filters /></div>;
}
