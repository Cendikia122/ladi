"use client";
import { useState } from "react";
import Link from "next/link";
import TopBar from "../components/TopBar";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import WhatsAppButton from "../components/WhatsAppButton";

const faqs = [
  {
    q: "Saya tidak paham komputer atau teknologi sama sekali, apakah bisa dibantu?",
    a: "Tentu saja! Justru itulah alasan Ladi didirikan. Anda sama sekali tidak perlu mengerti urusan teknis seperti hosting, server, atau coding. Yang perlu Anda lakukan hanyalah menceritakan usaha Anda dan mengirimkan foto produk lewat WhatsApp. Tim Ladi yang mengurus sisanya dari A sampai Z.",
  },
  {
    q: "Berapa lama proses pembuatan sampai website saya aktif?",
    a: "Untuk Paket EXIST selesai dalam 5–7 hari kerja. Paket RISE selesai dalam 10–14 hari kerja. Dan Paket RUN selesai dalam 14–21 hari kerja. Selama proses pengerjaan, kami akan selalu memberikan kabar pembaruan berkala.",
  },
  {
    q: "Bagaimana sistem pembayarannya?",
    a: "Kami menerapkan sistem aman dan adil: DP 50% sebelum pengerjaan dimulai, dan pelunasan 50% sisanya HANYA setelah website selesai kami demokan kepada Anda dan siap ditayangkan secara publik.",
  },
  {
    q: "Apa itu Laporan Dampak Bulanan yang dikirim lewat WhatsApp?",
    a: "Bagi klien paket GUARD (atau klien paket RISE pada 30 hari pertama), kami mengirimkan laporan ringkas yang mudah dipahami setiap bulan. Isinya adalah angka nyata: berapa kali usaha Anda muncul di Google, berapa orang yang klik website, dan berapa panggilan telepon yang masuk.",
  },
  {
    q: "Apakah website dan nama domain menjadi hak milik saya penuh?",
    a: "Ya, 100% hak milik Anda. Kami memegang teguh prinsip kedaulatan klien. Anda bebas menggunakan nama bisnis Anda sendiri tanpa ada sistem sewa tersembunyi atau sandera aset.",
  },
  {
    q: "Bagaimana jika nanti saya ingin mengganti harga produk atau menambah foto baru?",
    a: "Sangat mudah. Anda cukup mengirimkan foto atau teks baru tersebut ke nomor WhatsApp kami. Tim Ladi yang akan memasukkannya ke dalam website Anda.",
  },
];

export default function FAQPage() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <>
      <TopBar />
      <Navbar />

      <main className="bg-[#f8fafc] text-[#0f172a]">
        <section className="bg-[#0f172a] text-white py-16 lg:py-20 border-b border-slate-800 text-center">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <span className="font-mono text-xs text-[#fa824b] font-bold uppercase tracking-wider block mb-2">
              TANYA JAWAB PRAKTIS
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
              Pertanyaan yang Sering Diajukan
            </h1>
            <p className="text-slate-300 text-base sm:text-lg mt-3 max-w-xl mx-auto">
              Jawaban santai dan jelas seputar cara kerja, biaya, dan pendampingan Ladi.
            </p>
          </div>
        </section>

        <section className="py-20 md:py-28">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
            {faqs.map((f, i) => (
              <div
                key={i}
                className="rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-sm transition-all"
              >
                <button
                  type="button"
                  onClick={() => setOpen(open === i ? null : i)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 font-bold text-slate-900 text-base sm:text-lg"
                >
                  <span>{f.q}</span>
                  <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shrink-0 transition-colors ${
                    open === i ? "bg-[#1853a7] text-white" : "bg-slate-100 text-slate-500"
                  }`}>
                    {open === i ? "−" : "+"}
                  </span>
                </button>
                {open === i && (
                  <div className="px-5 sm:px-6 pb-6 pt-1 text-sm text-slate-600 leading-relaxed border-t border-slate-100">
                    {f.a}
                  </div>
                )}
              </div>
            ))}

            {/* Chat Callout */}
            <div className="mt-12 p-8 rounded-3xl bg-white border border-slate-200 text-center space-y-3">
              <h3 className="font-bold text-slate-900 text-xl">Masih Ada Pertanyaan yang Belum Terjawab?</h3>
              <p className="text-sm text-slate-600 max-w-md mx-auto">
                Silakan tanya langsung ke WhatsApp kami. Tim Ladi siap menjelaskan dengan ramah dan santai.
              </p>
              <div className="pt-2">
                <a
                  href="https://wa.me/6281298319944?text=Halo+Ladi%2C+saya+mau+tanya-tanya+soal+layanan+digital."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-7 py-3 rounded-full bg-[#fa824b] hover:bg-[#e5723b] text-white font-bold text-xs uppercase tracking-wider"
                >
                  Tanya via WhatsApp Sekarang →
                </a>
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
