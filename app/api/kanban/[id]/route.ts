import { NextRequest, NextResponse } from "next/server";
import { getKanbanCardById, updateKanbanCard, deleteKanbanCard } from "@/app/lib/kanban";
import { verifyToken } from "@/app/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const card = await getKanbanCardById(id);
    if (!card) {
      return NextResponse.json({ success: false, error: "Kartu tidak ditemukan." }, { status: 404 });
    }
    return NextResponse.json({ success: true, card });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = req.cookies.get("ladi_admin_token")?.value;
    const user = token ? verifyToken(token) : null;

    if (!user && process.env.NODE_ENV === "production") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const existing = await getKanbanCardById(id);
    if (!existing) {
      return NextResponse.json({ success: false, error: "Kartu tidak ditemukan." }, { status: 404 });
    }

    const body = await req.json();
    const isSuperAdmin = user?.role === "superadmin";

    // Validasi aturan bisnis khusus:
    // "Kalau pakai ide sendiri, belum bisa ditaruh di kanban sedang dikerjakan/proses. Harus menunggu acc saya baru bisa digerakkan kanbannya"
    if (
      body.status === "in_progress" &&
      existing.status === "review_ide" &&
      existing.origin === "designer" &&
      !existing.is_approved_by_admin
    ) {
      if (!isSuperAdmin) {
        return NextResponse.json(
          {
            success: false,
            error: "Ide ini berasal dari desainer dan harus disetujui (ACC) oleh Super Admin terlebih dahulu sebelum bisa diproses ke Sedang Dikerjakan.",
          },
          { status: 403 }
        );
      } else {
        // Jika Super Admin yang menggeser, otomatis ACC
        body.is_approved_by_admin = true;
      }
    }

    // Jika Super Admin menekan tombol ACC Ide
    if (body.action === "approve_idea") {
      if (!isSuperAdmin) {
        return NextResponse.json({ success: false, error: "Hanya Super Admin yang berhak menyetujui ide." }, { status: 403 });
      }
      body.is_approved_by_admin = true;
      body.status = "in_progress";
    }

    const updated = await updateKanbanCard(id, body);
    return NextResponse.json({
      success: true,
      message: "Kartu berhasil diperbarui.",
      card: updated,
    });
  } catch (error: any) {
    console.error("API Kanban PATCH error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Gagal memperbarui kartu." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = req.cookies.get("ladi_admin_token")?.value;
    const user = token ? verifyToken(token) : null;

    if (!user && process.env.NODE_ENV === "production") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const deleted = await deleteKanbanCard(id);

    return NextResponse.json({
      success: true,
      message: deleted ? "Kartu berhasil dihapus." : "Kartu tidak ditemukan.",
    });
  } catch (error: any) {
    console.error("API Kanban DELETE error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Gagal menghapus kartu." },
      { status: 500 }
    );
  }
}
