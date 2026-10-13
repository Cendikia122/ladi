import { NextRequest, NextResponse } from "next/server";
import { verifySession } from "@/app/lib/auth";

export async function GET(request: NextRequest) {
  const user = verifySession(request);
  if (!user) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
  return NextResponse.json({ authenticated: true, user });
}
