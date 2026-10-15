import Link from "next/link";
import Image from "next/image";
import { getEvents, getTeamMembers } from "@/app/lib/storage";

export default async function TeamAndEvents() {
  // Ambil data event & anggota tim langsung dari database / file storage
  const [events, dynamicTeam] = await Promise.all([
    getEvents(3),
    getTeamMembers(false),
  ]);

  const teamMembers = dynamicTeam.length > 0 ? dynamicTeam : [
    {
      id: 1,
      name: "Cendikia Prananta Ardian",
      role: "Project Lead & Digital Strategist",
      badge: "CEO of Ladi",
      image: "/images/team/team1.jpg",
      desc: "Memastikan arsitektur website prima, SEO maksimal, dan setiap proyek digital selesai tepat waktu dengan standar visual kelas dunia.",
      focus: "Project Leadership & Strategi Bisnis",
    },
    {
      id: 2,
      name: "Hilmi Haroki Ar Rantisi",
      role: "Content Specialist",
      badge: "Design & Visual",
      image: "/images/team/team2.jpg",
      desc: "Menata copywriting promosi, estetika visual foto usaha, serta memastikan konten digital menarik dan memikat calon pembeli.",
      focus: "Visual & Konten Promosi",
    },
  ];

  const fallbackEventImages = [
    "/images/events/event1-workshop.jpg",
    "/images/events/event2-briefing.jpg",
    "/images/events/event3-consultation.jpg",
  ];

  return (
    <section id="tim-event" className="py-24 md:py-32 bg-[#f8fafc] border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24">
        {/* ========================================================================= */}
        {/* BAGIAN 1: OUR TEAM (TIM DI BALIK LADI) - PURELY INFORMATIVE */}
        {/* ========================================================================= */}
        <div>
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="section-sublabel">
              OUR TEAM · TIM DI BALIK LADI
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0f172a] tracking-tight mt-2">
              Our Team: <span className="text-[#1853a7]">Muda, Tanggap & Berdedikasi</span>
            </h2>
            <div className="decorative-line-center" />
            <p className="text-slate-600 text-base sm:text-lg">
              Didukung oleh talenta unggulan PPLG SMK Wikrama Bogor dengan bimbingan praktisi bisnis berpengalaman, kami hadir mendampingi digitalisasi usaha Anda.
            </p>
          </div>

          {/* Dynamic Team Profile Cards (Informative Apple/iPhone aesthetic, No CTA button) */}
          <div className={`grid gap-8 ${
            teamMembers.length === 1
              ? "grid-cols-1 max-w-md mx-auto"
              : teamMembers.length === 2
              ? "grid-cols-1 md:grid-cols-2 max-w-3xl mx-auto"
              : "grid-cols-1 md:grid-cols-3"
          }`}>
            {teamMembers.map((member) => {
              const memberImg = member.image || "/images/team/team1.jpg";
              return (
                <div
                  key={member.id}
                  className="group p-8 rounded-3xl bg-white border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300 corporate-card flex flex-col items-center text-center relative overflow-hidden"
                >
                  {/* Accent top gradient border */}
                  <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-[#1853a7] via-[#fa824b] to-[#1853a7] opacity-0 group-hover:opacity-100 transition-opacity" />

                  {/* Team Avatar */}
                  <div className="relative w-28 h-28 mb-5">
                    <div className="w-full h-full rounded-2xl overflow-hidden ring-4 ring-slate-100 group-hover:ring-[#1853a7]/30 transition-all shadow-md relative bg-slate-100">
                      <Image
                        src={memberImg}
                        alt={member.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="112px"
                        loading="lazy"
                        unoptimized={memberImg.startsWith("data:") || memberImg.startsWith("http")}
                      />
                    </div>
                  </div>

                  {/* Role Badge */}
                  <div className="mb-2">
                    <span className="px-3 py-1 rounded-full bg-[#1853a7]/10 text-[#1853a7] font-bold text-[11px] tracking-wide uppercase">
                      {member.badge || "Tim Ladi"}
                    </span>
                  </div>

                  {/* Name */}
                  <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
                    {member.name}
                  </h3>

                  {/* Subtitle Role */}
                  <p className="text-xs font-semibold text-[#c2410c] mt-0.5 mb-3.5">
                    {member.role}
                  </p>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {member.desc}
                  </p>

                  {/* Purely Informative Footer (No CTA / No WA Link) */}
                  <div className="mt-6 pt-4 w-full border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                    <span className="text-[11px] font-medium text-slate-600">
                      Bidang Keahlian:
                    </span>
                    <span className="font-semibold text-slate-700 text-[11px] bg-slate-100 px-2.5 py-0.5 rounded-md">
                      {member.focus || "Digital Specialist"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* BAGIAN 2: AGENDA EVENT & WORKSHOP (DENGAN FOTO VISUAL PELATIHAN) */}
        {/* ========================================================================= */}
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
                Tingkatkan literasi digital usaha Anda melalui pelatihan langsung, bedah profil Google, dan klinik konsultasi bisnis bersama tim Ladi.
              </p>
            </div>

            <Link
              href="/events"
              aria-label="Lihat semua agenda event dan workshop Ladi"
              className="px-6 py-3 rounded-full bg-white border border-slate-300 hover:border-[#1853a7] text-slate-800 hover:text-[#1853a7] font-bold text-xs uppercase tracking-wider transition-all self-start sm:self-auto shadow-sm"
            >
              Semua Agenda Event →
            </Link>
          </div>

          {events.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 shadow-sm space-y-2">
              <p className="text-slate-600 text-sm">Belum ada agenda event aktif.</p>
              <Link href="/events" aria-label="Lihat arsip event Ladi" className="text-xs text-[#1853a7] font-bold hover:underline">
                Lihat arsip event →
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {events.map((ev, i) => {
                const eventImg = ev.thumb || fallbackEventImages[i % fallbackEventImages.length];

                return (
                  <div
                    key={ev.id}
                    className="bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 corporate-card flex flex-col justify-between overflow-hidden group"
                  >
                    <div>
                      {/* Visual Photo of Workshop / Training Session */}
                      <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
                        <Image
                          src={eventImg}
                          alt={ev.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          sizes="(max-width: 768px) 100vw, 33vw"
                          loading="lazy"
                          unoptimized={eventImg.startsWith("data:") || eventImg.startsWith("http")}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

                        {/* Event Category Tag Pill */}
                        <div className="absolute top-3.5 left-3.5">
                          <span className="px-3 py-1 rounded-full bg-[#1853a7] text-white font-bold text-[11px] tracking-wide shadow-md uppercase">
                            {ev.tag || "Pelatihan"}
                          </span>
                        </div>

                        {/* Status Open Pill */}
                        <div className="absolute top-3.5 right-3.5">
                          <span className="px-2.5 py-0.5 rounded-full bg-emerald-800 text-white font-bold text-[10px] tracking-wider uppercase shadow-md flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_4px_#ffffff]" />
                            Terbuka
                          </span>
                        </div>
                      </div>

                      {/* Card Content */}
                      <div className="p-6 sm:p-7 space-y-3.5">
                        <div className="space-y-1 text-xs text-slate-600">
                          <div className="flex items-center gap-2 font-semibold text-[#1853a7]">
                            <span>🗓️</span>
                            <span className="truncate">{ev.date}</span>
                          </div>
                          <div className="flex items-center gap-2 font-medium text-slate-700">
                            <span>📍</span>
                            <span className="truncate">{ev.location}</span>
                          </div>
                        </div>

                        <h3 className="text-lg font-bold text-slate-900 leading-snug group-hover:text-[#1853a7] transition-colors line-clamp-2">
                          <Link href={`/events/${ev.id}`}>{ev.title}</Link>
                        </h3>

                        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-3">
                          {ev.short_desc}
                        </p>
                      </div>
                    </div>

                    {/* Card Actions Footer */}
                    <div className="p-6 pt-0 border-t border-slate-100 flex items-center justify-between mt-4">
                      <Link
                        href={`/events/${ev.id}`}
                        aria-label={`Detail acara workshop: ${ev.title}`}
                        className="text-xs font-bold text-[#1853a7] hover:text-[#c2410c] transition-colors"
                      >
                        Detail Acara →
                      </Link>
                      <a
                        href={ev.btn_link || `https://wa.me/6282112477119?text=${encodeURIComponent("Halo Ladi, saya ingin daftar event: " + ev.title)}`}
                        aria-label={`Daftar sekarang untuk event: ${ev.title}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 rounded-full bg-[#c2410c] hover:bg-[#9a3412] text-white text-xs font-bold transition-all shadow-sm"
                      >
                        {ev.btn_text || "Daftar Sekarang"}
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
