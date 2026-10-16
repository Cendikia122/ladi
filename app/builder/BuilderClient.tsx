"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { TemplateItem } from "@/app/lib/storage";

interface BuilderClientProps {
  initialTemplates: TemplateItem[];
}

interface ScaleOption {
  id: string;
  name: string;
  price: number;
  badge: string;
  subtitle: string;
  desc: string;
  color: string;
}

interface AddonOption {
  id: string;
  name: string;
  price: number;
  icon: string;
  desc: string;
  badge: string;
}

const SCALE_OPTIONS: ScaleOption[] = [
  {
    id: "landing-1page",
    name: "Landing Page 1 Halaman Ringkas",
    price: 350000,
    badge: "Paling Ringkas & Cepat",
    subtitle: "Fokus 1 Tindakan Utama ke WhatsApp",
    desc: "Cocok untuk UMKM pemula, bengkel, katering, atau jasa lokal yang ingin calon pembeli langsung chat WhatsApp tanpa berputar-putar. Super cepat dibuka di HP.",
    color: "from-blue-500/10 to-indigo-500/10 border-blue-200 text-blue-900",
  },
  {
    id: "profile-5page",
    name: "Web Profil Usaha 5 Halaman",
    price: 950000,
    badge: "Paling Populer & Kredibel",
    subtitle: "Profil Usaha Multi-Halaman Lengkap & Profesional",
    desc: "Halaman Beranda, Tentang Usaha, Daftar Layanan/Produk, Galeri Portofolio, dan Kontak & Peta. Cocok untuk membangun kredibilitas bisnis yang matang dan memenangkan kepercayaan calon klien.",
    color: "from-purple-500/10 to-violet-500/10 border-purple-200 text-purple-900",
  },
  {
    id: "toko-booking",
    name: "Web Toko Online & Sistem Booking",
    price: 2050000,
    badge: "Sistem Mandiri Siap Jualan",
    subtitle: "Katalog Dinamis & Alur Pemesanan Terstruktur",
    desc: "Pelanggan dapat menjelajahi katalog produk, memesan sesi reservasi layanan, dan checkout otomatis mandiri tanpa admin harus mengetik manual berulang kali.",
    color: "from-amber-500/10 to-orange-500/10 border-amber-200 text-amber-900",
  },
];

const GOOGLE_ADDONS: AddonOption[] = [
  {
    id: "gmb_setup",
    name: "Setup & Verifikasi Google Business Profile / Maps",
    price: 200000,
    icon: "📍",
    desc: "Pendaftaran titik resmi lokasi usaha di Google Maps lengkap dengan nama, alamat, jam operasional, dan verifikasi.",
    badge: "Fondasi Peta",
  },
  {
    id: "gmaps_local_opt",
    name: "Optimasi Titik Google Maps Lokal Wilayah",
    price: 250000,
    icon: "🗺️",
    desc: "Riset kata kunci lokal (misal: 'bengkel terdekat Bogor'), akurasi pin, dan panduan mendapatkan 5 ulasan bintang pertama.",
    badge: "Ranking Lokal",
  },
  {
    id: "basic_seo",
    name: "Basic SEO On-Page (Meta Tag & Heading)",
    price: 100000,
    icon: "🔍",
    desc: "Penataan judul meta, deskripsi pencarian Google, dan struktur H1-H2 agar mudah diindeks mesin pencari.",
    badge: "Mudah Ditemukan",
  },
  {
    id: "local_seo_ga4",
    name: "Local SEO Dominance & Google Analytics 4",
    price: 350000,
    icon: "📊",
    desc: "Setup Schema.org LocalBusiness, sitemap otomatis, Google Search Console, dan GA4 untuk pantau jumlah pengunjung nyata.",
    badge: "Dominasi Wilayah",
  },
];

const AUTO_ADDONS: AddonOption[] = [
  {
    id: "report_30d_rev",
    name: "Laporan Performa 30 Hari & Garansi Revisi",
    price: 250000,
    icon: "📈",
    desc: "Laporan pertumbuhan pengunjung di bulan pertama + garansi 1x revisi minor berkala.",
    badge: "Evaluasi Awal",
  },
  {
    id: "qris_wa_auto",
    name: "Integrasi QRIS Otomatis & Template WA Auto-Reply",
    price: 550000,
    icon: "💳",
    desc: "Integrasi pembayaran QRIS resmi 100% atas nama rekening Anda + template auto-reply WhatsApp agar order pelanggan langsung tertata rapi.",
    badge: "Otomatisasi Kasir",
  },
  {
    id: "report_3m_strategy",
    name: "Laporan Bulanan 3 Bulan & Konsultasi Strategi",
    price: 500000,
    icon: "🎯",
    desc: "Pendampingan performa bulanan selama 3 bulan pertama dan sesi konsultasi strategi digital 1-on-1 (60 menit) bersama tim Ladi.",
    badge: "Mentoring Digital",
  },
  {
    id: "copywriting_photo",
    name: "Penulisan Copywriting Konten & Foto Produk",
    price: 150000,
    icon: "✍️",
    desc: "Tim Ladi membantu merapikan kata-kata promosi memikat, headline penawaran, dan perapian layout foto produk agar menarik pembeli.",
    badge: "Anti Pusing Nulis",
  },
];

const DOMAIN_OPTIONS = [
  { id: "subdomain", name: "Subdomain Gratis Ladi (usahamu.ladi.web.id)", price: 0, badge: "Gratis Selamanya", note: "Tanpa biaya tahunan" },
  { id: ".my.id", name: "Domain Resmi .my.id", price: 50000, badge: "Ekonomis UMKM", note: "Rp 50.000 / tahun" },
  { id: ".com", name: "Domain Standar Global .com", price: 220000, badge: "Paling Populer", note: "Rp 220.000 / tahun" },
  { id: ".id", name: "Domain Resmi Indonesia .id", price: 275000, badge: "Paling Kredibel", note: "Rp 275.000 / tahun" },
  { id: "self", name: "Sudah Punya Domain Sendiri", price: 0, badge: "Bebas Biaya", note: "Klien sediakan domain sendiri" },
];

export default function BuilderClient({ initialTemplates }: BuilderClientProps) {
  const router = useRouter();

  // State Pilihan Pecahan LEGO Bisnis
  const [selectedScaleId, setSelectedScaleId] = useState<string>("landing-1page");
  const [templateMode, setTemplateMode] = useState<"pick" | "research">("pick");
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(
    initialTemplates.length > 0 ? initialTemplates[0].id : ""
  );
  const [industryFilter, setIndustryFilter] = useState<string>("all");

  // Add-ons State
  const [selectedGoogleAddons, setSelectedGoogleAddons] = useState<string[]>(["gmb_setup"]);
  const [selectedAutoAddons, setSelectedAutoAddons] = useState<string[]>([]);

  // Domain State
  const [selectedDomainId, setSelectedDomainId] = useState<string>(".com");
  const [domainNameInput, setDomainNameInput] = useState<string>("");

  // Form Klien
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [businessCategory, setBusinessCategory] = useState("Kuliner / F&B (Resto, Kafe, Katering)");
  const [notes, setNotes] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Daftar Kategori Industri
  const industries = useMemo(() => {
    const list = Array.from(new Set(initialTemplates.map((t) => t.industry))).filter(Boolean);
    return ["all", ...list];
  }, [initialTemplates]);

  // Filter templates
  const filteredTemplates = useMemo(() => {
    return initialTemplates.filter((t) => {
      const matchIndustry = industryFilter === "all" || t.industry === industryFilter;
      return matchIndustry;
    });
  }, [initialTemplates, industryFilter]);

  // Cari template aktif
  const activeTemplate = useMemo(() => {
    return initialTemplates.find((t) => t.id === selectedTemplateId) || initialTemplates[0];
  }, [initialTemplates, selectedTemplateId]);

  // Objek Terpilih
  const scaleObj = SCALE_OPTIONS.find((s) => s.id === selectedScaleId) || SCALE_OPTIONS[0];
  const domainObj = DOMAIN_OPTIONS.find((d) => d.id === selectedDomainId) || DOMAIN_OPTIONS[2];

  const researchFee = templateMode === "research" ? 100000 : 0;

  const googleAddonsTotal = useMemo(() => {
    return selectedGoogleAddons.reduce((acc, id) => {
      const found = GOOGLE_ADDONS.find((a) => a.id === id);
      return acc + (found ? found.price : 0);
    }, 0);
  }, [selectedGoogleAddons]);

  const autoAddonsTotal = useMemo(() => {
    return selectedAutoAddons.reduce((acc, id) => {
      const found = AUTO_ADDONS.find((a) => a.id === id);
      return acc + (found ? found.price : 0);
    }, 0);
  }, [selectedAutoAddons]);

  // Subtotal Jasa vs Domain
  const totalJasa = scaleObj.price + researchFee + googleAddonsTotal + autoAddonsTotal;
  const totalDomain = domainObj.price;
  const grandTotal = totalJasa + totalDomain;

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  const handleToggleGoogleAddon = (id: string) => {
    if (selectedGoogleAddons.includes(id)) {
      setSelectedGoogleAddons(selectedGoogleAddons.filter((item) => item !== id));
    } else {
      setSelectedGoogleAddons([...selectedGoogleAddons, id]);
    }
  };

  const handleToggleAutoAddon = (id: string) => {
    if (selectedAutoAddons.includes(id)) {
      setSelectedAutoAddons(selectedAutoAddons.filter((item) => item !== id));
    } else {
      setSelectedAutoAddons([...selectedAutoAddons, id]);
    }
  };

  // Format pesan WhatsApp untuk tombol WhatsApp
  const waOrderText = useMemo(() => {
    const googleNames = selectedGoogleAddons
      .map((id) => GOOGLE_ADDONS.find((a) => a.id === id)?.name)
      .filter(Boolean);
    const autoNames = selectedAutoAddons
      .map((id) => AUTO_ADDONS.find((a) => a.id === id)?.name)
      .filter(Boolean);

    const templateLabel =
      templateMode === "research"
        ? "Riset Desain Khusus oleh Tim Ladi (+Rp 100rb)"
        : activeTemplate
        ? `${activeTemplate.name} (${activeTemplate.industry})`
        : "Katalog Referensi Ladi";

    const domainLabel =
      selectedDomainId === "self"
        ? `Domain Sendiri (${domainNameInput || "Belum ditentukan"})`
        : `${domainObj.name} ${domainNameInput ? `[${domainNameInput}]` : ""}`;

    return `Halo Ladi, saya sudah merakit kebutuhan website di Builder layanandigital.id:

📋 *DETAIL SPESIFIKASI RAKITAN:*
• Fondasi Usaha: ${scaleObj.name} (${formatRupiah(scaleObj.price)})
• Desain Tampilan: ${templateLabel}
• Google & Visibilitas: ${googleNames.length > 0 ? googleNames.join(", ") : "Tidak memilih"}
• Otomatisasi & Fitur: ${autoNames.length > 0 ? autoNames.join(", ") : "Tidak memilih"}
• Domain: ${domainLabel}

💰 *RINCIAN INVESTASI:*
• Biaya Jasa Pembuatan: ${formatRupiah(totalJasa)}
• Biaya Ekstensi Domain: ${formatRupiah(totalDomain)} / tahun
• Grand Total Investasi: ${formatRupiah(grandTotal)}

👤 *DATA USAHA & PEMESAN:*
• Nama Pemesan: ${customerName || "-"}
• WhatsApp: ${customerPhone || "-"}
• Nama Usaha / Brand: ${businessName || "-"} (${businessCategory})
${notes ? `• Catatan: ${notes}` : ""}

Mohon dibantu konfirmasi estimasi waktu pengerjaan dan langkah berikutnya. Terima kasih!`;
  }, [
    scaleObj,
    templateMode,
    activeTemplate,
    selectedGoogleAddons,
    selectedAutoAddons,
    selectedDomainId,
    domainObj,
    domainNameInput,
    totalJasa,
    totalDomain,
    grandTotal,
    customerName,
    customerPhone,
    businessName,
    businessCategory,
    notes,
  ]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!customerName.trim()) {
      setErrorMessage("Nama lengkap pemesan wajib diisi.");
      return;
    }
    if (!customerPhone.trim()) {
      setErrorMessage("Nomor WhatsApp wajib diisi.");
      return;
    }
    if (!businessName.trim()) {
      setErrorMessage("Nama usaha / brand wajib diisi.");
      return;
    }

    setIsLoading(true);

    const templateSummary =
      templateMode === "research"
        ? "Riset Desain Khusus oleh Tim Ladi (+Rp 100.000)"
        : activeTemplate
        ? `${activeTemplate.name} (Katalog Desain Ladi)`
        : "Katalog Referensi Ladi";

    const allAddonsSummary = [
      ...selectedGoogleAddons.map((id) => GOOGLE_ADDONS.find((a) => a.id === id)?.name),
      ...selectedAutoAddons.map((id) => AUTO_ADDONS.find((a) => a.id === id)?.name),
    ].filter(Boolean);

    const domainSummary =
      selectedDomainId === "self"
        ? `Domain Sendiri: ${domainNameInput || "Belum ditentukan"}`
        : `${domainNameInput ? domainNameInput + " " : ""}(${domainObj.name})`;

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          package_slug: "custom-builder",
          package_name: `Custom Builder (${scaleObj.name})`,
          package_price: grandTotal,
          customer_name: customerName,
          customer_phone: customerPhone,
          customer_email: customerEmail,
          business_name: businessName,
          business_category: businessCategory,
          domain_requested: domainNameInput || domainObj.name,
          notes: notes,
          payment_method: "GOPAY",
          order_type: "pecahan",
          template_name: templateSummary,
          template_url: "",
          template_tech: scaleObj.name,
          domain_choice: domainSummary,
          hosting_duration: "Cloud Server Aktif 100%",
          addons: allAddonsSummary,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Gagal membuat pesanan.");
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
      setErrorMessage(err.message || "Terjadi kesalahan koneksi.");
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-12">
      {/* Switcher Tab: Paketan vs Pecahan */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#fa824b]/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="space-y-2 text-center md:text-left z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 text-[#fa824b] text-xs font-mono font-bold uppercase tracking-wider">
            <span>⚙️ Fleksibilitas Penuh</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Rakit Sendiri Website Sesuai Kebutuhan Bisnis Anda
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            Tidak mau terikat paket baku? Rancang sendiri website impian Anda: pilih skala fondasi, tentukan referensi desain dari katalog Ladi, dan pasang fitur visibilitas Google yang benar-benar Anda butuhkan.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0 z-10">
          <Link
            href="/pricing"
            className="px-5 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white text-xs sm:text-sm font-bold border border-slate-700 transition-all flex items-center gap-2"
          >
            <span>← Lihat Paket Bundel Siap Pakai</span>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Kolom Kiri: 5 Langkah Rakit + Form Pemesan */}
        <div className="lg:col-span-8 space-y-8">
          {/* LANGKAH 1: Fondasi & Skala Kebutuhan Usaha */}
          <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-2xl bg-[#1853a7] text-white text-sm font-black flex items-center justify-center shadow-md">
                  1
                </span>
                <div>
                  <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
                    Fondasi &amp; Skala Kebutuhan Usaha
                  </h3>
                  <p className="text-xs text-slate-500">
                    Pilih struktur website sesuai skala operasional bisnis Anda saat ini.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {SCALE_OPTIONS.map((scale) => {
                const isSelected = selectedScaleId === scale.id;
                return (
                  <div
                    key={scale.id}
                    onClick={() => setSelectedScaleId(scale.id)}
                    className={`p-5 rounded-2xl border-2 transition-all cursor-pointer relative ${
                      isSelected
                        ? "border-[#1853a7] bg-blue-50/30 shadow-md ring-2 ring-[#1853a7]/20"
                        : "border-slate-200 hover:border-slate-300 bg-white"
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm sm:text-base font-extrabold text-slate-900">
                            {scale.name}
                          </h4>
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600">
                            {scale.badge}
                          </span>
                        </div>
                        <div className="text-xs font-semibold text-[#1853a7]">{scale.subtitle}</div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-base sm:text-xl font-black text-[#1853a7] block">
                          {formatRupiah(scale.price)}
                        </span>
                        <span className="text-[10px] text-slate-400">Biaya Fondasi</span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 mt-3 leading-relaxed border-t border-slate-100 pt-3">
                      {scale.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </section>

          {/* LANGKAH 2: Gaya Tampilan & Desain Industri */}
          <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-2xl bg-[#1853a7] text-white text-sm font-black flex items-center justify-center shadow-md">
                  2
                </span>
                <div>
                  <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
                    Gaya Tampilan &amp; Desain Industri
                  </h3>
                  <p className="text-xs text-slate-500">
                    Semua referensi desain resmi Ladi sudah termasuk dalam biaya jasa fondasi (Rp 0).
                  </p>
                </div>
              </div>
            </div>

            {/* Switch Mode: Pick from Catalog vs Research */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setTemplateMode("pick")}
                className={`p-4 rounded-2xl border-2 text-left transition-all ${
                  templateMode === "pick"
                    ? "border-[#1853a7] bg-blue-50/40 shadow-sm"
                    : "border-slate-200 hover:border-slate-300 bg-white"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs sm:text-sm font-bold text-slate-900">
                    Pilih dari Katalog Desain Ladi
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                    Gratis (Rp 0)
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Pilih gaya visual yang paling cocok dari kurasi portofolio desain Ladi.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setTemplateMode("research")}
                className={`p-4 rounded-2xl border-2 text-left transition-all ${
                  templateMode === "research"
                    ? "border-[#fa824b] bg-orange-50/30 shadow-sm"
                    : "border-slate-200 hover:border-slate-300 bg-white"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs sm:text-sm font-bold text-slate-900">
                    Riset &amp; Kurasi Khusus Tim Ladi
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-orange-100 text-[#fa824b] text-[10px] font-bold">
                    +Rp 100.000
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Tim kami yang meriset 3 opsi desain eksklusif sesuai segmen pembeli Anda.
                </p>
              </button>
            </div>

            {/* Katalog Desain Ladi (Hanya tampil jika mode 'pick') */}
            {templateMode === "pick" && (
              <div className="space-y-4 pt-2">
                {/* Filter Kategori Industri */}
                <div className="flex items-center gap-2 overflow-x-auto pb-2 text-xs">
                  <span className="text-slate-400 font-bold shrink-0">Filter Sektor:</span>
                  {industries.map((ind) => (
                    <button
                      key={ind}
                      type="button"
                      onClick={() => setIndustryFilter(ind)}
                      className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all ${
                        industryFilter === ind
                          ? "bg-slate-900 text-white shadow-sm"
                          : "bg-slate-100 hover:bg-slate-200 text-slate-600"
                      }`}
                    >
                      {ind === "all" ? "Semua Desain" : ind}
                    </button>
                  ))}
                </div>

                {/* Grid Template Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[520px] overflow-y-auto pr-1">
                  {filteredTemplates.map((item) => {
                    const isPicked = selectedTemplateId === item.id;
                    return (
                      <div
                        key={item.id}
                        onClick={() => setSelectedTemplateId(item.id)}
                        className={`p-4 rounded-2xl border-2 transition-all flex flex-col justify-between cursor-pointer ${
                          isPicked
                            ? "border-[#fa824b] bg-orange-50/30 shadow-md ring-2 ring-[#fa824b]/20"
                            : "border-slate-200 hover:border-slate-300 bg-white"
                        }`}
                      >
                        <div className="space-y-2">
                          <div className="flex items-start justify-between gap-2">
                            <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">
                              {item.industry}
                            </span>
                            <span className="text-[10px] font-mono text-emerald-700 font-bold">
                              Termasuk (Rp 0)
                            </span>
                          </div>

                          <div>
                            <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 leading-snug">
                              {item.name}
                            </h4>
                            <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                              {item.description}
                            </p>
                          </div>
                        </div>

                        <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                          <span className="text-[11px] text-slate-400 font-medium">
                            Katalog Desain Ladi
                          </span>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedTemplateId(item.id);
                            }}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                              isPicked
                                ? "bg-[#fa824b] text-white shadow-sm"
                                : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                            }`}
                          >
                            {isPicked ? "✓ Terpilih" : "Pilih Desain Ini"}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </section>

          {/* LANGKAH 3: Visibilitas Google & Pencarian Lokal */}
          <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
              <span className="w-8 h-8 rounded-2xl bg-[#1853a7] text-white text-sm font-black flex items-center justify-center shadow-md">
                3
              </span>
              <div>
                <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
                  Visibilitas Google &amp; Pencarian Lokal
                </h3>
                <p className="text-xs text-slate-500">
                  Pastikan toko fisik atau kantor Anda ditemukan calon pembeli di sekitar lokasi usaha.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {GOOGLE_ADDONS.map((addon) => {
                const isChecked = selectedGoogleAddons.includes(addon.id);
                return (
                  <div
                    key={addon.id}
                    onClick={() => handleToggleGoogleAddon(addon.id)}
                    className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-start gap-3 ${
                      isChecked
                        ? "border-[#1853a7] bg-blue-50/20 shadow-sm"
                        : "border-slate-200 hover:border-slate-300 bg-white"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => {}}
                      className="mt-1 rounded text-[#1853a7] focus:ring-[#1853a7] w-4 h-4 cursor-pointer"
                    />
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-extrabold text-slate-900">
                          {addon.icon} {addon.name}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 leading-relaxed">{addon.desc}</p>
                      <div className="flex items-center justify-between pt-1">
                        <span className="text-[10px] font-bold text-slate-400">{addon.badge}</span>
                        <span className="text-xs font-black text-[#1853a7]">
                          +{formatRupiah(addon.price)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* LANGKAH 4: Otomatisasi & Fitur Pendukung Bisnis */}
          <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
              <span className="w-8 h-8 rounded-2xl bg-[#1853a7] text-white text-sm font-black flex items-center justify-center shadow-md">
                4
              </span>
              <div>
                <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
                  Otomatisasi &amp; Fitur Pendukung Bisnis
                </h3>
                <p className="text-xs text-slate-500">
                  Kemudahan bertransaksi, pemantauan performa, dan pendampingan strategi pertumbuhan.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {AUTO_ADDONS.map((addon) => {
                const isChecked = selectedAutoAddons.includes(addon.id);
                return (
                  <div
                    key={addon.id}
                    onClick={() => handleToggleAutoAddon(addon.id)}
                    className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-start gap-3 ${
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
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-extrabold text-slate-900">
                          {addon.icon} {addon.name}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 leading-relaxed">{addon.desc}</p>
                      <div className="flex items-center justify-between pt-1">
                        <span className="text-[10px] font-bold text-slate-400">{addon.badge}</span>
                        <span className="text-xs font-black text-[#fa824b]">
                          +{formatRupiah(addon.price)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* LANGKAH 5: Ekstensi Alamat Domain Resmi */}
          <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
              <span className="w-8 h-8 rounded-2xl bg-[#1853a7] text-white text-sm font-black flex items-center justify-center shadow-md">
                5
              </span>
              <div>
                <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
                  Ekstensi Alamat Domain Resmi
                </h3>
                <p className="text-xs text-slate-500">
                  Alamat resmi website Anda di internet. Didaftarkan 100% atas nama pemilik bisnis.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {DOMAIN_OPTIONS.map((dom) => {
                const isSelected = selectedDomainId === dom.id;
                return (
                  <div
                    key={dom.id}
                    onClick={() => setSelectedDomainId(dom.id)}
                    className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer ${
                      isSelected
                        ? "border-[#1853a7] bg-blue-50/40 shadow-sm ring-1 ring-[#1853a7]"
                        : "border-slate-200 hover:border-slate-300 bg-white"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold text-slate-900">{dom.id}</span>
                      <span className="text-[10px] font-bold text-slate-400">{dom.badge}</span>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">{dom.name}</div>
                    <div className="text-xs font-black text-[#1853a7] mt-2">
                      {dom.price === 0 ? "Gratis Setup" : formatRupiah(dom.price) + " / thn"}
                    </div>
                  </div>
                );
              })}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Nama Domain yang Diinginkan
              </label>
              <input
                type="text"
                placeholder="cth. brandkamu.com / bengkeljaya.id"
                value={domainNameInput}
                onChange={(e) => setDomainNameInput(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-[#fa824b] bg-slate-50/50"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Jika belum punya ide nama domain, kosongkan saja. Tim Ladi akan mencarikan 3 rekomendasi terbaik saat konsultasi.
              </span>
            </div>
          </section>

          {/* LANGKAH 6: Formulir Data Pemesan & Koordinasi */}
          <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
              <span className="w-8 h-8 rounded-2xl bg-[#1853a7] text-white text-sm font-black flex items-center justify-center shadow-md">
                6
              </span>
              <div>
                <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
                  Data Pemesan &amp; Koordinasi
                </h3>
                <p className="text-xs text-slate-500">
                  Data untuk verifikasi kepemilikan aset dan koordinasi pengerjaan.
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMessage && (
                <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                  <span>⚠️</span>
                  <span>{errorMessage}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Nama Lengkap Pemesan <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="cth. Hendra Gunawan"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-[#fa824b] bg-slate-50/50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Nomor WhatsApp Aktif <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="cth. 081234567890"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-[#fa824b] bg-slate-50/50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Nama Usaha / Brand <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="cth. Kopi Kenangan Bogor"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-[#fa824b] bg-slate-50/50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Kategori Bidang Usaha
                  </label>
                  <select
                    value={businessCategory}
                    onChange={(e) => setBusinessCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-[#fa824b] bg-slate-50/50"
                  >
                    <option value="Kuliner / F&B (Resto, Kafe, Katering)">Kuliner / F&B (Resto, Kafe, Katering)</option>
                    <option value="Otomotif & Bengkel">Otomotif &amp; Bengkel</option>
                    <option value="Toko Fisik & Retail">Toko Fisik &amp; Retail</option>
                    <option value="Jasa Profesional & Servis">Jasa Profesional &amp; Servis</option>
                    <option value="Kesehatan & Klinik">Kesehatan &amp; Klinik</option>
                    <option value="Tour & Travel">Tour &amp; Travel</option>
                    <option value="Lainnya">Lainnya</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Catatan Tambahan untuk Tim Ladi (Opsional)
                </label>
                <textarea
                  rows={2}
                  placeholder="Ceritakan preferensi warna, alamat toko fisik untuk Google Maps, atau kebutuhan khusus lainnya..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-[#fa824b] bg-slate-50/50"
                />
              </div>

              {/* Dua Tombol Aksi: WhatsApp & Invoice Online */}
              <div className="pt-4 border-t border-slate-100 space-y-3">
                <a
                  href={`https://wa.me/6282112477119?text=${encodeURIComponent(waOrderText)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-4 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm sm:text-base tracking-wide shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>💬 Konsultasikan Rakitan via WhatsApp</span>
                  <span>↗</span>
                </a>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 px-6 rounded-2xl bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 text-white font-extrabold text-xs sm:text-sm tracking-wider shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                      </svg>
                      <span>Menerbitkan Pesanan & Invoice...</span>
                    </>
                  ) : (
                    <>
                      <span>💳 Terbitkan Pesanan &amp; Invoice Online ({formatRupiah(grandTotal)})</span>
                      <span>→</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </section>
        </div>

        {/* Kolom Kanan: Sticky Ringkasan Real-Time & Decoy Alerts */}
        <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-xs font-bold font-mono uppercase tracking-wider text-slate-400">
                Kalkulator Real-Time
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-bold">
                Pecahan Modular
              </span>
            </div>

            {/* Smart Upsell Alert (Decoy Pricing) */}
            {totalJasa >= 500000 && totalJasa <= 850000 && (
              <div className="p-4 rounded-2xl bg-amber-50 border-2 border-amber-300 text-amber-900 space-y-2">
                <div className="flex items-center gap-2 font-black text-xs sm:text-sm">
                  <span>💡 Tips Hemat Pemula</span>
                </div>
                <p className="text-xs leading-relaxed">
                  Total jasa pilihan Anda saat ini mencapai <strong>{formatRupiah(totalJasa)}</strong>.
                  Tahukah Anda? Anda bisa memilih <strong>Paket EXIST (Rp 500.000 Sekali Bayar)</strong> yang sudah memaketkan Landing Page + Verifikasi Google Maps + Tombol WhatsApp + Basic SEO langsung jadi lebih hemat!
                </p>
                <Link
                  href="/pricing"
                  className="inline-flex items-center gap-1 text-xs font-bold text-amber-900 hover:text-black underline"
                >
                  Lihat Detail Paket EXIST (Rp 500.000) →
                </Link>
              </div>
            )}

            {totalJasa >= 1400000 && totalJasa <= 2200000 && (
              <div className="p-4 rounded-2xl bg-blue-50 border-2 border-[#1853a7]/40 text-blue-950 space-y-2">
                <div className="flex items-center gap-2 font-black text-xs sm:text-sm text-[#1853a7]">
                  <span>💡 Rekomendasi Paling Untung</span>
                </div>
                <p className="text-xs leading-relaxed">
                  Total jasa pilihan Anda saat ini mencapai <strong>{formatRupiah(totalJasa)}</strong>.
                  Anda jauh lebih hemat dengan mengambil bundel <strong>Paket RISE (Rp 1.500.000 Sekali Bayar)</strong>! Sudah dapat Website Lengkap 5–7 Halaman + Optimasi Google Maps Lokal + GA4 + Laporan Performa 30 Hari + Garansi 3 Bulan Revisi!
                </p>
                <Link
                  href="/pricing"
                  className="inline-flex items-center gap-1 text-xs font-bold text-[#1853a7] hover:underline"
                >
                  Ambil Paket Bundel RISE (Hemat s/d Rp 300.000+) →
                </Link>
              </div>
            )}

            {totalJasa > 3200000 && (
              <div className="p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-400 text-emerald-950 space-y-2">
                <div className="flex items-center gap-2 font-black text-xs sm:text-sm text-emerald-800">
                  <span>💡 Solusi Mandiri &amp; Toko Online Komplit</span>
                </div>
                <p className="text-xs leading-relaxed">
                  Kebutuhan usaha Anda sudah di skala sistem mandiri (total jasa <strong>{formatRupiah(totalJasa)}</strong>).
                  Pertimbangkan <strong>Paket RUN (Rp 3.500.000)</strong> untuk mendapatkan Toko Online / Booking System + QRIS Otomatis + Laporan 3 Bulan + Konsultasi Strategi Digital 1-on-1 (60 Menit) komplit siap jualan 24 jam!
                </p>
                <Link
                  href="/pricing"
                  className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 hover:underline"
                >
                  Lihat Detail Paket RUN (Rp 3.500.000) →
                </Link>
              </div>
            )}

            {/* Rincian Komponen */}
            <div className="space-y-3 text-xs">
              {/* Fondasi Usaha */}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="font-bold text-slate-800">{scaleObj.name}</div>
                  <div className="text-[11px] text-slate-400">Fondasi skala usaha</div>
                </div>
                <div className="font-black text-slate-800">{formatRupiah(scaleObj.price)}</div>
              </div>

              {/* Referensi Desain */}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="font-bold text-slate-800">
                    Desain: {templateMode === "research" ? "Riset Tim Ladi" : activeTemplate?.name || "Katalog Ladi"}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    {templateMode === "research" ? "Kurasi khusus niche bisnis" : "Katalog referensi Ladi"}
                  </div>
                </div>
                <div className="font-black text-slate-800">
                  {templateMode === "research" ? "+Rp 100.000" : "+Rp 0"}
                </div>
              </div>

              {/* Google Add-ons list */}
              {selectedGoogleAddons.length > 0 && (
                <div className="pt-2 border-t border-slate-100 space-y-1.5">
                  <span className="text-[11px] font-bold text-slate-500 block">
                    Visibilitas Google ({selectedGoogleAddons.length}):
                  </span>
                  {selectedGoogleAddons.map((id) => {
                    const addon = GOOGLE_ADDONS.find((a) => a.id === id);
                    if (!addon) return null;
                    return (
                      <div key={id} className="flex items-center justify-between text-[11px] text-slate-600">
                        <span className="truncate pr-2">✓ {addon.name}</span>
                        <span className="font-semibold text-slate-700 shrink-0">
                          +{formatRupiah(addon.price)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Auto Add-ons list */}
              {selectedAutoAddons.length > 0 && (
                <div className="pt-2 border-t border-slate-100 space-y-1.5">
                  <span className="text-[11px] font-bold text-slate-500 block">
                    Otomatisasi &amp; Fitur ({selectedAutoAddons.length}):
                  </span>
                  {selectedAutoAddons.map((id) => {
                    const addon = AUTO_ADDONS.find((a) => a.id === id);
                    if (!addon) return null;
                    return (
                      <div key={id} className="flex items-center justify-between text-[11px] text-slate-600">
                        <span className="truncate pr-2">✓ {addon.name}</span>
                        <span className="font-semibold text-slate-700 shrink-0">
                          +{formatRupiah(addon.price)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Subtotal Jasa */}
              <div className="pt-2 border-t border-slate-200 flex items-center justify-between font-bold text-slate-800">
                <span>Subtotal Biaya Jasa:</span>
                <span className="font-black text-[#1853a7]">{formatRupiah(totalJasa)}</span>
              </div>

              {/* Domain */}
              <div className="pt-2 border-t border-slate-100 flex items-start justify-between gap-2">
                <div>
                  <div className="font-bold text-slate-800">Domain: {domainObj.name}</div>
                  <div className="text-[11px] text-slate-400">
                    {domainNameInput ? domainNameInput : "Alamat web resmi"}
                  </div>
                </div>
                <div className="font-black text-slate-800">
                  {domainObj.price === 0 ? "Rp 0" : "+" + formatRupiah(domainObj.price) + " / thn"}
                </div>
              </div>
            </div>

            {/* Total Box */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
              <span className="text-[11px] text-slate-500 block font-medium">Total Investasi Transparan:</span>
              <div className="text-2xl sm:text-3xl font-black text-[#1853a7]">
                {formatRupiah(grandTotal)}
              </div>
              <span className="text-[10px] text-slate-400 block">
                Sistem DP 50%, pelunasan setelah hasil demo siap tayang.
              </span>
            </div>

            {/* WhatsApp Quick CTA button */}
            <a
              href={`https://wa.me/6282112477119?text=${encodeURIComponent(waOrderText)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-4 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <span>💬 Kirim Rincian Ini ke WhatsApp Ladi</span>
              <span>↗</span>
            </a>

            {/* Jaminan */}
            <div className="space-y-2 text-[11px] text-slate-500 pt-2 border-t border-slate-100">
              <div className="flex items-center gap-2">
                <span>🛡️</span>
                <span><strong>Tanpa Biaya Tersembunyi:</strong> Harga tercantum final dan transparan.</span>
              </div>
              <div className="flex items-center gap-2">
                <span>⚡</span>
                <span><strong>Aset 100% Milik Anda:</strong> Domain, akun Google Maps &amp; kode diserahkan penuh.</span>
              </div>
              <div className="flex items-center gap-2">
                <span>📑</span>
                <span><strong>Garansi Revisi:</strong> Pendampingan teknis langsung dari tim Ladi.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
