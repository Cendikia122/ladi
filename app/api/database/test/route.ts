import { NextRequest, NextResponse } from "next/server";
import mysql from "mysql2/promise";
import { verifyAdmin } from "@/app/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const admin = verifyAdmin(request);
  if (!admin) {
    return NextResponse.json({ success: false, message: "Akses ditolak" }, { status: 401 });
  }

  try {
    const body = await request.json().catch(() => ({}));
    const host = body.host || process.env.DB_HOST || "srv1762.hstgr.io";
    const user = body.user || process.env.DB_USER || "u941811514_admin";
    const password = body.password !== undefined ? body.password : (process.env.DB_PASSWORD || "");
    const database = body.database || process.env.DB_NAME || "u941811514_faselin";
    const port = body.port ? parseInt(body.port, 10) : (process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306);
    const ssl = body.ssl ?? (process.env.DB_SSL === "true");

    const conn = await mysql.createConnection({
      host,
      user,
      password,
      database,
      port,
      connectTimeout: 5000,
      ssl: ssl ? { rejectUnauthorized: false } : undefined,
    });

    await conn.query("SELECT 1");
    await conn.end();

    return NextResponse.json({
      success: true,
      message: `Koneksi ke MySQL (${host} / ${database}) berhasil terhubung dengan sempurna!`,
    });
  } catch (error: any) {
    let helpMsg = "";
    if (error.code === "ER_ACCESS_DENIED_ERROR") {
      helpMsg = "Password atau Username MySQL salah. Silakan periksa kembali password database di hPanel Hostinger.";
    } else if (error.code === "ENOTFOUND" || error.code === "ETIMEDOUT" || error.code === "ECONNREFUSED") {
      helpMsg = "Tidak dapat menjangkau server Hostinger. Pastikan fitur 'Remote MySQL' di hPanel Hostinger sudah diaktifkan dan memasukkan IP '%' (semua IP diperbolehkan).";
    }

    return NextResponse.json({
      success: false,
      message: `Gagal terhubung: ${error.message}`,
      code: error.code,
      help: helpMsg,
    }, { status: 400 });
  }
}
