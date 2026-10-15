"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface CheckoutFormProps {
  packageSlug: string;
  packageName: string;
  packagePrice: number;
  formattedPrice: string;
}

export default function CheckoutForm({
  packageSlug,
  packageName,
  packagePrice,
  formattedPrice,
}: CheckoutFormProps) {
  const router = useRouter();

  const [formData, setFormData] = useState({
    customer_name: "",
    customer_phone: "",
    customer_email: "",
    business_name: "",
    business_category: "Kuliner / F&B",
    domain_requested: "",
    notes: "",
    payment_method: "QRIS",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const categories = [
    "Kuliner / F&B (Resto, Kafe, Katering)",
    "Jasa Profesional (Konsultan, Salon, Notaris, Servis)",
    "Toko Fisik / Retail (Fashion, Alat, Bahan Bangunan)",
    "Otomotif & Bengkel",
    "Kesehatan & Klinik",
    "Pendidikan & Pelatihan",
    "Properti & Konstruksi",
    "Lainnya",
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!formData.customer_name.trim()) {
      setErrorMessage("Silakan masukkan nama lengkap Anda.");
      return;
    }

    if (!formData.customer_phone.trim()) {
      setErrorMessage("Silakan masukkan nomor WhatsApp aktif Anda.");
      return;
    }

    if (!formData.business_name.trim()) {
      setErrorMessage("Silakan masukkan nama usaha atau brand Anda.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          package_slug: packageSlug,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Gagal membuat pesanan. Silakan coba kembali.");
      }

      // Berhasil, redirect ke halaman invoice
      router.push(data.redirect_url);
    } catch (err: any) {
      setErrorMessage(err.message || "Terjadi kesalahan jaringan.");
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {errorMessage && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm flex items-start gap-2.5">
          <span className="text-base shrink-0">⚠️</span>
          <span className="leading-relaxed">{errorMessage}</span>
        </div>
      )}

      {/* Bagian 1: Data Pemesan */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
          <span className="w-6 h-6 rounded-full bg-[#1853a7] text-white text-xs font-bold flex items-center justify-center">
            1
          </span>
          <h2 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider">
            Informasi Pemesan & Kontak
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Nama Lengkap Pemesan <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="cth. Budi Pratama"
              value={formData.customer_name}
              onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-[#fa824b] focus:ring-1 focus:ring-[#fa824b] transition-all bg-slate-50/50"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Nomor WhatsApp Aktif <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              required
              placeholder="cth. 0812-3456-7890"
              value={formData.customer_phone}
              onChange={(e) => setFormData({ ...formData, customer_phone: e.target.value })}
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-[#fa824b] focus:ring-1 focus:ring-[#fa824b] transition-all bg-slate-50/50"
            />
            <span className="text-[10px] text-slate-400 mt-1 block">
              Konfirmasi dan kuitansi pembayaran dikirim ke nomor ini.
            </span>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            Alamat Email (Opsional)
          </label>
          <input
            type="email"
            placeholder="cth. budi@gmail.com (untuk backup invoice)"
            value={formData.customer_email}
            onChange={(e) => setFormData({ ...formData, customer_email: e.target.value })}
            className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-[#fa824b] focus:ring-1 focus:ring-[#fa824b] transition-all bg-slate-50/50"
          />
        </div>
      </div>

      {/* Bagian 2: Data Bisnis / Usaha */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
          <span className="w-6 h-6 rounded-full bg-[#1853a7] text-white text-xs font-bold flex items-center justify-center">
            2
          </span>
          <h2 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider">
            Data Usaha & Kebutuhan Website
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Nama Usaha / Brand <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="cth. Kopi Senja / Bengkel Maju"
              value={formData.business_name}
              onChange={(e) => setFormData({ ...formData, business_name: e.target.value })}
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-[#fa824b] focus:ring-1 focus:ring-[#fa824b] transition-all bg-slate-50/50"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Bidang / Kategori Usaha
            </label>
            <select
              value={formData.business_category}
              onChange={(e) => setFormData({ ...formData, business_category: e.target.value })}
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-[#fa824b] focus:ring-1 focus:ring-[#fa824b] transition-all bg-slate-50/50"
            >
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            Nama Domain yang Diinginkan (Opsional)
          </label>
          <input
            type="text"
            placeholder="cth. kopisenjabogor.com / bengkelmaju.id"
            value={formData.domain_requested}
            onChange={(e) => setFormData({ ...formData, domain_requested: e.target.value })}
            className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-[#fa824b] focus:ring-1 focus:ring-[#fa824b] transition-all bg-slate-50/50"
          />
          <span className="text-[10px] text-slate-400 mt-1 block">
            Belum tahu nama domain yang pas? Kosongkan saja, nanti tim Ladi carikan rekomendasi terbaik.
          </span>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            Catatan Tambahan (Opsional)
          </label>
          <textarea
            rows={2}
            placeholder="Ada permintaan fitur khusus atau hal penting yang ingin disampaikan?"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-[#fa824b] focus:ring-1 focus:ring-[#fa824b] transition-all bg-slate-50/50"
          />
        </div>
      </div>

      {/* Bagian 3: Pilihan Metode Pembayaran */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
          <span className="w-6 h-6 rounded-full bg-[#1853a7] text-white text-xs font-bold flex items-center justify-center">
            3
          </span>
          <h2 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider">
            Pilihan Metode Pembayaran
          </h2>
        </div>

        <div className="space-y-2.5">
          {/* Opsi QRIS */}
          <label
            className={`p-3.5 rounded-2xl border-2 flex items-start gap-3 cursor-pointer transition-all ${
              formData.payment_method === "QRIS"
                ? "border-[#fa824b] bg-orange-50/30"
                : "border-slate-200 bg-white hover:border-slate-300"
            }`}
          >
            <input
              type="radio"
              name="payment_method"
              value="QRIS"
              checked={formData.payment_method === "QRIS"}
              onChange={() => setFormData({ ...formData, payment_method: "QRIS" })}
              className="mt-1 text-[#fa824b] focus:ring-[#fa824b]"
            />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-sm font-extrabold text-slate-900">
                  📱 QRIS Instan (Semua Bank & E-Wallet)
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                  ⭐ Paling Praktis
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                Scan langsung dari BCA Mobile, Livin’ Mandiri, BRImo, BNI, GoPay, OVO, ShopeePay, atau Dana.
              </p>
            </div>
          </label>

          {/* Opsi Transfer BCA */}
          <label
            className={`p-3.5 rounded-2xl border-2 flex items-start gap-3 cursor-pointer transition-all ${
              formData.payment_method === "BCA"
                ? "border-[#fa824b] bg-orange-50/30"
                : "border-slate-200 bg-white hover:border-slate-300"
            }`}
          >
            <input
              type="radio"
              name="payment_method"
              value="BCA"
              checked={formData.payment_method === "BCA"}
              onChange={() => setFormData({ ...formData, payment_method: "BCA" })}
              className="mt-1 text-[#fa824b] focus:ring-[#fa824b]"
            />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-sm font-extrabold text-slate-900">
                  🏦 Transfer Bank BCA
                </span>
                <span className="text-[11px] font-mono font-bold text-slate-600">8730918291</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                Nomor rekening resmi a/n <strong>Ladi Layanan Digital</strong>.
              </p>
            </div>
          </label>

          {/* Opsi Transfer Mandiri */}
          <label
            className={`p-3.5 rounded-2xl border-2 flex items-start gap-3 cursor-pointer transition-all ${
              formData.payment_method === "MANDIRI"
                ? "border-[#fa824b] bg-orange-50/30"
                : "border-slate-200 bg-white hover:border-slate-300"
            }`}
          >
            <input
              type="radio"
              name="payment_method"
              value="MANDIRI"
              checked={formData.payment_method === "MANDIRI"}
              onChange={() => setFormData({ ...formData, payment_method: "MANDIRI" })}
              className="mt-1 text-[#fa824b] focus:ring-[#fa824b]"
            />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-sm font-extrabold text-slate-900">
                  🏦 Transfer Bank Mandiri
                </span>
                <span className="text-[11px] font-mono font-bold text-slate-600">1330029182910</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                Nomor rekening resmi a/n <strong>Ladi Layanan Digital</strong>.
              </p>
            </div>
          </label>
        </div>
      </div>

      {/* Syarat & Tombol Submit */}
      <div className="pt-4 border-t border-slate-100 space-y-3">
        <p className="text-[11px] text-slate-500 leading-relaxed">
          Dengan menekan tombol di bawah, Anda menyetujui ringkasan pemesanan dan syarat layanan Ladi. Pembayaran Anda terlindungi dan diverifikasi secara transparan.
        </p>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-4 px-6 rounded-2xl bg-[#fa824b] hover:bg-[#e5723b] disabled:bg-slate-300 text-white font-extrabold text-sm sm:text-base uppercase tracking-wider shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              <span>Membuat Invoice & Pesanan...</span>
            </>
          ) : (
            <>
              <span>Lanjut ke Pembayaran ({formattedPrice})</span>
              <span>→</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
