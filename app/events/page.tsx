import Link from "next/link";
import Image from "next/image";
import TopBar from "../components/TopBar";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import WhatsAppButton from "../components/WhatsAppButton";
import { getEvents } from "@/app/lib/storage";
import { Config } from "@/app/lib/config";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Event & Workshop Digitalisasi Bisnis — Ladi (Layanan Digital)",
  description:
    "Agenda pelatihan, workshop digitalisasi UMKM, dan sesi edukasi bisnis dari Ladi di Bogor dan online. Dampingi usaha Anda tumbuh pesat di internet global.",
  alternates: {
    canonical: `${Config.siteUrl}/events`,
  },
  openGraph: {
    title: "Event & Workshop Digitalisasi Bisnis — Ladi (Layanan Digital)",
    description:
      "Agenda pelatihan, workshop digitalisasi UMKM, dan sesi edukasi bisnis dari Ladi di Bogor dan online.",
    url: `${Config.siteUrl}/events`,
    siteName: "Ladi (Layanan Digital)",
    locale: "id_ID",
    type: "website",
  },
};

export default async function EventsPage() {
  const events = await getEvents();
  const baseUrl = Config.siteUrl;

  const eventFallbackImages = [
    "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1000&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=1000&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=1000&auto=format&fit=crop&q=80",
  ];

  // Schema.org Turbo SEO: ItemList of Events
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Agenda Event & Workshop Ladi",
    description: "Daftar workshop dan seminar digitalisasi bisnis UMKM oleh Ladi",
    itemListElement: events.map((ev, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      item: {
        "@type": "Event",
        name: ev.title,
        description: ev.short_desc,
        startDate: ev.date,
        url: `${baseUrl}/events/${ev.id}`,
        location: {
          "@type": "Place",
          name: ev.location,
        },
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <TopBar />
      <Navbar />

      <main className="bg-[#f8fafc] text-[#0f172a]">
        {/* Header Hero */}
        <section className="bg-[#0f172a] text-white py-16 lg:py-24 border-b border-slate-800 text-center">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <span className="font-mono text-xs text-[#fa824b] font-bold uppercase tracking-wider block mb-2">
              AGENDA EDUKASI & WORKSHOP
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
              Workshop & Sesi Pelatihan Ladi
            </h1>
            <p className="text-slate-300 text-base sm:text-lg mt-3 max-w-2xl mx-auto">
              Pelajari strategi nyata membuat bisnis Anda dikenal di Google, media sosial, dan internet global bersama tim pendamping Ladi.
            </p>
          </div>
        </section>

        {/* Events Grid (Matching Design media_1790837119700.png) */}
        <section className="py-20 md:py-28">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            {events.length === 0 ? (
              <div className="p-16 text-center bg-white rounded-3xl border border-slate-200 shadow-sm space-y-4 max-w-xl mx-auto">
                <span className="text-4xl block">📅</span>
                <h3 className="text-xl font-bold text-slate-800">Belum Ada Agenda Mendatang</h3>
                <p className="text-sm text-slate-500">
                  Agenda baru sedang disiapkan oleh tim. Hubungi kami langsung jika ingin mengadakan pelatihan khusus di lokasi usaha Anda.
                </p>
                <a
                  href="https://wa.me/6281298319944?text=Halo+Ladi%2C+saya+tertarik+mengadakan+workshop+digitalisasi"
                  className="inline-block px-6 py-3 rounded-full bg-[#1853a7] text-white font-bold text-xs uppercase tracking-wider"
                >
                  Hubungi Admin via WhatsApp →
                </a>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {events.map((ev, index) => {
                  const imageSrc =
                    ev.thumb || eventFallbackImages[index % eventFallbackImages.length];

                  return (
                    <div
                      key={ev.id}
                      className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
                    >
                      <div>
                        {/* Thumbnail Image with Tag Overlay */}
                        <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
                          <Image
                            src={imageSrc}
                            alt={ev.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                            unoptimized={imageSrc.startsWith("data:") || imageSrc.startsWith("http")}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

                          {/* Category Badge Pill */}
                          <div className="absolute top-4 left-4">
                            <span className="px-3 py-1 rounded-full bg-[#1853a7] text-white font-bold text-[11px] tracking-wide shadow-md uppercase">
                              {ev.tag || "Workshop"}
                            </span>
                          </div>

                          {/* Status Pill */}
                          <div className="absolute top-4 right-4">
                            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500 text-white font-bold text-[10px] tracking-wider uppercase shadow-md flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                              Terbuka
                            </span>
                          </div>
                        </div>

                        {/* Card Body */}
                        <div className="p-6 sm:p-7 space-y-4">
                          {/* Date & Location Badges */}
                          <div className="space-y-1.5 text-xs text-slate-500">
                            <div className="flex items-center gap-2 font-semibold text-[#1853a7]">
                              <span className="shrink-0 text-sm">📅</span>
                              <span className="truncate">{ev.date}</span>
                            </div>
                            <div className="flex items-center gap-2 font-medium text-slate-600">
                              <span className="shrink-0 text-sm">📍</span>
                              <span className="truncate">{ev.location}</span>
                            </div>
                          </div>

                          {/* Title */}
                          <h2 className="text-xl font-extrabold text-[#0f172a] group-hover:text-[#1853a7] transition-colors leading-snug line-clamp-2">
                            <Link href={`/events/${ev.id}`}>
                              {ev.title}
                            </Link>
                          </h2>

                          {/* Short Description */}
                          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-3">
                            {ev.short_desc}
                          </p>
                        </div>
                      </div>

                      {/* Card Footer Dual Actions (Matching media_1790837119700.png) */}
                      <div className="p-6 pt-0 border-t border-slate-100 mt-4 space-y-2.5">
                        <Link
                          href={`/events/${ev.id}`}
                          className="w-full block py-2.5 rounded-xl border border-slate-200 hover:border-[#1853a7] hover:bg-blue-50/50 text-[#1853a7] font-bold text-xs uppercase tracking-wider text-center transition-all"
                        >
                          Lihat Rincian Program →
                        </Link>

                        <a
                          href={
                            ev.btn_link ||
                            `https://wa.me/6281298319944?text=Halo+Ladi%2C+saya+ingin+reservasi+jadwal+event%3A+${encodeURIComponent(
                              ev.title
                            )}`
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full block py-2.5 rounded-xl bg-[#fa824b] hover:bg-[#e5723b] text-white font-bold text-xs uppercase tracking-wider text-center shadow-sm transition-all"
                        >
                          {ev.btn_text || "Reservasi Tanggal / WhatsApp"}
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
      <WhatsAppButton />
    </>
  );
}
