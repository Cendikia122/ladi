"use client";

import { useState } from "react";
import Link from "next/link";
import { OrderItem } from "@/app/lib/storage";
import { Config } from "@/app/lib/config";

interface OrderViewClientProps {
  initialOrder: OrderItem;
}

export default function OrderViewClient({ initialOrder }: OrderViewClientProps) {
  const [order, setOrder] = useState<OrderItem>(initialOrder);
  const [isUploading, setIsUploading] = useState(false);
  const [copiedBank, setCopiedBank] = useState<string | null>(null);
  const [uploadMessage, setUploadMessage] = useState("");
  const [uploadError, setUploadError] = useState("");

  const formattedPrice = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(order.package_price);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedBank(key);
    setTimeout(() => setCopiedBank(null), 2500);
  };

  // Helper kompres & upload gambar bukti transfer
  const handleProofUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setUploadError("Harap pilih file gambar (JPG, PNG, atau WEBP).");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setUploadError("Ukuran file terlalu besar (maksimal 10MB).");
      return;
    }

    setIsUploading(true);
    setUploadMessage("");
    setUploadError("");

    try {
      // Kompres via HTML5 Canvas di browser agar ringan
      const compressedBase64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          const img = new Image();
          img.onload = () => {
            const canvas = document.createElement("canvas");
            const maxDimension = 1200;
            let width = img.width;
            let height = img.height;

            if (width > height && width > maxDimension) {
              height = Math.round((height * maxDimension) / width);
              width = maxDimension;
            } else if (height > maxDimension) {
              width = Math.round((width * maxDimension) / height);
              height = maxDimension;
            }

            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext("2d");
            if (ctx) {
              ctx.drawImage(img, 0, 0, width, height);
              resolve(canvas.toDataURL("image/jpeg", 0.75));
            } else {
              resolve(event.target?.result as string);
            }
          };
          img.onerror = reject;
          img.src = event.target?.result as string;
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      const res = await fetch(`/api/orders/${order.order_number}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "upload_proof",
          payment_proof: compressedBase64,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Gagal mengunggah bukti pembayaran.");
      }

      setOrder(data.order);
      setUploadMessage("Bukti transfer berhasil diterima! Tim Ladi sedang memverifikasi pembayaran Anda.");
    } catch (err: any) {
      setUploadError(err.message || "Gagal mengunggah bukti.");
    } finally {
      setIsUploading(false);
    }
  };

  const getStatusBadge = () => {
    switch (order.payment_status) {
      case "paid":
        return (
          <span className="px-3.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-extrabold uppercase tracking-wider flex items-center gap-1.5 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Lunas / Terverifikasi
          </span>
        );
      case "waiting_verification":
        return (
          <span className="px-3.5 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-extrabold uppercase tracking-wider flex items-center gap-1.5 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
            Menunggu Verifikasi Admin
          </span>
        );
      case "cancelled":
        return (
          <span className="px-3.5 py-1 rounded-full bg-slate-200 text-slate-700 text-xs font-extrabold uppercase tracking-wider">
            Dibatalkan
          </span>
        );
      default:
        return (
          <span className="px-3.5 py-1 rounded-full bg-orange-100 text-[#fa824b] text-xs font-extrabold uppercase tracking-wider flex items-center gap-1.5 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[#fa824b] animate-ping"></span>
            Menunggu Pembayaran
          </span>
        );
    }
  };

  const isPaid = order.payment_status === "paid";
  const isWaiting = order.payment_status === "waiting_verification";

  return (
    <div className="space-y-8">
      {/* Kartu Status Utama */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <span className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-widest block mb-1">
              Nomor Invoice Resmi
            </span>
            <div className="flex items-center gap-3">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 font-mono tracking-tight">
                #{order.order_number}
              </h1>
              <button
                type="button"
                onClick={() => copyToClipboard(order.order_number, "order_number")}
                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 text-[11px] font-semibold transition-colors"
              >
                {copiedBank === "order_number" ? "Tersalin! ✓" : "Salin"}
              </button>
            </div>
            <span className="text-xs text-slate-500 mt-1 block">
              Dibuat pada {new Date(order.created_at).toLocaleDateString("id-ID", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })} WIB
            </span>
          </div>

          <div className="flex sm:flex-col sm:items-end gap-2">{getStatusBadge()}</div>
        </div>

        {/* Banner Sukses Jika Sudah Lunas */}
        {isPaid && (
          <div className="p-5 sm:p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 space-y-3">
            <div className="flex items-center gap-2.5">
              <span className="text-2xl">🎉</span>
              <div>
                <h3 className="text-sm sm:text-base font-extrabold text-emerald-950">
                  Pembayaran Terkonfirmasi Lunas!
                </h3>
                <p className="text-xs text-emerald-800">
                  Terima kasih, pembayaran pesanan Anda telah diverifikasi oleh sistem Ladi.
                </p>
              </div>
            </div>
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <a
                href={`https://wa.me/${Config.whatsappNumber}?text=Halo+Ladi%2C+pembayaran+saya+untuk+order+${order.order_number}+sudah+lunas.+Mohon+panduan+langkah+selanjutnya.`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md inline-flex items-center gap-2"
              >
                <span>💬 Mulai Pengerjaan via WhatsApp</span>
                <span>→</span>
              </a>
              <button
                type="button"
                onClick={() => window.print()}
                className="px-4 py-2.5 rounded-full bg-white hover:bg-emerald-100/60 text-emerald-800 border border-emerald-300 font-bold text-xs transition-colors"
              >
                🖨️ Cetak / Simpan Kuitansi
              </button>
            </div>
          </div>
        )}

        {/* Banner Menunggu Verifikasi */}
        {isWaiting && (
          <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 space-y-2">
            <div className="flex items-center gap-2.5">
              <span className="text-2xl">⏳</span>
              <div>
                <h3 className="text-sm font-extrabold text-amber-950">
                  Bukti Pembayaran Sedang Diverifikasi
                </h3>
                <p className="text-xs text-amber-800 leading-relaxed">
                  Bukti transfer Anda telah tersimpan di sistem kami. Tim finance Ladi biasanya memverifikasi dalam 5–15 menit kerja.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Rincian Produk & Total Biaya */}
        <div className="space-y-4">
          <h2 className="text-xs font-bold font-mono uppercase tracking-wider text-slate-400">
            Rincian Tagihan
          </h2>

          <div className="bg-slate-50 rounded-2xl p-4 sm:p-5 border border-slate-200/80 space-y-3">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-sm sm:text-base font-extrabold text-slate-900">
                  {order.package_name}
                </div>
                <div className="text-xs text-slate-500 mt-0.5">
                  Untuk Usaha: <strong>{order.business_name}</strong> ({order.business_category})
                </div>
                {order.domain_requested && (
                  <div className="text-xs text-blue-600 mt-0.5 font-mono">
                    Domain: {order.domain_requested}
                  </div>
                )}
              </div>
              <div className="text-sm sm:text-base font-bold text-slate-800 text-right">
                {formattedPrice}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200/80 flex items-center justify-between">
              <span className="text-xs sm:text-sm font-black text-slate-900">
                Total Tagihan Pembayaran
              </span>
              <span className="text-xl sm:text-2xl font-black text-[#1853a7]">
                {formattedPrice}
              </span>
            </div>
          </div>
        </div>

        {/* Rincian Klien */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-600 pt-2">
          <div className="p-3.5 rounded-xl bg-slate-50/50 border border-slate-100 space-y-1">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
              Pemesan
            </span>
            <div className="font-bold text-slate-800">{order.customer_name}</div>
            <div>WhatsApp: {order.customer_phone}</div>
            {order.customer_email && <div>Email: {order.customer_email}</div>}
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50/50 border border-slate-100 space-y-1">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
              Metode Pembayaran Dipilih
            </span>
            <div className="font-bold text-slate-800">
              {order.payment_method === "QRIS"
                ? "📱 QRIS Instan (Semua Bank & E-Wallet)"
                : order.payment_method === "BCA"
                ? "🏦 Transfer Bank BCA"
                : "🏦 Transfer Bank Mandiri"}
            </div>
            <div>Status: <span className="font-semibold">{order.payment_status}</span></div>
          </div>
        </div>
      </div>

      {/* Bagian Instruksi Pembayaran (Hanya Muncul Jika Belum Lunas) */}
      {!isPaid && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <h2 className="text-sm sm:text-base font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <span>💳</span>
              <span>Instruksi Pembayaran Resmi</span>
            </h2>
            <span className="text-xs text-slate-400 font-mono">Batas: 24 Jam</span>
          </div>

          {/* Jika QRIS */}
          {order.payment_method === "QRIS" && (
            <div className="flex flex-col md:flex-row items-center gap-8 bg-slate-50 rounded-2xl p-6 border border-slate-200">
              {/* Tampilan Visual Kartu QRIS */}
              <div className="bg-white p-5 rounded-2xl border-2 border-slate-800 shadow-md flex flex-col items-center max-w-[280px] w-full shrink-0">
                <div className="w-full flex items-center justify-between pb-3 border-b border-slate-100">
                  <span className="text-xs font-black tracking-widest text-red-600">QRIS</span>
                  <span className="text-[9px] font-mono text-slate-400 font-bold">GPN</span>
                </div>

                <div className="py-4 flex flex-col items-center text-center">
                  <div className="text-[11px] font-bold text-slate-800 uppercase tracking-wide">
                    {Config.payment.qrisMerchant}
                  </div>
                  <div className="text-[9px] font-mono text-slate-400 mt-0.5">
                    NMID: {Config.payment.nmid}
                  </div>

                  {/* QR Graphic Modern */}
                  <div className="my-3 p-3 bg-white border border-slate-300 rounded-xl shadow-inner">
                    <svg
                      className="w-44 h-44"
                      viewBox="0 0 200 200"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <rect width="200" height="200" fill="white" />
                      {/* Posisi pojok kiri atas */}
                      <rect x="15" y="15" width="50" height="50" fill="#0f172a" rx="4" />
                      <rect x="23" y="23" width="34" height="34" fill="white" rx="2" />
                      <rect x="29" y="29" width="22" height="22" fill="#0f172a" rx="2" />
                      {/* Posisi pojok kanan atas */}
                      <rect x="135" y="15" width="50" height="50" fill="#0f172a" rx="4" />
                      <rect x="143" y="23" width="34" height="34" fill="white" rx="2" />
                      <rect x="149" y="29" width="22" height="22" fill="#0f172a" rx="2" />
                      {/* Posisi pojok kiri bawah */}
                      <rect x="15" y="135" width="50" height="50" fill="#0f172a" rx="4" />
                      <rect x="23" y="143" width="34" height="34" fill="white" rx="2" />
                      <rect x="29" y="149" width="22" height="22" fill="#0f172a" rx="2" />
                      {/* Pattern titik QR */}
                      <rect x="75" y="20" width="10" height="10" fill="#0f172a" />
                      <rect x="95" y="20" width="10" height="20" fill="#0f172a" />
                      <rect x="115" y="20" width="10" height="10" fill="#0f172a" />
                      <rect x="75" y="40" width="20" height="10" fill="#0f172a" />
                      <rect x="105" y="40" width="10" height="10" fill="#0f172a" />
                      <rect x="20" y="75" width="10" height="20" fill="#0f172a" />
                      <rect x="40" y="75" width="20" height="10" fill="#0f172a" />
                      <rect x="75" y="75" width="20" height="20" fill="#fa824b" rx="2" />
                      <rect x="105" y="75" width="20" height="10" fill="#0f172a" />
                      <rect x="135" y="75" width="10" height="20" fill="#0f172a" />
                      <rect x="155" y="75" width="25" height="10" fill="#0f172a" />
                      <rect x="20" y="105" width="30" height="10" fill="#0f172a" />
                      <rect x="60" y="105" width="10" height="10" fill="#0f172a" />
                      <rect x="80" y="105" width="20" height="20" fill="#0f172a" />
                      <rect x="110" y="105" width="10" height="20" fill="#fa824b" rx="2" />
                      <rect x="130" y="105" width="30" height="10" fill="#0f172a" />
                      <rect x="170" y="105" width="10" height="20" fill="#0f172a" />
                      <rect x="75" y="135" width="20" height="10" fill="#0f172a" />
                      <rect x="105" y="135" width="10" height="20" fill="#0f172a" />
                      <rect x="125" y="135" width="20" height="10" fill="#0f172a" />
                      <rect x="155" y="135" width="25" height="20" fill="#0f172a" />
                      <rect x="75" y="155" width="10" height="25" fill="#0f172a" />
                      <rect x="95" y="165" width="20" height="15" fill="#0f172a" />
                      <rect x="125" y="160" width="10" height="20" fill="#0f172a" />
                    </svg>
                  </div>

                  <span className="text-[10px] text-slate-500 font-medium">
                    Nominal: <strong className="text-slate-900">{formattedPrice}</strong>
                  </span>
                </div>

                <div className="w-full pt-2 border-t border-slate-100 text-center">
                  <span className="text-[9px] text-slate-400">
                    BCA · Mandiri · BRI · BNI · GoPay · OVO · ShopeePay
                  </span>
                </div>
              </div>

              {/* Langkah Cara Scan */}
              <div className="space-y-3 text-xs text-slate-600 flex-1">
                <h3 className="text-sm font-bold text-slate-900">
                  Cara Bayar Menggunakan QRIS:
                </h3>
                <ol className="space-y-2 list-decimal list-inside leading-relaxed">
                  <li>Buka aplikasi m-Banking Anda (BCA, Mandiri, BRI, BNI) atau e-Wallet (GoPay, OVO, ShopeePay, Dana).</li>
                  <li>Pilih menu <strong>Scan / Bayar QRIS</strong>.</li>
                  <li>Arahkan kamera ke kode QR di samping atau tangkap layar (screenshot).</li>
                  <li>Pastikan nama merchant tertera <strong>{Config.payment.qrisMerchant}</strong>.</li>
                  <li>Masukkan nominal tepat <strong>{formattedPrice}</strong> lalu selesaikan pembayaran.</li>
                  <li>Unggah foto bukti transfer di formulir bawah ini untuk mempercepat verifikasi.</li>
                </ol>
              </div>
            </div>
          )}

          {/* Jika Transfer Bank BCA */}
          {order.payment_method === "BCA" && (
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-white rounded-xl border border-slate-200">
                <div>
                  <span className="text-[10px] font-bold text-blue-600 block">BANK CENTRAL ASIA (BCA)</span>
                  <div className="text-xl font-mono font-black text-slate-900 mt-0.5">
                    {Config.payment.bca.accountNumber}
                  </div>
                  <span className="text-xs text-slate-500">
                    a/n {Config.payment.bca.accountHolder}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => copyToClipboard(Config.payment.bca.accountNumber, "bca")}
                  className="px-4 py-2 rounded-xl bg-[#1853a7] hover:bg-[#0f3d7d] text-white font-bold text-xs uppercase tracking-wider transition-colors self-start sm:self-center"
                >
                  {copiedBank === "bca" ? "Nomor Tersalin! ✓" : "Salin No. Rekening"}
                </button>
              </div>
              <div className="text-xs text-slate-500">
                Nominal transfer: <strong className="text-slate-900 text-sm">{formattedPrice}</strong>
              </div>
            </div>
          )}

          {/* Jika Transfer Bank Mandiri */}
          {order.payment_method === "MANDIRI" && (
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-white rounded-xl border border-slate-200">
                <div>
                  <span className="text-[10px] font-bold text-amber-600 block">BANK MANDIRI</span>
                  <div className="text-xl font-mono font-black text-slate-900 mt-0.5">
                    {Config.payment.mandiri.accountNumber}
                  </div>
                  <span className="text-xs text-slate-500">
                    a/n {Config.payment.mandiri.accountHolder}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => copyToClipboard(Config.payment.mandiri.accountNumber, "mandiri")}
                  className="px-4 py-2 rounded-xl bg-[#1853a7] hover:bg-[#0f3d7d] text-white font-bold text-xs uppercase tracking-wider transition-colors self-start sm:self-center"
                >
                  {copiedBank === "mandiri" ? "Nomor Tersalin! ✓" : "Salin No. Rekening"}
                </button>
              </div>
              <div className="text-xs text-slate-500">
                Nominal transfer: <strong className="text-slate-900 text-sm">{formattedPrice}</strong>
              </div>
            </div>
          )}

          {/* Form Upload Bukti Transfer */}
          <div className="pt-4 border-t border-slate-100 space-y-3">
            <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-slate-700">
              Unggah Bukti Transfer / Resi
            </h3>

            {uploadMessage && (
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs">
                {uploadMessage}
              </div>
            )}

            {uploadError && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs">
                {uploadError}
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <label className="flex-1 py-3 px-4 rounded-xl border-2 border-dashed border-slate-300 hover:border-[#fa824b] bg-slate-50 hover:bg-white text-slate-600 text-xs font-medium cursor-pointer transition-colors flex items-center justify-center gap-2">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
                <span>{isUploading ? "Mengunggah bukti..." : "Pilih Foto Resi / Screenshot Bukti Bayar"}</span>
                <input
                  type="file"
                  accept="image/*"
                  disabled={isUploading}
                  onChange={handleProofUpload}
                  className="hidden"
                />
              </label>

              <a
                href={`https://wa.me/${Config.whatsappNumber}?text=Halo+Ladi%2C+saya+sudah+melakukan+transfer+untuk+Invoice+${order.order_number}+sebesar+${encodeURIComponent(formattedPrice)}.+Mohon+cek+pembayaran+saya.`}
                target="_blank"
                rel="noopener noreferrer"
                className="py-3 px-5 rounded-xl bg-[#fa824b] hover:bg-[#e5723b] text-white font-bold text-xs uppercase tracking-wider transition-colors shrink-0 flex items-center justify-center gap-2"
              >
                <span>Konfirmasi Cepat via WA</span>
                <span>💬</span>
              </a>
            </div>
            <p className="text-[10px] text-slate-400">
              Format yang didukung: JPG, PNG, WEBP. Otomatis dikompresi agar hemat kuota.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
