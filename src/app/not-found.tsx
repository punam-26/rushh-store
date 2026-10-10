import Link from "next/link";
export default function NotFound() {
  return (
    <div className="py-32 text-center">
      <h1 className="font-display text-4xl font-medium">We couldn't find that page</h1>
      <p className="mt-3 text-sub">It may have moved, or the link is wrong.</p>
      <Link href="/" className="btn mt-8">Back to all products</Link>
    </div>
  );
}
