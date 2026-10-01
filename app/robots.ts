import { MetadataRoute } from "next";
import { Config } from "@/app/lib/config";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = Config.siteUrl;

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/api/"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
