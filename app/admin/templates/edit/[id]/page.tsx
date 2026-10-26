"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import LadiLogo from "../../../../components/LadiLogo";
import { authFetch } from "@/app/lib/clientAuth";

interface EditTemplatePageProps {
  params: Promise<{ id: string }>;
}

export default function EditTemplatePage({ params }: EditTemplatePageProps) {
  const resolvedParams = use(params);
  const templateId = resolvedParams.id;
  const router = useRouter();

  const [name, setName] = useState("");
  const [industry, setIndustry] = useState("Kuliner / F&B");
  const [tech, setTech] = useState("HTML5");
  const [type, setType] = useState("Landing Page");
  const [image, setImage] = useState("");
  const [badge, setBadge] = useState("");
  const [description, setDescription] = useState("");
  const [allowedPackages, setAllowedPackages] = useState<string[]>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTemplate = async () => {
      try {
        const res = await authFetch(`/api/templates/${templateId}`);
        const json = await res.json();
        if (json.success && json.data) {
          const t = json.data;
          setName(t.name || "");
          setIndustry(t.industry || "Umum");
          setTech(t.tech || "HTML5");
          setType(t.type || "Landing Page");
          setImage(t.image || "");
          setBadge(t.badge || "");
          setDescription(t.description || "");
          setAllowedPackages(t.allowed_packages || []);
        } else {
          setError(json.message || "Template tidak ditemukan.");
        }
      } catch (err: any) {
        setError(err.message || "Gagal memuat template.");
      } finally {
        setLoading(false);
      }
    };

    fetchTemplate();
  }, [templateId]);

  const handleTogglePackage = (pkg: string) => {
    if (allowedPackages.includes(pkg)) {
      setAllowedPackages(allowedPackages.filter((p) => p !== pkg));
    } else {
      setAllowedPackages([...allowedPackages, pkg]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Nama template wajib diisi.");
      return;
    }

    setSaving(true);

    try {
      const res = await authFetch(`/api/templates/${templateId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          industry,
          tech,
          type,
          image: image.trim() || undefined,
          badge: badge.trim() || undefined,
          description: description.trim() || undefined,
          allowed_packages: allowedPackages,
        }),
      });

      if (res.status === 401) {
        setError("Akses ditolak: Hanya Administrator yang berhak menyunting template.");
        router.push(`/admin/login?redirect=/admin/templates/edit/${templateId}`);
        return;
      }

      const json = await res.json();
      if (json.success) {
        alert(`Berhasil! Template "${name}" telah diperbarui.`);
        router.push("/admin/templates");
        router.refresh();
      } else {
        setError(json.message || "Gagal memperbarui template.");
      }
    } catch {
      setError("Terjadi kesalahan koneksi saat memperbarui template.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8fafc] text-[#0f172a] flex items-center justify-center p-8">
        <div className="text-center space-y-2">
          <div className="animate-spin text-3xl">⏳</div>
          <div className="text-xs text-slate-500">Memuat data template...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#0f172a]">
      {/* Header */}
      <header className="bg-[#0f172a] text-white border-b border-slate-800 py-4 px-4 sm:px-8">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <LadiLogo inverted={true} />
            <span className="font-mono text-xs px-2.5 py-1 rounded-full bg-white/10 text-slate-300">
              EDIT TEMPLATE: {templateId}
            </span>
          </div>

          <Link
            href="/admin/templates"
            className="text-slate-300 hover:text-white transition-colors text-xs"
          >
            ← Kembali ke Katalog
          </Link>
        </div>
      </header>

      {/* Main Content Form */}
      <main className="max-w-4xl mx-auto px-4 sm:px-8 py-10">
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-sm space-y-8">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-400 font-mono mb-1">
              <span>ID: {templateId}</span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Sunting Template Desain Website
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Perbarui link gambar, deskripsi, atau paket yang didukung oleh template ini.
            </p>
          </div>

          {error && (
            <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Nama Template */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Nama Template / Desain <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-[#fa824b] bg-slate-50/50"
              />
            </div>

            {/* Sektor Industri & Tipe Tampilan */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Sektor Industri
                </label>
                <input
                  type="text"
                  list="industry-options-edit"
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-[#fa824b] bg-slate-50/50"
                />
                <datalist id="industry-options-edit">
                  <option value="Kuliner / F&B" />
                  <option value="Otomotif & Bengkel" />
                  <option value="Toko Fisik & Retail" />
                  <option value="Digital Agency & Konsultan" />
                  <option value="Travel & Tour" />
                  <option value="Kesehatan & Medis" />
                  <option value="Hukum & Advokat" />
                  <option value="Personal & Portfolio" />
                  <option value="Logistik & Ekspedisi" />
                </datalist>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Teknologi Fondasi
                </label>
                <select
                  value={tech}
                  onChange={(e) => setTech(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-[#fa824b] bg-slate-50/50"
                >
                  <option value="HTML5">HTML5 (Ringan & Cepat)</option>
                  <option value="PHP">PHP (Dinamis)</option>
                  <option value="Laravel">Laravel (MVC)</option>
                  <option value="Next.JS">Next.js (Modern React)</option>
                  <option value="React">React</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Tipe Tampilan
                </label>
                <input
                  type="text"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-[#fa824b] bg-slate-50/50"
                />
              </div>
            </div>

            {/* Input Link Gambar Preview (Live Preview) */}
            <div className="space-y-3 p-5 rounded-2xl bg-blue-50/30 border border-blue-100">
              <div>
                <label className="block text-xs font-bold text-slate-800">
                  🖼️ Link Gambar Thumbnail / Mockup (URL)
                </label>
                <span className="text-[11px] text-slate-500">
                  Cukup ganti tautan link gambar web, gambar akan langsung diperbarui seketika!
                </span>
              </div>

              <input
                type="url"
                placeholder="https://images.unsplash.com/photo-..."
                value={image}
                onChange={(e) => setImage(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-[#fa824b] bg-white font-mono"
              />

              {/* Kotak Live Preview Gambar */}
              {image && (
                <div className="pt-2">
                  <span className="text-[10px] font-bold text-slate-400 block mb-1">
                    Pratinjau Gambar Live:
                  </span>
                  <div className="relative aspect-[16/10] max-w-sm rounded-xl overflow-hidden bg-slate-200 border border-slate-200 shadow-xs">
                    <img
                      src={image}
                      alt="Preview template"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80";
                      }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Paket yang Diperbolehkan */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                Pilihan Paket yang Menampilkan Template Ini:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
                {[
                  { id: "paket-exist", name: "Paket EXIST" },
                  { id: "paket-rise", name: "Paket RISE" },
                  { id: "paket-run", name: "Paket RUN" },
                  { id: "custom", name: "Rakit Web (/builder)" },
                ].map((pkg) => {
                  const isChecked = allowedPackages.includes(pkg.id);
                  return (
                    <label
                      key={pkg.id}
                      className={`p-3 rounded-xl border-2 flex items-center gap-2 cursor-pointer transition-all ${
                        isChecked
                          ? "border-[#1853a7] bg-blue-50/40 text-[#1853a7] font-bold"
                          : "border-slate-200 hover:border-slate-300 bg-slate-50/50 text-slate-600"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleTogglePackage(pkg.id)}
                        className="rounded text-[#1853a7] focus:ring-[#1853a7]"
                      />
                      <span>{pkg.name}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Badge & Deskripsi */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Badge / Label (Opsional)
                </label>
                <input
                  type="text"
                  value={badge}
                  onChange={(e) => setBadge(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-[#fa824b] bg-slate-50/50"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Deskripsi Gaya &amp; Keunggulan Visual
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-[#fa824b] bg-slate-50/50"
                />
              </div>
            </div>

            {/* Tombol Simpan */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
              <Link
                href="/admin/templates"
                className="px-5 py-3 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs transition-colors"
              >
                Batal
              </Link>
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-3 rounded-xl bg-[#fa824b] hover:bg-[#e5723b] disabled:bg-slate-300 text-white font-extrabold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all"
              >
                {saving ? "Menyimpan Perubahan..." : "Simpan Perubahan Template"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
