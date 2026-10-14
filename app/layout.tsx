import type { Metadata } from "next";
import { Poppins, Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Config } from "@/app/lib/config";
import NavigationProgress from "@/app/components/NavigationProgress";
import PageTransition from "@/app/components/PageTransition";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-poppins",
  display: "swap",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-plus-jakarta",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

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
          "https://wa.me/6282112477119",
          "https://linkedin.com/company/ladi-digital",
        ],
      },
      {
        "@type": "ProfessionalService",
        "@id": `${Config.siteUrl}/#localservice`,
        name: "Ladi (Layanan Digital) — Jasa Pembuatan Website & Digitalisasi UMKM",
        url: Config.siteUrl,
        logo: `${Config.siteUrl}/logo.png`,
        image: `${Config.siteUrl}/logo.png`,
        telephone: Config.contactPhone,
        priceRange: "Rp 500.000 - Rp 5.000.000",
        currenciesAccepted: "IDR",
        paymentAccepted: "Bank Transfer, QRIS, Cash",
        areaServed: [
          { "@type": "City", name: "Bogor" },
          { "@type": "City", name: "Depok" },
          { "@type": "City", name: "Jakarta" },
          { "@type": "Country", name: "Indonesia" },
        ],
        address: {
          "@type": "PostalAddress",
          addressLocality: "Bogor",
          addressRegion: "Jawa Barat",
          addressCountry: "ID",
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: -6.5971,
          longitude: 106.806,
        },
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Layanan Digitalisasi Ladi",
          itemListElement: [
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "Jasa Pembuatan Website Profesional & Panel Admin Dinamis",
              },
            },
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "Pendaftaran & Verifikasi Resmi Google Business Profile (Google Maps)",
              },
            },
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "Digital Presence System (DPS) & Pendampingan Rutin UMKM",
              },
            },
          ],
        },
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
    <html
      lang="id"
      className={`${poppins.variable} ${plusJakartaSans.variable} ${jetbrainsMono.variable} scroll-smooth bg-[#f8fafc]`}
    >
      <head>
        {/* Explicit Cache-Busted Favicons for Custom Domain */}
        <link rel="icon" type="image/png" sizes="32x32" href="/icon.png?v=3" />
        <link rel="icon" type="image/png" sizes="16x16" href="/icon.png?v=3" />
        <link rel="shortcut icon" href="/favicon.ico?v=3" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png?v=3" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationLd) }}
        />
      </head>
      <body className="antialiased bg-[#f8fafc] text-[#0f172a] selection:bg-[#fa824b] selection:text-white">
        <NavigationProgress />
        <PageTransition>{children}</PageTransition>
      </body>
    </html>
  );
}
