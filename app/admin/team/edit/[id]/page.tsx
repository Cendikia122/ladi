"use client";
import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import LadiLogo from "../../../../components/LadiLogo";
import { authFetch, getClientSession } from "@/app/lib/clientAuth";
import ImageUpload from "@/app/components/ImageUpload";

export const dynamic = "force-dynamic";

export default function EditTeamMemberPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { id } = use(params);

  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [badge, setBadge] = useState("");
  const [image, setImage] = useState("");
  const [desc, setDesc] = useState("");
  const [focus, setFocus] = useState("");
  const [orderNum, setOrderNum] = useState(1);
  const [status, setStatus] = useState<"active" | "inactive">("active");

  const [initialLoading, setInitialLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    getClientSession().then((u) => {
      if (u && u.role === "editor") {
        alert("Akses ditolak. Fitur ini khusus Super Administrator.");
        router.push("/admin/blogs");
        return;
      }

      // Fetch member data
      authFetch(`/api/team/${id}`)
        .then((res) => res.json())
        .then((json) => {
          if (json.success && json.data) {
            const m = json.data;
            setName(m.name || "");
            setRole(m.role || "");
            setBadge(m.badge || "");
            setImage(m.image || "/images/team/team1.jpg");
            setDesc(m.desc || "");
            setFocus(m.focus || "");
            setOrderNum(m.order_num || 1);
            setStatus(m.status || "active");
          } else {
            setError(json.message || "Data anggota tim tidak ditemukan");
          }
        })
        .catch(() => setError("Gagal memuat data dari server"))
        .finally(() => setInitialLoading(false));
    });
  }, [id, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Nama anggota tim wajib diisi");
      return;
    }
    if (!role.trim()) {
      setError("Jabatan / peran wajib diisi");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await authFetch(`/api/team/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          role: role.trim(),
          badge: badge.trim(),
          image: image.trim(),
          desc: desc.trim(),
          focus: focus.trim(),
          order_num: Number(orderNum) || 1,
          status,
        }),
      });

      const json = await res.json();
      if (json.success) {
        alert(`Berhasil! Profil anggota tim "${name}" telah diperbarui.`);
        router.push("/admin/team");
        router.refresh();
      } else {
        setError(json.message || "Gagal memperbarui data anggota tim");
      }
    } catch {
      setError("Terjadi kesalahan jaringan.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm(`Yakin ingin menghapus anggota tim "${name}"?`)) return;
    setLoading(true);

    try {
      const res = await authFetch(`/api/team/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (json.success) {
        alert(`Anggota tim "${name}" telah dihapus.`);
        router.push("/admin/team");
        router.refresh();
      } else {
        alert(json.message || "Gagal menghapus");
      }
    } catch {
      alert("Terjadi kesalahan jaringan.");
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-[#f8fafc] text-[#0f172a] flex items-center justify-center">
        <div className="text-center space-y-2">
          <div className="w-8 h-8 border-4 border-[#1853a7] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-slate-500 font-medium">Memuat data profil tim...</p>
        </div>
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
            <span className="font-mono text-xs px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
              ✏️ EDIT ANGGOTA TIM
            </span>
          </div>

          <Link
            href="/admin/team"
            className="text-xs text-slate-300 hover:text-white transition-colors"
          >
            ← Kembali ke Daftar Tim
          </Link>
        </div>
      </header>

      {/* Main Form */}
      <main className="max-w-4xl mx-auto px-4 sm:px-8 py-10">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-10">
          <div className="mb-8 pb-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-extrabold text-[#0f172a]">
                Edit Profil Anggota Tim
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                Perubahan pada data ini akan langsung diterapkan di bagian &quot;Our Team&quot; halaman beranda.
              </p>
            </div>

            <button
              type="button"
              onClick={handleDelete}
              disabled={loading}
              className="px-4 py-2 rounded-xl bg-red-50 hover:bg-red-600 hover:text-white text-red-600 text-xs font-bold transition-all self-start sm:self-auto"
            >
              🗑️ Hapus Anggota
            </button>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-xs sm:text-sm text-red-900 font-semibold flex items-center gap-2">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Foto Profil Team */}
            <div>
              <ImageUpload
                value={image}
                onChange={(url) => setImage(url)}
                label="Foto Profil Anggota Tim"
                helperText="Upload foto persegi/portrait dengan rasio seimbang (JPG/PNG/WEBP)"
              />
            </div>

            {/* Nama & Jabatan */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Nama Lengkap *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Rizky Pratama"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#1853a7] bg-[#f8fafc]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Jabatan / Role *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Project Lead & Digital Strategist"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#1853a7] bg-[#f8fafc]"
                />
              </div>
            </div>

            {/* Badge & Fokus Keahlian */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Badge / Lencana
                </label>
                <input
                  type="text"
                  placeholder="Contoh: PPLG Wikrama Lead atau Web Specialist"
                  value={badge}
                  onChange={(e) => setBadge(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#1853a7] bg-[#f8fafc]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Bidang Fokus / Keahlian
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Arsitektur & SEO Semantik"
                  value={focus}
                  onChange={(e) => setFocus(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#1853a7] bg-[#f8fafc]"
                />
              </div>
            </div>

            {/* Deskripsi Peran */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Deskripsi Peran & Tanggung Jawab
              </label>
              <textarea
                rows={3}
                placeholder="Jelaskan peran anggota tim ini dalam mendampingi klien dan proyek digital..."
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#1853a7] bg-[#f8fafc]"
              />
            </div>

            {/* Urutan & Status */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Urutan Tampil (#)
                </label>
                <input
                  type="number"
                  min={1}
                  value={orderNum}
                  onChange={(e) => setOrderNum(parseInt(e.target.value, 10) || 1)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#1853a7] bg-[#f8fafc]"
                />
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Urutan menentukan posisi dari kiri ke kanan di halaman depan
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Status Publikasi
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as "active" | "inactive")}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#1853a7] bg-[#f8fafc]"
                >
                  <option value="active">Aktif (Tampil di Website)</option>
                  <option value="inactive">Nonaktif (Disembunyikan)</option>
                </select>
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
              <Link
                href="/admin/team"
                className="px-6 py-3 rounded-full border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold text-xs uppercase tracking-wider transition-all"
              >
                Batal
              </Link>

              <button
                type="submit"
                disabled={loading}
                className="px-8 py-3.5 rounded-full bg-[#1853a7] hover:bg-[#0f3d7d] text-white font-bold text-xs uppercase tracking-wider shadow-md transition-all disabled:opacity-50"
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
