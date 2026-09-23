"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginAdmin, getDemoCredentialsHint } from "@/lib/admin-auth";
import Link from "next/link";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const hint = getDemoCredentialsHint();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const result = await loginAdmin(username.trim(), password);
    setLoading(false);
    if (result.ok) {
      router.push("/admin");
      router.refresh();
    } else {
      setError(result.error || "Invalid username or password");
    }
  };

  return (
    <main className="min-h-screen bg-cream flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-sm">
        <div className="text-center mb-8">
          <p className="font-serif text-2xl mb-1">Preshy Beauty</p>
          <p className="text-sm text-taupe">Admin sign in</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-1.5">Username</label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-taupe/30 bg-cream focus:outline-none focus:border-terracotta"
              autoComplete="username"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-taupe/30 bg-cream focus:outline-none focus:border-terracotta"
              autoComplete="current-password"
              required
            />
          </div>
          {error && (
            <p className="text-sm text-red-600" role="alert">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-charcoal text-cream py-3.5 rounded-full font-medium hover:bg-charcoal/90 transition disabled:opacity-60"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>

        {hint && (
          <p className="mt-6 text-xs text-center text-taupe">
            Dev: set <strong>ADMIN_USER</strong> / <strong>ADMIN_PASSWORD</strong> in{" "}
            <code>.env.local</code> (never NEXT_PUBLIC_)
          </p>
        )}
        <p className="mt-4 text-center">
          <Link href="/" className="text-sm text-terracotta hover:underline">
            ← Back to storefront
          </Link>
        </p>
      </div>
    </main>
  );
}
