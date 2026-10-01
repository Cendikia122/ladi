export default function Services() {
  const capabilities = [
    {
      code: "CAP-01",
      title: "Arsitektur Web Berperforma Tinggi",
      subtitle: "Sovereign Web Core",
      desc: "Kami merekayasa platform web dari baris kode pertama menggunakan arsitektur modern berkecepatan tinggi. Bebas dari bloatware template konvensional, menghasilkan waktu muat sub-detik dan skor performa sempurna pada perangkat mobile maupun desktop.",
      specs: [
        "Static generation pada global edge network",
        "Kepatuhan mutlak Google Core Web Vitals",
        "Enkripsi TLS 1.3 dan hardening DNSSEC",
        "Desain responsif berorientasi presisi tipografi",
      ],
    },
    {
      code: "CAP-02",
      title: "Otoritas Indeksasi Semantik Global",
      subtitle: "Search & Knowledge Graph Authority",
      desc: "Menghubungkan bisnis Anda langsung ke graf pengetahuan mesin pencari. Kami menanamkan struktur data Schema.org mendalam agar entitas bisnis Anda dikenali, diindeks, dan diprioritaskan oleh Google Search, Apple Maps, dan agen pencarian cerdas.",
      specs: [
        "Injeksi Schema JSON-LD terstruktur",
        "Verifikasi dan sinkronisasi ekosistem Google Business",
        "Optimasi keterbacaan untuk Search Engine & AI Agents",
        "Peta indeksasi kanonikal dan audit sitemap otomatis",
      ],
    },
    {
      code: "CAP-03",
      title: "Telemetri & Kestabilan Infrastruktur",
      subtitle: "Continuous Telemetry & SLA",
      desc: "Kehadiran digital bukan proyek sekali jadi yang kemudian ditinggalkan. Kami mengawal kesehatan infrastruktur Anda dengan pemantauan uptime kontinu, laporan telemetri performa bulanan yang transparan, dan pemeliharaan berkala.",
      specs: [
        "Laporan telemetri dampak dan query pencarian nyata",
        "Audit berkala integritas tautan dan indeks",
        "Dukungan teknis prioritas dan pembaruan sistem",
        "Zero-downtime maintenance pipeline",
      ],
    },
  ];

  const packages = [
    {
      name: "FOUNDATION",
      tier: "Paket Dasar Kehadiran",
      desc: "Infrastruktur primer untuk bisnis yang memerlukan validasi digital berstandar global tanpa kompleksitas berlebih.",
      features: [
        "Landing page performa tinggi 1-halaman",
        "Setup domain kustom & proteksi SSL global",
        "Struktur data semantik Google & Apple",
        "Integrasi kanal komunikasi langsung (WhatsApp)",
        "Audit kecepatan & kepatuhan Core Web Vitals",
      ],
      action: "Konsultasi Foundation",
    },
    {
      name: "EXPANSION",
      tier: "Arsitektur Lengkap Bisnis",
      desc: "Direkayasa untuk bisnis yang siap memperluas jangkauan pasar dan membangun otoritas domain yang kuat.",
      features: [
        "Semua kapabilitas paket Foundation",
        "Arsitektur web multi-halaman terstruktur",
        "Optimasi menyeluruh Google Search & Knowledge Graph",
        "Setup telemetri Google Analytics & Search Console",
        "Laporan dampak digital perdana 30-hari",
        "Garansi optimasi performa berkelanjutan",
      ],
      highlight: true,
      action: "Konsultasi Expansion",
    },
    {
      name: "ENTERPRISE & GUARD",
      tier: "Ekosistem & Pemeliharaan Terpadu",
      desc: "Pendampingan jangka panjang dengan infrastruktur kustom dan jaminan SLA pemeliharaan teknis bulanan.",
      features: [
        "Semua kapabilitas paket Expansion",
        "Integrasi alur transaksi kustom / katalog dinamis",
        "Retainer pemeliharaan & proteksi uptime bulanan",
        "Audit SEO teknis & pembaruan konten terjadwal",
        "Dedicated technical advisor & respons prioritas",
      ],
      action: "Konsultasi Enterprise",
    },
  ];

  return (
    <section id="kapabilitas" className="py-24 md:py-36 bg-[#08090a]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Header with Generous Space */}
        <div className="max-w-2xl mb-20 md:mb-28">
          <div className="font-mono text-xs text-zinc-500 uppercase tracking-wider mb-4">
            [ KAPABILITAS SISTEM ]
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white mb-6 leading-tight">
            Direkayasa untuk otoritas, bukan sekadar tampilan.
          </h2>
          <p className="text-base sm:text-lg text-zinc-400 leading-relaxed font-normal">
            Kami menghilangkan ketergantungan pada template siap pakai yang lambat dan rapuh. Setiap solusi dibangun di atas fondasi teknologi web modern berstandar enterprise.
          </p>
        </div>

        {/* Editorial Capability Rows - Thin Separators */}
        <div className="divide-y divide-white/[0.08] border-y border-white/[0.08] mb-28">
          {capabilities.map((cap) => (
            <div key={cap.code} className="py-12 md:py-16 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-4">
                <span className="font-mono text-xs text-zinc-500 block mb-2">
                  {cap.code} // {cap.subtitle}
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  {cap.title}
                </h3>
              </div>

              <div className="lg:col-span-8 space-y-6">
                <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
                  {cap.desc}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {cap.specs.map((spec, idx) => (
                    <div key={idx} className="flex items-center gap-2.5 text-xs font-mono text-zinc-300">
                      <span className="w-1 h-1 rounded-full bg-zinc-500" />
                      <span>{spec}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Section Title for Packages */}
        <div className="max-w-2xl mb-12">
          <div className="font-mono text-xs text-zinc-500 uppercase tracking-wider mb-3">
            [ SKEMA IMPLEMENTASI ]
          </div>
          <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Tingkat Implementasi Terukur
          </h3>
        </div>

        {/* Package Grid - Hard 1px Borders, Zero Shadows, Zero Gradients */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {packages.map((pkg) => (
            <div
              key={pkg.name}
              className={`p-8 rounded-xl border flex flex-col justify-between transition-colors duration-200 ${
                pkg.highlight
                  ? "border-white/30 bg-white/[0.04]"
                  : "border-white/[0.08] bg-white/[0.015] hover:border-white/[0.16]"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-xs tracking-wider text-zinc-400">
                    {pkg.tier}
                  </span>
                  {pkg.highlight && (
                    <span className="font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 rounded border border-white/20 text-white bg-white/[0.08]">
                      REKOMENDASI
                    </span>
                  )}
                </div>

                <h4 className="text-xl font-bold text-white tracking-tight mb-3">
                  {pkg.name}
                </h4>

                <p className="text-xs text-zinc-400 leading-relaxed mb-6 min-h-[40px]">
                  {pkg.desc}
                </p>

                <div className="h-px w-full bg-white/[0.08] mb-6" />

                <div className="space-y-3 mb-8">
                  {pkg.features.map((feat, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-xs text-zinc-300 leading-relaxed">
                      <span className="font-mono text-zinc-500 select-none">+</span>
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <a
                  href={`https://wa.me/62XXXXXXXXXX?text=Halo+Ladi%2C+saya+ingin+konsultasi+mengenai+paket+${pkg.name}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-full block text-center py-2.5 px-4 rounded-lg text-xs font-medium transition-colors duration-150 ${
                    pkg.highlight
                      ? "bg-white text-zinc-950 hover:bg-zinc-200"
                      : "bg-white/[0.05] text-zinc-200 hover:bg-white/[0.1] border border-white/[0.1]"
                  }`}
                >
                  {pkg.action} →
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
