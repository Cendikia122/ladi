"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import LadiLogo from "../../components/LadiLogo";
import { authFetch } from "@/app/lib/clientAuth";

export const dynamic = "force-dynamic";

export default function AdminDatabasePage() {
  const [config, setConfig] = useState({
    host: "srv1762.hstgr.io",
    user: "u941811514_admin",
    password: "",
    database: "u941811514_faselin",
    port: "3306",
    hasPassword: false,
  });

  const [testResult, setTestResult] = useState<{
    success?: boolean;
    message?: string;
    help?: string;
    loading?: boolean;
  }>({});

  const [syncResult, setSyncResult] = useState<{
    success?: boolean;
    message?: string;
    synced?: { blogs: number; events: number; projects: number };
    loading?: boolean;
  }>({});

  const [saveLoading, setSaveLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState("");

  const loadConfig = async () => {
    try {
      const res = await authFetch("/api/database/config");
      const json = await res.json();
      if (json.success && json.config) {
        setConfig((prev) => ({
          ...prev,
          host: json.config.host,
          user: json.config.user,
          database: json.config.database,
          port: json.config.port,
          hasPassword: json.config.hasPassword,
        }));
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadConfig();
  }, []);

  const handleTestConnection = async () => {
    setTestResult({ loading: true });
    try {
      const res = await authFetch("/api/database/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      });
      const json = await res.json();
      setTestResult({
        success: json.success,
        message: json.message,
        help: json.help,
        loading: false,
      });
    } catch {
      setTestResult({
        success: false,
        message: "Gagal terhubung ke endpoint pengujian",
        loading: false,
      });
    }
  };

  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveLoading(true);
    setSaveSuccess("");
    try {
      const res = await authFetch("/api/database/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      });
      const json = await res.json();
      if (json.success) {
        setSaveSuccess("Konfigurasi database berhasil disimpan ke .env.local!");
        loadConfig();
      } else {
        alert(json.message || "Gagal menyimpan konfigurasi");
      }
    } catch {
      alert("Terjadi kesalahan jaringan");
    } finally {
      setSaveLoading(false);
    }
  };

  const handleSyncToMysql = async () => {
    if (!confirm("Sinkronkan seluruh data artikel, event, dan portofolio ke MySQL Hostinger sekarang?")) return;
    setSyncResult({ loading: true });
    try {
      const res = await authFetch("/api/database/sync", {
        method: "POST",
      });
      const json = await res.json();
      setSyncResult({
        success: json.success,
        message: json.message,
        synced: json.synced,
        loading: false,
      });
    } catch {
      setSyncResult({
        success: false,
        message: "Gagal melakukan sinkronisasi database",
        loading: false,
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#0f172a]">
      {/* Top Header */}
      <header className="bg-[#0f172a] text-white border-b border-slate-800 py-4 px-4 sm:px-8">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <LadiLogo inverted={true} />
            <span className="font-mono text-xs px-2.5 py-1 rounded-full bg-white/10 text-slate-300">
              DATABASE & MYSQL HOSTINGER
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <Link
              href="/admin"
              className="text-slate-300 hover:text-white transition-colors"
            >
              ← Kembali ke Dashboard
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-8 py-10 space-y-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0f172a]">
            Koneksi Database & Integrasi MySQL Hostinger
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Atur kredensial MySQL Hostinger agar semua perubahan CRUD (Artikel, Event, Portofolio) tersimpan langsung di server database Hostinger Anda.
          </p>
        </div>

        {/* Status Card */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-2">
            <div className="text-xs font-mono uppercase text-slate-400 font-bold">DATABASE TARGET</div>
            <div className="text-xl font-extrabold text-slate-900">Hostinger MySQL</div>
            <div className="text-xs text-slate-500">Host: <span className="font-mono font-bold text-slate-700">{config.host}</span></div>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-2">
            <div className="text-xs font-mono uppercase text-slate-400 font-bold">NAMA DATABASE</div>
            <div className="text-xl font-extrabold text-slate-900 truncate">{config.database}</div>
            <div className="text-xs text-slate-500">User: <span className="font-mono font-bold text-slate-700">{config.user}</span></div>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-2">
            <div className="text-xs font-mono uppercase text-slate-400 font-bold">STATUS PASSWORD</div>
            <div className="flex items-center gap-2">
              <span className={`w-3 h-3 rounded-full ${config.hasPassword ? "bg-emerald-500" : "bg-amber-500"}`} />
              <span className="text-lg font-bold text-slate-900">
                {config.hasPassword ? "Password Tersimpan" : "Belum Ada Password"}
              </span>
            </div>
            <div className="text-xs text-slate-500">
              {config.hasPassword ? "Siap terkoneksi ke remote Hostinger" : "Masukkan password database Anda di bawah"}
            </div>
          </div>
        </div>

        {/* Credentials Form */}
        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-lg font-bold text-slate-900">Kredensial MySQL Hostinger</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Data ini sesuai dengan detail MySQL di hPanel Hostinger Anda.
            </p>
          </div>

          {saveSuccess && (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-bold flex items-center gap-2">
              <span>✅</span>
              <span>{saveSuccess}</span>
            </div>
          )}

          <form onSubmit={handleSaveConfig} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                DB_HOST (Hostname Hostinger)
              </label>
              <input
                type="text"
                value={config.host}
                onChange={(e) => setConfig({ ...config, host: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#1853a7] font-mono bg-[#f8fafc]"
                placeholder="srv1762.hstgr.io atau localhost"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                DB_NAME (Nama Database)
              </label>
              <input
                type="text"
                value={config.database}
                onChange={(e) => setConfig({ ...config, database: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#1853a7] font-mono bg-[#f8fafc]"
                placeholder="u941811514_faselin"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                DB_USER (Username MySQL)
              </label>
              <input
                type="text"
                value={config.user}
                onChange={(e) => setConfig({ ...config, user: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#1853a7] font-mono bg-[#f8fafc]"
                placeholder="u941811514_admin"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                DB_PASSWORD (Password MySQL Hostinger)
              </label>
              <input
                type="password"
                value={config.password}
                onChange={(e) => setConfig({ ...config, password: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#1853a7] font-mono bg-[#f8fafc]"
                placeholder={config.hasPassword ? "•••••••• (Password tersimpan, ketik jika ingin ganti)" : "Masukkan password MySQL Hostinger"}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                DB_PORT
              </label>
              <input
                type="text"
                value={config.port}
                onChange={(e) => setConfig({ ...config, port: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#1853a7] font-mono bg-[#f8fafc]"
                placeholder="3306"
              />
            </div>

            <div className="flex items-end gap-3">
              <button
                type="submit"
                disabled={saveLoading}
                className="px-6 py-3 rounded-xl bg-[#1853a7] hover:bg-[#0f3d7d] text-white font-bold text-xs uppercase tracking-wider shadow-sm transition-all disabled:opacity-50"
              >
                {saveLoading ? "Menyimpan..." : "💾 Simpan Kredensial"}
              </button>

              <button
                type="button"
                onClick={handleTestConnection}
                disabled={testResult.loading}
                className="px-6 py-3 rounded-xl bg-[#0f172a] hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider shadow-sm transition-all disabled:opacity-50"
              >
                {testResult.loading ? "Menguji..." : "⚡ Uji Koneksi MySQL"}
              </button>
            </div>
          </form>

          {/* Test Connection Result Box */}
          {testResult.message && (
            <div
              className={`p-4 rounded-2xl border text-xs sm:text-sm font-semibold space-y-1 ${
                testResult.success
                  ? "bg-emerald-50 border-emerald-300 text-emerald-900"
                  : "bg-red-50 border-red-300 text-red-900"
              }`}
            >
              <div className="flex items-center gap-2">
                <span>{testResult.success ? "✅" : "❌"}</span>
                <span>{testResult.message}</span>
              </div>
              {testResult.help && (
                <div className="text-xs text-red-700 font-normal pl-6">
                  💡 <strong>Solusi:</strong> {testResult.help}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Sync Data to Hostinger MySQL */}
        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Sinkronisasi Seluruh Data ke MySQL Hostinger
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Tombol ini akan otomatis membuat tabel (<code className="font-mono bg-slate-100 px-1 py-0.5 rounded">blogs</code>, <code className="font-mono bg-slate-100 px-1 py-0.5 rounded">events</code>, <code className="font-mono bg-slate-100 px-1 py-0.5 rounded">projects</code>) dan meng-upload seluruh artikel, event, dan portofolio Anda ke MySQL Hostinger.
              </p>
            </div>

            <button
              onClick={handleSyncToMysql}
              disabled={syncResult.loading}
              className="px-6 py-3.5 rounded-full bg-[#fa824b] hover:bg-[#e5723b] text-white font-bold text-xs uppercase tracking-wider shadow-md transition-all self-start sm:self-auto shrink-0 disabled:opacity-50"
            >
              {syncResult.loading ? "Sedang Menyinkronkan..." : "🚀 Sinkronkan Data ke MySQL"}
            </button>
          </div>

          {syncResult.message && (
            <div
              className={`p-4 rounded-2xl border text-xs sm:text-sm font-semibold ${
                syncResult.success
                  ? "bg-emerald-50 border-emerald-300 text-emerald-900"
                  : "bg-red-50 border-red-300 text-red-900"
              }`}
            >
              <div className="flex items-center gap-2">
                <span>{syncResult.success ? "🎉" : "⚠️"}</span>
                <span>{syncResult.message}</span>
              </div>
              {syncResult.synced && (
                <div className="mt-2 text-xs text-emerald-800 font-normal pl-6 space-x-3">
                  <span>📰 Artikel: {syncResult.synced.blogs}</span>
                  <span>🎟️ Event: {syncResult.synced.events}</span>
                  <span>💼 Portofolio: {syncResult.synced.projects}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Tutorial Hostinger Remote MySQL Guide */}
        <div className="bg-slate-900 text-white rounded-3xl p-8 space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <span className="font-mono text-xs text-[#fa824b] font-bold uppercase tracking-wider block mb-1">
              PANDUAN LENGKAP HOSTINGER
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold">
              Cara Mengaktifkan Remote MySQL di Hostinger hPanel
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              Jika koneksi MySQL dari luar Hostinger (seperti dari laptop lokal atau Vercel) masih gagal, ikuti 3 langkah mudah ini:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs sm:text-sm">
            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
              <span className="w-7 h-7 rounded-lg bg-[#fa824b] text-white flex items-center justify-center font-bold text-xs mb-2">
                1
              </span>
              <h3 className="font-bold text-white text-base">Buka Menu Remote MySQL</h3>
              <p className="text-slate-300 leading-relaxed">
                Login ke <strong>hPanel Hostinger</strong> → Pilih Hosting Anda → Cari dan klik menu <strong>Remote MySQL</strong> (di bawah kategori Databases).
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
              <span className="w-7 h-7 rounded-lg bg-[#fa824b] text-white flex items-center justify-center font-bold text-xs mb-2">
                2
              </span>
              <h3 className="font-bold text-white text-base">Izinkan Semua IP (%)</h3>
              <p className="text-slate-300 leading-relaxed">
                Di kolom <strong>IP (IPv4 or IPv6)</strong>, masukkan tanda persen: <code className="bg-white/20 px-2 py-0.5 rounded font-mono text-amber-300 font-bold">%</code> agar server web luar bisa terhubung.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
              <span className="w-7 h-7 rounded-lg bg-[#fa824b] text-white flex items-center justify-center font-bold text-xs mb-2">
                3
              </span>
              <h3 className="font-bold text-white text-base">Pilih Database & Simpan</h3>
              <p className="text-slate-300 leading-relaxed">
                Pilih database <code className="bg-white/20 px-1.5 py-0.5 rounded font-mono text-white">u941811514_faselin</code> lalu klik <strong>Create / Buat</strong>. Selesai!
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
