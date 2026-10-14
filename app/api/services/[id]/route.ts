import { NextRequest, NextResponse } from "next/server";
import {
  getServicePackageById,
  getServicePackageBySlug,
  updateServicePackage,
  deleteServicePackage,
} from "@/app/lib/storage";
import { verifyAdmin } from "@/app/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    let pkg = await getServicePackageById(id);
    if (!pkg) {
      pkg = await getServicePackageBySlug(id);
    }

    if (!pkg) {
      return NextResponse.json({ success: false, message: "Produk/Paket tidak ditemukan." }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: pkg });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = verifyAdmin(request);
  if (!admin) {
    return NextResponse.json({ success: false, message: "Akses ditolak: Hanya Super Admin yang berhak menyunting paket produk." }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await request.json();
    const updated = await updateServicePackage(id, body);

    if (!updated) {
      return NextResponse.json({ success: false, message: "Paket tidak ditemukan atau gagal diperbarui." }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Paket berhasil diperbarui.", data: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = verifyAdmin(request);
  if (!admin) {
    return NextResponse.json({ success: false, message: "Akses ditolak: Hanya Super Admin yang berhak menghapus paket produk." }, { status: 401 });
  }

  try {
    const { id } = await params;
    const deleted = await deleteServicePackage(id);

    if (!deleted) {
      return NextResponse.json({ success: false, message: "Gagal menghapus paket atau paket tidak ditemukan." }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Paket berhasil dihapus secara permanen." });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
