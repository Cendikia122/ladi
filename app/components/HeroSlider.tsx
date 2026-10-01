"use client";
import { useState, useEffect } from "react";

const slides = [
  {
    id: 1,
    tag: "LADI · LAYANAN DIGITAL",
    headline: "Bisnis Anda Hidup di Internet Global.",
    subhead:
      "Bukan sekadar penanda peta. Kami bangunkan ekosistem digital lengkap agar bisnis Anda mudah ditemukan, dipercaya pelanggan, dan menghasilkan omzet nyata.",
    primaryCta: "Minta Audit Gratis (15 Menit)",
    secondaryCta: "Lihat Paket Layanan",
  },
  {
    id: 2,
    tag: "EKOSISTEM DIGITAL LENGKAP",
    headline: "Bukan Cuma Bikin Website. Ini Sistem Penjualan.",
    subhead:
      "Website resmi, Google, dan WhatsApp terhubung dalam satu sistem yang langsung bekerja untuk Anda. Hasilnya bisa dipantau transparan setiap bulan.",
    primaryCta: "Konsultasi via WhatsApp",
    secondaryCta: "Cara Kerja Ladi",
  },
  {
    id: 3,
    tag: "BEBAS DARI RIBET TEKNIS",
    headline: "Anda Fokus Berbisnis. Kami yang Urus Teknologinya.",
    subhead:
      "Tidak perlu paham coding atau hosting. Tim Ladi mendampingi bisnis Anda secara rutin seperti memiliki tim IT pribadi.",
    primaryCta: "Mulai Sekarang",
    secondaryCta: "Tanya Konsultan",
  },
];

export default function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 7000);
    return () => clearInterval(timer);
  }, []);

  const slide = slides[currentSlide];

  return (
    <section id="beranda" className="relative min-h-[560px] lg:min-h-[620px] flex items-center bg-[#0f172a] text-white overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#0f172a] via-[#0f172a]/95 to-[#1853a7]/70 z-10" />
      <div 
        className="absolute inset-0 opacity-15 z-0"
        style={{
          backgroundImage: `radial-gradient(circle at 75% 50%, #1853a7 0%, transparent 60%), linear-gradient(to right, rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.06) 1px, transparent 1px)`,
          backgroundSize: '100% 100%, 56px 56px, 56px 56px'
        }}
      />

      <div className="relative z-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-24 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Main Text Content - Concise & High Legibility */}
          <div className="lg:col-span-8 space-y-6">
            {/* Tag Pill */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#fa824b]/20 border border-[#fa824b]/40">
              <span className="w-2 h-2 rounded-full bg-[#fa824b] animate-pulse" />
              <span className="text-[#fa824b] font-bold text-xs tracking-wider uppercase">
                {slide.tag}
              </span>
            </div>

            {/* Big Clear Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.14]">
              {slide.headline}
            </h1>

            {/* Orange Decorative Underline */}
            <div className="w-14 h-1.5 bg-[#fa824b] rounded-full" />

            {/* Short Subhead - Easy for older audience */}
            <p className="text-base sm:text-xl text-slate-200 leading-relaxed max-w-2xl font-normal">
              {slide.subhead}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-3">
              <a
                href="#konsultasi"
                className="px-8 py-4 rounded-full bg-[#fa824b] hover:bg-[#e5723b] text-white font-bold text-sm sm:text-base uppercase tracking-wider shadow-lg shadow-[#fa824b]/30 transition-all hover:-translate-y-0.5"
              >
                {slide.primaryCta} →
              </a>

              <a
                href="#layanan"
                className="px-7 py-4 rounded-full bg-white/10 hover:bg-white/20 text-white font-semibold text-sm sm:text-base border border-white/25 transition-all"
              >
                {slide.secondaryCta}
              </a>
            </div>

            {/* 3 Simple Pillars */}
            <div className="pt-6 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs sm:text-sm text-slate-300 border-t border-slate-700/60">
              <div className="flex items-center gap-2">
                <span className="text-[#fa824b] font-bold text-base">✓</span>
                <span>Tidak Perlu Paham Teknis</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[#fa824b] font-bold text-base">✓</span>
                <span>Diurus Total dari A sampai Z</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[#fa824b] font-bold text-base">✓</span>
                <span>Laporan Dampak Bulanan</span>
              </div>
            </div>
          </div>

          {/* Right: Quick Impact Summary Box */}
          <div className="hidden lg:block lg:col-span-4">
            <div className="rounded-3xl bg-slate-900/95 border border-slate-700 p-7 shadow-2xl text-left space-y-5">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-xs font-bold text-slate-400 font-mono">STATUS BISNIS ANDA</span>
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  ONLINE 24/7
                </span>
              </div>

              <div className="space-y-3">
                <div className="p-3.5 rounded-xl bg-slate-800/70 border border-slate-700/70">
                  <div className="text-xs text-slate-400">1. Website Resmi</div>
                  <div className="text-sm font-bold text-white mt-0.5">Tampil Profesional di Seluruh Dunia</div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-800/70 border border-slate-700/70">
                  <div className="text-xs text-slate-400">2. Pencarian Google</div>
                  <div className="text-sm font-bold text-white mt-0.5">Mudah Ditemukan Calon Pembeli</div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-800/70 border border-slate-700/70">
                  <div className="text-xs text-slate-400">3. Langsung ke WhatsApp</div>
                  <div className="text-sm font-bold text-white mt-0.5">Pengunjung Mudah Menghubungi</div>
                </div>
              </div>

              <div className="pt-2 text-center">
                <a
                  href="#konsultasi"
                  className="text-xs font-bold text-[#fa824b] hover:underline"
                >
                  Minta Cek Gratis Bisnis Saya →
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Slide Controls */}
        <div className="flex items-center gap-2 pt-10">
          {slides.map((s, idx) => (
            <button
              key={s.id}
              onClick={() => setCurrentSlide(idx)}
              className={`h-2 rounded-full transition-all duration-300 ${
                currentSlide === idx ? "w-8 bg-[#fa824b]" : "w-2.5 bg-white/30"
              }`}
              aria-label={`Slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
