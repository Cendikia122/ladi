"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

export interface GuardAddon {
  id: string;
  name: string;
  category: "server" | "seo" | "maps" | "content";
  price: number;
  badge?: string;
  icon: string;
  desc: string;
  recommended?: boolean;
}

export const GUARD_ADDONS: GuardAddon[] = [
  // 1. Server & Satpam 24 Jam
  {
    id: "uptime_247",
    name: "Pemantauan Uptime 24/7 & Auto-Restart Server",
    category: "server",
    price: 65000,
    badge: "Pondasi Wajib",
    icon: "🛡️",
    desc: "Robot monitoring memantau web setiap 60 detik. Jika server down, otomatis di-restart & tim kami langsung sigap memulihkan.",
    recommended: true,
  },
  {
    id: "ssl_firewall",
    name: "Pemeliharaan SSL (HTTPS) & Firewall Anti-Hack",
    category: "server",
    price: 45000,
    badge: "Keamanan",
    icon: "🔒",
    desc: "Sertifikat SSL gembok hijau selalu aktif, perlindungan anti bot spam, brute-force login, dan injeksi script berbahaya.",
    recommended: true,
  },
  {
    id: "backup_cloud",
    name: "Backup Otomatis Mingguan ke Cloud Terpisah",
    category: "server",
    price: 55000,
    badge: "Penyelamat",
    icon: "💾",
    desc: "Cadangan database dan seluruh file web disimpan terisolasi di server cloud terpisah. Jika ada kendala, web pulih dalam hitungan menit.",
  },

  // 2. SEO & Mesin Pencari Google
  {
    id: "seo_90",
    name: "SEO Performance Booster Up to 90+ (PageSpeed Google)",
    category: "seo",
    price: 115000,
    badge: "⭐ Sangat Diminati",
    icon: "🚀",
    desc: "Optimasi Core Web Vitals, kompresi gambar otomatis, caching dinamis, dan penataan kode agar skor mobile tembus 90+ di Google.",
    recommended: true,
  },
  {
    id: "keyword_tracking",
    name: "Pemeliharaan Kata Kunci & Audit Posisi Google Bulanan",
    category: "seo",
    price: 75000,
    badge: "Riset Pasar",
    icon: "🔍",
    desc: "Audit rutin posisi bisnis Anda di mesin pencari Google saat calon pembeli mengetikkan kata kunci produk di kota Anda.",
  },
  {
    id: "schema_local",
    name: "Schema.org Markup Bisnis Lokal & Rich Snippet Google",
    category: "seo",
    price: 50000,
    badge: "Tampilan Google",
    icon: "🏷️",
    desc: "Menyisipkan data terstruktur microdata agar alamat, jam buka, rating bintang, dan rincian usaha muncul kaya di hasil pencarian Google.",
  },

  // 3. Google Maps & Google Business Profile
  {
    id: "gmaps_sync",
    name: "Kelola Titik Google Maps & Update Jam Operasional",
    category: "maps",
    price: 80000,
    badge: "Bisnis Lokal",
    icon: "📍",
    desc: "Titik peta bisnis di Google Maps selalu akurat, pencegahan duplikasi/klaim pihak luar, dan update berkala jam buka hari libur.",
    recommended: true,
  },
  {
    id: "gmaps_geotag",
    name: "Geotagging Foto Usaha & Optimasi Pencarian Sekitar",
    category: "maps",
    price: 65000,
    badge: "Lokal SEO",
    icon: "📸",
    desc: "Injeksi metadata koordinat GPS pada foto tempat usaha atau menu baru sebelum di-upload agar pencarian 'terdekat' makin kuat.",
  },
  {
    id: "gmaps_reviews",
    name: "Notifikasi & Template Balasan Ulasan Bintang Pelanggan",
    category: "maps",
    price: 50000,
    badge: "Reputasi",
    icon: "⭐",
    desc: "Notifikasi seketika saat ada ulasan pelanggan baru di Google Maps, disertai saran balasan sopan dan persuasif untuk menaikkan reputasi.",
  },

  // 4. Konten, Laporan & Jalur Cepat WhatsApp
  {
    id: "content_update",
    name: "Layanan Update Konten & Banner Promo via WhatsApp",
    category: "content",
    price: 90000,
    badge: "Bebas Pusing",
    icon: "✍️",
    desc: "Mau ganti harga menu, upload foto produk baru, atau pasang pengumuman promo? Cukup kirim ke WA, tim Ladi yang langsung menggantikan.",
  },
  {
    id: "wa_report",
    name: "Laporan Statistik Bulanan Dikirim ke WhatsApp",
    category: "content",
    price: 45000,
    badge: "Transparan",
    icon: "📊",
    desc: "Grafis ringkas pengunjung nyata, jam paling ramai, dan jumlah klik tombol WhatsApp dikirimkan langsung ke nomor WA Anda tiap akhir bulan.",
    recommended: true,
  },
  {
    id: "hotline_vip",
    name: "Hotline Darurat WhatsApp Prioritas (Respon < 30 Menit)",
    category: "content",
    price: 60000,
    badge: "Jalur Cepat",
    icon: "⚡",
    desc: "Akses jalur darurat langsung ke kepala teknisi Ladi untuk kendala website kritis, 7 hari seminggu tanpa antre tiket support.",
  },
];

const PRESETS = [
  {
    id: "essential",
    name: "🛡️ Satpam Esensial",
    priceLabel: "Rp 155.000 / bln",
    desc: "Proteksi dasar uptime 24/7, SSL anti-hack, dan laporan bulanan ke WhatsApp.",
    addons: ["uptime_247", "ssl_firewall", "wa_report"],
  },
  {
    id: "seo_booster",
    name: "🚀 Satpam + SEO 90+",
    priceLabel: "Rp 325.000 / bln",
    desc: "Proteksi server plus booster skor PageSpeed 90+, audit kata kunci Google, dan backup rutin.",
    addons: ["uptime_247", "ssl_firewall", "backup_cloud", "seo_90", "keyword_tracking"],
  },
  {
    id: "maps_local",
    name: "📍 Satpam + Maps Juara",
    priceLabel: "Rp 325.000 / bln",
    desc: "Proteksi web lengkap dengan pengawalan Google Maps, geotagging foto usaha, dan update konten rutin via WA.",
    addons: ["uptime_247", "ssl_firewall", "gmaps_sync", "gmaps_geotag", "content_update"],
  },
  {
    id: "full_guard",
    name: "👑 Full Guard Sultan 500rb",
    priceLabel: "Rp 500.000 / bln",
    desc: "Semua 12 modul satpam aktif komplit! Proteksi, SEO 90+, Google Maps, & Hotline VIP (Diskon Bundle Spesial).",
    addons: GUARD_ADDONS.map((a) => a.id),
  },
];

const DURATION_OPTIONS = [
  { months: 1, label: "1 Bulan", discount: 0, note: "Fleksibel bulanan" },
  { months: 3, label: "3 Bulan", discount: 5, note: "Diskon 5%" },
  { months: 6, label: "6 Bulan", discount: 10, note: "Diskon 10%" },
  { months: 12, label: "12 Bulan (1 Tahun)", discount: 20, note: "⭐ Diskon 20% (Hemat 2 Bulan)", isBest: true },
];

export default function GuardBuilder() {
  const [selectedAddonIds, setSelectedAddonIds] = useState<string[]>([
    "uptime_247",
    "ssl_firewall",
    "seo_90",
    "gmaps_sync",
    "wa_report",
  ]);
  const [selectedDuration, setSelectedDuration] = useState<number>(3); // Default 3 Bulan

  // Toggle single addon
  const toggleAddon = (id: string) => {
    setSelectedAddonIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Apply preset
  const applyPreset = (presetAddons: string[]) => {
    setSelectedAddonIds(presetAddons);
  };

  // Select all or reset
  const selectAll = () => {
    setSelectedAddonIds(GUARD_ADDONS.map((a) => a.id));
  };

  const resetAll = () => {
    setSelectedAddonIds(["uptime_247", "ssl_firewall"]);
  };

  // Calculation
  const calculation = useMemo(() => {
    const isAllSelected = selectedAddonIds.length === GUARD_ADDONS.length;
    let rawMonthly = selectedAddonIds.reduce((sum, id) => {
      const item = GUARD_ADDONS.find((a) => a.id === id);
      return sum + (item ? item.price : 0);
    }, 0);

    // Special bundle cap: if all items are selected, cap at Rp 500.000 / month!
    const isBundleCap = isAllSelected && rawMonthly > 500000;
    const monthlyBeforeDurationDiscount = isBundleCap ? 500000 : rawMonthly;

    const durationObj = DURATION_OPTIONS.find((d) => d.months === selectedDuration) || DURATION_OPTIONS[0];
    const discountRate = durationObj.discount / 100;

    const finalMonthly = Math.round(monthlyBeforeDurationDiscount * (1 - discountRate));
    const grandTotal = finalMonthly * durationObj.months;
    const totalSavings = (rawMonthly * durationObj.months) - grandTotal;

    return {
      rawMonthly,
      isBundleCap,
      monthlyBeforeDurationDiscount,
      finalMonthly,
      grandTotal,
      totalSavings,
      durationObj,
      count: selectedAddonIds.length,
    };
  }, [selectedAddonIds, selectedDuration]);

  // WhatsApp Message Generator
  const waOrderUrl = useMemo(() => {
    const selectedNames = selectedAddonIds
      .map((id) => {
        const item = GUARD_ADDONS.find((a) => a.id === id);
        return item ? `• ${item.name} (${new Intl.NumberFormat("id-ID").format(item.price)}/bln)` : "";
      })
      .filter(Boolean)
      .join("\n");

    const message = `Halo Tim Ladi, saya ingin berlangganan *Paket GUARD (Satpam Digital Rakitan Sendiri)* untuk website usaha saya:

🧩 *Fitur Pecahan yang Saya Pilih (${calculation.count} Fitur):*
${selectedNames}

⏱️ *Durasi Langganan:* ${calculation.durationObj.label} ${calculation.durationObj.discount > 0 ? `(Diskon ${calculation.durationObj.discount}%)` : ""}
💰 *Investasi Bulanan:* Rp ${new Intl.NumberFormat("id-ID").format(calculation.finalMonthly)} / bulan
💵 *Total Pembayaran:* Rp ${new Intl.NumberFormat("id-ID").format(calculation.grandTotal)} (${calculation.durationObj.months} Bulan)

Mohon informasi nomor rekening atau instruksi pembayaran resminya. Terima kasih!`;

    return `https://wa.me/6282112477119?text=${encodeURIComponent(message)}`;
  }, [selectedAddonIds, calculation]);

  // Checkout Web URL with query parameters
  const checkoutUrl = useMemo(() => {
    const params = new URLSearchParams();
    params.set("addons", selectedAddonIds.join(","));
    params.set("duration", String(selectedDuration));
    params.set("monthly", String(calculation.finalMonthly));
    params.set("total", String(calculation.grandTotal));
    return `/checkout/paket-guard?${params.toString()}`;
  }, [selectedAddonIds, selectedDuration, calculation]);

  return (
    <div id="rakit-guard" className="space-y-10">
      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#fa824b]/15 text-[#c2410c] font-bold text-xs font-mono uppercase tracking-wider">
          <span>🧩 SISTEM PECAHAN LEGO · RAKIT SESUAI KEBUTUHAN</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-extrabold text-[#0f172a] tracking-tight">
          Kalkulator &amp; Rakit Satpam Digital <span className="text-[#1853a7]">(Paket GUARD)</span>
        </h2>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          Jangan buang uang untuk fitur yang tidak Anda pakai. Centang pecahan perlindungan, optimasi SEO 90+, atau pengawalan Google Maps sesuai prioritas bisnis Anda.
        </p>
      </div>

      {/* Preset Buttons */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-bold text-slate-700">
          <span className="uppercase tracking-wider flex items-center gap-1.5">
            <span>⚡</span>
            <span>Pilihan Paket Instan (Preset 1-Klik):</span>
          </span>
          <div className="flex items-center gap-3 text-[11px]">
            <button
              onClick={selectAll}
              className="text-[#1853a7] hover:underline font-semibold cursor-pointer"
            >
              Pilih Semua (12 Modul)
            </button>
            <span className="text-slate-300">|</span>
            <button
              onClick={resetAll}
              className="text-slate-500 hover:text-slate-800 font-semibold cursor-pointer"
            >
              Reset ke Minimal
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {PRESETS.map((preset) => {
            const isMatch =
              preset.addons.length === selectedAddonIds.length &&
              preset.addons.every((id) => selectedAddonIds.includes(id));

            return (
              <button
                key={preset.id}
                onClick={() => applyPreset(preset.addons)}
                className={`p-4 rounded-2xl text-left transition-all border flex flex-col justify-between cursor-pointer relative ${
                  isMatch
                    ? "bg-[#1853a7] text-white border-[#1853a7] shadow-md shadow-[#1853a7]/20 scale-[1.02]"
                    : "bg-white text-slate-800 border-slate-200 hover:border-[#1853a7]/50 hover:bg-slate-50"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-extrabold text-sm tracking-tight">{preset.name}</span>
                    {isMatch && (
                      <span className="w-5 h-5 rounded-full bg-[#fa824b] text-white flex items-center justify-center text-xs font-bold">
                        ✓
                      </span>
                    )}
                  </div>
                  <div className={`text-xs font-black mt-1 ${isMatch ? "text-amber-300" : "text-[#1853a7]"}`}>
                    {preset.priceLabel}
                  </div>
                  <p className={`text-[11px] mt-2 leading-relaxed ${isMatch ? "text-slate-200" : "text-slate-500"}`}>
                    {preset.desc}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Layout: Left Checklists & Right Sticky Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Modular Checklists (8 cols) */}
        <div className="lg:col-span-8 space-y-8">
          {/* Section 1: Server & Uptime */}
          <div className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
              <span className="text-xl">🛡️</span>
              <div>
                <h3 className="font-extrabold text-slate-900 text-base sm:text-lg">
                  1. Pondasi Server, Uptime &amp; Satpam 24 Jam
                </h3>
                <p className="text-xs text-slate-500">
                  Perlindungan dasar agar website tidak pernah mati dan aman dari gangguan hacker.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {GUARD_ADDONS.filter((a) => a.category === "server").map((item) => {
                const checked = selectedAddonIds.includes(item.id);
                return (
                  <div
                    key={item.id}
                    onClick={() => toggleAddon(item.id)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start justify-between gap-4 ${
                      checked
                        ? "bg-blue-50/50 border-[#1853a7]/60 shadow-xs"
                        : "bg-[#f8fafc] border-slate-200 hover:border-slate-300 opacity-90"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => {}} // handled by parent onClick
                        className="w-5 h-5 rounded border-slate-300 text-[#1853a7] focus:ring-[#1853a7] mt-0.5 cursor-pointer"
                      />
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-bold text-slate-900 text-xs sm:text-sm">
                            {item.name}
                          </span>
                          {item.badge && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-200 text-slate-700">
                              {item.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-xs sm:text-sm font-black text-[#1853a7] block">
                        Rp {new Intl.NumberFormat("id-ID").format(item.price)}
                      </span>
                      <span className="text-[10px] text-slate-400">/ bulan</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 2: SEO & Google PageSpeed 90+ */}
          <div className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
              <span className="text-xl">🚀</span>
              <div>
                <h3 className="font-extrabold text-slate-900 text-base sm:text-lg">
                  2. Optimasi Mesin Pencari &amp; SEO (Skor 90+ di Google)
                </h3>
                <p className="text-xs text-slate-500">
                  Meningkatkan kecepatan buka di smartphone dan mendongkrak peringkat bisnis di Google.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {GUARD_ADDONS.filter((a) => a.category === "seo").map((item) => {
                const checked = selectedAddonIds.includes(item.id);
                return (
                  <div
                    key={item.id}
                    onClick={() => toggleAddon(item.id)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start justify-between gap-4 ${
                      checked
                        ? "bg-emerald-50/50 border-emerald-500/60 shadow-xs"
                        : "bg-[#f8fafc] border-slate-200 hover:border-slate-300 opacity-90"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => {}}
                        className="w-5 h-5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 mt-0.5 cursor-pointer"
                      />
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-bold text-slate-900 text-xs sm:text-sm">
                            {item.name}
                          </span>
                          {item.badge && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                              {item.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-xs sm:text-sm font-black text-emerald-700 block">
                        Rp {new Intl.NumberFormat("id-ID").format(item.price)}
                      </span>
                      <span className="text-[10px] text-slate-400">/ bulan</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 3: Google Maps & Local Business */}
          <div className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
              <span className="text-xl">📍</span>
              <div>
                <h3 className="font-extrabold text-slate-900 text-base sm:text-lg">
                  3. Pengawalan Google Maps &amp; Google Business Profile
                </h3>
                <p className="text-xs text-slate-500">
                  Memastikan titik peta bisnis Anda selalu muncul resmi dan mudah ditemukan calon pembeli lokal.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {GUARD_ADDONS.filter((a) => a.category === "maps").map((item) => {
                const checked = selectedAddonIds.includes(item.id);
                return (
                  <div
                    key={item.id}
                    onClick={() => toggleAddon(item.id)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start justify-between gap-4 ${
                      checked
                        ? "bg-amber-50/50 border-amber-500/60 shadow-xs"
                        : "bg-[#f8fafc] border-slate-200 hover:border-slate-300 opacity-90"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => {}}
                        className="w-5 h-5 rounded border-slate-300 text-amber-600 focus:ring-amber-500 mt-0.5 cursor-pointer"
                      />
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-bold text-slate-900 text-xs sm:text-sm">
                            {item.name}
                          </span>
                          {item.badge && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                              {item.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-xs sm:text-sm font-black text-amber-700 block">
                        Rp {new Intl.NumberFormat("id-ID").format(item.price)}
                      </span>
                      <span className="text-[10px] text-slate-400">/ bulan</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 4: Content Update & WhatsApp Reporting */}
          <div className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
              <span className="text-xl">⚡</span>
              <div>
                <h3 className="font-extrabold text-slate-900 text-base sm:text-lg">
                  4. Pembaruan Konten, Laporan &amp; Jalur Cepat WhatsApp
                </h3>
                <p className="text-xs text-slate-500">
                  Layanan santai tanpa pusing coding. Anda fokus jualan, biar tim Ladi yang merawat website Anda.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {GUARD_ADDONS.filter((a) => a.category === "content").map((item) => {
                const checked = selectedAddonIds.includes(item.id);
                return (
                  <div
                    key={item.id}
                    onClick={() => toggleAddon(item.id)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start justify-between gap-4 ${
                      checked
                        ? "bg-purple-50/50 border-purple-500/60 shadow-xs"
                        : "bg-[#f8fafc] border-slate-200 hover:border-slate-300 opacity-90"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => {}}
                        className="w-5 h-5 rounded border-slate-300 text-purple-600 focus:ring-purple-500 mt-0.5 cursor-pointer"
                      />
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-bold text-slate-900 text-xs sm:text-sm">
                            {item.name}
                          </span>
                          {item.badge && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800">
                              {item.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-xs sm:text-sm font-black text-purple-700 block">
                        Rp {new Intl.NumberFormat("id-ID").format(item.price)}
                      </span>
                      <span className="text-[10px] text-slate-400">/ bulan</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Sticky Summary & Checkout Action (4 cols) */}
        <div className="lg:col-span-4 sticky top-24 space-y-6">
          <div className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-200 shadow-xl space-y-6">
            {/* Box Header */}
            <div className="border-b border-slate-100 pb-5 space-y-2">
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest block">
                RINGKASAN SATPAM DIGITAL
              </span>
              <div className="flex items-baseline justify-between gap-2">
                <div>
                  <span className="text-3xl font-black text-[#1853a7] tracking-tight block">
                    Rp {new Intl.NumberFormat("id-ID").format(calculation.finalMonthly)}
                  </span>
                  <span className="text-xs text-slate-500 font-medium">
                    / bulan ({calculation.count} Fitur Terpilih)
                  </span>
                </div>

                {calculation.isBundleCap && (
                  <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase tracking-wider">
                    🎉 Paket Sultan Cap 500rb
                  </span>
                )}
              </div>

              {calculation.totalSavings > 0 && (
                <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-semibold flex items-center justify-between">
                  <span>Hemat Investasi:</span>
                  <span className="font-black">
                    Rp {new Intl.NumberFormat("id-ID").format(calculation.totalSavings)}
                  </span>
                </div>
              )}
            </div>

            {/* Pilihan Durasi Langganan */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Pilih Periode Langganan:
              </label>
              <div className="grid grid-cols-2 gap-2">
                {DURATION_OPTIONS.map((opt) => (
                  <button
                    key={opt.months}
                    type="button"
                    onClick={() => setSelectedDuration(opt.months)}
                    className={`p-2.5 rounded-xl text-xs font-bold text-center border transition-all cursor-pointer ${
                      selectedDuration === opt.months
                        ? "bg-[#1853a7] text-white border-[#1853a7] shadow-sm"
                        : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    <div>{opt.label}</div>
                    <div className={`text-[10px] font-normal ${selectedDuration === opt.months ? "text-amber-200" : "text-slate-500"}`}>
                      {opt.note}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Rincian Item Terpilih Ringkas */}
            <div className="space-y-2">
              <div className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center justify-between">
                <span>Daftar Perlindungan:</span>
                <span className="text-[11px] text-slate-400 font-normal">{calculation.count} item</span>
              </div>

              <div className="max-h-48 overflow-y-auto pr-1 space-y-1.5 text-xs text-slate-600">
                {selectedAddonIds.length === 0 ? (
                  <p className="text-slate-400 italic text-xs py-2">Belum ada fitur satpam yang dicentang.</p>
                ) : (
                  selectedAddonIds.map((id) => {
                    const item = GUARD_ADDONS.find((a) => a.id === id);
                    if (!item) return null;
                    return (
                      <div key={id} className="flex items-center justify-between gap-2 py-1 border-b border-slate-50">
                        <span className="truncate">{item.icon} {item.name}</span>
                        <span className="font-semibold text-slate-800 shrink-0">
                          {new Intl.NumberFormat("id-ID").format(item.price)}
                        </span>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Total Billing */}
            <div className="pt-3 border-t border-slate-100 space-y-1">
              <div className="flex justify-between items-center text-xs text-slate-500">
                <span>Total Billing ({calculation.durationObj.months} Bulan):</span>
                <span className="text-sm font-extrabold text-slate-900">
                  Rp {new Intl.NumberFormat("id-ID").format(calculation.grandTotal)}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 italic">
                *Tagihan dibayarkan di awal periode. Bebas batalkan atau ganti pecahan fitur kapan saja.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 space-y-2.5">
              <Link
                href={checkoutUrl}
                className="w-full py-3.5 px-4 rounded-full bg-[#fa824b] hover:bg-[#e5723b] text-white font-extrabold text-xs sm:text-sm uppercase tracking-wider text-center block shadow-lg hover:shadow-xl transition-all cursor-pointer"
              >
                ⚡ Pesan &amp; Checkout di Web →
              </Link>

              <a
                href={waOrderUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider text-center flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <span>💬</span>
                <span>Pesan Rincian via WhatsApp</span>
              </a>

              <div className="text-[11px] text-slate-500 text-center flex items-center justify-center gap-1.5 pt-1">
                <span>🛡️</span>
                <span>Jaminan website aman &amp; dipantau tim Ladi</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
