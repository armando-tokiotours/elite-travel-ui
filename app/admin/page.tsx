"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Simple auth - hardcoded for now
    const ADMIN_USER = "admin";
    const ADMIN_PASS = "admin123";

    if (username === ADMIN_USER && password === ADMIN_PASS) {
      localStorage.setItem("admin-token", "logged-in");
      router.push("/admin/dashboard");
    } else {
      setError("Invalid credentials");
    }

    setLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-slate-900 to-slate-800 px-4">
      <div className="w-full max-w-md">
        <div className="rounded-lg border border-slate-700 bg-slate-800 p-8 shadow-2xl">
          <h1 className="mb-2 text-center text-3xl font-bold text-white">
            Elite Travel
          </h1>
          <p className="mb-8 text-center text-slate-400">Admin Configuration</p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                className="mt-2 w-full rounded border border-slate-600 bg-slate-700 px-4 py-2 text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="mt-2 w-full rounded border border-slate-600 bg-slate-700 px-4 py-2 text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
              />
            </div>

            {error && (
              <div className="rounded bg-red-900 p-3 text-sm text-red-200">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded bg-blue-600 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-slate-500">
            Demo credentials: admin / admin123
          </p>

          <div className="mt-8 border-t border-slate-700 pt-6">
            <Link
              href="/"
              className="block text-center text-sm text-slate-400 hover:text-blue-400 transition-colors"
            >
              ← Back to Main Page
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
