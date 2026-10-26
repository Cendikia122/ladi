"use client";
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { TemplateItem } from "@/app/lib/storage";
import { GUARD_ADDONS } from "@/app/components/GuardBuilder";

interface CheckoutFormProps {
  packageSlug: string;
  packageName: string;
  packagePrice: number;
  formattedPrice: string;
  availableTemplates?: TemplateItem[];
  initialSelectedAddons?: string[];
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
  initialSelectedAddons,
}: CheckoutFormProps) {
  const router = useRouter();
  const isGuard = packageSlug === "paket-guard";

  // Template Mode & Selection
  const [templateMode, setTemplateMode] = useState<"pick" | "research">("pick");
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(
    availableTemplates.length > 0 ? availableTemplates[0].id : ""
  );

  // Add-ons: jika guard dan ada initial dari builder, gunakan initial
  const [selectedAddons, setSelectedAddons] = useState<string[]>(
    initialSelectedAddons && initialSelectedAddons.length > 0
      ? initialSelectedAddons
      : isGuard
      ? ["uptime_247", "ssl_firewall", "seo_90", "gmaps_sync", "wa_report"]
      : []
  );

  const [formData, setFormData] = useState({
    customer_name: "",
    customer_phone: "",
    customer_email: "",
    business_name: "",
    business_category: "Kuliner / F&B (Resto, Kafe, Katering)",
    domain_requested: "",
    notes: "",
    payment_method: "GOPAY",
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
  const packageAddons: AddonOption[] = useMemo(() => {
    if (isGuard) {
      return GUARD_ADDONS.map((a) => ({
        id: a.id,
        name: a.name,
        price: a.price,
        icon: a.icon,
        desc: a.desc,
      }));
    }

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
  }, [packageSlug, isGuard]);

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
    if (packageSlug === "paket-guard") {
      return "ℹ️ Ketentuan Paket GUARD: Murni Jasa Pemeliharaan (Maintenance) & Satpam Bisnis di Internet (Bukan Penjualan Website Baru). Kami merawat Website, Google Maps, Profil Medsos, dan WhatsApp Bisnis yang sudah Anda miliki.";
    }
    return null;
  }, [packageSlug]);

  const activeTemplate = useMemo(() => {
    return availableTemplates.find((t) => t.id === selectedTemplateId) || availableTemplates[0];
  }, [availableTemplates, selectedTemplateId]);

  // Hitung total harga
  const researchFee = (!isGuard && templateMode === "research") ? 100000 : 0;
  const rawAddonsTotal = selectedAddons.reduce((acc, id) => {
    const found = packageAddons.find((a) => a.id === id);
    return acc + (found ? found.price : 0);
  }, 0);

  // Jika paket-guard: harga dasar Rp 0 dan jika total > 500rb, cap bundle tepat 500rb!
  const isCappedGuard = isGuard && rawAddonsTotal > 500000;
  const addonsTotal = isCappedGuard ? 500000 : rawAddonsTotal;

  const effectiveBasePrice = isGuard ? 0 : packagePrice;
  const grandTotal = effectiveBasePrice + researchFee + addonsTotal;

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

    if (isGuard && !formData.domain_requested.trim()) {
      setErrorMessage("Silakan masukkan link website, titik Google Maps, atau akun media sosial usaha yang ingin dirawat.");
      return;
    }

    if (isGuard && selectedAddons.length === 0) {
      setErrorMessage("Pilih minimal 1 pecahan modul pemeliharaan untuk Paket GUARD.");
      return;
    }

    setIsLoading(true);

    const templateSummary = isGuard
      ? `Jasa Maintenance Digital (${selectedAddons.length} Modul Terpilih)`
      : templateMode === "research"
      ? "Rekomendasi Template Khusus oleh Tim Ladi (+Rp 100.000 Riset)"
      : (activeTemplate ? (activeTemplate.display_name ? `${activeTemplate.display_name}: ${activeTemplate.name}` : activeTemplate.name) : "Default Paket");

    const templateDemoUrl = templateMode === "research" ? "" : (activeTemplate ? activeTemplate.envato_url : "");
    const templateTech = activeTemplate ? (activeTemplate.display_name || "Desain Resmi Ladi") : "";

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

      if (typeof window !== "undefined" && data.order_number) {
        try {
          const stored = JSON.parse(localStorage.getItem("ladi_recent_orders") || "[]");
          const updated = [data.order_number, ...stored.filter((x: string) => x !== data.order_number)].slice(0, 5);
          localStorage.setItem("ladi_recent_orders", JSON.stringify(updated));
        } catch {}
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

        {!isGuard && (
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
        )}
      </div>

      {/* Bagian 3: Input Aset untuk Paket GUARD / Pilihan Template untuk Paket Web */}
      {isGuard ? (
        <div className="space-y-4 pt-2">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <span className="w-6 h-6 rounded-full bg-[#1853a7] text-white text-xs font-bold flex items-center justify-center">
              3
            </span>
            <h2 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider">
              Aset Digital Bisnis yang Ingin Dimaintenance
            </h2>
          </div>

          <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200/80 space-y-2">
            <label className="block text-xs font-bold text-slate-800">
              Link Website / Titik Google Maps / Akun Medsos Usaha <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="cth. https://usahasaya.com / link Google Maps / @namausaha di Instagram"
              value={formData.domain_requested}
              onChange={(e) => setFormData({ ...formData, domain_requested: e.target.value })}
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-[#fa824b] focus:ring-1 focus:ring-[#fa824b]"
            />
            <p className="text-[11px] text-slate-600 leading-relaxed">
              💡 <strong>Bukan Bikin Web Baru:</strong> Masukkan tautan aset digital usaha yang sudah berjalan milik Anda (website, Google Maps, Instagram, TikTok, dll). Tim teknisi Ladi langsung mengawal, mengamankan, dan merawatnya secara rutin.
            </p>
          </div>
        </div>
      ) : (
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 max-h-[460px] overflow-y-auto pr-1">
                {availableTemplates.map((item, idx) => {
                  const isPicked = selectedTemplateId === item.id;
                  const labelTitle = item.display_name || `Website ${idx + 1}`;
                  return (
                    <div
                      key={item.id}
                      onClick={() => setSelectedTemplateId(item.id)}
                      className={`group p-3 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                        isPicked
                          ? "border-[#fa824b] bg-orange-50/20 shadow-md ring-1 ring-[#fa824b]"
                          : "border-slate-200 hover:border-slate-300 bg-white"
                      }`}
                    >
                      <div>
                        {/* Gambar Preview Template */}
                        <div className="relative aspect-[16/10] w-full rounded-xl overflow-hidden bg-slate-100 mb-2.5 border border-slate-100">
                          <img
                            src={item.image || "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80"}
                            alt={labelTitle}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            loading="lazy"
                          />
                          <span className="absolute top-2 left-2 px-2.5 py-0.5 rounded-lg bg-slate-900/85 backdrop-blur-xs text-white text-[11px] font-bold shadow-sm">
                            {labelTitle}
                          </span>
                        </div>

                        <div className="flex items-center justify-between gap-1 mb-1">
                          <span className="text-[10px] text-slate-500 font-semibold bg-slate-100 px-2 py-0.5 rounded-full">
                            {item.industry}
                          </span>
                          <span className="text-[10px] text-emerald-700 font-bold">
                            ✓ Termasuk Paket
                          </span>
                        </div>
                        <h4 className="text-xs font-extrabold text-slate-900 leading-snug">{item.name}</h4>
                        <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">{item.description}</p>
                      </div>

                      <div className="pt-2.5 mt-2.5 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-[10px] font-semibold text-slate-400">
                          Katalog Resmi Ladi
                        </span>
                        <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${isPicked ? "bg-[#fa824b] text-white" : "text-slate-500 bg-slate-100"}`}>
                          {isPicked ? "✓ Terpilih" : "Pilih Desain"}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Bagian 4: Add-Ons Pelengkap */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
          <span className="w-6 h-6 rounded-full bg-[#1853a7] text-white text-xs font-bold flex items-center justify-center">
            4
          </span>
          <h2 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider">
            {isGuard ? "Pecahan Modul Maintenance Digital (Pecahan LEGO)" : "Add-Ons Pelengkap (Opsional)"}
          </h2>
        </div>

        <p className="text-xs text-slate-500">
          {isGuard
            ? "Centang modul pemeliharaan Website, Google Maps, Medsos, atau WhatsApp yang Anda butuhkan. Jika total melebihi Rp 500.000, otomatis mendapatkan diskon Sultan cap tepat Rp 500.000 / bulan!"
            : "Tambahkan fitur ekstra yang Anda butuhkan tanpa membuat biaya membengkak."}
        </p>

        {isCappedGuard && (
          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
            <span className="text-base">🎉</span>
            <span>Diskon Spesial Sultan Aktif: Tagihan bulanan Anda dibatasi (cap) maksimal Rp 500.000 / bulan!</span>
          </div>
        )}

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
          {/* Opsi GoPay */}
          <label
            className="p-4 rounded-2xl border-2 border-[#00a5cf] bg-cyan-50/25 flex items-start gap-3 cursor-pointer shadow-sm"
          >
            <input
              type="radio"
              name="payment_method"
              value="GOPAY"
              checked={formData.payment_method === "GOPAY"}
              onChange={() => setFormData({ ...formData, payment_method: "GOPAY" })}
              className="mt-1 text-[#00a5cf] focus:ring-[#00a5cf]"
            />
            <div className="flex-1">
              <div className="flex items-center justify-between flex-wrap gap-1">
                <span className="text-xs sm:text-sm font-extrabold text-slate-900 flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-md bg-[#00a5cf] text-white text-[11px] font-black">
                    GoPay
                  </span>
                  Transfer E-Wallet GoPay
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                  ⭐ Jalur Resmi Aktif
                </span>
              </div>
              <div className="mt-2.5 p-3 rounded-xl bg-white border border-cyan-200 flex items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                    Nomor GoPay Ladi
                  </span>
                  <span className="text-base sm:text-lg font-mono font-black text-[#00a5cf]">
                    0821-1247-7119
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                    Penerima
                  </span>
                  <span className="text-xs font-bold text-slate-700">
                    Ladi Layanan Digital
                  </span>
                </div>
              </div>
              <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">
                Kirim nominal pembayaran via aplikasi Gojek / GoPay ke nomor di atas. Setelah transfer, unggah foto bukti transfer di halaman invoice berikutnya untuk verifikasi otomatis.
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
