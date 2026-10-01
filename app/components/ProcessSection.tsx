export default function ProcessSection() {
  const steps = [
    {
      num: "01",
      title: "Audit Gratis (15 Menit)",
      desc: "Kirim nama usaha Anda via WhatsApp. Kami periksa 10 titik penting kehadiran digital tanpa pungutan biaya.",
    },
    {
      num: "02",
      title: "Rekomendasi yang Pas",
      desc: "Kami jelaskan apa yang perlu diperbaiki dengan bahasa santai dan paket yang sesuai kebutuhan usaha.",
    },
    {
      num: "03",
      title: "Pengerjaan Cepat & Rapi",
      desc: "Tim Ladi membangun website dan menyiapkan profil Google Anda. Ada update berkala selama proses.",
    },
    {
      num: "04",
      title: "Tayang & Pantau Hasil",
      desc: "Bisnis Anda resmi live. Kami pandu cara pakainya dan kirimkan laporan perkembangannya setiap bulan.",
    },
  ];

  return (
    <section id="metodologi" className="py-24 md:py-32 bg-white border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="section-sublabel">
            CARA KERJA LADI
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0f172a] tracking-tight mt-2">
            Praktis, Cepat, <span className="text-[#1853a7]">Tanpa Ribet</span>
          </h2>
          <div className="decorative-line-center" />
          <p className="text-slate-600 text-base sm:text-lg">
            Semua tahapan teknis diurus oleh tim Ladi. Anda tinggal melihat hasilnya.
          </p>
        </div>

        {/* 4 Steps with Connecting Dotted Line */}
        <div className="relative">
          <div className="hidden lg:block absolute top-10 left-[10%] right-[10%] h-[2px] border-t-2 border-dashed border-[#1853a7]/30 z-0" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
            {steps.map((step, idx) => (
              <div key={step.num} className="text-center flex flex-col items-center">
                <div className="relative mb-5">
                  <div className="w-20 h-20 rounded-2xl bg-[#1853a7] text-white flex items-center justify-center font-extrabold text-2xl shadow-md shadow-[#1853a7]/20">
                    {step.num}
                  </div>
                  <span className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-[#fa824b] text-white text-xs font-bold flex items-center justify-center shadow">
                    {idx + 1}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  {step.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-xs">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Simple Guarantee Box */}
        <div className="mt-16 p-6 rounded-2xl bg-[#f8fafc] border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-full bg-[#fa824b]/15 text-[#fa824b] flex items-center justify-center font-bold text-lg shrink-0">
              🛡️
            </span>
            <div>
              <div className="text-sm font-bold text-slate-900">Sistem DP 50% & Demo Sebelum Launching</div>
              <div className="text-xs text-slate-500">Anda melihat hasil jadinya terlebih dahulu sebelum melakukan pelunasan.</div>
            </div>
          </div>

          <a
            href="#konsultasi"
            className="px-6 py-3 rounded-full bg-[#1853a7] hover:bg-[#0f3d7d] text-white font-bold text-xs uppercase tracking-wider transition-all"
          >
            Mulai dari Langkah 1 →
          </a>
        </div>
      </div>
    </section>
  );
}
