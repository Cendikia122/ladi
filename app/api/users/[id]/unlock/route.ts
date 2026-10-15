import { NextRequest, NextResponse } from "next/server";
import { verifySuperAdmin } from "@/app/lib/auth";
import { getAdminUserById } from "@/app/lib/users";
import { clearLockout } from "@/app/lib/lockout";

export const dynamic = "force-dynamic";

/**
 * POST: Buka blokir login untuk akun admin tertentu (Khusus Super Admin)
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const superAdmin = verifySuperAdmin(request);
  if (!superAdmin) {
    return NextResponse.json(
      { success: false, message: "Akses ditolak: Hanya Super Administrator yang berhak membuka kunci akun!" },
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

    await clearLockout(existing.username);

    return NextResponse.json({
      success: true,
      message: `Kunci blokir untuk akun "${existing.username}" (${existing.name}) berhasil dibuka! Pengguna kini dapat login kembali.`,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Gagal membuka blokir akun" },
      { status: 400 }
    );
  }
}
