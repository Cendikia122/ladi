import { NextRequest, NextResponse } from "next/server";
import { validateCredentials, createSessionToken } from "@/app/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();
    if (!username || !password) {
      return NextResponse.json({ success: false, message: "Username dan password wajib diisi" }, { status: 400 });
    }

    if (!validateCredentials(username, password)) {
      return NextResponse.json({ success: false, message: "Username atau password salah" }, { status: 401 });
    }

    const token = createSessionToken(username);

    const response = NextResponse.json({
      success: true,
      message: "Login berhasil",
      token,
      user: { username },
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
