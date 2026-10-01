import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getProjectById, updateProject, deleteProject } from "@/app/lib/storage";
import { verifyAdmin } from "@/app/lib/auth";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const project = await getProjectById(id);
    if (!project) {
      return NextResponse.json({ success: false, message: "Proyek tidak ditemukan" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: project });
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
    return NextResponse.json({ success: false, message: "Akses ditolak" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await request.json();
    const updated = await updateProject(id, body);
    if (!updated) {
      return NextResponse.json({ success: false, message: "Proyek tidak ditemukan" }, { status: 404 });
    }

    revalidatePath("/", "layout");
    revalidatePath("/project");
    revalidatePath("/admin");
    revalidatePath("/admin/projects");

    return NextResponse.json({
      success: true,
      message: "Proyek portfolio berhasil diperbarui",
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
    return NextResponse.json({ success: false, message: "Akses ditolak" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const deleted = await deleteProject(id);
    if (!deleted) {
      return NextResponse.json(
        { success: false, message: "Proyek tidak ditemukan atau sudah terhapus" },
        { status: 404 }
      );
    }

    revalidatePath("/", "layout");
    revalidatePath("/project");
    revalidatePath("/admin");
    revalidatePath("/admin/projects");

    return NextResponse.json({ success: true, message: "Proyek berhasil dihapus" });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
