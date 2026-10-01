import Link from "next/link";
import TopBar from "../components/TopBar";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import WhatsAppButton from "../components/WhatsAppButton";
import { getEvents } from "@/app/lib/storage";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Event & Workshop — Ladi (Layanan Digital)",
  description: "Agenda pelatihan, workshop digitalisasi, dan sesi edukasi bisnis dari Ladi untuk UMKM dan pemilik usaha.",
};

export default async function EventsPage() {
  const events = await getEvents();

  return (
    <>
      <TopBar />
      <Navbar />

      <main className="bg-[#f8fafc] text-[#0f172a]">
        {/* Header */}
        <section className="bg-[#0f172a] text-white py-16 lg:py-20 border-b border-slate-800 text-center">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <span className="font-mono text-xs text-[#fa824b] font-bold uppercase tracking-wider block mb-2">
              AGENDA EDUKASI & PELATIHAN
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
              Workshop & Sesi Konsultasi Ladi
            </h1>
            <p className="text-slate-300 text-base sm:text-lg mt-3 max-w-xl mx-auto">
              Tingkatkan kapasitas digital bisnis Anda melalui program edukasi langsung bersama tim Ladi.
            </p>
          </div>
        </section>

        {/* Events Grid */}
        <section className="py-20 md:py-28">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            {events.map((ev) => (
              <div
                key={ev.id}
                className="p-8 sm:p-10 rounded-3xl bg-white border border-slate-200 shadow-sm corporate-card space-y-6"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <span className="font-mono text-xs px-3 py-1 rounded-full bg-[#fa824b]/15 text-[#fa824b] font-bold uppercase">
                    {ev.tag}
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-500">
                    STATUS: AKTIF / TERBUKA
                  </span>
                </div>

                <div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0f172a] tracking-tight">
                    {ev.title}
                  </h2>
                  <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-500 mt-2">
                    <span className="text-[#1853a7]">📅 {ev.date}</span>
                    <span>📍 {ev.location}</span>
                  </div>
                </div>

                <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                  {ev.short_desc}
                </p>

                <div
                  className="prose prose-sm text-xs sm:text-sm text-slate-600 border-t border-slate-100 pt-4"
                  dangerouslySetInnerHTML={{ __html: ev.description }}
                />

                <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <span className="text-xs text-slate-500">
                    Tempat terbatas · Konfirmasi pendaftaran melalui WhatsApp
                  </span>

                  <a
                    href={ev.btn_link || `https://wa.me/6281298319944?text=Halo+Ladi%2C+saya+ingin+mendaftar+${encodeURIComponent(ev.title)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-7 py-3 rounded-full bg-[#fa824b] hover:bg-[#e5723b] text-white font-bold text-xs uppercase tracking-wider shadow-md transition-all"
                  >
                    {ev.btn_text || "Daftar Sekarang"} →
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
      <WhatsAppButton />
    </>
  );
}
