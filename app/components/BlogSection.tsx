import Link from "next/link";
import { getBlogs } from "@/app/lib/storage";

export default async function BlogSection() {
  const articles = await getBlogs(3);

  return (
    <section id="wawasan" className="py-24 md:py-32 bg-[#f8fafc] border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-16 gap-6">
          <div>
            <span className="section-sublabel">
              TIPS & EDUKASI BISNIS
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0f172a] tracking-tight mt-2">
              Bacaan Ringkas untuk <span className="text-[#1853a7]">Pemilik Usaha</span>
            </h2>
            <div className="decorative-line" />
            <p className="text-slate-600 text-base sm:text-lg max-w-xl">
              Tips praktis dan mudah dipahami seputar mengembangkan bisnis di era internet.
            </p>
          </div>

          <Link
            href="/blog"
            className="px-6 py-3 rounded-full bg-white border border-slate-300 hover:border-[#1853a7] text-slate-800 hover:text-[#1853a7] font-bold text-xs uppercase tracking-wider transition-all self-start sm:self-auto shadow-sm"
          >
            Lihat Semua Artikel →
          </Link>
        </div>

        {/* 3 Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {articles.map((item) => (
            <article
              key={item.id}
              className="p-7 rounded-3xl bg-white border border-slate-200 shadow-sm corporate-card flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-[#fa824b] font-bold uppercase">
                    {item.category}
                  </span>
                  <span className="text-slate-400">
                    {item.date}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 leading-snug hover:text-[#1853a7] transition-colors">
                  <Link href={`/blog/${item.slug}`}>{item.title}</Link>
                </h3>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {item.excerpt}
                </p>
              </div>

              <div className="pt-6 border-t border-slate-100 mt-6">
                <Link
                  href={`/blog/${item.slug}`}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1853a7] hover:text-[#fa824b] transition-colors"
                >
                  <span>Baca Selengkapnya</span>
                  <span>→</span>
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
