import type { Metadata } from "next";
import "./globals.css";
import { Config } from "@/app/lib/config";

export const metadata: Metadata = {
  title: "Ladi (Layanan Digital) — Bisnis Anda Hidup di Internet Global",
  description:
    "Ladi adalah konsultan dan mitra digitalisasi resmi bagi pemilik usaha dan UMKM di Indonesia. Pembuatan website cepat, pendaftaran Google Business resmi, dan optimasi peta digital.",
  keywords: [
    "Ladi",
    "Layanan Digital",
    "jasa pembuatan website",
    "digitalisasi UMKM",
    "daftar Google Maps bisnis",
    "konsultan digital Bogor",
    "website murah profesional",
    "optimasi Google Business Profile",
  ],
  metadataBase: new URL(Config.siteUrl),
  alternates: {
    canonical: Config.siteUrl,
  },
  openGraph: {
    title: "Ladi (Layanan Digital) — Bisnis Anda Hidup di Internet Global",
    description:
      "Mitra teknologi ramah bagi pemilik usaha di Indonesia. Hadirkan bisnis Anda di Google dan raih pelanggan baru setiap hari.",
    url: Config.siteUrl,
    siteName: Config.siteName,
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ladi (Layanan Digital) — Bisnis Anda Hidup di Internet Global",
    description:
      "Mitra teknologi ramah bagi pemilik usaha di Indonesia. Hadirkan bisnis Anda di Google dan raih pelanggan baru setiap hari.",
  },
  icons: {
    icon: [
      { url: "/favicon.ico?v=2", sizes: "any" },
      { url: "/icon.png?v=2", type: "image/png", sizes: "512x512" },
    ],
    shortcut: "/favicon.ico?v=2",
    apple: [
      { url: "/apple-touch-icon.png?v=2", sizes: "180x180", type: "image/png" },
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Schema.org Global Organization & WebSite (Turbo Authority & Knowledge Graph)
  const organizationLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${Config.siteUrl}/#organization`,
        name: "Ladi (Layanan Digital)",
        url: Config.siteUrl,
        logo: {
          "@type": "ImageObject",
          url: `${Config.siteUrl}/logo.png`,
          caption: "Logo Resmi Ladi",
        },
        contactPoint: {
          "@type": "ContactPoint",
          telephone: Config.contactPhone,
          contactType: "customer service",
          areaServed: "ID",
          availableLanguage: ["id", "en"],
        },
        address: {
          "@type": "PostalAddress",
          addressLocality: "Bogor",
          addressRegion: "Jawa Barat",
          addressCountry: "ID",
        },
        sameAs: [
          "https://www.instagram.com/ladi.digital",
          "https://wa.me/6281298319944",
          "https://linkedin.com/company/ladi-digital",
        ],
      },
      {
        "@type": "WebSite",
        "@id": `${Config.siteUrl}/#website`,
        url: Config.siteUrl,
        name: "Ladi (Layanan Digital)",
        publisher: {
          "@id": `${Config.siteUrl}/#organization`,
        },
        inLanguage: "id-ID",
      },
    ],
  };

  return (
    <html lang="id" className="scroll-smooth bg-[#f8fafc]">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationLd) }}
        />
      </head>
      <body className="antialiased bg-[#f8fafc] text-[#0f172a] selection:bg-[#fa824b] selection:text-white">
        {children}
      </body>
    </html>
  );
}
