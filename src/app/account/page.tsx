"use client";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { useStore } from "@/lib/store";

export default function Account() {
  const { user, login, logout, orders, ready } = useStore();
  const [mode, setMode] = useState<"in" | "up">("up");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [err, setErr] = useState("");
  if (!ready) return <div className="py-32" />;

  if (user)
    return (
      <div className="mx-auto max-w-md pt-14">
        <h1 className="font-display text-4xl font-medium">Hi, {user.name.split(" ")[0]}</h1>
        <p className="mt-2 text-sub">{user.email}</p>
        <div className="mt-8 space-y-3">
          <Link href="/orders" className="btn btn-ghost w-full">Your orders ({orders.length})</Link>
          <Link href="/wishlist" className="btn btn-ghost w-full">Wishlist</Link>
          <button onClick={logout} className="btn w-full">Sign out</button>
        </div>
      </div>
    );

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) return setErr("Enter a valid email address");
    if (mode === "up" && name.trim().length < 2) return setErr("Enter your name");
    login({ name: name.trim() || email.split("@")[0], email });
  };
  return (
    <form onSubmit={submit} className="mx-auto max-w-sm pt-14" noValidate>
      <h1 className="font-display text-4xl font-medium">{mode === "up" ? "Create account" : "Sign in"}</h1>
      <p className="mt-2 text-sm text-sub">Demo store: details stay in this browser.</p>
      <div className="mt-8 space-y-4">
        {mode === "up" && <label className="block text-sm"><span className="mb-1 block font-medium">Full name</span><input className="field" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" /></label>}
        <label className="block text-sm"><span className="mb-1 block font-medium">Email</span><input className="field" type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" /></label>
        {err && <p className="text-sm text-red-500">{err}</p>}
        <button className="btn w-full">{mode === "up" ? "Create account" : "Sign in"}</button>
        <button type="button" onClick={() => { setMode(mode === "up" ? "in" : "up"); setErr(""); }} className="w-full text-sm text-brand hover:underline">
          {mode === "up" ? "Already have an account? Sign in" : "New here? Create an account"}
        </button>
      </div>
    </form>
  );
}
