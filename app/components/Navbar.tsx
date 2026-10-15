"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import LadiLogo from "./LadiLogo";

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Desktop dropdown states
  const [servicesDropdown, setServicesDropdown] = useState(false);
  const [companyDropdown, setCompanyDropdown] = useState(false);

  // Mobile accordion states
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [mobileCompanyOpen, setMobileCompanyOpen] = useState(false);

  const servicesTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const companyTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setServicesDropdown(false);
    setCompanyDropdown(false);
  }, [pathname]);

  const handleServicesEnter = () => {
    if (servicesTimeoutRef.current) clearTimeout(servicesTimeoutRef.current);
    setCompanyDropdown(false);
    setServicesDropdown(true);
  };

  const handleServicesLeave = () => {
    servicesTimeoutRef.current = setTimeout(() => {
      setServicesDropdown(false);
    }, 150);
  };

  const handleCompanyEnter = () => {
    if (companyTimeoutRef.current) clearTimeout(companyTimeoutRef.current);
    setServicesDropdown(false);
    setCompanyDropdown(true);
  };

  const handleCompanyLeave = () => {
    companyTimeoutRef.current = setTimeout(() => {
      setCompanyDropdown(false);
    }, 150);
  };

  const isServicesActive =
    pathname.startsWith("/pricing") ||
    pathname.startsWith("/builder") ||
    pathname.startsWith("/services") ||
    pathname.startsWith("/checkout");

  const isCompanyActive =
    pathname.startsWith("/about-us") ||
    pathname.startsWith("/blog") ||
    pathname.startsWith("/events");

  return (
    <header className="sticky top-0 z-50">
      <nav
        className={`w-full transition-all duration-300 ${
          scrolled
            ? "fasel-white-gradient-nav shadow-md border-b border-slate-200/80 py-2.5"
            : "bg-white/95 backdrop-blur-md border-b border-slate-200/60 py-3.5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            {/* Brand Logo */}
            <Link href="/" className="flex items-center shrink-0">
              <LadiLogo />
            </Link>

            {/* Desktop Navigation (Compact 5 Items) */}
            <div className="hidden lg:flex items-center gap-6 xl:gap-8">
              {/* 1. Beranda */}
              <Link
                href="/"
                className={`text-[13px] font-bold transition-colors whitespace-nowrap py-1 ${
                  pathname === "/" ? "text-[#1853a7]" : "text-slate-700 hover:text-[#1853a7]"
                }`}
              >
                Beranda
              </Link>

              {/* 2. Dropdown: Layanan & Harga */}
              <div
                className="relative py-1"
                onMouseEnter={handleServicesEnter}
                onMouseLeave={handleServicesLeave}
              >
                <button
                  type="button"
                  onClick={() => setServicesDropdown(!servicesDropdown)}
                  className={`text-[13px] font-bold transition-colors inline-flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                    isServicesActive ? "text-[#1853a7]" : "text-slate-700 hover:text-[#1853a7]"
                  }`}
                >
                  <span>Layanan &amp; Harga</span>
                  <svg
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${
                      servicesDropdown ? "rotate-180 text-[#fa824b]" : "text-slate-400"
                    }`}
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>

                {/* Dropdown Menu Box */}
                {servicesDropdown && (
                  <div className="absolute top-full left-0 w-72 pt-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xl p-2 space-y-1">
                      <Link
                        href="/pricing"
                        className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors group"
                      >
                        <span className="w-8 h-8 rounded-lg bg-blue-50 text-[#1853a7] flex items-center justify-center shrink-0 text-base group-hover:scale-105 transition-transform">
                          📦
                        </span>
                        <div>
                          <div className="text-xs font-extrabold text-slate-800 group-hover:text-[#1853a7] flex items-center gap-1.5">
                            <span>Paket Harga Website</span>
                          </div>
                          <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                            Paket resmi EXIST, RISE, RUN &amp; GUARD siap pakai
                          </p>
                        </div>
                      </Link>

                      <Link
                        href="/builder"
                        className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-orange-50/50 transition-colors group"
                      >
                        <span className="w-8 h-8 rounded-lg bg-orange-100/70 text-[#fa824b] flex items-center justify-center shrink-0 text-base group-hover:scale-105 transition-transform">
                          🧩
                        </span>
                        <div>
                          <div className="text-xs font-extrabold text-slate-800 group-hover:text-[#fa824b] flex items-center gap-1.5">
                            <span>Rakit Web (Pecahan LEGO)</span>
                            <span className="px-1.5 py-0.2 rounded bg-[#fa824b] text-white text-[9px] font-black uppercase">
                              Kustom
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                            Kalkulator modular: pilih framework, template &amp; hosting
                          </p>
                        </div>
                      </Link>

                      <Link
                        href="/services"
                        className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors group"
                      >
                        <span className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center shrink-0 text-base group-hover:scale-105 transition-transform">
                          ⚡
                        </span>
                        <div>
                          <div className="text-xs font-extrabold text-slate-800 group-hover:text-[#1853a7]">
                            Semua Layanan (DPS)
                          </div>
                          <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                            Infrastruktur website, Google Maps &amp; SEO bulanan
                          </p>
                        </div>
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* 3. Portofolio */}
              <Link
                href="/project"
                className={`text-[13px] font-bold transition-colors whitespace-nowrap py-1 ${
                  pathname === "/project" ? "text-[#1853a7]" : "text-slate-700 hover:text-[#1853a7]"
                }`}
              >
                Portofolio
              </Link>

              {/* 4. Dropdown: Tentang & Wawasan */}
              <div
                className="relative py-1"
                onMouseEnter={handleCompanyEnter}
                onMouseLeave={handleCompanyLeave}
              >
                <button
                  type="button"
                  onClick={() => setCompanyDropdown(!companyDropdown)}
                  className={`text-[13px] font-bold transition-colors inline-flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                    isCompanyActive ? "text-[#1853a7]" : "text-slate-700 hover:text-[#1853a7]"
                  }`}
                >
                  <span>Tentang &amp; Wawasan</span>
                  <svg
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${
                      companyDropdown ? "rotate-180 text-[#fa824b]" : "text-slate-400"
                    }`}
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>

                {/* Dropdown Box */}
                {companyDropdown && (
                  <div className="absolute top-full left-0 w-64 pt-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xl p-2 space-y-1">
                      <Link
                        href="/about-us"
                        className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors group"
                      >
                        <span className="w-8 h-8 rounded-lg bg-blue-50 text-[#1853a7] flex items-center justify-center shrink-0 text-base">
                          🏢
                        </span>
                        <div>
                          <div className="text-xs font-extrabold text-slate-800 group-hover:text-[#1853a7]">
                            Tentang Ladi
                          </div>
                          <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                            Visi, misi, dan tim konsultan digital kami
                          </p>
                        </div>
                      </Link>

                      <Link
                        href="/blog"
                        className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors group"
                      >
                        <span className="w-8 h-8 rounded-lg bg-orange-50 text-[#fa824b] flex items-center justify-center shrink-0 text-base">
                          📰
                        </span>
                        <div>
                          <div className="text-xs font-extrabold text-slate-800 group-hover:text-[#fa824b]">
                            Wawasan &amp; Artikel
                          </div>
                          <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                            Tips promosi, website, dan strategi digital UMKM
                          </p>
                        </div>
                      </Link>

                      <Link
                        href="/events"
                        className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors group"
                      >
                        <span className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 text-base">
                          🎟️
                        </span>
                        <div>
                          <div className="text-xs font-extrabold text-slate-800 group-hover:text-emerald-700">
                            Agenda Event
                          </div>
                          <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                            Workshop, meetup, dan pelatihan bisnis
                          </p>
                        </div>
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* 5. Kontak */}
              <Link
                href="/contact-us"
                className={`text-[13px] font-bold transition-colors whitespace-nowrap py-1 ${
                  pathname === "/contact-us" ? "text-[#1853a7]" : "text-slate-700 hover:text-[#1853a7]"
                }`}
              >
                Kontak
              </Link>
            </div>

            {/* Right: Clean, Well-Spaced Action Buttons */}
            <div className="hidden sm:flex items-center gap-3 pl-4 border-l border-slate-200/80 shrink-0">
              {/* Tombol Cek Pesanan (Rapih, Single-Line, Bersih) */}
              <Link
                href="/cek-pesanan"
                aria-label="Cek Status Pesanan"
                className="whitespace-nowrap inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-slate-100 hover:bg-slate-200/80 text-slate-700 hover:text-slate-900 font-bold text-xs transition-all border border-slate-200/60"
              >
                <svg
                  className="w-3.5 h-3.5 text-slate-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <circle cx="11" cy="11" r="8" strokeWidth="2.5" />
                  <path d="M21 21l-4.35-4.35" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
                <span>Cek Pesanan</span>
              </Link>

              {/* Tombol Utama: Audit Usaha Gratis */}
              <Link
                href="/contact-us"
                aria-label="Audit Usaha Gratis - Konsultasi Sekarang"
                className="whitespace-nowrap inline-flex items-center px-4.5 py-2 rounded-full bg-[#c2410c] hover:bg-[#9a3412] text-white font-extrabold text-xs uppercase tracking-wider shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 active:translate-y-0"
              >
                Audit Usaha Gratis
              </Link>
            </div>

            {/* Mobile Hamburger Toggle */}
            <button
              type="button"
              className="lg:hidden p-2 rounded-xl text-slate-700 hover:text-[#1853a7] hover:bg-slate-100 transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Buka Menu"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                {mobileMenuOpen ? (
                  <path d="M18 6L6 18M6 6l12 12" />
                ) : (
                  <path d="M4 12h16M4 6h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-b border-slate-200 shadow-xl px-4 py-5 space-y-3 max-h-[85vh] overflow-y-auto">
            {/* 1. Beranda */}
            <Link
              href="/"
              className="block px-3 py-2 text-sm font-bold text-slate-800 hover:text-[#1853a7] rounded-xl hover:bg-slate-50 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Beranda
            </Link>

            {/* 2. Layanan & Harga (Mobile Accordion) */}
            <div className="space-y-1">
              <button
                type="button"
                onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
                className="w-full flex items-center justify-between px-3 py-2 text-sm font-bold text-slate-800 hover:text-[#1853a7] rounded-xl hover:bg-slate-50 transition-colors"
              >
                <span>Layanan &amp; Harga</span>
                <span className={`text-xs text-slate-400 transition-transform ${mobileServicesOpen ? "rotate-180" : ""}`}>
                  ▼
                </span>
              </button>
              {mobileServicesOpen && (
                <div className="pl-4 pr-2 py-1 space-y-1 border-l-2 border-slate-100 ml-3">
                  <Link
                    href="/pricing"
                    className="block px-3 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:text-[#1853a7] hover:bg-slate-50"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    📦 Paket Harga Website
                  </Link>
                  <Link
                    href="/builder"
                    className="block px-3 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:text-[#fa824b] hover:bg-orange-50/50"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    🧩 Rakit Web (Pecahan LEGO)
                  </Link>
                  <Link
                    href="/services"
                    className="block px-3 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:text-[#1853a7] hover:bg-slate-50"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    ⚡ Semua Layanan Digital
                  </Link>
                </div>
              )}
            </div>

            {/* 3. Portofolio */}
            <Link
              href="/project"
              className="block px-3 py-2 text-sm font-bold text-slate-800 hover:text-[#1853a7] rounded-xl hover:bg-slate-50 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Portofolio
            </Link>

            {/* 4. Tentang & Wawasan (Mobile Accordion) */}
            <div className="space-y-1">
              <button
                type="button"
                onClick={() => setMobileCompanyOpen(!mobileCompanyOpen)}
                className="w-full flex items-center justify-between px-3 py-2 text-sm font-bold text-slate-800 hover:text-[#1853a7] rounded-xl hover:bg-slate-50 transition-colors"
              >
                <span>Tentang &amp; Wawasan</span>
                <span className={`text-xs text-slate-400 transition-transform ${mobileCompanyOpen ? "rotate-180" : ""}`}>
                  ▼
                </span>
              </button>
              {mobileCompanyOpen && (
                <div className="pl-4 pr-2 py-1 space-y-1 border-l-2 border-slate-100 ml-3">
                  <Link
                    href="/about-us"
                    className="block px-3 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:text-[#1853a7] hover:bg-slate-50"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    🏢 Tentang Ladi
                  </Link>
                  <Link
                    href="/blog"
                    className="block px-3 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:text-[#fa824b] hover:bg-slate-50"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    📰 Wawasan &amp; Artikel
                  </Link>
                  <Link
                    href="/events"
                    className="block px-3 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:text-emerald-700 hover:bg-slate-50"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    🎟️ Agenda Event
                  </Link>
                </div>
              )}
            </div>

            {/* 5. Kontak */}
            <Link
              href="/contact-us"
              className="block px-3 py-2 text-sm font-bold text-slate-800 hover:text-[#1853a7] rounded-xl hover:bg-slate-50 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Kontak
            </Link>

            {/* Action Buttons on Mobile */}
            <div className="pt-4 border-t border-slate-100 space-y-2.5">
              <Link
                href="/cek-pesanan"
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs uppercase tracking-wider transition-all"
                onClick={() => setMobileMenuOpen(false)}
              >
                <svg className="w-3.5 h-3.5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <circle cx="11" cy="11" r="8" strokeWidth="2.5" />
                  <path d="M21 21l-4.35-4.35" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
                <span>Cek Status Pesanan</span>
              </Link>

              <Link
                href="/contact-us"
                aria-label="Audit Usaha Gratis - Menu Navigasi"
                className="block w-full text-center py-3 rounded-2xl bg-[#c2410c] text-white font-extrabold text-xs uppercase tracking-wider shadow-md"
                onClick={() => setMobileMenuOpen(false)}
              >
                Audit Usaha Gratis
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
