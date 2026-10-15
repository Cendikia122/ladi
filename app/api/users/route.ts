import { NextRequest, NextResponse } from "next/server";
import { verifySuperAdmin } from "@/app/lib/auth";
import { getAdminUsers, createAdminUser, SafeAdminUser } from "@/app/lib/users";
import { checkLockout } from "@/app/lib/lockout";

export const dynamic = "force-dynamic";

/**
 * GET: Ambil daftar seluruh akun admin beserta status lockout (Khusus Super Admin)
 */
export async function GET(request: NextRequest) {
  const superAdmin = verifySuperAdmin(request);
  if (!superAdmin) {
    return NextResponse.json(
      { success: false, message: "Akses ditolak: Hanya Super Administrator yang berhak mengakses kelola admin!" },
      { status: 403 }
    );
  }

  try {
    const users = (await getAdminUsers(false)) as SafeAdminUser[];

    // Lengkapi dengan status lockout (blokir keamanan brute force) untuk setiap user
    const usersWithLockout = await Promise.all(
      users.map(async (u) => {
        const lockout = await checkLockout(u.username);
        return {
          ...u,
          isLocked: lockout.isLocked,
          failedAttempts: lockout.failedAttempts,
          remainingHours: lockout.remainingHours,
        };
      })
    );

    return NextResponse.json({
      success: true,
      users: usersWithLockout,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Gagal memuat daftar admin" },
      { status: 500 }
    );
  }
}

/**
 * POST: Tambah akun admin baru (Khusus Super Admin)
 */
export async function POST(request: NextRequest) {
  const superAdmin = verifySuperAdmin(request);
  if (!superAdmin) {
    return NextResponse.json(
      { success: false, message: "Akses ditolak: Hanya Super Administrator yang berhak menambah akun!" },
      { status: 403 }
    );
  }

  try {
    const body = await request.json();
    const { username, password, name, role, status } = body;

    if (!username || !password || !name) {
      return NextResponse.json(
        { success: false, message: "Username, password, dan nama wajib diisi!" },
        { status: 400 }
      );
    }

    const newUser = await createAdminUser({
      username,
      password,
      name,
      role: role || "admin",
      status: status || "active",
    });

    return NextResponse.json({
      success: true,
      message: `Akun admin "${newUser.username}" berhasil dibuat!`,
      user: newUser,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Gagal membuat akun admin" },
      { status: 400 }
    );
  }
}
