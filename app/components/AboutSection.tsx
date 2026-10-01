export default function AboutSection() {
  const values = [
    {
      letter: "L",
      name: "Loyalitas",
      desc: "Kami mitra jangka panjang, bukan vendor sekali jadi yang menghilang setelah bayar.",
    },
    {
      letter: "A",
      name: "Akuntabilitas",
      desc: "Semua hasil bisa diukur dengan angka nyata, tanpa istilah teknis yang bikin bingung.",
    },
    {
      letter: "D",
      name: "Dedikasi",
      desc: "Setiap proyek dikerjakan sepenuh hati agar bisnis Anda tampil membanggakan.",
    },
    {
      letter: "I",
      name: "Inovasi",
      desc: "Teknologi yang benar-benar mendatangkan pembeli, bukan sekadar ikut tren.",
    },
  ];

  return (
    <section id="tentang" className="py-24 md:py-32 bg-white border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left: Clear Story & Tagline */}
          <div className="lg:col-span-6 space-y-6">
            <span className="section-sublabel">
              TENTANG LADI (LAYANAN DIGITAL)
            </span>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0f172a] tracking-tight leading-tight">
              &ldquo;Bisnis Kamu, <br />
              <span className="text-[#1853a7]">Dunia Lihat.&rdquo;</span>
            </h2>

            <div className="decorative-line" />

            <p className="text-slate-700 text-base sm:text-lg leading-relaxed font-normal">
              Banyak bisnis bagus di Indonesia yang sepi pelanggan hanya karena <strong>tidak terlihat di internet</strong>. 
            </p>

            <p className="text-slate-600 text-base leading-relaxed">
              Ladi hadir sebagai <strong>teman yang melek teknologi</strong>. Anda tidak perlu repot belajar komputer atau pusing mikirin server. Cukup beritahu kami tentang usaha Anda, dan kami siapkan semuanya agar bisnis Anda bisa diakses dari mana saja.
            </p>

            <div className="pt-2">
              <a
                href="#konsultasi"
                className="inline-flex items-center gap-2 font-bold text-sm text-[#1853a7] hover:text-[#fa824b] transition-colors"
              >
                <span>Konsultasikan Usaha Anda Secara Gratis</span>
                <span>→</span>
              </a>
            </div>
          </div>

          {/* Right: 4 Core Values L.A.D.I with Generous Spacing */}
          <div className="lg:col-span-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {values.map((v) => (
                <div
                  key={v.letter}
                  className="p-6 rounded-2xl bg-[#f8fafc] border border-slate-200/90 shadow-sm corporate-card"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#1853a7] text-white flex items-center justify-center font-extrabold text-lg mb-4 shadow-sm">
                    {v.letter}
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-2">
                    {v.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {v.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
