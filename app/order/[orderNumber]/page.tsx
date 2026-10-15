import { notFound } from "next/navigation";
import Link from "next/link";
import { getOrderByNumber } from "@/app/lib/storage";
import OrderViewClient from "./OrderViewClient";
import LadiLogo from "@/app/components/LadiLogo";
import { Config } from "@/app/lib/config";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ orderNumber: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { orderNumber } = await params;
  return {
    title: `Invoice #${orderNumber} | Ladi (Layanan Digital)`,
    description: `Faktur kuitansi dan status pembayaran resmi untuk pesanan #${orderNumber}.`,
  };
}

export default async function OrderInvoicePage({ params }: Props) {
  const { orderNumber } = await params;
  const decodedOrderNumber = decodeURIComponent(orderNumber || "").trim();
  const order = await getOrderByNumber(decodedOrderNumber);

  if (!order) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#0f172a] selection:bg-[#fa824b] selection:text-white print:bg-white">
      {/* Top Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 print:hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="hover:opacity-90 transition-opacity">
              <LadiLogo />
            </Link>
            <span className="hidden sm:inline-block text-xs font-mono font-bold text-slate-400 pl-3 border-l border-slate-200 uppercase tracking-widest">
              Digital Invoice
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
            >
              ← Kembali ke Beranda
            </Link>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <OrderViewClient initialOrder={order} />
      </main>
    </div>
  );
}
