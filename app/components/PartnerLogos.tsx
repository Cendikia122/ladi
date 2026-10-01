export default function PartnerLogos() {
  const standards = [
    { name: "Google Business", note: "Mudah ditemukan di Google" },
    { name: "WhatsApp Bisnis", note: "Langsung terhubung ke chat" },
    { name: "Pembayaran QRIS", note: "Praktis untuk pelanggan" },
    { name: "Next.js Modern", note: "Website super cepat di HP" },
    { name: "Keamanan SSL", note: "Aman dari virus dan hacker" },
    { name: "Domain Resmi", note: "100% hak milik Anda" },
  ];

  return (
    <section className="py-16 bg-white border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <span className="section-sublabel mb-1">
          STANDAR & TEKNOLOGI
        </span>
        <h3 className="text-xl sm:text-2xl font-extrabold text-[#0f172a] mb-8">
          Menggunakan Standar Resmi Dunia
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {standards.map((s, i) => (
            <div
              key={i}
              className="p-4 rounded-2xl bg-[#f8fafc] border border-slate-200/80 hover:border-[#1853a7]/50 transition-colors"
            >
              <div className="font-bold text-sm text-[#0f172a]">
                {s.name}
              </div>
              <div className="text-[11px] text-slate-500 mt-1">
                {s.note}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
