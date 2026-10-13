"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import LadiLogo from "../../components/LadiLogo";
import { TeamMember } from "@/app/lib/storage";
import { authFetch, getClientSession } from "@/app/lib/clientAuth";

export const dynamic = "force-dynamic";

export default function AdminTeamPage() {
  const router = useRouter();
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [notice, setNotice] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const fetchTeam = async () => {
    try {
      const res = await authFetch("/api/team?all=true");
      const json = await res.json();
      if (json.success) {
        setTeam(json.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getClientSession().then((u) => {
      if (u && u.role === "editor") {
        alert("Akses ditolak. Pengaturan Our Team khusus untuk Super Administrator.");
        router.push("/admin/blogs");
        return;
      }
      fetchTeam();
    });
  }, [router]);

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Yakin ingin menghapus anggota tim "${name}"?`)) return;
    setDeletingId(id);
    setNotice(null);

    try {
      const res = await authFetch(`/api/team/${id}`, { method: "DELETE" });
      if (res.status === 401) {
        alert("Akses ditolak. Sesi Anda telah berakhir, silakan login kembali.");
        router.push("/admin/login?redirect=/admin/team");
        return;
      }
      const json = await res.json();
      if (json.success) {
        setTeam((prev) => prev.filter((m) => m.id !== id));
        setNotice({
          type: "success",
          message: `Anggota tim "${name}" berhasil dihapus dan website telah diperbarui.`,
        });
        alert(`Berhasil! Anggota tim "${name}" telah dihapus.`);
        router.refresh();
      } else {
        const msg = json.message || "Gagal menghapus anggota tim";
        setNotice({ type: "error", message: msg });
        alert(msg);
      }
    } catch (err: any) {
      alert("Terjadi kesalahan jaringan.");
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
            <span className="font-mono text-xs px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
              👥 KELOLA OUR TEAM
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
              href="/"
              target="_blank"
              className="text-slate-300 hover:text-white transition-colors"
            >
              Lihat Website ↗
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-10 space-y-6">
        {/* Notice Banner */}
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
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0f172a]">
              Manajemen Anggota &quot;Our Team&quot;
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Atur foto profil, nama, jabatan, badge keahlian, dan urutan profil tim yang tampil di halaman depan website.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/admin/team/new"
              className="px-5 py-3 rounded-full bg-[#1853a7] hover:bg-[#0f3d7d] text-white font-bold text-xs uppercase tracking-wider shadow-md transition-all flex items-center gap-1.5"
            >
              <span>+</span> Tambah Anggota Tim
            </Link>
          </div>
        </div>

        {/* Team Members List */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <div className="font-bold text-base text-slate-900">
              Daftar Profil Tim ({team.length})
            </div>
            <span className="text-xs font-mono text-slate-500">
              Live terhubung ke Beranda
            </span>
          </div>

          {loading ? (
            <div className="p-16 text-center text-slate-400 text-sm">
              Memuat data anggota tim...
            </div>
          ) : team.length === 0 ? (
            <div className="p-16 text-center space-y-4">
              <span className="text-4xl block">👥</span>
              <p className="text-slate-600 font-semibold text-sm">Belum ada anggota tim terdaftar.</p>
              <Link
                href="/admin/team/new"
                className="inline-block px-5 py-2.5 rounded-full bg-[#1853a7] text-white text-xs font-bold"
              >
                + Tambah Anggota Pertama
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {team.map((m) => {
                const img = m.image || "/images/team/team1.jpg";
                return (
                  <div
                    key={m.id}
                    className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-start gap-5 min-w-0">
                      {/* Avatar */}
                      <div className="relative w-16 h-16 rounded-2xl overflow-hidden ring-2 ring-slate-100 shadow-sm shrink-0 bg-slate-100">
                        <Image
                          src={img}
                          alt={m.name}
                          fill
                          className="object-cover"
                          sizes="64px"
                          unoptimized={img.startsWith("data:") || img.startsWith("http")}
                        />
                      </div>

                      {/* Details */}
                      <div className="min-w-0 space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-bold text-base text-slate-900 truncate">
                            {m.name}
                          </h3>
                          <span className="px-2.5 py-0.5 rounded-full bg-[#1853a7]/10 text-[#1853a7] font-bold text-[11px] uppercase">
                            {m.badge || "Tim Ladi"}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                              m.status === "active"
                                ? "bg-emerald-100 text-emerald-800"
                                : "bg-slate-100 text-slate-500"
                            }`}
                          >
                            {m.status === "active" ? "Aktif" : "Nonaktif"}
                          </span>
                          <span className="text-[11px] font-mono text-slate-400">
                            Urutan: #{m.order_num || 1}
                          </span>
                        </div>

                        <div className="text-xs font-semibold text-[#fa824b]">
                          {m.role}
                        </div>

                        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                          {m.desc}
                        </p>

                        {m.focus && (
                          <div className="text-[11px] text-slate-500 pt-1">
                            🎯 <strong>Fokus Keahlian:</strong> {m.focus}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2.5 shrink-0 self-end md:self-center">
                      <Link
                        href={`/admin/team/edit/${m.id}`}
                        className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-[#1853a7] hover:text-white text-slate-700 text-xs font-bold transition-all shadow-sm"
                      >
                        ✏️ Edit Profil
                      </Link>
                      <button
                        onClick={() => handleDelete(m.id, m.name)}
                        disabled={deletingId === m.id}
                        className="px-3.5 py-2 rounded-xl bg-red-50 hover:bg-red-600 hover:text-white text-red-600 text-xs font-bold transition-all disabled:opacity-50"
                      >
                        {deletingId === m.id ? "Menghapus..." : "🗑️ Hapus"}
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
