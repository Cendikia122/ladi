export default function TeamAndEvents() {
  const team = [
    {
      role: "Project Lead & Founder",
      desc: "Memastikan setiap proyek selesai tepat waktu dan memiliki standar visual terbaik.",
    },
    {
      role: "Frontend Developer",
      desc: "Membangun website yang ringan, cepat dibuka di HP jadul maupun modern, dan bebas error.",
    },
    {
      role: "Design & Digital Strategy",
      desc: "Menata foto produk dan kata-kata promosi agar menarik minat calon pembeli.",
    },
  ];

  return (
    <section id="tim-event" className="py-24 md:py-32 bg-[#f8fafc] border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="section-sublabel">
            TIM DI BALIK LADI
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0f172a] tracking-tight mt-2">
            Muda, Tanggap, dan <span className="text-[#1853a7]">Bisa Diandalkan</span>
          </h2>
          <div className="decorative-line-center" />
          <p className="text-slate-600 text-base sm:text-lg">
            Didukung oleh talenta PPLG Wikrama Bogor dan bimbingan praktisi bisnis, kami siap mendampingi usaha Anda.
          </p>
        </div>

        {/* 3 Team Focus Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {team.map((m, i) => (
            <div
              key={i}
              className="p-7 rounded-3xl bg-white border border-slate-200 shadow-sm corporate-card text-center flex flex-col items-center"
            >
              <div className="w-14 h-14 rounded-2xl bg-[#1853a7] text-white flex items-center justify-center font-extrabold text-xl mb-4 shadow-sm">
                0{i + 1}
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                {m.role}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {m.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
