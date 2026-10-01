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
        <section className="py-20 md:py-28">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
              {/* EXIST */}
              <div className="p-7 rounded-3xl bg-white border border-slate-200 shadow-sm corporate-card flex flex-col justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">LANGKAH AWAL</span>
                  <h3 className="text-xl font-extrabold text-slate-900 mt-1">EXIST</h3>
                  <p className="text-xs text-slate-500 mt-1">Mulai hadir resmi di internet.</p>

                  <div className="my-5 pb-5 border-b border-slate-100">
                    <div className="text-2xl font-extrabold text-[#1853a7]">Rp 500.000</div>
                    <div className="text-[11px] text-slate-400">Satu kali bayar (DP 50%)</div>
                  </div>

                  <ul className="space-y-2 text-xs text-slate-600">
                    <li>✓ Landing page 1 halaman</li>
                    <li>✓ Setup Google Business resmi</li>
                    <li>✓ Tombol WhatsApp langsung</li>
                    <li>✓ Pendaftaran SEO dasar</li>
                  </ul>
                </div>

                <div className="pt-6">
                  <a
                    href="https://wa.me/6281298319944?text=Halo+Ladi%2C+saya+minat+Paket+EXIST"
                    className="block w-full text-center py-2.5 rounded-full bg-[#1853a7] text-white font-bold text-xs uppercase"
                  >
                    Pilih EXIST
                  </a>
                </div>
              </div>

              {/* RISE */}
              <div className="p-7 rounded-3xl bg-white border-2 border-[#1853a7] shadow-xl corporate-card flex flex-col justify-between relative">
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#fa824b] text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full whitespace-nowrap">
                  PALING DIMINATI
                </span>
                <div>
                  <span className="text-xs font-bold text-[#fa824b] uppercase tracking-wider">BISNIS SERIUS</span>
                  <h3 className="text-xl font-extrabold text-slate-900 mt-1">RISE</h3>
                  <p className="text-xs text-slate-500 mt-1">Website lengkap & terpercaya.</p>

                  <div className="my-5 pb-5 border-b border-slate-100">
                    <div className="text-2xl font-extrabold text-[#1853a7]">Rp 1.000.000 – 1,5 Jt</div>
                    <div className="text-[11px] text-slate-400">Satu kali bayar (DP 50%)</div>
                  </div>

                  <ul className="space-y-2 text-xs text-slate-600">
                    <li>✓ Semua fitur EXIST</li>
                    <li>✓ Website 5–7 halaman lengkap</li>
                    <li>✓ Optimasi pencarian Google</li>
                    <li>✓ Setup Google Analytics</li>
                    <li>✓ Laporan hasil perdana 30 hari</li>
                    <li>✓ Revisi selama 3 bulan</li>
                  </ul>
                </div>

                <div className="pt-6">
                  <a
                    href="https://wa.me/6281298319944?text=Halo+Ladi%2C+saya+minat+Paket+RISE"
                    className="block w-full text-center py-2.5 rounded-full bg-[#fa824b] hover:bg-[#e5723b] text-white font-bold text-xs uppercase shadow"
                  >
                    Pilih RISE
                  </a>
                </div>
              </div>

              {/* RUN */}
              <div className="p-7 rounded-3xl bg-white border border-slate-200 shadow-sm corporate-card flex flex-col justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">EKOSISTEM PENUH</span>
                  <h3 className="text-xl font-extrabold text-slate-900 mt-1">RUN</h3>
                  <p className="text-xs text-slate-500 mt-1">Toko online & sistem transaksi.</p>

                  <div className="my-5 pb-5 border-b border-slate-100">
                    <div className="text-2xl font-extrabold text-[#1853a7]">Rp 2,5 – 3,5 Jt</div>
                    <div className="text-[11px] text-slate-400">Satu kali bayar (DP 50%)</div>
                  </div>

                  <ul className="space-y-2 text-xs text-slate-600">
                    <li>✓ Semua fitur RISE</li>
                    <li>✓ Toko online / booking online</li>
                    <li>✓ Pembayaran QRIS otomatis</li>
                    <li>✓ Template balas cepat WA</li>
                    <li>✓ Laporan rutin 3 bulan</li>
                    <li>✓ Sesi konsultasi strategi 60 mnt</li>
                  </ul>
                </div>

                <div className="pt-6">
                  <a
                    href="https://wa.me/6281298319944?text=Halo+Ladi%2C+saya+minat+Paket+RUN"
                    className="block w-full text-center py-2.5 rounded-full bg-[#1853a7] text-white font-bold text-xs uppercase"
                  >
                    Pilih RUN
                  </a>
                </div>
              </div>

              {/* GUARD */}
              <div className="p-7 rounded-3xl bg-white border border-slate-200 shadow-sm corporate-card flex flex-col justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">PENDAMPINGAN</span>
                  <h3 className="text-xl font-extrabold text-slate-900 mt-1">GUARD</h3>
                  <p className="text-xs text-slate-500 mt-1">Pemeliharaan & laporan bulanan.</p>

                  <div className="my-5 pb-5 border-b border-slate-100">
                    <div className="text-2xl font-extrabold text-[#1853a7]">Rp 300 – 500rb</div>
                    <div className="text-[11px] text-slate-400">per bulan (Opsional)</div>
                  </div>

                  <ul className="space-y-2 text-xs text-slate-600">
                    <li>✓ Rawat sistem & keamanan web</li>
                    <li>✓ Update info & produk 1-2x/bln</li>
                    <li>✓ Laporan Dampak Bulanan di WA</li>
                    <li>✓ Respons prioritas via WhatsApp</li>
                  </ul>
                </div>

                <div className="pt-6">
                  <a
                    href="https://wa.me/6281298319944?text=Halo+Ladi%2C+saya+minat+Paket+GUARD"
                    className="block w-full text-center py-2.5 rounded-full bg-[#1853a7] text-white font-bold text-xs uppercase"
                  >
                    Pilih GUARD
                  </a>
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
                <Link href="/contact-us" className="text-xs font-bold text-[#fa824b] hover:underline">
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
