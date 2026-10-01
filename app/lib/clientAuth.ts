"use client";

/**
 * Client-side Authentication Helpers for Ladi Admin
 */

export function getClientToken(): string | null {
  if (typeof window === "undefined") return null;

  // 1. Cek localStorage
  const localToken = localStorage.getItem("ladi_admin_token");
  if (localToken && localToken.trim()) return localToken.trim();

  // 2. Cek document.cookie
  const match = document.cookie.match(/(^|;)\s*ladi_admin_token=([^;]+)/);
  if (match && match[2]) {
    return decodeURIComponent(match[2]).trim().replace(/^["']|["']$/g, "");
  }

  return null;
}

export function setClientToken(token: string) {
  if (typeof window === "undefined") return;
  const clean = token.trim().replace(/^["']|["']$/g, "");
  localStorage.setItem("ladi_admin_token", clean);
  document.cookie = `ladi_admin_token=${clean}; path=/; max-age=604800; SameSite=Lax`;
}

export function clearClientToken() {
  if (typeof window === "undefined") return;
  localStorage.removeItem("ladi_admin_token");
  document.cookie = "ladi_admin_token=; path=/; max-age=0; SameSite=Lax";
}

/**
 * Fetch wrapper yang otomatis menyertakan kredensial & header Authorization Bearer
 */
export async function authFetch(url: string, options: RequestInit = {}): Promise<Response> {
  const token = getClientToken();
  const headers = new Headers(options.headers || {});

  if (token && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const mergedOptions: RequestInit = {
    ...options,
    credentials: "include",
    headers,
  };

  const response = await fetch(url, mergedOptions);

  // Jika token kadaluarsa / 401 saat berada di halaman admin, beri opsi redirect
  if (response.status === 401 && typeof window !== "undefined") {
    if (!window.location.pathname.includes("/admin/login")) {
      console.warn("Sesi admin tidak valid atau berakhir (401).");
    }
  }

  return response;
}
