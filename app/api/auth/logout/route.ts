import { NextRequest, NextResponse } from "next/server";

function clearAuthCookie(response: NextResponse) {
  response.cookies.set("ladi_admin_token", "", {
    path: "/",
    maxAge: 0,
    expires: new Date(0),
    httpOnly: true,
    sameSite: "lax",
  });
  response.cookies.delete("ladi_admin_token");
  return response;
}

export async function GET(request: NextRequest) {
  const loginUrl = new URL("/admin/login?reason=logout", request.url);
  const response = NextResponse.redirect(loginUrl, 303);
  return clearAuthCookie(response);
}

export async function POST(request: NextRequest) {
  const isForm =
    request.headers.get("content-type")?.includes("application/x-www-form-urlencoded") ||
    request.headers.get("sec-fetch-mode") === "navigate";

  if (isForm) {
    const loginUrl = new URL("/admin/login?reason=logout", request.url);
    const response = NextResponse.redirect(loginUrl, 303);
    return clearAuthCookie(response);
  }

  const response = NextResponse.json({ success: true, message: "Logout berhasil" });
  return clearAuthCookie(response);
}
