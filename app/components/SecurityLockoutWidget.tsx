"use client";

import { useState, useEffect } from "react";
import { authFetch } from "@/app/lib/clientAuth";

interface LockoutItem {
  username: string;
  failed_attempts: number;
  isLocked: boolean;
  locked_until: number;
  remainingHours: number;
  last_attempt: number;
}

export default function SecurityLockoutWidget() {
  const [lockouts, setLockouts] = useState<LockoutItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [manualUser, setManualUser] = useState("");
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const fetchLockouts = async () => {
    try {
      const res = await authFetch("/api/auth/reset-lockout");
      if (res.ok) {
        const json = await res.json();
        if (json.success) {
          setLockouts(json.data || []);
        }
      }
    } catch {
      // Abaikan error jaringan
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLockouts();
  }, []);

  const handleUnlock = async (username: string) => {
    if (!username.trim()) return;
    setActionLoading(username);
    setMessage(null);

    try {
      const res = await authFetch("/api/auth/reset-lockout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username.trim() }),
      });
      const json = await res.json();

      if (json.success) {
        setMessage({ type: "success", text: json.message });
        setManualUser("");
        await fetchLockouts();
      } else {
        setMessage({ type: "error", text: json.message || "Gagal membuka blokir" });
      }
    } catch {
      setMessage({ type: "error", text: "Terjadi kesalahan saat membuka blokir" });
    } finally {
      setActionLoading(null);
    }
  };

  const lockedAccounts = lockouts.filter((l) => l.isLocked);

  return (
    <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <span className="text-xl">🛡️</span>
          <div>
            <h3 className="font-bold text-sm text-slate-900">
              Pengawasan Keamanan Login & Kontrol Blokir
            </h3>
            <p className="text-xs text-slate-500">
              Kebijakan Aktif: 3 kali gagal login = otomatis terblokir selama 3 hari.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {lockedAccounts.length > 0 ? (
            <span className="px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-bold animate-pulse">
              ⚠️ {lockedAccounts.length} Akun Terblokir
            </span>
          ) : (
            <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
              ✓ Semua Akun Aman
            </span>
          )}
        </div>
      </div>

      {/* Notifikasi Hasil Tindakan */}
      {message && (
        <div
          className={`p-3.5 rounded-xl text-xs font-medium flex items-center justify-between ${
            message.type === "success"
              ? "bg-emerald-50 text-emerald-900 border border-emerald-200"
              : "bg-red-50 text-red-900 border border-red-200"
          }`}
        >
          <span>{message.text}</span>
          <button
            type="button"
            onClick={() => setMessage(null)}
            className="text-slate-400 hover:text-slate-700 ml-2 font-bold cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Daftar Akun yang Terblokir */}
      {lockedAccounts.length > 0 && (
        <div className="space-y-2">
          <div className="text-xs font-bold text-red-700 uppercase tracking-wider">
            Daftar Akun yang Sedang Terblokir:
          </div>
          <div className="divide-y divide-slate-100 border border-red-200 rounded-2xl overflow-hidden bg-red-50/50">
            {lockedAccounts.map((item) => (
              <div
                key={item.username}
                className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div>
                  <div className="font-bold text-slate-900 flex items-center gap-2">
                    <span>🔒 User:</span>
                    <span className="font-mono px-2 py-0.5 rounded bg-white border border-red-200 text-red-700">
                      {item.username}
                    </span>
                  </div>
                  <div className="text-slate-600 mt-1">
                    Gagal: <strong>{item.failed_attempts}x</strong> · Sisa waktu blokir otomatis:{" "}
                    <strong className="text-red-700">{item.remainingHours} jam lagi</strong>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleUnlock(item.username)}
                  disabled={actionLoading === item.username}
                  className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-sm transition-all disabled:opacity-50 flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
                >
                  <span>🔓</span>
                  <span>
                    {actionLoading === item.username ? "Membuka..." : "Buka Blokir Sekarang"}
                  </span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Form Buka Blokir Manual (Untuk fleksibilitas Super Admin) */}
      <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <span className="text-slate-600">
          Super Admin dapat mereset riwayat salah login atau membuka blokir akun sewaktu-waktu:
        </span>
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Username (misal: penulis)"
            value={manualUser}
            onChange={(e) => setManualUser(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-[#1853a7] bg-[#f8fafc] w-44"
          />
          <button
            type="button"
            onClick={() => handleUnlock(manualUser)}
            disabled={!manualUser.trim() || actionLoading === manualUser}
            className="px-4 py-2 rounded-xl bg-[#1853a7] hover:bg-[#0f3d7d] text-white font-bold text-xs transition-all disabled:opacity-40 cursor-pointer shrink-0"
          >
            {actionLoading === manualUser ? "Memproses..." : "Buka Blokir"}
          </button>
        </div>
      </div>
    </div>
  );
}
