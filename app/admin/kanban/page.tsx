import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { verifyToken } from "@/app/lib/auth";
import { getKanbanCards, getWorkTimerLogs, getActiveTimers } from "@/app/lib/kanban";
import KanbanBoardClient from "./KanbanBoardClient";
import LadiLogo from "@/app/components/LadiLogo";

export const dynamic = "force-dynamic";

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

  // Permintaan user:
  // "Nanti hanya saya dulu aja (super admin) yang bisa melakukan semua hal termasuk melihat kanban."
  if (user.role !== "superadmin") {
    return (
      <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-md w-full p-8 rounded-2xl bg-[#0f172a] border border-slate-800 shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-3xl mx-auto mb-4">
            🔒
          </div>
          <h1 className="text-xl font-bold text-white mb-2">
            Akses Terbatas: Super Admin Only
          </h1>
          <p className="text-sm text-slate-400 mb-6 leading-relaxed">
            Papan Kanban Desain & Pelacak Jam Kerja saat ini hanya dibuka untuk <strong className="text-amber-300">Super Admin</strong>. Silakan hubungi Super Admin untuk akses atau pembagian tugas.
          </p>
          <div className="flex flex-col gap-2">
            <Link
              href="/admin"
              className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs transition shadow-lg shadow-blue-500/20"
            >
              ← Kembali ke Dashboard Utama
            </Link>
          </div>
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
