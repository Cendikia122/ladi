"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import LadiLogo from "../../../components/LadiLogo";
import { authFetch } from "@/app/lib/clientAuth";
import RichTextEditor from "@/app/components/RichTextEditor";

interface ExampleSite {
  name: string;
  industry: string;
  highlight: string;
  image: string;
  url: string;
}

export default function NewServicePackagePage() {
  const router = useRouter();

  // Basic Information
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [tag, setTag] = useState("PAKET RESMI LADI");
  const [badgePopular, setBadgePopular] = useState(false);
  const [status, setStatus] = useState<"active" | "inactive">("active");
  const [orderNum, setOrderNum] = useState(1);

  // Copywriting & Pricing
  const [subtitle, setSubtitle] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  const [price, setPrice] = useState("Rp ");
  const [originalPrice, setOriginalPrice] = useState("");
  const [period, setPeriod] = useState("Sekali Bayar");
  const [timeline, setTimeline] = useState("5–7 Hari Kerja");

  // Deliverables (lines)
  const [deliverablesText, setDeliverablesText] = useState(
    "Website Resmi Responsif (Mobile & Desktop)\nPendaftaran & Optimasi Profil Google Bisnis Resmi\nOptimasi Kecepatan Cepat (PageSpeed 95+)\nTombol Langsung WhatsApp ke Kontak Pemilik\nPendaftaran Mesin Pencari Google Search Console\nGaransi Pemeliharaan & Pendampingan 30 Hari"
  );

  // Example Websites
  const [exampleSites, setExampleSites] = useState<ExampleSite[]>([
    {
      name: "Bengkel Motor Berkah Jaya",
      industry: "Otomotif & Bengkel",
      highlight: "Website responsif lengkap dengan profil mekanik dan peta Google Maps resmi.",
      image: "/images/clients/bengkel-motor.jpg",
      url: "/project/bengkel-motor",
    },
    {
      name: "Katering Sari Rasa Nusantara",
      industry: "Kuliner & Katering",
      highlight: "Katalog menu interaktif dengan tombol pemesanan WhatsApp langsung.",
      image: "/images/clients/katering-sari-rasa.jpg",
      url: "/project/katering-sari-rasa",
    },
  ]);

  // Audit Report Sample
  const [auditTitle, setAuditTitle] = useState("Contoh Hasil Audit & Standar Kualitas Paket");
  const [speedScore, setSpeedScore] = useState(98);
  const [seoScore, setSeoScore] = useState(100);
  const [accessScore, setAccessScore] = useState(100);
  const [bestPracticesScore, setBestPracticesScore] = useState(96);
  const [auditMetricsText, setAuditMetricsText] = useState(
    "Waktu buka rata-rata: 0.8 detik di koneksi seluler 4G\nStruktur Schema.org terverifikasi ramah bot Google\nProfil Google Maps terisi 100% foto, alamat, dan jam buka resmi"
  );

  // Detailed Description (Rich Text Editor with Quill)
  const [description, setDescription] = useState(
    "<h3>Mengapa Memilih Paket Ini?</h3><p>Paket ini dirancang khusus untuk memastikan bisnis Anda memiliki kedaulatan digital penuh tanpa biaya tersembunyi atau biaya langganan bulanan yang memberatkan.</p><ul><li>Kepemilikan domain 100% atas nama bisnis Anda</li><li>Desain cepat, elegan, dan ramah smartphone</li><li>Pendaftaran terverifikasi di Google Maps</li></ul>"
  );

  // CTA
  const [ctaText, setCtaText] = useState("Pesan Paket Ini via WhatsApp");
  const [ctaWhatsappText, setCtaWhatsappText] = useState(
    "Halo Ladi, saya tertarik dengan paket ini. Bisakah kita diskusikan kebutuhan usaha saya?"
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Auto-generate slug from name
  const handleNameChange = (val: string) => {
    setName(val);
    if (!slug || slug === name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")) {
      const autoSlug = val.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
      setSlug(autoSlug);
    }
  };

  const handleAddExampleSite = () => {
    setExampleSites([
      ...exampleSites,
      {
        name: "",
        industry: "",
        highlight: "",
        image: "/images/clients/bengkel-motor.jpg",
        url: "",
      },
    ]);
  };

  const handleUpdateExampleSite = (index: number, field: keyof ExampleSite, val: string) => {
    const updated = [...exampleSites];
    updated[index] = { ...updated[index], [field]: val };
    setExampleSites(updated);
  };

  const handleRemoveExampleSite = (index: number) => {
    setExampleSites(exampleSites.filter((_, idx) => idx !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!name.trim()) {
      setError("Nama paket produk wajib diisi.");
      setLoading(false);
      return;
    }

    if (!slug.trim()) {
      setError("Slug URL wajib diisi.");
      setLoading(false);
      return;
    }

    // Process deliverables into JSON array
    const deliverablesArray = deliverablesText
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);

    // Process audit report
    const auditMetricsArray = auditMetricsText
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);

    const auditReportObj = {
      title: auditTitle,
      speed_score: Number(speedScore) || 98,
      seo_score: Number(seoScore) || 100,
      accessibility_score: Number(accessScore) || 100,
      best_practices_score: Number(bestPracticesScore) || 96,
      metrics: auditMetricsArray,
    };

    const payload = {
      name: name.trim(),
      slug: slug.trim().toLowerCase(),
      tag: tag.trim(),
      subtitle: subtitle.trim(),
      target_audience: targetAudience.trim(),
      price: price.trim(),
      original_price: originalPrice.trim(),
      period: period.trim(),
      timeline: timeline.trim(),
      deliverables: JSON.stringify(deliverablesArray),
      example_websites: JSON.stringify(exampleSites.filter((s) => s.name.trim())),
      audit_report_sample: JSON.stringify(auditReportObj),
      description: description,
      cta_text: ctaText.trim(),
      cta_whatsapp_text: ctaWhatsappText.trim(),
      badge_popular: badgePopular ? 1 : 0,
      status: status,
      order_num: Number(orderNum) || 1,
    };

    try {
      const res = await authFetch("/api/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.status === 401) {
        setError("Akses ditolak: Hanya Super Admin yang berhak menambahkan paket.");
        return;
      }

      const json = await res.json();
      if (json.success) {
        alert(`Paket "${name}" berhasil dibuat dan siap digunakan pada iklan!`);
        router.push("/admin/services");
        router.refresh();
      } else {
        setError(json.message || "Gagal menyimpan paket");
      }
    } catch (err: any) {
      setError(err?.message || "Terjadi kesalahan saat menyimpan paket produk.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#0f172a]">
      {/* Header */}
      <header className="bg-[#0f172a] text-white border-b border-slate-800 py-4 px-4 sm:px-8">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <LadiLogo inverted={true} />
            <span className="font-mono text-xs px-2.5 py-1 rounded-full bg-white/10 text-slate-300">
              TAMBAH PAKET PRODUK
            </span>
          </div>

          <Link
            href="/admin/services"
            className="text-xs text-slate-300 hover:text-white transition-colors"
          >
            ← Batal & Kembali ke Daftar Paket
          </Link>
        </div>
      </header>

      {/* Main Form */}
      <main className="max-w-5xl mx-auto px-4 sm:px-8 py-10">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-sm space-y-8">
            {/* Title & Description */}
            <div>
              <span className="px-2.5 py-1 rounded-full bg-[#fa824b]/15 text-[#fa824b] text-[11px] font-bold uppercase tracking-wider font-mono">
                Ad Landing Page Generator
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0f172a] mt-2">
                Buat Paket Produk Layanan Baru
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Lengkapi informasi di bawah ini. Halaman landing page iklan akan otomatis dibuat dengan URL sesuai slug yang Anda tentukan.
              </p>
            </div>

            {error && (
              <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-700 font-bold">
                ⚠️ {error}
              </div>
            )}

            {/* =============================================================== */}
            {/* 1. INFORMASI DASAR (Nama, Slug, Tag, Badge, Status) */}
            {/* =============================================================== */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <span>📌</span>
                <span>1. Identitas & URL Paket</span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">
                    Nama Paket Produk <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="Contoh: Paket RISE - Bisnis Serius"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-[#1853a7] focus:ring-1 focus:ring-[#1853a7] text-sm font-semibold"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">
                    Slug URL Halaman Iklan <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center">
                    <span className="px-3 py-2.5 bg-slate-100 border border-r-0 border-slate-300 rounded-l-xl text-xs text-slate-500 font-mono">
                      /services/
                    </span>
                    <input
                      type="text"
                      required
                      value={slug}
                      onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                      placeholder="paket-rise"
                      className="w-full px-4 py-2.5 rounded-r-xl border border-slate-300 focus:border-[#1853a7] focus:ring-1 focus:ring-[#1853a7] text-sm font-mono text-[#1853a7] font-semibold"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Tag / Kategori Produk</label>
                  <input
                    type="text"
                    value={tag}
                    onChange={(e) => setTag(e.target.value)}
                    placeholder="Contoh: BISNIS SERIUS, LANGKAH PERDANA"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-[#1853a7] text-sm"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">Status</label>
                    <select
                      value={status}
                      onChange={(e: any) => setStatus(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-[#1853a7] text-sm bg-white"
                    >
                      <option value="active">Aktif (Tayang)</option>
                      <option value="inactive">Nonaktif (Draft)</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">Urutan Tampil</label>
                    <input
                      type="number"
                      value={orderNum}
                      onChange={(e) => setOrderNum(Number(e.target.value))}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-[#1853a7] text-sm"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <label className="inline-flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={badgePopular}
                    onChange={(e) => setBadgePopular(e.target.checked)}
                    className="w-4 h-4 rounded text-[#1853a7] focus:ring-[#1853a7]"
                  />
                  <span className="text-xs font-bold text-slate-800">
                    Beri Label &quot;⭐ Paling Diminati Klien&quot; (Sorot sebagai Best Seller)
                  </span>
                </label>
              </div>
            </div>

            {/* =============================================================== */}
            {/* 2. COPYWRITING IKLAN & HARGA INVESTASI */}
            {/* =============================================================== */}
            <div className="space-y-4 pt-6 border-t border-slate-100">
              <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <span>💰</span>
                <span>2. Copywriting Iklan & Harga Investasi</span>
              </h2>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">
                  Subtitle / Hook Utama Iklan
                </label>
                <input
                  type="text"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  placeholder="Contoh: Website lengkap 5–7 halaman untuk membangun reputasi dan dipercaya pelanggan baru."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-[#1853a7] text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">
                  Target Bisnis (Cocok untuk siapa?)
                </label>
                <textarea
                  rows={2}
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  placeholder="Contoh: Cocok untuk klinik, dokter praktek, kantor hukum, konsultan, sekolah, dan bisnis jasa yang memerlukan halaman profil kredibel."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-[#1853a7] text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="space-y-1.5 sm:col-span-1">
                  <label className="text-xs font-bold text-slate-700">Harga Paket (Promo)</label>
                  <input
                    type="text"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="Rp 2.450.000"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 font-bold text-sm text-[#1853a7]"
                  />
                </div>

                <div className="space-y-1.5 sm:col-span-1">
                  <label className="text-xs font-bold text-slate-700">Harga Coret (Opsional)</label>
                  <input
                    type="text"
                    value={originalPrice}
                    onChange={(e) => setOriginalPrice(e.target.value)}
                    placeholder="Rp 3.500.000"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-500"
                  />
                </div>

                <div className="space-y-1.5 sm:col-span-1">
                  <label className="text-xs font-bold text-slate-700">Skema Pembayaran</label>
                  <input
                    type="text"
                    value={period}
                    onChange={(e) => setPeriod(e.target.value)}
                    placeholder="Sekali Bayar"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm"
                  />
                </div>

                <div className="space-y-1.5 sm:col-span-1">
                  <label className="text-xs font-bold text-slate-700">Estimasi Selesai</label>
                  <input
                    type="text"
                    value={timeline}
                    onChange={(e) => setTimeline(e.target.value)}
                    placeholder="5–7 Hari Kerja"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold"
                  />
                </div>
              </div>
            </div>

            {/* =============================================================== */}
            {/* 3. HAL-HAL YANG DIDAPATKAN (DELIVERABLES CHECKLIST) */}
            {/* =============================================================== */}
            <div className="space-y-3 pt-6 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <span>📦</span>
                  <span>3. Hal-Hal yang Didapatkan (Deliverables Checklist)</span>
                </h2>
                <span className="text-xs text-slate-500">Tulis 1 poin per baris (Enter)</span>
              </div>
              <p className="text-xs text-slate-500">
                Poin-poin ini akan otomatis diubah menjadi kartu checklist bercentang hijau pada halaman landing page.
              </p>
              <textarea
                rows={6}
                value={deliverablesText}
                onChange={(e) => setDeliverablesText(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border border-slate-300 focus:border-[#1853a7] font-mono text-xs leading-relaxed"
                placeholder="Website Resmi 5–7 Halaman Responsif&#10;Pendaftaran Google Bisnis Profil Resmi&#10;Optimasi Kecepatan 95+&#10;Integrasi Tombol WhatsApp"
              />
            </div>

            {/* =============================================================== */}
            {/* 4. CONTOH WEBSITE DARI PAKET INI */}
            {/* =============================================================== */}
            <div className="space-y-4 pt-6 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <span>🌐</span>
                  <span>4. Contoh Tampilan Website Nyata</span>
                </h2>
                <button
                  type="button"
                  onClick={handleAddExampleSite}
                  className="px-3.5 py-1.5 rounded-xl bg-blue-50 text-[#1853a7] hover:bg-blue-100 text-xs font-bold transition-all cursor-pointer"
                >
                  + Tambah Contoh Website
                </button>
              </div>
              <p className="text-xs text-slate-500">
                Tampilkan bukti nyata website klien yang pernah dibuat dengan paket ini agar konversi calon pelanggan meningkat.
              </p>

              <div className="space-y-4">
                {exampleSites.map((site, index) => (
                  <div
                    key={index}
                    className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 relative"
                  >
                    <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                      <span className="text-xs font-bold text-slate-700">
                        Contoh Website #{index + 1}
                      </span>
                      {exampleSites.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveExampleSite(index)}
                          className="text-xs text-red-500 hover:text-red-700 font-bold cursor-pointer"
                        >
                          Hapus Kartu
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-slate-600">Nama Bisnis / Website</label>
                        <input
                          type="text"
                          value={site.name}
                          onChange={(e) => handleUpdateExampleSite(index, "name", e.target.value)}
                          placeholder="Bengkel Motor Berkah Jaya"
                          className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-slate-600">Industri / Sektor</label>
                        <input
                          type="text"
                          value={site.industry}
                          onChange={(e) => handleUpdateExampleSite(index, "industry", e.target.value)}
                          placeholder="Otomotif & Bengkel"
                          className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-slate-600">Tautan Gambar Preview (URL / Path)</label>
                        <input
                          type="text"
                          value={site.image}
                          onChange={(e) => handleUpdateExampleSite(index, "image", e.target.value)}
                          placeholder="/images/clients/bengkel-motor.jpg"
                          className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white font-mono"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-slate-600">Link Portofolio (Opsional)</label>
                        <input
                          type="text"
                          value={site.url}
                          onChange={(e) => handleUpdateExampleSite(index, "url", e.target.value)}
                          placeholder="/project/bengkel-motor"
                          className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white font-mono"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-600">Highlight Fitur / Keunggulan</label>
                      <input
                        type="text"
                        value={site.highlight}
                        onChange={(e) => handleUpdateExampleSite(index, "highlight", e.target.value)}
                        placeholder="Website responsif lengkap dengan profil mekanik dan peta Google Maps resmi."
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* =============================================================== */}
            {/* 5. CONTOH HASIL AUDIT & LAPORAN */}
            {/* =============================================================== */}
            <div className="space-y-4 pt-6 border-t border-slate-100">
              <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <span>📊</span>
                <span>5. Contoh Hasil Audit & Standar Kualitas (Google PageSpeed)</span>
              </h2>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Judul Bagian Audit</label>
                <input
                  type="text"
                  value={auditTitle}
                  onChange={(e) => setAuditTitle(e.target.value)}
                  placeholder="Contoh Hasil Audit & Standar Kualitas Paket RISE"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Skor Kecepatan Mobile</label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={speedScore}
                    onChange={(e) => setSpeedScore(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm font-bold text-emerald-600"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Skor SEO Semantik</label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={seoScore}
                    onChange={(e) => setSeoScore(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm font-bold text-blue-600"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Skor Aksesibilitas</label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={accessScore}
                    onChange={(e) => setAccessScore(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm font-bold text-purple-600"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Best Practices</label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={bestPracticesScore}
                    onChange={(e) => setBestPracticesScore(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm font-bold text-amber-600"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">
                  Rincian Bukti & Dampak Nyata (1 poin per baris)
                </label>
                <textarea
                  rows={3}
                  value={auditMetricsText}
                  onChange={(e) => setAuditMetricsText(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-mono"
                  placeholder="Waktu buka rata-rata: 0.8 detik di koneksi seluler 4G&#10;Struktur Schema.org terverifikasi ramah bot Google"
                />
              </div>
            </div>

            {/* =============================================================== */}
            {/* 6. DESKRIPSI DETAIL PRODUK (QUILL RICH TEXT EDITOR) */}
            {/* =============================================================== */}
            <div className="space-y-3 pt-6 border-t border-slate-100">
              <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <span>📝</span>
                <span>6. Penjelasan Detail & Garansi Paket (Quill Rich Text Editor)</span>
              </h2>
              <p className="text-xs text-slate-500">
                Gunakan editor visual di bawah ini untuk menulis penjelasan tanpa perlu mengetik kode HTML manual. Anda dapat menambahkan formatting bold, italic, list, heading, maupun gambar pendukung.
              </p>
              <RichTextEditor
                value={description}
                onChange={setDescription}
                placeholder="Tuliskan ulasan detail fitur, alur kerja pengerjaan, dan garansi paket ini..."
                label="Isi Penjelasan Paket Produk"
              />
            </div>

            {/* =============================================================== */}
            {/* 7. CTA & PESAN WHATSAPP OTOMATIS */}
            {/* =============================================================== */}
            <div className="space-y-4 pt-6 border-t border-slate-100">
              <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <span>💬</span>
                <span>7. Pengaturan Tombol & Template Pesan WhatsApp</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Teks Tombol CTA</label>
                  <input
                    type="text"
                    value={ctaText}
                    onChange={(e) => setCtaText(e.target.value)}
                    placeholder="Pesan Paket Ini via WhatsApp"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">
                    Draft Pesan Otomatis WhatsApp (Saat Calon Klien Klik)
                  </label>
                  <input
                    type="text"
                    value={ctaWhatsappText}
                    onChange={(e) => setCtaWhatsappText(e.target.value)}
                    placeholder="Halo Ladi, saya tertarik dengan paket ini..."
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Submit Action */}
            <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <Link
                href="/admin/services"
                className="w-full sm:w-auto px-6 py-3 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs uppercase tracking-wider text-center transition-all"
              >
                Batal
              </Link>

              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#fa824b] hover:bg-[#e5723b] text-white font-bold text-xs uppercase tracking-wider shadow-lg hover:shadow-xl transition-all disabled:opacity-50 cursor-pointer"
              >
                {loading ? "Menyimpan Paket..." : "Simpan & Buat Landing Page Iklan →"}
              </button>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}
