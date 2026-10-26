"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import LadiLogo from "../../components/LadiLogo";
import { TemplateItem } from "@/app/lib/storage";
import { authFetch } from "@/app/lib/clientAuth";

export const dynamic = "force-dynamic";

export default function AdminTemplatesPage() {
  const router = useRouter();
  const [templates, setTemplates] = useState<TemplateItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [industryFilter, setIndustryFilter] = useState("all");
  const [notice, setNotice] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const fetchTemplates = async () => {
    try {
      const res = await authFetch("/api/templates");
      const json = await res.json();
      if (json.success) {
        setTemplates(json.data || json.templates || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Yakin ingin menghapus template desain: "${name}"?\nPerubahan ini permanen di database/katalog.`)) {
      return;
    }
    setDeletingId(id);
    setNotice(null);

    try {
      const res = await authFetch(`/api/templates/${id}`, { method: "DELETE" });
      if (res.status === 401) {
        alert("Akses ditolak: Hanya Administrator yang berhak menghapus template.");
        router.push("/admin/login?redirect=/admin/templates");
        return;
      }
      const json = await res.json();
      if (json.success) {
        setTemplates((prev) => prev.filter((t) => t.id !== id));
        setNotice({
          type: "success",
          message: `Template "${name}" berhasil dihapus.`,
        });
      } else {
        const msg = json.message || "Gagal menghapus template";
        setNotice({ type: "error", message: msg });
        alert(msg);
      }
    } catch {
      const err = "Terjadi kesalahan koneksi saat menghapus template.";
      setNotice({ type: "error", message: err });
      alert(err);
    } finally {
      setDeletingId(null);
    }
  };

  const industries = ["all", ...Array.from(new Set(templates.map((t) => t.industry))).filter(Boolean)];

  const filteredTemplates = templates.filter((t) => {
    const matchSearch =
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.industry.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchIndustry = industryFilter === "all" || t.industry === industryFilter;
    return matchSearch && matchIndustry;
  });

  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#0f172a]">
      {/* Top Header */}
      <header className="bg-[#0f172a] text-white border-b border-slate-800 py-4 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <LadiLogo inverted={true} />
            <span className="font-mono text-xs px-2.5 py-1 rounded-full bg-white/10 text-slate-300">
              KATALOG &amp; MANAJEMEN TEMPLATE DESAIN
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
              href="/builder"
              target="_blank"
              className="text-slate-300 hover:text-white transition-colors"
            >
              Lihat di Custom Builder ↗
            </Link>
          </div>
        </div>
      </header>

      {/* Main Admin Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-10 space-y-8">
        {/* Banner Alert Notice */}
        {notice && (
          <div
            className={`p-4 rounded-2xl text-xs flex items-center justify-between ${
              notice.type === "success"
                ? "bg-emerald-50 border border-emerald-200 text-emerald-900"
                : "bg-red-50 border border-red-200 text-red-900"
            }`}
          >
            <span>{notice.message}</span>
            <button
              onClick={() => setNotice(null)}
              className="font-bold text-slate-500 hover:text-slate-900"
            >
              ✕
            </button>
          </div>
        )}

        {/* Action Header Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-8 rounded-3xl bg-white border border-slate-200 shadow-sm">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-xs font-bold text-[#1853a7] uppercase tracking-wider">
                PORTAL ADMINISTRATOR
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs text-slate-500 font-semibold">
                Total {templates.length} Desain Terdaftar
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0f172a]">
              Katalog Referensi Desain Website
            </h1>
            <p className="text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
              Kelola template website untuk Rakit Web (/builder) dan pilihan paket (/checkout). Anda dapat menambahkan template baru dengan link gambar tanpa perlu upload file fisik.
            </p>
          </div>

          <div className="shrink-0">
            <Link
              href="/admin/templates/new"
              className="px-6 py-3.5 rounded-full bg-[#fa824b] hover:bg-[#e5723b] text-white font-extrabold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all flex items-center gap-2"
            >
              <span>+</span>
              <span>Tambah Template Baru</span>
            </Link>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
          <div className="w-full sm:w-80">
            <input
              type="text"
              placeholder="Cari nama template, industri, deskripsi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-[#fa824b] bg-slate-50/50"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto text-xs">
            <span className="text-slate-400 font-bold shrink-0">Industri:</span>
            {industries.map((ind) => (
              <button
                key={ind}
                onClick={() => setIndustryFilter(ind)}
                className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all ${
                  industryFilter === ind
                    ? "bg-[#1853a7] text-white shadow-xs"
                    : "bg-slate-100 hover:bg-slate-200 text-slate-600"
                }`}
              >
                {ind === "all" ? "Semua" : ind}
              </button>
            ))}
          </div>
        </div>

        {/* Templates Grid */}
        {loading ? (
          <div className="p-16 text-center text-slate-400 bg-white rounded-3xl border border-slate-200">
            <div className="inline-block animate-spin text-2xl mb-2">⏳</div>
            <div className="text-xs">Memuat katalog template desain...</div>
          </div>
        ) : filteredTemplates.length === 0 ? (
          <div className="p-16 text-center text-slate-400 bg-white rounded-3xl border border-slate-200 space-y-2">
            <div className="text-3xl">🎨</div>
            <div className="text-sm font-bold text-slate-700">Tidak ada template yang cocok</div>
            <div className="text-xs text-slate-500">Coba ubah kata kunci pencarian atau filter industri.</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.map((template) => (
              <div
                key={template.id}
                className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  {/* Gambar Template Preview */}
                  <div className="relative aspect-[16/10] w-full bg-slate-100 overflow-hidden border-b border-slate-100">
                    <img
                      src={template.image || "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80"}
                      alt={template.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                      <span className="px-2.5 py-0.5 rounded-lg bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-bold">
                        {template.industry}
                      </span>
                    </div>
                    {template.badge && (
                      <span className="absolute top-2.5 right-2.5 px-2.5 py-0.5 rounded-lg bg-[#fa824b] text-white text-[10px] font-bold shadow-xs">
                        {template.badge}
                      </span>
                    )}
                  </div>

                  {/* Info Template */}
                  <div className="p-5 space-y-3">
                    <div>
                      <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono mb-1">
                        <span>ID: {template.id}</span>
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-bold">
                          {template.tech}
                        </span>
                      </div>
                      <h3 className="text-sm font-extrabold text-slate-900 leading-snug">
                        {template.name}
                      </h3>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                        {template.description}
                      </p>
                    </div>

                    {/* Paket yang Kompatibel */}
                    <div className="pt-2 border-t border-slate-100">
                      <span className="text-[10px] font-bold text-slate-400 block mb-1">
                        Kompatibel untuk:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {template.allowed_packages?.map((pkg) => (
                          <span
                            key={pkg}
                            className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-blue-50 text-[#1853a7] border border-blue-100"
                          >
                            {pkg.replace("paket-", "").toUpperCase()}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Action Buttons */}
                <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
                  <a
                    href={template.image}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] font-bold text-blue-600 hover:underline flex items-center gap-1"
                  >
                    <span>Buka Gambar</span>
                    <span className="text-[9px]">↗</span>
                  </a>

                  <div className="flex items-center gap-2">
                    <Link
                      href={`/admin/templates/edit/${template.id}`}
                      className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold transition-colors"
                    >
                      ✏️ Edit
                    </Link>
                    <button
                      type="button"
                      disabled={deletingId === template.id}
                      onClick={() => handleDelete(template.id, template.name)}
                      className="px-3 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 text-xs font-bold transition-colors disabled:opacity-50"
                    >
                      {deletingId === template.id ? "..." : "🗑️"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
