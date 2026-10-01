import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getBlogs, getEvents } from "@/app/lib/storage";
import { checkDbConnection } from "@/app/lib/mysql";
import { verifyToken } from "@/app/lib/auth";
import LadiLogo from "../components/LadiLogo";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Admin Dashboard — Ladi (Layanan Digital)",
};

export default async function AdminDashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("ladi_admin_token")?.value;
  const user = token ? verifyToken(token) : null;

  if (!user) {
    redirect("/admin/login?reason=unauthorized");
  }

  const [allBlogs, allEvents, dbStatus] = await Promise.all([
    getBlogs(5, true),
    getEvents(5, true),
    checkDbConnection(),
  ]);

  const publishedCount = allBlogs.filter((b) => b.status === "published").length;
  const activeEventsCount = allEvents.filter((e) => e.status === "active").length;

  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#0f172a]">
      {/* Top Header */}
      <header className="bg-[#0f172a] text-white border-b border-slate-800 py-4 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <LadiLogo inverted={true} />
            <span className="hidden sm:inline-block font-mono text-xs px-2.5 py-1 rounded-full bg-white/10 text-slate-300 border border-white/20">
              CMS & DATABASE DASHBOARD
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <Link
              href="/"
              target="_blank"
              className="text-slate-300 hover:text-white transition-colors"
            >
              Lihat Website ↗
            </Link>
            <form action="/api/auth/logout" method="POST">
              <button
                type="submit"
                className="px-4 py-2 rounded-full bg-red-600/80 hover:bg-red-600 text-white font-bold transition-all"
              >
                Keluar (Logout)
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* Main Admin Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-10 space-y-8">
        {/* Database Status Bar (Fasel / Hostinger Integration) */}
        <div className={`p-4 rounded-2xl border flex flex-col sm:flex-row items-center justify-between gap-3 text-xs ${
          dbStatus.connected
            ? "bg-emerald-50 border-emerald-200 text-emerald-900"
            : "bg-amber-50 border-amber-200 text-amber-900"
        }`}>
          <div className="flex items-center gap-2.5">
            <span className={`w-3 h-3 rounded-full shrink-0 ${
              dbStatus.connected ? "bg-emerald-500 animate-pulse" : "bg-amber-500"
            }`} />
            <div>
              <span className="font-bold">
                {dbStatus.connected ? "Database MySQL Hostinger Aktif" : "Mode Penyimpanan Cadangan (JSON File Mode)"}
              </span>
              <span className="hidden sm:inline ml-2 text-slate-600">
                — {dbStatus.message}
              </span>
            </div>
          </div>
          <div className="font-mono text-[11px] text-slate-500">
            Host: {dbStatus.host}
          </div>
        </div>

        {/* Action Header Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-8 rounded-3xl bg-white border border-slate-200 shadow-sm">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0f172a]">
              Pusat Manajemen Konten Ladi
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Kelola artikel wawasan, agenda event/workshop, dan pantau status sistem.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/admin/blogs/new"
              className="px-5 py-3 rounded-full bg-[#fa824b] hover:bg-[#e5723b] text-white font-bold text-xs uppercase tracking-wider shadow-md transition-all"
            >
              + Tulis Artikel
            </Link>
            <Link
              href="/admin/events/new"
              className="px-5 py-3 rounded-full bg-[#1853a7] hover:bg-[#0f3d7d] text-white font-bold text-xs uppercase tracking-wider shadow-md transition-all"
            >
              + Tambah Event
            </Link>
          </div>
        </div>

        {/* 4 Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-2">
            <span className="text-xs font-mono text-slate-500 font-bold uppercase">ARTIKEL TAYANG</span>
            <div className="text-3xl font-extrabold text-[#1853a7]">{publishedCount}</div>
            <div className="text-xs text-slate-500">Dari total {allBlogs.length} artikel</div>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-2">
            <span className="text-xs font-mono text-[#fa824b] font-bold uppercase">EVENT AKTIF</span>
            <div className="text-3xl font-extrabold text-[#fa824b]">{activeEventsCount}</div>
            <div className="text-xs text-slate-500">Dari total {allEvents.length} event terdaftar</div>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-2">
            <span className="text-xs font-mono text-emerald-600 font-bold uppercase">STORAGE ENGINE</span>
            <div className="text-lg font-extrabold text-emerald-600">
              {dbStatus.connected ? "MySQL (Hostinger)" : "Hybrid JSON Fallback"}
            </div>
            <div className="text-xs text-slate-500">Tahan serverless & otomatis failover</div>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-2">
            <span className="text-xs font-mono text-slate-500 font-bold uppercase">AKSES CEPAT</span>
            <div className="flex gap-2 pt-1">
              <Link href="/admin/blogs" className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700">
                Blogs
              </Link>
              <Link href="/admin/events" className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700">
                Events
              </Link>
            </div>
            <div className="text-xs text-slate-500">Kelola dan edit konten</div>
          </div>
        </div>

        {/* Grid: Recent Blogs & Recent Events */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Blogs */}
          <div className="rounded-3xl bg-white border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between">
            <div>
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h2 className="font-bold text-slate-900 text-base">Artikel Terbaru</h2>
                  <p className="text-xs text-slate-500">Konten wawasan bisnis Ladi</p>
                </div>
                <Link href="/admin/blogs" className="text-xs font-bold text-[#1853a7] hover:underline">
                  Kelola ({allBlogs.length}) →
                </Link>
              </div>

              <div className="divide-y divide-slate-100">
                {allBlogs.slice(0, 4).map((b) => (
                  <div key={b.id} className="p-4 sm:px-6 flex items-center justify-between gap-3 hover:bg-slate-50 transition-colors">
                    <div>
                      <div className="font-bold text-sm text-slate-900 line-clamp-1">{b.title}</div>
                      <div className="text-xs text-slate-500 mt-0.5">{b.date} · {b.category}</div>
                    </div>
                    <Link
                      href={`/admin/blogs/edit/${b.id}`}
                      className="px-2.5 py-1 rounded bg-slate-100 text-[#1853a7] text-xs font-bold shrink-0 hover:bg-slate-200"
                    >
                      Edit
                    </Link>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 bg-[#f8fafc] border-t border-slate-100 text-center">
              <Link href="/admin/blogs/new" className="text-xs font-bold text-[#fa824b] hover:underline">
                + Tambah Artikel Baru
              </Link>
            </div>
          </div>

          {/* Recent Events */}
          <div className="rounded-3xl bg-white border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between">
            <div>
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h2 className="font-bold text-slate-900 text-base">Event & Workshop</h2>
                  <p className="text-xs text-slate-500">Agenda pelatihan dan edukasi digital</p>
                </div>
                <Link href="/admin/events" className="text-xs font-bold text-[#1853a7] hover:underline">
                  Kelola ({allEvents.length}) →
                </Link>
              </div>

              <div className="divide-y divide-slate-100">
                {allEvents.slice(0, 4).map((e) => (
                  <div key={e.id} className="p-4 sm:px-6 flex items-center justify-between gap-3 hover:bg-slate-50 transition-colors">
                    <div>
                      <div className="font-bold text-sm text-slate-900 line-clamp-1">{e.title}</div>
                      <div className="text-xs text-slate-500 mt-0.5">{e.date} · {e.location}</div>
                    </div>
                    <Link
                      href={`/admin/events/edit/${e.id}`}
                      className="px-2.5 py-1 rounded bg-slate-100 text-[#1853a7] text-xs font-bold shrink-0 hover:bg-slate-200"
                    >
                      Edit
                    </Link>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 bg-[#f8fafc] border-t border-slate-100 text-center">
              <Link href="/admin/events/new" className="text-xs font-bold text-[#1853a7] hover:underline">
                + Tambah Event Baru
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
