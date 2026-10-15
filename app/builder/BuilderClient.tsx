"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { TemplateItem } from "@/app/lib/storage";

interface BuilderClientProps {
  initialTemplates: TemplateItem[];
}

interface AddonItem {
  id: string;
  name: string;
  price: number;
  desc: string;
  badge?: string;
  icon: string;
}

const TECH_OPTIONS = [
  {
    id: "HTML5",
    name: "HTML5 & Bootstrap / Tailwind",
    price: 299000,
    badge: "Paling Hemat & Cepat",
    desc: "Sangat ringan, loading kilat, tanpa database rumit. Cocok untuk landing page, profil bisnis, dan katalog ringkas.",
    color: "from-blue-500/10 to-indigo-500/10 border-blue-200 text-blue-900",
  },
  {
    id: "PHP",
    name: "PHP Modern (Dinamis)",
    price: 599000,
    badge: "Dinamis & Fleksibel",
    desc: "Mendukung formulir pemesanan, pengiriman email notifikasi, dan struktur multi-halaman dinamis.",
    color: "from-purple-500/10 to-violet-500/10 border-purple-200 text-purple-900",
  },
  {
    id: "Laravel",
    name: "Laravel Framework",
    price: 1499000,
    badge: "Standar Korporat",
    desc: "Arsitektur MVC tangguh, database MySQL terstruktur, keamanan enterprise, dan backend panel komplit.",
    color: "from-rose-500/10 to-red-500/10 border-rose-200 text-rose-900",
  },
  {
    id: "Next.JS",
    name: "Next.js / React (Super Modern)",
    price: 2499000,
    badge: "Performa Kelas Dunia",
    desc: "Teknologi tercanggih 2026. Server-side rendering super ngebut, transisi animasi mulus, SEO maksimal, dan API ready.",
    color: "from-amber-500/10 to-orange-500/10 border-amber-200 text-amber-900",
  },
];

const DOMAIN_OPTIONS = [
  { id: ".com", name: ".com (Standar Global)", price: 180000, badge: "Paling Populer" },
  { id: ".id", name: ".id (Resmi Indonesia)", price: 250000, badge: "Terpercaya" },
  { id: ".co.id", name: ".co.id (Badan Usaha / PT / CV)", price: 300000, badge: "Legalitas Resmi" },
  { id: ".my.id", name: ".my.id (Ekonomis UMKM)", price: 45000, badge: "Super Hemat" },
  { id: "self", name: "Sudah Punya Domain Sendiri", price: 0, badge: "Gratis Setup" },
];

const HOSTING_OPTIONS = [
  { id: "3_bulan", name: "3 Bulan Hosting Cloud", price: 150000, note: "Rp 50rb/bln" },
  { id: "6_bulan", name: "6 Bulan Hosting Cloud", price: 275000, note: "Diskon 8% (Rp 45.8rb/bln)" },
  { id: "12_bulan", name: "12 Bulan (1 Tahun Penuh)", price: 499000, note: "⭐ Paling Hemat 17% (Rp 41.5rb/bln)", isBest: true },
  { id: "self_host", name: "Hosting di Server Milik Sendiri", price: 0, note: "Klien sediakan cPanel / VPS" },
];

const ADDONS_CATALOG: AddonItem[] = [
  {
    id: "gmaps",
    name: "Google Business Profile & Google Maps",
    price: 150000,
    icon: "📍",
    desc: "Setup titik lokasi di Google Maps, optimasi nama bisnis, dan panduan verifikasi.",
    badge: "Wajib untuk Toko Fisik",
  },
  {
    id: "wa_auto",
    name: "WhatsApp Order Auto-Reply / Generator",
    price: 99000,
    icon: "💬",
    desc: "Tombol klik pesan WhatsApp dengan format order rapi otomatis masuk ke chat bisnis Anda.",
    badge: "Praktis",
  },
  {
    id: "qris_auto",
    name: "QRIS Pembayaran Otomatis Dinamis",
    price: 250000,
    icon: "📱",
    desc: "Integrasi QRIS barcode langsung di layar pelanggan untuk transaksi instan tanpa cek mutasi manual.",
    badge: "Otomatisasi",
  },
  {
    id: "copywriting",
    name: "Penulisan Konten & Copywriting Promosi",
    price: 150000,
    icon: "✍️",
    desc: "Tim Ladi yang menuliskan kata-kata promosi memikat, headline, dan deskripsi produk Anda.",
    badge: "Anti Pusing Nulis",
  },
  {
    id: "blog_cms",
    name: "Modul Blog / Artikel SEO Interaktif",
    price: 200000,
    icon: "📰",
    desc: "Halaman publikasi artikel untuk mendongkrak pencarian organik Google tanpa batas waktu.",
    badge: "Tingkatkan Traffic",
  },
  {
    id: "backup_security",
    name: "Satpam Digital & Backup Cloud Berkala",
    price: 150000,
    icon: "🛡️",
    desc: "Proteksi firewall anti hack, monitor uptime 24/7, dan backup file mingguan selama 3 bulan.",
    badge: "Aman Tentram",
  },
];

export default function BuilderClient({ initialTemplates }: BuilderClientProps) {
  const router = useRouter();

  // State Pilihan Pecahan LEGO
  const [selectedTech, setSelectedTech] = useState<string>("HTML5");
  const [templateMode, setTemplateMode] = useState<"pick" | "research">("pick");
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>("hawaa-travel");
  const [industryFilter, setIndustryFilter] = useState<string>("all");
  const [selectedDomain, setSelectedDomain] = useState<string>(".com");
  const [domainNameInput, setDomainNameInput] = useState<string>("");
  const [selectedHosting, setSelectedHosting] = useState<string>("12_bulan");
  const [selectedAddons, setSelectedAddons] = useState<string[]>([
    "gmaps",
    "wa_auto",
  ]);

  // Form Klien
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [businessCategory, setBusinessCategory] = useState("Kuliner / F&B (Resto, Kafe, Katering)");
  const [paymentMethod, setPaymentMethod] = useState("QRIS");
  const [notes, setNotes] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Daftar Kategori Industri
  const industries = useMemo(() => {
    const list = Array.from(new Set(initialTemplates.map((t) => t.industry)));
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

  // Biaya Komponen
  const techObj = TECH_OPTIONS.find((t) => t.id === selectedTech) || TECH_OPTIONS[0];
  const domainObj = DOMAIN_OPTIONS.find((d) => d.id === selectedDomain) || DOMAIN_OPTIONS[0];
  const hostingObj = HOSTING_OPTIONS.find((h) => h.id === selectedHosting) || HOSTING_OPTIONS[2];

  const researchFee = templateMode === "research" ? 100000 : 0;

  const addonsTotal = useMemo(() => {
    return selectedAddons.reduce((acc, addonId) => {
      const found = ADDONS_CATALOG.find((a) => a.id === addonId);
      return acc + (found ? found.price : 0);
    }, 0);
  }, [selectedAddons]);

  const grandTotal = techObj.price + researchFee + domainObj.price + hostingObj.price + addonsTotal;

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  const handleToggleAddon = (id: string) => {
    if (selectedAddons.includes(id)) {
      setSelectedAddons(selectedAddons.filter((item) => item !== id));
    } else {
      setSelectedAddons([...selectedAddons, id]);
    }
  };

  const handleSelectTemplate = (template: TemplateItem) => {
    setSelectedTemplateId(template.id);
    setTemplateMode("pick");
    // Selaraskan teknologi framework otomatis jika template berbeda
    if (template.tech === "HTML5" && selectedTech !== "HTML5") {
      setSelectedTech("HTML5");
    } else if (template.tech === "PHP" && selectedTech !== "PHP") {
      setSelectedTech("PHP");
    } else if (template.tech === "Laravel" && selectedTech !== "Laravel") {
      setSelectedTech("Laravel");
    } else if ((template.tech === "Next.JS" || template.tech === "React") && selectedTech !== "Next.JS") {
      setSelectedTech("Next.JS");
    }
  };

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

    const templateSummary = templateMode === "research"
      ? "Rekomendasi Template Khusus oleh Tim Ladi (+Rp 100.000 Riset)"
      : `${activeTemplate.name} (${activeTemplate.tech})`;

    const templateDemoUrl = templateMode === "research" ? "" : activeTemplate.envato_url;

    const addonsSummary = selectedAddons
      .map((id) => ADDONS_CATALOG.find((a) => a.id === id)?.name)
      .filter(Boolean);

    const domainSummary = selectedDomain === "self"
      ? `Domain Sendiri: ${domainNameInput || "Belum ditentukan"}`
      : `${domainNameInput ? domainNameInput + " " : ""}(${domainObj.name})`;

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          package_slug: "custom-builder",
          package_name: `Custom Builder (${techObj.name})`,
          package_price: grandTotal,
          customer_name: customerName,
          customer_phone: customerPhone,
          customer_email: customerEmail,
          business_name: businessName,
          business_category: businessCategory,
          domain_requested: domainNameInput || domainObj.name,
          notes: notes,
          payment_method: paymentMethod,
          order_type: "pecahan",
          template_name: templateSummary,
          template_url: templateDemoUrl,
          template_tech: techObj.id,
          domain_choice: domainSummary,
          hosting_duration: hostingObj.name,
          addons: addonsSummary,
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
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#fa824b]/20 text-[#fa824b] text-xs font-bold font-mono uppercase tracking-wider">
            <span>🧩 Sistem LEGO Builder</span>
          </div>
          <h2 className="text-xl sm:text-3xl font-extrabold tracking-tight">
            Pilih Komponen Sesukamu, Bayar yang Diperlukan Saja
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm max-w-xl leading-relaxed">
            Tidak mau terikat paket baku? Rancang sendiri website impianmu: pilih framework, pilih dari 23 template Envato siap pakai, tentukan durasi hosting, dan pasang add-on yang kamu mau.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 z-10 shrink-0">
          <Link
            href="/pricing"
            className="px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold uppercase tracking-wider text-center transition-all border border-white/10"
          >
            ← Lihat Paketan Siap Pakai
          </Link>
          <a
            href="#kalkulator-form"
            className="px-6 py-3 rounded-2xl bg-[#fa824b] hover:bg-[#e5723b] text-white text-xs font-extrabold uppercase tracking-wider text-center shadow-lg transition-all"
          >
            Rakit Sekarang ↓
          </a>
        </div>
      </div>

      {/* Main Grid: Left Steps, Right Sticky Calculator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start" id="kalkulator-form">
        {/* Kolom Kiri: Konfigurasi Pecahan */}
        <div className="lg:col-span-8 space-y-10">
          {/* LANGKAH 1: Pilih Pondasi Framework / Teknologi */}
          <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
              <span className="w-8 h-8 rounded-2xl bg-[#1853a7] text-white text-sm font-black flex items-center justify-center shadow-md">
                1
              </span>
              <div>
                <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
                  Pilih Fondasi Framework & Teknologi Web
                </h3>
                <p className="text-xs text-slate-500">
                  Tentukan mesin utama website sesuai kebutuhan fitur dan anggaran Anda.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {TECH_OPTIONS.map((tech) => {
                const isSelected = selectedTech === tech.id;
                return (
                  <div
                    key={tech.id}
                    onClick={() => setSelectedTech(tech.id)}
                    className={`p-5 rounded-2xl border-2 transition-all cursor-pointer relative flex flex-col justify-between ${
                      isSelected
                        ? "border-[#1853a7] bg-blue-50/40 shadow-md ring-2 ring-[#1853a7]/20"
                        : "border-slate-200 hover:border-slate-300 bg-white"
                    }`}
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                          {tech.badge}
                        </span>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          isSelected ? "border-[#1853a7] bg-[#1853a7]" : "border-slate-300"
                        }`}>
                          {isSelected && <span className="text-white text-[10px]">✓</span>}
                        </div>
                      </div>
                      <h4 className="text-sm font-extrabold text-slate-900">{tech.name}</h4>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">{tech.desc}</p>
                    </div>

                    <div className="pt-4 mt-3 border-t border-slate-100/80 flex items-baseline justify-between">
                      <span className="text-[11px] text-slate-400 font-medium">Biaya Fondasi:</span>
                      <span className="text-sm sm:text-base font-black text-[#1853a7]">
                        {formatRupiah(tech.price)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* LANGKAH 2: Pilih Template Desain (23 Envato) atau Rekomendasi Tim */}
          <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
              <span className="w-8 h-8 rounded-2xl bg-[#1853a7] text-white text-sm font-black flex items-center justify-center shadow-md">
                2
              </span>
              <div>
                <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
                  Pilih Desain / Template Website
                </h3>
                <p className="text-xs text-slate-500">
                  Pilih langsung dari 23 template Envato terverifikasi atau minta rekomendasi dari tim riset Ladi.
                </p>
              </div>
            </div>

            {/* Opsi Rekomendasi vs Pilih Sendiri */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div
                onClick={() => setTemplateMode("pick")}
                className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                  templateMode === "pick"
                    ? "border-[#fa824b] bg-orange-50/30 shadow-sm ring-1 ring-[#fa824b]"
                    : "border-slate-200 hover:border-slate-300 bg-white"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-extrabold text-slate-900">
                    🎨 Saya Pilih Template Sendiri
                  </span>
                  <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                    Termasuk (+Rp 0)
                  </span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Bebas pilih salah satu dari 23 template Envato di bawah sesuai selera visual Anda.
                </p>
              </div>

              <div
                onClick={() => setTemplateMode("research")}
                className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                  templateMode === "research"
                    ? "border-[#1853a7] bg-blue-50/40 shadow-sm ring-1 ring-[#1853a7]"
                    : "border-slate-200 hover:border-slate-300 bg-white"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-extrabold text-slate-900">
                    💡 Rekomendasikan oleh Tim Ladi
                  </span>
                  <span className="text-[11px] font-bold text-[#1853a7] bg-blue-100/70 px-2 py-0.5 rounded-full">
                    +Rp 100.000 Riset
                  </span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Tim kami akan meriset niche bisnis Anda dan memilihkan template premium yang paling cocok &amp; berkonversi tinggi.
                </p>
              </div>
            </div>

            {/* Daftar Template Envato (Hanya tampil jika mode 'pick') */}
            {templateMode === "pick" && (
              <div className="space-y-4 pt-2">
                {/* Filter Industri Tab */}
                <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none text-xs">
                  <span className="text-slate-400 font-bold shrink-0">Filter:</span>
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
                      {ind === "all" ? "Semua Kategori (23)" : ind}
                    </button>
                  ))}
                </div>

                {/* Grid Template Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[560px] overflow-y-auto pr-1">
                  {filteredTemplates.map((item) => {
                    const isPicked = selectedTemplateId === item.id;
                    return (
                      <div
                        key={item.id}
                        className={`p-4 rounded-2xl border-2 transition-all flex flex-col justify-between ${
                          isPicked
                            ? "border-[#fa824b] bg-orange-50/30 shadow-md ring-2 ring-[#fa824b]/20"
                            : "border-slate-200 hover:border-slate-300 bg-white"
                        }`}
                      >
                        <div className="space-y-2">
                          <div className="flex items-start justify-between gap-2">
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-slate-900 text-white">
                              {item.tech}
                            </span>
                            <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                              {item.industry}
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
                          <a
                            href={item.envato_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[11px] font-bold text-blue-600 hover:underline flex items-center gap-1"
                          >
                            <span>Live Preview Envato</span>
                            <span className="text-[9px]">↗</span>
                          </a>

                          <button
                            type="button"
                            onClick={() => handleSelectTemplate(item)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                              isPicked
                                ? "bg-[#fa824b] text-white shadow-sm"
                                : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                            }`}
                          >
                            {isPicked ? "✓ Terpilih" : "Pilih Ini"}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </section>

          {/* LANGKAH 3: Pilihan Domain */}
          <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
              <span className="w-8 h-8 rounded-2xl bg-[#1853a7] text-white text-sm font-black flex items-center justify-center shadow-md">
                3
              </span>
              <div>
                <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
                  Pilihan Ekstensi Domain
                </h3>
                <p className="text-xs text-slate-500">
                  Alamat resmi website Anda di internet.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {DOMAIN_OPTIONS.map((dom) => {
                const isSelected = selectedDomain === dom.id;
                return (
                  <div
                    key={dom.id}
                    onClick={() => setSelectedDomain(dom.id)}
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
                Jika belum punya ide nama domain, kosongkan saja. Tim Ladi akan mencarikan 3 rekomendasi terbaik.
              </span>
            </div>
          </section>

          {/* LANGKAH 4: Durasi Hosting */}
          <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
              <span className="w-8 h-8 rounded-2xl bg-[#1853a7] text-white text-sm font-black flex items-center justify-center shadow-md">
                4
              </span>
              <div>
                <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
                  Durasi Cloud Hosting & Server
                </h3>
                <p className="text-xs text-slate-500">
                  Server berkecepatan tinggi dengan uptime 99.9% dan SSL gratis.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {HOSTING_OPTIONS.map((host) => {
                const isSelected = selectedHosting === host.id;
                return (
                  <div
                    key={host.id}
                    onClick={() => setSelectedHosting(host.id)}
                    className={`p-4 rounded-2xl border-2 transition-all cursor-pointer relative ${
                      isSelected
                        ? "border-[#1853a7] bg-blue-50/40 shadow-sm ring-1 ring-[#1853a7]"
                        : "border-slate-200 hover:border-slate-300 bg-white"
                    }`}
                  >
                    {host.isBest && (
                      <span className="absolute -top-2.5 right-4 px-2.5 py-0.5 rounded-full bg-[#fa824b] text-white text-[9px] font-bold uppercase tracking-wider">
                        Rekomendasi
                      </span>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold text-slate-900">{host.name}</span>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-1">{host.note}</div>
                    <div className="text-xs sm:text-sm font-black text-[#1853a7] mt-2">
                      {host.price === 0 ? "Gratis (Pakai Server Sendiri)" : formatRupiah(host.price)}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* LANGKAH 5: Add-Ons Pelengkap */}
          <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
              <span className="w-8 h-8 rounded-2xl bg-[#1853a7] text-white text-sm font-black flex items-center justify-center shadow-md">
                5
              </span>
              <div>
                <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
                  Add-Ons Pilihan (Biar Ga Kerasa Mahal)
                </h3>
                <p className="text-xs text-slate-500">
                  Pilih fitur tambahan yang benar-benar Anda butuhkan secara modular.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {ADDONS_CATALOG.map((addon) => {
                const isChecked = selectedAddons.includes(addon.id);
                return (
                  <div
                    key={addon.id}
                    onClick={() => handleToggleAddon(addon.id)}
                    className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-start gap-3 ${
                      isChecked
                        ? "border-[#fa824b] bg-orange-50/20 shadow-sm"
                        : "border-slate-200 hover:border-slate-300 bg-white"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => {}} // Di-handle oleh parent div
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

          {/* LANGKAH 6: Formulir Data Pemesan & Pembayaran */}
          <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
              <span className="w-8 h-8 rounded-2xl bg-[#1853a7] text-white text-sm font-black flex items-center justify-center shadow-md">
                6
              </span>
              <div>
                <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
                  Data Pemesan & Metode Pembayaran
                </h3>
                <p className="text-xs text-slate-500">
                  Data untuk penerbitan invoice resmi dan koordinasi pengerjaan.
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
                    Alamat Email (Opsional)
                  </label>
                  <input
                    type="email"
                    placeholder="cth. hendra@gmail.com"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-[#fa824b] bg-slate-50/50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Catatan Tambahan untuk Tim Ladi (Opsional)
                </label>
                <textarea
                  rows={2}
                  placeholder="Ceritakan preferensi warna, referensi website yang disukai, atau catatan penting lainnya..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-[#fa824b] bg-slate-50/50"
                />
              </div>

              {/* Pilihan Metode Bayar */}
              <div className="pt-2">
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Metode Pembayaran
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <label
                    className={`p-3 rounded-xl border-2 flex items-center gap-2 cursor-pointer transition-all ${
                      paymentMethod === "QRIS"
                        ? "border-[#fa824b] bg-orange-50/30"
                        : "border-slate-200 bg-white"
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment_method"
                      value="QRIS"
                      checked={paymentMethod === "QRIS"}
                      onChange={() => setPaymentMethod("QRIS")}
                      className="text-[#fa824b] focus:ring-[#fa824b]"
                    />
                    <span className="text-xs font-bold text-slate-800">📱 QRIS Instan</span>
                  </label>

                  <label
                    className={`p-3 rounded-xl border-2 flex items-center gap-2 cursor-pointer transition-all ${
                      paymentMethod === "BCA"
                        ? "border-[#fa824b] bg-orange-50/30"
                        : "border-slate-200 bg-white"
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment_method"
                      value="BCA"
                      checked={paymentMethod === "BCA"}
                      onChange={() => setPaymentMethod("BCA")}
                      className="text-[#fa824b] focus:ring-[#fa824b]"
                    />
                    <span className="text-xs font-bold text-slate-800">🏦 Transfer BCA</span>
                  </label>

                  <label
                    className={`p-3 rounded-xl border-2 flex items-center gap-2 cursor-pointer transition-all ${
                      paymentMethod === "MANDIRI"
                        ? "border-[#fa824b] bg-orange-50/30"
                        : "border-slate-200 bg-white"
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment_method"
                      value="MANDIRI"
                      checked={paymentMethod === "MANDIRI"}
                      onChange={() => setPaymentMethod("MANDIRI")}
                      className="text-[#fa824b] focus:ring-[#fa824b]"
                    />
                    <span className="text-xs font-bold text-slate-800">🏦 Transfer Mandiri</span>
                  </label>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100">
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
                      <span>Menerbitkan Pesanan & Invoice...</span>
                    </>
                  ) : (
                    <>
                      <span>Buat Pesanan Custom & Lanjut Bayar ({formatRupiah(grandTotal)})</span>
                      <span>→</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </section>
        </div>

        {/* Kolom Kanan: Sticky Ringkasan Real-Time */}
        <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-xs font-bold font-mono uppercase tracking-wider text-slate-400">
                Kalkulator Real-Time
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-bold">
                Kustom LEGO
              </span>
            </div>

            {/* Rincian Komponen */}
            <div className="space-y-3 text-xs">
              {/* Fondasi Framework */}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="font-bold text-slate-800">Framework: {techObj.name}</div>
                  <div className="text-[11px] text-slate-400">Fondasi utama website</div>
                </div>
                <div className="font-black text-slate-800">{formatRupiah(techObj.price)}</div>
              </div>

              {/* Template */}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="font-bold text-slate-800">
                    Template: {templateMode === "research" ? "Riset Tim Ladi" : activeTemplate.name}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    {templateMode === "research" ? "Kurasi khusus niche bisnis" : activeTemplate.tech}
                  </div>
                </div>
                <div className="font-black text-slate-800">
                  {templateMode === "research" ? "+Rp 100.000" : "+Rp 0"}
                </div>
              </div>

              {/* Domain */}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="font-bold text-slate-800">Domain: {domainObj.name}</div>
                  <div className="text-[11px] text-slate-400">
                    {domainNameInput ? domainNameInput : "Alamat web resmi"}
                  </div>
                </div>
                <div className="font-black text-slate-800">
                  {domainObj.price === 0 ? "Rp 0" : "+" + formatRupiah(domainObj.price)}
                </div>
              </div>

              {/* Hosting */}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="font-bold text-slate-800">Hosting: {hostingObj.name}</div>
                  <div className="text-[11px] text-slate-400">{hostingObj.note}</div>
                </div>
                <div className="font-black text-slate-800">
                  {hostingObj.price === 0 ? "Rp 0" : "+" + formatRupiah(hostingObj.price)}
                </div>
              </div>

              {/* Add-ons list */}
              {selectedAddons.length > 0 && (
                <div className="pt-2 border-t border-slate-100 space-y-1.5">
                  <span className="text-[11px] font-bold text-slate-500 block">
                    Add-Ons Terpilih ({selectedAddons.length}):
                  </span>
                  {selectedAddons.map((id) => {
                    const addon = ADDONS_CATALOG.find((a) => a.id === id);
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
            </div>

            {/* Total Box */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
              <span className="text-[11px] text-slate-500 block font-medium">Total Investasi Akhir:</span>
              <div className="text-2xl sm:text-3xl font-black text-[#1853a7]">
                {formatRupiah(grandTotal)}
              </div>
              <span className="text-[10px] text-slate-400 block">
                Termasuk garansi revisi &amp; pendampingan teknis Ladi.
              </span>
            </div>

            {/* Jaminan */}
            <div className="space-y-2 text-[11px] text-slate-500 pt-2 border-t border-slate-100">
              <div className="flex items-center gap-2">
                <span>🛡️</span>
                <span><strong>Tanpa Biaya Tersembunyi:</strong> Harga tercantum final.</span>
              </div>
              <div className="flex items-center gap-2">
                <span>⚡</span>
                <span><strong>Pengerjaan Kilat:</strong> Langsung dimulai setelah DP / pelunasan.</span>
              </div>
              <div className="flex items-center gap-2">
                <span>📑</span>
                <span><strong>Invoice & QRIS Resmi:</strong> Terbit seketika di layar Anda.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
