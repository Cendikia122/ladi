"use client";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import LadiLogo from "@/app/components/LadiLogo";
import { setClientToken, clearClientToken } from "@/app/lib/clientAuth";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/admin";
  const reason = searchParams.get("reason");

  const [username, setUsername] = useState("penulis");
  const [password, setPassword] = useState("penulis123");
  const [error, setError] = useState(
    reason === "unauthorized"
      ? "Sesi Anda belum aktif atau telah berakhir. Silakan masuk terlebih dahulu."
      : ""
  );
  const [infoMessage, setInfoMessage] = useState(
    reason === "logout" ? "Anda telah berhasil keluar (logout) dari panel admin." : ""
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (reason === "logout" || reason === "unauthorized") {
      clearClientToken();
    }
  }, [reason]);

  const executeLogin = async (userVal: string, passVal: string) => {
    setError("");
    setInfoMessage("");
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
        window.location.href = redirectUrl;
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

  const handleQuickAdmin = async () => {
    setUsername("admin");
    setPassword("admin123");
    await executeLogin("admin", "admin123");
  };

  const handleQuickWriter = async () => {
    setUsername("penulis");
    setPassword("penulis123");
    await executeLogin("penulis", "penulis123");
  };

  return (
    <div className="bg-white py-8 px-6 shadow-2xl rounded-3xl sm:px-10 text-[#0f172a] border border-slate-200">
      {infoMessage && (
        <div className="mb-4 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 font-semibold flex items-center gap-2">
          <span>✅</span>
          <span>{infoMessage}</span>
        </div>
      )}

      {error && (
        <div className="mb-4 p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 font-semibold flex items-center gap-2">
          <span>⚠️</span>
          <span>{error}</span>
        </div>
      )}

      {/* Quick 1-Click Login Buttons */}
      <div className="mb-6 pb-6 border-b border-slate-100 space-y-2.5">
        <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 text-center">
          Pilihan Masuk Cepat (1-Klik)
        </div>

        {/* Tombol Masuk Penulis Konten */}
        <button
          type="button"
          onClick={handleQuickWriter}
          disabled={loading}
          className="w-full py-3 px-4 rounded-xl bg-[#fa824b] hover:bg-[#e5723b] text-white font-bold text-xs uppercase tracking-wider shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
        >
          <span>✍️</span>
          <span>Masuk sebagai Penulis (Khusus Blog/Artikel)</span>
        </button>

        {/* Tombol Masuk Administrator Utama */}
        <button
          type="button"
          onClick={handleQuickAdmin}
          disabled={loading}
          className="w-full py-3 px-4 rounded-xl bg-[#0f172a] hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
        >
          <span>🛡️</span>
          <span>Masuk sebagai Administrator (Semua Akses)</span>
        </button>
      </div>

      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Username
          </label>
          <input
            type="text"
            required
            placeholder="admin atau penulis"
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
            className="w-full py-3.5 px-4 rounded-full bg-[#1853a7] hover:bg-[#0f3d7d] text-white font-bold text-xs uppercase tracking-wider shadow-md transition-all disabled:opacity-50 cursor-pointer"
          >
            {loading ? "Memverifikasi..." : "Masuk Manual ke Dashboard →"}
          </button>
        </div>
      </form>

      {/* Account Info Cards */}
      <div className="mt-6 pt-5 border-t border-slate-100 text-xs space-y-3">
        <div className="font-bold text-slate-800 text-center uppercase tracking-wider text-[11px]">
          Informasi Akun Tersedia
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
          {/* Akun Penulis */}
          <div className="p-3 rounded-xl bg-orange-50 border border-orange-200 space-y-1">
            <div className="font-bold text-orange-900 flex items-center gap-1">
              <span>✍️</span> Penulis Konten
            </div>
            <div className="text-slate-600">Fokus: <strong>Blog & Artikel</strong></div>
            <div className="font-mono text-slate-800">User: <strong className="text-[#fa824b]">penulis</strong></div>
            <div className="font-mono text-slate-800">Pass: <strong className="text-[#fa824b]">penulis123</strong></div>
          </div>

          {/* Akun Admin */}
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <div className="font-bold text-slate-900 flex items-center gap-1">
              <span>🛡️</span> Administrator
            </div>
            <div className="text-slate-600">Akses: <strong>Semua Fitur</strong></div>
            <div className="font-mono text-slate-800">User: <strong className="text-[#1853a7]">admin</strong></div>
            <div className="font-mono text-slate-800">Pass: <strong className="text-[#1853a7]">admin123</strong></div>
          </div>
        </div>
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
          Portal Masuk Dashboard Ladi
        </h2>
        <p className="text-xs text-slate-400">
          Masuk sebagai Administrator atau Penulis Konten Blog
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <Suspense
          fallback={
            <div className="bg-white py-12 px-6 rounded-3xl shadow-xl text-center text-slate-500 text-xs">
              <div className="w-8 h-8 border-2 border-[#1853a7] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              Memuat portal login...
            </div>
          }
        >
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
