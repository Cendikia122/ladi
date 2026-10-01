export default function Hero() {
  return (
    <section className="relative pt-36 pb-20 md:pt-48 md:pb-28 overflow-hidden bg-[#08090a]">
      {/* Subtle hairline background grid */}
      <div className="absolute inset-0 tech-grid opacity-60 pointer-events-none" />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 text-center">
        {/* Category Indicator */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/[0.08] bg-white/[0.03] text-zinc-400 font-mono text-xs mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>INFRASTRUKTUR KEHADIRAN DIGITAL</span>
        </div>

        {/* Main Heading - Strong Sans-Serif */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white leading-[1.08] mb-8">
          Bisnis Anda hidup di <br className="hidden sm:inline" />
          internet global.
        </h1>

        {/* Generous Negative Space & Subtitle */}
        <p className="text-base sm:text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed font-normal mb-12">
          Bukan sekadar penanda peta lokal atau website komoditas. Kami merekayasa kehadiran digital independen berstandar internasional untuk bisnis Indonesia — performa sub-detik, otoritas indeksasi semantik, dan infrastruktur konversi tanpa ketergantungan sepihak.
        </p>

        {/* CTA Group - High contrast, almost no color until the CTA */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20 md:mb-28">
          <a
            href="#audit"
            className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 rounded-lg text-sm font-medium bg-white text-zinc-950 hover:bg-zinc-200 transition-colors duration-150"
          >
            Minta Evaluasi Kesiapan Digital
          </a>
          <a
            href="#kapabilitas"
            className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 rounded-lg text-sm font-medium text-zinc-300 hover:text-white bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.1] transition-all duration-150"
          >
            Spesifikasi Kapabilitas →
          </a>
        </div>

        {/* Workbench Architecture Preview - Linear Late-2024 Style */}
        <div className="text-left border border-white/[0.08] rounded-xl bg-[#0d0e12] overflow-hidden">
          {/* Window Chrome */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.08] bg-white/[0.01]">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full border border-white/[0.15] bg-white/[0.04]" />
              <span className="w-2.5 h-2.5 rounded-full border border-white/[0.15] bg-white/[0.04]" />
              <span className="w-2.5 h-2.5 rounded-full border border-white/[0.15] bg-white/[0.04]" />
            </div>
            <div className="font-mono text-[11px] text-zinc-400 tracking-wide">
              telemetry.ladi.digital // global-presence-index
            </div>
            <div className="font-mono text-[10px] text-zinc-500 uppercase tracking-wider">
              EDGE // ONLINE
            </div>
          </div>

          {/* Workbench Body */}
          <div className="p-6 md:p-8 space-y-8">
            {/* Top Telemetry Strip */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-lg border border-white/[0.06] bg-white/[0.02]">
                <div className="font-mono text-[11px] text-zinc-500 mb-1">INDEXING STATUS</div>
                <div className="text-sm font-semibold text-zinc-200">Global Search Authority</div>
                <div className="font-mono text-xs text-emerald-400 mt-2 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  Schema & Knowledge Graph Verified
                </div>
              </div>

              <div className="p-4 rounded-lg border border-white/[0.06] bg-white/[0.02]">
                <div className="font-mono text-[11px] text-zinc-500 mb-1">GLOBAL EDGE SPEED</div>
                <div className="text-sm font-semibold text-zinc-200">Sub-detik TTFB</div>
                <div className="font-mono text-xs text-zinc-400 mt-2">
                  18ms median latency across CDN
                </div>
              </div>

              <div className="p-4 rounded-lg border border-white/[0.06] bg-white/[0.02]">
                <div className="font-mono text-[11px] text-zinc-500 mb-1">WEB VITALS</div>
                <div className="text-sm font-semibold text-zinc-200">100 / 100 Clean Code</div>
                <div className="font-mono text-xs text-zinc-400 mt-2">
                  Zero cumulative layout shift
                </div>
              </div>

              <div className="p-4 rounded-lg border border-white/[0.06] bg-white/[0.02]">
                <div className="font-mono text-[11px] text-zinc-500 mb-1">INFRASTRUCTURE</div>
                <div className="text-sm font-semibold text-zinc-200">Sovereign Domain Asset</div>
                <div className="font-mono text-xs text-zinc-400 mt-2">
                  100% Owned, Zero Vendor Lock-in
                </div>
              </div>
            </div>

            {/* Edge Distribution Network Log */}
            <div className="rounded-lg border border-white/[0.06] bg-black/40 p-4 font-mono text-xs text-zinc-400">
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/[0.06] text-[11px] text-zinc-500">
                <span>NODE LOCATION</span>
                <span>PROTOCOL</span>
                <span>ROUTING STATUS</span>
                <span>LATENCY</span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-zinc-300">
                  <span className="text-zinc-200">JKT-01 (Jakarta, ID)</span>
                  <span className="text-zinc-500">HTTP/3 · TLS 1.3</span>
                  <span className="text-emerald-400">OPTIMAL</span>
                  <span>4ms</span>
                </div>
                <div className="flex items-center justify-between text-zinc-300">
                  <span className="text-zinc-200">SIN-02 (Singapore, SG)</span>
                  <span className="text-zinc-500">HTTP/3 · TLS 1.3</span>
                  <span className="text-emerald-400">OPTIMAL</span>
                  <span>14ms</span>
                </div>
                <div className="flex items-center justify-between text-zinc-300">
                  <span className="text-zinc-200">TYO-01 (Tokyo, JP)</span>
                  <span className="text-zinc-500">HTTP/3 · TLS 1.3</span>
                  <span className="text-emerald-400">OPTIMAL</span>
                  <span>58ms</span>
                </div>
                <div className="flex items-center justify-between text-zinc-300">
                  <span className="text-zinc-200">FRA-04 (Frankfurt, DE)</span>
                  <span className="text-zinc-500">HTTP/3 · TLS 1.3</span>
                  <span className="text-emerald-400">OPTIMAL</span>
                  <span>142ms</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Generous Negative Space Buffer */}
        <div className="h-16 md:h-24" />
      </div>
    </section>
  );
}
