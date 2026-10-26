import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { verifyToken } from "@/app/lib/auth";
import { getKanbanCards, getWorkTimerLogs, getActiveTimers } from "@/app/lib/kanban";
import KanbanBoardClient from "./KanbanBoardClient";
import LadiLogo from "@/app/components/LadiLogo";

export const dynamic = "force-dynamic";

// Ladi Workspace Notion-Style Kanban & Work Tracker v1.1.0

export const metadata = {
  title: "Kanban Desain & Jam Kerja — Ladi",
  description: "Manajemen proyek desain Notion-style, Canva live embed, dan pelacak jam kerja desainer.",
};

export default async function KanbanAdminPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("ladi_admin_token")?.value;
  const user = token
    ? verifyToken(token)
    : process.env.NODE_ENV !== "production"
    ? { username: "bob", role: "superadmin" as const, name: "bob" }
    : null;

  if (!user) {
    redirect("/admin/login?reason=unauthorized");
  }

  // Izinkan Super Admin, Desainer, dan Admin mengakses papan Kanban
  if (user.role !== "superadmin" && user.role !== "designer" && user.role !== "admin") {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-md w-full p-8 rounded-xl bg-white border border-slate-200 shadow-sm">
          <h1 className="text-base font-semibold text-slate-900 mb-2">
            Akses Terbatas: Khusus Super Admin
          </h1>
          <p className="text-xs text-slate-500 mb-6 leading-relaxed">
            Papan Kanban Desain dan Jam Kerja saat ini hanya dibuka untuk Super Admin. Silakan hubungi Super Admin untuk penugasan.
          </p>
          <Link
            href="/admin"
            className="inline-block py-2 px-4 rounded-md bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs transition"
          >
            Kembali ke Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const [cards, timerLogs, activeTimers] = await Promise.all([
    getKanbanCards(),
    getWorkTimerLogs(100),
    getActiveTimers(),
  ]);

  return (
    <KanbanBoardClient
      initialCards={cards}
      initialTimerLogs={timerLogs}
      initialActiveTimers={activeTimers}
      currentUser={{
        username: user.username,
        role: user.role,
        name: user.name || user.username,
      }}
    />
  );
}
