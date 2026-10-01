import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import TopBar from "../../components/TopBar";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import WhatsAppButton from "../../components/WhatsAppButton";
import { getEventById, getEvents } from "@/app/lib/storage";
import { Config } from "@/app/lib/config";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const event = await getEventById(id);
  const baseUrl = Config.siteUrl;

  if (!event) return { title: "Event Tidak Ditemukan — Ladi" };

  return {
    title: `${event.title} | Event & Workshop Ladi`,
    description: event.short_desc,
    alternates: {
      canonical: `${baseUrl}/events/${id}`,
    },
    openGraph: {
      title: `${event.title} | Agenda Edukasi Digital Ladi`,
      description: event.short_desc,
      url: `${baseUrl}/events/${id}`,
      siteName: "Ladi (Layanan Digital)",
      locale: "id_ID",
      type: "website",
      images: event.thumb
        ? [{ url: event.thumb.startsWith("http") ? event.thumb : `${baseUrl}${event.thumb}` }]
        : [{ url: `${baseUrl}/logo.png` }],
    },
    twitter: {
      card: "summary_large_image",
      title: event.title,
      description: event.short_desc,
    },
  };
}

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const event = await getEventById(id);
  const baseUrl = Config.siteUrl;

  if (!event) {
    notFound();
  }

  const allEvents = await getEvents(4);
  const otherEvents = allEvents.filter((e) => String(e.id) !== String(id)).slice(0, 2);

  // Schema.org Turbo SEO Event
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.title,
    description: event.short_desc,
    startDate: event.date,
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: event.location.toLowerCase().includes("zoom")
      ? "https://schema.org/MixedEventAttendanceMode"
      : "https://schema.org/OfflineEventAttendanceMode",
    location: {
      "@type": "Place",
      name: event.location,
      address: {
        "@type": "PostalAddress",
        addressLocality: "Bogor",
        addressRegion: "Jawa Barat",
        addressCountry: "ID",
      },
    },
    organizer: {
      "@type": "Organization",
      name: "Ladi (Layanan Digital)",
      url: baseUrl,
    },
    offers: {
      "@type": "Offer",
      url: event.btn_link || `${baseUrl}/events/${id}`,
      availability: "https://schema.org/InStock",
      validFrom: event.created_at,
    },
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Beranda", item: baseUrl },
      { "@type": "ListItem", position: 2, name: "Event & Workshop", item: `${baseUrl}/events` },
      { "@type": "ListItem", position: 3, name: event.title, item: `${baseUrl}/events/${id}` },
    ],
  };

  const waLink =
    event.btn_link ||
    `https://wa.me/6281298319944?text=${encodeURIComponent(
      `Halo Ladi, saya tertarik untuk mendaftar atau tanya informasi seputar: ${event.title}`
    )}`;

  return (
    <>
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />

      <TopBar />
      <Navbar />

      <main className="bg-[#f8fafc] text-[#0f172a] pb-24">
        {/* Full-width Hero Photo (matching user design image 1) */}
        {event.thumb ? (
          <div className="relative w-full h-[320px] sm:h-[460px] lg:h-[540px] bg-slate-900 overflow-hidden">
            <Image
              src={event.thumb}
              alt={event.title}
              fill
              priority
              className="object-cover opacity-90"
              unoptimized={event.thumb.startsWith("data:") || event.thumb.startsWith("http")}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-[#0f172a]/30 to-transparent" />
            <div className="absolute bottom-6 left-0 right-0 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <span className="inline-block px-3.5 py-1.5 rounded-full bg-[#fa824b] text-white text-xs font-mono font-bold uppercase mb-2 shadow-md">
                {event.tag}
              </span>
              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight drop-shadow-md">
                {event.title}
              </h1>
            </div>
          </div>
        ) : (
          <section className="bg-[#0f172a] text-white py-16 border-b border-slate-800">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <Link
                href="/events"
                className="text-xs text-[#fa824b] font-mono font-bold uppercase mb-3 inline-block hover:underline"
              >
                ← Kembali ke Semua Event
              </Link>
              <span className="inline-block px-3 py-1 rounded-full bg-white/10 text-slate-300 text-xs font-mono font-bold uppercase mb-2 block w-fit">
                {event.tag}
              </span>
              <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
                {event.title}
              </h1>
            </div>
          </section>
        )}

        {/* 2-Column Content Layout (matching user design image 1) */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-14">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Left Column (8 of 12 cols): Overview, Description & Content */}
            <div className="lg:col-span-8 space-y-8">
              <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-sm space-y-6">
                <div>
                  <h2 className="text-2xl font-extrabold text-[#0f172a]">
                    Ringkasan & Gambaran Program
                  </h2>
                  <div className="h-1 w-16 bg-[#1853a7] rounded-full mt-3 mb-6" />
                  <p className="text-base sm:text-lg text-slate-700 leading-relaxed font-medium">
                    {event.short_desc}
                  </p>
                </div>

                {/* Formatted Rich Content */}
                <div
                  className="prose prose-slate max-w-none pt-6 border-t border-slate-100 text-slate-700 space-y-4"
                  dangerouslySetInnerHTML={{ __html: event.description }}
                />
              </div>

              {/* Related / Other Events */}
              {otherEvents.length > 0 && (
                <div className="pt-6 space-y-4">
                  <h3 className="text-xl font-bold text-slate-900">Agenda Event Lainnya</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {otherEvents.map((oe) => (
                      <Link
                        key={oe.id}
                        href={`/events/${oe.id}`}
                        className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-[#1853a7] transition-all corporate-card block"
                      >
                        <span className="text-[11px] font-mono text-[#fa824b] font-bold uppercase">{oe.tag}</span>
                        <h4 className="font-bold text-slate-900 text-base mt-1 line-clamp-1">{oe.title}</h4>
                        <p className="text-xs text-slate-500 mt-1">📍 {oe.location}</p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column (4 of 12 cols): Sticky Contact & Booking Sidebar */}
            <div className="lg:col-span-4">
              <div className="sticky top-28 bg-white rounded-3xl border-t-4 border-[#1853a7] border-x border-b border-slate-200 p-7 sm:p-8 shadow-md space-y-6">
                <div>
                  <h3 className="text-lg font-extrabold text-[#0f172a]">
                    Hubungi Kami untuk Info / Daftar
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Silakan hubungi narahubung resmi Ladi untuk konsultasi atau reservasi tempat.
                  </p>
                </div>

                <div className="space-y-4 text-xs">
                  <div>
                    <span className="text-slate-400 font-mono uppercase block font-semibold">Hotline WhatsApp</span>
                    <span className="font-bold text-slate-800 text-sm">{Config.contactPhone}</span>
                  </div>

                  <div>
                    <span className="text-slate-400 font-mono uppercase block font-semibold">Email</span>
                    <span className="font-bold text-slate-800 text-sm">contact@layanandigital.id</span>
                  </div>

                  <div>
                    <span className="text-slate-400 font-mono uppercase block font-semibold">Lokasi</span>
                    <span className="font-bold text-slate-800 text-sm">{event.location}</span>
                  </div>

                  <div>
                    <span className="text-slate-400 font-mono uppercase block font-semibold">Jadwal / Waktu</span>
                    <span className="font-bold text-[#1853a7] text-sm">{event.date}</span>
                  </div>
                </div>

                <div className="pt-2">
                  <a
                    href={waLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-4 px-6 rounded-full bg-[#1853a7] hover:bg-[#0f3d7d] text-white font-bold text-xs uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-2 text-center"
                  >
                    <span>💬</span>
                    <span>{event.btn_text || "Daftar / Info Lebih Lanjut"}</span>
                  </a>
                </div>

                {/* Social Share & Brand */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-center gap-4 text-slate-400 text-xs">
                  <span>Bagikan Acara:</span>
                  <a
                    href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                      `Informasi Acara: "${event.title}"\n${baseUrl}/events/${id}`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold text-emerald-600 hover:underline"
                  >
                    WhatsApp ↗
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <WhatsAppButton />
    </>
  );
}
