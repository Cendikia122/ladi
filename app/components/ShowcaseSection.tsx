import Link from "next/link";
import Image from "next/image";
import { getProjects } from "@/app/lib/storage";

export const dynamic = "force-dynamic";

export default async function ShowcaseSection() {
  // Ambil data murni langsung dari database (Tabel projects)
  const projects = await getProjects(4);

  return (
    <section id="portofolio" className="py-24 md:py-32 bg-white border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-16 gap-6">
          <div>
            <span className="section-sublabel">
              HASIL KARYA LADI
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0f172a] tracking-tight mt-2">
              Apa yang Sudah <span className="text-[#1853a7]">Kami Bangun</span>
            </h2>
            <div className="decorative-line" />
            <p className="text-slate-600 text-base sm:text-lg max-w-xl">
              Contoh nyata ekosistem digital yang telah kami bangun dan terbukti mendatangkan pelanggan bagi pemilik usaha.
            </p>
          </div>

          <Link
            href="/project"
            className="px-6 py-3 rounded-full bg-white border border-slate-300 hover:border-[#1853a7] text-slate-800 hover:text-[#1853a7] font-bold text-xs uppercase tracking-wider transition-all self-start sm:self-auto shadow-sm"
          >
            Lihat Semua Portofolio →
          </Link>
        </div>

        {/* Projects 2x2 Grid Murni dari Database */}
        {projects.length === 0 ? (
          <div className="p-16 text-center bg-[#f8fafc] rounded-3xl border border-slate-200 shadow-sm space-y-4 max-w-xl mx-auto">
            <span className="text-4xl block">💼</span>
            <h3 className="text-xl font-bold text-slate-800">Portofolio Sedang Diperbarui</h3>
            <p className="text-sm text-slate-500">
              Data portofolio dan studi kasus klien tersambung langsung ke database. Hubungi kami untuk melihat dokumentasi proyek.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {projects.map((p) => (
              <div
                key={p.id}
                className="p-8 rounded-3xl bg-[#f8fafc] border border-slate-200 shadow-sm corporate-card flex flex-col justify-between space-y-6"
              >
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-mono text-xs px-3 py-1 rounded-full bg-[#1853a7]/10 text-[#1853a7] font-bold uppercase">
                      {p.client_industry || "UMKM"}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">
                      📍 {p.client_location || "Bogor, Jawa Barat"}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-2xl font-extrabold text-[#0f172a] tracking-tight">
                      {p.title}
                    </h3>
                    <div className="text-xs text-[#fa824b] font-bold uppercase mt-1">
                      {p.client_name}
                    </div>
                  </div>

                  {p.thumb && (
                    <div className="relative aspect-[21/9] w-full rounded-2xl overflow-hidden bg-slate-200 border border-slate-200">
                      <Image
                        src={p.thumb}
                        alt={p.title}
                        fill
                        className="object-cover"
                        unoptimized={p.thumb.startsWith("data:") || p.thumb.startsWith("http")}
                      />
                    </div>
                  )}

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {p.summary}
                  </p>
                </div>

                {/* Impact Callout & Live Link */}
                <div className="pt-4 border-t border-slate-200/80 space-y-3">
                  <div className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3.5 py-2.5 rounded-xl border border-emerald-200/60 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 truncate">
                      <span>📈</span>
                      <span className="truncate">{p.results}</span>
                    </div>

                    {p.website_url && (
                      <a
                        href={p.website_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="shrink-0 text-[#1853a7] hover:underline font-bold text-[11px] inline-flex items-center gap-1 ml-2"
                      >
                        <span>Web Live</span>
                        <span>↗</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Portfolio CTA */}
        <div className="mt-16 p-8 rounded-3xl bg-[#1853a7] text-white text-center space-y-3 max-w-2xl mx-auto">
          <h3 className="text-xl sm:text-2xl font-bold">Usaha Anda Ingin Tampil Seperti Mereka?</h3>
          <p className="text-xs sm:text-sm text-slate-200">
            Hubungi kami sekarang untuk mendapatkan penawaran khusus dan konsultasi gratis.
          </p>
          <div className="pt-2">
            <Link
              href="/contact-us"
              className="inline-block px-8 py-3 rounded-full bg-[#fa824b] hover:bg-[#e5723b] text-white font-bold text-xs uppercase tracking-wider shadow-md"
            >
              Mulai Konsultasi Usaha Anda →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
