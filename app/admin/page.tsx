import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getBlogs, getEvents, getProjects } from "@/app/lib/storage";
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
  const user = token
    ? verifyToken(token)
    : (process.env.NODE_ENV !== "production"
        ? { username: "admin", role: "admin" as const, name: "Administrator" }
        : null);

  if (!user) {
    redirect("/admin/login?reason=unauthorized");
  }

  const isEditor = user.role === "editor";

  const [allBlogs, allEvents, allProjects, dbStatus] = await Promise.all([
    getBlogs(10, true),
    getEvents(5, true),
    getProjects(5, true),
    checkDbConnection(),
  ]);

  const publishedCount = allBlogs.filter((b) => b.status === "published").length;
  const draftCount = allBlogs.filter((b) => b.status === "draft").length;
  const activeEventsCount = allEvents.filter((e) => e.status === "active").length;
  const publishedProjectsCount = allProjects.filter((p) => p.status === "published").length;

  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#0f172a]">
      {/* Top Header */}
      <header className="bg-[#0f172a] text-white border-b border-slate-800 py-4 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <LadiLogo inverted={true} />
            <span className={`hidden sm:inline-block font-mono text-xs px-2.5 py-1 rounded-full border ${
              isEditor
                ? "bg-orange-500/10 text-orange-300 border-orange-500/30"
                : "bg-blue-500/10 text-blue-300 border-blue-500/30"
            }`}>
              {isEditor ? "✍️ PORTAL PENULIS KONTEN BLOG" : "🛡️ CMS & DATABASE DASHBOARD"}
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <div className="hidden md:flex items-center gap-1.5 text-slate-300 bg-white/5 px-3 py-1.5 rounded-full border border-white/10 font-mono text-[11px]">
              <span>{isEditor ? "✍️" : "👤"}</span>
              <span>{user.username}</span>
              <span className="text-slate-500">({isEditor ? "Penulis" : "Admin"})</span>
            </div>

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
        {/* =================================================================== */}
        {/* KHUSUS PENULIS KONTEN: Banner Sambutan & Instruksi Fokus Artikel */}
        {/* =================================================================== */}
        {isEditor && (
          <div className="p-4 rounded-2xl bg-orange-50 border border-orange-200 text-orange-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5">
              <span className="text-xl">💡</span>
              <div>
                <span className="font-bold">Mode Akun Penulis Aktif:</span>
                <span className="ml-1 text-slate-700">
                  Akun Anda difokuskan untuk menulis, menyunting, dan menerbitkan artikel blog edukasi bisnis Ladi lengkap dengan upload gambar.
                </span>
              </div>
            </div>
            <Link
              href="/admin/blogs/new"
              className="px-3.5 py-1.5 rounded-xl bg-[#fa824b] text-white font-bold text-xs uppercase tracking-wider shrink-0 hover:bg-[#e5723b] shadow-sm transition-all"
            >
              + Tulis Artikel Baru →
            </Link>
          </div>
        )}

        {/* =================================================================== */}
        {/* KHUSUS SUPERADMIN: Database Status Bar (Hostinger MySQL) */}
        {/* =================================================================== */}
        {!isEditor && (
          <div
            className={`p-4 rounded-2xl border flex flex-col sm:flex-row items-center justify-between gap-3 text-xs ${
              dbStatus.connected
                ? "bg-emerald-50 border-emerald-200 text-emerald-900"
                : "bg-amber-50 border-amber-200 text-amber-900"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <span
                className={`w-3 h-3 rounded-full shrink-0 ${
                  dbStatus.connected ? "bg-emerald-500 animate-pulse" : "bg-amber-500"
                }`}
              />
              <div>
                <span className="font-bold">
                  {dbStatus.connected
                    ? "Database MySQL Hostinger Aktif"
                    : "Mode Database Lokal Aktif"}
                </span>
                <span className="hidden sm:inline ml-2 text-slate-600">
                  — {dbStatus.message}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-mono text-[11px] text-slate-500 hidden md:inline">
                Host: {dbStatus.host}
              </span>
              <Link
                href="/admin/database"
                className="px-3 py-1.5 rounded-xl bg-white border border-slate-300 text-slate-800 hover:text-[#1853a7] font-bold text-[11px] shadow-sm hover:shadow transition-all shrink-0"
              >
                ⚙️ Pengaturan MySQL Hostinger →
              </Link>
            </div>
          </div>
        )}

        {/* Action Header Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-8 rounded-3xl bg-white border border-slate-200 shadow-sm">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0f172a]">
              {isEditor ? "Pusat Publikasi Artikel & Blog" : "Pusat Manajemen Konten Ladi"}
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              {isEditor
                ? "Tulis artikel baru, kelola draft, dan unggah foto dokumentasi wawasan bisnis."
                : "Kelola artikel wawasan, agenda event/workshop, studi kasus klien, dan sistem server."}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/admin/blogs/new"
              className="px-5 py-3 rounded-full bg-[#fa824b] hover:bg-[#e5723b] text-white font-bold text-xs uppercase tracking-wider shadow-md transition-all flex items-center gap-1.5"
            >
              <span>+</span> Tulis Artikel Baru
            </Link>

            {!isEditor && (
              <>
                <Link
                  href="/admin/events/new"
                  className="px-5 py-3 rounded-full bg-[#1853a7] hover:bg-[#0f3d7d] text-white font-bold text-xs uppercase tracking-wider shadow-md transition-all"
                >
                  + Tambah Event
                </Link>
                <Link
                  href="/admin/projects/new"
                  className="px-5 py-3 rounded-full bg-slate-900 hover:bg-black text-white font-bold text-xs uppercase tracking-wider shadow-md transition-all"
                >
                  + Tambah Portfolio
                </Link>
              </>
            )}
          </div>
        </div>

        {/* =================================================================== */}
        {/* TAMPILAN DASHBOARD: JIKA PENULIS KONTEN (BLOG ONLY) */}
        {/* =================================================================== */}
        {isEditor ? (
          <div className="space-y-8">
            {/* Stats Cards Khusus Penulis */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-2">
                <span className="text-xs font-mono text-[#1853a7] font-bold uppercase">
                  ARTIKEL TAYANG
                </span>
                <div className="text-3xl font-extrabold text-[#1853a7]">{publishedCount}</div>
                <div className="text-xs text-slate-500">Artikel live dan dibaca pengunjung</div>
              </div>

              <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-2">
                <span className="text-xs font-mono text-amber-600 font-bold uppercase">
                  DRAFT DISIMPAN
                </span>
                <div className="text-3xl font-extrabold text-amber-600">{draftCount}</div>
                <div className="text-xs text-slate-500">Belum dipublikasikan ke publik</div>
              </div>

              <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-2">
                <span className="text-xs font-mono text-emerald-600 font-bold uppercase">
                  TOTAL ARTIKEL
                </span>
                <div className="text-3xl font-extrabold text-emerald-600">{allBlogs.length}</div>
                <div className="text-xs text-slate-500">Seluruh tulisan yang tercatat</div>
              </div>
            </div>

            {/* List Lengkap Artikel untuk Penulis */}
            <div className="rounded-3xl bg-white border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Daftar Seluruh Artikel Anda</h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Klik &quot;Edit&quot; untuk menyunting isi teks, foto cover, kategori, atau status publikasi.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <Link
                    href="/admin/blogs"
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
                  >
                    Kelola Artikel →
                  </Link>
                  <Link
                    href="/admin/blogs/new"
                    className="px-4 py-2 rounded-xl bg-[#fa824b] text-white font-bold text-xs hover:bg-[#e5723b]"
                  >
                    + Buat Artikel Baru
                  </Link>
                </div>
              </div>

              <div className="divide-y divide-slate-100">
                {allBlogs.length === 0 ? (
                  <div className="p-12 text-center text-slate-500 text-sm">
                    Belum ada artikel. Klik tombol &quot;Tulis Artikel Baru&quot; di atas untuk mulai membuat tulisan!
                  </div>
                ) : (
                  allBlogs.map((b) => (
                    <div
                      key={b.id}
                      className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50 transition-colors"
                    >
                      <div className="min-w-0 space-y-1">
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                              b.status === "published"
                                ? "bg-emerald-100 text-emerald-800"
                                : "bg-amber-100 text-amber-800"
                            }`}
                          >
                            {b.status === "published" ? "Tayang" : "Draft"}
                          </span>
                          <span className="text-xs text-slate-400 font-mono">
                            {b.date} · {b.category}
                          </span>
                        </div>
                        <h3 className="font-bold text-base text-slate-900 truncate">
                          {b.title}
                        </h3>
                        <p className="text-xs text-slate-500 line-clamp-1">
                          {b.excerpt}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <Link
                          href={`/blog/${b.slug}`}
                          target="_blank"
                          className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all"
                        >
                          Lihat ↗
                        </Link>
                        <Link
                          href={`/admin/blogs/edit/${b.id}`}
                          className="px-4 py-1.5 rounded-xl bg-[#1853a7] hover:bg-[#0f3d7d] text-white text-xs font-bold transition-all"
                        >
                          Edit Artikel
                        </Link>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        ) : (
          /* =================================================================== */
          /* TAMPILAN DASHBOARD: JIKA SUPERADMIN (LENGKAP SEMUA FITUR) */
          /* =================================================================== */
          <div className="space-y-8">
            {/* 4 Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-2">
                <span className="text-xs font-mono text-slate-500 font-bold uppercase">
                  ARTIKEL TAYANG
                </span>
                <div className="text-3xl font-extrabold text-[#1853a7]">{publishedCount}</div>
                <div className="text-xs text-slate-500">Dari total {allBlogs.length} artikel</div>
              </div>

              <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-2">
                <span className="text-xs font-mono text-[#fa824b] font-bold uppercase">
                  EVENT AKTIF
                </span>
                <div className="text-3xl font-extrabold text-[#fa824b]">{activeEventsCount}</div>
                <div className="text-xs text-slate-500">Dari total {allEvents.length} event terdaftar</div>
              </div>

              <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-2">
                <span className="text-xs font-mono text-indigo-600 font-bold uppercase">
                  PORTFOLIO KLIEN
                </span>
                <div className="text-3xl font-extrabold text-indigo-600">{publishedProjectsCount}</div>
                <div className="text-xs text-slate-500">Dari total {allProjects.length} studi kasus</div>
              </div>

              <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-2">
                <span className="text-xs font-mono text-slate-500 font-bold uppercase">
                  AKSES CEPAT
                </span>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <Link
                    href="/admin/blogs"
                    className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700"
                  >
                    Blogs
                  </Link>
                  <Link
                    href="/admin/events"
                    className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700"
                  >
                    Events
                  </Link>
                  <Link
                    href="/admin/projects"
                    className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700"
                  >
                    Portfolio
                  </Link>
                </div>
                <div className="text-xs text-slate-500">Kelola dan edit konten</div>
              </div>
            </div>

            {/* Grid 3 Kolom: Blogs, Events & Projects */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Recent Blogs */}
              <div className="rounded-3xl bg-white border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between">
                <div>
                  <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                    <div>
                      <h2 className="font-bold text-slate-900 text-base">Artikel Terbaru</h2>
                      <p className="text-xs text-slate-500">Wawasan bisnis Ladi</p>
                    </div>
                    <Link href="/admin/blogs" className="text-xs font-bold text-[#1853a7] hover:underline">
                      Kelola ({allBlogs.length}) →
                    </Link>
                  </div>

                  <div className="divide-y divide-slate-100">
                    {allBlogs.slice(0, 4).map((b) => (
                      <div
                        key={b.id}
                        className="p-4 flex items-center justify-between gap-3 hover:bg-slate-50 transition-colors"
                      >
                        <div className="min-w-0">
                          <div className="font-bold text-sm text-slate-900 truncate">{b.title}</div>
                          <div className="text-xs text-slate-500 mt-0.5">
                            {b.date} · {b.category}
                          </div>
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

                <div className="p-3 bg-[#f8fafc] border-t border-slate-100 text-center">
                  <Link href="/admin/blogs/new" className="text-xs font-bold text-[#fa824b] hover:underline">
                    + Tambah Artikel Baru
                  </Link>
                </div>
              </div>

              {/* Recent Events */}
              <div className="rounded-3xl bg-white border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between">
                <div>
                  <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                    <div>
                      <h2 className="font-bold text-slate-900 text-base">Event & Workshop</h2>
                      <p className="text-xs text-slate-500">Agenda edukasi UMKM</p>
                    </div>
                    <Link href="/admin/events" className="text-xs font-bold text-[#1853a7] hover:underline">
                      Kelola ({allEvents.length}) →
                    </Link>
                  </div>

                  <div className="divide-y divide-slate-100">
                    {allEvents.slice(0, 4).map((e) => (
                      <div
                        key={e.id}
                        className="p-4 flex items-center justify-between gap-3 hover:bg-slate-50 transition-colors"
                      >
                        <div className="min-w-0">
                          <div className="font-bold text-sm text-slate-900 truncate">{e.title}</div>
                          <div className="text-xs text-slate-500 mt-0.5">
                            {e.date} · {e.location}
                          </div>
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

                <div className="p-3 bg-[#f8fafc] border-t border-slate-100 text-center">
                  <Link href="/admin/events/new" className="text-xs font-bold text-[#1853a7] hover:underline">
                    + Tambah Event Baru
                  </Link>
                </div>
              </div>

              {/* Recent Projects */}
              <div className="rounded-3xl bg-white border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between">
                <div>
                  <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                    <div>
                      <h2 className="font-bold text-slate-900 text-base">Portfolio Klien</h2>
                      <p className="text-xs text-slate-500">Studi kasus digitalisasi</p>
                    </div>
                    <Link href="/admin/projects" className="text-xs font-bold text-[#1853a7] hover:underline">
                      Kelola ({allProjects.length}) →
                    </Link>
                  </div>

                  <div className="divide-y divide-slate-100">
                    {allProjects.slice(0, 4).map((p) => (
                      <div
                        key={p.id}
                        className="p-4 flex items-center justify-between gap-3 hover:bg-slate-50 transition-colors"
                      >
                        <div className="min-w-0">
                          <div className="font-bold text-sm text-slate-900 truncate">{p.title}</div>
                          <div className="text-xs text-slate-500 mt-0.5">
                            {p.client_name} · {p.year || "2026"}
                          </div>
                        </div>
                        <Link
                          href={`/admin/projects/edit/${p.id}`}
                          className="px-2.5 py-1 rounded bg-slate-100 text-[#1853a7] text-xs font-bold shrink-0 hover:bg-slate-200"
                        >
                          Edit
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-3 bg-[#f8fafc] border-t border-slate-100 text-center">
                  <Link href="/admin/projects/new" className="text-xs font-bold text-[#1853a7] hover:underline">
                    + Tambah Proyek Baru
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
