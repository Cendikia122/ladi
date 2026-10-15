"use client";

import { useState, useEffect } from "react";
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

  // Simpan riwayat invoice ke localStorage browser agar tidak hilang
  useEffect(() => {
    if (typeof window !== "undefined" && order.order_number) {
      try {
        const stored = JSON.parse(localStorage.getItem("ladi_recent_orders") || "[]");
        const updated = [order.order_number, ...stored.filter((x: string) => x !== order.order_number)].slice(0, 5);
        localStorage.setItem("ladi_recent_orders", JSON.stringify(updated));
      } catch {}
    }
  }, [order.order_number]);

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
              <a
                href={`https://wa.me/?text=${encodeURIComponent(`Halo, ini link tagihan website saya di Ladi:\nhttps://www.layanandigital.id/order/${order.order_number}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-[11px] font-semibold transition-colors flex items-center gap-1"
                title="Kirim link invoice ke WhatsApp agar tersimpan di chat"
              >
                <span>📲 Simpan ke WA</span>
              </a>
            </div>
            <span className="text-xs text-slate-500 mt-1 block">
              Dibuat pada {new Date(order.created_at).toLocaleDateString("id-ID", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })} WIB · <Link href="/cek-pesanan" className="text-blue-600 hover:underline">Halaman Cek Pesanan</Link>
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

          <div className="bg-slate-50 rounded-2xl p-4 sm:p-5 border border-slate-200/80 space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm sm:text-base font-extrabold text-slate-900">
                    {order.package_name}
                  </span>
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-[#1853a7] text-white uppercase">
                    {order.order_type === "pecahan" ? "🧩 Kustom LEGO (Pecahan)" : "📦 Paketan"}
                  </span>
                </div>
                <div className="text-xs text-slate-500">
                  Untuk Usaha: <strong>{order.business_name}</strong> ({order.business_category})
                </div>
                {order.domain_requested && (
                  <div className="text-xs text-blue-600 font-mono">
                    🌐 Domain: {order.domain_requested}
                  </div>
                )}
              </div>
              <div className="text-sm sm:text-base font-bold text-slate-800 text-right">
                {formattedPrice}
              </div>
            </div>

            {/* Spesifikasi Kustom (Jika Ada Template, Hosting, atau Addons) */}
            {(order.template_name || order.hosting_duration || order.domain_choice || order.addons) && (
              <div className="pt-3 border-t border-slate-200/60 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {order.template_name && (
                  <div className="p-2.5 rounded-xl bg-white border border-slate-200/70 space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Template &amp; Framework
                    </span>
                    <div className="font-bold text-slate-800 flex items-center justify-between gap-2">
                      <span>{order.template_name}</span>
                      {order.template_tech && (
                        <span className="px-1.5 py-0.5 rounded bg-slate-100 text-[10px] font-mono text-slate-600">
                          {order.template_tech}
                        </span>
                      )}
                    </div>
                    {order.template_url && (
                      <a
                        href={order.template_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] font-bold text-blue-600 hover:underline inline-flex items-center gap-1 mt-0.5"
                      >
                        <span>Lihat Demo Template</span>
                        <span className="text-[9px]">↗</span>
                      </a>
                    )}
                  </div>
                )}

                {order.hosting_duration && (
                  <div className="p-2.5 rounded-xl bg-white border border-slate-200/70 space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Cloud Hosting
                    </span>
                    <div className="font-bold text-slate-800">
                      ☁️ {order.hosting_duration}
                    </div>
                  </div>
                )}

                {order.domain_choice && (
                  <div className="p-2.5 rounded-xl bg-white border border-slate-200/70 space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Pilihan Domain
                    </span>
                    <div className="font-bold text-slate-800 font-mono">
                      🌐 {order.domain_choice}
                    </div>
                  </div>
                )}

                {order.addons && (() => {
                  let list: string[] = [];
                  try {
                    const p = JSON.parse(order.addons);
                    if (Array.isArray(p)) list = p;
                    else list = [String(p)];
                  } catch {
                    list = order.addons.split(",").map((s) => s.trim()).filter(Boolean);
                  }
                  if (list.length === 0) return null;
                  return (
                    <div className="p-2.5 rounded-xl bg-white border border-slate-200/70 space-y-1 sm:col-span-2">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Add-Ons Pelengkap ({list.length})
                      </span>
                      <div className="flex flex-wrap gap-1.5 pt-0.5">
                        {list.map((addon, i) => (
                          <span
                            key={i}
                            className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-medium"
                          >
                            <span>✓</span>
                            <span>{addon}</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}

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
              {order.payment_method === "GOPAY" || order.payment_method === "QRIS"
                ? "🟢 Transfer E-Wallet GoPay"
                : order.payment_method === "BCA"
                ? "🏦 Transfer Bank BCA"
                : order.payment_method === "MANDIRI"
                ? "🏦 Transfer Bank Mandiri"
                : "🟢 Transfer E-Wallet GoPay"}
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

          {/* Instruksi Transfer GoPay (Metode Utama Resmi) */}
          {(order.payment_method === "GOPAY" || order.payment_method === "QRIS" || !order.payment_method) && (
            <div className="flex flex-col md:flex-row items-stretch gap-6 bg-cyan-50/30 rounded-2xl p-6 border-2 border-[#00a5cf]/40 shadow-sm">
              {/* Kartu GoPay Visual */}
              <div className="bg-white p-6 rounded-2xl border border-cyan-100 shadow-md flex flex-col justify-between max-w-[320px] w-full shrink-0">
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-lg bg-[#00a5cf] text-white text-xs font-black tracking-wider">
                        GoPay
                      </span>
                      <span className="text-xs font-extrabold text-slate-900">E-Wallet Resmi</span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                      Aktif
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block mb-1">
                      Nomor Tujuan GoPay
                    </span>
                    <div className="text-2xl font-mono font-black text-slate-900 tracking-tight">
                      0821-1247-7119
                    </div>
                    <span className="text-xs text-slate-500 font-medium block mt-0.5">
                      a/n <strong>Ladi Layanan Digital</strong>
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                      Nominal Transfer
                    </span>
                    <div className="text-lg font-black text-[#fa824b]">
                      {formattedPrice}
                    </div>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => copyToClipboard("082112477119", "gopay")}
                    className="w-full py-2.5 px-4 rounded-xl bg-[#00a5cf] hover:bg-[#008cb0] text-white font-extrabold text-xs uppercase tracking-wider transition-colors shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>📋</span>
                    <span>{copiedBank === "gopay" ? "Nomor Tersalin! ✓" : "Salin No. GoPay"}</span>
                  </button>
                </div>
              </div>

              {/* Langkah Cara Transfer GoPay */}
              <div className="space-y-3.5 text-xs text-slate-600 flex-1 flex flex-col justify-center">
                <div>
                  <h3 className="text-sm sm:text-base font-extrabold text-slate-900 flex items-center gap-2">
                    <span>📱</span>
                    <span>Cara Bayar Menggunakan GoPay:</span>
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Metode pembayaran resmi Ladi sementara waktu (menunggu aktivasi QRIS otomatis).
                  </p>
                </div>

                <ol className="space-y-2 list-decimal list-inside leading-relaxed bg-white/70 p-4 rounded-xl border border-slate-200">
                  <li>Buka aplikasi <strong>Gojek</strong> atau aplikasi <strong>GoPay</strong> di ponsel Anda.</li>
                  <li>Pilih menu <strong>Bayar / Transfer</strong> lalu pilih opsi <strong>Ke Nomor HP / Teman</strong>.</li>
                  <li>Ketik atau tempelkan nomor: <strong className="text-[#00a5cf] font-mono text-sm">082112477119</strong> (a/n Ladi Layanan Digital).</li>
                  <li>Masukkan nominal transfer tepat sejumlah <strong>{formattedPrice}</strong>.</li>
                  <li>Konfirmasi detail dan selesaikan transfer dengan PIN GoPay Anda.</li>
                  <li>Simpan bukti transfer / tangkapan layar (screenshot), lalu unggah pada formulir di bawah ini.</li>
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
