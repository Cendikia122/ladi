import { NextRequest, NextResponse } from "next/server";
import { getEvents, createEvent } from "@/app/lib/storage";
import { verifyAdmin } from "@/app/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get("limit") ? parseInt(searchParams.get("limit")!, 10) : undefined;
    const all = searchParams.get("all") === "true";

    const data = await getEvents(limit, all);
    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const admin = verifyAdmin(request);
  if (!admin) {
    return NextResponse.json({ success: false, message: "Akses ditolak. Silakan login terlebih dahulu." }, { status: 401 });
  }

  try {
    const body = await request.json();
    if (!body.title || !body.title.trim()) {
      return NextResponse.json({ success: false, message: "Judul event wajib diisi" }, { status: 400 });
    }

    const created = await createEvent(body);
    return NextResponse.json({ success: true, message: "Event berhasil ditambahkan", data: created });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
