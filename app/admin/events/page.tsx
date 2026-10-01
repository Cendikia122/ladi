"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import LadiLogo from "../../components/LadiLogo";
import { EventItem } from "@/app/lib/storage";
import { authFetch } from "@/app/lib/clientAuth";

export const dynamic = "force-dynamic";

export default function AdminEventsPage() {
  const router = useRouter();
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [notice, setNotice] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const fetchEvents = async () => {
    try {
      const res = await authFetch("/api/events?all=true");
      const json = await res.json();
      if (json.success) {
        setEvents(json.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleDelete = async (id: number, title: string) => {
    if (!confirm(`Hapus event "${title}"?`)) return;
    setDeletingId(id);
    setNotice(null);

    try {
      const res = await authFetch(`/api/events/${id}`, { method: "DELETE" });
      if (res.status === 401) {
        alert("Akses ditolak. Sesi Anda telah berakhir, silakan login kembali.");
        router.push("/admin/login?redirect=/admin/events");
        return;
      }
      const json = await res.json();
      if (json.success) {
        setEvents((prev) => prev.filter((e) => e.id !== id));
        setNotice({
          type: "success",
          message: `Event "${title}" berhasil dihapus dan website telah diperbarui.`,
        });
        alert(`Berhasil! Event "${title}" telah dihapus.`);
        router.refresh();
      } else {
        const msg = json.message || "Gagal menghapus event";
        setNotice({ type: "error", message: msg });
        alert(msg);
      }
    } catch {
      const err = "Terjadi kesalahan jaringan saat menghapus event";
      setNotice({ type: "error", message: err });
      alert(err);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#0f172a]">
      {/* Header */}
      <header className="bg-[#0f172a] text-white border-b border-slate-800 py-4 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <LadiLogo inverted={true} />
            <span className="font-mono text-xs px-2.5 py-1 rounded-full bg-white/10 text-slate-300">
              KELOLA EVENT & WORKSHOP
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
              href="/events"
              target="_blank"
              className="text-slate-300 hover:text-white transition-colors"
            >
              Lihat Halaman Event ↗
            </Link>
          </div>
        </div>
      </header>

      {/* Main */}
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

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0f172a]">
              Semua Event & Workshop
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Kelola agenda pelatihan, kelas digital, dan klinik konsultasi.
            </p>
          </div>

          <Link
            href="/admin/events/new"
            className="px-6 py-3 rounded-full bg-[#1853a7] hover:bg-[#0f3d7d] text-white font-bold text-xs uppercase tracking-wider shadow-md transition-all self-start sm:self-auto"
          >
            + Tambah Event Baru
          </Link>
        </div>

        {/* Table */}
        <div className="rounded-3xl bg-white border border-slate-200 shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-sm text-slate-500">
              Memuat data event...
            </div>
          ) : events.length === 0 ? (
            <div className="p-12 text-center space-y-3">
              <p className="text-slate-500 text-sm">Belum ada agenda event yang dibuat.</p>
              <Link
                href="/admin/events/new"
                className="inline-block px-5 py-2.5 rounded-full bg-[#1853a7] text-white font-bold text-xs"
              >
                Buat Event Pertama
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-[#f8fafc] text-xs font-mono uppercase text-slate-500 border-b border-slate-200">
                  <tr>
                    <th className="p-4 sm:px-6">Nama Event</th>
                    <th className="p-4">Kategori Tag</th>
                    <th className="p-4">Tanggal / Waktu</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 sm:px-6 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {events.map((e) => (
                    <tr key={e.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-4 sm:px-6 font-bold text-slate-900 max-w-md">
                        <div>{e.title}</div>
                        <div className="text-[11px] text-slate-400 font-normal mt-0.5">
                          📍 {e.location}
                        </div>
                      </td>
                      <td className="p-4 font-mono text-xs text-[#fa824b] font-bold">{e.tag}</td>
                      <td className="p-4 text-xs text-slate-600">{e.date}</td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase font-mono ${
                          e.status === "active"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-slate-100 text-slate-600"
                        }`}>
                          {e.status}
                        </span>
                      </td>
                      <td className="p-4 sm:px-6 text-right space-x-2">
                        <Link
                          href={`/admin/events/edit/${e.id}`}
                          className="px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-[#1853a7] font-bold text-xs inline-block"
                        >
                          Edit
                        </Link>
                        <button
                          type="button"
                          disabled={deletingId === e.id}
                          onClick={() => handleDelete(e.id, e.title)}
                          className="px-3 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 font-bold text-xs inline-block disabled:opacity-50"
                        >
                          {deletingId === e.id ? "Menghapus..." : "Hapus"}
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
