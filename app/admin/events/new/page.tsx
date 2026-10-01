"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import LadiLogo from "../../../components/LadiLogo";

import { authFetch } from "@/app/lib/clientAuth";
import ImageUpload from "@/app/components/ImageUpload";
import RichTextEditor from "@/app/components/RichTextEditor";

export default function NewEventPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [tag, setTag] = useState("Workshop Praktis");
  const [thumb, setThumb] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("Bogor & Live Zoom");
  const [shortDesc, setShortDesc] = useState("");
  const [description, setDescription] = useState("");
  const [btnText, setBtnText] = useState("Daftar Sekarang");
  const [btnLink, setBtnLink] = useState("");
  const [status, setStatus] = useState<"active" | "inactive">("active");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isUnauthorized, setIsUnauthorized] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setIsUnauthorized(false);

    try {
      const res = await authFetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          tag,
          thumb,
          date,
          location,
          short_desc: shortDesc,
          description,
          btn_text: btnText,
          btn_link: btnLink || undefined,
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
        router.push("/admin/events");
        router.refresh();
      } else {
        setError(json.message || "Gagal menyimpan event");
      }
    } catch {
      setError("Terjadi kesalahan jaringan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#0f172a]">
      {/* Header */}
      <header className="bg-[#0f172a] text-white border-b border-slate-800 py-4 px-4 sm:px-8">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <LadiLogo inverted={true} />
            <span className="font-mono text-xs px-2.5 py-1 rounded-full bg-white/10 text-slate-300">
              TAMBAH EVENT
            </span>
          </div>

          <Link href="/admin/events" className="text-xs text-slate-300 hover:text-white">
            ← Batal & Kembali
          </Link>
        </div>
      </header>

      {/* Form */}
      <main className="max-w-4xl mx-auto px-4 sm:px-8 py-10">
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-sm space-y-6">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">Tambah Event Baru</h1>
            <p className="text-xs text-slate-500 mt-1">Event akan muncul di halaman publik /events.</p>
          </div>

          {error && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-xs text-red-600 font-bold flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span>{error}</span>
              {isUnauthorized && (
                <Link
                  href="/admin/login?redirect=/admin/events/new"
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
                Nama / Judul Event
              </label>
              <input
                type="text"
                required
                placeholder="Contoh: Workshop Digitalisasi UMKM Bogor"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#1853a7] bg-[#f8fafc]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                  Kategori Tag
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Workshop Praktis / Seminar"
                  value={tag}
                  onChange={(e) => setTag(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#1853a7] bg-[#f8fafc]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                  Jadwal / Tanggal Pelaksanaan
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Sabtu, 24 Oktober 2026 · 09.00 WIB"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#1853a7] bg-[#f8fafc]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                  Lokasi
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Bogor Creative Center / Online via Zoom"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#1853a7] bg-[#f8fafc]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                  Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as "active" | "inactive")}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#1853a7] bg-[#f8fafc]"
                >
                  <option value="active">Active (Terbuka untuk Pendaftaran)</option>
                  <option value="inactive">Inactive (Selesai / Ditutup)</option>
                </select>
              </div>
            </div>

            <ImageUpload
              value={thumb}
              onChange={setThumb}
              label="Foto / Poster Event"
              helperText="Upload gambar poster/banner event dari laptop atau gunakan link URL eksternal (JPG/PNG/WEBP, maks 5MB)."
            />

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                Ringkasan Singkat (Short Description)
              </label>
              <textarea
                rows={2}
                required
                placeholder="Penjelasan ringkas 1-2 kalimat untuk preview event..."
                value={shortDesc}
                onChange={(e) => setShortDesc(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#1853a7] bg-[#f8fafc]"
              />
            </div>

            <RichTextEditor
              value={description}
              onChange={setDescription}
              label="Deskripsi Lengkap Event (Rich Text Editor)"
              placeholder="Detail materi, jadwal lengkap, profil narasumber, dan fasilitas peserta..."
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                  Teks Tombol Aksi
                </label>
                <input
                  type="text"
                  value={btnText}
                  onChange={(e) => setBtnText(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#1853a7] bg-[#f8fafc]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                  Link Pendaftaran (Opsional, Default ke WhatsApp)
                </label>
                <input
                  type="url"
                  placeholder="https://wa.me/... atau link form"
                  value={btnLink}
                  onChange={(e) => setBtnLink(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#1853a7] bg-[#f8fafc]"
                />
              </div>
            </div>

            <div className="pt-4 flex items-center justify-end gap-3">
              <Link
                href="/admin/events"
                className="px-6 py-3 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
              >
                Batal
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-3 rounded-full bg-[#fa824b] hover:bg-[#e5723b] text-white font-bold text-xs uppercase tracking-wider shadow-md transition-all disabled:opacity-50"
              >
                {loading ? "Menyimpan..." : "Simpan & Terbitkan Event →"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
