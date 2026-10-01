"use client";
import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import LadiLogo from "../../components/LadiLogo";
import { setClientToken } from "@/app/lib/clientAuth";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/admin";
  const reason = searchParams.get("reason");

  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("admin123");
  const [error, setError] = useState(
    reason === "unauthorized" ? "Sesi Anda belum aktif atau telah berakhir. Silakan masuk terlebih dahulu." : ""
  );
  const [loading, setLoading] = useState(false);

  const executeLogin = async (userVal: string, passVal: string) => {
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: userVal, password: passVal }),
      });
      const data = await res.json();

      if (data.success) {
        if (data.token) {
          setClientToken(data.token);
        }
        router.push(redirectUrl);
        router.refresh();
      } else {
        setError(data.message || "Username atau password salah");
      }
    } catch {
      setError("Gagal terhubung ke server");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    await executeLogin(username, password);
  };

  const handleQuickLogin = async () => {
    setUsername("admin");
    setPassword("admin123");
    await executeLogin("admin", "admin123");
  };

  return (
    <div className="bg-white py-8 px-6 shadow-2xl rounded-3xl sm:px-10 text-[#0f172a] border border-slate-200">
      {error && (
        <div className="mb-4 p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 font-semibold flex items-center gap-2">
          <span>⚠️</span>
          <span>{error}</span>
        </div>
      )}

      {/* Quick 1-Click Login Button */}
      <div className="mb-6 pb-6 border-b border-slate-100">
        <button
          type="button"
          onClick={handleQuickLogin}
          disabled={loading}
          className="w-full py-3.5 px-4 rounded-xl bg-[#0f172a] hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <span>⚡</span>
          <span>Masuk Cepat (Akun Administrator Default)</span>
        </button>
        <p className="text-[11px] text-center text-slate-400 mt-2">
          Klik untuk langsung login dengan akun bawaan sistem
        </p>
      </div>

      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Username
          </label>
          <input
            type="text"
            required
            placeholder="Masukkan username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#1853a7] bg-[#f8fafc]"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Password
          </label>
          <input
            type="password"
            required
            placeholder="Masukkan password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#1853a7] bg-[#f8fafc]"
          />
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 rounded-full bg-[#1853a7] hover:bg-[#0f3d7d] text-white font-bold text-xs uppercase tracking-wider shadow-md transition-all disabled:opacity-50"
          >
            {loading ? "Memverifikasi..." : "Masuk Manual ke Dashboard →"}
          </button>
        </div>
      </form>

      {/* Development Hint Box */}
      <div className="mt-6 pt-4 border-t border-slate-100 text-center text-xs text-slate-500 space-y-1">
        <span className="font-semibold text-slate-700">Kredensial Default:</span>
        <div>Username: <code className="bg-slate-100 px-1 py-0.5 rounded text-[#1853a7]">admin</code></div>
        <div>Password: <code className="bg-slate-100 px-1 py-0.5 rounded text-[#1853a7]">admin123</code></div>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-[#0f172a] text-white flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3">
        <div className="flex justify-center">
          <LadiLogo inverted={true} />
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-white">
          Portal Masuk Administrator
        </h2>
        <p className="text-xs text-slate-400">
          Kelola konten artikel dan pembaruan sistem Ladi
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <Suspense fallback={<div className="bg-white py-12 rounded-3xl text-center text-slate-500 text-xs">Memuat portal...</div>}>
          <LoginForm />
        </Suspense>

        <div className="mt-6 text-center">
          <Link href="/" className="text-xs text-slate-400 hover:text-white transition-colors">
            ← Kembali ke Website Utama
          </Link>
        </div>
      </div>
    </div>
  );
}
