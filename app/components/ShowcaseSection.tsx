import Link from "next/link";

export default function ShowcaseSection() {
  const projects = [
    {
      title: "Bengkel Motor Budi Jaya",
      location: "Bogor, Jawa Barat",
      package: "Paket RISE",
      category: "Layanan Otomotif",
      highlight: "140+ Telepon Masuk / Bulan",
      desc: "Sebelumnya tidak terdaftar di Google sama sekali. Ladi membangun website profil 5 halaman dan mengoptimalkan Google Business hingga mencapai peringkat #1 bengkel terdekat.",
      result: "Peringkat #1 Google Maps · Tampil 2.400+ kali / bulan",
    },
    {
      title: "Katering Sari Rasa",
      location: "Depok, Jawa Barat",
      package: "Paket RISE + GUARD",
      category: "Kuliner & Katering",
      highlight: "24 Pesanan Baru dalam 45 Hari",
      desc: "Menghadirkan katalog menu hajatan dan nasi boks yang rapi di HP dengan tombol pemesanan WhatsApp langsung. Dilengkapi laporan kunjungan rutin setiap bulan.",
      result: "Mendapat pesanan kantor rutin dari pencarian Google",
    },
    {
      title: "Klinik Gigi Sejahtera",
      location: "Bogor, Jawa Barat",
      package: "Paket RUN",
      category: "Kesehatan & Medis",
      highlight: "Reservasi Jadwal Mandiri",
      desc: "Sistem reservasi pasien terpadu dan kehadiran resmi terverifikasi di Google. Pasien dapat memilih jam konsultasi dan langsung terhubung ke kasir klinik.",
      result: "Antrean teratur · Profil resmi Google terverifikasi",
    },
    {
      title: "Oleh-Oleh Khas Bogor",
      location: "Bogor, Jawa Barat",
      package: "Paket RUN",
      category: "Retail & UMKM",
      highlight: "Pembayaran QRIS Terintegrasi",
      desc: "Katalog produk khas daerah dengan fitur belanja ringkas dan pembayaran QRIS otomatis. Memudahkan wisatawan membeli oleh-oleh tanpa perlu aplikasi rumit.",
      result: "Transaksi otomatis langsung terhubung ke WhatsApp kasir",
    },
  ];

  return (
    <section id="portofolio" className="py-24 md:py-32 bg-white border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-16 gap-6">
          <div>
            <span className="section-sublabel">
              HASIL KARYA LADI
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0f172a] tracking-tight mt-2">
              Apa yang Sudah <span className="text-[#1853a7]">Kami Bangun</span>
            </h2>
            <div className="decorative-line" />
            <p className="text-slate-600 text-base sm:text-lg max-w-xl">
              Contoh nyata ekosistem digital yang telah kami bangun dan terbukti mendatangkan pelanggan bagi pemilik usaha.
            </p>
          </div>

          <Link
            href="/project"
            className="px-6 py-3 rounded-full bg-white border border-slate-300 hover:border-[#1853a7] text-slate-800 hover:text-[#1853a7] font-bold text-xs uppercase tracking-wider transition-all self-start sm:self-auto shadow-sm"
          >
            Lihat Semua Portofolio →
          </Link>
        </div>

        {/* Projects 2x2 Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((p, i) => (
            <div
              key={i}
              className="p-8 rounded-3xl bg-[#f8fafc] border border-slate-200 shadow-sm corporate-card flex flex-col justify-between space-y-6"
            >
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-mono text-xs px-3 py-1 rounded-full bg-[#1853a7]/10 text-[#1853a7] font-bold">
                    {p.package}
                  </span>
                  <span className="text-xs text-slate-500 font-medium">
                    📍 {p.location}
                  </span>
                </div>

                <div>
                  <h3 className="text-2xl font-extrabold text-[#0f172a] tracking-tight">
                    {p.title}
                  </h3>
                  <div className="text-xs text-[#fa824b] font-bold uppercase mt-1">
                    {p.category}
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {p.desc}
                </p>
              </div>

              {/* Impact Callout */}
              <div className="pt-4 border-t border-slate-200/80 space-y-2">
                <div className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3.5 py-2 rounded-xl border border-emerald-200/60 flex items-center gap-2">
                  <span>📈</span>
                  <span>{p.result}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Portfolio CTA */}
        <div className="mt-16 p-8 rounded-3xl bg-[#1853a7] text-white text-center space-y-3 max-w-2xl mx-auto">
          <h3 className="text-xl sm:text-2xl font-bold">Usaha Anda Ingin Tampil Seperti Mereka?</h3>
          <p className="text-xs sm:text-sm text-slate-200">
            Hubungi kami sekarang untuk mendapatkan penawaran khusus dan konsultasi gratis.
          </p>
          <div className="pt-2">
            <Link
              href="/contact-us"
              className="inline-block px-8 py-3 rounded-full bg-[#fa824b] hover:bg-[#e5723b] text-white font-bold text-xs uppercase tracking-wider shadow-md"
            >
              Mulai Konsultasi Usaha Anda →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
