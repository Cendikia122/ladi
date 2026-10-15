import Link from "next/link";
import TopBar from "../components/TopBar";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import WhatsAppButton from "../components/WhatsAppButton";

export const metadata = {
  title: "Biaya & Skema Paket — Ladi (Layanan Digital)",
  description: "Skema biaya transparan Ladi untuk UMKM dan bisnis. Mulai dari audit gratis hingga ekosistem penuh.",
};

export default function PricingPage() {
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
              {/* EXIST */}
              <div className="p-7 rounded-3xl bg-white border border-slate-200 shadow-sm corporate-card flex flex-col justify-between">
                <div className="space-y-4">
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                      SOLUSI AWAL
                    </span>
                    <h3 className="text-xl font-extrabold text-slate-900 mt-1">Paket EXIST</h3>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      &ldquo;Biar Bisnismu Muncul Resmi di Internet&rdquo;
                    </p>
                  </div>

                  <div className="py-4 border-y border-slate-100">
                    <span className="text-[11px] text-slate-600 font-medium block">Mulai dari</span>
                    <div className="text-3xl font-black text-[#1853a7]">Rp 299.000</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">Sekali Bayar · 5 Hari Kerja Siap</div>
                  </div>

                  <ul className="space-y-2 text-xs text-slate-600">
                    <li className="flex items-start gap-1.5"><span className="text-emerald-600 font-bold">✓</span> <span>Landing Page Cepat 1 Halaman</span></li>
                    <li className="flex items-start gap-1.5"><span className="text-emerald-600 font-bold">✓</span> <span>Setup & Verifikasi Google Business Profile</span></li>
                    <li className="flex items-start gap-1.5"><span className="text-emerald-600 font-bold">✓</span> <span>Tombol Order WhatsApp Otomatis</span></li>
                    <li className="flex items-start gap-1.5"><span className="text-emerald-600 font-bold">✓</span> <span>Aktif & Siap Pakai dalam 5 Hari Kerja</span></li>
                    <li className="flex items-start gap-1.5"><span className="text-emerald-600 font-bold">✓</span> <span>Konsultasi & Audit Digital 10 Poin Gratis</span></li>
                  </ul>
                </div>

                <div className="pt-6 space-y-2">
                  <Link
                    href="/checkout/paket-exist"
                    className="block w-full text-center py-2.5 rounded-full bg-[#fa824b] hover:bg-[#e5723b] text-white font-bold text-xs uppercase tracking-wider shadow-md transition-all"
                    aria-label="Pesan Paket EXIST langsung di web"
                  >
                    ⚡ Pesan & Bayar di Web →
                  </Link>
                  <a
                    href="https://wa.me/6282112477119?text=Halo+Ladi%2C+saya+tertarik+dengan+Paket+EXIST+(Mulai+Rp+299.000).+Biar+bisnismu+muncul+resmi+di+internet."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full text-center py-2 rounded-full bg-slate-50 hover:bg-slate-100 text-slate-600 font-semibold text-[11px] transition-all"
                    aria-label="Tanya via WhatsApp tentang Paket EXIST"
                  >
                    Tanya via WA 💬
                  </a>
                  <Link
                    href="/services/paket-exist"
                    className="block text-center text-[10px] font-bold text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    Lihat Rincian Lengkap →
                  </Link>
                </div>
              </div>

              {/* RISE */}
              <div className="p-7 rounded-3xl bg-white border-2 border-[#1853a7] shadow-xl corporate-card flex flex-col justify-between relative">
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#fa824b] text-white text-[10px] font-bold uppercase tracking-wider px-3.5 py-1 rounded-full whitespace-nowrap shadow-sm">
                  ⭐ PALING POPULER
                </span>
                <div className="space-y-4">
                  <div>
                    <span className="text-[10px] font-bold text-[#fa824b] uppercase tracking-wider block">
                      BISNIS BERKEMBANG
                    </span>
                    <h3 className="text-xl font-extrabold text-slate-900 mt-1">Paket RISE</h3>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      &ldquo;Profil Lengkap & Profesional untuk Bisnis Jasa / Toko&rdquo;
                    </p>
                  </div>

                  <div className="py-4 border-y border-slate-100">
                    <span className="text-[11px] text-slate-600 font-medium block">Mulai dari</span>
                    <div className="text-3xl font-black text-[#1853a7]">Rp 999.000</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">Sekali Bayar · 7–10 Hari Kerja</div>
                  </div>

                  <ul className="space-y-2 text-xs text-slate-600">
                    <li className="flex items-start gap-1.5"><span className="text-emerald-600 font-bold">✓</span> <span>Website Lengkap 5–7 Halaman (Menu, Galeri, Profil)</span></li>
                    <li className="flex items-start gap-1.5"><span className="text-emerald-600 font-bold">✓</span> <span>Terhubung Google Analytics (Pantau Pengunjung)</span></li>
                    <li className="flex items-start gap-1.5"><span className="text-emerald-600 font-bold">✓</span> <span>Desain Khusus Brand Anda (Responsif di HP)</span></li>
                    <li className="flex items-start gap-1.5"><span className="text-emerald-600 font-bold">✓</span> <span>Gratis Laporan Performa Perdana (30 Hari)</span></li>
                    <li className="flex items-start gap-1.5"><span className="text-emerald-600 font-bold">✓</span> <span>Setup & Verifikasi Google Business Profile</span></li>
                    <li className="flex items-start gap-1.5"><span className="text-emerald-600 font-bold">✓</span> <span>Konsultasi & Audit Digital 10 Poin Gratis</span></li>
                  </ul>
                </div>

                <div className="pt-6 space-y-2">
                  <Link
                    href="/checkout/paket-rise"
                    className="block w-full text-center py-2.5 rounded-full bg-[#fa824b] hover:bg-[#e5723b] text-white font-bold text-xs uppercase tracking-wider shadow-md transition-all"
                    aria-label="Pesan Paket RISE langsung di web"
                  >
                    ⚡ Pesan & Bayar di Web →
                  </Link>
                  <a
                    href="https://wa.me/6282112477119?text=Halo+Ladi%2C+saya+tertarik+dengan+Paket+RISE+(Mulai+Rp+999.000).+Saya+ingin+profil+lengkap+%26+profesional+untuk+bisnis+saya."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full text-center py-2 rounded-full bg-slate-50 hover:bg-slate-100 text-slate-600 font-semibold text-[11px] transition-all"
                    aria-label="Tanya via WhatsApp tentang Paket RISE"
                  >
                    Tanya via WA 💬
                  </a>
                  <Link
                    href="/services/paket-rise"
                    className="block text-center text-[10px] font-bold text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    Lihat Rincian Lengkap →
                  </Link>
                </div>
              </div>

              {/* RUN */}
              <div className="p-7 rounded-3xl bg-white border border-slate-200 shadow-sm corporate-card flex flex-col justify-between">
                <div className="space-y-4">
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                      SOLUSI MANDIRI
                    </span>
                    <h3 className="text-xl font-extrabold text-slate-900 mt-1">Paket RUN</h3>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      &ldquo;Sistem Toko Online & Booking Mandiri&rdquo;
                    </p>
                  </div>

                  <div className="py-4 border-y border-slate-100">
                    <span className="text-[11px] text-slate-600 font-medium block">Mulai dari</span>
                    <div className="text-3xl font-black text-[#1853a7]">Rp 2.499.000</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">Sekali Bayar · 10–14 Hari Kerja</div>
                  </div>

                  <ul className="space-y-2 text-xs text-slate-600">
                    <li className="flex items-start gap-1.5"><span className="text-emerald-600 font-bold">✓</span> <span>Katalog Produk / Sistem Booking Terpadu</span></li>
                    <li className="flex items-start gap-1.5"><span className="text-emerald-600 font-bold">✓</span> <span>Integrasi Pembayaran QRIS Otomatis</span></li>
                    <li className="flex items-start gap-1.5"><span className="text-emerald-600 font-bold">✓</span> <span>WhatsApp Auto-Reply Template</span></li>
                    <li className="flex items-start gap-1.5"><span className="text-emerald-600 font-bold">✓</span> <span>Siap Jualan Mandiri 24 Jam Nonstop</span></li>
                    <li className="flex items-start gap-1.5"><span className="text-emerald-600 font-bold">✓</span> <span>Semua Fitur Paket RISE Lengkap</span></li>
                  </ul>
                </div>

                <div className="pt-6 space-y-2">
                  <Link
                    href="/checkout/paket-run"
                    className="block w-full text-center py-2.5 rounded-full bg-[#fa824b] hover:bg-[#e5723b] text-white font-bold text-xs uppercase tracking-wider shadow-md transition-all"
                    aria-label="Pesan Paket RUN langsung di web"
                  >
                    ⚡ Pesan & Bayar di Web →
                  </Link>
                  <a
                    href="https://wa.me/6282112477119?text=Halo+Ladi%2C+saya+tertarik+dengan+Paket+RUN+(Mulai+Rp+2.499.000).+Saya+ingin+website+toko+online+%26+booking+mandiri+dengan+QRIS."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full text-center py-2 rounded-full bg-slate-50 hover:bg-slate-100 text-slate-600 font-semibold text-[11px] transition-all"
                    aria-label="Tanya via WhatsApp tentang Paket RUN"
                  >
                    Tanya via WA 💬
                  </a>
                  <Link
                    href="/services/paket-run"
                    className="block text-center text-[10px] font-bold text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    Lihat Rincian Lengkap →
                  </Link>
                </div>
              </div>

              {/* GUARD */}
              <div className="p-7 rounded-3xl bg-white border border-slate-200 shadow-sm corporate-card flex flex-col justify-between">
                <div className="space-y-4">
                  <div>
                    <span className="text-[10px] font-bold text-[#fa824b] uppercase tracking-wider block">
                      PAKET SPESIAL
                    </span>
                    <h3 className="text-xl font-extrabold text-slate-900 mt-1">Paket GUARD</h3>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      &ldquo;Satpam Digital Bisnismu&rdquo;
                    </p>
                  </div>

                  <div className="py-4 border-y border-slate-100">
                    <span className="text-[11px] text-slate-600 font-medium block">Mulai</span>
                    <div className="text-2xl font-black text-[#1853a7]">Rp 300rb – 500rb</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">/ bulan · Dipantau 24 Jam Nonstop</div>
                  </div>

                  <ul className="space-y-2 text-xs text-slate-600">
                    <li className="flex items-start gap-1.5"><span className="text-emerald-600 font-bold">✓</span> <span>Website dipantau 24 jam</span></li>
                    <li className="flex items-start gap-1.5"><span className="text-emerald-600 font-bold">✓</span> <span>Bebas error & maintenance rutin</span></li>
                    <li className="flex items-start gap-1.5"><span className="text-emerald-600 font-bold">✓</span> <span>Update konten rutin</span></li>
                    <li className="flex items-start gap-1.5"><span className="text-emerald-600 font-bold">✓</span> <span>Laporan Pengunjung dikirim tiap bulan ke WhatsApp</span></li>
                    <li className="flex items-start gap-1.5"><span className="text-emerald-600 font-bold">✓</span> <span>Konsultasi & Audit Digital 10 Poin Gratis</span></li>
                  </ul>
                </div>

                <div className="pt-6 space-y-2">
                  <Link
                    href="/checkout/paket-guard"
                    className="block w-full text-center py-2.5 rounded-full bg-[#fa824b] hover:bg-[#e5723b] text-white font-bold text-xs uppercase tracking-wider shadow-md transition-all"
                    aria-label="Langganan Paket GUARD langsung di web"
                  >
                    ⚡ Pasang Penjaga di Web →
                  </Link>
                  <a
                    href="https://wa.me/6282112477119?text=Halo+Ladi%2C+saya+tertarik+berlangganan+Paket+GUARD+(Mulai+Rp+300.000+%E2%80%93+500.000+/+bulan).+Saya+ingin+website+tetap+aman+dan+terawat."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full text-center py-2 rounded-full bg-slate-50 hover:bg-slate-100 text-slate-600 font-semibold text-[11px] transition-all"
                    aria-label="Tanya via WhatsApp tentang Paket GUARD"
                  >
                    Tanya via WA 💬
                  </a>
                  <Link
                    href="/services/paket-guard"
                    className="block text-center text-[10px] font-bold text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    Lihat Rincian Lengkap →
                  </Link>
                </div>
              </div>
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
