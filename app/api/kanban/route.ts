import { NextRequest, NextResponse } from "next/server";
import { getKanbanCards, createKanbanCard } from "@/app/lib/kanban";
import { verifyToken } from "@/app/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("ladi_admin_token")?.value;
    const user = token ? verifyToken(token) : null;

    if (!user && process.env.NODE_ENV === "production") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const cards = await getKanbanCards();
    return NextResponse.json({ success: true, cards });
  } catch (error: any) {
    console.error("API Kanban GET error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Gagal memuat kartu kanban." },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("ladi_admin_token")?.value;
    const user = token ? verifyToken(token) : null;

    if (!user && process.env.NODE_ENV === "production") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const {
      title,
      description,
      canva_url,
      status,
      origin,
      is_approved_by_admin,
      priority,
      platform,
      assignee_name,
      deadline,
      admin_notes,
    } = body;

    if (!title || !title.trim()) {
      return NextResponse.json(
        { success: false, error: "Judul kartu / proyek wajib diisi." },
        { status: 400 }
      );
    }

    // Tentukan sumber ide: jika user adalah superadmin, bisa set admin atau desainer; jika desainer, origin selalu 'designer'
    const cardOrigin = user?.role === "superadmin" ? (origin || "admin") : "designer";
    const approved = user?.role === "superadmin" ? (cardOrigin === "admin" ? true : Boolean(is_approved_by_admin)) : false;

    const card = await createKanbanCard({
      title: title.trim(),
      description: description || "",
      canva_url: canva_url || "",
      status: cardOrigin === "designer" && !approved ? "review_ide" : (status || "draft"),
      origin: cardOrigin,
      is_approved_by_admin: approved,
      priority: priority || "medium",
      platform: platform || "Instagram Feeds",
      assignee_name: assignee_name || (user?.name || "Tim Desainer"),
      deadline: deadline || "",
      admin_notes: admin_notes || "",
      created_by: user?.username || "admin",
    });

    return NextResponse.json({
      success: true,
      message: "Kartu proyek berhasil ditambahkan.",
      card,
    });
  } catch (error: any) {
    console.error("API Kanban POST error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Gagal membuat kartu kanban." },
      { status: 500 }
    );
  }
}
