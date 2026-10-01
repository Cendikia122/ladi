import Link from "next/link";
import { notFound } from "next/navigation";
import TopBar from "../../components/TopBar";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import WhatsAppButton from "../../components/WhatsAppButton";
import { getBlogBySlug, getBlogs } from "@/app/lib/storage";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ladi.id";

  if (!blog) return { title: "Artikel Tidak Ditemukan — Ladi" };

  return {
    title: `${blog.title} — Ladi (Layanan Digital)`,
    description: blog.excerpt,
    alternates: {
      canonical: `${baseUrl}/blog/${slug}`,
    },
    openGraph: {
      title: blog.title,
      description: blog.excerpt,
      url: `${baseUrl}/blog/${slug}`,
      siteName: "Ladi (Layanan Digital)",
      locale: "id_ID",
      type: "article",
      publishedTime: blog.created_at,
      authors: [blog.author],
    },
  };
}

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ladi.id";

  if (!blog) {
    notFound();
  }

  const allBlogs = await getBlogs(4);
  const related = allBlogs.filter((b) => b.slug !== slug).slice(0, 2);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: blog.title,
    description: blog.excerpt,
    datePublished: blog.created_at,
    dateModified: blog.updated_at || blog.created_at,
    author: {
      "@type": "Organization",
      name: blog.author || "Tim Ladi",
    },
    publisher: {
      "@type": "Organization",
      name: "Ladi (Layanan Digital)",
      logo: {
        "@type": "ImageObject",
        url: `${baseUrl}/logo.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${baseUrl}/blog/${slug}`,
    },
  };

  const shareText = encodeURIComponent(
    `Baca artikel bermanfaat ini: "${blog.title}"\n${baseUrl}/blog/${slug}`
  );
  const shareWaUrl = `https://api.whatsapp.com/send?text=${shareText}`;

  return (
    <>
      {/* Schema.org JSON-LD for Google SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <TopBar />
      <Navbar />

      <main className="bg-[#f8fafc] text-[#0f172a]">
        {/* Article Header */}
        <section className="bg-[#0f172a] text-white py-16 lg:py-24 border-b border-slate-800">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link
              href="/blog"
              className="inline-flex items-center gap-1.5 text-xs text-[#fa824b] font-mono font-bold uppercase mb-4 hover:underline"
            >
              ← Kembali ke Arsip Wawasan
            </Link>

            <span className="font-mono text-xs text-slate-400 block mb-2">
              {blog.category} · {blog.date}
            </span>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
              {blog.title}
            </h1>

            <div className="flex items-center justify-between flex-wrap gap-4 pt-6 mt-6 border-t border-slate-800 text-xs text-slate-300">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#1853a7] text-white flex items-center justify-center font-bold">
                  L
                </div>
                <div>
                  <span className="font-bold text-white block">Ditulis oleh {blog.author}</span>
                  <span className="text-slate-400">Tim Edukasi Ladi (Layanan Digital)</span>
                </div>
              </div>

              <a
                href={shareWaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-600/90 hover:bg-emerald-600 text-white font-bold text-[11px] transition-colors"
              >
                <span>Bagikan via WhatsApp ↗</span>
              </a>
            </div>
          </div>
        </section>

        {/* Article Body */}
        <article className="py-16 md:py-24">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-sm space-y-6 text-base sm:text-lg leading-relaxed text-slate-700">
              <div
                className="prose prose-slate max-w-none space-y-5"
                dangerouslySetInnerHTML={{ __html: blog.content }}
              />

              {/* Share & Tag Footer */}
              <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
                <div className="text-slate-500">
                  <span className="font-bold text-slate-700">Topik:</span> {blog.tags || "Digitalisasi, UMKM"}
                </div>
                <a
                  href={shareWaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-700 hover:text-emerald-800 font-bold inline-flex items-center gap-1"
                >
                  Bagikan artikel ini ke WhatsApp Rekan Anda →
                </a>
              </div>

              {/* Consultation Callout at Article End */}
              <div className="mt-12 p-8 rounded-2xl bg-[#f8fafc] border-2 border-[#1853a7]/30 text-center space-y-3">
                <span className="text-xs font-bold text-[#fa824b] uppercase font-mono">
                  SOLUSI PRAKTIS UNTUK BISNIS ANDA
                </span>
                <h3 className="text-2xl font-bold text-[#0f172a]">
                  Mau Bisnis Anda Segera Hadir di Internet?
                </h3>
                <p className="text-sm text-slate-600 max-w-md mx-auto">
                  Jangan buang waktu coba-coba sendiri. Tim Ladi siap membantu memeriksa dan membangun ekosistem digital untuk Anda.
                </p>
                <div className="pt-2">
                  <a
                    href="https://wa.me/6281298319944?text=Halo+Ladi%2C+saya+baru+baca+artikel+di+website+dan+mau+konsultasi."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block px-7 py-3 rounded-full bg-[#fa824b] hover:bg-[#e5723b] text-white font-bold text-xs uppercase tracking-wider shadow-md"
                  >
                    Konsultasi Gratis via WhatsApp →
                  </a>
                </div>
              </div>
            </div>

            {/* Related Articles */}
            {related.length > 0 && (
              <div className="mt-16 space-y-6">
                <h3 className="text-xl font-bold text-slate-900">Artikel Pilihan Lainnya</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {related.map((r) => (
                    <div key={r.id} className="p-6 rounded-2xl bg-white border border-slate-200 corporate-card">
                      <span className="text-[11px] font-mono text-[#fa824b] font-bold uppercase">{r.category}</span>
                      <h4 className="font-bold text-base text-slate-900 mt-1 mb-2 hover:text-[#1853a7]">
                        <Link href={`/blog/${r.slug}`}>{r.title}</Link>
                      </h4>
                      <p className="text-xs text-slate-600 line-clamp-2">{r.excerpt}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </article>
      </main>

      <Footer />
      <WhatsAppButton />
    </>
  );
}
