import { NextRequest, NextResponse } from "next/server";
import {
  getWorkTimerLogs,
  getActiveTimers,
  startWorkTimer,
  stopWorkTimer,
  deleteWorkTimerLog,
} from "@/app/lib/kanban";
import { verifyToken } from "@/app/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("ladi_admin_token")?.value;
    const user = token ? verifyToken(token) : null;

    if (!user && process.env.NODE_ENV === "production") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const limit = Number(searchParams.get("limit")) || 100;

    const [logs, activeTimers] = await Promise.all([
      getWorkTimerLogs(limit),
      getActiveTimers(),
    ]);

    // Current user's active timer (if any)
    const currentActive = activeTimers.find(
      (t) => t.user_name.toLowerCase() === (user?.username?.toLowerCase() || user?.name?.toLowerCase())
    ) || null;

    return NextResponse.json({
      success: true,
      logs,
      activeTimers,
      currentActive,
    });
  } catch (error: any) {
    console.error("API WorkTimer GET error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Gagal memuat log jam kerja." },
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
    const { task_id, task_title, user_name } = body;

    const targetUser = user_name || user?.name || user?.username || "Desainer";
    const targetRole = user?.role || "designer";

    const log = await startWorkTimer({
      user_name: targetUser,
      user_role: targetRole,
      task_id: task_id ? Number(task_id) : null,
      task_title: task_title || "",
    });

    return NextResponse.json({
      success: true,
      message: "Timer jam kerja dimulai.",
      log,
    });
  } catch (error: any) {
    console.error("API WorkTimer POST error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Gagal memulai timer." },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const token = req.cookies.get("ladi_admin_token")?.value;
    const user = token ? verifyToken(token) : null;

    if (!user && process.env.NODE_ENV === "production") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { id, notes } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "ID timer wajib diberikan." },
        { status: 400 }
      );
    }

    const stopped = await stopWorkTimer(id, notes || "");

    return NextResponse.json({
      success: true,
      message: "Timer jam kerja selesai dicatat.",
      log: stopped,
    });
  } catch (error: any) {
    console.error("API WorkTimer PATCH error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Gagal menghentikan timer." },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const token = req.cookies.get("ladi_admin_token")?.value;
    const user = token ? verifyToken(token) : null;

    if (!user && process.env.NODE_ENV === "production") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    if (user && user.role !== "superadmin") {
      return NextResponse.json(
        { success: false, error: "Hanya Super Admin yang dapat menghapus log jam kerja." },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "ID timer wajib diberikan." },
        { status: 400 }
      );
    }

    const deleted = await deleteWorkTimerLog(id);

    return NextResponse.json({
      success: true,
      message: deleted ? "Log jam kerja berhasil dihapus." : "Log tidak ditemukan.",
    });
  } catch (error: any) {
    console.error("API WorkTimer DELETE error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Gagal menghapus log timer." },
      { status: 500 }
    );
  }
}
