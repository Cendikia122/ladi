import { NextRequest, NextResponse } from "next/server";
import {
  getTemplateById,
  updateTemplate,
  deleteTemplate,
} from "@/app/lib/storage";
import { verifyAdmin } from "@/app/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const template = await getTemplateById(id);

    if (!template) {
      return NextResponse.json(
        { success: false, message: "Template tidak ditemukan." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: template });
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
    return NextResponse.json(
      { success: false, message: "Akses ditolak: Hanya Administrator yang berhak menyunting template." },
      { status: 401 }
    );
  }

  try {
    const { id } = await params;
    const body = await request.json();
    const updated = await updateTemplate(id, body);

    if (!updated) {
      return NextResponse.json(
        { success: false, message: "Template tidak ditemukan atau gagal diperbarui." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Template berhasil diperbarui.",
      data: updated,
    });
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
    return NextResponse.json(
      { success: false, message: "Akses ditolak: Hanya Administrator yang berhak menghapus template." },
      { status: 401 }
    );
  }

  try {
    const { id } = await params;
    const deleted = await deleteTemplate(id);

    if (!deleted) {
      return NextResponse.json(
        { success: false, message: "Gagal menghapus template atau template tidak ditemukan." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: "Template berhasil dihapus." });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
