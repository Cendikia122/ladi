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

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(
    reason === "unauthorized"
      ? "Sesi Anda belum aktif atau telah berakhir. Silakan masuk terlebih dahulu."
      : ""
  );
  const [infoMessage, setInfoMessage] = useState(
    reason === "logout" ? "Anda telah berhasil keluar (logout) dari panel admin." : ""
  );
  const [isLocked, setIsLocked] = useState(false);
  const [remainingHours, setRemainingHours] = useState<number | null>(null);
  const [remainingAttempts, setRemainingAttempts] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (reason === "logout" || reason === "unauthorized") {
      clearClientToken();
    }
  }, [reason]);

  const executeLogin = async (userVal: string, passVal: string) => {
    setError("");
    setInfoMessage("");
    setIsLocked(false);
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
        if (data.locked) {
          setIsLocked(true);
          setRemainingHours(data.remainingHours || 72);
        } else if (typeof data.remainingAttempts === "number") {
          setRemainingAttempts(data.remainingAttempts);
        }
      }
    } catch {
      setError("Gagal terhubung ke server. Periksa koneksi internet Anda.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password) {
      setError("Silakan isi username dan password.");
      return;
    }
    await executeLogin(username.trim(), password);
  };

  return (
    <div className="bg-white py-8 px-6 shadow-2xl rounded-3xl sm:px-10 text-[#0f172a] border border-slate-200">
      {/* Pesan Sukses Logout */}
      {infoMessage && (
        <div className="mb-5 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 font-semibold flex items-center gap-2">
          <span>✅</span>
          <span>{infoMessage}</span>
        </div>
      )}

      {/* Banner Peringatan Akun Terblokir 3 Hari */}
      {isLocked && (
        <div className="mb-5 p-4 rounded-2xl bg-red-50 border border-red-300 text-red-950 space-y-2">
          <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider text-red-700">
            <span>🔒</span>
            <span>Akses Akun Terblokir (3 Hari)</span>
          </div>
          <p className="text-xs text-red-900 leading-relaxed">
            {error || "Akun ini telah terblokir karena 3 kali percobaan gagal berturut-turut."}
          </p>
          <div className="p-2.5 rounded-xl bg-red-100/80 text-[11px] text-red-900 font-medium">
            💡 <strong>Pilihan Buka Blokir:</strong> Tunggu masa blokir selesai ({remainingHours ? `${remainingHours} jam lagi` : "3 hari"}), atau minta <strong>Super Administrator</strong> untuk membuka blokir akun Anda melalui panel admin.
          </div>
        </div>
      )}

      {/* Pesan Error / Percobaan Tersisa */}
      {!isLocked && error && (
        <div className="mb-5 p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1.5">
          <div className="flex items-start gap-2 font-semibold">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
          {typeof remainingAttempts === "number" && remainingAttempts > 0 && (
            <div className="text-[11px] font-mono font-bold text-amber-800 bg-amber-100/80 px-2 py-1 rounded-md inline-block">
              Sisa kesempatan: {remainingAttempts} dari 3 kali percobaan
            </div>
          )}
        </div>
      )}

      {/* Formulir Login Aman */}
      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Username
          </label>
          <input
            type="text"
            required
            autoComplete="username"
            placeholder="Masukkan username Anda"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={loading}
            className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#1853a7] focus:ring-1 focus:ring-[#1853a7] bg-[#f8fafc] text-slate-900 transition-all disabled:opacity-50"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              required
              autoComplete="current-password"
              placeholder="Masukkan password Anda"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              className="w-full px-4 py-3 pr-11 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#1853a7] focus:ring-1 focus:ring-[#1853a7] bg-[#f8fafc] text-slate-900 transition-all disabled:opacity-50"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              tabIndex={-1}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 text-sm cursor-pointer"
              title={showPassword ? "Sembunyikan password" : "Lihat password"}
            >
              {showPassword ? "🙈" : "👁️"}
            </button>
          </div>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 rounded-full bg-[#1853a7] hover:bg-[#0f3d7d] text-white font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Memverifikasi Kredensial...</span>
              </>
            ) : (
              <span>Masuk ke Dashboard →</span>
            )}
          </button>
        </div>
      </form>

      {/* Catatan Kebijakan Keamanan */}
      <div className="mt-6 pt-5 border-t border-slate-100 text-[11px] text-slate-500 text-center space-y-1">
        <div className="font-semibold text-slate-700 flex items-center justify-center gap-1">
          <span>🛡️</span>
          <span>Proteksi Keamanan Aktif</span>
        </div>
        <p className="text-slate-400 text-[10px]">
          Akun akan otomatis terblokir selama 3 hari jika gagal 3 kali berturut-turut.
        </p>
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
          Masuk ke Panel Administrasi & Pengelolaan Konten
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
