import Link from "next/link";
import Image from "next/image";
import TopBar from "../components/TopBar";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import WhatsAppButton from "../components/WhatsAppButton";
import { getBlogs } from "@/app/lib/storage";
import { Config } from "@/app/lib/config";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Wawasan & Panduan Bisnis Digital — Ladi (Layanan Digital)",
  description:
    "Kumpulan artikel, tips praktis, dan panduan digitalisasi bisnis, website performa tinggi, dan optimasi peta global untuk pemilik usaha UMKM.",
  alternates: {
    canonical: `${Config.siteUrl}/blog`,
  },
  openGraph: {
    title: "Wawasan & Panduan Bisnis Digital — Ladi (Layanan Digital)",
    description:
      "Artikel dan tips praktis seputar digitalisasi, website, dan pencarian Google untuk pemilik usaha.",
    url: `${Config.siteUrl}/blog`,
    siteName: "Ladi (Layanan Digital)",
    locale: "id_ID",
    type: "website",
  },
};

export default async function BlogIndexPage() {
  const blogs = await getBlogs();
  const baseUrl = Config.siteUrl;

  const blogFallbackImages = [
    "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1000&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1000&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=1000&auto=format&fit=crop&q=80",
  ];

  // Schema.org Turbo SEO: Blog & ItemList
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "Wawasan & Panduan Bisnis Digital Ladi",
    description: "Kumpulan artikel dan panduan praktis digitalisasi bisnis UMKM oleh Ladi",
    url: `${baseUrl}/blog`,
    publisher: {
      "@type": "Organization",
      name: "Ladi (Layanan Digital)",
      logo: {
        "@type": "ImageObject",
        url: `${baseUrl}/logo.png`,
      },
    },
    blogPost: blogs.map((b) => ({
      "@type": "BlogPosting",
      headline: b.title,
      description: b.excerpt,
      url: `${baseUrl}/blog/${b.slug}`,
      datePublished: b.created_at,
      author: {
        "@type": "Organization",
        name: b.author || "Tim Ladi",
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
        {/* Header */}
        <section className="bg-[#0f172a] text-white py-16 lg:py-24 border-b border-slate-800 text-center">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <span className="font-mono text-xs text-[#fa824b] font-bold uppercase tracking-wider block mb-2">
              EDUKASI & TIPS BISNIS
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
              Wawasan Praktis Pemilik Usaha
            </h1>
            <p className="text-slate-300 text-base sm:text-lg mt-3 max-w-xl mx-auto">
              Panduan santai, jelas, dan tanpa istilah rumit seputar membawa usaha Anda eksis di internet global.
            </p>
          </div>
        </section>

        {/* Blog Posts Grid */}
        <section className="py-20 md:py-28">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogs.map((b, idx) => {
                const imageSrc =
                  b.thumb || b.thumb_full || blogFallbackImages[idx % blogFallbackImages.length];

                return (
                  <article
                    key={b.id}
                    className="rounded-3xl bg-white border border-slate-200 shadow-sm corporate-card flex flex-col justify-between overflow-hidden group hover:shadow-xl transition-all duration-300"
                  >
                    <div>
                      {/* Image Thumbnail with Overlay */}
                      <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
                        <Image
                          src={imageSrc}
                          alt={b.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          unoptimized={imageSrc.startsWith("data:") || imageSrc.startsWith("http")}
                        />
                        <div className="absolute top-4 left-4">
                          <span className="px-3 py-1 rounded-full bg-[#fa824b] text-white font-bold text-[10px] tracking-wider uppercase shadow-md">
                            {b.category}
                          </span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-6 sm:p-7 space-y-3">
                        <div className="text-xs font-mono text-slate-400">
                          {b.date}
                        </div>

                        <h2 className="text-xl font-extrabold text-slate-900 leading-snug group-hover:text-[#1853a7] transition-colors line-clamp-2">
                          <Link href={`/blog/${b.slug}`}>
                            {b.title}
                          </Link>
                        </h2>

                        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-3">
                          {b.excerpt}
                        </p>
                      </div>
                    </div>

                    <div className="p-6 sm:p-7 pt-0 flex items-center justify-between border-t border-slate-100 mt-4 text-xs font-medium text-slate-500">
                      <span>Oleh {b.author}</span>

                      <Link
                        href={`/blog/${b.slug}`}
                        className="inline-flex items-center gap-1.5 font-bold text-[#1853a7] group-hover:text-[#fa824b] transition-colors"
                      >
                        <span>Baca Lengkap</span>
                        <span>→</span>
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>

            {/* Bottom Audit Invitation */}
            <div className="mt-16 p-8 sm:p-10 rounded-3xl bg-[#1853a7] text-white text-center space-y-4 max-w-2xl mx-auto shadow-xl">
              <span className="font-mono text-xs text-[#fa824b] font-bold uppercase tracking-wider block">
                AUDIT KEBERADAAN DIGITAL
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold">Ingin Usaha Anda Tampil Resmi di Google?</h3>
              <p className="text-slate-200 text-xs sm:text-sm leading-relaxed">
                Minta audit gratis 15 menit. Tim kami akan tunjukkan apa saja yang perlu dilengkapi agar bisnis Anda mudah ditemukan pelanggan baru.
              </p>
              <div className="pt-2">
                <Link
                  href="/contact-us"
                  className="inline-block px-8 py-3.5 rounded-full bg-[#fa824b] hover:bg-[#e5723b] text-white font-bold text-xs uppercase tracking-wider shadow-md transition-all"
                >
                  Minta Audit Usaha Gratis →
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
