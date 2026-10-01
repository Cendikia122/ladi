"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import LadiLogo from "../../components/LadiLogo";
import { ProjectItem } from "@/app/lib/storage";
import { authFetch } from "@/app/lib/clientAuth";

export const dynamic = "force-dynamic";

export default function AdminProjectsPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [notice, setNotice] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const fetchProjects = async () => {
    try {
      const res = await authFetch("/api/projects?all=true");
      const json = await res.json();
      if (json.success) {
        setProjects(json.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleDelete = async (id: number, title: string) => {
    if (!confirm(`Yakin ingin menghapus portofolio / proyek: "${title}"?`)) return;
    setDeletingId(id);
    setNotice(null);

    try {
      const res = await authFetch(`/api/projects/${id}`, { method: "DELETE" });
      if (res.status === 401) {
        alert("Akses ditolak. Sesi Anda telah berakhir, silakan login kembali.");
        router.push("/admin/login?redirect=/admin/projects");
        return;
      }
      const json = await res.json();
      if (json.success) {
        setProjects((prev) => prev.filter((p) => p.id !== id));
        setNotice({
          type: "success",
          message: `Proyek "${title}" berhasil dihapus dari website.`,
        });
        alert(`Berhasil! Proyek "${title}" telah dihapus.`);
        router.refresh();
      } else {
        const msg = json.message || "Gagal menghapus proyek";
        setNotice({ type: "error", message: msg });
        alert(msg);
      }
    } catch {
      const err = "Terjadi kesalahan jaringan saat menghapus";
      setNotice({ type: "error", message: err });
      alert(err);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#0f172a]">
      {/* Admin Top Header */}
      <header className="bg-[#0f172a] text-white border-b border-slate-800 py-4 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <LadiLogo inverted={true} />
            <span className="font-mono text-xs px-2.5 py-1 rounded-full bg-white/10 text-slate-300">
              KELOLA PORTFOLIO & PROYEK
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
              href="/project"
              target="_blank"
              className="text-slate-300 hover:text-white transition-colors"
            >
              Lihat Halaman Proyek ↗
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-10 space-y-6">
        {/* Success / Error Notification Banner */}
        {notice && (
          <div
            className={`p-4 rounded-2xl border text-xs sm:text-sm font-semibold flex items-center justify-between gap-3 shadow-sm ${
              notice.type === "success"
                ? "bg-emerald-50 border-emerald-300 text-emerald-900"
                : "bg-red-50 border-red-300 text-red-900"
            }`}
          >
            <div className="flex items-center gap-2">
              <span>{notice.type === "success" ? "✅" : "⚠️"}</span>
              <span>{notice.message}</span>
            </div>
            <button
              onClick={() => setNotice(null)}
              className="text-xs opacity-60 hover:opacity-100 font-bold px-2 py-1"
            >
              ✕ Tutup
            </button>
          </div>
        )}

        {/* Action Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-8 rounded-3xl bg-white border border-slate-200 shadow-sm">
          <div>
            <h1 className="text-2xl font-extrabold text-[#0f172a]">
              Portfolio Klien & Studi Kasus
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Dokumentasi hasil nyata bisnis klien yang go-online bersama Ladi (lengkap dengan info klien & link website live).
            </p>
          </div>

          <Link
            href="/admin/projects/new"
            className="px-6 py-3.5 rounded-full bg-[#1853a7] hover:bg-[#0f3d7d] text-white font-bold text-xs uppercase tracking-wider shadow-md transition-all text-center shrink-0"
          >
            + Tambah Proyek Baru
          </Link>
        </div>

        {/* Table Content */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-sm text-slate-400">
              Memuat data portfolio...
            </div>
          ) : projects.length === 0 ? (
            <div className="p-12 text-center space-y-3">
              <p className="text-sm text-slate-500">Belum ada portfolio/proyek yang ditambahkan.</p>
              <Link
                href="/admin/projects/new"
                className="inline-block px-5 py-2.5 rounded-full bg-[#1853a7] text-white font-bold text-xs"
              >
                Buat Proyek Pertama Anda
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/75 text-slate-500 font-mono uppercase tracking-wider">
                    <th className="py-4 px-6 font-semibold">Foto & Proyek</th>
                    <th className="py-4 px-6 font-semibold">Info Klien</th>
                    <th className="py-4 px-6 font-semibold">Website Live</th>
                    <th className="py-4 px-6 font-semibold">Tahun</th>
                    <th className="py-4 px-6 font-semibold">Status</th>
                    <th className="py-4 px-6 font-semibold text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {projects.map((proj) => (
                    <tr
                      key={proj.id}
                      className="hover:bg-slate-50/60 transition-colors"
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="relative w-14 h-11 rounded-lg overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                            {proj.thumb ? (
                              <Image
                                src={proj.thumb}
                                alt={proj.title}
                                fill
                                className="object-cover"
                                unoptimized={proj.thumb.startsWith("data:") || proj.thumb.startsWith("http")}
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">
                                💼
                              </div>
                            )}
                          </div>
                          <div>
                            <span className="font-bold text-slate-900 line-clamp-1 text-sm block">
                              {proj.title}
                            </span>
                            <span className="text-[11px] text-slate-400 font-mono block">
                              /{proj.slug}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-6 text-slate-600">
                        <div className="font-semibold text-slate-800">
                          {proj.client_name || "—"}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {proj.client_industry} · {proj.client_location}
                        </div>
                      </td>

                      <td className="py-4 px-6">
                        {proj.website_url ? (
                          <a
                            href={proj.website_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-bold text-[#1853a7] hover:underline inline-flex items-center gap-1"
                          >
                            <span>Buka Web</span>
                            <span>↗</span>
                          </a>
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </td>

                      <td className="py-4 px-6 font-mono text-slate-600">
                        {proj.year || "2026"}
                      </td>

                      <td className="py-4 px-6">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            proj.status === "published"
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-slate-200 text-slate-700"
                          }`}
                        >
                          {proj.status === "published" ? "Published" : "Draft"}
                        </span>
                      </td>

                      <td className="py-4 px-6 text-right space-x-2">
                        <Link
                          href={`/admin/projects/edit/${proj.id}`}
                          className="inline-block px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-[#1853a7] hover:text-white font-bold text-slate-700 transition-colors"
                        >
                          Edit
                        </Link>
                        <button
                          type="button"
                          disabled={deletingId === proj.id}
                          onClick={() => handleDelete(proj.id, proj.title)}
                          className="inline-block px-3 py-1.5 rounded-lg bg-red-50 hover:bg-red-600 hover:text-white font-bold text-red-600 transition-colors disabled:opacity-50"
                        >
                          {deletingId === proj.id ? "Menghapus..." : "Hapus"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
