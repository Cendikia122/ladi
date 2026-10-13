import { NextRequest, NextResponse } from "next/server";
import { verifyAdmin } from "@/app/lib/auth";
import { clearLockout, getAllLockouts } from "@/app/lib/lockout";

// GET: Ambil daftar akun yang terblokir atau memiliki riwayat gagal coba
export async function GET(request: NextRequest) {
  const admin = verifyAdmin(request);
  if (!admin) {
    return NextResponse.json({ success: false, message: "Akses ditolak" }, { status: 401 });
  }

  const lockouts = await getAllLockouts();
  return NextResponse.json({ success: true, data: lockouts });
}

// POST: Buka blokir akun (Reset ke 0 percobaan gagal)
export async function POST(request: NextRequest) {
  const admin = verifyAdmin(request);

  // Cek otorisasi: harus Super Admin atau master secret darurat
  const { searchParams } = new URL(request.url);
  const emergencySecret = searchParams.get("secret");
  const validSecret = process.env.AUTH_SECRET || "ladi_digital_secure_session_secret_2026_super_max";

  if (!admin && emergencySecret !== validSecret) {
    return NextResponse.json(
      { success: false, message: "Hanya Super Administrator yang berhak membuka blokir akun." },
      { status: 403 }
    );
  }

  try {
    const { username } = await request.json();
    if (!username) {
      return NextResponse.json(
        { success: false, message: "Username yang akan dibuka blokirnya wajib diisi." },
        { status: 400 }
      );
    }

    await clearLockout(username);
    return NextResponse.json({
      success: true,
      message: `Blokir akun "${username}" berhasil dibuka. Akun sekarang dapat digunakan untuk login kembali.`,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
