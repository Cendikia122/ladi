export default function WhyChooseSection() {
  const points = [
    {
      title: "Bukan Vendor Sekali Jadi, Kami Mendampingi",
      desc: "Freelancer lain selesai buat langsung pergi. Ladi terus mendampingi bisnis Anda dan siap dihubungi jika butuh bantuan.",
    },
    {
      title: "Laporan Dampak Nyata Setiap Bulan",
      desc: "Anda menerima laporan jelas di WhatsApp: berapa banyak orang yang mencari, melihat, dan menelepon usaha Anda.",
    },
    {
      title: "Tanpa Bahasa Komputer yang Membingungkan",
      desc: "Kami gunakan bahasa bisnis sehari-hari yang mudah dipahami. Anda tidak perlu pusing soal istilah teknis.",
    },
    {
      title: "Hak Milik Penuh Aset Anda",
      desc: "Nama website, domain, dan isi konten 100% milik Anda seutuhnya. Tidak ada sistem sewa tersembunyi.",
    },
  ];

  return (
    <section id="keunggulan" className="py-24 md:py-32 bg-[#f8fafc] border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: 4 Key Points */}
          <div className="lg:col-span-7 space-y-6">
            <span className="section-sublabel">
              MENGAPA PILIH LADI
            </span>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0f172a] tracking-tight leading-tight">
              Bukan Cuma Bikin Website, <br />
              <span className="text-[#1853a7]">Kami Dampingi Usaha Anda.</span>
            </h2>

            <div className="decorative-line" />

            <div className="space-y-4 pt-2">
              {points.map((pt, i) => (
                <div
                  key={i}
                  className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex items-start gap-4 corporate-card"
                >
                  <div className="w-8 h-8 rounded-full bg-[#fa824b]/15 text-[#fa824b] font-bold text-sm flex items-center justify-center shrink-0 mt-0.5">
                    ✓
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      {pt.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                      {pt.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Comparison Card (Vendor Lain vs Ladi) */}
          <div className="lg:col-span-5">
            <div className="rounded-3xl bg-[#0f172a] text-white p-7 sm:p-8 shadow-2xl border border-slate-800 space-y-6">
              <div>
                <span className="text-xs font-mono text-[#fa824b] font-bold uppercase tracking-wider block mb-1">
                  PERBEDAAN NYATA
                </span>
                <h3 className="text-2xl font-bold text-white">
                  Vendor Biasa vs Ladi
                </h3>
              </div>

              <div className="space-y-4 text-xs sm:text-sm pt-2 border-t border-slate-800">
                <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/80">
                  <div className="text-slate-400">Vendor / Jasa Lain:</div>
                  <div className="text-slate-200 font-semibold mt-1">✗ Selesai bikin website, urusan selesai.</div>
                </div>

                <div className="p-3.5 rounded-xl bg-[#1853a7]/30 border border-[#1853a7]/60">
                  <div className="text-[#fa824b] font-bold">Ladi (Layanan Digital):</div>
                  <div className="text-white font-semibold mt-1">✓ Dibuatkan, dirawat, dan dilaporkan dampaknya tiap bulan.</div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/80">
                  <div className="text-slate-400">Vendor / Jasa Lain:</div>
                  <div className="text-slate-200 font-semibold mt-1">✗ Bahasa teknis sulit dimengerti.</div>
                </div>

                <div className="p-3.5 rounded-xl bg-[#1853a7]/30 border border-[#1853a7]/60">
                  <div className="text-[#fa824b] font-bold">Ladi (Layanan Digital):</div>
                  <div className="text-white font-semibold mt-1">✓ Komunikasi santai dan langsung bantu atasi masalah Anda.</div>
                </div>
              </div>

              <div className="pt-2">
                <a
                  href="#konsultasi"
                  className="block w-full py-3.5 text-center rounded-full bg-[#fa824b] hover:bg-[#e5723b] text-white font-bold text-xs uppercase tracking-wider transition-all"
                >
                  Konsultasi dengan Teman Ladi →
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
