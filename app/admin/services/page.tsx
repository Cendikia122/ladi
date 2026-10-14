"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import LadiLogo from "../../components/LadiLogo";
import { ServicePackage } from "@/app/lib/storage";
import { authFetch } from "@/app/lib/clientAuth";

export const dynamic = "force-dynamic";

export default function AdminServicesPage() {
  const router = useRouter();
  const [packages, setPackages] = useState<ServicePackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [notice, setNotice] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const fetchPackages = async () => {
    try {
      const res = await authFetch("/api/services?all=true");
      const json = await res.json();
      if (json.success) {
        setPackages(json.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Yakin ingin menghapus paket produk: "${name}"?\nPerubahan ini permanen di database.`)) {
      return;
    }
    setDeletingId(id);
    setNotice(null);

    try {
      const res = await authFetch(`/api/services/${id}`, { method: "DELETE" });
      if (res.status === 401) {
        alert("Akses ditolak: Hanya Super Admin yang berhak menghapus paket.");
        router.push("/admin/login?redirect=/admin/services");
        return;
      }
      const json = await res.json();
      if (json.success) {
        setPackages((prev) => prev.filter((p) => p.id !== id));
        setNotice({
          type: "success",
          message: `Paket "${name}" berhasil dihapus.`,
        });
        alert(`Berhasil! Paket "${name}" telah dihapus.`);
        router.refresh();
      } else {
        const msg = json.message || "Gagal menghapus paket";
        setNotice({ type: "error", message: msg });
        alert(msg);
      }
    } catch {
      const err = "Terjadi kesalahan koneksi saat menghapus paket";
      setNotice({ type: "error", message: err });
      alert(err);
    } finally {
      setDeletingId(null);
    }
  };

  const activeCount = packages.filter((p) => p.status === "active").length;

  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#0f172a]">
      {/* Top Header */}
      <header className="bg-[#0f172a] text-white border-b border-slate-800 py-4 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <LadiLogo inverted={true} />
            <span className="font-mono text-xs px-2.5 py-1 rounded-full bg-white/10 text-slate-300">
              PRODUK & PAKET LAYANAN
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <Link
              href="/admin"
              className="text-slate-300 hover:text-white transition-colors"
            >
              ← Kembali ke Dashboard
            </Link>
            <Link
              href="/services"
              target="_blank"
              className="text-slate-300 hover:text-white transition-colors"
            >
              Lihat Katalog Layanan ↗
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-10 space-y-6">
        {/* Banner Alert Notification */}
        {notice && (
          <div
            className={`p-4 rounded-2xl border text-xs font-bold flex items-center justify-between gap-3 ${
              notice.type === "success"
                ? "bg-emerald-50 border-emerald-200 text-emerald-900"
                : "bg-red-50 border-red-200 text-red-900"
            }`}
          >
            <span>{notice.message}</span>
            <button
              onClick={() => setNotice(null)}
              className="text-slate-500 hover:text-slate-800 cursor-pointer"
            >
              ✕
            </button>
          </div>
        )}

        {/* Action Header Card */}
        <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-[#1853a7]/10 text-[#1853a7] text-[11px] font-bold uppercase tracking-wider font-mono">
                Super Admin Only
              </span>
              <span className="text-xs text-slate-500 font-mono">
                {activeCount} Paket Aktif dari {packages.length} Total
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0f172a]">
              Kelola Paket Produk & Landing Page Iklan
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl">
              Halaman landing page per produk dibuat otomatis di{" "}
              <code className="text-[#1853a7] font-mono">/services/[slug]</code> yang siap ditempelkan langsung pada link CTA iklan Google Ads, TikTok Ads, dan Meta Ads.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/admin/services/new"
              className="px-6 py-3.5 rounded-full bg-[#fa824b] hover:bg-[#e5723b] text-white font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>+</span>
              <span>Tambah Paket Baru</span>
            </Link>
          </div>
        </div>

        {/* Packages List Table */}
        <div className="rounded-3xl bg-white border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <h2 className="font-bold text-slate-900 text-lg">Daftar Paket Produk Layanan</h2>
            <span className="text-xs text-slate-500">Urutan tampil di website dapat diatur per nomor</span>
          </div>

          {loading ? (
            <div className="p-12 text-center text-slate-400 text-sm">
              Memuat data paket produk...
            </div>
          ) : packages.length === 0 ? (
            <div className="p-12 text-center text-slate-500 text-sm space-y-3">
              <p>Belum ada paket produk yang terdaftar.</p>
              <Link
                href="/admin/services/new"
                className="inline-block px-5 py-2.5 rounded-full bg-[#1853a7] text-white font-bold text-xs uppercase tracking-wider"
              >
                + Tambah Paket Pertama
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {packages.map((pkg) => {
                let deliverablesCount = 0;
                try {
                  const parsed = JSON.parse(pkg.deliverables);
                  deliverablesCount = Array.isArray(parsed) ? parsed.length : 0;
                } catch {
                  deliverablesCount = pkg.deliverables ? pkg.deliverables.split("\n").filter(Boolean).length : 0;
                }

                let examplesCount = 0;
                try {
                  const ex = JSON.parse(pkg.example_websites || "[]");
                  examplesCount = Array.isArray(ex) ? ex.length : 0;
                } catch {
                  examplesCount = 0;
                }

                return (
                  <div
                    key={pkg.id}
                    className="p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6 hover:bg-slate-50/60 transition-colors"
                  >
                    {/* Sisi Kiri: Informasi Paket */}
                    <div className="space-y-2 min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            pkg.status === "active"
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-slate-200 text-slate-600"
                          }`}
                        >
                          {pkg.status === "active" ? "Aktif" : "Nonaktif"}
                        </span>

                        <span className="px-2.5 py-0.5 rounded-full bg-[#fa824b]/15 text-[#fa824b] text-[10px] font-bold uppercase tracking-wider">
                          {pkg.tag}
                        </span>

                        {pkg.badge_popular && (
                          <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-bold">
                            ⭐ Paling Diminati
                          </span>
                        )}

                        <span className="text-xs text-slate-400 font-mono">
                          Order: #{pkg.order_num || 0}
                        </span>
                      </div>

                      <div>
                        <h3 className="text-xl font-extrabold text-slate-900 flex items-baseline gap-2">
                          <span>{pkg.name}</span>
                          <span className="text-xs text-slate-400 font-mono font-normal">
                            (/services/{pkg.slug})
                          </span>
                        </h3>
                        <p className="text-xs text-slate-600 line-clamp-1 mt-0.5">
                          {pkg.subtitle}
                        </p>
                      </div>

                      {/* Detail Ringkas */}
                      <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                        <div className="flex items-center gap-1 font-semibold text-[#1853a7]">
                          <span>💰 {pkg.price}</span>
                          {pkg.original_price && (
                            <span className="text-slate-400 line-through text-[11px] ml-1">
                              {pkg.original_price}
                            </span>
                          )}
                        </div>
                        <div>⏱️ {pkg.timeline}</div>
                        <div>📦 {deliverablesCount} Fitur Didapatkan</div>
                        <div>🌐 {examplesCount} Contoh Website</div>
                      </div>
                    </div>

                    {/* Sisi Kanan: Action Buttons */}
                    <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                      <Link
                        href={`/services/${pkg.slug}`}
                        target="_blank"
                        className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all flex items-center gap-1"
                        title="Buka link landing page iklan di tab baru"
                      >
                        <span>Landing Page Iklan</span>
                        <span>↗</span>
                      </Link>

                      <Link
                        href={`/admin/services/edit/${pkg.id}`}
                        className="px-4 py-2 rounded-xl bg-[#1853a7] hover:bg-[#0f3d7d] text-white text-xs font-bold shadow-xs hover:shadow transition-all"
                      >
                        Edit Detail
                      </Link>

                      <button
                        onClick={() => handleDelete(pkg.id, pkg.name)}
                        disabled={deletingId === pkg.id}
                        className="px-3.5 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold transition-all disabled:opacity-50 cursor-pointer"
                      >
                        {deletingId === pkg.id ? "Menghapus..." : "Hapus"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
