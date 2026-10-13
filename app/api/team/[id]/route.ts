import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getTeamMemberById, updateTeamMember, deleteTeamMember } from "@/app/lib/storage";
import { verifyAdmin } from "@/app/lib/auth";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const member = await getTeamMemberById(id);
    if (!member) {
      return NextResponse.json({ success: false, message: "Anggota tim tidak ditemukan" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: member });
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
      { success: false, message: "Akses ditolak. Fitur ini khusus Super Administrator." },
      { status: 401 }
    );
  }

  try {
    const { id } = await params;
    const body = await request.json();
    const updated = await updateTeamMember(id, body);
    if (!updated) {
      return NextResponse.json({ success: false, message: "Anggota tim tidak ditemukan" }, { status: 404 });
    }

    // Revalidate halaman beranda seketika
    revalidatePath("/", "layout");
    revalidatePath("/admin");
    revalidatePath("/admin/team");

    return NextResponse.json({
      success: true,
      message: "Data anggota tim berhasil diperbarui",
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
      { success: false, message: "Akses ditolak. Fitur ini khusus Super Administrator." },
      { status: 401 }
    );
  }

  try {
    const { id } = await params;
    const deleted = await deleteTeamMember(id);
    if (!deleted) {
      return NextResponse.json({ success: false, message: "Anggota tim tidak ditemukan atau sudah terhapus" }, { status: 404 });
    }

    // Revalidate halaman beranda seketika
    revalidatePath("/", "layout");
    revalidatePath("/admin");
    revalidatePath("/admin/team");

    return NextResponse.json({ success: true, message: "Anggota tim berhasil dihapus" });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
