"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import LadiLogo from "../../../../components/LadiLogo";
import { authFetch } from "@/app/lib/clientAuth";
import ImageUpload from "@/app/components/ImageUpload";
import RichTextEditor from "@/app/components/RichTextEditor";

export default function EditProjectPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [title, setTitle] = useState("");
  const [clientName, setClientName] = useState("");
  const [clientIndustry, setClientIndustry] = useState("Otomotif & Bengkel");
  const [clientLocation, setClientLocation] = useState("Bogor, Jawa Barat");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [thumb, setThumb] = useState("");
  const [summary, setSummary] = useState("");
  const [challenge, setChallenge] = useState("");
  const [solution, setSolution] = useState("");
  const [results, setResults] = useState("");
  const [year, setYear] = useState("2026");
  const [status, setStatus] = useState<"published" | "draft">("published");

  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState("");
  const [isUnauthorized, setIsUnauthorized] = useState(false);

  useEffect(() => {
    if (!id) return;
    const fetchProject = async () => {
      try {
        const res = await authFetch(`/api/projects/${id}`);
        const json = await res.json();
        if (json.success && json.data) {
          const d = json.data;
          setTitle(d.title || "");
          setClientName(d.client_name || "");
          setClientIndustry(d.client_industry || "");
          setClientLocation(d.client_location || "");
          setWebsiteUrl(d.website_url || "");
          setThumb(d.thumb || "");
          setSummary(d.summary || "");
          setChallenge(d.challenge || "");
          setSolution(d.solution || "");
          setResults(d.results || "");
          setYear(d.year || "2026");
          setStatus(d.status || "published");
        } else {
          setError(json.message || "Proyek portfolio tidak ditemukan");
        }
      } catch {
        setError("Gagal memuat data proyek portfolio");
      } finally {
        setInitialLoading(false);
      }
    };
    fetchProject();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setIsUnauthorized(false);

    try {
      const res = await authFetch(`/api/projects/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          client_name: clientName,
          client_industry: clientIndustry,
          client_location: clientLocation,
          website_url: websiteUrl,
          thumb,
          summary,
          challenge,
          solution,
          results,
          year,
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
        router.push("/admin/projects");
        router.refresh();
      } else {
        setError(json.message || "Gagal memperbarui proyek");
      }
    } catch {
      setError("Terjadi kesalahan jaringan saat menyimpan");
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-6 text-sm text-slate-500">
        Memuat data editor proyek...
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
              EDIT PORTFOLIO #{id}
            </span>
          </div>

          <Link href="/admin/projects" className="text-xs text-slate-300 hover:text-white">
            ← Batal & Kembali
          </Link>
        </div>
      </header>

      {/* Main Form */}
      <main className="max-w-4xl mx-auto px-4 sm:px-8 py-10">
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-sm space-y-6">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">Perbarui Proyek Portfolio</h1>
            <p className="text-xs text-slate-500 mt-1">
              Perubahan pada proyek akan langsung diperbarui di halaman publik /project.
            </p>
          </div>

          {error && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-xs text-red-600 font-bold flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span>{error}</span>
              {isUnauthorized && (
                <Link
                  href={`/admin/login?redirect=/admin/projects/edit/${id}`}
                  className="px-3 py-1.5 rounded-lg bg-[#1853a7] text-white font-bold hover:bg-[#0f3d7d] text-center shrink-0"
                >
                  Login Sekarang →
                </Link>
              )}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 1. Nama Proyek & Tahun */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                  Nama / Judul Proyek
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#1853a7] bg-[#f8fafc]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                  Tahun Proyek
                </label>
                <input
                  type="text"
                  required
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#1853a7] bg-[#f8fafc]"
                />
              </div>
            </div>

            {/* 2. Informasi Klien */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <span>👤</span> Informasi Klien
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                    Nama Klien / Bisnis
                  </label>
                  <input
                    type="text"
                    required
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-[#1853a7] bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                    Bidang Industri
                  </label>
                  <input
                    type="text"
                    required
                    value={clientIndustry}
                    onChange={(e) => setClientIndustry(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-[#1853a7] bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                    Lokasi Klien
                  </label>
                  <input
                    type="text"
                    required
                    value={clientLocation}
                    onChange={(e) => setClientLocation(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-[#1853a7] bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                  Link Website Klien (Live Website URL)
                </label>
                <input
                  type="url"
                  placeholder="https://example.com"
                  value={websiteUrl}
                  onChange={(e) => setWebsiteUrl(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-[#1853a7] bg-white"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Link website live yang dapat dikunjungi oleh pengunjung untuk membuktikan hasil kerja.
                </span>
              </div>
            </div>

            {/* 3. Image Upload */}
            <ImageUpload
              value={thumb}
              onChange={setThumb}
              label="Foto / Mockup Portfolio Proyek"
              helperText="Upload screenshot website atau foto tempat bisnis klien (JPG/PNG/WEBP, maks 5MB)."
            />

            {/* 4. Ringkasan Singkat (Summary) */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                Ringkasan Proyek (Summary)
              </label>
              <textarea
                rows={2}
                required
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#1853a7] bg-[#f8fafc]"
              />
            </div>

            {/* 5. Hasil Bisnis Konkret (Results) */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                Hasil Nyata / Pencapaian Klien (Results Metric)
              </label>
              <input
                type="text"
                required
                value={results}
                onChange={(e) => setResults(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#1853a7] bg-[#f8fafc]"
              />
            </div>

            {/* 6. Detail Tantangan (Challenge) */}
            <RichTextEditor
              value={challenge}
              onChange={setChallenge}
              label="Tantangan Klien Sebelum Didampingi Ladi (Challenge)"
              placeholder="Jelaskan kondisi awal klien, kesulitan menemukan pelanggan baru, atau minimnya kehadiran di Google..."
            />

            {/* 7. Solusi Ladi (Solution) */}
            <RichTextEditor
              value={solution}
              onChange={setSolution}
              label="Solusi yang Diterapkan oleh Ladi (Solution)"
              placeholder="Jelaskan strategi yang Ladi jalankan: pembuatan website berkecepatan tinggi, optimasi peta Google, dsb..."
            />

            {/* 8. Status Publikasi */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                Status Publikasi
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as "published" | "draft")}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#1853a7] bg-[#f8fafc]"
              >
                <option value="published">Published (Tampil di Halaman Publik /project)</option>
                <option value="draft">Draft (Simpan Sementara)</option>
              </select>
            </div>

            {/* Submit Actions */}
            <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
              <Link
                href="/admin/projects"
                className="px-6 py-3 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
              >
                Batal
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-3 rounded-full bg-[#1853a7] hover:bg-[#0f3d7d] text-white font-bold text-xs uppercase tracking-wider shadow-md transition-all disabled:opacity-50"
              >
                {loading ? "Menyimpan..." : "Simpan Perubahan Proyek →"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
