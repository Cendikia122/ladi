"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import LadiLogo from "../../../components/LadiLogo";

import { authFetch } from "@/app/lib/clientAuth";

export default function NewBlogPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("PANDUAN USAHA");
  const [author, setAuthor] = useState("Tim Ladi");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState<"published" | "draft">("published");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isUnauthorized, setIsUnauthorized] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setIsUnauthorized(false);

    try {
      const res = await authFetch("/api/blogs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          category,
          author,
          excerpt,
          content,
          status,
        }),
      });

      if (res.status === 401) {
        setIsUnauthorized(true);
        setError("Akses ditolak. Sesi Anda belum aktif atau telah berakhir.");
        return;
      }

      const json = await res.json();
      if (json.success) {
        router.push("/admin/blogs");
        router.refresh();
      } else {
        setError(json.message || "Gagal menyimpan artikel");
      }
    } catch {
      setError("Terjadi kesalahan jaringan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#0f172a]">
      {/* Top Header */}
      <header className="bg-[#0f172a] text-white border-b border-slate-800 py-4 px-4 sm:px-8">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <LadiLogo inverted={true} />
            <span className="font-mono text-xs px-2.5 py-1 rounded-full bg-white/10 text-slate-300">
              TULIS ARTIKEL
            </span>
          </div>

          <Link href="/admin/blogs" className="text-xs text-slate-300 hover:text-white">
            ← Kembali ke Daftar Artikel
          </Link>
        </div>
      </header>

      {/* Main Form */}
      <main className="max-w-4xl mx-auto px-4 sm:px-8 py-10">
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-sm space-y-6">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">Tulis Artikel Baru</h1>
            <p className="text-xs text-slate-500 mt-1">Artikel akan langsung tampil di halaman /blog jika status Published.</p>
          </div>

          {error && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-xs text-red-600 font-bold flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span>{error}</span>
              {isUnauthorized && (
                <Link
                  href="/admin/login?redirect=/admin/blogs/new"
                  className="px-3 py-1.5 rounded-lg bg-[#1853a7] text-white font-bold hover:bg-[#0f3d7d] text-center shrink-0"
                >
                  Login Sekarang →
                </Link>
              )}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                Judul Artikel
              </label>
              <input
                type="text"
                required
                placeholder="Contoh: 5 Cara Memilih Nama Domain untuk Bisnis"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#1853a7] bg-[#f8fafc]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                  Kategori
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#1853a7] bg-[#f8fafc]"
                >
                  <option value="PANDUAN USAHA">PANDUAN USAHA</option>
                  <option value="STRATEGI BISNIS">STRATEGI BISNIS</option>
                  <option value="TIPS PRAKTIS">TIPS PRAKTIS</option>
                  <option value="EDUKASI BISNIS">EDUKASI BISNIS</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                  Penulis
                </label>
                <input
                  type="text"
                  required
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#1853a7] bg-[#f8fafc]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                  Status Publikasi
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as "published" | "draft")}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#1853a7] bg-[#f8fafc]"
                >
                  <option value="published">Published (Tayang Langsung)</option>
                  <option value="draft">Draft (Simpan Konsep)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                Ringkasan Singkat (Excerpt)
              </label>
              <textarea
                rows={2}
                required
                placeholder="Penjelasan ringkas 1-2 kalimat untuk ditampilkan di kartu artikel..."
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#1853a7] bg-[#f8fafc]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                Isi Artikel Lengkap (Format HTML atau Teks)
              </label>
              <textarea
                rows={10}
                required
                placeholder="Tuliskan isi artikel Anda di sini. Tag HTML seperti <p>, <h3>, <ul>, <li> dapat digunakan..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm font-mono focus:outline-none focus:border-[#1853a7] bg-[#f8fafc]"
              />
            </div>

            <div className="pt-4 flex items-center justify-end gap-3">
              <Link
                href="/admin/blogs"
                className="px-6 py-3 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
              >
                Batal
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-3 rounded-full bg-[#fa824b] hover:bg-[#e5723b] text-white font-bold text-xs uppercase tracking-wider shadow-md transition-all disabled:opacity-50"
              >
                {loading ? "Menyimpan..." : "Simpan & Terbitkan →"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
