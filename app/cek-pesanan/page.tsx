import Link from "next/link";
import TopBar from "@/app/components/TopBar";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import WhatsAppButton from "@/app/components/WhatsAppButton";
import CekPesananClient from "./CekPesananClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Cek Status & Invoice Pesanan — Ladi (Layanan Digital)",
  description:
    "Lacak pesanan pembuatan website Anda di Ladi. Cukup masukkan nomor WhatsApp atau nomor invoice untuk melihat tagihan, QRIS, dan progres pengerjaan.",
};

export default function CekPesananPage() {
  return (
    <>
      <TopBar />
      <Navbar />

      <main className="bg-[#f8fafc] text-[#0f172a] min-h-screen py-10 sm:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Breadcrumb & Title */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Link href="/" className="hover:text-slate-800">Beranda</Link>
              <span>/</span>
              <span className="text-slate-800 font-semibold">Cek Status Pesanan</span>
            </div>

            <div>
              <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
                Lacak &amp; Cek Pesanan Anda
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-xl">
                Tidak sengaja menutup tab pembayaran? Jangan khawatir. Masukkan nomor WhatsApp atau nomor invoice Anda di bawah ini untuk membuka kembali tagihan Anda.
              </p>
            </div>
          </div>

          <CekPesananClient />
        </div>
      </main>

      <WhatsAppButton />
      <Footer />
    </>
  );
}
