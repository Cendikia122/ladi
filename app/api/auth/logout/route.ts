import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const isForm = request.headers.get("content-type")?.includes("application/x-www-form-urlencoded") ||
                 request.headers.get("sec-fetch-mode") === "navigate";

  const response = isForm
    ? NextResponse.redirect(new URL("/admin/login", request.url))
    : NextResponse.json({ success: true, message: "Logout berhasil" });

  response.cookies.delete("ladi_admin_token");
  return response;
}
