import { NextRequest, NextResponse } from "next/server";
import { validateCredentials, createSessionToken } from "@/app/lib/auth";
import { checkLockout, recordFailedAttempt, clearLockout } from "@/app/lib/lockout";

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();
    if (!username || !password) {
      return NextResponse.json(
        { success: false, message: "Username dan password wajib diisi" },
        { status: 400 }
      );
    }

    const cleanUser = String(username).trim().toLowerCase();
    const clientIp =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "";

    // 1. Cek apakah akun sedang terblokir (3x gagal coba)
    const lockout = await checkLockout(cleanUser);
    if (lockout.isLocked) {
      return NextResponse.json(
        {
          success: false,
          locked: true,
          remainingHours: lockout.remainingHours,
          remainingDays: lockout.remainingDays,
          message: `Akun "${cleanUser}" sedang TERBLOKIR selama 3 hari karena 3 kali percobaan gagal berturut-turut. Blokir otomatis terbuka dalam ${lockout.remainingHours} jam lagi, atau silakan hubungi Super Administrator untuk mereset blokir.`,
        },
        { status: 423 }
      );
    }

    // 2. Validasi kredensial login
    const user = await validateCredentials(username, password);
    if (!user) {
      const failStatus = await recordFailedAttempt(cleanUser, clientIp);
      if (failStatus.isLocked) {
        return NextResponse.json(
          {
            success: false,
            locked: true,
            remainingAttempts: 0,
            remainingHours: failStatus.remainingHours,
            remainingDays: failStatus.remainingDays,
            message: `Akun "${cleanUser}" otomatis TERBLOKIR selama 3 hari karena 3 kali percobaan gagal berturut-turut. Hubungi Super Administrator untuk membuka blokir.`,
          },
          { status: 423 }
        );
      }

      return NextResponse.json(
        {
          success: false,
          locked: false,
          remainingAttempts: failStatus.remainingAttempts,
          message: `Username atau password salah. Peringatan: Sisa kesempatan mencoba ${failStatus.remainingAttempts} kali sebelum akun terblokir selama 3 hari.`,
        },
        { status: 401 }
      );
    }

    // 3. Login sukses: bersihkan catatan gagal coba
    await clearLockout(cleanUser);

    const token = createSessionToken(user.username, user.role);

    const response = NextResponse.json({
      success: true,
      message: `Login berhasil sebagai ${user.name}`,
      token,
      user: {
        username: user.username,
        role: user.role,
        name: user.name,
      },
    });

    const host = request.headers.get("host") || "";
    const isLocalhost = host.includes("localhost") || host.includes("127.0.0.1");

    response.cookies.set("ladi_admin_token", token, {
      httpOnly: false,
      secure: !isLocalhost && process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
