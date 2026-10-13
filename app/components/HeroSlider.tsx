"use client";
import { useState, useEffect, useRef } from "react";

const slides = [
  {
    id: 1,
    tag: "LADI · LAYANAN DIGITAL",
    headline: "Bisnis Anda Hidup di Internet Global.",
    subhead:
      "Bukan sekadar penanda peta. Kami bangunkan ekosistem digital lengkap agar bisnis Anda mudah ditemukan, dipercaya pelanggan, dan menghasilkan omzet nyata.",
    primaryCta: "Minta Audit Gratis (15 Menit)",
    secondaryCta: "Lihat Paket Layanan",
    primaryHref: "#konsultasi",
    secondaryHref: "#layanan",
    accentStep: 0,
  },
  {
    id: 2,
    tag: "EKOSISTEM DIGITAL LENGKAP",
    headline: "Bukan Cuma Bikin Website. Ini Sistem Penjualan.",
    subhead:
      "Website resmi, Google, dan WhatsApp terhubung dalam satu sistem yang langsung bekerja untuk Anda. Hasilnya bisa dipantau transparan setiap bulan.",
    primaryCta: "Konsultasi via WhatsApp",
    secondaryCta: "Cara Kerja Ladi",
    primaryHref: "https://wa.me/6282112477119?text=Halo+Ladi%2C+saya+ingin+konsultasi+sistem+penjualan+digital",
    secondaryHref: "#proses",
    accentStep: 1,
  },
  {
    id: 3,
    tag: "BEBAS DARI RIBET TEKNIS",
    headline: "Anda Fokus Berbisnis. Kami yang Urus Teknologinya.",
    subhead:
      "Tidak perlu paham coding atau hosting. Tim Ladi mendampingi bisnis Anda secara rutin seperti memiliki tim IT pribadi.",
    primaryCta: "Mulai Sekarang",
    secondaryCta: "Tanya Konsultan",
    primaryHref: "#konsultasi",
    secondaryHref: "https://wa.me/6282112477119?text=Halo+Ladi%2C+saya+mau+tanya-tanya+pendampingan+digital",
    accentStep: 2,
  },
];

const SLIDE_DURATION = 6500; // 6.5s per slide

export default function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-play timer with pause on hover
  useEffect(() => {
    if (isPaused) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, SLIDE_DURATION);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, currentSlide]);

  const goToSlide = (idx: number) => {
    setCurrentSlide(idx);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <section
      id="beranda"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="relative min-h-[580px] lg:min-h-[640px] flex items-center bg-[#0f172a] text-white overflow-hidden select-none"
    >
      {/* Background Ambience & Soft Atmospheric Gradients */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#0f172a] via-[#0f172a]/95 to-[#1853a7]/65 z-10 pointer-events-none" />
      <div
        className="absolute inset-0 opacity-15 z-0 pointer-events-none transition-opacity duration-1000"
        style={{
          backgroundImage: `radial-gradient(circle at 75% 50%, #1853a7 0%, transparent 60%), linear-gradient(to right, rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.06) 1px, transparent 1px)`,
          backgroundSize: "100% 100%, 56px 56px, 56px 56px",
        }}
      />

      {/* Decorative Floating Ambient Glow */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#1853a7]/30 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute -bottom-32 right-10 w-96 h-96 bg-[#fa824b]/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-24 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Main Text Content Slider - Smooth Crossfade Container */}
          <div className="lg:col-span-8 relative min-h-[420px] sm:min-h-[380px] flex flex-col justify-center">
            {slides.map((s, idx) => {
              const isActive = idx === currentSlide;

              return (
                <div
                  key={s.id}
                  className={`transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    isActive
                      ? "opacity-100 translate-x-0 scale-100 pointer-events-auto relative z-10"
                      : "opacity-0 -translate-x-6 scale-[0.98] pointer-events-none absolute inset-0 z-0"
                  }`}
                >
                  <div className="space-y-6">
                    {/* Tag Pill with Pulse Indicator */}
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#fa824b]/20 border border-[#fa824b]/40 backdrop-blur-sm shadow-sm">
                      <span className="w-2 h-2 rounded-full bg-[#fa824b] animate-ping" />
                      <span className="text-[#fa824b] font-bold text-xs tracking-wider uppercase">
                        {s.tag}
                      </span>
                    </div>

                    {/* Big Clear Headline with iPhone typography (H1 untuk slide utama, H2 untuk slide berikutnya demi SEO semantik) */}
                    {idx === 0 ? (
                      <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.12]">
                        {s.headline}
                      </h1>
                    ) : (
                      <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.12]">
                        {s.headline}
                      </h2>
                    )}

                    {/* Orange Decorative Underline */}
                    <div className="w-16 h-1.5 bg-[#fa824b] rounded-full shadow-[0_0_12px_rgba(250,130,75,0.6)]" />

                    {/* Short Subhead with High Readability */}
                    <p className="text-base sm:text-xl text-slate-200 leading-relaxed max-w-2xl font-normal">
                      {s.subhead}
                    </p>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap items-center gap-4 pt-3">
                      <a
                        href={s.primaryHref}
                        className="px-8 py-4 rounded-full bg-[#fa824b] hover:bg-[#e5723b] text-white font-bold text-sm sm:text-base uppercase tracking-wider shadow-lg shadow-[#fa824b]/30 transition-all hover:-translate-y-0.5 active:translate-y-0"
                      >
                        {s.primaryCta} →
                      </a>

                      <a
                        href={s.secondaryHref}
                        className="px-7 py-4 rounded-full bg-white/10 hover:bg-white/20 text-white font-semibold text-sm sm:text-base border border-white/25 transition-all hover:-translate-y-0.5"
                      >
                        {s.secondaryCta}
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
                </div>
              );
            })}
          </div>

          {/* Right: Quick Impact Summary Box (Synchronized with active slide) */}
          <div className="hidden lg:block lg:col-span-4">
            <div className="rounded-3xl bg-slate-900/95 border border-slate-700 p-7 shadow-2xl text-left space-y-5 backdrop-blur-md">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-xs font-bold text-slate-400 font-mono">STATUS BISNIS ANDA</span>
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  ONLINE 24/7
                </span>
              </div>

              <div className="space-y-3">
                <div
                  className={`p-3.5 rounded-xl border transition-all duration-500 ${
                    currentSlide === 0
                      ? "bg-[#1853a7]/30 border-[#1853a7] shadow-[0_0_15px_rgba(24,83,167,0.3)] scale-[1.02]"
                      : "bg-slate-800/70 border-slate-700/70 opacity-70"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400">1. Website Resmi</span>
                    {currentSlide === 0 && (
                      <span className="text-[10px] font-bold text-blue-300 uppercase font-mono">Fokus</span>
                    )}
                  </div>
                  <div className="text-sm font-bold text-white mt-0.5">Tampil Profesional di Seluruh Dunia</div>
                </div>

                <div
                  className={`p-3.5 rounded-xl border transition-all duration-500 ${
                    currentSlide === 1
                      ? "bg-[#1853a7]/30 border-[#1853a7] shadow-[0_0_15px_rgba(24,83,167,0.3)] scale-[1.02]"
                      : "bg-slate-800/70 border-slate-700/70 opacity-70"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400">2. Pencarian Google</span>
                    {currentSlide === 1 && (
                      <span className="text-[10px] font-bold text-blue-300 uppercase font-mono">Fokus</span>
                    )}
                  </div>
                  <div className="text-sm font-bold text-white mt-0.5">Mudah Ditemukan Calon Pembeli</div>
                </div>

                <div
                  className={`p-3.5 rounded-xl border transition-all duration-500 ${
                    currentSlide === 2
                      ? "bg-[#1853a7]/30 border-[#1853a7] shadow-[0_0_15px_rgba(24,83,167,0.3)] scale-[1.02]"
                      : "bg-slate-800/70 border-slate-700/70 opacity-70"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400">3. Langsung ke WhatsApp</span>
                    {currentSlide === 2 && (
                      <span className="text-[10px] font-bold text-blue-300 uppercase font-mono">Fokus</span>
                    )}
                  </div>
                  <div className="text-sm font-bold text-white mt-0.5">Pengunjung Mudah Menghubungi</div>
                </div>
              </div>

              <div className="pt-2 text-center">
                <a
                  href="#konsultasi"
                  className="text-xs font-bold text-[#fa824b] hover:text-[#e5723b] transition-colors inline-flex items-center gap-1.5"
                >
                  <span>Minta Cek Gratis Bisnis Saya</span>
                  <span>→</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Controls: Progress Bars & Arrow Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-10 border-t border-slate-800/80">
          {/* Animated Slide Progress Bars */}
          <div className="flex items-center gap-3">
            {slides.map((s, idx) => {
              const isActive = currentSlide === idx;

              return (
                <button
                  key={s.id}
                  onClick={() => goToSlide(idx)}
                  className="group relative h-2.5 rounded-full overflow-hidden transition-all duration-300 focus:outline-none"
                  style={{ width: isActive ? "56px" : "24px" }}
                  aria-label={`Buka slide ${idx + 1}`}
                >
                  {/* Background Track */}
                  <div className="absolute inset-0 bg-white/20 group-hover:bg-white/30 rounded-full transition-colors" />

                  {/* Active Progress Filling Bar */}
                  {isActive ? (
                    <div
                      className="absolute inset-y-0 left-0 bg-[#fa824b] rounded-full"
                      style={{
                        width: "100%",
                        animation: isPaused ? "none" : `slideProgress ${SLIDE_DURATION}ms linear forwards`,
                      }}
                    />
                  ) : null}
                </button>
              );
            })}
          </div>

          {/* Interactive Prev / Next Arrow Pills */}
          <div className="flex items-center gap-2">
            <button
              onClick={prevSlide}
              aria-label="Slide sebelumnya"
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white flex items-center justify-center transition-all hover:scale-105 active:scale-95 shadow-sm"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <button
              onClick={nextSlide}
              aria-label="Slide selanjutnya"
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white flex items-center justify-center transition-all hover:scale-105 active:scale-95 shadow-sm"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Slide Progress Keyframe Style */}
      <style jsx>{`
        @keyframes slideProgress {
          from {
            width: 0%;
          }
          to {
            width: 100%;
          }
        }
      `}</style>
    </section>
  );
}
