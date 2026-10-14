import { NextRequest, NextResponse } from "next/server";
import { getServicePackages, createServicePackage } from "@/app/lib/storage";
import { verifyAdmin } from "@/app/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const all = searchParams.get("all") === "true";
    const packages = await getServicePackages(all);
    return NextResponse.json({ success: true, data: packages });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const admin = verifyAdmin(request);
  if (!admin) {
    return NextResponse.json({ success: false, message: "Akses ditolak: Hanya Super Admin yang berhak mengelola paket produk." }, { status: 401 });
  }

  try {
    const body = await request.json();
    if (!body.name || !body.slug) {
      return NextResponse.json({ success: false, message: "Nama produk dan slug wajib diisi." }, { status: 400 });
    }

    const created = await createServicePackage(body);
    return NextResponse.json({ success: true, message: "Produk/Paket berhasil ditambahkan.", data: created });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
