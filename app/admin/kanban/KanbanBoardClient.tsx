"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import LadiLogo from "@/app/components/LadiLogo";
import AdminLogoutButton from "@/app/components/AdminLogoutButton";
import {
  KanbanCard,
  WorkTimerLog,
  KanbanStatus,
  KanbanPriority,
  KanbanPlatform,
  KanbanOrigin,
  getCanvaEmbedUrl,
} from "@/app/lib/kanban-types";

interface Props {
  initialCards: KanbanCard[];
  initialTimerLogs: WorkTimerLog[];
  initialActiveTimers: WorkTimerLog[];
  currentUser: {
    username: string;
    role: string;
    name: string;
  };
}

const COLUMNS: {
  id: KanbanStatus;
  title: string;
  subtitle: string;
  badgeBg: string;
  badgeBorder: string;
  badgeText: string;
  icon: string;
}[] = [
  {
    id: "draft",
    title: "Draft Ide Super Admin",
    subtitle: "Ide dari Super Admin. Desainer bebas mengambil ide ini ke Proses.",
    badgeBg: "bg-blue-500/10",
    badgeBorder: "border-blue-500/30",
    badgeText: "text-blue-400",
    icon: "💡",
  },
  {
    id: "review_ide",
    title: "Menunggu ACC Ide",
    subtitle: "Ide dari Desainer. Wajib di-ACC Super Admin sebelum bisa dikerjakan.",
    badgeBg: "bg-amber-500/10",
    badgeBorder: "border-amber-500/30",
    badgeText: "text-amber-400",
    icon: "⏳",
  },
  {
    id: "in_progress",
    title: "Sedang Dikerjakan",
    subtitle: "Proyek desain aktif yang sedang dibuat di Canva.",
    badgeBg: "bg-purple-500/10",
    badgeBorder: "border-purple-500/30",
    badgeText: "text-purple-400",
    icon: "⚙️",
  },
  {
    id: "review_design",
    title: "Review Hasil Desain",
    subtitle: "Desain Canva siap dicek & diberi feedback oleh Super Admin.",
    badgeBg: "bg-pink-500/10",
    badgeBorder: "border-pink-500/30",
    badgeText: "text-pink-400",
    icon: "👀",
  },
  {
    id: "done",
    title: "Selesai & Approved",
    subtitle: "Desain final telah disetujui dan siap diterbitkan.",
    badgeBg: "bg-emerald-500/10",
    badgeBorder: "border-emerald-500/30",
    badgeText: "text-emerald-400",
    icon: "✅",
  },
];

const PLATFORMS: KanbanPlatform[] = [
  "Instagram Feeds",
  "Instagram Carousel",
  "Reels / TikTok",
  "Website Banner",
  "Brosur / Flyer",
  "Lainnya",
];

const PRIORITIES: { id: KanbanPriority; label: string; color: string }[] = [
  { id: "low", label: "Rendah", color: "bg-slate-500/15 text-slate-300 border-slate-600" },
  { id: "medium", label: "Sedang", color: "bg-blue-500/15 text-blue-300 border-blue-500/40" },
  { id: "high", label: "Tinggi", color: "bg-amber-500/15 text-amber-300 border-amber-500/40" },
  { id: "urgent", label: "Sangat Penting / Urgent", color: "bg-rose-500/20 text-rose-300 border-rose-500/50" },
];

function formatDuration(seconds: number): string {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  if (hrs > 0) {
    return `${hrs}j ${mins}m ${secs}d`;
  }
  return `${mins}m ${secs}d`;
}

function formatClockTime(isoStr: string): string {
  if (!isoStr) return "-";
  try {
    const d = new Date(isoStr);
    return d.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
  } catch {
    return isoStr;
  }
}

function formatDateIndo(isoStr: string): string {
  if (!isoStr) return "-";
  try {
    const d = new Date(isoStr);
    return d.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return isoStr;
  }
}

export default function KanbanBoardClient({
  initialCards,
  initialTimerLogs,
  initialActiveTimers,
  currentUser,
}: Props) {
  const isSuperAdmin = currentUser.role === "superadmin";

  // State: Cards & Timers
  const [cards, setCards] = useState<KanbanCard[]>(initialCards);
  const [timerLogs, setTimerLogs] = useState<WorkTimerLog[]>(initialTimerLogs);
  const [activeTimers, setActiveTimers] = useState<WorkTimerLog[]>(initialActiveTimers);

  // My Active Timer
  const myActiveTimer = useMemo(() => {
    return (
      activeTimers.find(
        (t) =>
          t.user_name.toLowerCase() === currentUser.username.toLowerCase() ||
          t.user_name.toLowerCase() === currentUser.name.toLowerCase()
      ) || null
    );
  }, [activeTimers, currentUser]);

  // Live ticking timer for my active timer
  const [timerElapsed, setTimerElapsed] = useState<number>(0);
  useEffect(() => {
    if (!myActiveTimer) {
      setTimerElapsed(0);
      return;
    }
    const updateElapsed = () => {
      const start = new Date(myActiveTimer.started_at).getTime();
      const now = Date.now();
      setTimerElapsed(Math.max(0, Math.floor((now - start) / 1000)));
    };
    updateElapsed();
    const interval = setInterval(updateElapsed, 1000);
    return () => clearInterval(interval);
  }, [myActiveTimer]);

  // UI Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [filterPlatform, setFilterPlatform] = useState<string>("all");
  const [filterPriority, setFilterPriority] = useState<string>("all");

  // Modals & Panels
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingCard, setEditingCard] = useState<KanbanCard | null>(null);
  const [viewingCard, setViewingCard] = useState<KanbanCard | null>(null);
  const [canvaPreviewUrl, setCanvaPreviewUrl] = useState<string | null>(null);
  const [isTimerMonitorOpen, setIsTimerMonitorOpen] = useState(false);
  const [isStopTimerModalOpen, setIsStopTimerModalOpen] = useState(false);
  const [stopTimerNotes, setStopTimerNotes] = useState("");

  // Toast / Notifications
  const [toast, setToast] = useState<{ type: "success" | "error" | "warning"; message: string } | null>(null);
  const showToast = (type: "success" | "error" | "warning", message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4500);
  };

  // Drag and Drop State
  const [draggingCardId, setDraggingCardId] = useState<number | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<KanbanStatus | null>(null);

  // Form State for Create Card
  const [cardForm, setCardForm] = useState({
    title: "",
    description: "",
    canva_url: "",
    status: (isSuperAdmin ? "draft" : "review_ide") as KanbanStatus,
    origin: (isSuperAdmin ? "admin" : "designer") as KanbanOrigin,
    priority: "medium" as KanbanPriority,
    platform: "Instagram Feeds" as KanbanPlatform,
    assignee_name: currentUser.name || "Tim Desainer",
    deadline: "",
    admin_notes: "",
  });

  // Reset form when modal opens
  const openAddModal = (defaultStatus: KanbanStatus = isSuperAdmin ? "draft" : "review_ide") => {
    setCardForm({
      title: "",
      description: "",
      canva_url: "",
      status: defaultStatus,
      origin: isSuperAdmin ? "admin" : "designer",
      priority: "medium",
      platform: "Instagram Feeds",
      assignee_name: currentUser.name || "Tim Desainer",
      deadline: "",
      admin_notes: "",
    });
    setIsAddModalOpen(true);
  };

  // ==========================================
  // CARD ACTIONS
  // ==========================================

  const handleCreateCard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cardForm.title.trim()) {
      showToast("error", "Judul proyek wajib diisi.");
      return;
    }

    try {
      const res = await fetch("/api/kanban", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cardForm),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Gagal membuat kartu.");
      }

      setCards((prev) => [data.card, ...prev]);
      setIsAddModalOpen(false);
      showToast("success", "Kartu proyek berhasil ditambahkan ke Kanban!");
    } catch (err: any) {
      showToast("error", err.message || "Terjadi kesalahan.");
    }
  };

  const handleUpdateCard = async (id: number, payload: Partial<KanbanCard>) => {
    try {
      const res = await fetch(`/api/kanban/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Gagal memperbarui kartu.");
      }

      setCards((prev) => prev.map((c) => (c.id === id ? data.card : c)));
      if (editingCard?.id === id) setEditingCard(data.card);
      if (viewingCard?.id === id) setViewingCard(data.card);
      showToast("success", "Kartu berhasil diperbarui.");
      return data.card;
    } catch (err: any) {
      showToast("error", err.message || "Gagal memperbarui kartu.");
      throw err;
    }
  };

  const handleDeleteCard = async (id: number) => {
    if (!confirm("Apakah Anda yakin ingin menghapus kartu proyek ini?")) return;
    try {
      const res = await fetch(`/api/kanban/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Gagal menghapus kartu.");
      }
      setCards((prev) => prev.filter((c) => c.id !== id));
      if (viewingCard?.id === id) setViewingCard(null);
      if (editingCard?.id === id) setEditingCard(null);
      showToast("success", "Kartu proyek telah dihapus.");
    } catch (err: any) {
      showToast("error", err.message || "Gagal menghapus.");
    }
  };

  // Super Admin 1-Click ACC Ide
  const handleApproveIdea = async (card: KanbanCard) => {
    if (!isSuperAdmin) {
      showToast("error", "Hanya Super Admin yang berhak menyetujui (ACC) ide ini.");
      return;
    }
    try {
      const res = await fetch(`/api/kanban/${card.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "approve_idea" }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Gagal menyetujui ide.");
      }
      setCards((prev) => prev.map((c) => (c.id === card.id ? data.card : c)));
      if (viewingCard?.id === card.id) setViewingCard(data.card);
      showToast("success", `✨ Ide "${card.title}" telah di-ACC dan dipindahkan ke Sedang Dikerjakan!`);
    } catch (err: any) {
      showToast("error", err.message || "Gagal meng-ACC ide.");
    }
  };

  // ==========================================
  // DRAG & DROP LOGIC WITH APPROVAL RULES
  // ==========================================

  const handleDragStart = (e: React.DragEvent, card: KanbanCard) => {
    setDraggingCardId(card.id);
    e.dataTransfer.setData("text/plain", String(card.id));
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent, colId: KanbanStatus) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (dragOverColumn !== colId) {
      setDragOverColumn(colId);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent, targetColumn: KanbanStatus) => {
    e.preventDefault();
    setDragOverColumn(null);
    const idStr = e.dataTransfer.getData("text/plain");
    const cardId = Number(idStr) || draggingCardId;
    setDraggingCardId(null);

    if (!cardId) return;
    const card = cards.find((c) => c.id === cardId);
    if (!card || card.status === targetColumn) return;

    // VALIDASI ATURAN SPESIFIK USER:
    // "Kalau pakai ide sendiri, belum bisa ditaruh di kanban sedang dikerjakan/proses.
    // Harus menunggu acc saya baru bisa digerakkan kanbannya"
    if (
      targetColumn === "in_progress" &&
      card.status === "review_ide" &&
      card.origin === "designer" &&
      !card.is_approved_by_admin
    ) {
      if (!isSuperAdmin) {
        showToast(
          "warning",
          "⚠️ Ide ini belum di-ACC oleh Super Admin! Hanya Super Admin yang dapat menyetujui dan memindahkannya ke Proses."
        );
        return;
      } else {
        // Super admin moving it directly approves it!
        showToast("success", "👑 Super Admin meng-ACC ide ini & memindahkannya ke Sedang Dikerjakan.");
      }
    }

    // Optimistic UI update
    const previousCards = [...cards];
    setCards((prev) =>
      prev.map((c) =>
        c.id === cardId
          ? {
              ...c,
              status: targetColumn,
              is_approved_by_admin:
                targetColumn === "in_progress" && c.status === "review_ide" && isSuperAdmin
                  ? true
                  : c.is_approved_by_admin,
            }
          : c
      )
    );

    try {
      const res = await fetch(`/api/kanban/${cardId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: targetColumn,
          ...(targetColumn === "in_progress" && card.status === "review_ide" && isSuperAdmin
            ? { is_approved_by_admin: true }
            : {}),
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setCards(previousCards);
        throw new Error(data.error || "Gagal memindahkan kartu.");
      }
      setCards((prev) => prev.map((c) => (c.id === cardId ? data.card : c)));
    } catch (err: any) {
      setCards(previousCards);
      showToast("error", err.message || "Gagal memindahkan kartu.");
    }
  };

  // ==========================================
  // WORK TIMER ACTIONS
  // ==========================================

  const handleStartTimer = async (taskId?: number, taskTitle?: string) => {
    try {
      const res = await fetch("/api/work-timer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          task_id: taskId,
          task_title: taskTitle || "Pengerjaan Desain Konten",
          user_name: currentUser.name || currentUser.username,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Gagal memulai timer.");
      }

      setActiveTimers((prev) => [
        data.log,
        ...prev.filter(
          (t) =>
            t.user_name.toLowerCase() !== (currentUser.name || currentUser.username).toLowerCase()
        ),
      ]);
      setTimerLogs((prev) => [data.log, ...prev]);
      showToast("success", `⏱️ Jam kerja dimulai untuk: ${taskTitle || "Pengerjaan Desain"}`);
    } catch (err: any) {
      showToast("error", err.message || "Gagal memulai jam kerja.");
    }
  };

  const handleStopTimer = async () => {
    if (!myActiveTimer) return;
    try {
      const res = await fetch("/api/work-timer", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: myActiveTimer.id,
          notes: stopTimerNotes,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Gagal menghentikan timer.");
      }

      setActiveTimers((prev) => prev.filter((t) => t.id !== myActiveTimer.id));
      setTimerLogs((prev) => prev.map((t) => (t.id === myActiveTimer.id ? data.log : t)));
      setIsStopTimerModalOpen(false);
      setStopTimerNotes("");
      showToast(
        "success",
        `🎉 Jam kerja dihentikan! Durasi tercatat: ${formatDuration(data.log?.duration_seconds || timerElapsed)}.`
      );
    } catch (err: any) {
      showToast("error", err.message || "Gagal menghentikan jam kerja.");
    }
  };

  const handleDeleteTimerLog = async (id: number) => {
    if (!isSuperAdmin) return;
    if (!confirm("Hapus catatan jam kerja ini?")) return;
    try {
      const res = await fetch(`/api/work-timer?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Gagal menghapus log.");
      }
      setTimerLogs((prev) => prev.filter((t) => t.id !== id));
      setActiveTimers((prev) => prev.filter((t) => t.id !== id));
      showToast("success", "Log jam kerja berhasil dihapus.");
    } catch (err: any) {
      showToast("error", err.message || "Gagal menghapus.");
    }
  };

  // Filtered Cards
  const filteredCards = useMemo(() => {
    return cards.filter((card) => {
      const matchesSearch =
        !searchQuery ||
        card.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        card.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        card.assignee_name.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesPlatform = filterPlatform === "all" || card.platform === filterPlatform;
      const matchesPriority = filterPriority === "all" || card.priority === filterPriority;

      return matchesSearch && matchesPlatform && matchesPriority;
    });
  }, [cards, searchQuery, filterPlatform, filterPriority]);

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col font-sans">
      {/* ========================================== */}
      {/* TOP HEADER */}
      {/* ========================================== */}
      <header className="sticky top-0 z-30 bg-[#0d1424]/95 backdrop-blur border-b border-slate-800/80 px-4 sm:px-6 py-3">
        <div className="max-w-[1700px] mx-auto flex flex-wrap items-center justify-between gap-3">
          {/* Logo & Navigation */}
          <div className="flex items-center gap-3">
            <Link
              href="/admin"
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 transition"
            >
              ← <span className="hidden sm:inline">Kembali ke</span> Dashboard
            </Link>
            <div className="h-5 w-px bg-slate-800 hidden sm:block" />
            <LadiLogo inverted={true} />
            <span className="hidden md:inline-flex items-center gap-1.5 text-xs font-mono px-2.5 py-0.5 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-300">
              🎨 KANBAN DESAIN & JAM KERJA
            </span>
          </div>

          {/* Center: Live Timer Widget & Punch In/Out */}
          <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-800 px-3 py-1.5 rounded-xl shadow-inner">
            <div className="flex items-center gap-2">
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  myActiveTimer ? "bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]" : "bg-slate-600"
                }`}
              />
              <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider hidden sm:inline">
                {myActiveTimer ? "Sedang Bekerja" : "Jam Kerja"}
              </span>
              <span
                className={`font-mono text-sm sm:text-base font-bold ${
                  myActiveTimer ? "text-emerald-300" : "text-slate-400"
                }`}
              >
                {myActiveTimer ? formatDuration(timerElapsed) : "00:00:00"}
              </span>
            </div>

            {myActiveTimer ? (
              <button
                onClick={() => setIsStopTimerModalOpen(true)}
                className="ml-2 text-xs font-semibold px-3 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 transition flex items-center gap-1.5"
              >
                ⏹️ Selesai Kerja
              </button>
            ) : (
              <button
                onClick={() => handleStartTimer()}
                className="ml-2 text-xs font-semibold px-3 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-slate-950 shadow-md shadow-emerald-500/20 transition flex items-center gap-1.5 font-sans"
              >
                ▶️ Mulai Kerja
              </button>
            )}

            {/* Super Admin Monitor Button */}
            <button
              onClick={() => setIsTimerMonitorOpen(true)}
              className="ml-1 text-xs text-slate-300 hover:text-white px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 transition flex items-center gap-1"
              title="Pantau Jam Kerja Seluruh Tim"
            >
              ⏱️ <span className="hidden sm:inline">Pantau Jam Kerja</span>
              {activeTimers.length > 0 && (
                <span className="text-[10px] bg-emerald-500 text-slate-950 font-bold px-1.5 py-0.2 rounded-full">
                  {activeTimers.length}
                </span>
              )}
            </button>
          </div>

          {/* User Profile & Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => openAddModal()}
              className="text-xs font-medium px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-500/20 transition flex items-center gap-1.5"
            >
              <span>+</span> <span>Tambah Ide / Kartu</span>
            </button>
            <div className="hidden lg:flex items-center gap-2 pl-2 border-l border-slate-800 text-xs">
              <span className="text-slate-400">Halo,</span>
              <span className="font-semibold text-slate-200">{currentUser.name || currentUser.username}</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                {isSuperAdmin ? "👑 Super Admin" : "🎨 Desainer"}
              </span>
            </div>
            <AdminLogoutButton />
          </div>
        </div>

        {/* Filter Bar */}
        <div className="max-w-[1700px] mx-auto mt-3 pt-2.5 border-t border-slate-800/60 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-2.5 flex-1 min-w-[280px]">
            {/* Search */}
            <div className="relative min-w-[200px] flex-1 max-w-xs">
              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs">🔍</span>
              <input
                type="text"
                placeholder="Cari kartu, deskripsi, desainer..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-slate-900/90 border border-slate-800 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 text-xs"
              />
            </div>

            {/* Platform Filter */}
            <select
              value={filterPlatform}
              onChange={(e) => setFilterPlatform(e.target.value)}
              className="py-1.5 px-2.5 rounded-lg bg-slate-900/90 border border-slate-800 text-slate-300 focus:outline-none focus:border-blue-500 text-xs"
            >
              <option value="all">Semua Format / Platform</option>
              {PLATFORMS.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>

            {/* Priority Filter */}
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="py-1.5 px-2.5 rounded-lg bg-slate-900/90 border border-slate-800 text-slate-300 focus:outline-none focus:border-blue-500 text-xs"
            >
              <option value="all">Semua Prioritas</option>
              {PRIORITIES.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.label}
                </option>
              ))}
            </select>

            {(searchQuery || filterPlatform !== "all" || filterPriority !== "all") && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setFilterPlatform("all");
                  setFilterPriority("all");
                }}
                className="text-slate-400 hover:text-slate-200 underline text-xs"
              >
                Reset Filter
              </button>
            )}
          </div>

          {/* Quick Stats Summary */}
          <div className="flex items-center gap-3 text-slate-400 font-mono text-[11px]">
            <span>Total: <strong className="text-slate-200">{filteredCards.length}</strong> Kartu</span>
            <span>•</span>
            <span className="text-amber-400">
              Menunggu ACC: <strong>{cards.filter((c) => c.status === "review_ide").length}</strong>
            </span>
            <span>•</span>
            <span className="text-emerald-400">
              Selesai: <strong>{cards.filter((c) => c.status === "done").length}</strong>
            </span>
          </div>
        </div>
      </header>

      {/* ========================================== */}
      {/* TOAST ALERT */}
      {/* ========================================== */}
      {toast && (
        <div
          className={`fixed bottom-5 right-5 z-50 px-4 py-3 rounded-xl shadow-2xl border text-sm max-w-md flex items-start gap-3 backdrop-blur-md transition-all ${
            toast.type === "success"
              ? "bg-emerald-950/90 border-emerald-500/50 text-emerald-200"
              : toast.type === "warning"
              ? "bg-amber-950/90 border-amber-500/50 text-amber-200"
              : "bg-rose-950/90 border-rose-500/50 text-rose-200"
          }`}
        >
          <span className="text-lg">
            {toast.type === "success" ? "✅" : toast.type === "warning" ? "⚠️" : "❌"}
          </span>
          <div className="flex-1 text-xs leading-relaxed">{toast.message}</div>
          <button
            onClick={() => setToast(null)}
            className="text-slate-400 hover:text-white text-xs ml-2"
          >
            ✕
          </button>
        </div>
      )}

      {/* ========================================== */}
      {/* NOTION-STYLE KANBAN BOARD CANVAS */}
      {/* ========================================== */}
      <main className="flex-1 p-4 sm:p-6 overflow-x-auto">
        <div className="flex gap-4 items-start min-w-[1300px] max-w-[1800px] mx-auto">
          {COLUMNS.map((col) => {
            const columnCards = filteredCards.filter((c) => c.status === col.id);
            const isDropTarget = dragOverColumn === col.id;

            return (
              <div
                key={col.id}
                onDragOver={(e) => handleDragOver(e, col.id)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, col.id)}
                className={`flex-1 min-w-[280px] max-w-[340px] rounded-2xl flex flex-col bg-[#0f172a]/70 border transition-all duration-200 ${
                  isDropTarget
                    ? "border-blue-500 ring-2 ring-blue-500/30 bg-blue-950/20"
                    : "border-slate-800/80"
                }`}
              >
                {/* Column Header */}
                <div className="p-3.5 border-b border-slate-800/70">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="text-base">{col.icon}</span>
                      <h3 className="font-semibold text-sm text-slate-200 tracking-tight">
                        {col.title}
                      </h3>
                    </div>
                    <span
                      className={`text-xs font-mono font-bold px-2 py-0.5 rounded-full border ${col.badgeBg} ${col.badgeBorder} ${col.badgeText}`}
                    >
                      {columnCards.length}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-tight">
                    {col.subtitle}
                  </p>
                </div>

                {/* Cards Container */}
                <div className="p-2.5 flex-1 min-h-[480px] space-y-2.5 overflow-y-auto max-h-[calc(100vh-250px)]">
                  {columnCards.map((card) => {
                    const isDragging = draggingCardId === card.id;
                    const canvaEmbedUrl = card.canva_url ? getCanvaEmbedUrl(card.canva_url) : "";
                    const priorityConfig = PRIORITIES.find((p) => p.id === card.priority);

                    return (
                      <div
                        key={card.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, card)}
                        className={`group relative bg-[#131b2e] border rounded-xl p-3.5 transition-all shadow-sm hover:shadow-lg cursor-grab active:cursor-grabbing ${
                          isDragging
                            ? "opacity-40 scale-95 border-dashed border-blue-400"
                            : "border-slate-800 hover:border-slate-700 bg-gradient-to-b from-[#141e33] to-[#111827]"
                        }`}
                      >
                        {/* Top Badges */}
                        <div className="flex items-center justify-between gap-1.5 mb-2 text-[10px]">
                          <div className="flex flex-wrap items-center gap-1.5">
                            {/* Platform */}
                            <span className="px-2 py-0.5 rounded-md bg-slate-800/80 text-slate-300 font-medium border border-slate-700/60">
                              {card.platform}
                            </span>
                            {/* Priority */}
                            {priorityConfig && (
                              <span
                                className={`px-2 py-0.5 rounded-md font-medium border ${priorityConfig.color}`}
                              >
                                {priorityConfig.label}
                              </span>
                            )}
                          </div>

                          {/* Origin Badge */}
                          {card.origin === "admin" ? (
                            <span
                              className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-blue-500/15 text-blue-300 border border-blue-500/30"
                              title="Ide diinput oleh Super Admin"
                            >
                              💡 Ide Admin
                            </span>
                          ) : (
                            <span
                              className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-pink-500/15 text-pink-300 border border-pink-500/30"
                              title="Ide diusulkan oleh Desainer"
                            >
                              🎨 Ide Desainer
                            </span>
                          )}
                        </div>

                        {/* Title */}
                        <h4
                          onClick={() => setViewingCard(card)}
                          className="font-medium text-slate-100 text-sm leading-snug hover:text-blue-400 transition cursor-pointer mb-1.5 line-clamp-2"
                        >
                          {card.title}
                        </h4>

                        {/* Description snippet */}
                        {card.description && (
                          <p className="text-xs text-slate-400 line-clamp-2 mb-2.5 leading-relaxed">
                            {card.description}
                          </p>
                        )}

                        {/* Canva Live Preview Pill / Button */}
                        {card.canva_url ? (
                          <div className="mb-2.5 bg-gradient-to-r from-[#00c4cc]/10 to-[#7d2ae8]/10 border border-[#00c4cc]/30 rounded-lg p-2 flex items-center justify-between text-xs">
                            <div className="flex items-center gap-1.5 overflow-hidden">
                              <span className="text-sm">🎨</span>
                              <span className="font-semibold text-slate-200 truncate text-[11px]">
                                Desain Canva Terhubung
                              </span>
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setCanvaPreviewUrl(card.canva_url);
                              }}
                              className="text-[10px] font-semibold px-2 py-0.5 rounded bg-[#00c4cc] hover:bg-[#00b0b8] text-slate-950 transition flex items-center gap-1 shadow-sm shrink-0"
                            >
                              👁️ Pratinjau Cepat
                            </button>
                          </div>
                        ) : (
                          <div className="mb-2.5 text-[11px] text-slate-500 italic flex items-center gap-1">
                            <span>📎</span> <span>Belum ada link Canva</span>
                          </div>
                        )}

                        {/* Special Notification for 'review_ide' column */}
                        {card.status === "review_ide" && (
                          <div className="mb-2 p-2 rounded-lg bg-amber-500/10 border border-amber-500/30 text-[11px] text-amber-200 flex flex-col gap-1.5">
                            <div className="flex items-center gap-1.5 font-semibold">
                              <span>⏳</span> <span>Menunggu ACC Super Admin</span>
                            </div>
                            <p className="text-[10px] text-amber-300/80 leading-tight">
                              Desainer belum bisa menggeser kartu ini ke &quot;Sedang Dikerjakan&quot; sebelum disetujui.
                            </p>
                            {isSuperAdmin && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleApproveIdea(card);
                                }}
                                className="w-full mt-1 py-1 px-2 rounded-md bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs transition shadow flex items-center justify-center gap-1"
                              >
                                ✓ ACC Ide Ini Sekarang
                              </button>
                            )}
                          </div>
                        )}

                        {/* Admin Notes Preview */}
                        {card.admin_notes && (
                          <div className="mb-2 text-[10px] bg-slate-900/80 border border-slate-800 rounded p-1.5 text-slate-300">
                            <strong className="text-blue-400">Catatan Admin:</strong> {card.admin_notes}
                          </div>
                        )}

                        {/* Bottom Meta & Quick Actions */}
                        <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                          <div className="flex items-center gap-1 truncate max-w-[140px]">
                            <span>👤</span>
                            <span className="truncate">{card.assignee_name || "Belum ditugaskan"}</span>
                          </div>

                          <div className="flex items-center gap-1">
                            {/* Start Timer with this task */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleStartTimer(card.id, card.title);
                              }}
                              className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-emerald-400 transition"
                              title="Mulai hitung jam kerja untuk tugas ini"
                            >
                              ⏱️
                            </button>
                            {/* Edit */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditingCard(card);
                              }}
                              className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-blue-400 transition"
                              title="Edit kartu"
                            >
                              ✏️
                            </button>
                            {/* Delete (Super Admin only or card creator) */}
                            {isSuperAdmin && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteCard(card.id);
                                }}
                                className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-rose-400 transition"
                                title="Hapus kartu"
                              >
                                🗑️
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {/* Empty state per column */}
                  {columnCards.length === 0 && (
                    <div className="h-32 border border-dashed border-slate-800/80 rounded-xl flex flex-col items-center justify-center text-slate-500 text-xs p-4 text-center">
                      <span className="text-lg opacity-40 mb-1">{col.icon}</span>
                      <span>Belum ada kartu di kolom ini</span>
                      <button
                        onClick={() => openAddModal(col.id)}
                        className="mt-2 text-[11px] text-blue-400 hover:underline"
                      >
                        + Tambah ke sini
                      </button>
                    </div>
                  )}
                </div>

                {/* Column Footer: Quick Add Card */}
                <div className="p-2.5 border-t border-slate-800/60 bg-[#0d1424]/40 rounded-b-2xl">
                  <button
                    onClick={() => openAddModal(col.id)}
                    className="w-full py-1.5 px-3 rounded-lg text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800/80 border border-transparent hover:border-slate-700 transition flex items-center justify-center gap-1.5"
                  >
                    <span>+</span> <span>Tambah Kartu</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* ========================================== */}
      {/* MODAL: CANVA QUICK VIEW (EMBED MODAL) */}
      {/* ========================================== */}
      {canvaPreviewUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-fadeIn">
          <div className="bg-[#0f172a] border border-slate-700 rounded-2xl w-full max-w-5xl h-[85vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Modal Top Bar */}
            <div className="p-3.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xl">🎨</span>
                <div>
                  <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2">
                    Pratinjau Desain Canva (Live Quick View)
                  </h3>
                  <p className="text-[11px] text-slate-400 font-mono truncate max-w-md">
                    {canvaPreviewUrl}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={canvaPreviewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1 transition"
                >
                  Buka di Canva Tab Baru ↗
                </a>
                <button
                  onClick={() => setCanvaPreviewUrl(null)}
                  className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Embedded Iframe */}
            <div className="flex-1 bg-slate-950 relative">
              <iframe
                src={getCanvaEmbedUrl(canvaPreviewUrl)}
                title="Canva Quick Preview"
                className="w-full h-full border-0"
                allowFullScreen
                loading="lazy"
              />
            </div>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* MODAL: CREATE CARD */}
      {/* ========================================== */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-[#0f172a] border border-slate-800 rounded-2xl w-full max-w-xl p-6 shadow-2xl my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="text-xl">✨</span>
                <h3 className="font-bold text-base text-slate-100">
                  Tambah Kartu Proyek Desain
                </h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateCard} className="space-y-4 mt-4 text-xs">
              {/* Judul */}
              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Judul Proyek / Ide Konten <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Carousel Edukasi 5 Manfaat Website untuk UMKM"
                  value={cardForm.title}
                  onChange={(e) => setCardForm({ ...cardForm, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 focus:outline-none focus:border-blue-500 text-xs"
                />
              </div>

              {/* Deskripsi */}
              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Deskripsi / Brief Konten
                </label>
                <textarea
                  rows={3}
                  placeholder="Jelaskan copywriting, tone warna, jumlah slide, poin penting konten..."
                  value={cardForm.description}
                  onChange={(e) => setCardForm({ ...cardForm, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 focus:outline-none focus:border-blue-500 text-xs"
                />
              </div>

              {/* Canva Link */}
              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Link Desain Canva (View Link / Edit Link)
                </label>
                <input
                  type="url"
                  placeholder="https://www.canva.com/design/.../view"
                  value={cardForm.canva_url}
                  onChange={(e) => setCardForm({ ...cardForm, canva_url: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 focus:outline-none focus:border-blue-500 text-xs"
                />
                <p className="text-[10px] text-slate-400 mt-1">
                  💡 Cukup tempel link Canva apa saja, sistem otomatis mengubahnya menjadi pratinjau langsung tanpa perlu upload gambar manual.
                </p>
              </div>

              {/* Format & Prioritas */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    Format / Platform
                  </label>
                  <select
                    value={cardForm.platform}
                    onChange={(e) =>
                      setCardForm({ ...cardForm, platform: e.target.value as KanbanPlatform })
                    }
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 focus:outline-none focus:border-blue-500 text-xs"
                  >
                    {PLATFORMS.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Prioritas</label>
                  <select
                    value={cardForm.priority}
                    onChange={(e) =>
                      setCardForm({ ...cardForm, priority: e.target.value as KanbanPriority })
                    }
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 focus:outline-none focus:border-blue-500 text-xs"
                  >
                    {PRIORITIES.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Kolom Status & Sumber Ide */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    Kolom Kanban Awal
                  </label>
                  <select
                    value={cardForm.status}
                    onChange={(e) =>
                      setCardForm({ ...cardForm, status: e.target.value as KanbanStatus })
                    }
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 focus:outline-none focus:border-blue-500 text-xs"
                  >
                    {COLUMNS.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.icon} {c.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    Sumber Ide
                  </label>
                  <select
                    value={cardForm.origin}
                    disabled={!isSuperAdmin}
                    onChange={(e) =>
                      setCardForm({ ...cardForm, origin: e.target.value as KanbanOrigin })
                    }
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 focus:outline-none focus:border-blue-500 text-xs disabled:opacity-50"
                  >
                    <option value="admin">💡 Ide Super Admin (Bebas diambil)</option>
                    <option value="designer">🎨 Ide Desainer (Wajib ACC)</option>
                  </select>
                </div>
              </div>

              {/* Desainer & Deadline */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    Ditugaskan Kepada
                  </label>
                  <input
                    type="text"
                    placeholder="Nama Desainer"
                    value={cardForm.assignee_name}
                    onChange={(e) => setCardForm({ ...cardForm, assignee_name: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 focus:outline-none focus:border-blue-500 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    Target Selesai (Deadline)
                  </label>
                  <input
                    type="date"
                    value={cardForm.deadline}
                    onChange={(e) => setCardForm({ ...cardForm, deadline: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 focus:outline-none focus:border-blue-500 text-xs"
                  />
                </div>
              </div>

              {/* Catatan Admin */}
              {isSuperAdmin && (
                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    Catatan Khusus Super Admin
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Fokus ke copywriting slide 2 & 4, tone visual elegan"
                    value={cardForm.admin_notes}
                    onChange={(e) => setCardForm({ ...cardForm, admin_notes: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 focus:outline-none focus:border-blue-500 text-xs"
                  />
                </div>
              )}

              {/* Buttons */}
              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs transition shadow-lg shadow-blue-600/20"
                >
                  Simpan Kartu Proyek
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* MODAL: EDIT CARD */}
      {/* ========================================== */}
      {editingCard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-[#0f172a] border border-slate-800 rounded-2xl w-full max-w-xl p-6 shadow-2xl my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="text-xl">✏️</span>
                <h3 className="font-bold text-base text-slate-100">
                  Edit Kartu Proyek Desain
                </h3>
              </div>
              <button
                onClick={() => setEditingCard(null)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                await handleUpdateCard(editingCard.id, editingCard);
                setEditingCard(null);
              }}
              className="space-y-4 mt-4 text-xs"
            >
              <div>
                <label className="block text-slate-300 font-medium mb-1">Judul Proyek</label>
                <input
                  type="text"
                  required
                  value={editingCard.title}
                  onChange={(e) => setEditingCard({ ...editingCard, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 focus:outline-none focus:border-blue-500 text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Deskripsi / Brief</label>
                <textarea
                  rows={3}
                  value={editingCard.description}
                  onChange={(e) =>
                    setEditingCard({ ...editingCard, description: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 focus:outline-none focus:border-blue-500 text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Link Canva</label>
                <input
                  type="url"
                  value={editingCard.canva_url}
                  onChange={(e) =>
                    setEditingCard({ ...editingCard, canva_url: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 focus:outline-none focus:border-blue-500 text-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Status / Kolom</label>
                  <select
                    value={editingCard.status}
                    onChange={(e) =>
                      setEditingCard({
                        ...editingCard,
                        status: e.target.value as KanbanStatus,
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 focus:outline-none focus:border-blue-500 text-xs"
                  >
                    {COLUMNS.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.icon} {c.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Prioritas</label>
                  <select
                    value={editingCard.priority}
                    onChange={(e) =>
                      setEditingCard({
                        ...editingCard,
                        priority: e.target.value as KanbanPriority,
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 focus:outline-none focus:border-blue-500 text-xs"
                  >
                    {PRIORITIES.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Format Platform</label>
                  <select
                    value={editingCard.platform}
                    onChange={(e) =>
                      setEditingCard({
                        ...editingCard,
                        platform: e.target.value as KanbanPlatform,
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 focus:outline-none focus:border-blue-500 text-xs"
                  >
                    {PLATFORMS.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Ditugaskan Kepada</label>
                  <input
                    type="text"
                    value={editingCard.assignee_name}
                    onChange={(e) =>
                      setEditingCard({ ...editingCard, assignee_name: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 focus:outline-none focus:border-blue-500 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Catatan Admin / Feedback
                </label>
                <input
                  type="text"
                  value={editingCard.admin_notes || ""}
                  onChange={(e) =>
                    setEditingCard({ ...editingCard, admin_notes: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 focus:outline-none focus:border-blue-500 text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingCard(null)}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs transition shadow-lg shadow-blue-600/20"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* MODAL: NOTION-STYLE CARD DETAIL VIEW */}
      {/* ========================================== */}
      {viewingCard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 overflow-y-auto">
          <div className="bg-[#0f172a] border border-slate-700 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden my-6">
            {/* Modal Header */}
            <div className="p-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xl">📄</span>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                  ID #{viewingCard.id}
                </span>
                <span className="text-xs font-medium text-slate-400">
                  {viewingCard.platform}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const card = viewingCard;
                    setViewingCard(null);
                    setEditingCard(card);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition"
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={() => setViewingCard(null)}
                  className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto space-y-5 text-xs">
              {/* Title & Status Bar */}
              <div>
                <h2 className="text-xl font-bold text-white mb-3">
                  {viewingCard.title}
                </h2>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-200">
                    Status: <strong>{COLUMNS.find((c) => c.id === viewingCard.status)?.title}</strong>
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-200">
                    Ditugaskan: <strong>{viewingCard.assignee_name || "-"}</strong>
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-200">
                    Sumber: <strong>{viewingCard.origin === "admin" ? "Ide Super Admin" : "Ide Desainer"}</strong>
                  </span>
                  {viewingCard.deadline && (
                    <span className="px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700 text-amber-300">
                      Deadline: <strong>{formatDateIndo(viewingCard.deadline)}</strong>
                    </span>
                  )}
                </div>
              </div>

              {/* Special Approval Notice */}
              {viewingCard.status === "review_ide" && (
                <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-amber-300">
                    <span className="text-lg">⏳</span>
                    <div>
                      <p className="font-semibold text-xs">Status Menunggu ACC Super Admin</p>
                      <p className="text-[11px] text-amber-300/70">
                        Ide ini diajukan oleh desainer dan memerlukan izin Super Admin sebelum diproses.
                      </p>
                    </div>
                  </div>
                  {isSuperAdmin && (
                    <button
                      onClick={() => handleApproveIdea(viewingCard)}
                      className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs transition shadow shrink-0"
                    >
                      ✓ ACC Ide Ini Sekarang
                    </button>
                  )}
                </div>
              )}

              {/* Canva Live Preview Frame (if link exists) */}
              {viewingCard.canva_url ? (
                <div className="rounded-xl border border-slate-700 overflow-hidden bg-slate-950">
                  <div className="px-4 py-2 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
                    <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                      <span>🎨</span> Canva Live Preview
                    </span>
                    <a
                      href={viewingCard.canva_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:underline text-xs flex items-center gap-1"
                    >
                      Buka di Canva ↗
                    </a>
                  </div>
                  <div className="h-96 w-full">
                    <iframe
                      src={getCanvaEmbedUrl(viewingCard.canva_url)}
                      title="Canva Detail View"
                      className="w-full h-full border-0"
                      allowFullScreen
                      loading="lazy"
                    />
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-xl border border-dashed border-slate-800 text-slate-400 flex items-center justify-between">
                  <span>📎 Belum ada link desain Canva yang dilampirkan.</span>
                  <button
                    onClick={() => {
                      const card = viewingCard;
                      setViewingCard(null);
                      setEditingCard(card);
                    }}
                    className="text-blue-400 hover:underline text-xs"
                  >
                    + Lampirkan Link Canva
                  </button>
                </div>
              )}

              {/* Description & Brief */}
              <div>
                <h4 className="font-semibold text-slate-300 mb-1.5 uppercase tracking-wider text-[11px]">
                  Deskripsi & Brief Konten
                </h4>
                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 whitespace-pre-wrap leading-relaxed">
                  {viewingCard.description || "Tidak ada deskripsi rinci."}
                </div>
              </div>

              {/* Super Admin Notes */}
              <div>
                <h4 className="font-semibold text-slate-300 mb-1.5 uppercase tracking-wider text-[11px]">
                  Catatan Khusus Super Admin
                </h4>
                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300">
                  {viewingCard.admin_notes || "Belum ada catatan khusus."}
                </div>
              </div>

              {/* Bottom Quick Timer Action */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                <span className="text-slate-500 text-[11px]">
                  Dibuat pada: {formatDateIndo(viewingCard.created_at)}
                </span>
                <button
                  onClick={() => {
                    handleStartTimer(viewingCard.id, viewingCard.title);
                    setViewingCard(null);
                  }}
                  className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-semibold text-xs transition flex items-center gap-1.5 shadow-md shadow-emerald-500/20"
                >
                  ⏱️ Mulai Jam Kerja untuk Tugas Ini
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* MODAL: STOP TIMER CONFIRMATION */}
      {/* ========================================== */}
      {isStopTimerModalOpen && myActiveTimer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#0f172a] border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <h3 className="font-bold text-base text-slate-100 flex items-center gap-2 mb-2">
              ⏹️ Selesaikan Sesi Jam Kerja
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Durasi sesi saat ini: <strong className="text-emerald-400">{formatDuration(timerElapsed)}</strong>
            </p>

            <div className="mb-4">
              <label className="block text-slate-300 font-medium text-xs mb-1">
                Catatan Hasil Pengerjaan (Opsional)
              </label>
              <textarea
                rows={3}
                placeholder="Contoh: Selesai mendesain 5 slide carousel di Canva..."
                value={stopTimerNotes}
                onChange={(e) => setStopTimerNotes(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 focus:outline-none focus:border-blue-500 text-xs"
              />
            </div>

            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsStopTimerModalOpen(false)}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleStopTimer}
                className="px-5 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-medium text-xs transition shadow-lg shadow-rose-600/20"
              >
                Hentikan & Simpan Log
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* DRAWER / MODAL: PANTAU JAM KERJA (SUPER ADMIN MONITOR) */}
      {/* ========================================== */}
      {isTimerMonitorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto">
          <div className="bg-[#0f172a] border border-slate-700 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden my-6">
            {/* Header */}
            <div className="p-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xl">⏱️</span>
                <div>
                  <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2">
                    Monitoring Jam Kerja Tim Desainer
                    {activeTimers.length > 0 && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-mono">
                        🟢 {activeTimers.length} Sedang Bekerja
                      </span>
                    )}
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Pantau kapan tim mulai kerja, selesai kerja, serta total durasi yang dihabiskan.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsTimerMonitorOpen(false)}
                className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition"
              >
                ✕
              </button>
            </div>

            {/* Content List */}
            <div className="p-6 overflow-y-auto space-y-6 text-xs flex-1">
              {/* Active Now Section */}
              {activeTimers.length > 0 && (
                <div>
                  <h4 className="font-semibold text-emerald-400 text-xs mb-2.5 flex items-center gap-2 uppercase tracking-wider font-mono">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    Sedang Bekerja Saat Ini ({activeTimers.length})
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {activeTimers.map((act) => (
                      <div
                        key={act.id}
                        className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-500/40 flex items-center justify-between"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-100">{act.user_name}</span>
                            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                              {act.user_role}
                            </span>
                          </div>
                          <p className="text-slate-400 text-[11px] mt-0.5 truncate max-w-xs">
                            {act.task_title || "Pengerjaan Desain"}
                          </p>
                          <p className="text-[10px] text-emerald-400 font-mono mt-1">
                            Mulai: {formatClockTime(act.started_at)} WIB
                          </p>
                        </div>
                        <span className="font-mono text-sm font-bold text-emerald-300 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/30">
                          Aktif
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Log History Table */}
              <div>
                <h4 className="font-semibold text-slate-300 text-xs mb-2.5 uppercase tracking-wider font-mono">
                  Riwayat Log Jam Kerja ({timerLogs.length} Entri)
                </h4>
                {timerLogs.length === 0 ? (
                  <div className="p-8 text-center text-slate-500 border border-dashed border-slate-800 rounded-xl">
                    Belum ada rekaman jam kerja yang tersimpan.
                  </div>
                ) : (
                  <div className="overflow-x-auto border border-slate-800 rounded-xl">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-900/90 text-slate-400 text-[11px] border-b border-slate-800 font-mono uppercase">
                          <th className="py-2.5 px-3">Nama / Role</th>
                          <th className="py-2.5 px-3">Tugas / Proyek</th>
                          <th className="py-2.5 px-3">Jam Kerja</th>
                          <th className="py-2.5 px-3">Durasi</th>
                          <th className="py-2.5 px-3">Catatan</th>
                          {isSuperAdmin && <th className="py-2.5 px-3 text-right">Aksi</th>}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800 text-[11px]">
                        {timerLogs.map((log) => (
                          <tr key={log.id} className="hover:bg-slate-800/40 transition">
                            <td className="py-2.5 px-3">
                              <span className="font-semibold text-slate-200 block">
                                {log.user_name}
                              </span>
                              <span className="text-[10px] text-slate-500 font-mono">
                                {log.user_role}
                              </span>
                            </td>
                            <td className="py-2.5 px-3 max-w-[200px]">
                              <span className="text-slate-300 block truncate">
                                {log.task_title || "Pengerjaan Desain"}
                              </span>
                              <span className="text-[10px] text-slate-500 font-mono">
                                {formatDateIndo(log.started_at)}
                              </span>
                            </td>
                            <td className="py-2.5 px-3 font-mono text-slate-300 whitespace-nowrap">
                              {formatClockTime(log.started_at)} -{" "}
                              {log.ended_at ? formatClockTime(log.ended_at) : "Sekarang"}
                            </td>
                            <td className="py-2.5 px-3 font-mono font-bold text-emerald-400 whitespace-nowrap">
                              {log.status === "active"
                                ? "Sedang Berjalan"
                                : formatDuration(log.duration_seconds)}
                            </td>
                            <td className="py-2.5 px-3 text-slate-400 max-w-[180px] truncate">
                              {log.notes || "-"}
                            </td>
                            {isSuperAdmin && (
                              <td className="py-2.5 px-3 text-right">
                                <button
                                  onClick={() => handleDeleteTimerLog(log.id)}
                                  className="text-slate-500 hover:text-rose-400 p-1 rounded hover:bg-slate-800 transition"
                                  title="Hapus log"
                                >
                                  🗑️
                                </button>
                              </td>
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
