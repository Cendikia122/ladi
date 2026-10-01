"use client";
import { useState } from "react";

export default function RequestCallSection() {
  const [form, setForm] = useState({
    name: "",
    businessName: "",
    phone: "",
    city: "Bogor / Depok",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = encodeURIComponent(
      `Halo Ladi Layanan Digital! Saya mau minta Audit Digital Gratis untuk usaha saya:\n\nNama: ${form.name}\nNama Usaha: ${form.businessName}\nKota: ${form.city}\nWhatsApp: ${form.phone}\n\nTerima kasih!`
    );
    window.open(`https://wa.me/6281298319944?text=${text}`, "_blank");
    setSubmitted(true);
  };

  return (
    <section id="konsultasi" className="py-24 md:py-32 bg-[#1853a7] text-white relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Text Column */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#fa824b] text-white font-bold text-xs uppercase tracking-wider">
              100% GRATIS · SELESAI 15-20 MENIT
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Ketahui Apa yang Kurang dari Bisnis Anda.
            </h2>

            <div className="w-16 h-1.5 bg-[#fa824b] rounded-full" />

            <p className="text-slate-100 text-base sm:text-lg leading-relaxed font-normal">
              Sebelum mengeluarkan uang sepeser pun, kami periksa <strong>10 poin penting</strong> kehadiran digital usaha Anda. Kami beri skor 0–100 dan daftar perbaikan yang konkret.
            </p>

            <div className="space-y-3 pt-2 text-sm text-slate-100">
              <div className="flex items-center gap-2.5">
                <span className="w-6 h-6 rounded-full bg-[#fa824b] text-white flex items-center justify-center font-bold text-xs shrink-0">✓</span>
                <span>Tanpa tekanan beli — laporan jadi milik Anda</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="w-6 h-6 rounded-full bg-[#fa824b] text-white flex items-center justify-center font-bold text-xs shrink-0">✓</span>
                <span>Hasil langsung dikirim via WhatsApp</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="w-6 h-6 rounded-full bg-[#fa824b] text-white flex items-center justify-center font-bold text-xs shrink-0">✓</span>
                <span>Konsultasi santai dan mudah dimengerti</span>
              </div>
            </div>
          </div>

          {/* Right Form Card - Big Clear Inputs for Easy Reading */}
          <div className="lg:col-span-6">
            <div className="bg-white rounded-3xl p-7 sm:p-9 text-[#0f172a] shadow-2xl">
              <div className="mb-6">
                <h3 className="text-2xl font-extrabold text-[#0f172a]">
                  Minta Audit Usaha Gratis
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Cukup isi data singkat di bawah ini:
                </p>
              </div>

              {submitted ? (
                <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-500 text-white font-bold text-xl mx-auto flex items-center justify-center">
                    ✓
                  </div>
                  <h4 className="font-bold text-emerald-900 text-lg">Pesan Terkirim ke WhatsApp!</h4>
                  <p className="text-xs text-emerald-700">
                    Tim Ladi akan segera memeriksa bisnis Anda dan mengirimkan hasilnya.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Nama Bapak / Ibu
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Pak Budi"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full px-4 py-3.5 rounded-xl border border-slate-300 text-base focus:outline-none focus:border-[#1853a7] focus:ring-2 focus:ring-[#1853a7]/20 bg-[#f8fafc]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Nama Usaha / Toko
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Toko Roti Sedap / Bengkel Maju"
                      value={form.businessName}
                      onChange={(e) => setForm({ ...form, businessName: e.target.value })}
                      className="w-full px-4 py-3.5 rounded-xl border border-slate-300 text-base focus:outline-none focus:border-[#1853a7] focus:ring-2 focus:ring-[#1853a7]/20 bg-[#f8fafc]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Nomor WhatsApp Anda
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="Contoh: 0812-xxxx-xxxx"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="w-full px-4 py-3.5 rounded-xl border border-slate-300 text-base focus:outline-none focus:border-[#1853a7] focus:ring-2 focus:ring-[#1853a7]/20 bg-[#f8fafc]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 px-6 rounded-full bg-[#fa824b] hover:bg-[#e5723b] text-white font-bold text-sm sm:text-base uppercase tracking-wider shadow-lg shadow-[#fa824b]/30 transition-all hover:-translate-y-0.5 active:translate-y-0 mt-2"
                  >
                    Kirim via WhatsApp Sekarang →
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
