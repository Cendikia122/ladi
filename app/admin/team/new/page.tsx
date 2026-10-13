"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import LadiLogo from "../../../components/LadiLogo";
import { authFetch, getClientSession } from "@/app/lib/clientAuth";
import ImageUpload from "@/app/components/ImageUpload";
import { compressDataUri } from "@/app/lib/imageCompress";

export const dynamic = "force-dynamic";

export default function NewTeamMemberPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [badge, setBadge] = useState("Tim Ladi");
  const [image, setImage] = useState("/images/team/team1.jpg");
  const [desc, setDesc] = useState("");
  const [focus, setFocus] = useState("");
  const [orderNum, setOrderNum] = useState(1);
  const [status, setStatus] = useState<"active" | "inactive">("active");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    getClientSession().then((u) => {
      if (u && u.role === "editor") {
        alert("Akses ditolak. Fitur ini khusus Super Administrator.");
        router.push("/admin/blogs");
      }
    });
  }, [router]);

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
      const safeImage = await compressDataUri(image);
      const res = await authFetch("/api/team", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          role: role.trim(),
          badge: badge.trim(),
          image: safeImage.trim(),
          desc: desc.trim(),
          focus: focus.trim(),
          order_num: Number(orderNum) || 1,
          status,
        }),
      });

      const text = await res.text();
      let json: any = null;
      try {
        json = JSON.parse(text);
      } catch {}

      if (res.ok && json?.success) {
        alert(`Berhasil! Anggota tim "${name}" telah ditambahkan.`);
        router.push("/admin/team");
        router.refresh();
      } else {
        setError(json?.message || `Gagal menyimpan (${res.status}): ${text.slice(0, 150)}`);
      }
    } catch (err: any) {
      setError(err?.message || "Terjadi kesalahan saat menyimpan data anggota tim.");
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
            <span className="font-mono text-xs px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
              + TAMBAH ANGGOTA TIM
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
          <div className="mb-8 pb-6 border-b border-slate-100">
            <h1 className="text-2xl font-extrabold text-[#0f172a]">
              Tambah Anggota Tim Baru
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Data anggota yang ditambahkan akan otomatis muncul di bagian &quot;Our Team&quot; pada halaman beranda.
            </p>
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
                  Angka lebih kecil tampil lebih awal (kiri ke kanan)
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
                {loading ? "Menyimpan..." : "Simpan Anggota Tim →"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
