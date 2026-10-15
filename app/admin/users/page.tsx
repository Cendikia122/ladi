"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import LadiLogo from "../../components/LadiLogo";
import AdminLogoutButton from "@/app/components/AdminLogoutButton";
import { authFetch, getClientSession } from "@/app/lib/clientAuth";

export const dynamic = "force-dynamic";

interface AdminUserItem {
  id: number;
  username: string;
  name: string;
  role: "superadmin" | "admin" | "editor";
  status: "active" | "inactive";
  created_at: string;
  updated_at?: string;
  isLocked?: boolean;
  failedAttempts?: number;
  remainingHours?: number;
}

export default function AdminUsersManagementPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<{ username: string; role: string; name: string } | null>(null);
  const [users, setUsers] = useState<AdminUserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editUser, setEditUser] = useState<AdminUserItem | null>(null);
  const [passwordTargetUser, setPasswordTargetUser] = useState<AdminUserItem | null>(null);

  // Form States: Add User
  const [addForm, setAddForm] = useState({
    name: "",
    username: "",
    password: "",
    role: "admin" as "superadmin" | "admin" | "editor",
    status: "active" as "active" | "inactive",
  });
  const [showAddPass, setShowAddPass] = useState(false);

  // Form States: Edit User
  const [editForm, setEditForm] = useState({
    name: "",
    username: "",
    role: "admin" as "superadmin" | "admin" | "editor",
    status: "active" as "active" | "inactive",
    password: "",
  });
  const [showEditPass, setShowEditPass] = useState(false);

  // Form States: Reset Password
  const [resetPassValue, setResetPassValue] = useState("");
  const [showResetPass, setShowResetPass] = useState(false);

  const fetchUsers = async () => {
    try {
      const res = await authFetch("/api/users");
      const json = await res.json();
      if (res.ok && json.success) {
        setUsers(json.users || []);
      } else {
        setToast({ type: "error", message: json.message || "Gagal memuat data akun admin" });
      }
    } catch {
      setToast({ type: "error", message: "Gagal terhubung ke server saat memuat akun" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getClientSession().then((u) => {
      if (!u) {
        router.push("/admin/login?redirect=/admin/users");
        return;
      }
      if (u.role !== "superadmin") {
        alert("Akses Ditolak: Halaman kontrol akun admin hanya dapat diakses oleh Super Administrator.");
        router.push("/admin");
        return;
      }
      setCurrentUser(u);
      fetchUsers();
    });
  }, [router]);

  const showToast = (type: "success" | "error", message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 5000);
  };

  // 1. Submit Tambah User Baru
  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addForm.name.trim() || !addForm.username.trim() || !addForm.password.trim()) {
      alert("Nama lengkap, username, dan password wajib diisi!");
      return;
    }

    setActionLoading("add");
    try {
      const res = await authFetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(addForm),
      });
      const json = await res.json();

      if (res.ok && json.success) {
        showToast("success", json.message || "Akun admin berhasil dibuat!");
        setIsAddModalOpen(false);
        setAddForm({
          name: "",
          username: "",
          password: "",
          role: "admin",
          status: "active",
        });
        await fetchUsers();
      } else {
        alert(json.message || "Gagal membuat akun admin.");
      }
    } catch {
      alert("Terjadi kesalahan jaringan.");
    } finally {
      setActionLoading(null);
    }
  };

  // 2. Open Edit Modal
  const openEditModal = (u: AdminUserItem) => {
    setEditUser(u);
    setEditForm({
      name: u.name,
      username: u.username,
      role: u.role,
      status: u.status,
      password: "",
    });
    setShowEditPass(false);
  };

  // Submit Edit User (Ganti Username, Nama, Role, Status, Password opsional)
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editUser) return;

    if (!editForm.name.trim() || !editForm.username.trim()) {
      alert("Nama lengkap dan username tidak boleh kosong!");
      return;
    }

    setActionLoading("edit");
    try {
      const payload: any = {
        name: editForm.name.trim(),
        username: editForm.username.trim(),
        role: editForm.role,
        status: editForm.status,
      };
      if (editForm.password.trim()) {
        payload.password = editForm.password.trim();
      }

      const res = await authFetch(`/api/users/${editUser.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();

      if (res.ok && json.success) {
        showToast("success", json.message || "Akun admin berhasil diperbarui!");
        setEditUser(null);
        await fetchUsers();
      } else {
        alert(json.message || "Gagal memperbarui akun admin.");
      }
    } catch {
      alert("Terjadi kesalahan jaringan.");
    } finally {
      setActionLoading(null);
    }
  };

  // 3. Open Direct Password Reset Modal
  const openPasswordModal = (u: AdminUserItem) => {
    setPasswordTargetUser(u);
    setResetPassValue("");
    setShowResetPass(false);
  };

  // Submit Direct Password Reset
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordTargetUser) return;

    if (!resetPassValue.trim() || resetPassValue.trim().length < 6) {
      alert("Password baru wajib diisi minimal 6 karakter!");
      return;
    }

    setActionLoading("password");
    try {
      const res = await authFetch(`/api/users/${passwordTargetUser.id}/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: resetPassValue.trim() }),
      });
      const json = await res.json();

      if (res.ok && json.success) {
        showToast("success", json.message || "Password berhasil diganti!");
        setPasswordTargetUser(null);
        await fetchUsers();
      } else {
        alert(json.message || "Gagal mengganti password.");
      }
    } catch {
      alert("Terjadi kesalahan jaringan.");
    } finally {
      setActionLoading(null);
    }
  };

  // 4. Buka Kunci Akun yang Terblokir (1-Click Unlock)
  const handleUnlock = async (u: AdminUserItem) => {
    if (!confirm(`Buka blokir keamanan login untuk akun "${u.username}" (${u.name}) sekarang?`)) return;

    setActionLoading(`unlock-${u.id}`);
    try {
      const res = await authFetch(`/api/users/${u.id}/unlock`, {
        method: "POST",
      });
      const json = await res.json();

      if (res.ok && json.success) {
        showToast("success", json.message);
        await fetchUsers();
      } else {
        alert(json.message || "Gagal membuka blokir akun.");
      }
    } catch {
      alert("Terjadi kesalahan jaringan.");
    } finally {
      setActionLoading(null);
    }
  };

  // 5. Hapus Akun Admin
  const handleDeleteUser = async (u: AdminUserItem) => {
    if (!confirm(`PERINGATAN: Apakah Anda yakin ingin menghapus akun admin "${u.username}" (${u.name})? Tindakan ini tidak dapat dibatalkan.`)) {
      return;
    }

    setActionLoading(`delete-${u.id}`);
    try {
      const res = await authFetch(`/api/users/${u.id}`, {
        method: "DELETE",
      });
      const json = await res.json();

      if (res.ok && json.success) {
        showToast("success", json.message || "Akun admin berhasil dihapus!");
        await fetchUsers();
      } else {
        alert(json.message || "Gagal menghapus akun admin.");
      }
    } catch {
      alert("Terjadi kesalahan jaringan.");
    } finally {
      setActionLoading(null);
    }
  };

  const superAdminCount = users.filter((u) => u.role === "superadmin").length;
  const subordinateCount = users.filter((u) => u.role !== "superadmin").length;
  const lockedCount = users.filter((u) => u.isLocked).length;

  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#0f172a]">
      {/* Header */}
      <header className="bg-[#0f172a] text-white border-b border-slate-800 py-4 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <LadiLogo inverted={true} />
            <span className="font-mono text-xs px-2.5 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
              🛡️ KONTROL AKUN ADMIN & PASSWORD
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <Link
              href="/admin"
              className="text-slate-300 hover:text-white transition-colors"
            >
              ← Kembali ke Dashboard
            </Link>
            <div className="hidden md:flex items-center gap-1.5 text-slate-300 bg-white/5 px-3 py-1.5 rounded-full border border-white/10 font-mono text-[11px]">
              <span>👑</span>
              <span>{currentUser?.username || "admin"}</span>
              <span className="text-purple-400 font-bold">(Super Admin)</span>
            </div>
            <AdminLogoutButton />
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-10 space-y-8">
        {/* Toast Notification */}
        {toast && (
          <div
            className={`p-4 rounded-2xl text-xs sm:text-sm font-semibold flex items-center justify-between gap-3 shadow-md border ${
              toast.type === "success"
                ? "bg-emerald-50 border-emerald-200 text-emerald-900"
                : "bg-red-50 border-red-200 text-red-900"
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="text-lg">{toast.type === "success" ? "✓" : "⚠️"}</span>
              <span>{toast.message}</span>
            </div>
            <button
              onClick={() => setToast(null)}
              className="text-slate-500 hover:text-slate-800 font-bold px-2 py-1"
            >
              ✕
            </button>
          </div>
        )}

        {/* Super Admin Explanation Banner */}
        <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white border border-indigo-900/40 shadow-lg relative overflow-hidden">
          <div className="relative z-10 space-y-3">
            <div className="flex items-center gap-2 text-indigo-400 font-mono text-xs uppercase tracking-wider font-bold">
              <span>🛡️ Otoritas Penuh Super Administrator</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Kontrol Password & Akun Admin Bawahan
            </h1>
            <p className="text-sm text-slate-300 max-w-3xl leading-relaxed">
              Sebagai <strong className="text-white">Super Admin</strong>, Anda memiliki kendali hierarki penuh terhadap seluruh akun di bawah Anda.
              Anda dapat dengan mudah <strong className="text-amber-300">gonta-ganti username (&quot;usn&quot;)</strong>, langsung me-reset password akun bawahan tanpa perlu mengetahui password lama, mengaktifkan/menonaktifkan akun, serta membuka blokir keamanan jika akun bawahan terkunci karena salah password.
            </p>
          </div>
        </div>

        {/* Stats Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-1">
            <span className="text-[11px] font-mono text-slate-500 font-bold uppercase">TOTAL AKUN</span>
            <div className="text-3xl font-extrabold text-[#0f172a]">{users.length}</div>
            <div className="text-xs text-slate-500">Seluruh admin terdaftar</div>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-1">
            <span className="text-[11px] font-mono text-purple-600 font-bold uppercase">SUPER ADMIN</span>
            <div className="text-3xl font-extrabold text-purple-600">{superAdminCount}</div>
            <div className="text-xs text-slate-500">Pemegang hak akses penuh</div>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-1">
            <span className="text-[11px] font-mono text-blue-600 font-bold uppercase">ADMIN & EDITOR</span>
            <div className="text-3xl font-extrabold text-blue-600">{subordinateCount}</div>
            <div className="text-xs text-slate-500">Akun di bawah kontrol Anda</div>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-1">
            <span className="text-[11px] font-mono text-red-600 font-bold uppercase">TERBLOKIR (3 HARI)</span>
            <div className={`text-3xl font-extrabold ${lockedCount > 0 ? "text-red-600 animate-pulse" : "text-emerald-600"}`}>
              {lockedCount}
            </div>
            <div className="text-xs text-slate-500">{lockedCount > 0 ? "Butuh dibuka Super Admin" : "Semua akun aman"}</div>
          </div>
        </div>

        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-white border border-slate-200 shadow-sm">
          <div>
            <h2 className="text-lg font-extrabold text-[#0f172a]">Daftar Akun Administrator & Penulis</h2>
            <p className="text-xs text-slate-500">
              Kelola kredensial, ganti password bawahan, atau ubah username admin kapan saja.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchUsers}
              disabled={loading}
              className="px-4 py-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs uppercase tracking-wider transition-all"
            >
              🔄 Refresh
            </button>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-5 py-2.5 rounded-full bg-[#1853a7] hover:bg-[#0f3d7d] text-white font-bold text-xs uppercase tracking-wider shadow-md transition-all flex items-center gap-1.5"
            >
              <span>+</span> Tambah Admin Baru
            </button>
          </div>
        </div>

        {/* User Table Card */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-slate-500 font-mono text-sm">
              Memuat daftar akun admin...
            </div>
          ) : users.length === 0 ? (
            <div className="p-12 text-center text-slate-500">
              Belum ada akun admin terdaftar.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-mono uppercase tracking-wider text-slate-500">
                    <th className="py-4 px-6">ID & PENGGUNA</th>
                    <th className="py-4 px-6">ROLE / LEVEL</th>
                    <th className="py-4 px-6">STATUS</th>
                    <th className="py-4 px-6">KEAMANAN LOGIN</th>
                    <th className="py-4 px-6 text-right">KONTROL & AKSI</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {users.map((u) => {
                    const isSelf = currentUser?.username.toLowerCase() === u.username.toLowerCase();
                    return (
                      <tr key={u.id} className="hover:bg-slate-50/60 transition-colors">
                        {/* Nama & Username */}
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-sm shrink-0 ${
                              u.role === "superadmin"
                                ? "bg-gradient-to-tr from-purple-600 to-indigo-600"
                                : u.role === "admin"
                                ? "bg-gradient-to-tr from-blue-600 to-cyan-600"
                                : "bg-gradient-to-tr from-orange-500 to-amber-500"
                            }`}>
                              {u.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div className="font-bold text-slate-900 flex items-center gap-2">
                                <span>{u.name}</span>
                                {isSelf && (
                                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-mono font-bold">
                                    Akun Anda
                                  </span>
                                )}
                              </div>
                              <div className="font-mono text-xs text-[#1853a7] font-semibold mt-0.5">
                                @{u.username}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Role Badge */}
                        <td className="py-4 px-6">
                          {u.role === "superadmin" ? (
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200">
                              <span>👑</span> Super Admin
                            </span>
                          ) : u.role === "admin" ? (
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
                              <span>💼</span> Admin CMS
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-orange-50 text-orange-700 border border-orange-200">
                              <span>✍️</span> Penulis Konten
                            </span>
                          )}
                        </td>

                        {/* Status Aktif */}
                        <td className="py-4 px-6">
                          {u.status === "active" ? (
                            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
                              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                              Aktif
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400">
                              <span className="w-2 h-2 rounded-full bg-slate-300"></span>
                              Nonaktif
                            </span>
                          )}
                        </td>

                        {/* Status Keamanan / Lockout */}
                        <td className="py-4 px-6">
                          {u.isLocked ? (
                            <div className="space-y-1">
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-red-100 text-red-800 animate-pulse">
                                ⚠️ Terblokir ({u.remainingHours} jam lagi)
                              </span>
                              <div>
                                <button
                                  onClick={() => handleUnlock(u)}
                                  disabled={actionLoading === `unlock-${u.id}`}
                                  className="text-[11px] text-blue-600 hover:text-blue-800 underline font-semibold"
                                >
                                  {actionLoading === `unlock-${u.id}` ? "Membuka..." : "Buka Kunci Sekarang →"}
                                </button>
                              </div>
                            </div>
                          ) : (
                            <span className="text-xs text-slate-500 font-mono">
                              ✓ Normal ({u.failedAttempts || 0}/3 coba)
                            </span>
                          )}
                        </td>

                        {/* Aksi Super Admin */}
                        <td className="py-4 px-6 text-right space-x-2">
                          {/* Ganti Password Langsung */}
                          <button
                            onClick={() => openPasswordModal(u)}
                            className="px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-xs font-bold transition-all shadow-sm"
                            title="Ganti password admin ini langsung"
                          >
                            🔑 Ganti Password
                          </button>

                          {/* Edit Username & Info */}
                          <button
                            onClick={() => openEditModal(u)}
                            className="px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-[#1853a7] border border-blue-200 text-xs font-bold transition-all shadow-sm"
                            title="Edit username ('usn'), nama, role, status"
                          >
                            ✏️ Edit USN & Data
                          </button>

                          {/* Hapus Admin */}
                          {!isSelf && (
                            <button
                              onClick={() => handleDeleteUser(u)}
                              disabled={actionLoading === `delete-${u.id}`}
                              className="px-3 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-bold transition-all shadow-sm disabled:opacity-40"
                              title="Hapus akun admin"
                            >
                              🗑️ Hapus
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* =================================================================== */}
      {/* MODAL 1: Tambah Admin Baru */}
      {/* =================================================================== */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="text-xl">👤</span>
                <h3 className="font-extrabold text-lg text-slate-900">Tambah Akun Admin Baru</h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-mono font-bold uppercase text-slate-700 mb-1">
                  Nama Lengkap Admin <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Budi Prasetyo"
                  value={addForm.name}
                  onChange={(e) => setAddForm({ ...addForm, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#1853a7] focus:ring-2 focus:ring-blue-100 outline-none text-sm transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-bold uppercase text-slate-700 mb-1">
                  Username (USN) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-3 text-slate-400 font-mono text-sm">@</span>
                  <input
                    type="text"
                    required
                    placeholder="budi_admin"
                    value={addForm.username}
                    onChange={(e) => setAddForm({ ...addForm, username: e.target.value.toLowerCase().trim() })}
                    className="w-full pl-8 pr-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#1853a7] focus:ring-2 focus:ring-blue-100 outline-none text-sm font-mono transition-all"
                  />
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Hanya huruf kecil, angka, underscore, titik, atau strip (3–30 karakter).
                </p>
              </div>

              <div>
                <label className="block text-xs font-mono font-bold uppercase text-slate-700 mb-1">
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showAddPass ? "text" : "password"}
                    required
                    placeholder="Minimal 6 karakter"
                    value={addForm.password}
                    onChange={(e) => setAddForm({ ...addForm, password: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#1853a7] focus:ring-2 focus:ring-blue-100 outline-none text-sm font-mono transition-all pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowAddPass(!showAddPass)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 text-xs px-2 py-0.5 font-mono"
                  >
                    {showAddPass ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono font-bold uppercase text-slate-700 mb-1">
                    Role / Wewenang
                  </label>
                  <select
                    value={addForm.role}
                    onChange={(e) => setAddForm({ ...addForm, role: e.target.value as any })}
                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#1853a7] outline-none text-sm transition-all"
                  >
                    <option value="admin">Admin CMS (Kelola Konten)</option>
                    <option value="editor">Penulis Konten (Blog)</option>
                    <option value="superadmin">Super Administrator</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold uppercase text-slate-700 mb-1">
                    Status Akun
                  </label>
                  <select
                    value={addForm.status}
                    onChange={(e) => setAddForm({ ...addForm, status: e.target.value as any })}
                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#1853a7] outline-none text-sm transition-all"
                  >
                    <option value="active">Aktif</option>
                    <option value="inactive">Nonaktif</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-5 py-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs uppercase tracking-wider transition-all"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={actionLoading === "add"}
                  className="px-6 py-2.5 rounded-full bg-[#1853a7] hover:bg-[#0f3d7d] text-white font-bold text-xs uppercase tracking-wider shadow-md transition-all disabled:opacity-50"
                >
                  {actionLoading === "add" ? "Menyimpan..." : "Simpan Akun Baru"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* MODAL 2: Edit USN & Data Admin */}
      {/* =================================================================== */}
      {editUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="text-xl">✏️</span>
                <div>
                  <h3 className="font-extrabold text-lg text-slate-900">Edit Akun & Gonta-Ganti USN</h3>
                  <p className="text-xs text-slate-500">ID Akun: #{editUser.id}</p>
                </div>
              </div>
              <button
                onClick={() => setEditUser(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-mono font-bold uppercase text-slate-700 mb-1">
                  Nama Lengkap Admin <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#1853a7] focus:ring-2 focus:ring-blue-100 outline-none text-sm transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-bold uppercase text-slate-700 mb-1">
                  Username Baru (Gonta-Ganti USN) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-3 text-slate-400 font-mono text-sm">@</span>
                  <input
                    type="text"
                    required
                    value={editForm.username}
                    onChange={(e) => setEditForm({ ...editForm, username: e.target.value.toLowerCase().trim() })}
                    className="w-full pl-8 pr-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#1853a7] focus:ring-2 focus:ring-blue-100 outline-none text-sm font-mono transition-all font-bold text-indigo-900"
                  />
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Username sebelumnya: <strong className="font-mono">@{editUser.username}</strong>
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono font-bold uppercase text-slate-700 mb-1">
                    Role / Wewenang
                  </label>
                  <select
                    value={editForm.role}
                    onChange={(e) => setEditForm({ ...editForm, role: e.target.value as any })}
                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#1853a7] outline-none text-sm transition-all"
                  >
                    <option value="admin">Admin CMS (Kelola Konten)</option>
                    <option value="editor">Penulis Konten (Blog)</option>
                    <option value="superadmin">Super Administrator</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold uppercase text-slate-700 mb-1">
                    Status Akun
                  </label>
                  <select
                    value={editForm.status}
                    onChange={(e) => setEditForm({ ...editForm, status: e.target.value as any })}
                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#1853a7] outline-none text-sm transition-all"
                  >
                    <option value="active">Aktif</option>
                    <option value="inactive">Nonaktif</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono font-bold uppercase text-slate-700 mb-1">
                  Ganti Password Baru (Opsional)
                </label>
                <div className="relative">
                  <input
                    type={showEditPass ? "text" : "password"}
                    placeholder="Kosongkan jika tidak ingin mengubah password"
                    value={editForm.password}
                    onChange={(e) => setEditForm({ ...editForm, password: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#1853a7] focus:ring-2 focus:ring-blue-100 outline-none text-sm font-mono transition-all pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowEditPass(!showEditPass)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 text-xs px-2 py-0.5 font-mono"
                  >
                    {showEditPass ? "Hide" : "Show"}
                  </button>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Isi minimal 6 karakter jika ingin sekaligus mengganti password admin ini.
                </p>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditUser(null)}
                  className="px-5 py-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs uppercase tracking-wider transition-all"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={actionLoading === "edit"}
                  className="px-6 py-2.5 rounded-full bg-[#1853a7] hover:bg-[#0f3d7d] text-white font-bold text-xs uppercase tracking-wider shadow-md transition-all disabled:opacity-50"
                >
                  {actionLoading === "edit" ? "Memperbarui..." : "Perbarui Akun"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* MODAL 3: Direct Password Override (Kontrol Password Bawahan Langsung) */}
      {/* =================================================================== */}
      {passwordTargetUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="text-xl">🔑</span>
                <div>
                  <h3 className="font-extrabold text-lg text-slate-900">Ganti Password Admin</h3>
                  <p className="text-xs text-slate-500">Kontrol Langsung Super Admin</p>
                </div>
              </div>
              <button
                onClick={() => setPasswordTargetUser(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs space-y-1">
              <div>
                Target Akun: <strong className="font-bold">{passwordTargetUser.name}</strong>
              </div>
              <div className="font-mono text-[11px] text-amber-800">
                Username: @{passwordTargetUser.username} | Role: {passwordTargetUser.role}
              </div>
              <div className="text-[11px] text-slate-600 pt-1">
                Anda dapat langsung menetapkan password baru untuk akun ini tanpa perlu mengetahui password lama milik admin tersebut.
              </div>
            </div>

            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-mono font-bold uppercase text-slate-700 mb-1">
                  Password Baru <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showResetPass ? "text" : "password"}
                    required
                    placeholder="Minimal 6 karakter"
                    value={resetPassValue}
                    onChange={(e) => setResetPassValue(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-100 outline-none text-sm font-mono transition-all pr-12 font-bold"
                  />
                  <button
                    type="button"
                    onClick={() => setShowResetPass(!showResetPass)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 text-xs px-2 py-0.5 font-mono"
                  >
                    {showResetPass ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setPasswordTargetUser(null)}
                  className="px-5 py-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs uppercase tracking-wider transition-all"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={actionLoading === "password"}
                  className="px-6 py-2.5 rounded-full bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs uppercase tracking-wider shadow-md transition-all disabled:opacity-50"
                >
                  {actionLoading === "password" ? "Menyimpan..." : "Terapkan Password Baru"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
