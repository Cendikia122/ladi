import { NextRequest } from "next/server";
import crypto from "crypto";

const ADMIN_USER = process.env.ADMIN_USERNAME || "admin";
const ADMIN_PASS = process.env.ADMIN_PASSWORD || "admin123";
const AUTH_SECRET = process.env.AUTH_SECRET || "ladi_digital_secure_session_secret_2026_super_max";

/**
 * Buat session token aman berbasis HMAC SHA256
 */
export function createSessionToken(username: string): string {
  const timestamp = Date.now();
  const payload = `${username}:${timestamp}`;
  const signature = crypto.createHmac("sha256", AUTH_SECRET).update(payload).digest("hex");
  return Buffer.from(`${payload}:${signature}`).toString("base64");
}

/**
 * Validasi session token (valid 30 hari)
 */
export function verifyToken(token: string): { username: string } | null {
  try {
    const cleanToken = token.trim().replace(/^["']|["']$/g, "");
    const decoded = Buffer.from(cleanToken, "base64").toString("utf-8");
    const [username, timestampStr, signature] = decoded.split(":");
    if (!username || !timestampStr || !signature) return null;

    const payload = `${username}:${timestampStr}`;
    const expectedSig = crypto.createHmac("sha256", AUTH_SECRET).update(payload).digest("hex");
    if (signature !== expectedSig) return null;

    // Token valid selama 30 hari
    const timestamp = parseInt(timestampStr, 10);
    const maxAge = 30 * 24 * 60 * 60 * 1000;
    if (Date.now() - timestamp > maxAge) return null;

    return { username };
  } catch {
    return null;
  }
}

/**
 * Verifikasi apakah request memiliki hak akses admin
 */
export function verifyAdmin(request: NextRequest): { username: string } | null {
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

  // 3. Fallback: ambil dari query params jika ada (?token=...)
  if (!token) {
    const { searchParams } = new URL(request.url);
    const queryToken = searchParams.get("token");
    if (queryToken) token = queryToken.trim();
  }

  if (token) {
    const verified = verifyToken(token);
    if (verified) return verified;
  }

  // Otomatis izinkan di lingkungan pengembangan / localhost agar pengujian CRUD tidak terhalang
  if (isLocalhost || process.env.NODE_ENV !== "production") {
    return { username: "admin" };
  }

  return null;
}

export function validateCredentials(user: string, pass: string): boolean {
  return user.trim().toLowerCase() === ADMIN_USER.toLowerCase() && pass === ADMIN_PASS;
}
