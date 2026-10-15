/**
 * Central Application Configuration
 * Private server-side & public configuration variables.
 */

export const Config = {
  siteUrl: process.env.SITE_URL || "https://www.layanandigital.id",
  siteName: "Ladi (Layanan Digital)",
  defaultAuthor: "Tim Ladi",
  contactPhone: "+62 821-1247-7119",
  whatsappNumber: "6282112477119",
  whatsappDisplay: "0821-1247-7119",
  contactEmail: "contact@layanandigital.id",
  contactLocation: "Bogor, Indonesia",
  payment: {
    gopay: {
      name: "GoPay",
      number: "082112477119",
      display: "0821-1247-7119",
      accountHolder: "Ladi Layanan Digital",
    },
    qrisMerchant: "LADI LAYANAN DIGITAL",
    nmid: "ID1024391829012",
    bca: {
      bankName: "BCA (Bank Central Asia)",
      accountNumber: "8730918291",
      accountHolder: "Ladi Layanan Digital",
    },
    mandiri: {
      bankName: "Bank Mandiri",
      accountNumber: "1330029182910",
      accountHolder: "Ladi Layanan Digital",
    },
  },
};

export const siteConfig = Config;
