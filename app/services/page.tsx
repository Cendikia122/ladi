import Link from "next/link";
import TopBar from "../components/TopBar";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import WhatsAppButton from "../components/WhatsAppButton";

export const metadata = {
  title: "Layanan & Spesifikasi — Ladi (Layanan Digital)",
  description: "Digital Presence System terpadu: Paket EXIST, RISE, RUN, GUARD, dan Audit Digital 10 Poin Gratis.",
};

export default function ServicesPage() {
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

        {/* 4 Packages Detailed Grid */}
        <section className="py-20 md:py-28">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="section-sublabel">PILIHAN PAKET USAHA</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0f172a] mt-1">
                4 Skema Implementasi Ladi
              </h2>
              <div className="decorative-line-center" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* EXIST */}
              <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm corporate-card space-y-5">
                <span className="text-xs font-bold text-[#fa824b] uppercase tracking-wider">LANGKAH PERDANA</span>
                <h3 className="text-2xl font-extrabold text-slate-900">Paket EXIST</h3>
                <p className="text-sm text-slate-600">Cocok untuk bisnis yang sama sekali belum ada di internet.</p>
                <div className="h-px bg-slate-100" />
                <ul className="space-y-2.5 text-xs sm:text-sm text-slate-700">
                  <li className="flex items-center gap-2">✓ Website Resmi 1 Halaman Responsif</li>
                  <li className="flex items-center gap-2">✓ Pendaftaran & Optimasi Profil Google Resmi</li>
                  <li className="flex items-center gap-2">✓ Tombol WhatsApp Langsung ke Pemilik</li>
                  <li className="flex items-center gap-2">✓ Pendaftaran Mesin Pencari Dasar</li>
                  <li className="flex items-center gap-2">✓ 1x Revisi & Pendampingan Launching</li>
                </ul>
                <div className="pt-2">
                  <a
                    href="https://wa.me/6281298319944?text=Halo+Ladi%2C+saya+tertarik+Paket+EXIST"
                    className="block w-full text-center py-3 rounded-full bg-[#1853a7] hover:bg-[#0f3d7d] text-white font-bold text-xs uppercase tracking-wider"
                  >
                    Tanya Paket EXIST
                  </a>
                </div>
              </div>

              {/* RISE */}
              <div className="p-8 rounded-3xl bg-white border-2 border-[#1853a7] shadow-lg corporate-card space-y-5 relative">
                <span className="absolute -top-3 right-6 bg-[#fa824b] text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                  PALING DIMINATI
                </span>
                <span className="text-xs font-bold text-[#fa824b] uppercase tracking-wider">BISNIS SERIUS</span>
                <h3 className="text-2xl font-extrabold text-slate-900">Paket RISE</h3>
                <p className="text-sm text-slate-600">Website lengkap 5–7 halaman untuk membangun reputasi dan dipercaya pelanggan.</p>
                <div className="h-px bg-slate-100" />
                <ul className="space-y-2.5 text-xs sm:text-sm text-slate-700">
                  <li className="flex items-center gap-2">✓ Semua Fitur Paket EXIST</li>
                  <li className="flex items-center gap-2">✓ Website Lengkap 5–7 Halaman (Profil, Galeri, Layanan)</li>
                  <li className="flex items-center gap-2">✓ Optimasi Penuh Pencarian Google</li>
                  <li className="flex items-center gap-2">✓ Setup Google Analytics & Penjelasan Cara Baca</li>
                  <li className="flex items-center gap-2">✓ Laporan Dampak Perdana (Setelah 30 Hari)</li>
                  <li className="flex items-center gap-2">✓ Bantuan Revisi Bulanan Selama 3 Bulan</li>
                </ul>
                <div className="pt-2">
                  <a
                    href="https://wa.me/6281298319944?text=Halo+Ladi%2C+saya+tertarik+Paket+RISE"
                    className="block w-full text-center py-3 rounded-full bg-[#fa824b] hover:bg-[#e5723b] text-white font-bold text-xs uppercase tracking-wider shadow-md"
                  >
                    Tanya Paket RISE
                  </a>
                </div>
              </div>

              {/* RUN */}
              <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm corporate-card space-y-5">
                <span className="text-xs font-bold text-[#fa824b] uppercase tracking-wider">EKOSISTEM PENUH</span>
                <h3 className="text-2xl font-extrabold text-slate-900">Paket RUN</h3>
                <p className="text-sm text-slate-600">Untuk bisnis yang siap menerima order, booking online, dan pembayaran QRIS.</p>
                <div className="h-px bg-slate-100" />
                <ul className="space-y-2.5 text-xs sm:text-sm text-slate-700">
                  <li className="flex items-center gap-2">✓ Semua Fitur Paket RISE</li>
                  <li className="flex items-center gap-2">✓ Toko Online / Sistem Reservasi Mandiri</li>
                  <li className="flex items-center gap-2">✓ Integrasi Pembayaran QRIS Otomatis</li>
                  <li className="flex items-center gap-2">✓ Template Balas Otomatis WhatsApp Bisnis</li>
                  <li className="flex items-center gap-2">✓ Laporan Dampak Lengkap Selama 3 Bulan</li>
                  <li className="flex items-center gap-2">✓ Sesi Konsultasi Strategi Digital 60 Menit</li>
                </ul>
                <div className="pt-2">
                  <a
                    href="https://wa.me/6281298319944?text=Halo+Ladi%2C+saya+tertarik+Paket+RUN"
                    className="block w-full text-center py-3 rounded-full bg-[#1853a7] hover:bg-[#0f3d7d] text-white font-bold text-xs uppercase tracking-wider"
                  >
                    Tanya Paket RUN
                  </a>
                </div>
              </div>

              {/* GUARD */}
              <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm corporate-card space-y-5">
                <span className="text-xs font-bold text-[#fa824b] uppercase tracking-wider">PENDAMPINGAN RUTIN</span>
                <h3 className="text-2xl font-extrabold text-slate-900">Paket GUARD</h3>
                <p className="text-sm text-slate-600">Pemeliharaan rutin bulanan: website selalu aman, konten diperbarui, dan laporan dikirim via WA.</p>
                <div className="h-px bg-slate-100" />
                <ul className="space-y-2.5 text-xs sm:text-sm text-slate-700">
                  <li className="flex items-center gap-2">✓ Pemeliharaan & Keamanan Rutin Website</li>
                  <li className="flex items-center gap-2">✓ Update Konten & Harga (1–2x per bulan)</li>
                  <li className="flex items-center gap-2">✓ Laporan Dampak Digital Bulanan via WhatsApp</li>
                  <li className="flex items-center gap-2">✓ Bantuan Perubahan Desain Kecil</li>
                  <li className="flex items-center gap-2">✓ Jalur Respons Cepat Prioritas</li>
                </ul>
                <div className="pt-2">
                  <a
                    href="https://wa.me/6281298319944?text=Halo+Ladi%2C+saya+tertarik+Paket+GUARD"
                    className="block w-full text-center py-3 rounded-full bg-[#1853a7] hover:bg-[#0f3d7d] text-white font-bold text-xs uppercase tracking-wider"
                  >
                    Tanya Paket GUARD
                  </a>
                </div>
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
