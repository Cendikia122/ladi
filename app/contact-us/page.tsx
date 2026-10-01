"use client";
import { useState } from "react";
import TopBar from "../components/TopBar";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import WhatsAppButton from "../components/WhatsAppButton";

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    business: "",
    phone: "",
    note: "",
  });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = encodeURIComponent(
      `Halo Ladi! Saya mau konsultasi / minta Digital Audit Gratis:\n\nNama: ${form.name}\nUsaha: ${form.business}\nNomor WA: ${form.phone}\nCatatan: ${form.note || "-"}\n\nMohon dibantu. Terima kasih!`
    );
    window.open(`https://wa.me/6281298319944?text=${text}`, "_blank");
    setSent(true);
  };

  return (
    <>
      <TopBar />
      <Navbar />

      <main className="bg-[#f8fafc] text-[#0f172a]">
        <section className="bg-[#0f172a] text-white py-16 lg:py-20 border-b border-slate-800 text-center">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <span className="font-mono text-xs text-[#fa824b] font-bold uppercase tracking-wider block mb-2">
              HUBUNGI KAMI
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
              Konsultasi Usaha Anda Bersama Ladi
            </h1>
            <p className="text-slate-300 text-base sm:text-lg mt-3 max-w-xl mx-auto">
              Silakan kirim pesan atau ajukan audit gratis. Kami merespons cepat dan ramah.
            </p>
          </div>
        </section>

        <section className="py-20 md:py-28">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
              {/* Left Column: Direct Info */}
              <div className="lg:col-span-5 space-y-8">
                <div>
                  <span className="section-sublabel">TEMAN MELEK TEKNOLOGI</span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0f172a] mt-1">
                    Kami Siap Mendengar Kebutuhan Bisnis Anda
                  </h2>
                  <div className="decorative-line" />
                  <p className="text-slate-600 text-base leading-relaxed">
                    Tidak perlu canggung atau merasa ragu jika Anda belum paham hal teknis. Kami siap diajak diskusi santai untuk kemajuan usaha Anda.
                  </p>
                </div>

                <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
                  <div className="flex items-start gap-3.5">
                    <span className="w-10 h-10 rounded-xl bg-[#fa824b]/15 text-[#fa824b] flex items-center justify-center font-bold text-lg shrink-0">
                      💬
                    </span>
                    <div>
                      <div className="text-xs text-slate-500 font-bold uppercase">WhatsApp Resmi</div>
                      <a href="https://wa.me/6281298319944" className="text-sm font-bold text-slate-900 hover:text-[#1853a7]">
                        +62 812-9831-9944
                      </a>
                      <div className="text-[11px] text-emerald-600 mt-0.5">● Respons Cepat Jam Kerja</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5 pt-3 border-t border-slate-100">
                    <span className="w-10 h-10 rounded-xl bg-[#1853a7]/10 text-[#1853a7] flex items-center justify-center font-bold text-lg shrink-0">
                      ✉️
                    </span>
                    <div>
                      <div className="text-xs text-slate-500 font-bold uppercase">Email Korespondensi</div>
                      <div className="text-sm font-bold text-slate-900">contact@layanandigital.id</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5 pt-3 border-t border-slate-100">
                    <span className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-lg shrink-0">
                      📍
                    </span>
                    <div>
                      <div className="text-xs text-slate-500 font-bold uppercase">Wilayah Layanan Utama</div>
                      <div className="text-sm font-bold text-slate-900">Bogor & Depok, Jawa Barat</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">Melayani UMKM di seluruh Indonesia</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Contact & Audit Form */}
              <div className="lg:col-span-7">
                <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-sm space-y-6">
                  <div>
                    <h3 className="text-2xl font-extrabold text-slate-900">
                      Kirim Pesan / Permintaan Audit
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-500 mt-1">
                      Pesan akan langsung terhubung ke WhatsApp resmi tim Ladi.
                    </p>
                  </div>

                  {sent ? (
                    <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-2">
                      <div className="text-2xl">✓</div>
                      <div className="font-bold text-emerald-900">WhatsApp Berhasil Dibuka!</div>
                      <p className="text-xs text-emerald-700">Silakan kirim pesan yang telah disiapkan di aplikasi WhatsApp Anda.</p>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                          Nama Anda
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="Contoh: Pak Hendra / Bu Rini"
                          value={form.name}
                          onChange={(e) => setForm({ ...form, name: e.target.value })}
                          className="w-full px-4 py-3.5 rounded-xl border border-slate-300 text-base focus:outline-none focus:border-[#1853a7] bg-[#f8fafc]"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                            Nama Usaha / Produk
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="Contoh: Katering Rasa Ibu"
                            value={form.business}
                            onChange={(e) => setForm({ ...form, business: e.target.value })}
                            className="w-full px-4 py-3.5 rounded-xl border border-slate-300 text-base focus:outline-none focus:border-[#1853a7] bg-[#f8fafc]"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                            Nomor WhatsApp
                          </label>
                          <input
                            type="tel"
                            required
                            placeholder="0812-xxxx-xxxx"
                            value={form.phone}
                            onChange={(e) => setForm({ ...form, phone: e.target.value })}
                            className="w-full px-4 py-3.5 rounded-xl border border-slate-300 text-base focus:outline-none focus:border-[#1853a7] bg-[#f8fafc]"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                          Ceritakan Kebutuhan Anda (Opsional)
                        </label>
                        <textarea
                          rows={3}
                          placeholder="Misal: Saya mau bikin website toko dan daftar di Google..."
                          value={form.note}
                          onChange={(e) => setForm({ ...form, note: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl border border-slate-300 text-base focus:outline-none focus:border-[#1853a7] bg-[#f8fafc]"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full py-4 rounded-full bg-[#fa824b] hover:bg-[#e5723b] text-white font-bold text-sm uppercase tracking-wider shadow-lg transition-all"
                      >
                        Hubungi via WhatsApp Sekarang →
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <WhatsAppButton />
    </>
  );
}
