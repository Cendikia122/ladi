export default function AuditSection() {
  const auditPoints = [
    { no: "01", point: "Otoritas Knowledge Graph", note: "Verifikasi entitas bisnis pada ekosistem Google & mesin pencari", weight: "15%" },
    { no: "02", point: "Kecepatan Global (TTFB)", note: "Waktu respons server edge di bawah 1.0 detik", weight: "15%" },
    { no: "03", point: "Integritas Schema.org", note: "Kepatuhan struktur data JSON-LD untuk pencarian semantik & AI", weight: "15%" },
    { no: "04", point: "Core Web Vitals", note: "Stabilitas tata letak (CLS), latensi interaksi (INP), dan LCP", weight: "10%" },
    { no: "05", point: "Keamanan Protokol & TLS", note: "Enkripsi HTTPS standar industri tanpa kerentanan sertifikat", weight: "10%" },
    { no: "06", point: "Struktur Kanonikal & SEO", note: "Arsitektur sitemap, meta tag teknis, dan bebas duplikasi", weight: "10%" },
    { no: "07", point: "Kedaulatan Domain & DNS", note: "Kepemilikan mandiri dan hardening konfigurasi DNSSEC", weight: "10%" },
    { no: "08", point: "Kanal Konversi Terarah", note: "Integrasi jalur interaksi langsung dengan minim gesekan", weight: "5%" },
    { no: "09", point: "Konsistensi NAP Global", note: "Keseragaman Nama, Alamat, dan Telepon di internet", weight: "5%" },
    { no: "10", point: "Semantik HTML & Mobile UX", note: "Hierarki dokumen bersih dan responsivitas absolut", weight: "5%" },
  ];

  const waLink = "https://wa.me/62XXXXXXXXXX?text=Halo+Ladi%2C+saya+ingin+mengajukan+Evaluasi+Kesiapan+Digital+untuk+bisnis+saya.";

  return (
    <section id="audit" className="py-24 md:py-36 border-t border-white/[0.08] bg-[#08090a]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Context & CTA */}
          <div className="lg:col-span-5 space-y-8">
            <div>
              <div className="font-mono text-xs text-zinc-500 uppercase tracking-wider mb-4">
                [ DIAGNOSIS GRATIS ]
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-6 leading-tight">
                Evaluasi Kesiapan Kehadiran Digital.
              </h2>
              <p className="text-sm sm:text-base text-zinc-400 leading-relaxed font-normal">
                Sebelum mengalokasikan anggaran, pahami status kesehatan digital bisnis Anda secara objektif. Kami menganalisis 10 parameter infrastruktur penting dan menyajikan laporan diagnostik tanpa bias komersial.
              </p>
            </div>

            <div className="space-y-4 pt-2 border-t border-white/[0.06]">
              <div className="flex items-start gap-3">
                <span className="font-mono text-xs text-zinc-500 pt-0.5">01 //</span>
                <div>
                  <div className="text-sm font-semibold text-zinc-200">Berdasarkan Fakta Teknis</div>
                  <div className="text-xs text-zinc-400 mt-0.5">Audit murni berdasarkan metrik kecepatan, indeksasi, dan arsitektur data.</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="font-mono text-xs text-zinc-500 pt-0.5">02 //</span>
                <div>
                  <div className="text-sm font-semibold text-zinc-200">Tanpa Obligasi Beli</div>
                  <div className="text-xs text-zinc-400 mt-0.5">Laporan menjadi milik Anda sepenuhnya untuk dijadikan bahan rujukan strategis.</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="font-mono text-xs text-zinc-500 pt-0.5">03 //</span>
                <div>
                  <div className="text-sm font-semibold text-zinc-200">Laporan dalam 24 Jam</div>
                  <div className="text-xs text-zinc-400 mt-0.5">Kirimkan domain atau nama bisnis Anda, tim rekayasa kami segera memproses.</div>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-6 py-3 rounded-lg text-sm font-medium bg-white text-zinc-950 hover:bg-zinc-200 transition-colors duration-150"
              >
                Minta Evaluasi Kesiapan Digital →
              </a>
            </div>
          </div>

          {/* Right Column: 10-Point Technical Table */}
          <div className="lg:col-span-7">
            <div className="border border-white/[0.08] rounded-xl bg-[#0d0e12] overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.08] bg-white/[0.02]">
                <div className="font-mono text-xs font-semibold text-zinc-300">
                  MATRIKS 10 PARAMETER EVALUASI
                </div>
                <div className="font-mono text-xs text-zinc-500">
                  TOTAL: 100%
                </div>
              </div>

              {/* Checklist */}
              <div className="divide-y divide-white/[0.06]">
                {auditPoints.map((item) => (
                  <div
                    key={item.no}
                    className="flex items-center justify-between px-6 py-3.5 hover:bg-white/[0.02] transition-colors"
                  >
                    <div className="flex items-start gap-4">
                      <span className="font-mono text-xs text-zinc-500 mt-0.5">
                        {item.no}
                      </span>
                      <div>
                        <div className="text-xs sm:text-sm font-medium text-zinc-200">
                          {item.point}
                        </div>
                        <div className="text-[11px] text-zinc-500 mt-0.5">
                          {item.note}
                        </div>
                      </div>
                    </div>
                    <span className="font-mono text-xs text-zinc-400 pl-4 flex-shrink-0">
                      {item.weight}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
