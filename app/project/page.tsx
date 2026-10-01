import Link from "next/link";
import TopBar from "../components/TopBar";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import WhatsAppButton from "../components/WhatsAppButton";

export const metadata = {
  title: "Portofolio & Karya — Ladi (Layanan Digital)",
  description: "Lihat hasil nyata ekosistem digital dan website yang telah dibangun oleh Ladi untuk mitra bisnis di Indonesia.",
};

export default function ProjectPage() {
  const caseStudies = [
    {
      id: "budi-jaya",
      title: "Bengkel Motor Budi Jaya",
      location: "Bogor, Jawa Barat",
      package: "Paket RISE",
      category: "Jasa & Otomotif",
      highlight: "140+ Telepon Masuk / Bulan",
      problem: "Usaha bengkel sudah berdiri 12 tahun, namun tidak pernah terdaftar di Google Maps. Calon pelanggan baru selalu lari ke bengkel kompetitor yang lebih baru namun sudah muncul di peta.",
      solution: "Tim Ladi mendaftarkan dan memverifikasi Google Business resmi, mengambil foto tempat kerja yang rapi, dan membangun website 5 halaman dengan navigasi rute bengkel.",
      impact: "Menduduki peringkat #1 bengkel motor terdekat di area Bogor, menghasilkan 147 panggilan telepon dan 2.400+ tayangan peta di bulan pertama.",
    },
    {
      id: "sari-rasa",
      title: "Katering Sari Rasa",
      location: "Depok, Jawa Barat",
      package: "Paket RISE + GUARD",
      category: "Kuliner & Katering",
      highlight: "24 Pesanan Kantor dalam 45 Hari",
      problem: "Hanya mengandalkan broadcast WhatsApp manual ke kontak lama. Kesulitan menjangkau kantor atau panitia acara baru di luar lingkungan sekitar.",
      solution: "Pembuatan landing page katalog paket prasmanan dan nasi kotak lengkap dengan daftar menu, harga transparan, dan tombol pemesanan langsung ke WA admin.",
      impact: "Mendapat 24 pesanan katering baru dari pencarian Google dalam 45 hari pertama, dengan langganan laporan bulanan rutin.",
    },
    {
      id: "klinik-gigi",
      title: "Klinik Gigi Sejahtera",
      location: "Bogor, Jawa Barat",
      package: "Paket RUN",
      category: "Kesehatan & Medis",
      highlight: "Sistem Reservasi Jadwal Mandiri",
      problem: "Pasien sering mengeluhkan antrean yang menumpuk di ruang tunggu karena pencatatan janji temu masih menggunakan buku manual.",
      solution: "Membangun website profesional lengkap dengan sistem booking online dokter gigi dan integrasi Google Knowledge Graph.",
      impact: "Antrean klinik menjadi teratur, pasien baru dari luar kecamatan meningkat 40%, dan profil klinik tampil resmi di mesin pencari.",
    },
    {
      id: "toko-roti",
      title: "Toko Roti & Kue Sedap Wangi",
      location: "Bogor, Jawa Barat",
      package: "Paket EXIST",
      category: "Kuliner & Toko Fisik",
      highlight: "Tampil di Google dalam 5 Hari",
      problem: "Wisatawan dari Jakarta kesulitan menemukan lokasi toko saat mencari oleh-oleh roti di sekitar stasiun Bogor.",
      solution: "Paket EXIST kilat: penataan Google Business, foto produk beresolusi tajam, dan landing page 1 halaman responsif.",
      impact: "Pencarian rute ke toko meningkat 210% saat akhir pekan, langsung mendatangkan pelanggan wisatawan.",
    },
    {
      id: "tridharma",
      title: "PT Tridharma Presisi Manufaktur",
      location: "Kawasan Industri Jawa Barat",
      package: "Paket RUN / Enterprise",
      category: "B2B & Manufaktur",
      highlight: "Ekspor & Otoritas Global",
      problem: "Perusahaan manufaktur spesialis yang membutuhkan representasi web berstandar internasional untuk tender klien korporat multinasional.",
      solution: "Arsitektur web Next.js berkecepatan sub-detik, katalog spesifikasi teknis lengkap, dan kepatuhan Google Knowledge Graph global.",
      impact: "Skor Core Web Vitals 100/100, terverifikasi untuk pengajuan tender, dan mendatangkan inquiry B2B dari luar negeri.",
    },
  ];

  return (
    <>
      <TopBar />
      <Navbar />

      <main className="bg-[#f8fafc] text-[#0f172a]">
        {/* Header */}
        <section className="bg-[#0f172a] text-white py-16 lg:py-20 border-b border-slate-800 text-center">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <span className="font-mono text-xs text-[#fa824b] font-bold uppercase tracking-wider block mb-2">
              KARYA & HASIL NYATA
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
              Portofolio Digital Ladi
            </h1>
            <p className="text-slate-300 text-base sm:text-lg mt-3 max-w-xl mx-auto">
              Studi kasus bagaimana Ladi membantu bisnis dari nol hingga hidup dan dipercaya di internet global.
            </p>
          </div>
        </section>

        {/* Case Studies List */}
        <section className="py-20 md:py-28">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            {caseStudies.map((item, idx) => (
              <div
                key={item.id}
                className="p-8 sm:p-10 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6 corporate-card"
              >
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-xl bg-[#1853a7] text-white flex items-center justify-center font-bold text-sm">
                      0{idx + 1}
                    </span>
                    <div>
                      <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                        {item.title}
                      </h2>
                      <span className="text-xs text-[#fa824b] font-bold uppercase">
                        {item.category} · {item.location}
                      </span>
                    </div>
                  </div>

                  <span className="font-mono text-xs px-3 py-1 rounded-full bg-[#1853a7]/10 text-[#1853a7] font-bold">
                    {item.package}
                  </span>
                </div>

                {/* Problem, Solution, Impact Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs sm:text-sm">
                  <div className="p-5 rounded-2xl bg-[#f8fafc] border border-slate-200/80 space-y-1.5">
                    <span className="font-bold text-red-600 uppercase font-mono text-[11px]">Tantangan Awal:</span>
                    <p className="text-slate-600 leading-relaxed">{item.problem}</p>
                  </div>

                  <div className="p-5 rounded-2xl bg-[#f8fafc] border border-slate-200/80 space-y-1.5">
                    <span className="font-bold text-[#1853a7] uppercase font-mono text-[11px]">Solusi Ladi:</span>
                    <p className="text-slate-600 leading-relaxed">{item.solution}</p>
                  </div>

                  <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 space-y-1.5">
                    <span className="font-bold text-emerald-700 uppercase font-mono text-[11px]">Dampak Nyata:</span>
                    <p className="text-emerald-900 font-medium leading-relaxed">{item.impact}</p>
                  </div>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-100">
                  <span className="text-xs font-bold text-slate-500">
                    Hasil Utama: <strong className="text-[#0f172a]">{item.highlight}</strong>
                  </span>

                  <a
                    href={`https://wa.me/6281298319944?text=Halo+Ladi%2C+saya+tertarik+membuat+website+seperti+studi+kasus+${encodeURIComponent(item.title)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block px-6 py-2.5 rounded-full bg-[#fa824b] hover:bg-[#e5723b] text-white font-bold text-xs uppercase tracking-wider transition-all"
                  >
                    Konsultasikan Usaha Serupa →
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
