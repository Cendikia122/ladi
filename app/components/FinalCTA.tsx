export default function FinalCTA() {
  const waLink = "https://wa.me/62XXXXXXXXXX?text=Halo+Ladi%2C+saya+ingin+mengajukan+Evaluasi+Kesiapan+Digital+untuk+bisnis+saya.";

  return (
    <section className="py-32 md:py-44 border-t border-white/[0.08] bg-[#08090a] relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/[0.08] bg-white/[0.03] text-zinc-400 font-mono text-xs mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>KAPASITAS IMPLEMENTASI TERBUKA</span>
        </div>

        <h2 className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white mb-8 leading-[1.1]">
          Bisnis Anda tidak lagi terbatas secara lokal. <br className="hidden sm:inline" />
          Bangun kehadiran global Anda hari ini.
        </h2>

        <p className="text-base sm:text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed font-normal mb-12">
          Mulai dengan diagnosis kesiapan tanpa komitmen finansial. Dapatkan gambaran objektif mengenai kecepatan, otoritas search index, dan roadmap arsitektur digital bisnis Anda dalam 24 jam.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 rounded-lg text-sm font-medium bg-white text-zinc-950 hover:bg-zinc-200 transition-colors duration-150"
          >
            Minta Evaluasi Kesiapan Digital →
          </a>
          <a
            href="#kapabilitas"
            className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 rounded-lg text-sm font-medium text-zinc-300 hover:text-white bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.1] transition-all duration-150"
          >
            Pelajari Spesifikasi Teknis
          </a>
        </div>

        {/* Technical Guarantee Metrics Line */}
        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 font-mono text-xs text-zinc-500">
          <div className="flex items-center gap-2">
            <span className="w-1 h-1 rounded-full bg-zinc-600" />
            <span>AUDIT DALAM 24 JAM</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-1 h-1 rounded-full bg-zinc-600" />
            <span>100% KEPEMILIKAN ASET</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-1 h-1 rounded-full bg-zinc-600" />
            <span>ZERO VENDOR LOCK-IN</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-1 h-1 rounded-full bg-zinc-600" />
            <span>STANDAR CORE WEB VITALS</span>
          </div>
        </div>
      </div>
    </section>
  );
}
