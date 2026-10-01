import Link from "next/link";
import Image from "next/image";
import TopBar from "../components/TopBar";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import WhatsAppButton from "../components/WhatsAppButton";
import { getProjects } from "@/app/lib/storage";
import { Config } from "@/app/lib/config";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Portofolio & Studi Kasus Klien — Ladi (Layanan Digital)",
  description:
    "Lihat hasil nyata ekosistem digital, website performa tinggi, dan optimasi peta global yang telah dibangun oleh Ladi untuk mitra bisnis UMKM di Indonesia.",
  alternates: {
    canonical: `${Config.siteUrl}/project`,
  },
  openGraph: {
    title: "Portofolio & Studi Kasus Klien — Ladi (Layanan Digital)",
    description:
      "Lihat hasil nyata ekosistem digital, website performa tinggi, dan optimasi peta global yang telah dibangun oleh Ladi untuk mitra bisnis di Indonesia.",
    url: `${Config.siteUrl}/project`,
    siteName: "Ladi (Layanan Digital)",
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Portofolio & Studi Kasus Klien — Ladi (Layanan Digital)",
    description:
      "Lihat hasil nyata ekosistem digital dan website yang telah dibangun oleh Ladi untuk mitra bisnis di Indonesia.",
  },
};

export default async function ProjectPage() {
  const projects = await getProjects();
  const baseUrl = Config.siteUrl;

  const projectFallbacks = [
    "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1000&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1556740738-b6a63e27c4df?w=1000&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=1000&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=1000&auto=format&fit=crop&q=80",
  ];

  // Schema.org Turbo SEO: ItemList of CreativeWorks / Case Studies
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Portofolio Studi Kasus Digitalisasi Bisnis Ladi",
    description: "Kumpulan karya dan dampak bisnis nyata website serta integrasi peta Google yang dibangun oleh Ladi.",
    url: `${baseUrl}/project`,
    itemListElement: projects.map((proj, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      item: {
        "@type": "CreativeWork",
        name: proj.title,
        description: proj.summary || proj.results,
        url: proj.website_url || `${baseUrl}/project#${proj.slug}`,
        creator: {
          "@type": "Organization",
          name: "Ladi (Layanan Digital)",
          url: baseUrl,
        },
        about: {
          "@type": "LocalBusiness",
          name: proj.client_name,
          address: proj.client_location,
        },
      },
    })),
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Beranda", item: baseUrl },
      { "@type": "ListItem", position: 2, name: "Portofolio", item: `${baseUrl}/project` },
    ],
  };

  return (
    <>
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

      <main className="bg-[#f8fafc] text-[#0f172a]">
        {/* Header Hero */}
        <section className="bg-[#0f172a] text-white py-16 lg:py-24 border-b border-slate-800 text-center">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <span className="font-mono text-xs text-[#fa824b] font-bold uppercase tracking-wider block mb-2">
              KARYA & HASIL NYATA
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
              Portofolio Digital & Studi Kasus
            </h1>
            <p className="text-slate-300 text-base sm:text-lg mt-3 max-w-2xl mx-auto">
              Bukti nyata bagaimana Ladi membantu bisnis lokal dari nol hingga hidup, terpercaya, dan mendatangkan pelanggan terus-menerus di internet global.
            </p>
          </div>
        </section>

        {/* Case Studies List */}
        <section className="py-20 md:py-28">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            {projects.length === 0 ? (
              <div className="p-16 text-center bg-white rounded-3xl border border-slate-200 shadow-sm space-y-4 max-w-xl mx-auto">
                <span className="text-4xl block">💼</span>
                <h3 className="text-xl font-bold text-slate-800">Portofolio Sedang Diperbarui</h3>
                <p className="text-sm text-slate-500">
                  Studi kasus terbaru sedang ditambahkan oleh tim Ladi. Anda dapat menghubungi tim kami untuk melihat demo langsung.
                </p>
              </div>
            ) : (
              projects.map((item, idx) => {
                const imageSrc =
                  item.thumb || projectFallbacks[idx % projectFallbacks.length];

                return (
                  <div
                    key={item.id}
                    id={item.slug}
                    className="p-6 sm:p-10 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-8 corporate-card overflow-hidden"
                  >
                    {/* Top Row: Index, Title & Client Info */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-6">
                      <div className="flex items-start gap-4">
                        <span className="w-10 h-10 rounded-2xl bg-[#1853a7] text-white flex items-center justify-center font-extrabold text-sm shrink-0 shadow-sm">
                          0{idx + 1}
                        </span>
                        <div>
                          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                            {item.title}
                          </h2>
                          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-500 mt-1">
                            <span className="text-slate-800 font-bold">{item.client_name}</span>
                            <span>•</span>
                            <span className="text-[#fa824b] uppercase font-bold">{item.client_industry}</span>
                            <span>•</span>
                            <span>📍 {item.client_location}</span>
                            <span>•</span>
                            <span className="font-mono text-slate-400">{item.year || "2026"}</span>
                          </div>
                        </div>
                      </div>

                      {/* Website Live Link Button */}
                      {item.website_url && (
                        <a
                          href={item.website_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-5 py-2.5 rounded-full border border-slate-300 hover:border-[#1853a7] hover:bg-blue-50/50 text-[#1853a7] font-bold text-xs inline-flex items-center gap-1.5 transition-all self-start md:self-center shrink-0 shadow-sm"
                        >
                          <span>Kunjungi Website Klien</span>
                          <span className="text-sm">↗</span>
                        </a>
                      )}
                    </div>

                    {/* Preview Image Banner */}
                    <div className="relative aspect-[21/9] sm:aspect-[24/9] w-full rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shadow-inner">
                      <Image
                        src={imageSrc}
                        alt={item.title}
                        fill
                        className="object-cover"
                        unoptimized={imageSrc.startsWith("data:") || imageSrc.startsWith("http")}
                      />
                    </div>

                    {/* Problem, Solution, Impact Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs sm:text-sm">
                      <div className="p-6 rounded-2xl bg-[#f8fafc] border border-slate-200/80 space-y-2">
                        <span className="font-bold text-red-600 uppercase font-mono text-[11px] block">
                          ⚠️ Tantangan Klien:
                        </span>
                        <div
                          className="text-slate-600 leading-relaxed prose prose-xs"
                          dangerouslySetInnerHTML={{ __html: item.challenge || "<p>Belum ada kehadiran digital terstruktur.</p>" }}
                        />
                      </div>

                      <div className="p-6 rounded-2xl bg-[#f8fafc] border border-slate-200/80 space-y-2">
                        <span className="font-bold text-[#1853a7] uppercase font-mono text-[11px] block">
                          🛠️ Solusi Ladi:
                        </span>
                        <div
                          className="text-slate-600 leading-relaxed prose prose-xs"
                          dangerouslySetInnerHTML={{ __html: item.solution || "<p>Implementasi website cepat dan Google Business.</p>" }}
                        />
                      </div>

                      <div className="p-6 rounded-2xl bg-emerald-50/80 border border-emerald-200 space-y-2">
                        <span className="font-bold text-emerald-800 uppercase font-mono text-[11px] block">
                          📈 Hasil Nyata Klien:
                        </span>
                        <p className="text-emerald-950 font-bold leading-relaxed text-sm">
                          {item.results}
                        </p>
                      </div>
                    </div>

                    {/* Bottom Action Bar */}
                    <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-100">
                      <div className="text-xs text-slate-500 text-center sm:text-left">
                        {item.summary && (
                          <span className="block italic text-slate-600">
                            &ldquo;{item.summary}&rdquo;
                          </span>
                        )}
                      </div>

                      <a
                        href={`https://wa.me/6281298319944?text=Halo+Ladi%2C+saya+tertarik+membuat+website+seperti+studi+kasus+${encodeURIComponent(
                          item.title
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-6 py-3 rounded-full bg-[#fa824b] hover:bg-[#e5723b] text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md shrink-0"
                      >
                        Konsultasikan Usaha Serupa →
                      </a>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>

        {/* Bottom Banner CTA */}
        <section className="pb-24 pt-4">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="p-10 rounded-3xl bg-[#0f172a] text-white text-center space-y-4 shadow-xl">
              <span className="font-mono text-xs text-[#fa824b] font-bold uppercase tracking-wider block">
                MEMULAI LANGKAH DIGITAL ANDA
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold">
                Ingin Bisnis Anda Memiliki Hasil Nyata Seperti Ini?
              </h2>
              <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto">
                Konsultasikan kebutuhan usaha Anda bersama tim Ladi. Kami siap merancang website dan kehadiran online terbaik tanpa kerumitan teknis.
              </p>
              <div className="pt-2">
                <Link
                  href="/contact-us"
                  className="inline-block px-8 py-3.5 rounded-full bg-[#fa824b] hover:bg-[#e5723b] text-white font-bold text-xs uppercase tracking-wider shadow-lg transition-all"
                >
                  Hubungi Tim Ladi Sekarang →
                </Link>
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
