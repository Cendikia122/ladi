/**
 * Central Application Configuration
 * Private server-side environment variables without public framework prefix.
 */

export const Config = {
  siteUrl: process.env.SITE_URL || "https://www.layanandigital.id",
  siteName: "Ladi (Layanan Digital)",
  defaultAuthor: "Tim Ladi",
  contactPhone: "+62 812 9831 9944",
  contactEmail: "contact@layanandigital.id",
  contactLocation: "Bogor, Indonesia",
};

export const siteConfig = Config;
