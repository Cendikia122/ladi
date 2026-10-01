"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import LadiLogo from "./LadiLogo";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "/", label: "Beranda" },
    { href: "/about-us", label: "Tentang Kami" },
    { href: "/services", label: "Layanan" },
    { href: "/project", label: "Portofolio" },
    { href: "/pricing", label: "Paket Harga" },
    { href: "/events", label: "Event" },
    { href: "/blog", label: "Wawasan" },
    { href: "/contact-us", label: "Kontak" },
  ];

  return (
    <header className="sticky top-0 z-50">
      <nav
        className={`w-full transition-all duration-300 ${
          scrolled
            ? "fasel-white-gradient-nav shadow-md border-b border-slate-200/80 py-3"
            : "bg-white/95 backdrop-blur-md border-b border-slate-200/60 py-4"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Brand Logo */}
            <Link href="/" className="flex items-center">
              <LadiLogo />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-5 xl:gap-6">
              {navLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-[13px] font-semibold text-slate-700 hover:text-[#1853a7] transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-[#fa824b] hover:after:w-full after:transition-all"
                >
                  {item.label}
                </Link>
              ))}
            </div>

            {/* Right: CTA Pill Button */}
            <div className="hidden sm:flex items-center gap-3">
              <Link
                href="/contact-us"
                className="px-5 py-2.5 rounded-full bg-[#fa824b] hover:bg-[#e5723b] text-white font-bold text-xs uppercase tracking-wider shadow-md shadow-[#fa824b]/20 hover:shadow-lg transition-all hover:-translate-y-0.5 active:translate-y-0"
              >
                Audit Usaha Gratis
              </Link>
            </div>

            {/* Mobile Hamburger Toggle */}
            <button
              type="button"
              className="lg:hidden p-2 rounded-lg text-slate-700 hover:text-[#1853a7] hover:bg-slate-100 transition-colors"
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
          <div className="lg:hidden bg-white border-b border-slate-200 shadow-xl px-4 py-4 space-y-2">
            {navLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block px-3 py-2.5 rounded-lg text-sm font-semibold text-slate-700 hover:text-[#1853a7] hover:bg-slate-50 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <div className="pt-2">
              <Link
                href="/contact-us"
                className="block w-full text-center py-3 rounded-full bg-[#fa824b] text-white font-bold text-xs uppercase tracking-wider shadow-md shadow-[#fa824b]/25"
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
