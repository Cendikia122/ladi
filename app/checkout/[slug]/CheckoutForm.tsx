"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { TemplateItem } from "@/app/lib/storage";

interface CheckoutFormProps {
  packageSlug: string;
  packageName: string;
  packagePrice: number;
  formattedPrice: string;
  availableTemplates?: TemplateItem[];
}

interface AddonOption {
  id: string;
  name: string;
  price: number;
  icon: string;
  desc: string;
}

export default function CheckoutForm({
  packageSlug,
  packageName,
  packagePrice,
  formattedPrice: initialFormattedPrice,
  availableTemplates = [],
}: CheckoutFormProps) {
  const router = useRouter();

  // Template Mode & Selection
  const [templateMode, setTemplateMode] = useState<"pick" | "research">("pick");
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(
    availableTemplates.length > 0 ? availableTemplates[0].id : ""
  );

  // Add-ons
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);

  const [formData, setFormData] = useState({
    customer_name: "",
    customer_phone: "",
    customer_email: "",
    business_name: "",
    business_category: "Kuliner / F&B (Resto, Kafe, Katering)",
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

  // Konfigurasi Add-ons sesuai batasan paket dari pengguna:
  // - EXIST: tanpa blog, tanpa otomatis pesanan
  // - RISE: tanpa otomatis pesanan, ada blog
  // - RUN: mencakup sistem pemesanan otomatis
  const packageAddons: AddonOption[] = useMemo(() => {
    const list: AddonOption[] = [
      {
        id: "gmaps",
        name: "Google Business Profile & Google Maps",
        price: 150000,
        icon: "📍",
        desc: "Setup titik lokasi di Google Maps & panduan verifikasi.",
      },
      {
        id: "wa_auto",
        name: "WhatsApp Order Auto-Reply / Generator",
        price: 99000,
        icon: "💬",
        desc: "Tombol klik pesan WhatsApp dengan format order rapi otomatis.",
      },
      {
        id: "copywriting",
        name: "Penulisan Konten / Copywriting Promosi",
        price: 150000,
        icon: "✍️",
        desc: "Tim Ladi yang menyusun kalimat penawaran & teks halaman web Anda.",
      },
      {
        id: "backup_security",
        name: "Satpam Digital & Backup Cloud",
        price: 150000,
        icon: "🛡️",
        desc: "Proteksi firewall anti hack & backup berkala selama 3 bulan.",
      },
    ];

    // Blog hanya untuk RISE, RUN, atau paket lainnya (TIDAK ADA di EXIST sesuai aturan)
    if (packageSlug !== "paket-exist") {
      list.push({
        id: "blog_cms",
        name: "Modul Blog / Artikel CMS SEO",
        price: 200000,
        icon: "📰",
        desc: "Fitur posting artikel untuk mendongkrak ranking pencarian Google.",
      });
    }

    return list;
  }, [packageSlug]);

  // Pesan aturan per paket
  const packageRuleNote = useMemo(() => {
    if (packageSlug === "paket-exist") {
      return "ℹ️ Ketentuan Paket EXIST: Khusus landing page 1 halaman responsif cepat berbasis HTML5 (tanpa modul blog & tanpa sistem pesanan otomatis).";
    }
    if (packageSlug === "paket-rise") {
      return "ℹ️ Ketentuan Paket RISE: Full website multi-halaman (5–7 halaman) berbasis HTML/PHP dengan galeri & profil (tanpa modul checkout/booking otomatis).";
    }
    if (packageSlug === "paket-run") {
      return "ℹ️ Ketentuan Paket RUN: Sistem website mandiri modern (Next.js/React/Laravel) dengan integrasi katalog/booking dan QRIS otomatis.";
    }
    return null;
  }, [packageSlug]);

  const activeTemplate = useMemo(() => {
    return availableTemplates.find((t) => t.id === selectedTemplateId) || availableTemplates[0];
  }, [availableTemplates, selectedTemplateId]);

  // Hitung total harga
  const researchFee = templateMode === "research" ? 100000 : 0;
  const addonsTotal = selectedAddons.reduce((acc, id) => {
    const found = packageAddons.find((a) => a.id === id);
    return acc + (found ? found.price : 0);
  }, 0);

  const grandTotal = packagePrice + researchFee + addonsTotal;

  const formattedTotal = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(grandTotal);

  const handleToggleAddon = (id: string) => {
    if (selectedAddons.includes(id)) {
      setSelectedAddons(selectedAddons.filter((item) => item !== id));
    } else {
      setSelectedAddons([...selectedAddons, id]);
    }
  };

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

    const templateSummary = templateMode === "research"
      ? "Rekomendasi Template Khusus oleh Tim Ladi (+Rp 100.000 Riset)"
      : (activeTemplate ? `${activeTemplate.name} (${activeTemplate.tech})` : "Default Paket");

    const templateDemoUrl = templateMode === "research" ? "" : (activeTemplate ? activeTemplate.envato_url : "");
    const templateTech = activeTemplate ? activeTemplate.tech : "";

    const addonsSummary = selectedAddons
      .map((id) => packageAddons.find((a) => a.id === id)?.name)
      .filter(Boolean);

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          package_slug: packageSlug,
          package_name: packageName,
          package_price: grandTotal,
          order_type: "paketan",
          template_name: templateSummary,
          template_url: templateDemoUrl,
          template_tech: templateTech,
          addons: addonsSummary,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Gagal membuat pesanan. Silakan coba kembali.");
      }

      router.push(data.redirect_url);
    } catch (err: any) {
      setErrorMessage(err.message || "Terjadi kesalahan jaringan.");
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
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
            Informasi Pemesan &amp; Kontak
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
            Data Usaha &amp; Kebutuhan Website
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
      </div>

      {/* Bagian 3: Pilihan Template Desain untuk Paket Ini */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
          <span className="w-6 h-6 rounded-full bg-[#1853a7] text-white text-xs font-bold flex items-center justify-center">
            3
          </span>
          <h2 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider">
            Pilihan Template Desain Website
          </h2>
        </div>

        {packageRuleNote && (
          <div className="p-3.5 rounded-2xl bg-blue-50/70 border border-blue-200/80 text-blue-900 text-xs leading-relaxed">
            {packageRuleNote}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div
            onClick={() => setTemplateMode("pick")}
            className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all ${
              templateMode === "pick"
                ? "border-[#fa824b] bg-orange-50/30 ring-1 ring-[#fa824b]"
                : "border-slate-200 hover:border-slate-300 bg-white"
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-slate-900">
                🎨 Pilih Template yang Tersedia
              </span>
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                Gratis (+Rp 0)
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              Pilih dari katalog template resmi yang kompatibel dengan {packageName}.
            </p>
          </div>

          <div
            onClick={() => setTemplateMode("research")}
            className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all ${
              templateMode === "research"
                ? "border-[#1853a7] bg-blue-50/40 ring-1 ring-[#1853a7]"
                : "border-slate-200 hover:border-slate-300 bg-white"
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-slate-900">
                💡 Rekomendasi Khusus Tim Ladi
              </span>
              <span className="text-[10px] font-bold text-[#1853a7] bg-blue-100 px-2 py-0.5 rounded-full">
                +Rp 100.000 Riset
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              Tim desainer Ladi akan meriset template paling conversion-friendly khusus bisnis Anda.
            </p>
          </div>
        </div>

        {/* List Template yang kompatibel dengan paket ini */}
        {templateMode === "pick" && availableTemplates.length > 0 && (
          <div className="space-y-2 pt-1">
            <span className="text-[11px] font-bold text-slate-500 block">
              Pilih salah satu template di bawah:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[320px] overflow-y-auto pr-1">
              {availableTemplates.map((item) => {
                const isPicked = selectedTemplateId === item.id;
                return (
                  <div
                    key={item.id}
                    onClick={() => setSelectedTemplateId(item.id)}
                    className={`p-3 rounded-xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                      isPicked
                        ? "border-[#fa824b] bg-orange-50/20 shadow-sm ring-1 ring-[#fa824b]"
                        : "border-slate-200 hover:border-slate-300 bg-white"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-slate-900 text-white">
                          {item.tech}
                        </span>
                        <span className="text-[9px] text-slate-500 font-medium">{item.industry}</span>
                      </div>
                      <h4 className="text-xs font-extrabold text-slate-900 leading-snug">{item.name}</h4>
                      <p className="text-[10px] text-slate-500 mt-0.5 line-clamp-2">{item.description}</p>
                    </div>

                    <div className="pt-2 mt-2 border-t border-slate-100 flex items-center justify-between">
                      <a
                        href={item.envato_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="text-[10px] font-bold text-blue-600 hover:underline flex items-center gap-0.5"
                      >
                        <span>Demo Envato</span>
                        <span>↗</span>
                      </a>
                      <span className={`text-[10px] font-bold ${isPicked ? "text-[#fa824b]" : "text-slate-400"}`}>
                        {isPicked ? "✓ Terpilih" : "Pilih"}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Bagian 4: Add-Ons Pelengkap */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
          <span className="w-6 h-6 rounded-full bg-[#1853a7] text-white text-xs font-bold flex items-center justify-center">
            4
          </span>
          <h2 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider">
            Add-Ons Pelengkap (Opsional)
          </h2>
        </div>

        <p className="text-xs text-slate-500">
          Tambahkan fitur ekstra yang Anda butuhkan tanpa membuat biaya membengkak.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {packageAddons.map((addon) => {
            const isChecked = selectedAddons.includes(addon.id);
            return (
              <div
                key={addon.id}
                onClick={() => handleToggleAddon(addon.id)}
                className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex items-start gap-2.5 ${
                  isChecked
                    ? "border-[#fa824b] bg-orange-50/20 shadow-sm"
                    : "border-slate-200 hover:border-slate-300 bg-white"
                }`}
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => {}}
                  className="mt-1 rounded text-[#fa824b] focus:ring-[#fa824b] w-4 h-4 cursor-pointer"
                />
                <div className="flex-1 space-y-0.5">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-xs font-extrabold text-slate-900">
                      {addon.icon} {addon.name}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 leading-relaxed">{addon.desc}</p>
                  <div className="pt-1 text-xs font-black text-[#1853a7]">
                    +{new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(addon.price)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bagian 5: Pilihan Metode Pembayaran */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
          <span className="w-6 h-6 rounded-full bg-[#1853a7] text-white text-xs font-bold flex items-center justify-center">
            5
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
                  📱 QRIS Instan (Semua Bank &amp; E-Wallet)
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

      {/* Catatan Tambahan */}
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

      {/* Syarat & Tombol Submit */}
      <div className="pt-4 border-t border-slate-100 space-y-3">
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-slate-500 block">Total Tagihan Pesanan:</span>
            <div className="text-xl sm:text-2xl font-black text-[#1853a7]">{formattedTotal}</div>
          </div>
          {(selectedAddons.length > 0 || templateMode === "research") && (
            <span className="text-[10px] text-slate-400 text-right">
              Termasuk {selectedAddons.length} Add-on {templateMode === "research" ? "+ Uang Riset" : ""}
            </span>
          )}
        </div>

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
              <span>Membuat Invoice &amp; Pesanan...</span>
            </>
          ) : (
            <>
              <span>Lanjut ke Pembayaran ({formattedTotal})</span>
              <span>→</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
