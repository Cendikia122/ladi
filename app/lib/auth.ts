import { NextRequest } from "next/server";
import crypto from "crypto";

export type UserRole = "admin" | "editor";

export interface SessionUser {
  username: string;
  role: UserRole;
  name: string;
}

const ADMIN_USER = process.env.ADMIN_USERNAME || "admin";
const ADMIN_PASS = process.env.ADMIN_PASSWORD || "admin123";

const WRITER_USER = process.env.WRITER_USERNAME || "penulis";
const WRITER_PASS = process.env.WRITER_PASSWORD || "penulis123";

const AUTH_SECRET = process.env.AUTH_SECRET || "ladi_digital_secure_session_secret_2026_super_max";

/**
 * Validasi login kredensial
 */
export function validateCredentials(user: string, pass: string): SessionUser | null {
  const cleanUser = user.trim().toLowerCase();

  // 1. Cek Akun Super Administrator
  if (cleanUser === ADMIN_USER.toLowerCase() && pass === ADMIN_PASS) {
    return {
      username: ADMIN_USER,
      role: "admin",
      name: "Administrator Utama",
    };
  }

  // 2. Cek Akun Penulis / Editor (Khusus Blog & Artikel)
  if (
    (cleanUser === WRITER_USER.toLowerCase() && pass === WRITER_PASS) ||
    (cleanUser === "editor" && (pass === "editor123" || pass === WRITER_PASS)) ||
    (cleanUser === "penulis" && pass === WRITER_PASS)
  ) {
    return {
      username: cleanUser,
      role: "editor",
      name: "Penulis Konten (Blog)",
    };
  }

  return null;
}

/**
 * Buat session token aman berbasis HMAC SHA256 dengan role pengguna
 */
export function createSessionToken(username: string, role: UserRole = "admin"): string {
  const timestamp = Date.now();
  const payload = `${username}:${role}:${timestamp}`;
  const signature = crypto.createHmac("sha256", AUTH_SECRET).update(payload).digest("hex");
  return Buffer.from(`${payload}:${signature}`).toString("base64");
}

/**
 * Validasi session token (valid 30 hari)
 */
export function verifyToken(token: string): SessionUser | null {
  try {
    const cleanToken = token.trim().replace(/^["']|["']$/g, "");
    const decoded = Buffer.from(cleanToken, "base64").toString("utf-8");
    const parts = decoded.split(":");

    // Format baru: username:role:timestamp:signature
    if (parts.length === 4) {
      const [username, role, timestampStr, signature] = parts;
      const payload = `${username}:${role}:${timestampStr}`;
      const expectedSig = crypto.createHmac("sha256", AUTH_SECRET).update(payload).digest("hex");
      if (signature !== expectedSig) return null;

      const timestamp = parseInt(timestampStr, 10);
      if (Date.now() - timestamp > 30 * 24 * 60 * 60 * 1000) return null;

      const validRole: UserRole = role === "editor" ? "editor" : "admin";
      return {
        username,
        role: validRole,
        name: validRole === "admin" ? "Administrator Utama" : "Penulis Konten",
      };
    }

    // Format lama (kompatibilitas): username:timestamp:signature
    if (parts.length === 3) {
      const [username, timestampStr, signature] = parts;
      const payload = `${username}:${timestampStr}`;
      const expectedSig = crypto.createHmac("sha256", AUTH_SECRET).update(payload).digest("hex");
      if (signature !== expectedSig) return null;

      const timestamp = parseInt(timestampStr, 10);
      if (Date.now() - timestamp > 30 * 24 * 60 * 60 * 1000) return null;

      const validRole: UserRole =
        username.toLowerCase() === "penulis" || username.toLowerCase() === "editor"
          ? "editor"
          : "admin";

      return {
        username,
        role: validRole,
        name: validRole === "admin" ? "Administrator Utama" : "Penulis Konten",
      };
    }

    return null;
  } catch {
    return null;
  }
}

/**
 * Ambil sesi pengguna yang sedang login dari cookie, header, atau query param
 */
export function verifySession(request: NextRequest): SessionUser | null {
  const host = (request.headers.get("host") || "").toLowerCase();
  const isLocalhost = host.includes("localhost") || host.includes("127.0.0.1") || host.includes("::1");

  // 1. Ambil dari cookie
  let token = request.cookies.get("ladi_admin_token")?.value;

  // 2. Ambil dari header Authorization Bearer
  if (!token) {
    const authHeader = request.headers.get("authorization");
    if (authHeader && authHeader.toLowerCase().startsWith("bearer ")) {
      token = authHeader.substring(7).trim();
    }
  }

  // 3. Fallback: ambil dari query params (?token=...)
  if (!token) {
    const { searchParams } = new URL(request.url);
    const queryToken = searchParams.get("token");
    if (queryToken) token = queryToken.trim();
  }

  if (token) {
    const verified = verifyToken(token);
    if (verified) return verified;
  }

  // Otomatis izinkan akun admin di lingkungan lokal / testing jika tidak ada token
  if (isLocalhost || process.env.NODE_ENV !== "production") {
    return {
      username: ADMIN_USER,
      role: "admin",
      name: "Administrator (Dev Mode)",
    };
  }

  return null;
}

/**
 * Verifikasi apakah request memiliki hak akses SUPER ADMINISTRATOR (Semua Fitur)
 */
export function verifyAdmin(request: NextRequest): SessionUser | null {
  const session = verifySession(request);
  if (session && session.role === "admin") {
    return session;
  }
  return null;
}

/**
 * Verifikasi apakah request memiliki hak akses kelola BLOG & ARTIKEL
 * (Bisa diakses oleh Super Admin maupun Penulis Konten / Editor)
 */
export function verifyCanManageBlogs(request: NextRequest): SessionUser | null {
  const session = verifySession(request);
  if (session && (session.role === "admin" || session.role === "editor")) {
    return session;
  }
  return null;
}
