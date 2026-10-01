import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ladi Consulting — Bisnis Anda Hidup di Internet Global",
  description: "Ladi (Layanan Digital) adalah konsultan dan perekayasa kehadiran digital independen berstandar enterprise untuk bisnis Indonesia.",
  keywords: [
    "konsultan digital bisnis",
    "Ladi Consulting",
    "kehadiran digital global",
    "arsitektur web enterprise",
    "SEO semantik",
    "kedaulatan digital",
  ],
  metadataBase: new URL("https://ladi.digital"),
  openGraph: {
    title: "Ladi Consulting — Bisnis Anda Hidup di Internet Global",
    description: "Layanan konsultasi, arsitektur web modern, dan otoritas pencarian global untuk bisnis Indonesia.",
    siteName: "Ladi Consulting",
    locale: "id_ID",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="scroll-smooth bg-[#f8fafc]">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased bg-[#f8fafc] text-[#0f172a] selection:bg-[#fa824b] selection:text-white">
        {children}
      </body>
    </html>
  );
}
