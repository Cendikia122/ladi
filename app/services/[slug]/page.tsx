import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import TopBar from "../../components/TopBar";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import WhatsAppButton from "../../components/WhatsAppButton";
import { getServicePackageBySlug, getServicePackages } from "@/app/lib/storage";
import { Config } from "@/app/lib/config";

export const revalidate = 120;

export async function generateStaticParams() {
  try {
    const packages = await getServicePackages();
    return packages.map((p) => ({ slug: p.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const pkg = await getServicePackageBySlug(slug);
  const baseUrl = Config.siteUrl;

  if (!pkg) {
    return { title: "Paket Tidak Ditemukan — Ladi" };
  }

  const title = `${pkg.name} | Layanan Pembuatan Website Ladi`;
  const description =
    pkg.subtitle ||
    pkg.target_audience ||
    "Solusi pembuatan website profesional dan pendaftaran Google Maps resmi untuk bisnis Anda bersama Ladi.";

  return {
    title,
    description,
    alternates: {
      canonical: `${baseUrl}/services/${slug}`,
    },
    openGraph: {
      title,
      description,
      url: `${baseUrl}/services/${slug}`,
      siteName: "Ladi (Layanan Digital)",
      locale: "id_ID",
      type: "website",
      images: [{ url: `${baseUrl}/logo.png`, alt: pkg.name }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const pkg = await getServicePackageBySlug(slug);
  const baseUrl = Config.siteUrl;

  if (!pkg) {
    notFound();
  }

  // Parse deliverables
  let deliverablesList: string[] = [];
  try {
    if (pkg.deliverables) {
      deliverablesList = JSON.parse(pkg.deliverables);
    }
  } catch {
    deliverablesList = pkg.deliverables
      ? pkg.deliverables.split("\n").filter((i) => i.trim())
      : [];
  }

  // Parse example websites
  let exampleWebsites: Array<{
    name: string;
    industry?: string;
    url?: string;
    image?: string;
    highlight?: string;
  }> = [];
  try {
    if (pkg.example_websites) {
      exampleWebsites = JSON.parse(pkg.example_websites);
    }
  } catch {
    exampleWebsites = [];
  }

  // Parse audit report sample
  let auditSample: any = null;
  try {
    if (pkg.audit_report_sample) {
      auditSample = JSON.parse(pkg.audit_report_sample);
    }
  } catch {
    auditSample = null;
  }

  const allPackages = await getServicePackages();
  const otherPackages = allPackages.filter((p) => p.slug !== slug);

  // Link WhatsApp CTA khusus paket ini
  const waMessage = encodeURIComponent(
    pkg.cta_whatsapp_text ||
      `Halo Ladi, saya tertarik dengan ${pkg.name}. Bisakah saya konsultasikan kebutuhan usaha saya?`
  );
  const waUrl = `https://wa.me/6282112477119?text=${waMessage}`;

  // Schema.org Structured Data untuk Google Search & Ads
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: pkg.name,
    description: pkg.subtitle || pkg.target_audience,
    brand: {
      "@type": "Brand",
      name: "Ladi (Layanan Digital)",
    },
    offers: {
      "@type": "Offer",
      url: `${baseUrl}/services/${slug}`,
      priceCurrency: "IDR",
      price: pkg.price.replace(/[^0-9]/g, "") || "299000",
      availability: "https://schema.org/InStock",
      seller: {
        "@type": "Organization",
        name: "Ladi (Layanan Digital)",
      },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <TopBar />
      <Navbar />

      <main className="bg-[#f8fafc] text-[#0f172a] pb-24 sm:pb-16">
        {/* =================================================================== */}
        {/* 1. HERO SECTION: Heading, Subtitle, Target Audience & Direct CTA */}
        {/* =================================================================== */}
        <section className="relative bg-[#0f172a] text-white pt-14 pb-20 lg:pt-20 lg:pb-28 overflow-hidden border-b border-slate-800">
          <div className="absolute inset-0 bg-radial-[circle_at_top_right] from-blue-900/30 via-transparent to-transparent pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            {/* Breadcrumb Navigation */}
            <div className="flex items-center gap-2 text-xs text-slate-400 mb-6 font-medium">
              <Link href="/" className="hover:text-white transition-colors">
                Beranda
              </Link>
              <span>/</span>
              <Link href="/services" className="hover:text-white transition-colors">
                Layanan & Paket
              </Link>
              <span>/</span>
              <span className="text-white truncate font-semibold">{pkg.name}</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              {/* Sisi Kiri: Informasi Paket & Copywriting Penawaran */}
              <div className="lg:col-span-7 space-y-6">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="px-3.5 py-1 rounded-full bg-[#fa824b] text-white font-bold text-xs uppercase tracking-wider shadow-sm">
                    {pkg.tag || "PAKET RESMI LADI"}
                  </span>
                  {pkg.badge_popular && (
                    <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 font-bold text-xs uppercase tracking-wider">
                      ⭐ Paling Diminati Klien
                    </span>
                  )}
                  <span className="px-3 py-1 rounded-full bg-white/10 text-slate-300 font-mono text-xs">
                    ⚡ Estimasi: {pkg.timeline}
                  </span>
                </div>

                <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-[1.15]">
                  {pkg.name}
                </h1>

                <p className="text-lg sm:text-xl text-slate-300 font-normal leading-relaxed">
                  {pkg.subtitle}
                </p>

                {/* Box "Cocok Untuk Siapa?" */}
                {pkg.target_audience && (
                  <div className="p-4 sm:p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm space-y-1.5">
                    <div className="text-xs font-bold text-[#fa824b] uppercase tracking-wider flex items-center gap-1.5">
                      <span>🎯</span>
                      <span>Target Bisnis & Kebutuhan:</span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      {pkg.target_audience}
                    </p>
                  </div>
                )}

                {/* Tombol Aksi Cepat Iklan (CTA Langsung ke WA) */}
                <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
                  <a
                    href={waUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-4 px-8 rounded-full bg-[#c2410c] hover:bg-[#9a3412] text-white font-bold text-sm uppercase tracking-wider shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 text-center group cursor-pointer"
                    aria-label={`Pesan paket ${pkg.name} via WhatsApp`}
                  >
                    <span>💬</span>
                    <span>{pkg.cta_text || "Pesan Paket Ini via WhatsApp"}</span>
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </a>

                  <a
                    href="#hal-didapatkan"
                    className="py-3.5 px-6 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider transition-all text-center"
                  >
                    Lihat Fitur Lengkap ↓
                  </a>
                </div>
              </div>

              {/* Sisi Kanan: Kotak Harga & Ringkasan Kepastian Biaya */}
              <div className="lg:col-span-5">
                <div className="p-7 sm:p-9 rounded-3xl bg-white text-[#0f172a] shadow-2xl border border-slate-100 space-y-6">
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Investasi Digital Resmi
                    </span>
                    <div className="flex items-baseline gap-3">
                      <span className="text-3xl sm:text-4xl font-black text-[#1853a7] tracking-tight">
                        {pkg.price}
                      </span>
                      {pkg.original_price && (
                        <span className="text-sm sm:text-base text-slate-400 line-through font-semibold">
                          {pkg.original_price}
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-slate-500 font-medium block">
                      {pkg.period || "Sekali Bayar (Tanpa Biaya Tersembunyi)"}
                    </span>
                  </div>

                  <div className="h-px bg-slate-100" />

                  {/* Nilai Kepastian Transaksi */}
                  <div className="space-y-3 text-xs text-slate-700">
                    <div className="flex items-start gap-2.5">
                      <span className="text-emerald-600 font-bold text-sm">✓</span>
                      <div>
                        <strong>Skema Pembayaran Adil & Aman:</strong>
                        <span className="text-slate-500 block">
                          DP 50% di awal, dan pelunasan 50% HANYA setelah website siap tayang.
                        </span>
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5">
                      <span className="text-emerald-600 font-bold text-sm">✓</span>
                      <div>
                        <strong>Kedaulatan Klien 100%:</strong>
                        <span className="text-slate-500 block">
                          Nama domain dan konten menjadi hak milik penuh bisnis Anda.
                        </span>
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5">
                      <span className="text-emerald-600 font-bold text-sm">✓</span>
                      <div>
                        <strong>Garansi Waktu Pengerjaan:</strong>
                        <span className="text-slate-500 block">
                          Selesai tepat waktu sesuai estimasi ({pkg.timeline}).
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2">
                    <a
                      href={waUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full py-3.5 px-4 rounded-full bg-[#1853a7] hover:bg-[#0f3d7d] text-white text-center font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all"
                    >
                      Pesan Sekarang ke 0821-1247-7119 →
                    </a>
                    <span className="text-[10px] text-slate-400 text-center block mt-2">
                      Langsung terhubung dengan Tim Konsultan Resmi Ladi
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =================================================================== */}
        {/* 2. HAL-HAL YANG ANDA DAPATKAN (Deliverables Checklist) */}
        {/* =================================================================== */}
        <section id="hal-didapatkan" className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="section-sublabel">TRANSPARANSI FITUR</span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-[#0f172a] mt-1">
              Apa Saja yang Anda Dapatkan dalam {pkg.name}?
            </h2>
            <div className="decorative-line-center" />
            <p className="text-slate-600 text-sm sm:text-base">
              Semua kebutuhan teknis telah kami rangkum dalam satu paket lengkap. Anda tidak perlu membeli hosting atau plugin terpisah.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {deliverablesList.map((item, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-[#1853a7] hover:shadow-sm transition-all flex items-start gap-3.5"
              >
                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm shrink-0">
                  ✓
                </div>
                <div className="text-slate-800 text-sm font-semibold leading-relaxed">
                  {item}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* =================================================================== */}
        {/* 3. CONTOH WEBSITE & TAMPILAN NYATA HASIL PAKET INI */}
        {/* =================================================================== */}
        {exampleWebsites.length > 0 && (
          <section className="py-16 bg-white border-y border-slate-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center max-w-3xl mx-auto mb-14">
                <span className="section-sublabel">BUKTI HASIL NYATA</span>
                <h2 className="text-2xl sm:text-4xl font-extrabold text-[#0f172a] mt-1">
                  Contoh Tampilan Website dari Paket Ini
                </h2>
                <div className="decorative-line-center" />
                <p className="text-slate-600 text-sm sm:text-base">
                  Lihat bagaimana bisnis klien kami tampil lebih kredibel, profesional, dan mudah diakses oleh calon pembeli.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {exampleWebsites.map((ex, idx) => (
                  <div
                    key={idx}
                    className="rounded-3xl border border-slate-200 overflow-hidden bg-[#f8fafc] shadow-sm hover:shadow-md transition-all group flex flex-col"
                  >
                    {ex.image && (
                      <div className="relative h-60 sm:h-72 w-full overflow-hidden bg-slate-100">
                        <Image
                          src={ex.image}
                          alt={ex.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        {ex.industry && (
                          <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-[#0f172a]/80 backdrop-blur-md text-white font-bold text-[11px] uppercase tracking-wider">
                            {ex.industry}
                          </span>
                        )}
                      </div>
                    )}

                    <div className="p-6 sm:p-7 space-y-3 flex-1 flex flex-col justify-between">
                      <div className="space-y-2">
                        <h3 className="text-xl font-extrabold text-slate-900">{ex.name}</h3>
                        {ex.highlight && (
                          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                            {ex.highlight}
                          </p>
                        )}
                      </div>

                      {ex.url && (
                        <div className="pt-3 border-t border-slate-200/60">
                          <Link
                            href={ex.url}
                            className="text-xs font-bold text-[#1853a7] hover:underline inline-flex items-center gap-1"
                          >
                            <span>Lihat Detail Portofolio Terkait</span>
                            <span>→</span>
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* =================================================================== */}
        {/* 4. CONTOH HASIL AUDIT & LAPORAN DAMPAK NYATA */}
        {/* =================================================================== */}
        {auditSample && (
          <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] text-white shadow-xl space-y-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
                <div>
                  <span className="font-mono text-xs text-[#fa824b] font-bold uppercase tracking-wider block mb-1">
                    STANDAR KUALITAS LADI
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                    {auditSample.title || "Contoh Hasil Audit & Laporan Bulanan"}
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-3.5 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-bold font-mono">
                    ✓ Google Certified Standard
                  </span>
                </div>
              </div>

              {/* Grid Metrik Skor */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {auditSample.speed_score && (
                  <div className="p-5 rounded-2xl bg-white/5 border border-white/10 text-center space-y-1">
                    <div className="text-3xl sm:text-4xl font-black text-emerald-400">
                      {auditSample.speed_score}/100
                    </div>
                    <div className="text-xs font-bold uppercase tracking-wider text-slate-300">
                      Kecepatan Mobile
                    </div>
                    <div className="text-[10px] text-slate-400">Google PageSpeed</div>
                  </div>
                )}

                {auditSample.seo_score && (
                  <div className="p-5 rounded-2xl bg-white/5 border border-white/10 text-center space-y-1">
                    <div className="text-3xl sm:text-4xl font-black text-blue-400">
                      {auditSample.seo_score}/100
                    </div>
                    <div className="text-xs font-bold uppercase tracking-wider text-slate-300">
                      Skor SEO Semantik
                    </div>
                    <div className="text-[10px] text-slate-400">Struktur Mesin Pencari</div>
                  </div>
                )}

                {auditSample.monthly_views && (
                  <div className="p-5 rounded-2xl bg-white/5 border border-white/10 text-center space-y-1">
                    <div className="text-2xl sm:text-3xl font-black text-[#fa824b]">
                      {auditSample.monthly_views}
                    </div>
                    <div className="text-xs font-bold uppercase tracking-wider text-slate-300">
                      Jangkauan Pasar
                    </div>
                    <div className="text-[10px] text-slate-400">Pencarian Google</div>
                  </div>
                )}

                {auditSample.wa_clicks && (
                  <div className="p-5 rounded-2xl bg-white/5 border border-white/10 text-center space-y-1">
                    <div className="text-2xl sm:text-3xl font-black text-emerald-400">
                      {auditSample.wa_clicks}
                    </div>
                    <div className="text-xs font-bold uppercase tracking-wider text-slate-300">
                      Respon Pembeli
                    </div>
                    <div className="text-[10px] text-slate-400">Chat WhatsApp Masuk</div>
                  </div>
                )}
              </div>

              {/* Rangkuman Narasi Audit */}
              {auditSample.summary && (
                <div className="p-5 rounded-2xl bg-white/5 border border-white/10 text-xs sm:text-sm text-slate-300 leading-relaxed">
                  💡 <strong>Catatan Teknis Konsultan:</strong> {auditSample.summary}
                </div>
              )}
            </div>
          </section>
        )}

        {/* =================================================================== */}
        {/* 5. COPYWRITING & PENJELASAN LENGKAP PAKET */}
        {/* =================================================================== */}
        {pkg.description && (
          <section className="py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white p-8 sm:p-12 rounded-3xl border border-slate-200 shadow-sm space-y-6">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-3">
                Penjelasan Lengkap Paket
              </div>
              <div
                className="text-slate-800 text-sm sm:text-base leading-relaxed space-y-4 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-slate-900 [&_h2]:mt-6 [&_h3]:text-xl [&_h3]:font-bold [&_h3]:text-slate-900 [&_h3]:mt-4 [&_p]:my-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:space-y-1 [&_blockquote]:border-l-4 [&_blockquote]:border-[#1853a7] [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-slate-600 [&_a]:text-[#1853a7] [&_a]:underline"
                dangerouslySetInnerHTML={{ __html: pkg.description }}
              />
            </div>
          </section>
        )}

        {/* =================================================================== */}
        {/* 6. PAKET LAINNYA SEBAGAI PERBANDINGAN */}
        {/* =================================================================== */}
        {otherPackages.length > 0 && (
          <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <span className="section-sublabel">OPSI ALTERNATIF</span>
              <h3 className="text-xl sm:text-3xl font-extrabold text-[#0f172a] mt-1">
                Pilihan Paket Ladi Lainnya
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {otherPackages.slice(0, 3).map((item) => (
                <div
                  key={item.id}
                  className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <span className="text-[11px] font-bold text-[#c2410c] uppercase tracking-wider">
                      {item.tag}
                    </span>
                    <h4 className="text-lg font-bold text-slate-900">{item.name}</h4>
                    <p className="text-xs text-slate-600 line-clamp-2">{item.subtitle}</p>
                    <div className="text-lg font-black text-[#1853a7]">{item.price}</div>
                  </div>

                  <Link
                    href={`/services/${item.slug}`}
                    className="block w-full py-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 text-center font-bold text-xs uppercase tracking-wider transition-colors"
                    aria-label={`Lihat rincian paket ${item.name}`}
                  >
                    Lihat Rincian Paket →
                  </Link>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* =================================================================== */}
        {/* 7. BOTTOM BANNER CTA */}
        {/* =================================================================== */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-[#1853a7] to-[#0f3d7d] text-white text-center space-y-6 shadow-xl">
            <h2 className="text-2xl sm:text-4xl font-extrabold">
              Siap Menghidupkan Bisnis Anda di Internet Hari Ini?
            </h2>
            <p className="text-slate-200 text-sm sm:text-base max-w-xl mx-auto">
              Tidak perlu ragu atau pusing urusan teknis. Tim Ladi siap mendampingi Anda dari awal sampai website aktif dan menghasilkan pelanggan.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5">
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto py-4 px-8 rounded-full bg-white hover:bg-slate-100 text-[#1853a7] font-bold text-xs sm:text-sm uppercase tracking-wider shadow-lg transition-all flex items-center justify-center gap-2"
                aria-label={`Pesan paket ${pkg.name} via WhatsApp sekarang`}
              >
                <span>💬</span>
                <span>Pesan Paket Ini via WhatsApp</span>
              </a>
              <Link
                href="/services"
                className="w-full sm:w-auto py-4 px-6 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm uppercase tracking-wider transition-all"
              >
                Bandingkan Semua Paket
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* =================================================================== */}
      {/* 8. FLOATING STICKY CTA BAR UNTUK IKLAN MOBILE */}
      {/* =================================================================== */}
      <div className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 p-3 sm:hidden shadow-2xl flex items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="text-[10px] text-slate-500 truncate">{pkg.name}</div>
          <div className="text-base font-black text-[#1853a7] leading-tight">{pkg.price}</div>
        </div>
        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="py-2.5 px-5 rounded-full bg-[#fa824b] hover:bg-[#e5723b] text-white font-bold text-xs uppercase tracking-wider shadow-md shrink-0 flex items-center gap-1.5"
        >
          <span>💬</span>
          <span>Pesan via WA</span>
        </a>
      </div>

      <Footer />
      <WhatsAppButton />
    </>
  );
}
