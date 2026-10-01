"use client";
import { useState } from "react";

const packages = [
  {
    id: "exist",
    tag: "LANGKAH PERDANA",
    name: "Paket EXIST",
    subtitle: "Mulai Hadir di Internet Global",
    summary: "Cocok untuk usaha yang ingin segera punya kehadiran resmi dan mudah ditemukan saat dicari calon pembeli.",
    features: [
      {
        title: "Website Resmi 1 Halaman",
        desc: "Tampilan profesional dan rapi saat dibuka di HP maupun komputer.",
      },
      {
        title: "Profil Resmi di Google",
        desc: "Usaha Anda muncul lengkap dengan nama, alamat, foto, dan jam buka.",
      },
      {
        title: "Tombol WhatsApp Langsung",
        desc: "Calon pelanggan cukup klik satu tombol untuk langsung chat dengan Anda.",
      },
      {
        title: "Fondasi Pencarian Dasar",
        desc: "Nama bisnis Anda terdaftar resmi sehingga tidak tertukar dengan kompetitor.",
      },
    ],
  },
  {
    id: "rise",
    tag: "PALING DIMINATI",
    name: "Paket RISE",
    subtitle: "Website Bisnis Lengkap & Otoritas",
    summary: "Untuk bisnis yang ingin tampil kredibel, memiliki profil layanan mendalam, dan mendatangkan pelanggan secara rutin.",
    features: [
      {
        title: "Website Lengkap 5–7 Halaman",
        desc: "Halaman Beranda, Tentang Kami, Layanan/Produk, Galeri, dan Kontak.",
      },
      {
        title: "Optimasi Pencarian Google",
        desc: "Bisnis Anda lebih mudah muncul di urutan atas saat orang mencari jasa Anda.",
      },
      {
        title: "Laporan Dampak Pertama (30 Hari)",
        desc: "Anda menerima laporan berapa orang yang melihat dan menghubungi bisnis Anda.",
      },
      {
        title: "Bantuan Update & Revisi",
        desc: "Perubahan foto atau teks didampingi tim Ladi selama 3 bulan pertama.",
      },
    ],
  },
  {
    id: "run",
    tag: "SISTEM PENUH",
    name: "Paket RUN",
    subtitle: "Ekosistem Digital & Transaksi",
    summary: "Untuk bisnis yang siap menerima pesanan, reservasi, atau pembayaran digital secara otomatis.",
    features: [
      {
        title: "Sistem Toko / Booking Online",
        desc: "Pelanggan bisa langsung memesan produk atau menjadwalkan layanan sendiri.",
      },
      {
        title: "Pembayaran QRIS Otomatis",
        desc: "Dukungan pembayaran digital praktis dari semua aplikasi perbankan & e-wallet.",
      },
      {
        title: "Template Balas Cepat WhatsApp",
        desc: "Pesan otomatis ramah agar pelanggan terlayani walau di luar jam operasional.",
      },
      {
        title: "Laporan Dampak Selama 3 Bulan",
        desc: "Pantauan rutin perkembangan interaksi pembeli bersama konsultan Ladi.",
      },
    ],
  },
  {
    id: "guard",
    tag: "PENDAMPINGAN RUTIN",
    name: "Paket GUARD",
    subtitle: "Pemeliharaan & Laporan Bulanan",
    summary: "Seperti memiliki staf teknologi pribadi. Kami rawat websitenya, perbarui infonya, dan laporkan hasilnya setiap bulan.",
    features: [
      {
        title: "Laporan Dampak Tiap Bulan",
        desc: "Dikirim langsung ke WA Anda: berapa kali muncul, berapa telepon dan chat masuk.",
      },
      {
        title: "Bantuan Update Konten Rutin",
        desc: "Mau ganti harga, tambah foto produk, atau ubah info? Cukup kirim ke kami.",
      },
      {
        title: "Keamanan & Kelancaran Website",
        desc: "Website dipantau agar selalu cepat dibuka dan bebas dari gangguan teknis.",
      },
      {
        title: "Jalur Prioritas WhatsApp",
        desc: "Pertanyaan atau kendala Anda dijawab cepat tanpa antre lama.",
      },
    ],
  },
];

export default function ServicesSection() {
  const [activeTab, setActiveTab] = useState(1); // Default to RISE (Paling Diminati)
  const current = packages[activeTab];

  return (
    <section id="layanan" className="py-24 md:py-32 bg-[#f8fafc] border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header - Simple & Clear */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="section-sublabel">
            PILIHAN LAYANAN LADI
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0f172a] tracking-tight mt-2">
            Pilih Sesuai <span className="text-[#1853a7]">Kebutuhan Usaha</span>
          </h2>
          <div className="decorative-line-center" />
          <p className="text-slate-600 text-base sm:text-lg">
            Satu ekosistem terpadu. Semua paket sudah kami kerjakan lengkap sampai siap pakai.
          </p>
        </div>

        {/* Tab Selection */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Tab Buttons */}
          <div className="lg:col-span-4 space-y-3">
            {packages.map((pkg, idx) => (
              <button
                key={pkg.id}
                onClick={() => setActiveTab(idx)}
                className={`w-full text-left p-5 rounded-2xl transition-all duration-200 border flex items-center justify-between ${
                  activeTab === idx
                    ? "bg-[#1853a7] text-white border-[#1853a7] shadow-lg shadow-[#1853a7]/20"
                    : "bg-white text-slate-800 border-slate-200 hover:border-[#1853a7]/40 hover:bg-slate-50"
                }`}
              >
                <div>
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${
                    activeTab === idx ? "text-[#fa824b]" : "text-slate-500"
                  }`}>
                    {pkg.tag}
                  </span>
                  <div className="text-lg font-bold mt-0.5 tracking-tight">
                    {pkg.name}
                  </div>
                  <div className={`text-xs mt-1 ${activeTab === idx ? "text-slate-200" : "text-slate-500"}`}>
                    {pkg.subtitle}
                  </div>
                </div>

                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ml-2 ${
                  activeTab === idx ? "bg-[#fa824b] text-white" : "bg-slate-100 text-slate-400"
                }`}>
                  →
                </div>
              </button>
            ))}

            <div className="p-5 rounded-2xl bg-white border border-slate-200 text-center mt-6 space-y-2">
              <p className="text-xs text-slate-600">Bingung pilih yang mana?</p>
              <a
                href="#konsultasi"
                className="inline-block w-full py-3 px-4 rounded-full bg-[#fa824b] hover:bg-[#e5723b] text-white font-bold text-xs uppercase tracking-wider transition-all"
              >
                Minta Rekomendasi Gratis
              </a>
            </div>
          </div>

          {/* Right: Selected Package Content (Clean 2x2 Grid) */}
          <div className="lg:col-span-8">
            <div className="p-7 sm:p-10 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-8">
              <div className="border-b border-slate-100 pb-6">
                <span className="text-xs font-bold text-[#fa824b] uppercase tracking-wider">
                  {current.tag}
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-[#0f172a] mt-1">
                  {current.name} — <span className="text-[#1853a7]">{current.subtitle}</span>
                </h3>
                <p className="text-slate-600 text-sm sm:text-base mt-2 leading-relaxed">
                  {current.summary}
                </p>
              </div>

              {/* 4 Feature Items */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {current.features.map((f, i) => (
                  <div
                    key={i}
                    className="p-5 rounded-2xl bg-[#f8fafc] border border-slate-200/90 space-y-2"
                  >
                    <div className="flex items-center gap-2 text-[#fa824b] font-bold text-sm">
                      <span className="w-5 h-5 rounded-full bg-[#fa824b]/20 flex items-center justify-center text-xs">✓</span>
                      <span className="text-slate-900 font-bold">{f.title}</span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pl-7">
                      {f.desc}
                    </p>
                  </div>
                ))}
              </div>

              {/* Bottom Action */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-100">
                <div className="text-xs text-slate-500 text-center sm:text-left">
                  Pengerjaan transparan · Ada demo sebelum website live
                </div>
                <a
                  href={`https://wa.me/6281298319944?text=Halo+Ladi%2C+saya+tertarik+konsultasi+tentang+${encodeURIComponent(current.name)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 rounded-full bg-[#1853a7] hover:bg-[#0f3d7d] text-white font-bold text-xs uppercase tracking-wider transition-all"
                >
                  Tanya Paket Ini via WA →
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
