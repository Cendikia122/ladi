export default function WhyLadi() {
  const comparisons = [
    {
      dimension: "Arsitektur Kode",
      conventional: "Template generik pihak ketiga sarat plugin lambat dan rentan keamanan.",
      ladi: "Kode murni Next.js berperforma sub-detik tanpa ketergantungan plugin rapuh.",
    },
    {
      dimension: "Otoritas Mesin Pencari",
      conventional: "Hanya mendaftarkan nama di peta lokal tanpa struktur data komprehensif.",
      ladi: "Injeksi Schema.org mendalam, integrasi Knowledge Graph, dan indeksasi global.",
    },
    {
      dimension: "Kedaulatan Aset",
      conventional: "Aset sering terkunci di akun vendor; klien kesulitan migrasi mandiri.",
      ladi: "100% kepemilikan mutlak atas domain, repositori kode, dan konfigurasi server.",
    },
    {
      dimension: "Validasi Performa",
      conventional: "Klaim subjektif tanpa parameter pembuktian teknis yang jelas.",
      ladi: "Skor Core Web Vitals terukur (100/100) dan laporan telemetri kuartalan.",
    },
    {
      dimension: "Jangkauan Jaringan",
      conventional: "Server lokal tunggal dengan latensi tinggi saat diakses dari luar wilayah.",
      ladi: "Terdistribusi di 300+ edge nodes Anycast untuk akses instan di seluruh dunia.",
    },
    {
      dimension: "Model Hubungan",
      conventional: "Transaksional sekali selesai; tidak ada pendampingan saat terjadi kendala.",
      ladi: "Kemitraan rekayasa berkelanjutan dengan SLA respons teknis terstandar.",
    },
  ];

  return (
    <section id="perbandingan" className="py-24 md:py-36 border-t border-white/[0.08] bg-[#08090a]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="max-w-2xl mb-20 md:mb-28">
          <div className="font-mono text-xs text-zinc-500 uppercase tracking-wider mb-4">
            [ DISTINGSI SISTEM ]
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white mb-6 leading-tight">
            Perbedaan Antara Komoditas dan Infrastruktur.
          </h2>
          <p className="text-base sm:text-lg text-zinc-400 leading-relaxed font-normal">
            Banyak bisnis mengeluarkan biaya berulang untuk solusi digital yang tidak pernah mendatangkan otoritas nyata. Inilah mengapa pendekatan rekayasa kami berbeda secara fundamental.
          </p>
        </div>

        {/* Comparison Table with Hard 1px Borders */}
        <div className="border border-white/[0.08] rounded-xl overflow-hidden bg-[#0d0e12]">
          <div className="grid grid-cols-1 md:grid-cols-12 border-b border-white/[0.08] bg-white/[0.02] text-xs font-mono text-zinc-400">
            <div className="p-4 md:col-span-3 font-semibold text-zinc-300">
              DIMENSI EVALUASI
            </div>
            <div className="p-4 md:col-span-4 border-t md:border-t-0 md:border-l border-white/[0.08] text-zinc-500">
              VENDOR TEMPLATE UMUM
            </div>
            <div className="p-4 md:col-span-5 border-t md:border-t-0 md:border-l border-white/[0.08] text-white font-semibold bg-white/[0.02]">
              LADI // REKAYASA KEHADIRAN DIGITAL
            </div>
          </div>

          <div className="divide-y divide-white/[0.06]">
            {comparisons.map((row, idx) => (
              <div
                key={idx}
                className="grid grid-cols-1 md:grid-cols-12 text-xs sm:text-sm hover:bg-white/[0.015] transition-colors"
              >
                <div className="p-4 md:col-span-3 font-medium text-zinc-200">
                  {row.dimension}
                </div>
                <div className="p-4 md:col-span-4 border-t md:border-t-0 md:border-l border-white/[0.06] text-zinc-400 leading-relaxed">
                  {row.conventional}
                </div>
                <div className="p-4 md:col-span-5 border-t md:border-t-0 md:border-l border-white/[0.06] text-zinc-200 leading-relaxed bg-white/[0.01]">
                  {row.ladi}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
