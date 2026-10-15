"use client";
import { useState } from "react";
import Link from "next/link";
import { ServicePackage } from "@/app/lib/storage";

const curatedFeatureDescs: Record<string, string> = {
  "Landing Page Cepat 1 Halaman": "Tampilan profesional dan sangat cepat saat dibuka di smartphone maupun komputer.",
  "Setup & Verifikasi Google Business Profile": "Titik peta Google Maps resmi lengkap dengan nama, alamat, foto, dan jam operasional.",
  "Tombol Order WhatsApp Otomatis": "Calon pembeli cukup tekan satu tombol untuk langsung chat dan order ke nomor Anda.",
  "Aktif & Siap Pakai dalam 5 Hari Kerja": "Pengerjaan kilat dan siap pakai tanpa perlu Anda pusing urusan teknis.",
  "Konsultasi & Audit Digital 10 Poin Gratis": "Audit menyeluruh kecepatan website, SEO, dan profil Google Maps bisnis Anda.",
  "Website Lengkap 5–7 Halaman": "Halaman Beranda, Menu/Layanan, Galeri Portofolio, Tentang Kami, dan Kontak resmi.",
  "Website Lengkap 5–7 Halaman (Menu, Galeri, Profil)": "Halaman Beranda, Menu/Layanan, Galeri Portofolio, Tentang Kami, dan Kontak resmi.",
  "Terhubung Google Analytics": "Pantau pengunjung secara transparan untuk mengetahui perkembangan bisnis setiap hari.",
  "Terhubung Google Analytics (Pantau Pengunjung)": "Pantau pengunjung secara transparan untuk mengetahui perkembangan bisnis setiap hari.",
  "Desain Khusus Brand Anda": "Tampilan eksklusif sesuai warna dan karakter usaha Anda, super responsif di HP.",
  "Desain Khusus Brand Anda (Responsif di HP)": "Tampilan eksklusif sesuai warna dan karakter usaha Anda, super responsif di HP.",
  "Gratis Laporan Performa Perdana (30 Hari)": "Laporan pertumbuhan pengunjung dan klik WhatsApp dikirimkan setelah 30 hari website tayang.",
  "Katalog Produk / Sistem Booking Terpadu": "Pelanggan bisa memesan produk atau menjadwalkan layanan secara mandiri 24 jam nonstop.",
  "Integrasi Pembayaran QRIS Otomatis": "Dukungan transaksi instan dari semua bank (BCA, Mandiri, BRI, BNI) dan dompet digital (GoPay, OVO, Dana).",
  "WhatsApp Auto-Reply Template": "Format balasan pesan otomatis profesional agar pesanan pembeli langsung terlayani cepat.",
  "Siap Jualan Mandiri 24 Jam Nonstop": "Otomatisasi penuh tanpa perlu melayani chat manual satu per satu secara melelahkan.",
  "Semua Fitur Paket RISE Lengkap": "Seluruh fasilitas, analitik, dan integrasi dari Paket RISE sudah otomatis disertakan.",
  "Website Dipantau 24 Jam": "Pemantauan keamanan server dan stabilitas kecepatan agar website selalu aktif lancar.",
  "Website dipantau 24 jam": "Pemantauan keamanan server dan stabilitas kecepatan agar website selalu aktif lancar.",
  "Bebas Error & Maintenance Rutin": "Perawatan rutin domain, hosting, dan SSL tanpa perlu Anda khawatir kendala teknis.",
  "Bebas error & maintenance rutin": "Perawatan rutin domain, hosting, dan SSL tanpa perlu Anda khawatir kendala teknis.",
  "Update Konten Rutin": "Mau ganti harga, tambah foto produk, atau upload info baru? Cukup kirim ke WA kami.",
  "Update konten rutin": "Mau ganti harga, tambah foto produk, atau upload info baru? Cukup kirim ke WA kami.",
  "Laporan Pengunjung Dikirim Tiap Bulan ke WhatsApp": "Laporan angka nyata langsung dikirim ke WhatsApp Anda setiap akhir bulan.",
  "Laporan Pengunjung dikirim tiap bulan ke WhatsApp": "Laporan angka nyata langsung dikirim ke WhatsApp Anda setiap akhir bulan.",
};

function parseFeatures(deliverablesRaw: string | undefined): Array<{ title: string; desc: string }> {
  if (!deliverablesRaw) return [];
  let list: any[] = [];
  try {
    list = JSON.parse(deliverablesRaw);
    if (!Array.isArray(list)) list = [deliverablesRaw];
  } catch {
    list = deliverablesRaw.split("\n").map((s) => s.trim()).filter(Boolean);
  }

  return list.slice(0, 4).map((item) => {
    if (typeof item === "object" && item !== null && item.title) {
      return {
        title: String(item.title),
        desc: item.desc ? String(item.desc) : (curatedFeatureDescs[String(item.title)] || "Termasuk dalam standar pengerjaan profesional Ladi."),
      };
    }
    const str = String(item).trim();
    if (curatedFeatureDescs[str]) {
      return { title: str, desc: curatedFeatureDescs[str] };
    }
    if (str.includes(" - ")) {
      const [t, ...r] = str.split(" - ");
      return { title: t.trim(), desc: r.join(" - ").trim() };
    }
    if (str.includes(": ")) {
      const [t, ...r] = str.split(": ");
      return { title: t.trim(), desc: r.join(": ").trim() };
    }
    return {
      title: str,
      desc: "Fasilitas lengkap dan terintegrasi standar pengerjaan resmi Ladi.",
    };
  });
}

const defaultPackages = [
  {
    id: "exist",
    tag: "SOLUSI AWAL UNTUK BISNIS KECIL",
    name: "Paket EXIST",
    slug: "paket-exist",
    price: "Mulai dari Rp 299.000",
    period: "Sekali Bayar · 5 Hari Kerja Siap",
    subtitle: "Biar Bisnismu Muncul Resmi di Internet",
    summary: "Cocok untuk UMKM & bisnis lokal yang ingin mulai terlihat online dengan biaya paling terjangkau.",
    ctaText: "Mulai dari sini. →",
    waMessage: "Halo Ladi, saya tertarik dengan Paket EXIST (Mulai Rp 299.000). Biar bisnismu muncul resmi di internet.",
    badgePopular: false,
    features: [
      {
        title: "Landing Page Cepat 1 Halaman",
        desc: "Tampilan profesional dan sangat cepat saat dibuka di smartphone maupun komputer.",
      },
      {
        title: "Setup & Verifikasi Google Business Profile",
        desc: "Titik peta Google Maps resmi lengkap dengan nama, alamat, foto, dan jam operasional.",
      },
      {
        title: "Tombol Order WhatsApp Otomatis",
        desc: "Calon pembeli cukup tekan satu tombol untuk langsung chat dan order ke nomor Anda.",
      },
      {
        title: "Aktif & Siap Pakai dalam 5 Hari Kerja",
        desc: "Pengerjaan kilat dan siap pakai tanpa perlu Anda pusing urusan teknis.",
      },
    ],
  },
  {
    id: "rise",
    tag: "PALING POPULER",
    name: "Paket RISE",
    slug: "paket-rise",
    price: "Mulai dari Rp 999.000",
    period: "Sekali Bayar · 7–10 Hari Kerja",
    subtitle: "Profil Lengkap & Profesional untuk Bisnis Jasa / Toko",
    summary: "Cocok untuk bisnis yang ingin tampil lebih profesional, dipercaya calon pelanggan, dan memiliki profil portofolio mendalam.",
    ctaText: "Naik Level Sekarang →",
    waMessage: "Halo Ladi, saya tertarik dengan Paket RISE (Mulai Rp 999.000). Saya ingin profil lengkap & profesional untuk bisnis saya.",
    badgePopular: true,
    features: [
      {
        title: "Website Lengkap 5–7 Halaman",
        desc: "Halaman Beranda, Menu/Layanan, Galeri Portofolio, Tentang Kami, dan Kontak resmi.",
      },
      {
        title: "Terhubung Google Analytics",
        desc: "Pantau pengunjung secara transparan untuk mengetahui perkembangan bisnis setiap hari.",
      },
      {
        title: "Desain Khusus Brand Anda",
        desc: "Tampilan eksklusif sesuai warna dan karakter usaha Anda, super responsif di HP.",
      },
      {
        title: "Gratis Laporan Performa Perdana (30 Hari)",
        desc: "Laporan pertumbuhan pengunjung dan klik WhatsApp dikirimkan setelah 30 hari website tayang.",
      },
    ],
  },
  {
    id: "run",
    tag: "SOLUSI MANDIRI",
    name: "Paket RUN",
    slug: "paket-run",
    price: "Mulai dari Rp 2.499.000",
    period: "Sekali Bayar · Siap Jualan 24 Jam",
    subtitle: "Sistem Toko Online & Booking Mandiri",
    summary: "Cocok untuk bisnis yang ingin menerima pesanan dan booking secara online tanpa ribet.",
    ctaText: "Siap Jualan Mandiri →",
    waMessage: "Halo Ladi, saya tertarik dengan Paket RUN (Mulai Rp 2.499.000). Saya ingin website sistem toko online & booking mandiri dengan QRIS otomatis.",
    badgePopular: false,
    features: [
      {
        title: "Katalog Produk / Sistem Booking Terpadu",
        desc: "Pelanggan bisa memesan produk atau menjadwalkan layanan secara mandiri 24 jam nonstop.",
      },
      {
        title: "Integrasi Pembayaran QRIS Otomatis",
        desc: "Dukungan transaksi instan dari semua bank (BCA, Mandiri, BRI, BNI) dan dompet digital (GoPay, OVO, Dana).",
      },
      {
        title: "WhatsApp Auto-Reply Template",
        desc: "Format balasan pesan otomatis profesional agar pesanan pembeli langsung terlayani cepat.",
      },
      {
        title: "Siap Jualan Mandiri 24 Jam Nonstop",
        desc: "Otomatisasi penuh tanpa perlu melayani chat manual satu per satu secara melelahkan.",
      },
    ],
  },
  {
    id: "guard",
    tag: "JASA MAINTENANCE BISNIS DI INTERNET",
    name: "Paket GUARD",
    slug: "paket-guard",
    price: "Mulai Rp 150.000 – 500.000",
    period: "/ bulan · Bebas Pilih Modul",
    subtitle: "Bukan Penjualan Web Baru — Satpam & Operasional Digital",
    summary: "Bukan pembuatan web baru! Layanan pemeliharaan berkala untuk merawat, mengamankan, dan mengoptimasi seluruh aset online usaha Anda: Website, Titik Google Maps, Profil Media Sosial, hingga WhatsApp Bisnis.",
    ctaText: "🧩 Rakit Maintenance Sendiri →",
    waMessage: "Halo Ladi, saya tertarik merakit modul Jasa Maintenance Bisnis di Internet (Paket GUARD mulai Rp 150.000 – 500.000 / bulan). Saya ingin merawat aset digital usaha saya.",
    badgePopular: false,
    features: [
      {
        title: "Pemeliharaan & Satpam Website 24 Jam",
        desc: "Uptime 24/7, SSL anti-hack, perbaikan bug rutin, backup cloud berkala, dan optimasi kecepatan.",
      },
      {
        title: "Perawatan Google Maps & Toko Fisik",
        desc: "Titik peta lokasi selalu akurat, jam buka hari libur diperbarui, foto geotagging, dan monitoring ulasan.",
      },
      {
        title: "Pemeliharaan Profil Media Sosial",
        desc: "Merawat link-in-bio (IG/TikTok), perapian sorotan produk, dan bantuan desain banner story promo rutin.",
      },
      {
        title: "WhatsApp Bisnis & Laporan Terpadu",
        desc: "Katalog produk WA terawat, hotline respon cepat, dan laporan performa bulanan langsung ke WhatsApp.",
      },
    ],
  },
];

interface ServicesSectionProps {
  packages?: ServicePackage[];
}

export default function ServicesSection({ packages: dbPackages }: ServicesSectionProps = {}) {
  const displayList = (dbPackages && dbPackages.length > 0)
    ? dbPackages.map((pkg) => {
        const feats = parseFeatures(pkg.deliverables);
        const formattedPrice = pkg.price.startsWith("Rp") || pkg.price.startsWith("Mulai")
          ? pkg.price
          : `Rp ${pkg.price}`;

        return {
          id: pkg.slug || String(pkg.id),
          tag: pkg.tag || "PAKET LADI",
          name: pkg.name,
          slug: pkg.slug,
          price: formattedPrice,
          period: pkg.period || pkg.timeline || "Sekali Bayar",
          subtitle: pkg.subtitle || "",
          summary: pkg.target_audience || pkg.subtitle || "",
          ctaText: pkg.cta_text || "Pesan Sekarang →",
          waMessage: pkg.cta_whatsapp_text || `Halo Ladi, saya tertarik dengan ${pkg.name} (${formattedPrice}). ${pkg.subtitle}`,
          badgePopular: Boolean(pkg.badge_popular),
          features: feats.length > 0 ? feats : [
            { title: "Fitur Lengkap Terverifikasi", desc: "Dukungan penuh tim ahli Ladi siap pakai." }
          ],
        };
      })
    : defaultPackages;

  const defaultIndex = Math.max(0, displayList.findIndex((p) => (p as any).badgePopular));
  const [activeTab, setActiveTab] = useState(defaultIndex >= 0 ? defaultIndex : 0);
  const current = displayList[activeTab] || displayList[0];

  return (
    <section id="layanan" className="py-24 md:py-32 bg-[#f8fafc] border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header - Simple & Clear */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="section-sublabel">
            PILIHAN LAYANAN LADI
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0f172a] tracking-tight mt-2">
            Pilih Sesuai <span className="text-[#1853a7]">Kebutuhan Usaha</span>
          </h2>
          <div className="decorative-line-center" />
          <p className="text-slate-600 text-base sm:text-lg">
            Satu ekosistem terpadu. Semua paket sudah kami kerjakan lengkap sampai siap pakai.
          </p>
        </div>

        {/* Tab Selection */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Tab Buttons */}
          <div className="lg:col-span-4 space-y-3">
            {displayList.map((pkg, idx) => (
              <button
                key={pkg.id}
                onClick={() => setActiveTab(idx)}
                className={`w-full text-left p-5 rounded-2xl transition-all duration-200 border flex items-center justify-between cursor-pointer ${
                  activeTab === idx
                    ? "bg-[#1853a7] text-white border-[#1853a7] shadow-lg shadow-[#1853a7]/20"
                    : "bg-white text-slate-800 border-slate-200 hover:border-[#1853a7]/40 hover:bg-slate-50"
                }`}
              >
                <div>
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${
                    activeTab === idx ? "text-amber-300" : "text-slate-600"
                  }`}>
                    {pkg.tag}
                  </span>
                  <div className="text-lg font-bold mt-0.5 tracking-tight">
                    {pkg.name}
                  </div>
                  <div className={`text-xs mt-1 font-semibold ${activeTab === idx ? "text-amber-200" : "text-[#1853a7]"}`}>
                    {pkg.price}
                  </div>
                </div>

                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ml-2 ${
                  activeTab === idx ? "bg-[#c2410c] text-white" : "bg-slate-100 text-slate-600"
                }`}>
                  →
                </div>
              </button>
            ))}

            <div className="p-5 rounded-2xl bg-white border border-slate-200 text-center mt-6 space-y-2">
              <p className="text-xs text-slate-600 font-medium">Bingung memilih paket yang pas?</p>
              <Link
                href="/contact-us"
                aria-label="Konsultasi dan audit 10 poin gratis bersama tim Ladi"
                className="inline-block w-full py-3 px-4 rounded-full bg-[#c2410c] hover:bg-[#9a3412] text-white font-bold text-xs uppercase tracking-wider transition-all shadow-sm"
              >
                Konsultasi & Audit 10 Poin Gratis →
              </Link>
            </div>
          </div>

          {/* Right: Selected Package Content */}
          <div className="lg:col-span-8">
            <div className="p-7 sm:p-10 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-7">
              {/* Header Box */}
              <div className="border-b border-slate-100 pb-6 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="px-3 py-1 rounded-full bg-orange-100 text-[#c2410c] text-xs font-bold uppercase tracking-wider">
                    {current.tag}
                  </span>
                  <div className="text-right">
                    <span className="text-2xl font-black text-[#1853a7] block">{current.price}</span>
                    <span className="text-[11px] text-slate-600 font-medium">{current.period}</span>
                  </div>
                </div>

                <div>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-[#0f172a]">
                    {current.name} — <span className="text-[#1853a7]">&ldquo;{current.subtitle}&rdquo;</span>
                  </h3>
                  <p className="text-slate-600 text-sm sm:text-base mt-2 leading-relaxed">
                    {current.summary}
                  </p>
                </div>
              </div>

              {/* 4 Feature Items */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {current.features.map((f, i) => (
                  <div
                    key={i}
                    className="p-5 rounded-2xl bg-[#f8fafc] border border-slate-200/90 space-y-1.5"
                  >
                    <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm">
                      <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs shrink-0">✓</span>
                      <span className="text-slate-900 font-bold text-xs sm:text-sm">{f.title}</span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed pl-7">
                      {f.desc}
                    </p>
                  </div>
                ))}
              </div>

              {/* Bottom Action */}
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-100">
                <div className="text-xs text-slate-600 text-center sm:text-left">
                  {current.slug === "paket-guard"
                    ? "🧩 Bebas pilih modul · Diskon hingga 20% · Tanpa kontrak mengikat"
                    : "✅ DP 50% di awal · Pelunasan setelah website siap tayang"}
                </div>

                <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
                  {current.slug === "paket-guard" ? (
                    <Link
                      href="/services/paket-guard#rakit-guard"
                      aria-label="Rakit modul Paket GUARD sendiri"
                      className="flex-1 sm:flex-none px-5 py-3 rounded-full bg-[#c2410c] hover:bg-[#9a3412] text-white font-bold text-xs uppercase tracking-wider text-center transition-all shadow-md"
                    >
                      🧩 Rakit Satpam Sendiri →
                    </Link>
                  ) : (
                    <Link
                      href={`/checkout/${current.slug}`}
                      aria-label={`Pesan dan bayar langsung di web untuk ${current.name}`}
                      className="flex-1 sm:flex-none px-5 py-3 rounded-full bg-[#c2410c] hover:bg-[#9a3412] text-white font-bold text-xs uppercase tracking-wider text-center transition-all shadow-md"
                    >
                      ⚡ Pesan & Bayar di Web
                    </Link>
                  )}

                  <Link
                    href={`/services/${current.slug}`}
                    aria-label={`Lihat detail untuk ${current.name}`}
                    className="flex-1 sm:flex-none px-5 py-3 rounded-full bg-[#1853a7] hover:bg-[#0f3d7d] text-white font-bold text-xs uppercase tracking-wider text-center transition-all shadow-sm"
                  >
                    {current.slug === "paket-guard" ? "Lihat Detail →" : "Lihat Contoh →"}
                  </Link>

                  <a
                    href={`https://wa.me/6282112477119?text=${encodeURIComponent(current.waMessage)}`}
                    aria-label={`Chat WhatsApp untuk pemesanan ${current.name}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 sm:flex-none px-4 py-3 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs uppercase tracking-wider text-center transition-all"
                  >
                    Chat WA 💬
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
