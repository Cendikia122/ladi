"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Config } from "@/app/lib/config";

interface OrderSearchResult {
  order_number: string;
  package_name: string;
  package_price: number;
  customer_name: string;
  business_name: string;
  payment_status: "unpaid" | "waiting_verification" | "paid" | "cancelled" | "refunded";
  order_status: "new" | "in_progress" | "review" | "completed";
  order_type?: string;
  template_name?: string;
  created_at: string;
}

export default function CekPesananClient() {
  const [keyword, setKeyword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [results, setResults] = useState<OrderSearchResult[]>([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [recentOrderNumbers, setRecentOrderNumbers] = useState<string[]>([]);

  // Baca riwayat pesanan dari browser localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem("ladi_recent_orders");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setRecentOrderNumbers(parsed);
        }
      }
    } catch {}
  }, []);

  const handleSearch = async (e?: React.FormEvent, customQuery?: string) => {
    if (e) e.preventDefault();
    const query = customQuery || keyword;

    if (!query.trim()) {
      setErrorMessage("Silakan masukkan nomor WhatsApp atau nomor pesanan Anda.");
      return;
    }

    setErrorMessage("");
    setIsLoading(true);
    setSearched(true);

    try {
      const res = await fetch(`/api/orders/lookup?q=${encodeURIComponent(query.trim())}`);
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Gagal mencari pesanan.");
      }

      setResults(data.orders || []);
    } catch (err: any) {
      setErrorMessage(err.message || "Terjadi kesalahan jaringan.");
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return (
          <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            Lunas / Terverifikasi
          </span>
        );
      case "waiting_verification":
        return (
          <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
            Menunggu Verifikasi Bukti
          </span>
        );
      case "cancelled":
        return (
          <span className="px-3 py-1 rounded-full bg-slate-200 text-slate-700 text-xs font-bold">
            Dibatalkan
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 rounded-full bg-orange-100 text-[#fa824b] text-xs font-bold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#fa824b] animate-ping"></span>
            Menunggu Pembayaran
          </span>
        );
    }
  };

  const getOrderStatusBadge = (status: string) => {
    switch (status) {
      case "in_progress":
        return (
          <span className="px-2.5 py-0.5 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 text-[11px] font-semibold">
            ⚙️ Sedang Dikerjakan
          </span>
        );
      case "review":
        return (
          <span className="px-2.5 py-0.5 rounded-lg bg-purple-50 text-purple-700 border border-purple-200 text-[11px] font-semibold">
            👀 Masa Review Klien
          </span>
        );
      case "completed":
        return (
          <span className="px-2.5 py-0.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-semibold">
            🎉 Selesai &amp; Serah Terima
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-lg bg-slate-100 text-slate-700 border border-slate-200 text-[11px] font-semibold">
            🆕 Pesanan Baru
          </span>
        );
    }
  };

  return (
    <div className="space-y-8">
      {/* Box Pencarian Utama */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-sm space-y-6">
        <form onSubmit={(e) => handleSearch(e)} className="space-y-4">
          <label className="block text-sm sm:text-base font-extrabold text-slate-800">
            Masukkan Nomor WhatsApp atau Nomor Pesanan (Invoice) Anda:
          </label>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="cth. 08123456789 atau LADI-2610-..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 text-sm sm:text-base rounded-2xl border-2 border-slate-200 focus:outline-none focus:border-[#fa824b] focus:ring-2 focus:ring-[#fa824b]/20 bg-slate-50/50 transition-all"
              />
              <span className="absolute left-4 top-4 text-slate-400 text-base">🔍</span>
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="py-3.5 px-8 rounded-2xl bg-[#fa824b] hover:bg-[#e5723b] disabled:bg-slate-300 text-white font-extrabold text-xs sm:text-sm uppercase tracking-wider shadow-lg hover:shadow-xl transition-all cursor-pointer shrink-0 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  <span>Mencari...</span>
                </>
              ) : (
                <>
                  <span>Cari Pesanan</span>
                  <span>→</span>
                </>
              )}
            </button>
          </div>
          <span className="text-xs text-slate-400 block">
            💡 Tips: Anda cukup mengetik nomor WhatsApp yang dipakai saat mendaftar. Semua riwayat pesanan Anda akan otomatis muncul.
          </span>
        </form>

        {errorMessage && (
          <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm flex items-center gap-2">
            <span>⚠️</span>
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Riwayat di Perangkat Ini (LocalStorage) */}
        {recentOrderNumbers.length > 0 && !searched && (
          <div className="pt-4 border-t border-slate-100 space-y-3">
            <span className="text-xs font-bold font-mono uppercase tracking-wider text-slate-400 block">
              ⚡ Terdeteksi di Perangkat Ini (Tersimpan Otomatis):
            </span>
            <div className="flex flex-wrap gap-2.5">
              {recentOrderNumbers.map((orderNum) => (
                <Link
                  key={orderNum}
                  href={`/order/${orderNum}`}
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-blue-50/80 hover:bg-blue-100 text-[#1853a7] border border-blue-200 font-mono text-xs font-bold transition-all shadow-sm group"
                >
                  <span>📋 {orderNum}</span>
                  <span className="text-slate-400 group-hover:text-[#1853a7] transition-colors">↗</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Hasil Pencarian */}
      {searched && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base sm:text-lg font-extrabold text-slate-900">
              Hasil Pencarian ({results.length} Pesanan Ditemukan)
            </h2>
            <button
              type="button"
              onClick={() => {
                setSearched(false);
                setKeyword("");
                setResults([]);
              }}
              className="text-xs text-slate-500 hover:text-slate-800 underline"
            >
              Reset Pencarian
            </button>
          </div>

          {results.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 text-center space-y-3 shadow-sm">
              <span className="text-4xl">📭</span>
              <h3 className="text-base font-extrabold text-slate-800">
                Pesanan Tidak Ditemukan
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
                Kami tidak menemukan pesanan yang cocok dengan <strong>&ldquo;{keyword}&rdquo;</strong>. Pastikan nomor WhatsApp atau nomor pesanan Anda sudah benar.
              </p>
              <div className="pt-2">
                <a
                  href={`https://wa.me/${Config.whatsappNumber}?text=Halo+Ladi%2C+saya+ingin+cek+pesanan+saya+tapi+tidak+ditemukan+di+web.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md"
                >
                  <span>Bantuan Admin via WhatsApp</span>
                  <span>💬</span>
                </a>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {results.map((ord) => {
                const dateStr = new Date(ord.created_at).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                });

                return (
                  <div
                    key={ord.order_number}
                    className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-sm space-y-4 hover:border-slate-300 transition-all flex flex-col justify-between"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-sm sm:text-base font-black text-slate-900">
                          {ord.order_number}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                          ord.order_type === "pecahan"
                            ? "bg-purple-100 text-purple-800"
                            : "bg-blue-100 text-blue-800"
                        }`}>
                          {ord.order_type === "pecahan" ? "🧩 Pecahan LEGO" : "📦 Paketan"}
                        </span>
                      </div>
                      <div className="text-xs text-slate-400">
                        Dibuat: {dateStr} WIB
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                      <div className="space-y-1">
                        <div className="text-xs text-slate-400 uppercase font-bold">Produk / Layanan</div>
                        <div className="text-sm font-extrabold text-slate-900">{ord.package_name}</div>
                        <div className="text-xs text-slate-500">Usaha: <strong>{ord.business_name}</strong></div>
                      </div>

                      <div className="space-y-1">
                        <div className="text-xs text-slate-400 uppercase font-bold">Total Tagihan</div>
                        <div className="text-base font-black text-[#1853a7]">{formatRupiah(ord.package_price)}</div>
                        <div>{getOrderStatusBadge(ord.order_status)}</div>
                      </div>

                      <div className="space-y-2 text-left md:text-right">
                        <div>{getPaymentStatusBadge(ord.payment_status)}</div>
                        <div className="pt-1">
                          <Link
                            href={`/order/${ord.order_number}`}
                            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl bg-[#fa824b] hover:bg-[#e5723b] text-white font-extrabold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all w-full sm:w-auto"
                          >
                            <span>Buka Invoice &amp; Bayar</span>
                            <span>→</span>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Box Bantuan Customer Service */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#0f172a] text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl relative overflow-hidden">
        <div className="space-y-1 text-center md:text-left z-10">
          <div className="text-xs font-bold text-[#fa824b] uppercase tracking-wider">
            Butuh Bantuan Cepat?
          </div>
          <h3 className="text-lg sm:text-xl font-extrabold">
            Ketinggalan Informasi Pembayaran atau Belum Menerima Konfirmasi?
          </h3>
          <p className="text-xs text-slate-300 max-w-xl">
            Tim customer service Ladi siap membantu mengecek status pesanan Anda secara manual dalam hitungan menit via WhatsApp.
          </p>
        </div>
        <a
          href={`https://wa.me/${Config.whatsappNumber}?text=Halo+Ladi%2C+saya+ingin+konfirmasi+pesanan+saya.`}
          target="_blank"
          rel="noopener noreferrer"
          className="px-6 py-3 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md shrink-0 z-10"
        >
          Chat WhatsApp 💬
        </a>
      </div>
    </div>
  );
}
