import Link from "next/link";
import TopBar from "../components/TopBar";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import WhatsAppButton from "../components/WhatsAppButton";
import { getServicePackages, ServicePackage } from "@/app/lib/storage";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = {
  title: "Biaya & Skema Paket — Ladi (Layanan Digital)",
  description: "Skema biaya transparan Ladi untuk UMKM dan bisnis. Mulai dari audit gratis hingga ekosistem penuh.",
};

const defaultPackagesData: Partial<ServicePackage>[] = [
  {
    id: 1,
    name: "Paket EXIST",
    slug: "paket-exist",
    tag: "SOLUSI AWAL",
    subtitle: "Biar Bisnismu Muncul Resmi di Internet",
    price: "Rp 299.000",
    period: "Sekali Bayar · 5 Hari Kerja Siap",
    timeline: "5 Hari Kerja Siap",
    deliverables: "[\"Landing Page Cepat 1 Halaman\",\"Setup & Verifikasi Google Business Profile\",\"Tombol Order WhatsApp Otomatis\",\"Aktif & Siap Pakai dalam 5 Hari Kerja\",\"Konsultasi & Audit Digital 10 Poin Gratis\"]",
    cta_whatsapp_text: "Halo Ladi, saya tertarik dengan Paket EXIST (Mulai Rp 299.000). Biar bisnismu muncul resmi di internet.",
    badge_popular: 0,
    status: "active",
  },
  {
    id: 2,
    name: "Paket RISE",
    slug: "paket-rise",
    tag: "BISNIS BERKEMBANG",
    subtitle: "Profil Lengkap & Profesional untuk Bisnis Jasa / Toko",
    price: "Rp 999.000",
    period: "Sekali Bayar · 7–10 Hari Kerja",
    timeline: "7–10 Hari Kerja",
    deliverables: "[\"Website Lengkap 5–7 Halaman (Menu, Galeri, Profil)\",\"Terhubung Google Analytics (Pantau Pengunjung)\",\"Desain Khusus Brand Anda (Responsif di HP)\",\"Gratis Laporan Performa Perdana (30 Hari)\",\"Setup & Verifikasi Google Business Profile\",\"Konsultasi & Audit Digital 10 Poin Gratis\"]",
    cta_whatsapp_text: "Halo Ladi, saya tertarik dengan Paket RISE (Mulai Rp 999.000). Saya ingin profil lengkap & profesional untuk bisnis saya.",
    badge_popular: 1,
    status: "active",
  },
  {
    id: 3,
    name: "Paket RUN",
    slug: "paket-run",
    tag: "SOLUSI MANDIRI",
    subtitle: "Sistem Toko Online & Booking Mandiri",
    price: "Rp 2.499.000",
    period: "Sekali Bayar · 10–14 Hari Kerja",
    timeline: "10–14 Hari Kerja",
    deliverables: "[\"Katalog Produk / Sistem Booking Terpadu\",\"Integrasi Pembayaran QRIS Otomatis\",\"WhatsApp Auto-Reply Template\",\"Siap Jualan Mandiri 24 Jam Nonstop\",\"Semua Fitur Paket RISE Lengkap\"]",
    cta_whatsapp_text: "Halo Ladi, saya tertarik dengan Paket RUN (Mulai Rp 2.499.000). Saya ingin website toko online & booking mandiri dengan QRIS.",
    badge_popular: 0,
    status: "active",
  },
  {
    id: 4,
    name: "Paket GUARD",
    slug: "paket-guard",
    tag: "PAKET SPESIAL",
    subtitle: "Satpam Digital Bisnismu",
    price: "Rp 300rb – 500rb",
    period: "/ bulan · Dipantau 24 Jam Nonstop",
    timeline: "Dipantau 24 Jam Nonstop",
    deliverables: "[\"Website dipantau 24 jam\",\"Bebas error & maintenance rutin\",\"Update konten rutin\",\"Laporan Pengunjung dikirim tiap bulan ke WhatsApp\",\"Konsultasi & Audit Digital 10 Poin Gratis\"]",
    cta_whatsapp_text: "Halo Ladi, saya tertarik berlangganan Paket GUARD (Mulai Rp 300.000 – 500.000 / bulan). Saya ingin website tetap aman dan terawat.",
    badge_popular: 0,
    status: "active",
  },
];

export default async function PricingPage() {
  const dbPackages = await getServicePackages();
  const displayPackages = dbPackages && dbPackages.length > 0 ? dbPackages : defaultPackagesData;

  return (
    <>
      <TopBar />
      <Navbar />

      <main className="bg-[#f8fafc] text-[#0f172a]">
        {/* Header */}
        <section className="bg-[#0f172a] text-white py-16 lg:py-20 border-b border-slate-800">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <span className="font-mono text-xs text-[#fa824b] font-bold uppercase tracking-wider block mb-2">
              SKEMA INVESTASI TRANSPARAN
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
              Investasi Jelas, Tanpa Biaya Tersembunyi
            </h1>
            <p className="text-slate-300 text-base sm:text-lg mt-3 max-w-2xl mx-auto">
              Sistem DP 50% di awal, dan pelunasan hanya dilakukan setelah Anda melihat hasil demonya.
            </p>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="py-12 md:py-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            {/* Banner Custom Builder / Pecahan */}
            <div className="rounded-3xl bg-gradient-to-r from-[#0f172a] via-[#1e293b] to-[#0f172a] text-white p-6 sm:p-8 border border-slate-700/80 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
              <div className="space-y-2 text-center md:text-left z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#fa824b]/20 text-[#fa824b] text-xs font-bold font-mono uppercase tracking-wider">
                  <span>🧩 Ingin Sistem Pecahan (LEGO)?</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  Rakit Website Impianmu Sendiri Tanpa Terikat Paket
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
                  Bebas pilih framework teknologi (HTML, PHP, Laravel, Next.js), 23 template Envato terverifikasi, domain, durasi hosting, dan add-ons pelengkap.
                </p>
              </div>
              <div className="shrink-0 z-10">
                <Link
                  href="/builder"
                  className="px-6 py-3.5 rounded-2xl bg-[#fa824b] hover:bg-[#e5723b] text-white font-extrabold text-xs sm:text-sm uppercase tracking-wider shadow-lg hover:shadow-xl transition-all inline-flex items-center gap-2"
                >
                  <span>Coba Kalkulator &amp; Rakit Web</span>
                  <span>→</span>
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
              {displayPackages.map((pkg) => {
                let delivs: string[] = [];
                try {
                  delivs = JSON.parse(pkg.deliverables || "[]");
                  if (!Array.isArray(delivs)) delivs = pkg.deliverables ? [pkg.deliverables] : [];
                } catch {
                  delivs = pkg.deliverables ? pkg.deliverables.split("\n").filter(Boolean) : [];
                }

                const priceStr = pkg.price || "0";
                const isPopular = Boolean(pkg.badge_popular);
                const waMsg =
                  pkg.cta_whatsapp_text ||
                  `Halo Ladi, saya tertarik dengan ${pkg.name || "Paket"} (${priceStr}). ${pkg.subtitle || ""}`;
                const ctaBtnText =
                  pkg.slug === "paket-guard" ? "⚡ Pasang Penjaga di Web →" : "⚡ Pesan & Bayar di Web →";

                return (
                  <div
                    key={pkg.id}
                    className={`p-7 rounded-3xl bg-white corporate-card flex flex-col justify-between ${
                      isPopular
                        ? "border-2 border-[#1853a7] shadow-xl relative"
                        : "border border-slate-200 shadow-sm"
                    }`}
                  >
                    {isPopular && (
                      <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#fa824b] text-white text-[10px] font-bold uppercase tracking-wider px-3.5 py-1 rounded-full whitespace-nowrap shadow-sm">
                        ⭐ PALING POPULER
                      </span>
                    )}

                    <div className="space-y-4">
                      <div>
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider block ${
                            isPopular ? "text-[#fa824b]" : "text-slate-500"
                          }`}
                        >
                          {pkg.tag || "PAKET RESMI"}
                        </span>
                        <h3 className="text-xl font-extrabold text-slate-900 mt-1">{pkg.name}</h3>
                        {pkg.subtitle && (
                          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                            &ldquo;{pkg.subtitle}&rdquo;
                          </p>
                        )}
                      </div>

                      <div className="py-4 border-y border-slate-100">
                        <span className="text-[11px] text-slate-600 font-medium block">
                          {pkg.slug === "paket-guard" ? "Mulai" : "Mulai dari"}
                        </span>
                        <div
                          className={`${
                            pkg.slug === "paket-guard" ? "text-2xl" : "text-3xl"
                          } font-black text-[#1853a7]`}
                        >
                          {priceStr.startsWith("Rp") ? priceStr : `Rp ${priceStr}`}
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          {pkg.period || pkg.timeline || "Sekali Bayar"}
                        </div>
                      </div>

                      <ul className="space-y-2 text-xs text-slate-600">
                        {delivs.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-1.5">
                            <span className="text-emerald-600 font-bold">✓</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="pt-6 space-y-2">
                      <Link
                        href={`/checkout/${pkg.slug}`}
                        className="block w-full text-center py-2.5 rounded-full bg-[#fa824b] hover:bg-[#e5723b] text-white font-bold text-xs uppercase tracking-wider shadow-md transition-all"
                        aria-label={`Pesan ${pkg.name} langsung di web`}
                      >
                        {ctaBtnText}
                      </Link>
                      <a
                        href={`https://wa.me/6282112477119?text=${encodeURIComponent(waMsg)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full text-center py-2 rounded-full bg-slate-50 hover:bg-slate-100 text-slate-600 font-semibold text-[11px] transition-all"
                        aria-label={`Tanya via WhatsApp tentang ${pkg.name}`}
                      >
                        Tanya via WA 💬
                      </a>
                      <Link
                        href={`/services/${pkg.slug}`}
                        className="block text-center text-[10px] font-bold text-slate-400 hover:text-slate-600 transition-colors"
                      >
                        Lihat Rincian Lengkap →
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Note on Free Audit */}
            <div className="mt-14 p-6 rounded-2xl bg-white border border-slate-200 text-center max-w-xl mx-auto space-y-2">
              <div className="text-sm font-bold text-slate-900">Belum Yakin Mau Pilih Paket yang Mana?</div>
              <p className="text-xs text-slate-600">
                Mulai dulu dengan <strong>Digital Audit Gratis 15 Menit</strong>. Kami beri tahu apa yang benar-benar dibutuhkan usaha Anda tanpa buang biaya berlebih.
              </p>
              <div className="pt-2">
                <Link href="/contact-us" className="text-xs font-bold text-[#c2410c] hover:underline" aria-label="Minta Audit Usaha Gratis Sekarang di kontak Ladi">
                  Minta Audit Usaha Gratis Sekarang →
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <WhatsAppButton />
    </>
  );
}
