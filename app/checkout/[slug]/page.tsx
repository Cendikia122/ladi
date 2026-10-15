import { notFound } from "next/navigation";
import Link from "next/link";
import { getServicePackageBySlug, getServicePackages, getTemplatesByPackage } from "@/app/lib/storage";
import CheckoutForm from "./CheckoutForm";
import LadiLogo from "@/app/components/LadiLogo";
import { Config } from "@/app/lib/config";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const pkg = await getServicePackageBySlug(slug);
  return {
    title: pkg ? `Checkout ${pkg.name} | Ladi (Layanan Digital)` : "Checkout Pemesanan | Ladi",
    description: `Formulir pemesanan resmi ${pkg?.name || "Layanan Ladi"}. Tanpa ribet, proses cepat, dan pembayaran aman terverifikasi.`,
  };
}

export default async function CheckoutPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const sp = searchParams ? await searchParams : {};
  const pkg = await getServicePackageBySlug(slug);

  if (!pkg) {
    notFound();
  }

  const isGuard = slug === "paket-guard";
  const templates = isGuard ? [] : await getTemplatesByPackage(slug);

  // Jika paket-guard, tangani query params dan initialSelectedAddons
  let initialSelectedAddons: string[] = [];
  if (isGuard) {
    if (sp?.addons) {
      initialSelectedAddons = String(sp.addons).split(",").filter(Boolean);
    } else {
      initialSelectedAddons = ["uptime_247", "ssl_firewall", "seo_90", "gmaps_sync", "wa_report"];
    }
  }

  let deliverablesList: string[] = [];
  try {
    deliverablesList = JSON.parse(pkg.deliverables || "[]");
  } catch {
    deliverablesList = [
      "Website Responsif Modern",
      "Setup Google Business Profile",
      "Integrasi WhatsApp Otomatis",
      "Garansi Maintenance Perdana",
    ];
  }

  // Bersihkan angka harga
  let cleanPriceNum = 299000;
  if (isGuard) {
    cleanPriceNum = 0; // Guard harga dihitung dinamis dari total addons terpilih
  } else {
    const firstMatch = pkg.price.match(/\d[\d.,]*/);
    cleanPriceNum = firstMatch
      ? parseInt(firstMatch[0].replace(/[.,]/g, ""), 10)
      : 299000;
  }

  const formattedPrice = isGuard
    ? "Pecahan Modular"
    : new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0,
      }).format(cleanPriceNum);

  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#0f172a] selection:bg-[#fa824b] selection:text-white">
      {/* Checkout Navbar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="hover:opacity-90 transition-opacity">
              <LadiLogo />
            </Link>
            <span className="hidden sm:inline-block text-xs font-mono font-bold text-slate-400 pl-3 border-l border-slate-200 uppercase tracking-widest">
              Instant Checkout
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              <span>Enkripsi SSL 256-Bit</span>
            </span>
            <Link href={`/services/${slug}`} className="hover:text-[#fa824b] transition-colors ml-2 hidden md:inline-block">
              ← Kembali ke Detail Paket
            </Link>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Breadcrumb & Title */}
        <div className="mb-8 space-y-2">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Link href="/" className="hover:text-slate-800">Beranda</Link>
            <span>/</span>
            <Link href="/pricing" className="hover:text-slate-800">Paket Harga</Link>
            <span>/</span>
            <span className="text-slate-800 font-semibold truncate">Checkout {pkg.name}</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Formulir Pemesanan Resmi
          </h1>
          <p className="text-sm sm:text-base text-slate-600 max-w-2xl">
            Isi data usaha Anda di bawah ini. Tanpa ribet, invoice dan instruksi pembayaran akan otomatis diterbitkan seketika.
          </p>
        </div>

        {/* Banner Khusus Paket GUARD Modular */}
        {isGuard && (
          <div className="mb-8 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-blue-950 via-[#1853a7] to-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-4 border border-blue-800 shadow-md">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🛡️</span>
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-amber-300">
                  Jasa Maintenance Bisnis di Internet (Bukan Penjualan Web Baru)
                </div>
                <p className="text-xs sm:text-sm text-slate-200 mt-0.5">
                  Layanan pemeliharaan rutin seluruh aset digital bisnis Anda (Website, Google Maps, Medsos &amp; WhatsApp Bisnis). Bayar hanya modul yang dibutuhkan!
                </p>
              </div>
            </div>
            <Link
              href="/services/paket-guard#rakit-guard"
              className="px-5 py-2.5 rounded-full bg-[#fa824b] hover:bg-[#e5723b] text-white font-bold text-xs uppercase tracking-wider whitespace-nowrap transition-all shadow-md shrink-0"
            >
              Ubah Modul di Kalkulator →
            </Link>
          </div>
        )}

        {/* 2-Column Checkout Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Kolom Kiri: Form Checkout */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
            <CheckoutForm
              packageSlug={pkg.slug}
              packageName={pkg.name}
              packagePrice={cleanPriceNum}
              formattedPrice={formattedPrice}
              availableTemplates={templates}
              initialSelectedAddons={initialSelectedAddons}
            />
          </div>

          {/* Kolom Kanan: Ringkasan Pesanan & Trust Badges */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
            {/* Box Ringkasan Paket */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-5">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <span className="text-xs font-bold font-mono uppercase tracking-wider text-slate-400">
                  Ringkasan Paket
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-[#1853a7] text-[11px] font-bold">
                  {pkg.tag || "PAKET RESMI"}
                </span>
              </div>

              <div>
                <h3 className="text-xl font-extrabold text-slate-900">{pkg.name}</h3>
                <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                  {pkg.subtitle || "Solusi Infrastruktur Digital Ladi"}
                </p>
              </div>

              {/* Box Harga */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-slate-500 block">
                    {isGuard ? "Skema Biaya" : "Total Investasi"}
                  </span>
                  <div className="text-xl font-black text-[#1853a7]">
                    {isGuard ? "Sistem Pecahan LEGO" : formattedPrice}
                  </div>
                  <span className="text-[11px] text-slate-400">
                    {isGuard ? "Total terhitung dinamis dari modul terpilih" : (pkg.period || "Sekali Bayar")}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[11px] text-slate-500 block">
                    {isGuard ? "Aktivasi" : "Estimasi Selesai"}
                  </span>
                  <div className="text-sm font-bold text-slate-800">
                    ⚡ {pkg.timeline || "Langsung Aktif"}
                  </div>
                </div>
              </div>

              {/* Butir-butir yang didapatkan */}
              <div className="space-y-2.5">
                <span className="text-xs font-bold text-slate-700 block">
                  Yang Anda Dapatkan di Paket Ini:
                </span>
                <ul className="space-y-2 text-xs text-slate-600">
                  {deliverablesList.slice(0, 5).map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-emerald-500 font-bold shrink-0">✓</span>
                      <span className="leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Jaminan Ladi */}
              <div className="pt-4 border-t border-slate-100 space-y-2.5 text-xs text-slate-500">
                <div className="flex items-center gap-2">
                  <span className="text-base">🛡️</span>
                  <span><strong>Garansi Pengerjaan Tepat Waktu</strong> atau revisi gratis.</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-base">📑</span>
                  <span><strong>Kuitansi & Bukti Pembayaran Digital Sah</strong> langsung terbit.</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-base">💬</span>
                  <span>Didampingi konsultan Ladi langsung via WhatsApp.</span>
                </div>
              </div>
            </div>

            {/* Butuh Bantuan Chat CS */}
            <div className="p-5 rounded-2xl bg-[#0f172a] text-white flex items-center justify-between gap-4">
              <div className="space-y-0.5">
                <div className="text-xs font-bold text-[#fa824b]">Masih ada pertanyaan?</div>
                <div className="text-xs text-slate-300">Konsultasikan langsung dengan konsultan kami.</div>
              </div>
              <a
                href={`https://wa.me/${Config.whatsappNumber}?text=Halo+Ladi%2C+saya+sedang+di+halaman+checkout+${encodeURIComponent(pkg.name)}.+Boleh+tanya+dulu%3F`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider transition-colors shrink-0"
              >
                Tanya WA 💬
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
