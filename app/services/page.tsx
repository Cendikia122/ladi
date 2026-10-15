import Link from "next/link";
import TopBar from "../components/TopBar";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import WhatsAppButton from "../components/WhatsAppButton";
import { getServicePackages } from "@/app/lib/storage";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = {
  title: "Layanan & Spesifikasi — Ladi (Layanan Digital)",
  description: "Digital Presence System terpadu: Paket EXIST, RISE, RUN, GUARD, dan Audit Digital 10 Poin Gratis.",
};

export default async function ServicesPage() {
  const packages = await getServicePackages();

  const auditPoints = [
    { no: "01", name: "Profil Google Business", note: "Kelengkapan jam buka, foto, dan kategori resmi" },
    { no: "02", name: "Peta Digital", note: "Kemudahan ditemukan calon pelanggan di wilayah target" },
    { no: "03", name: "Kualitas Website di HP", note: "Kecepatan dan kerapian saat dibuka lewat smartphone" },
    { no: "04", name: "Waktu Muat (Speed)", note: "Website terbuka instan di bawah 1 detik tanpa lemot" },
    { no: "05", name: "Pendaftaran Pencarian Dasar", note: "Kesesuaian judul dan deskripsi bisnis di Google" },
    { no: "06", name: "Kehadiran Media Sosial", note: "Tautan aktif dan keselarasan identitas brand" },
    { no: "07", name: "Akses Kontak WhatsApp", note: "Kemudahan pembeli langsung menghubungi dalam 1 klik" },
    { no: "08", name: "Ulasan Pelanggan", note: "Kepercayaan publik dan respons terhadap pembeli" },
    { no: "09", name: "Keseragaman Nama Bisnis", note: "Konsistensi nama di seluruh direktori internet" },
    { no: "10", name: "Keamanan Sistem (SSL)", note: "Koneksi aman berstandar gembok hijau HTTPS" },
  ];

  return (
    <>
      <TopBar />
      <Navbar />

      <main className="bg-[#f8fafc] text-[#0f172a]">
        {/* Header Banner */}
        <section className="bg-[#0f172a] text-white py-16 lg:py-20 border-b border-slate-800">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <span className="font-mono text-xs text-[#fa824b] font-bold uppercase tracking-wider block mb-2">
              DIGITAL PRESENCE SYSTEM (DPS)
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
              Layanan Terpadu Ladi
            </h1>
            <p className="text-slate-300 text-base sm:text-lg mt-3 max-w-2xl">
              Satu ekosistem yang saling terhubung: Website, Google, WhatsApp, dan Laporan Dampak Bulanan.
            </p>
          </div>
        </section>

        {/* Audit 10 Poin Detail */}
        <section className="py-20 bg-white border-b border-slate-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-5 space-y-5">
                <span className="section-sublabel">KAIL UTAMA KAMI</span>
                <h2 className="text-2xl sm:text-4xl font-extrabold text-[#0f172a] leading-tight">
                  Ladi Digital Audit (100% Gratis)
                </h2>
                <div className="decorative-line" />
                <p className="text-slate-600 text-base leading-relaxed">
                  Sebelum membeli paket apa pun, kami periksa 10 titik penting kehadiran online bisnis Anda. Selesai dalam 15–20 menit dengan skor 0–100.
                </p>
                <div className="p-4 rounded-2xl bg-[#f8fafc] border border-slate-200 text-xs text-slate-600 space-y-2">
                  <div className="font-bold text-slate-800">Kenapa Kami Berikan Gratis?</div>
                  <p>Karena kami ingin memberi nilai nyata terlebih dahulu sebelum meminta komitmen apa pun dari Anda.</p>
                </div>
                <div>
                  <Link
                    href="/contact-us"
                    className="inline-block px-7 py-3 rounded-full bg-[#fa824b] hover:bg-[#e5723b] text-white font-bold text-xs uppercase tracking-wider transition-all"
                  >
                    Minta Audit Usaha Sekarang →
                  </Link>
                </div>
              </div>

              <div className="lg:col-span-7 rounded-3xl bg-[#f8fafc] border border-slate-200 p-6 sm:p-8">
                <h3 className="font-bold text-slate-900 text-lg mb-4">
                  10 Parameter yang Kami Periksa:
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {auditPoints.map((item) => (
                    <div key={item.no} className="p-3.5 rounded-xl bg-white border border-slate-200 flex items-start gap-3">
                      <span className="font-mono text-xs font-bold text-[#1853a7] shrink-0 mt-0.5">
                        {item.no}
                      </span>
                      <div>
                        <div className="text-xs font-bold text-slate-800">{item.name}</div>
                        <div className="text-[11px] text-slate-500 mt-0.5">{item.note}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Dynamic Packages Detailed Grid */}
        <section className="py-20 md:py-28">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="section-sublabel">PILIHAN PAKET USAHA</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0f172a] mt-1">
                4 Skema Implementasi Ladi
              </h2>
              <div className="decorative-line-center" />
              <p className="text-slate-600 text-sm mt-2">
                Pilih paket yang paling tepat untuk skala bisnis Anda, atau klik detail untuk melihat contoh website dan laporan hasil nyata.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {packages.map((pkg) => {
                let deliverablesList: string[] = [];
                try {
                  deliverablesList = JSON.parse(pkg.deliverables);
                } catch {
                  deliverablesList = pkg.deliverables ? pkg.deliverables.split("\n").filter(Boolean) : [];
                }

                const waMessage = encodeURIComponent(
                  pkg.cta_whatsapp_text ||
                    `Halo Ladi, saya tertarik dengan ${pkg.name}. Bisakah saya konsultasikan kebutuhan usaha saya?`
                );
                const waUrl = `https://wa.me/6282112477119?text=${waMessage}`;

                return (
                  <div
                    key={pkg.id}
                    className={`p-8 rounded-3xl bg-white corporate-card space-y-5 flex flex-col justify-between relative ${
                      pkg.badge_popular
                        ? "border-2 border-[#1853a7] shadow-lg"
                        : "border border-slate-200 shadow-sm"
                    }`}
                  >
                    {pkg.badge_popular && (
                      <span className="absolute -top-3 right-6 bg-[#c2410c] text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-sm">
                        ⭐ PALING DIMINATI
                      </span>
                    )}

                    <div className="space-y-4">
                      <div className="space-y-1">
                        <span className="text-xs font-bold text-[#c2410c] uppercase tracking-wider">
                          {pkg.tag}
                        </span>
                        <h3 className="text-2xl font-extrabold text-slate-900">{pkg.name}</h3>
                        <p className="text-sm text-slate-600">{pkg.subtitle}</p>
                      </div>

                      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-baseline justify-between">
                        <div>
                          <div className="text-2xl font-black text-[#1853a7]">{pkg.price}</div>
                          <div className="text-[11px] text-slate-500 font-medium">
                            {pkg.period || "Sekali Bayar"} · {pkg.timeline}
                          </div>
                        </div>
                        {pkg.original_price && (
                          <div className="text-xs text-slate-600 line-through font-semibold">
                            {pkg.original_price}
                          </div>
                        )}
                      </div>

                      <div className="h-px bg-slate-100" />

                      <ul className="space-y-2.5 text-xs sm:text-sm text-slate-700">
                        {deliverablesList.slice(0, 6).map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-emerald-600 font-bold shrink-0">✓</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="pt-4 space-y-2.5">
                      <Link
                        href={`/services/${pkg.slug}`}
                        className={`block w-full text-center py-3.5 rounded-full font-bold text-xs uppercase tracking-wider shadow-sm transition-all ${
                          pkg.badge_popular
                            ? "bg-[#c2410c] hover:bg-[#9a3412] text-white shadow-md hover:shadow-lg"
                            : "bg-[#1853a7] hover:bg-[#0f3d7d] text-white"
                        }`}
                        aria-label={`Lihat contoh website dan fitur lengkap ${pkg.name}`}
                      >
                        Lihat Contoh Website & Fitur Lengkap →
                      </Link>

                      <a
                        href={waUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full text-center py-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs uppercase tracking-wider transition-all"
                        aria-label={`Konsultasi via WhatsApp untuk ${pkg.name}`}
                      >
                        Konsultasi via WhatsApp 💬
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <WhatsAppButton />
    </>
  );
}
