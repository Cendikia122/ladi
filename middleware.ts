import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const host = (request.headers.get("host") || "").toLowerCase();
  const isLocalhost =
    host.includes("localhost") ||
    host.includes("127.0.0.1") ||
    host.includes("::1");

  // Canonical Domain Resmi: https://www.layanandigital.id
  if (!isLocalhost) {
    const proto = request.headers.get("x-forwarded-proto") || "https";

    // 1. Redirect Non-WWW ke WWW (layanandigital.id -> https://www.layanandigital.id)
    // Menghilangkan duplikasi konten di mesin pencari (Seobility HTTP Redirects 301)
    if (host === "layanandigital.id") {
      const destination = `https://www.layanandigital.id${pathname}${search}`;
      return NextResponse.redirect(destination, 301);
    }

    // 2. Redirect HTTP ke HTTPS (SSL Aman)
    if (proto === "http") {
      const canonicalHost = host.startsWith("www.") ? host : `www.${host}`;
      const destination = `https://${canonicalHost}${pathname}${search}`;
      return NextResponse.redirect(destination, 301);
    }

    // 3. Domain Alias Pengalihan (ladi.id / ladi.digital -> www.layanandigital.id)
    if (
      host === "ladi.id" ||
      host === "www.ladi.id" ||
      host === "ladi.digital" ||
      host === "www.ladi.digital"
    ) {
      const destination = `https://www.layanandigital.id${pathname}${search}`;
      return NextResponse.redirect(destination, 301);
    }
  }

  // 4. Proteksi Rute Admin (/admin)
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    const token = request.cookies.get("ladi_admin_token")?.value;

    // Jika belum login di production, arahkan ke login
    if (!token || !token.trim()) {
      if (isLocalhost || process.env.NODE_ENV !== "production") {
        return NextResponse.next();
      }
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      loginUrl.searchParams.set("reason", "unauthorized");
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match semua halaman web untuk evaluasi redirect canonical & SSL,
     * KECUALI file statis internal Next.js dan file gambar/ikon.
     */
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|uploads/|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
