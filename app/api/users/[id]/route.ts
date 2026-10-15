import { NextRequest, NextResponse } from "next/server";
import { verifySuperAdmin } from "@/app/lib/auth";
import { updateAdminUser, deleteAdminUser, getAdminUserById } from "@/app/lib/users";
import { clearLockout } from "@/app/lib/lockout";

export const dynamic = "force-dynamic";

/**
 * PUT: Perbarui akun admin (Gonta-ganti Username, Nama, Role, Status, dan Password)
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const superAdmin = verifySuperAdmin(request);
  if (!superAdmin) {
    return NextResponse.json(
      { success: false, message: "Akses ditolak: Hanya Super Administrator yang berhak mengubah akun admin!" },
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
    const { username, name, role, status, password } = body;

    const updated = await updateAdminUser(numericId, {
      username,
      name,
      role,
      status,
      password,
    });

    // Jika username berubah, bersihkan catatan lockout di username lama
    if (username && username.trim().toLowerCase() !== existing.username.toLowerCase()) {
      await clearLockout(existing.username);
    }

    return NextResponse.json({
      success: true,
      message: `Data admin "${updated.username}" berhasil diperbarui!`,
      user: updated,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Gagal memperbarui admin" },
      { status: 400 }
    );
  }
}

/**
 * DELETE: Hapus akun admin (dengan proteksi akun sendiri & superadmin terakhir)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const superAdmin = verifySuperAdmin(request);
  if (!superAdmin) {
    return NextResponse.json(
      { success: false, message: "Akses ditolak: Hanya Super Administrator yang berhak menghapus akun admin!" },
      { status: 403 }
    );
  }

  try {
    const { id } = await params;
    const numericId = parseInt(id, 10);
    if (isNaN(numericId)) {
      return NextResponse.json({ success: false, message: "ID admin tidak valid" }, { status: 400 });
    }

    await deleteAdminUser(numericId, superAdmin.username);

    return NextResponse.json({
      success: true,
      message: "Akun admin berhasil dihapus!",
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Gagal menghapus admin" },
      { status: 400 }
    );
  }
}
