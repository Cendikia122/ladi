import Image from "next/image";

export default function TestimonialsSection() {
  const testimonials = [
    {
      quote:
        "Sebelum pakai Ladi, bisnis saya tidak ada di Google sama sekali. Sekarang hampir tiap hari ada yang telepon dari internet mau servis motor. Senang sekali karena tidak perlu pusing mikirin teknis.",
      author: "Pak Budi Santoso",
      role: "Pemilik Usaha",
      business: "Bengkel Motor Budi Jaya",
      location: "Bogor, Jawa Barat",
      businessType: "Bengkel & Servis Motor",
      impact: "📈 140+ Telepon Masuk Tiap Bulan",
      businessPhoto: "/images/clients/bengkel-motor.jpg",
      avatar: "/images/avatars/pak-budi.jpg",
      mapsRating: "4.9 (124 Ulasan)",
    },
    {
      quote:
        "Yang paling saya suka itu Laporan Dampak bulanannya yang dikirim via WhatsApp. Saya bisa lihat langsung angkanya berapa orang yang cari katering saya. Nyata dan transparan!",
      author: "Bu Sari Dewi",
      role: "Pendiri Usaha",
      business: "Katering Sari Rasa",
      location: "Depok, Jawa Barat",
      businessType: "Dapur & Katering Prasmanan",
      impact: "🏆 Langganan Paket RISE & GUARD",
      businessPhoto: "/images/clients/katering-sari-rasa.jpg",
      avatar: "/images/avatars/bu-sari.jpg",
      mapsRating: "5.0 (88 Ulasan)",
    },
    {
      quote:
        "Dulu pernah bikin website ke orang lain, tapi setelah bayar malah susah dihubungi. Di Ladi beda — mereka ramah, sabar menjelaskan, dan terus mendampingi klinik kami di Google.",
      author: "drg. Ahmad Fauzi",
      role: "Praktisi & Pemilik",
      business: "Klinik Gigi Keluarga",
      location: "Bogor, Jawa Barat",
      businessType: "Praktik Dokter Gigi Modern",
      impact: "⭐ Peringkat #1 Pencarian Google",
      businessPhoto: "/images/clients/klinik-gigi.jpg",
      avatar: "/images/avatars/pak-ahmad.jpg",
      mapsRating: "5.0 (96 Ulasan)",
    },
  ];

  return (
    <section className="py-24 md:py-32 bg-white border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="section-sublabel">
            PENGALAMAN KLIEN LADI
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0f172a] tracking-tight mt-2">
            Kata Mereka yang Sudah <span className="text-[#1853a7]">Merasakan Hasilnya</span>
          </h2>
          <div className="decorative-line-center" />
          <p className="text-slate-600 text-base sm:text-lg">
            Bentuk nyata usaha klien Ladi yang kini tampil profesional, dipercaya masyarakat lokal, dan ramai pelanggan di internet.
          </p>
        </div>

        {/* 3 Testimonial Cards with Real Business Photos & Client Avatars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="group rounded-3xl bg-[#f8fafc] border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 corporate-card flex flex-col justify-between"
            >
              <div>
                {/* Bentuk Nyata Usaha Klien (Real Business Premises Photo) */}
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-200">
                  <Image
                    src={t.businessPhoto}
                    alt={`Usaha ${t.business}`}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent pointer-events-none" />

                  {/* Top Overlay Badge: Bentuk Usaha Klien */}
                  <div className="absolute top-3.5 left-3.5">
                    <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white font-medium text-[11px] tracking-wide border border-white/20">
                      🏢 {t.businessType}
                    </span>
                  </div>

                  {/* Google Maps Verified Tag */}
                  <div className="absolute bottom-3 left-3.5 right-3.5 flex items-center justify-between text-white text-xs">
                    <div className="font-bold drop-shadow-sm truncate">
                      {t.business}
                    </div>
                    <div className="shrink-0 flex items-center gap-1 bg-white/20 backdrop-blur-md px-2 py-0.5 rounded-full text-[10px] font-semibold text-emerald-300 border border-white/10">
                      <span>✓</span> Verified Google
                    </div>
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-6 sm:p-7 space-y-4">
                  {/* Rating Stars & Maps Rating */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-[#fa824b]">
                      {Array.from({ length: 5 }).map((_, j) => (
                        <svg key={j} width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                        </svg>
                      ))}
                      <span className="text-xs font-bold text-slate-800 ml-1">5.0</span>
                    </div>

                    <span className="text-[11px] font-medium text-slate-500">
                      📍 {t.mapsRating}
                    </span>
                  </div>

                  {/* Testimonial Quote */}
                  <blockquote className="text-slate-700 text-sm leading-relaxed italic">
                    &ldquo;{t.quote}&rdquo;
                  </blockquote>

                  {/* Impact Highlight Pill */}
                  <div className="p-2.5 rounded-xl bg-[#1853a7]/10 text-[#1853a7] font-bold text-xs">
                    {t.impact}
                  </div>
                </div>
              </div>

              {/* Client Profile Avatar & Details */}
              <div className="p-6 sm:p-7 pt-0">
                <div className="pt-4 border-t border-slate-200/80 flex items-center gap-3.5">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0 ring-2 ring-white shadow-md bg-slate-200">
                    <Image
                      src={t.avatar}
                      alt={t.author}
                      fill
                      className="object-cover"
                      sizes="48px"
                    />
                  </div>
                  <div className="min-w-0">
                    <div className="font-bold text-slate-900 text-sm flex items-center gap-1.5 truncate">
                      {t.author}
                      <span className="text-blue-500 text-xs" title="Klien Terverifikasi">✓</span>
                    </div>
                    <div className="text-xs text-slate-500 truncate">
                      {t.role} · {t.business}
                    </div>
                    <div className="text-[11px] text-slate-400 truncate">
                      {t.location}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
