import Link from "next/link";
import TopBar from "../components/TopBar";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import WhatsAppButton from "../components/WhatsAppButton";
import { getBlogs } from "@/app/lib/storage";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Wawasan & Tips Bisnis — Ladi (Layanan Digital)",
  description: "Artikel dan tips praktis seputar digitalisasi, website, dan pencarian Google untuk pemilik usaha.",
};

export default async function BlogIndexPage() {
  const blogs = await getBlogs();

  return (
    <>
      <TopBar />
      <Navbar />

      <main className="bg-[#f8fafc] text-[#0f172a]">
        {/* Header */}
        <section className="bg-[#0f172a] text-white py-16 lg:py-20 border-b border-slate-800 text-center">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <span className="font-mono text-xs text-[#fa824b] font-bold uppercase tracking-wider block mb-2">
              EDUKASI & TIPS BISNIS
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
              Wawasan Praktis Pemilik Usaha
            </h1>
            <p className="text-slate-300 text-base sm:text-lg mt-3 max-w-xl mx-auto">
              Panduan santai dan mudah dimengerti seputar mengembangkan bisnis di era internet.
            </p>
          </div>
        </section>

        {/* Blog Posts Grid */}
        <section className="py-20 md:py-28">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogs.map((b) => (
                <article
                  key={b.id}
                  className="rounded-3xl bg-white border border-slate-200 shadow-sm corporate-card flex flex-col justify-between overflow-hidden"
                >
                  <div className="p-7 sm:p-8 space-y-3">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-[#fa824b] font-bold uppercase">
                        {b.category}
                      </span>
                      <span className="text-slate-400">
                        {b.date}
                      </span>
                    </div>

                    <h2 className="text-xl font-bold text-slate-900 leading-snug hover:text-[#1853a7] transition-colors">
                      <Link href={`/blog/${b.slug}`}>
                        {b.title}
                      </Link>
                    </h2>

                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {b.excerpt}
                    </p>
                  </div>

                  <div className="p-7 sm:p-8 pt-0 flex items-center justify-between border-t border-slate-100 mt-4 text-xs font-medium text-slate-500">
                    <span>Oleh {b.author}</span>

                    <Link
                      href={`/blog/${b.slug}`}
                      className="inline-flex items-center gap-1.5 font-bold text-[#1853a7] hover:text-[#fa824b] transition-colors"
                    >
                      <span>Baca Lengkap</span>
                      <span>→</span>
                    </Link>
                  </div>
                </article>
              ))}
            </div>

            {/* Bottom Audit Invitation */}
            <div className="mt-16 p-8 rounded-3xl bg-[#1853a7] text-white text-center space-y-4 max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold">Ingin Usaha Anda Muncul di Google?</h3>
              <p className="text-slate-200 text-sm">
                Minta audit gratis 15 menit. Tim kami akan tunjukkan apa saja yang perlu dilengkapi.
              </p>
              <div>
                <Link
                  href="/contact-us"
                  className="inline-block px-8 py-3 rounded-full bg-[#fa824b] hover:bg-[#e5723b] text-white font-bold text-xs uppercase tracking-wider"
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
