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
    tag: "SOLUSI AWAL · PEMULA DIGITAL",
    subtitle: "Biar Bisnismu Muncul Resmi di Internet",
    price: "Rp 500.000",
    period: "Sekali Bayar · 5–7 Hari Kerja",
    timeline: "5–7 Hari Kerja",
    deliverables: JSON.stringify([
      "Setup & Optimasi Google Business Profile (nama, alamat, jam buka, kategori, foto)",
      "Landing Page 1 Halaman (Responsif Mobile-First, cepat dibuka di HP)",
      "Integrasi Tombol WhatsApp Langsung (wa.me) dengan teks sapaan otomatis",
      "Basic SEO On-Page (Meta Title, Description, & struktur Heading H1–H2)",
      "Maksimal 1x Revisi Minor",
      "Simulasi Hemat: Jika dirakit eceran di Builder = Rp 650.000 (Anda Hemat Rp 150.000)",
    ]),
    cta_whatsapp_text: "Halo Ladi, saya tertarik dengan Paket EXIST (Rp 500.000 Sekali Bayar). Saya ingin bisnismu muncul resmi di internet.",
    badge_popular: 0,
    status: "active",
  },
  {
    id: 2,
    name: "Paket RISE",
    slug: "paket-rise",
    tag: "PALING DIREKOMENDASIKAN",
    subtitle: "Profil Lengkap & Profesional untuk Bisnis Jasa / Toko",
    price: "Rp 1.500.000",
    period: "Sekali Bayar · 10–14 Hari Kerja",
    timeline: "10–14 Hari Kerja",
    deliverables: JSON.stringify([
      "Semua fitur dari Paket EXIST",
      "Website Profesional 5–7 Halaman (Beranda, Tentang Usaha, Layanan & Harga, Galeri, Kontak & Peta)",
      "Optimasi Titik Google Maps Lokal (akurasi pin, kata kunci lokal Bogor/Depok, & panduan 5 ulasan pertama)",
      "SEO On-Page Lengkap di semua halaman + Schema.org LocalBusiness & Sitemap otomatis",
      "Setup Google Analytics 4 (GA4) & Google Search Console (beserta panduan membaca data)",
      "Laporan Dampak Digital Perdana (dikirimkan 30 hari setelah peluncuran via WhatsApp)",
      "Garansi 1x Revisi Minor per bulan selama 3 bulan pertama",
      "Simulasi Hemat: Jika dirakit eceran di Builder = Rp 1.800.000 (Anda Hemat Rp 300.000)",
    ]),
    cta_whatsapp_text: "Halo Ladi, saya tertarik dengan Paket RISE (Rp 1.500.000 Sekali Bayar). Saya ingin profil lengkap & dominasi pencarian lokal Google.",
    badge_popular: 1,
    status: "active",
  },
  {
    id: 3,
    name: "Paket RUN",
    slug: "paket-run",
    tag: "SISTEM BISNIS MANDIRI",
    subtitle: "Sistem Toko Online & Booking Jadwal Otomatis",
    price: "Rp 3.500.000",
    period: "Sekali Bayar · 18–21 Hari Kerja",
    timeline: "18–21 Hari Kerja",
    deliverables: JSON.stringify([
      "Semua fitur dari Paket RISE",
      "Pilih Salah Satu: Mini Toko Online (Katalog s/d 20 Produk + Checkout WA/QRIS) ATAU Sistem Booking Jadwal Online",
      "Integrasi Pembayaran QRIS Resmi (Akun merchant dibuat 100% atas nama rekening Anda)",
      "Setup Template WhatsApp Auto-Reply untuk membalas pelanggan di luar jam kerja",
      "Laporan Dampak Digital Bulanan selama 3 bulan pertama berturut-turut",
      "Konsultasi Strategi Digital 1-on-1 selama 60 menit (arah konten, kata kunci & promosi lokal)",
      "Simulasi Hemat: Jika dirakit eceran di Builder = Rp 3.950.000 (Anda Hemat Rp 450.000)",
    ]),
    cta_whatsapp_text: "Halo Ladi, saya tertarik dengan Paket RUN (Rp 3.500.000 Sekali Bayar). Saya ingin sistem toko online & booking mandiri dengan QRIS otomatis.",
    badge_popular: 0,
    status: "active",
  },
  {
    id: 4,
    name: "Paket GUARD",
    slug: "paket-guard",
    tag: "JASA MAINTENANCE BISNIS DI INTERNET",
    subtitle: "Bukan Penjualan Web Baru — Mitra Pemeliharaan & Satpam Digital",
    price: "Rp 500.000",
    period: "/ bulan · Bundel Lengkap (Atau rakit mulai Rp 300rb)",
    timeline: "Aktif Langsung dalam 24 Jam",
    deliverables: JSON.stringify([
      "Pemeliharaan Keamanan Website, Sertifikat HTTPS/SSL, Backup Rutin, & Cek Tautan Rusak (Nilai eceran: Rp 150rb/bln)",
      "Update Konten, Daftar Harga, Produk, atau Foto Baru 1–2x/bln via WhatsApp tanpa repot login panel admin (Nilai eceran: Rp 200rb/bln)",
      "Laporan Dampak Digital Bulanan dikirim setiap tanggal 5 via WA (Nilai eceran: Rp 150rb/bln)",
      "Penyesuaian Desain Minor (maks. 1 jam/bln) & Prioritas Antrean Respons Teknis (Nilai eceran: Rp 100rb/bln)",
      "Hemat Rp 100.000/bln dari harga modul eceran total Rp 600.000/bln",
    ]),
    cta_whatsapp_text: "Halo Ladi, saya tertarik berlangganan Jasa Maintenance Bisnis di Internet (Paket GUARD Rp 500.000/bln). Saya ingin aset digital usaha saya tetap terawat dan aman.",
    badge_popular: 0,
    status: "active",
  },
];

export default async function PricingPage() {
  const dbPackages = await getServicePackages();
  // Gunakan data resmi blueprint terstandarisasi sebagai basis tampilan utama
  const displayPackages = defaultPackagesData;

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
              Sistem DP 50% di awal, dan pelunasan hanya dilakukan setelah Anda melihat hasil demonya dan siap tayang.
            </p>
          </div>
        </section>

        {/* Pricing Content */}
        <section className="py-12 md:py-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            {/* Banner Kail Utama: Audit Gratis 10 Poin */}
            <div className="rounded-3xl bg-gradient-to-br from-blue-900 via-[#1853a7] to-indigo-900 text-white p-7 sm:p-10 border-2 border-blue-400/40 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-3 text-center md:text-left z-10 max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-orange-200 text-xs font-bold font-mono uppercase tracking-wider">
                  <span>🎯 Mulai Tanpa Risiko</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-snug">
                  Klaim Digital Presence Audit 10 Poin GRATIS (Selesai 15–20 Menit)
                </h2>
                <p className="text-xs sm:text-sm text-blue-100 leading-relaxed">
                  Belum yakin paket mana yang cocok? Tim kami akan memeriksa Google Maps, kecepatan akses HP, dan visibilitas usaha Anda secara gratis. Anda akan menerima Laporan PDF lengkap berisi skor 0–100 sebelum memutuskan apapun.
                </p>
              </div>
              <div className="shrink-0 z-10 w-full md:w-auto">
                <a
                  href="https://wa.me/6282112477119?text=Halo%20Ladi,%20saya%20mau%20klaim%20Audit%20Digital%20Gratis%20untuk%20usaha%20saya."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full md:w-auto px-7 py-4 rounded-2xl bg-[#fa824b] hover:bg-[#e5723b] text-white font-extrabold text-xs sm:text-sm uppercase tracking-wider shadow-xl hover:shadow-2xl transition-all inline-flex items-center justify-center gap-2"
                >
                  <span>Klaim Audit Gratis via WhatsApp</span>
                  <span>→</span>
                </a>
              </div>
            </div>

            {/* Banner Custom Builder / Pecahan */}
            <div className="rounded-3xl bg-gradient-to-r from-[#0f172a] via-[#1e293b] to-[#0f172a] text-white p-6 sm:p-8 border border-slate-700/80 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
              <div className="space-y-2 text-center md:text-left z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#fa824b]/20 text-[#fa824b] text-xs font-bold font-mono uppercase tracking-wider">
                  <span>🧩 Ingin Sistem Pecahan (Rakit Sendiri)?</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  Rakit Kebutuhan Website Impianmu Sendiri Tanpa Terikat Paket
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
                  Bebas tentukan skala halaman (Landing Page, Profil Usaha, atau Toko Online/Booking), gaya desain dari Katalog Referensi Ladi, domain resmi, dan add-ons pendatang pelanggan sesuai budget.
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

            {/* Pricing Cards Grid */}
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
                  pkg.slug === "paket-guard" ? "🧩 Rakit Maintenance Bisnis →" : "⚡ Pesan & Bayar di Web →";
                const ctaBtnHref =
                  pkg.slug === "paket-guard" ? `/services/paket-guard#rakit-guard` : `/checkout/${pkg.slug}`;

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
                        ⭐ PALING DIREKOMENDASIKAN
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
                          Investasi
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

                        {pkg.slug === "paket-exist" && (
                          <div className="mt-3 p-2.5 rounded-xl bg-orange-50 border border-orange-200 text-[11px] text-orange-950 font-medium leading-snug">
                            🎁 <strong>Promo Perdana:</strong> Kuota terbatas portofolio gratis (Rp 0 dengan subdomain) untuk 3 UMKM terpilih atau harga promo Rp 300.000. Hubungi kami untuk cek kuota!
                          </div>
                        )}
                      </div>

                      <ul className="space-y-2.5 text-xs text-slate-600">
                        {delivs.map((item, idx) => {
                          const isSavings = item.startsWith("Simulasi Hemat:") || item.startsWith("Hemat ");
                          return (
                            <li
                              key={idx}
                              className={`flex items-start gap-1.5 ${
                                isSavings
                                  ? "p-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950 font-bold"
                                  : ""
                              }`}
                            >
                              <span className="text-emerald-600 font-bold shrink-0">
                                {isSavings ? "💡" : "✓"}
                              </span>
                              <span>{item}</span>
                            </li>
                          );
                        })}
                      </ul>
                    </div>

                    <div className="pt-6 space-y-2">
                      <Link
                        href={ctaBtnHref}
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

            {/* Catatan Transparansi Kepemilikan Aset & Biaya Domain */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-sm sm:text-base">
                <span>🛡️</span>
                <span>Catatan Transparansi Kepemilikan Aset &amp; Biaya Domain Resmi</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-600 leading-relaxed">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                  <div className="font-bold text-slate-800">100% Hak Milik Klien Penuh</div>
                  <p>
                    Seluruh paket di atas sudah termasuk infrastruktur cloud hosting statis berkecepatan tinggi tanpa biaya sewa server bulanan. Aset digital bisnis Anda tidak akan pernah kami sandera.
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                  <div className="font-bold text-slate-800">Registrasi Domain Resmi Transparan</div>
                  <p>
                    Pembelian nama domain resmi (<code className="font-mono text-slate-800 font-bold">.id</code> ±Rp 275.000/thn, <code className="font-mono text-slate-800 font-bold">.com</code> ±Rp 220.000/thn, atau <code className="font-mono text-slate-800 font-bold">.my.id</code> ±Rp 50.000/thn) dibayarkan sesuai harga asli registrar dan didaftarkan <strong>100% atas nama kepemilikan Anda</strong>.
                  </p>
                </div>
              </div>
            </div>

            {/* Note on Free Audit */}
            <div className="mt-8 p-6 rounded-2xl bg-white border border-slate-200 text-center max-w-xl mx-auto space-y-2">
              <div className="text-sm font-bold text-slate-900">Belum Yakin Mau Pilih Paket yang Mana?</div>
              <p className="text-xs text-slate-600">
                Mulai dulu dengan <strong>Digital Audit Gratis 15 Menit</strong>. Kami beri tahu apa yang benar-benar dibutuhkan usaha Anda tanpa buang biaya berlebih.
              </p>
              <div className="pt-2">
                <a
                  href="https://wa.me/6282112477119?text=Halo%20Ladi,%20saya%20mau%20konsultasi%20pilihan%20paket%20yang%20paling%20sesuai%20untuk%20usaha%20saya."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-bold text-[#c2410c] hover:underline"
                  aria-label="Konsultasi Pilihan Paket via WhatsApp Ladi"
                >
                  Konsultasi Santai via WhatsApp Sekarang →
                </a>
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
