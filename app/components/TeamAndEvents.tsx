import Link from "next/link";
import { getEvents } from "@/app/lib/storage";

export default async function TeamAndEvents() {
  // Ambil data event langsung dari database (tabel events)
  const events = await getEvents(3);

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
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
        {/* Bagian Tim Ladi */}
        <div>
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

        {/* Bagian Agenda Event & Workshop (Live dari Database) */}
        <div className="pt-10 border-t border-slate-200/80">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-6">
            <div>
              <span className="section-sublabel">
                AGENDA & WORKSHOP
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0f172a] tracking-tight mt-2">
                Pelatihan & <span className="text-[#1853a7]">Sesi Edukasi</span>
              </h2>
              <div className="decorative-line" />
              <p className="text-slate-600 text-base max-w-xl">
                Tingkatkan literasi digital usaha Anda melalui workshop praktis dan klinik konsultasi bisnis.
              </p>
            </div>

            <Link
              href="/events"
              className="px-6 py-3 rounded-full bg-white border border-slate-300 hover:border-[#1853a7] text-slate-800 hover:text-[#1853a7] font-bold text-xs uppercase tracking-wider transition-all self-start sm:self-auto shadow-sm"
            >
              Semua Agenda Event →
            </Link>
          </div>

          {events.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 shadow-sm space-y-2">
              <p className="text-slate-500 text-sm">Belum ada agenda event aktif.</p>
              <Link href="/events" className="text-xs text-[#1853a7] font-bold hover:underline">
                Lihat arsip event →
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {events.map((ev) => (
                <div
                  key={ev.id}
                  className="p-7 rounded-3xl bg-white border border-slate-200 shadow-sm corporate-card flex flex-col justify-between space-y-5"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="px-2.5 py-1 rounded-full bg-[#1853a7]/10 text-[#1853a7] font-bold">
                        {ev.tag}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 leading-snug hover:text-[#1853a7] transition-colors">
                      <Link href={`/events/${ev.id}`}>{ev.title}</Link>
                    </h3>

                    <div className="text-xs text-slate-500 space-y-1">
                      <div className="font-semibold text-slate-700">🗓️ {ev.date}</div>
                      <div>📍 {ev.location}</div>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-3">
                      {ev.short_desc}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <Link
                      href={`/events/${ev.id}`}
                      className="text-xs font-bold text-[#1853a7] hover:text-[#fa824b] transition-colors"
                    >
                      Detail Acara →
                    </Link>
                    <a
                      href={ev.btn_link || `https://wa.me/6281298319944?text=${encodeURIComponent("Halo Ladi, saya ingin daftar event: " + ev.title)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-1.5 rounded-full bg-[#fa824b] hover:bg-[#e5723b] text-white text-[11px] font-bold transition-all"
                    >
                      {ev.btn_text || "Daftar"}
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
