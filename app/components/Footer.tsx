import Link from "next/link";
import LadiLogo from "./LadiLogo";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0f172a] text-slate-400 border-t border-slate-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 mb-14">
          {/* Brand & Overview */}
          <div className="lg:col-span-5 space-y-4">
            <LadiLogo inverted={true} />

            <p className="text-sm text-slate-300 leading-relaxed max-w-sm">
              Ladi (Layanan Digital) adalah teman yang melek teknologi bagi pemilik usaha di Indonesia. Kami bangunkan website, hadirkan di Google, dan laporkan hasilnya setiap bulan.
            </p>

            <div className="pt-2 text-xs text-[#fa824b] font-bold">
              &ldquo;Bisnis Kamu, Dunia Lihat.&rdquo;
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider font-mono">
              Halaman Terkait
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/" className="hover:text-white transition-colors">Beranda</Link>
              </li>
              <li>
                <Link href="/about-us" className="hover:text-white transition-colors">Tentang Ladi</Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-white transition-colors">Pilihan Layanan (DPS)</Link>
              </li>
              <li>
                <Link href="/project" className="hover:text-white transition-colors">Portofolio Karya Ladi</Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-white transition-colors">Biaya & Paket Harga</Link>
              </li>
              <li>
                <Link href="/events" className="hover:text-white transition-colors">Agenda Workshop & Event</Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-white transition-colors">Tanya Jawab (FAQ)</Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-white transition-colors">Wawasan & Tips Bisnis</Link>
              </li>
              <li>
                <Link href="/contact-us" className="hover:text-white transition-colors">Hubungi Kami</Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="lg:col-span-4 space-y-3">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider font-mono">
              Kontak & Lokasi
            </h4>
            <div className="space-y-2.5 text-xs text-slate-300">
              <div className="flex items-start gap-2">
                <span className="text-[#fa824b] font-bold">📍</span>
                <span>Bogor & Depok, Jawa Barat, Indonesia</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-[#fa824b] font-bold">💬</span>
                <a
                  href="https://wa.me/6281298319944"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  +62 812-9831-9944 (WhatsApp)
                </a>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-[#fa824b] font-bold">✉️</span>
                <span>contact@layanandigital.id</span>
              </div>
            </div>

            <div className="pt-3">
              <Link
                href="/contact-us"
                className="inline-block px-5 py-2.5 rounded-full bg-[#fa824b] hover:bg-[#e5723b] text-white font-bold text-xs uppercase tracking-wider transition-all"
              >
                Minta Cek Usaha Gratis →
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar with Admin Portal Access */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <div>
            © {currentYear} Ladi — Layanan Digital. Seluruh hak cipta dilindungi.
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Bisnis Anda Hidup di Internet Global.</span>
            <span>·</span>
            <Link href="/admin/login" className="hover:text-[#fa824b] transition-colors font-mono text-[11px]">
              Portal Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
