import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

function applySecurityHeaders(res: NextResponse): NextResponse {
  res.headers.set("X-Frame-Options", "DENY");
  res.headers.set("X-Content-Type-Options", "nosniff");
  res.headers.set("X-XSS-Protection", "1; mode=block");
  res.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  res.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  res.headers.set(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https:; style-src 'self' 'unsafe-inline' https:; img-src 'self' data: https: blob:; font-src 'self' data: https:; connect-src 'self' https:; frame-ancestors 'none';"
  );
  res.headers.set("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload");
  return res;
}

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const host = (request.headers.get("host") || "").toLowerCase();
  const isLocalhost =
    host.includes("localhost") ||
    host.includes("127.0.0.1") ||
    host.includes("::1");

  // 1. Anti HTTP Request Smuggling & Header Desynchronization
  const te = request.headers.get("transfer-encoding");
  const cl = request.headers.get("content-length");
  if (te && cl) {
    return applySecurityHeaders(
      new NextResponse("Bad Request: Conflicting Transfer-Encoding and Content-Length", { status: 400 })
    );
  }
  if (te && (te.toLowerCase() !== "chunked" || te.includes(",") || te.includes(":"))) {
    return applySecurityHeaders(
      new NextResponse("Bad Request: Invalid Transfer-Encoding", { status: 400 })
    );
  }

  // 2. Anti NoSQL Injection & Query Parameter Operator Tampering
  const rawSearch = search.toLowerCase();
  if (
    rawSearch.includes("$gt") ||
    rawSearch.includes("$ne") ||
    rawSearch.includes("$where") ||
    rawSearch.includes("$regex") ||
    rawSearch.includes("$or") ||
    rawSearch.includes("[$ne]") ||
    rawSearch.includes("[$gt]")
  ) {
    return applySecurityHeaders(
      NextResponse.json(
        { success: false, error: "Bad Request: Illegal query operator detected." },
        { status: 400 }
      )
    );
  }

  // 3. Anti Business Logic Manipulation (Negative Quantity/Price in Query)
  const badNumericParams = ["price", "amount", "total", "cost", "value", "quantity", "qty", "count"];
  for (const param of badNumericParams) {
    const val = request.nextUrl.searchParams.get(param);
    if (val !== null) {
      const num = Number(val);
      if (!isNaN(num) && num < 0) {
        return applySecurityHeaders(
          NextResponse.json(
            { success: false, error: `Invalid parameter '${param}': negative values are not allowed.` },
            { status: 400 }
          )
        );
      }
    }
  }

  // 4. Batasi HTTP Method pada Halaman Statis / Non-API (Mencegah POST acak ke beranda yang lolos dengan status 200)
  if (
    !pathname.startsWith("/api") &&
    !pathname.startsWith("/admin") &&
    request.method !== "GET" &&
    request.method !== "HEAD" &&
    request.method !== "OPTIONS"
  ) {
    return applySecurityHeaders(new NextResponse("Method Not Allowed", { status: 405 }));
  }

  // 5. CSRF Protection untuk Request State-Changing ke /api/*
  if (
    pathname.startsWith("/api/") &&
    ["POST", "PUT", "PATCH", "DELETE"].includes(request.method) &&
    !isLocalhost
  ) {
    const origin = request.headers.get("origin");
    if (origin) {
      try {
        const originHost = new URL(origin).hostname.toLowerCase();
        const allowedHosts = [
          "layanandigital.id",
          "www.layanandigital.id",
          "ladi.id",
          "www.ladi.id",
          "ladi.digital",
          "www.ladi.digital",
        ];
        const isAllowed =
          originHost === host ||
          allowedHosts.includes(originHost) ||
          originHost.endsWith(".vercel.app");
        if (!isAllowed) {
          return applySecurityHeaders(
            NextResponse.json(
              { success: false, error: "Forbidden: Cross-site request rejected (CSRF protection)." },
              { status: 403 }
            )
          );
        }
      } catch {
        return applySecurityHeaders(
          NextResponse.json({ success: false, error: "Invalid Origin header." }, { status: 400 })
        );
      }
    }
  }

  // 6. Canonical Domain Resmi: https://www.layanandigital.id
  if (!isLocalhost) {
    const proto = request.headers.get("x-forwarded-proto") || "https";

    // Redirect Non-WWW ke WWW (layanandigital.id -> https://www.layanandigital.id)
    if (host === "layanandigital.id") {
      const destination = `https://www.layanandigital.id${pathname}${search}`;
      return NextResponse.redirect(destination, 301);
    }

    // Redirect HTTP ke HTTPS (SSL Aman)
    if (proto === "http") {
      const canonicalHost = host.startsWith("www.") ? host : `www.${host}`;
      const destination = `https://${canonicalHost}${pathname}${search}`;
      return NextResponse.redirect(destination, 301);
    }

    // Domain Alias Pengalihan (ladi.id / ladi.digital -> www.layanandigital.id)
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

  // 7. Proteksi Rute Admin (/admin)
  if (pathname.startsWith("/admin")) {
    // Tangani jika ada request POST ke halaman login
    if (pathname === "/admin/login" || pathname === "/admin/login/") {
      if (request.method === "POST") {
        return NextResponse.redirect(new URL("/admin/login?reason=logout", request.url), 303);
      }
      return applySecurityHeaders(NextResponse.next());
    }

    const token = request.cookies.get("ladi_admin_token")?.value;

    // Jika belum login di production, arahkan ke login
    if (!token || !token.trim()) {
      if (isLocalhost || process.env.NODE_ENV !== "production") {
        return applySecurityHeaders(NextResponse.next());
      }
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      loginUrl.searchParams.set("reason", "unauthorized");
      return NextResponse.redirect(loginUrl, 303);
    }
  }

  return applySecurityHeaders(NextResponse.next());
}

export const config = {
  matcher: [
    /*
     * Match semua halaman web untuk evaluasi redirect canonical, SSL & security headers,
     * KECUALI file statis internal Next.js dan file gambar/ikon.
     */
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|uploads/|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
