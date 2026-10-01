"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import LadiLogo from "../../../../components/LadiLogo";

import { authFetch } from "@/app/lib/clientAuth";

export default function EditBlogPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("PANDUAN USAHA");
  const [author, setAuthor] = useState("Tim Ladi");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState<"published" | "draft">("published");
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState("");
  const [isUnauthorized, setIsUnauthorized] = useState(false);

  useEffect(() => {
    if (!id) return;
    const fetchBlog = async () => {
      try {
        const res = await authFetch(`/api/blogs/${id}`);
        const json = await res.json();
        if (json.success && json.data) {
          setTitle(json.data.title || "");
          setCategory(json.data.category || "PANDUAN USAHA");
          setAuthor(json.data.author || "Tim Ladi");
          setExcerpt(json.data.excerpt || "");
          setContent(json.data.content || "");
          setStatus(json.data.status || "published");
        } else {
          setError(json.message || "Artikel tidak ditemukan");
        }
      } catch {
        setError("Gagal memuat data artikel");
      } finally {
        setInitialLoading(false);
      }
    };
    fetchBlog();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setIsUnauthorized(false);

    try {
      const res = await authFetch(`/api/blogs/${id}`, {
        method: "PUT",
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
        setError(json.message || "Gagal memperbarui artikel");
      }
    } catch {
      setError("Terjadi kesalahan jaringan");
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-6 text-sm text-slate-500">
        Memuat editor artikel...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#0f172a]">
      {/* Top Header */}
      <header className="bg-[#0f172a] text-white border-b border-slate-800 py-4 px-4 sm:px-8">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <LadiLogo inverted={true} />
            <span className="font-mono text-xs px-2.5 py-1 rounded-full bg-white/10 text-slate-300">
              EDIT ARTIKEL #{id}
            </span>
          </div>

          <Link href="/admin/blogs" className="text-xs text-slate-300 hover:text-white">
            ← Batal & Kembali
          </Link>
        </div>
      </header>

      {/* Main Form */}
      <main className="max-w-4xl mx-auto px-4 sm:px-8 py-10">
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-sm space-y-6">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">Perbarui Artikel</h1>
            <p className="text-xs text-slate-500 mt-1">Perubahan akan langsung diperbarui di website.</p>
          </div>

          {error && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-xs text-red-600 font-bold flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span>{error}</span>
              {isUnauthorized && (
                <Link
                  href={`/admin/login?redirect=/admin/blogs/edit/${id}`}
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
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#1853a7] bg-[#f8fafc]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                Isi Artikel Lengkap (HTML atau Teks)
              </label>
              <textarea
                rows={12}
                required
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
                className="px-8 py-3 rounded-full bg-[#1853a7] hover:bg-[#0f3d7d] text-white font-bold text-xs uppercase tracking-wider shadow-md transition-all disabled:opacity-50"
              >
                {loading ? "Menyimpan..." : "Simpan Perubahan →"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
