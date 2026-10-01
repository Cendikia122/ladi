"use client";
import { useState } from "react";

const faqs = [
  {
    q: "Apa perbedaan fundamental antara infrastruktur Ladi dengan template website biasa?",
    a: "Website komoditas umumnya dibangun menggunakan template instan sarat plugin pihak ketiga yang memperlambat waktu muat, membebani server, dan rentan terhadap celah keamanan. Ladi merekayasa arsitektur web modern dari kode murni Next.js, terdistribusi pada jaringan edge global, dengan struktur data semantik Schema.org yang siap dibaca oleh mesin pencari tingkat dunia.",
  },
  {
    q: "Bagaimana sistem Ladi membuat bisnis saya hidup dan ditemukan di internet global?",
    a: "Kami tidak sekadar memasang penanda peta lokal. Kami menanamkan struktur data hierarkis terverifikasi (JSON-LD), sinkronisasi entitas pada Google Knowledge Graph, kepatuhan teknis Core Web Vitals, dan deployment ke 300+ CDN edge nodes Anycast di seluruh dunia. Hasilnya adalah otoritas pencarian yang sah dan kecepatan akses instan dari belahan dunia mana pun.",
  },
  {
    q: "Apakah saya memiliki kepemilikan mutlak atas kode sumber dan domain?",
    a: "Ya, 100%. Kami memegang prinsip kedaulatan digital. Seluruh repositori kode, domain, kredensial DNS, dan data telemetri diserahkan sepenuhnya atas nama bisnis Anda. Tidak ada mekanisme vendor lock-in atau retensi sepihak.",
  },
  {
    q: "Berapa lama jangka waktu implementasi dari audit hingga peluncuran?",
    a: "Siklus implementasi paket Foundation membutuhkan waktu 5–7 hari kerja, sedangkan arsitektur Expansion membutuhkan 10–14 hari kerja. Setiap tahap memiliki deliverable yang terverifikasi dan dilaporkan secara berkala melalui staging environment sebelum deployment publik.",
  },
  {
    q: "Bagaimana sistem pembayaran dan komitmen awal?",
    a: "Kami menerapkan skema transparan: 50% alokasi awal saat memulai rekayasa sistem, dan 50% pelunasan setelah seluruh checklist verifikasi disetujui pada staging environment sebelum deployment ke domain utama Anda. Evaluasi kesiapan awal selalu disediakan gratis tanpa komitmen finansial apa pun.",
  },
  {
    q: "Apakah bisnis saya membutuhkan tim teknis internal untuk pemeliharaan?",
    a: "Tidak. Arsitektur yang kami bangun dirancang untuk zero-friction maintenance. Bagi bisnis yang membutuhkan pemantauan berkelanjutan, pembaruan konten berkala, dan asistensi teknis, paket Enterprise & Guard menyediakan pendampingan teknis bulanan dengan SLA respons terjamin.",
  },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="faq" className="py-24 md:py-36 border-t border-white/[0.08] bg-[#08090a]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="max-w-2xl mb-16 md:mb-20">
          <div className="font-mono text-xs text-zinc-500 uppercase tracking-wider mb-4">
            [ PERTANYAAN SISTEM ]
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-4 leading-tight">
            Transparansi Arsitektur & Kemitraan.
          </h2>
          <p className="text-sm sm:text-base text-zinc-400 leading-relaxed font-normal">
            Jawaban langsung mengenai teknologi, kepemilikan aset, dan metodologi kerja kami.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className={`rounded-xl border transition-colors duration-150 overflow-hidden ${
                open === i
                  ? "border-white/20 bg-white/[0.03]"
                  : "border-white/[0.08] bg-white/[0.015] hover:border-white/[0.14]"
              }`}
            >
              <button
                type="button"
                className="w-full flex items-center justify-between p-5 sm:p-6 text-left"
                onClick={() => setOpen(open === i ? null : i)}
              >
                <span className="font-medium text-sm sm:text-base text-zinc-200 pr-6">
                  {faq.q}
                </span>
                <span className="font-mono text-zinc-500 text-sm flex-shrink-0 select-none">
                  {open === i ? "−" : "+"}
                </span>
              </button>
              {open === i && (
                <div className="px-5 sm:px-6 pb-6 pt-1 text-xs sm:text-sm text-zinc-400 leading-relaxed border-t border-white/[0.04]">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
