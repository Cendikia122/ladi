export default function HowItWorks() {
  const steps = [
    {
      step: "01",
      name: "Diagnosis & Audit Teknis",
      desc: "Kami memetakan kesiapan digital bisnis Anda melalui 10 parameter objektif: kecepatan edge, validitas schema semantik, dan integritas domain.",
      output: "Deliverable: Dokumen Laporan Kesiapan Digital",
    },
    {
      step: "02",
      name: "Rekayasa Arsitektur Web",
      desc: "Pembangunan struktur web modern dari kode murni tanpa template lambat. Mengutamakan hierarki tipografi tajam, responsivitas cepat, dan rasio konversi optimal.",
      output: "Deliverable: Staging Environment & Verifikasi Antarmuka",
    },
    {
      step: "03",
      name: "Deployment & Indeksasi Global",
      desc: "Distribusi ke 300+ edge server internasional, aktivasi sertifikat keamanan mutakhir, dan pendaftaran struktur data semantik ke Google Knowledge Graph.",
      output: "Deliverable: Live Production & Otoritas Search Index",
    },
    {
      step: "04",
      name: "Telemetri & Penyerahan Kedaulatan",
      desc: "Seluruh kode sumber dan domain diserahkan 100% kepada Anda. Dasbor telemetri diaktifkan untuk melacak pertumbuhan kunjungan dan konversi secara transparan.",
      output: "Deliverable: Akses Root & Dasbor Monitoring Mandiri",
    },
  ];

  return (
    <section id="proses" className="py-24 md:py-36 border-t border-white/[0.08] bg-[#08090a]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="max-w-2xl mb-20 md:mb-28">
          <div className="font-mono text-xs text-zinc-500 uppercase tracking-wider mb-4">
            [ PROTOKOL REKAYASA ]
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white mb-6 leading-tight">
            Metodologi Terstruktur Tanpa Tebak-tebakan.
          </h2>
          <p className="text-base sm:text-lg text-zinc-400 leading-relaxed font-normal">
            Dari evaluasi awal hingga deployment ke jaringan edge global, setiap tahap dijalankan dengan standar rekayasa perangkat lunak modern.
          </p>
        </div>

        {/* Step Sequence with Thin 1px Dividers */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((item) => (
            <div
              key={item.step}
              className="p-6 rounded-xl border border-white/[0.08] bg-white/[0.015] hover:border-white/[0.16] transition-colors duration-200 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-8">
                  <span className="font-mono text-sm text-zinc-400 font-semibold">
                    PHASE // {item.step}
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-zinc-600" />
                </div>

                <h3 className="text-lg font-bold text-white tracking-tight mb-3">
                  {item.name}
                </h3>

                <p className="text-xs text-zinc-400 leading-relaxed mb-6">
                  {item.desc}
                </p>
              </div>

              <div className="pt-4 border-t border-white/[0.06] font-mono text-[11px] text-zinc-500">
                {item.output}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
