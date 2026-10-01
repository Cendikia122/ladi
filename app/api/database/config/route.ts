import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { verifyAdmin } from "@/app/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const admin = verifyAdmin(request);
  if (!admin) {
    return NextResponse.json({ success: false, message: "Akses ditolak" }, { status: 401 });
  }

  return NextResponse.json({
    success: true,
    config: {
      host: process.env.DB_HOST || "srv1762.hstgr.io",
      user: process.env.DB_USER || "u941811514_admin",
      database: process.env.DB_NAME || "u941811514_faselin",
      port: process.env.DB_PORT || "3306",
      hasPassword: Boolean(process.env.DB_PASSWORD && process.env.DB_PASSWORD.trim().length > 0),
    },
  });
}

export async function POST(request: NextRequest) {
  const admin = verifyAdmin(request);
  if (!admin) {
    return NextResponse.json({ success: false, message: "Akses ditolak" }, { status: 401 });
  }

  try {
    const { host, user, password, database, port } = await request.json();

    const envPath = path.join(process.cwd(), ".env.local");
    let currentEnv = "";
    if (fs.existsSync(envPath)) {
      currentEnv = fs.readFileSync(envPath, "utf-8");
    }

    const updates: Record<string, string> = {
      DB_HOST: host || "srv1762.hstgr.io",
      DB_USER: user || "u941811514_admin",
      DB_NAME: database || "u941811514_faselin",
      DB_PORT: port ? String(port) : "3306",
    };

    if (password !== undefined) {
      updates.DB_PASSWORD = password;
    }

    let newEnvLines = currentEnv ? currentEnv.split("\n") : [];
    for (const [key, val] of Object.entries(updates)) {
      process.env[key] = val; // Apply to current process immediately
      const lineIndex = newEnvLines.findIndex((l) => l.startsWith(`${key}=`));
      if (lineIndex !== -1) {
        newEnvLines[lineIndex] = `${key}=${val}`;
      } else {
        newEnvLines.push(`${key}=${val}`);
      }
    }

    fs.writeFileSync(envPath, newEnvLines.join("\n"), "utf-8");

    // Juga update .env jika ada
    const rootEnvPath = path.join(process.cwd(), ".env");
    if (fs.existsSync(rootEnvPath)) {
      let rootLines = fs.readFileSync(rootEnvPath, "utf-8").split("\n");
      for (const [key, val] of Object.entries(updates)) {
        const idx = rootLines.findIndex((l) => l.startsWith(`${key}=`));
        if (idx !== -1) {
          rootLines[idx] = `${key}=${val}`;
        } else {
          rootLines.push(`${key}=${val}`);
        }
      }
      fs.writeFileSync(rootEnvPath, rootLines.join("\n"), "utf-8");
    }

    return NextResponse.json({
      success: true,
      message: "Konfigurasi database berhasil disimpan.",
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      message: `Gagal menyimpan konfigurasi: ${error.message}`,
    }, { status: 500 });
  }
}
