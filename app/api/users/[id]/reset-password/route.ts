import { NextRequest, NextResponse } from "next/server";
import { verifySuperAdmin } from "@/app/lib/auth";
import { resetAdminPassword, getAdminUserById } from "@/app/lib/users";
import { clearLockout } from "@/app/lib/lockout";

export const dynamic = "force-dynamic";

/**
 * POST: Reset / ganti password admin bawahan langsung oleh Super Admin
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const superAdmin = verifySuperAdmin(request);
  if (!superAdmin) {
    return NextResponse.json(
      { success: false, message: "Akses ditolak: Hanya Super Administrator yang berhak mereset password admin!" },
      { status: 403 }
    );
  }

  try {
    const { id } = await params;
    const numericId = parseInt(id, 10);
    if (isNaN(numericId)) {
      return NextResponse.json({ success: false, message: "ID admin tidak valid" }, { status: 400 });
    }

    const existing = await getAdminUserById(numericId, false);
    if (!existing) {
      return NextResponse.json({ success: false, message: "Akun admin tidak ditemukan" }, { status: 404 });
    }

    const body = await request.json();
    const { password } = body;

    if (!password || password.trim().length < 6) {
      return NextResponse.json(
        { success: false, message: "Password baru minimal 6 karakter!" },
        { status: 400 }
      );
    }

    await resetAdminPassword(numericId, password.trim());

    // Otomatis buka blokir brute-force jika akun sedang terkunci
    await clearLockout(existing.username);

    return NextResponse.json({
      success: true,
      message: `Password untuk akun "${existing.username}" (${existing.name}) berhasil diperbarui!`,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Gagal mereset password" },
      { status: 400 }
    );
  }
}
