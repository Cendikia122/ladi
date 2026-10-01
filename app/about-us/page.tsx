import Link from "next/link";
import TopBar from "../components/TopBar";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import WhatsAppButton from "../components/WhatsAppButton";

export const metadata = {
  title: "Tentang Kami — Ladi (Layanan Digital)",
  description: "Mengenal Ladi, mitra digitalisasi terpercaya bagi UMKM dan bisnis di Indonesia. Bisnis Kamu, Dunia Lihat.",
};

export default function AboutPage() {
  const values = [
    {
      letter: "L",
      name: "Loyalitas",
      desc: "Kami bukan vendor sekali jadi yang menghilang setelah bayar. Kami adalah mitra jangka panjang yang peduli pada kemajuan usaha Anda.",
    },
    {
      letter: "A",
      name: "Akuntabilitas",
      desc: "Setiap dampak dapat diukur dengan angka transparan. Kami tidak bersembunyi di balik istilah teknis yang membingungkan.",
    },
    {
      letter: "D",
      name: "Dedikasi",
      desc: "Standar kualitas tidak pernah kami kompromikan. Setiap baris kode dan desain dikerjakan dengan sepenuh hati.",
    },
    {
      letter: "I",
      name: "Inovasi",
      desc: "Kami memilih teknologi yang benar-benar berguna dan terbukti mendatangkan pembeli untuk usaha Anda.",
    },
  ];

  return (
    <>
      <TopBar />
      <Navbar />

      <main className="bg-[#f8fafc] text-[#0f172a]">
        {/* Breadcrumb Header */}
        <section className="bg-[#0f172a] text-white py-16 lg:py-20 border-b border-slate-800">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <span className="font-mono text-xs text-[#fa824b] font-bold uppercase tracking-wider block mb-2">
              PROFIL PERUSAHAAN
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
              Tentang Ladi (Layanan Digital)
            </h1>
            <p className="text-slate-300 text-base sm:text-lg mt-3 max-w-2xl">
              &ldquo;Bisnis Kamu, Dunia Lihat.&rdquo; — Membantu usaha lokal hidup dan dipercaya di internet global.
            </p>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-20 md:py-28 bg-white border-b border-slate-200">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              <div className="lg:col-span-7 space-y-5">
                <span className="section-sublabel">LATAR BELAKANG KAMI</span>
                <h2 className="text-2xl sm:text-4xl font-extrabold text-[#0f172a] tracking-tight">
                  Lahir untuk Mengisi Celah Nyata UMKM Indonesia
                </h2>
                <div className="decorative-line" />
                <p className="text-slate-600 leading-relaxed text-base">
                  Di era sekarang, banyak orang bisa membuat website dengan alat gratisan. Namun, hal itu justru membuat pemilik usaha yang tidak melek teknologi semakin bingung dan khawatir tertipu.
                </p>
                <p className="text-slate-600 leading-relaxed text-base">
                  <strong>Ladi didirikan oleh talenta PPLG SMK Wikrama Bogor dengan bimbingan mentor bisnis berpengalaman</strong>. Kami hadir bukan sebagai korporat kaku berbiaya puluhan juta, melainkan sebagai <strong>teman yang melek teknologi</strong> yang bisa Anda percaya untuk mengurus semua kebutuhan digital.
                </p>
              </div>

              <div className="lg:col-span-5 p-8 rounded-3xl bg-[#f8fafc] border border-slate-200 text-center space-y-4 shadow-sm">
                <div className="w-16 h-16 rounded-2xl bg-[#1853a7] text-white flex items-center justify-center font-bold text-2xl mx-auto shadow-md">
                  L
                </div>
                <h3 className="font-bold text-slate-900 text-xl">Visi Kami</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Menjadi mitra digitalisasi terpercaya nomor satu bagi pelaku usaha di Indonesia, yang dikenal bukan karena kerumitan teknologinya, melainkan karena dampak nyata yang dirasakan pemilik usaha.
                </p>
              </div>
            </div>

            {/* Core Values L.A.D.I */}
            <div className="pt-12 border-t border-slate-200">
              <div className="text-center max-w-2xl mx-auto mb-12">
                <span className="section-sublabel">NILAI UTAMA KAMI</span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0f172a] mt-1">
                  Prinsip L.A.D.I
                </h2>
                <div className="decorative-line-center" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {values.map((v) => (
                  <div key={v.letter} className="p-6 rounded-2xl bg-[#f8fafc] border border-slate-200 corporate-card">
                    <div className="w-10 h-10 rounded-xl bg-[#1853a7] text-white flex items-center justify-center font-extrabold text-lg mb-4">
                      {v.letter}
                    </div>
                    <h3 className="font-bold text-slate-900 text-base mb-1.5">{v.name}</h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{v.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom CTA */}
            <div className="p-8 rounded-3xl bg-[#1853a7] text-white text-center space-y-4">
              <h3 className="text-2xl font-bold">Siap Mengembangkan Usaha Anda Bersama Ladi?</h3>
              <p className="text-slate-200 text-sm max-w-xl mx-auto">
                Mulai dengan Digital Audit Gratis 15 menit. Kami beri nilai dulu sebelum meminta komitmen apa pun.
              </p>
              <div className="pt-2">
                <Link
                  href="/contact-us"
                  className="inline-block px-8 py-3.5 rounded-full bg-[#fa824b] hover:bg-[#e5723b] text-white font-bold text-xs uppercase tracking-wider shadow-lg transition-all"
                >
                  Minta Audit Gratis Sekarang →
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
