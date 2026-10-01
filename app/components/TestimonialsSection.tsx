export default function TestimonialsSection() {
  const testimonials = [
    {
      quote:
        "Sebelum pakai Ladi, bisnis saya tidak ada di Google sama sekali. Sekarang hampir tiap hari ada yang telepon dari internet. Senang sekali karena tidak perlu pusing mikirin teknis.",
      author: "Pak Budi Santoso",
      business: "Bengkel Motor Budi Jaya · Bogor",
      impact: "140+ Telepon Masuk Tiap Bulan",
    },
    {
      quote:
        "Yang paling saya suka itu Laporan Dampak bulanannya yang dikirim via WhatsApp. Saya bisa lihat langsung angkanya berapa orang yang cari katering saya. Nyata dan transparan!",
      author: "Bu Sari Dewi",
      business: "Katering Sari Rasa · Depok",
      impact: "Langganan Paket RISE & GUARD",
    },
    {
      quote:
        "Dulu pernah bikin website ke orang lain, tapi setelah bayar malah susah dihubungi. Di Ladi beda — mereka ramah, sabar menjelaskan, dan terus mendampingi usaha kami.",
      author: "Pak Ahmad Fauzi",
      business: "Klinik Gigi Keluarga · Bogor",
      impact: "Peringkat Atas Pencarian Google",
    },
  ];

  return (
    <section className="py-24 md:py-32 bg-white border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="section-sublabel">
            PENGALAMAN KLIEN LADI
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0f172a] tracking-tight mt-2">
            Kata Mereka yang Sudah <span className="text-[#1853a7]">Merasakan Hasilnya</span>
          </h2>
          <div className="decorative-line-center" />
          <p className="text-slate-600 text-base sm:text-lg">
            Kepercayaan dibangun dari pendampingan tulus dan hasil kerja yang terbukti.
          </p>
        </div>

        {/* 3 Clear Testimonial Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="p-7 sm:p-8 rounded-3xl bg-[#f8fafc] border border-slate-200 corporate-card flex flex-col justify-between"
            >
              <div>
                {/* 5 Orange Stars */}
                <div className="flex items-center gap-1 mb-5 text-[#fa824b]">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <svg key={j} width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  ))}
                </div>

                <blockquote className="text-slate-700 text-base leading-relaxed mb-6 italic">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
              </div>

              <div>
                <div className="p-2.5 rounded-xl bg-[#1853a7]/10 text-[#1853a7] font-bold text-xs mb-4">
                  {t.impact}
                </div>

                <div className="pt-4 border-t border-slate-200">
                  <div className="font-bold text-slate-900 text-base">{t.author}</div>
                  <div className="text-xs text-slate-500 mt-0.5">{t.business}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
