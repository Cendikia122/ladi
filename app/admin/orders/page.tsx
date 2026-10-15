import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { verifyToken } from "@/app/lib/auth";
import { getOrders } from "@/app/lib/storage";
import LadiLogo from "@/app/components/LadiLogo";
import AdminLogoutButton from "@/app/components/AdminLogoutButton";
import AdminOrdersClient from "./AdminOrdersClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Kelola Pesanan Masuk (Orders) — Admin Ladi",
};

export default async function AdminOrdersPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("ladi_admin_token")?.value;
  const user = token
    ? verifyToken(token)
    : process.env.NODE_ENV !== "production"
    ? { username: "admin", role: "admin" as const, name: "Administrator" }
    : null;

  if (!user) {
    redirect("/admin/login?reason=unauthorized");
  }

  const initialOrders = await getOrders();

  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#0f172a]">
      {/* Top Header */}
      <header className="bg-[#0f172a] text-white border-b border-slate-800 py-4 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <LadiLogo inverted={true} />
            <span className="hidden sm:inline-block font-mono text-xs px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-300 border border-blue-500/30">
              Orders Management
            </span>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/admin"
              className="text-xs text-slate-300 hover:text-white transition-colors"
            >
              ← Kembali ke Dashboard
            </Link>
            <div className="h-4 w-px bg-slate-700 hidden sm:block"></div>
            <div className="text-right hidden sm:block">
              <div className="text-xs font-bold text-white">{user.name}</div>
              <div className="text-[10px] text-slate-400 font-mono capitalize">
                {user.role}
              </div>
            </div>
            <AdminLogoutButton />
          </div>
        </div>
      </header>

      {/* Main Admin Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-8 sm:py-10 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
              <Link href="/admin" className="hover:text-slate-800">Admin</Link>
              <span>/</span>
              <span className="text-slate-800 font-semibold">Pesanan Masuk</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Manajemen Pesanan Masuk (Orders)
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Kelola status pembayaran, pantau bukti transfer, dan perbarui progres pengerjaan proyek klien secara mandiri.
            </p>
          </div>
        </div>

        <AdminOrdersClient initialOrders={initialOrders} />
      </main>
    </div>
  );
}
