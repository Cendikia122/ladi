import Link from "next/link";
import TopBar from "@/app/components/TopBar";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import WhatsAppButton from "@/app/components/WhatsAppButton";
import BuilderClient from "./BuilderClient";
import { getTemplates } from "@/app/lib/storage";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Kalkulator & Rakit Website Custom (Pecahan Kebutuhan Bisnis) — Ladi",
  description:
    "Rancang sendiri website bisnis Anda sesuai budget. Pilih skala fondasi, referensi desain katalog Ladi, domain resmi, dan add-ons kebutuhan usaha Anda.",
};

export default async function BuilderPage() {
  const templates = await getTemplates();

  return (
    <>
      <TopBar />
      <Navbar />

      <main className="bg-[#f8fafc] text-[#0f172a] min-h-screen py-10 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Header & Breadcrumb */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Link href="/" className="hover:text-slate-800">Beranda</Link>
              <span>/</span>
              <Link href="/pricing" className="hover:text-slate-800">Paket Harga</Link>
              <span>/</span>
              <span className="text-slate-800 font-semibold">Custom Web Builder (Pecahan Kebutuhan Bisnis)</span>
            </div>

            <div className="max-w-3xl">
              <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
                Kalkulator &amp; Rakit Website Sesuai Kebutuhan
              </h1>
              <p className="text-sm sm:text-base text-slate-600 mt-2 leading-relaxed">
                Mau website yang benar-benar pas dengan skala operasional dan budget usaha Anda? Rakit komponen secara transparan: fondasi website, katalog referensi desain Ladi, visibilitas Google Maps, dan ekstensi domain resmi.
              </p>
            </div>
          </div>

          {/* Builder Client Interaktif */}
          <BuilderClient initialTemplates={templates} />
        </div>
      </main>

      <WhatsAppButton />
      <Footer />
    </>
  );
}
