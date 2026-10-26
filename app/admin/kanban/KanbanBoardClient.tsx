"use client";

import React, { useState, useEffect, useMemo } from "react";
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
  dotColor: string;
}[] = [
  {
    id: "draft",
    title: "Draft Ide Admin",
    subtitle: "Ide awal dari Super Admin untuk diambil desainer",
    dotColor: "bg-slate-400",
  },
  {
    id: "review_ide",
    title: "Menunggu Persetujuan",
    subtitle: "Usulan ide desainer, memerlukan ACC Super Admin",
    dotColor: "bg-amber-500",
  },
  {
    id: "in_progress",
    title: "Sedang Dikerjakan",
    subtitle: "Desain aktif dalam pengerjaan",
    dotColor: "bg-blue-500",
  },
  {
    id: "review_design",
    title: "Review Desain",
    subtitle: "Hasil desain Canva siap ditinjau",
    dotColor: "bg-indigo-500",
  },
  {
    id: "done",
    title: "Selesai",
    subtitle: "Desain final telah disetujui",
    dotColor: "bg-emerald-500",
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

const PRIORITIES: { id: KanbanPriority; label: string; badgeClass: string }[] = [
  { id: "low", label: "Rendah", badgeClass: "bg-slate-100 text-slate-600 border-slate-200" },
  { id: "medium", label: "Sedang", badgeClass: "bg-blue-50 text-blue-700 border-blue-200" },
  { id: "high", label: "Tinggi", badgeClass: "bg-amber-50 text-amber-700 border-amber-200" },
  { id: "urgent", label: "Mendesak", badgeClass: "bg-red-50 text-red-700 border-red-200" },
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

  const [cards, setCards] = useState<KanbanCard[]>(initialCards);
  const [timerLogs, setTimerLogs] = useState<WorkTimerLog[]>(initialTimerLogs);
  const [activeTimers, setActiveTimers] = useState<WorkTimerLog[]>(initialActiveTimers);

  // Active Timer for current user
  const myActiveTimer = useMemo(() => {
    return (
      activeTimers.find(
        (t) =>
          t.user_name.toLowerCase() === currentUser.username.toLowerCase() ||
          t.user_name.toLowerCase() === currentUser.name.toLowerCase()
      ) || null
    );
  }, [activeTimers, currentUser]);

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

  // Filters
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
  const [uploadingImage, setUploadingImage] = useState(false);

  // Toast
  const [toast, setToast] = useState<{ type: "success" | "error" | "warning"; message: string } | null>(null);
  const showToast = (type: "success" | "error" | "warning", message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  const handleUploadImage = async (file: File, isEdit = false) => {
    if (!file) return;
    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Gagal mengunggah gambar.");
      }
      const url = data.url;
      if (isEdit) {
        setEditingCard((prev) => (prev ? { ...prev, image_url: url } : null));
      } else {
        setCardForm((prev) => ({ ...prev, image_url: url }));
      }
      showToast("success", "Gambar berhasil diunggah.");
    } catch (err: any) {
      showToast("error", err.message || "Gagal upload gambar.");
    } finally {
      setUploadingImage(false);
    }
  };

  // Drag and drop
  const [draggingCardId, setDraggingCardId] = useState<number | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<KanbanStatus | null>(null);

  // Form State
  const [cardForm, setCardForm] = useState({
    title: "",
    description: "",
    canva_url: "",
    image_url: "",
    status: (isSuperAdmin ? "draft" : "review_ide") as KanbanStatus,
    origin: (isSuperAdmin ? "admin" : "designer") as KanbanOrigin,
    priority: "medium" as KanbanPriority,
    platform: "Instagram Feeds" as KanbanPlatform,
    assignee_name: currentUser.name || "Tim Desainer",
    deadline: "",
    admin_notes: "",
  });

  const openAddModal = (defaultStatus: KanbanStatus = isSuperAdmin ? "draft" : "review_ide") => {
    setCardForm({
      title: "",
      description: "",
      canva_url: "",
      image_url: "",
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

  // Create Card
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
      showToast("success", "Kartu berhasil ditambahkan.");
    } catch (err: any) {
      showToast("error", err.message || "Terjadi kesalahan.");
    }
  };

  // Update Card
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

  // Delete Card
  const handleDeleteCard = async (id: number) => {
    if (!confirm("Hapus kartu ini?")) return;
    try {
      const res = await fetch(`/api/kanban/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Gagal menghapus kartu.");
      }
      setCards((prev) => prev.filter((c) => c.id !== id));
      if (viewingCard?.id === id) setViewingCard(null);
      if (editingCard?.id === id) setEditingCard(null);
      showToast("success", "Kartu berhasil dihapus.");
    } catch (err: any) {
      showToast("error", err.message || "Gagal menghapus.");
    }
  };

  // Super Admin Approve Idea
  const handleApproveIdea = async (card: KanbanCard) => {
    if (!isSuperAdmin) {
      showToast("error", "Hanya Super Admin yang berhak menyetujui ide.");
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
      showToast("success", `Ide "${card.title}" telah disetujui.`);
    } catch (err: any) {
      showToast("error", err.message || "Gagal menyetujui ide.");
    }
  };

  // Drag and drop handlers
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

    // Approval business rule check
    if (
      targetColumn === "in_progress" &&
      card.status === "review_ide" &&
      card.origin === "designer" &&
      !card.is_approved_by_admin
    ) {
      if (!isSuperAdmin) {
        showToast(
          "warning",
          "Ide usulan desainer harus disetujui (ACC) oleh Super Admin sebelum diproses."
        );
        return;
      }
    }

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

  // Timer actions
  const handleStartTimer = async (taskId?: number, taskTitle?: string) => {
    try {
      const res = await fetch("/api/work-timer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          task_id: taskId,
          task_title: taskTitle || "Pengerjaan Desain",
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
      showToast("success", `Jam kerja dimulai.`);
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
        `Jam kerja selesai. Durasi: ${formatDuration(data.log?.duration_seconds || timerElapsed)}.`
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
      showToast("success", "Catatan jam kerja dihapus.");
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
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans antialiased">
      {/* ========================================== */}
      {/* TOP HEADER (MINIMAL LIGHT) */}
      {/* ========================================== */}
      <header className="sticky top-0 z-30 bg-white border-b border-slate-200 px-4 sm:px-6 py-3">
        <div className="max-w-[1700px] mx-auto flex flex-wrap items-center justify-between gap-3">
          {/* Left: Nav & Brand */}
          <div className="flex items-center gap-3">
            <Link
              href="/admin"
              className="text-xs text-slate-500 hover:text-slate-900 flex items-center gap-1 px-2.5 py-1.5 rounded-md hover:bg-slate-100 transition border border-transparent hover:border-slate-200"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
              <span>Dashboard</span>
            </Link>
            <div className="h-4 w-px bg-slate-200" />
            <LadiLogo inverted={false} />
            <span className="hidden md:inline-block text-xs font-medium text-slate-500 border border-slate-200 px-2 py-0.5 rounded-md bg-slate-50">
              Kanban Desain & Waktu Kerja
            </span>
          </div>

          {/* Center: Clean Work Timer */}
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1 rounded-lg">
            <div className="flex items-center gap-2">
              <span
                className={`w-2 h-2 rounded-full ${
                  myActiveTimer ? "bg-emerald-500 animate-pulse" : "bg-slate-300"
                }`}
              />
              <span className="text-[11px] font-mono text-slate-500 uppercase tracking-wide">
                {myActiveTimer ? "Sedang Bekerja" : "Timer"}
              </span>
              <span
                className={`font-mono text-sm font-semibold ${
                  myActiveTimer ? "text-emerald-700" : "text-slate-700"
                }`}
              >
                {myActiveTimer ? formatDuration(timerElapsed) : "00:00:00"}
              </span>
            </div>

            {myActiveTimer ? (
              <button
                onClick={() => setIsStopTimerModalOpen(true)}
                className="ml-2 text-xs font-medium px-2.5 py-1 rounded-md bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition"
              >
                Selesai
              </button>
            ) : (
              <button
                onClick={() => handleStartTimer()}
                className="ml-2 text-xs font-medium px-2.5 py-1 rounded-md bg-slate-900 hover:bg-slate-800 text-white transition"
              >
                Mulai
              </button>
            )}

            <button
              onClick={() => setIsTimerMonitorOpen(true)}
              className="ml-1 text-xs text-slate-600 hover:text-slate-900 px-2 py-1 rounded-md hover:bg-white border border-transparent hover:border-slate-200 transition"
            >
              Log Kerja
              {activeTimers.length > 0 && (
                <span className="ml-1 text-[10px] bg-emerald-100 text-emerald-800 font-semibold px-1.5 py-0.2 rounded-full">
                  {activeTimers.length}
                </span>
              )}
            </button>
          </div>

          {/* Right: User & New Card Button */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => openAddModal()}
              className="text-xs font-medium px-3 py-1.5 rounded-md bg-slate-900 hover:bg-slate-800 text-white transition flex items-center gap-1.5"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              <span>Tambah Kartu</span>
            </button>

            <div className="hidden lg:flex items-center gap-1.5 text-xs text-slate-500 pl-2 border-l border-slate-200">
              <span className="font-medium text-slate-800">{currentUser.name || currentUser.username}</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded border border-slate-200 bg-slate-50 text-slate-600 font-mono">
                {isSuperAdmin ? "Super Admin" : "Desainer"}
              </span>
            </div>

            <AdminLogoutButton />
          </div>
        </div>

        {/* Filter Bar */}
        <div className="max-w-[1700px] mx-auto mt-3 pt-2.5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-2 flex-1 min-w-[280px]">
            {/* Search */}
            <div className="relative min-w-[200px] flex-1 max-w-xs">
              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
              <input
                type="text"
                placeholder="Cari kartu, deskripsi, desainer..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 rounded-md bg-white border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-slate-400 text-xs"
              />
            </div>

            {/* Platform Filter */}
            <select
              value={filterPlatform}
              onChange={(e) => setFilterPlatform(e.target.value)}
              className="py-1.5 px-2.5 rounded-md bg-white border border-slate-200 text-slate-700 focus:outline-none focus:border-slate-400 text-xs"
            >
              <option value="all">Semua Format</option>
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
              className="py-1.5 px-2.5 rounded-md bg-white border border-slate-200 text-slate-700 focus:outline-none focus:border-slate-400 text-xs"
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
                className="text-slate-500 hover:text-slate-800 underline text-xs ml-1"
              >
                Reset
              </button>
            )}
          </div>

          <div className="flex items-center gap-3 text-slate-500 text-xs">
            <span>Total: <strong className="text-slate-800">{filteredCards.length}</strong></span>
            <span>Menunggu ACC: <strong className="text-amber-600">{cards.filter((c) => c.status === "review_ide").length}</strong></span>
            <span>Selesai: <strong className="text-emerald-600">{cards.filter((c) => c.status === "done").length}</strong></span>
          </div>
        </div>
      </header>

      {/* ========================================== */}
      {/* TOAST ALERT */}
      {/* ========================================== */}
      {toast && (
        <div
          className={`fixed bottom-5 right-5 z-50 px-4 py-2.5 rounded-lg shadow-lg border text-xs max-w-sm flex items-start gap-2.5 transition-all ${
            toast.type === "success"
              ? "bg-slate-900 text-white border-slate-800"
              : toast.type === "warning"
              ? "bg-amber-50 text-amber-800 border-amber-200"
              : "bg-red-50 text-red-800 border-red-200"
          }`}
        >
          <div className="flex-1 leading-relaxed">{toast.message}</div>
          <button
            onClick={() => setToast(null)}
            className="text-slate-400 hover:text-white text-xs ml-1"
          >
            ✕
          </button>
        </div>
      )}

      {/* ========================================== */}
      {/* NOTION / LINEAR STYLE LIGHT KANBAN BOARD */}
      {/* ========================================== */}
      <main className="flex-1 p-4 sm:p-6 overflow-x-auto">
        <div className="flex gap-4 items-start min-w-[1280px] max-w-[1700px] mx-auto">
          {COLUMNS.map((col) => {
            const columnCards = filteredCards.filter((c) => c.status === col.id);
            const isDropTarget = dragOverColumn === col.id;

            return (
              <div
                key={col.id}
                onDragOver={(e) => handleDragOver(e, col.id)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, col.id)}
                className={`flex-1 min-w-[270px] max-w-[320px] rounded-xl flex flex-col bg-slate-100/70 border transition duration-150 ${
                  isDropTarget
                    ? "border-slate-400 bg-slate-200/50"
                    : "border-slate-200/80"
                }`}
              >
                {/* Column Header */}
                <div className="p-3 border-b border-slate-200/60 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${col.dotColor}`} />
                    <h3 className="font-semibold text-xs text-slate-800 uppercase tracking-wide">
                      {col.title}
                    </h3>
                  </div>
                  <span className="text-[11px] font-mono font-medium text-slate-500 bg-white border border-slate-200 px-1.5 py-0.2 rounded">
                    {columnCards.length}
                  </span>
                </div>

                {/* Cards Container */}
                <div className="p-2 flex-1 min-h-[460px] space-y-2 overflow-y-auto max-h-[calc(100vh-230px)]">
                  {columnCards.map((card) => {
                    const isDragging = draggingCardId === card.id;
                    const priorityConfig = PRIORITIES.find((p) => p.id === card.priority);

                    return (
                      <div
                        key={card.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, card)}
                        className={`group bg-white border rounded-lg p-3 transition shadow-xs hover:shadow-sm cursor-grab active:cursor-grabbing ${
                          isDragging
                            ? "opacity-30 border-dashed border-slate-400"
                            : "border-slate-200 hover:border-slate-300"
                        }`}
                      >
                        {/* Top Badges */}
                        <div className="flex items-center justify-between gap-1 mb-2 text-[10px]">
                          <div className="flex flex-wrap items-center gap-1">
                            <span className="px-1.5 py-0.5 rounded border border-slate-200 bg-slate-50 text-slate-600 font-medium">
                              {card.platform}
                            </span>
                            {priorityConfig && (
                              <span className={`px-1.5 py-0.5 rounded border font-medium ${priorityConfig.badgeClass}`}>
                                {priorityConfig.label}
                              </span>
                            )}
                          </div>

                          <span
                            className={`px-1.5 py-0.5 rounded text-[9px] font-mono border ${
                              card.origin === "admin"
                                ? "bg-slate-50 text-slate-600 border-slate-200"
                                : "bg-amber-50 text-amber-700 border-amber-200"
                            }`}
                          >
                            {card.origin === "admin" ? "Ide Admin" : "Ide Desainer"}
                          </span>
                        </div>

                        {/* Title */}
                        <h4
                          onClick={() => setViewingCard(card)}
                          className="font-medium text-slate-900 text-xs leading-snug hover:text-blue-600 transition cursor-pointer mb-1.5"
                        >
                          {card.title}
                        </h4>

                        {/* Uploaded Image Thumbnail Preview */}
                        {card.image_url && (
                          <div
                            onClick={() => setViewingCard(card)}
                            className="mb-2 rounded-md overflow-hidden border border-slate-200 aspect-video relative cursor-pointer group/thumb bg-slate-50"
                          >
                            <img
                              src={card.image_url}
                              alt={card.title}
                              className="w-full h-full object-cover group-hover/thumb:scale-102 transition duration-200"
                            />
                          </div>
                        )}

                        {/* Description snippet */}
                        {card.description && (
                          <p className="text-[11px] text-slate-500 line-clamp-2 mb-2 leading-relaxed">
                            {card.description}
                          </p>
                        )}

                        {/* Canva Live Preview Button */}
                        {card.canva_url && (
                          <div className="mb-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setCanvaPreviewUrl(card.canva_url);
                              }}
                              className="w-full py-1 px-2 rounded border border-slate-200 hover:border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-700 text-[11px] font-medium transition flex items-center justify-between"
                            >
                              <span className="truncate">Pratinjau Canva</span>
                              <svg className="w-3 h-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                              </svg>
                            </button>
                          </div>
                        )}

                        {/* Approval Action for 'review_ide' column */}
                        {card.status === "review_ide" && (
                          <div className="mb-2 p-2 rounded border border-amber-200 bg-amber-50/50 text-[11px] text-amber-800 space-y-1.5">
                            <div className="flex items-center justify-between font-medium">
                              <span>Menunggu ACC Super Admin</span>
                            </div>
                            {isSuperAdmin && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleApproveIdea(card);
                                }}
                                className="w-full py-1 px-2 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-[11px] transition"
                              >
                                Setujui Ide (ACC)
                              </button>
                            )}
                          </div>
                        )}

                        {/* Admin Notes Preview */}
                        {card.admin_notes && (
                          <div className="mb-2 text-[10px] bg-slate-50 border border-slate-200 rounded p-1.5 text-slate-600">
                            <strong className="text-slate-800">Catatan:</strong> {card.admin_notes}
                          </div>
                        )}

                        {/* Card Footer: Assignee & Actions */}
                        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                          <span className="truncate max-w-[130px]">
                            {card.assignee_name || "-"}
                          </span>

                          <div className="flex items-center gap-1">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleStartTimer(card.id, card.title);
                              }}
                              className="p-1 hover:bg-slate-100 rounded text-slate-500 hover:text-slate-900 transition"
                              title="Mulai jam kerja untuk tugas ini"
                            >
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditingCard(card);
                              }}
                              className="p-1 hover:bg-slate-100 rounded text-slate-500 hover:text-slate-900 transition"
                              title="Edit kartu"
                            >
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            {isSuperAdmin && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteCard(card.id);
                                }}
                                className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-red-600 transition"
                                title="Hapus kartu"
                              >
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {columnCards.length === 0 && (
                    <div className="h-28 border border-dashed border-slate-200 rounded-lg flex flex-col items-center justify-center text-slate-400 text-xs p-3 text-center">
                      <span>Tidak ada kartu</span>
                      <button
                        onClick={() => openAddModal(col.id)}
                        className="mt-1 text-[11px] text-slate-600 hover:underline font-medium"
                      >
                        + Tambah
                      </button>
                    </div>
                  )}
                </div>

                {/* Column Footer */}
                <div className="p-2 border-t border-slate-200/60">
                  <button
                    onClick={() => openAddModal(col.id)}
                    className="w-full py-1 rounded text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-white transition flex items-center justify-center gap-1"
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
      {/* MODAL: CANVA PREVIEW (MINIMAL LIGHT) */}
      {/* ========================================== */}
      {canvaPreviewUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white border border-slate-200 rounded-xl w-full max-w-5xl h-[85vh] flex flex-col shadow-xl overflow-hidden">
            <div className="p-3 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <span className="font-semibold text-xs text-slate-800">
                Pratinjau Desain Canva
              </span>
              <div className="flex items-center gap-2">
                <a
                  href={canvaPreviewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1 rounded border border-slate-300 hover:bg-white text-slate-700 text-xs font-medium transition flex items-center gap-1"
                >
                  <span>Buka di Canva</span>
                  <svg className="w-3 h-3 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
                <button
                  onClick={() => setCanvaPreviewUrl(null)}
                  className="p-1 rounded text-slate-400 hover:text-slate-700 transition"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="flex-1 bg-slate-100 relative">
              <iframe
                src={getCanvaEmbedUrl(canvaPreviewUrl)}
                title="Canva Preview"
                className="w-full h-full border-0"
                allowFullScreen
                loading="lazy"
              />
            </div>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* MODAL: CREATE CARD (MINIMAL LIGHT) */}
      {/* ========================================== */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-xl w-full max-w-lg p-5 shadow-xl my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-semibold text-sm text-slate-900">
                Tambah Kartu Proyek
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 text-xs"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateCard} className="space-y-3.5 mt-3 text-xs">
              <div>
                <label className="block text-slate-700 font-medium mb-1">
                  Judul Proyek / Brief <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Nama konten atau desain"
                  value={cardForm.title}
                  onChange={(e) => setCardForm({ ...cardForm, title: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-md border border-slate-300 text-slate-800 focus:outline-none focus:border-slate-500 text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">
                  Deskripsi / Catatan Brief
                </label>
                <textarea
                  rows={3}
                  placeholder="Detail pengerjaan atau arahan konten..."
                  value={cardForm.description}
                  onChange={(e) => setCardForm({ ...cardForm, description: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-md border border-slate-300 text-slate-800 focus:outline-none focus:border-slate-500 text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">
                  Link Canva (Pratinjau Otomatis)
                </label>
                <input
                  type="url"
                  placeholder="https://www.canva.com/design/.../view"
                  value={cardForm.canva_url}
                  onChange={(e) => setCardForm({ ...cardForm, canva_url: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-md border border-slate-300 text-slate-800 focus:outline-none focus:border-slate-500 text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">
                  Upload File Gambar (Opsional)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    accept="image/*"
                    id="create-card-image-file"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files?.[0]) handleUploadImage(e.target.files[0], false);
                    }}
                  />
                  <label
                    htmlFor="create-card-image-file"
                    className={`px-3 py-1.5 rounded-md border border-slate-300 text-xs font-medium cursor-pointer transition ${
                      uploadingImage
                        ? "bg-slate-100 text-slate-400"
                        : "bg-slate-50 hover:bg-slate-100 text-slate-700"
                    }`}
                  >
                    {uploadingImage ? "Mengunggah..." : "Pilih File Gambar"}
                  </label>
                  {cardForm.image_url && (
                    <button
                      type="button"
                      onClick={() => setCardForm({ ...cardForm, image_url: "" })}
                      className="text-red-600 hover:underline text-xs"
                    >
                      Hapus
                    </button>
                  )}
                </div>
                {cardForm.image_url && (
                  <div className="mt-2 w-32 h-20 rounded border border-slate-200 overflow-hidden bg-slate-50">
                    <img src={cardForm.image_url} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Format Platform</label>
                  <select
                    value={cardForm.platform}
                    onChange={(e) =>
                      setCardForm({ ...cardForm, platform: e.target.value as KanbanPlatform })
                    }
                    className="w-full px-2.5 py-1.5 rounded-md border border-slate-300 text-slate-800 focus:outline-none focus:border-slate-500 text-xs bg-white"
                  >
                    {PLATFORMS.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-medium mb-1">Prioritas</label>
                  <select
                    value={cardForm.priority}
                    onChange={(e) =>
                      setCardForm({ ...cardForm, priority: e.target.value as KanbanPriority })
                    }
                    className="w-full px-2.5 py-1.5 rounded-md border border-slate-300 text-slate-800 focus:outline-none focus:border-slate-500 text-xs bg-white"
                  >
                    {PRIORITIES.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Kolom Awal</label>
                  <select
                    value={cardForm.status}
                    onChange={(e) =>
                      setCardForm({ ...cardForm, status: e.target.value as KanbanStatus })
                    }
                    className="w-full px-2.5 py-1.5 rounded-md border border-slate-300 text-slate-800 focus:outline-none focus:border-slate-500 text-xs bg-white"
                  >
                    {COLUMNS.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-medium mb-1">Sumber Ide</label>
                  <select
                    value={cardForm.origin}
                    disabled={!isSuperAdmin}
                    onChange={(e) =>
                      setCardForm({ ...cardForm, origin: e.target.value as KanbanOrigin })
                    }
                    className="w-full px-2.5 py-1.5 rounded-md border border-slate-300 text-slate-800 focus:outline-none focus:border-slate-500 text-xs bg-white disabled:opacity-50"
                  >
                    <option value="admin">Ide Super Admin</option>
                    <option value="designer">Ide Desainer (Perlu ACC)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Ditugaskan Kepada</label>
                  <input
                    type="text"
                    value={cardForm.assignee_name}
                    onChange={(e) => setCardForm({ ...cardForm, assignee_name: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-md border border-slate-300 text-slate-800 focus:outline-none focus:border-slate-500 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-medium mb-1">Target Selesai</label>
                  <input
                    type="date"
                    value={cardForm.deadline}
                    onChange={(e) => setCardForm({ ...cardForm, deadline: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-md border border-slate-300 text-slate-800 focus:outline-none focus:border-slate-500 text-xs"
                  />
                </div>
              </div>

              {isSuperAdmin && (
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Catatan Admin</label>
                  <input
                    type="text"
                    placeholder="Instruksi tambahan..."
                    value={cardForm.admin_notes}
                    onChange={(e) => setCardForm({ ...cardForm, admin_notes: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-md border border-slate-300 text-slate-800 focus:outline-none focus:border-slate-500 text-xs"
                  />
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3 py-1.5 rounded-md border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-medium transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-md bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs transition"
                >
                  Simpan Kartu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* MODAL: EDIT CARD (MINIMAL LIGHT) */}
      {/* ========================================== */}
      {editingCard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-xl w-full max-w-lg p-5 shadow-xl my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-semibold text-sm text-slate-900">
                Edit Kartu Proyek
              </h3>
              <button
                onClick={() => setEditingCard(null)}
                className="text-slate-400 hover:text-slate-700 text-xs"
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
              className="space-y-3.5 mt-3 text-xs"
            >
              <div>
                <label className="block text-slate-700 font-medium mb-1">Judul Proyek</label>
                <input
                  type="text"
                  required
                  value={editingCard.title}
                  onChange={(e) => setEditingCard({ ...editingCard, title: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-md border border-slate-300 text-slate-800 focus:outline-none focus:border-slate-500 text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Deskripsi / Brief</label>
                <textarea
                  rows={3}
                  value={editingCard.description}
                  onChange={(e) =>
                    setEditingCard({ ...editingCard, description: e.target.value })
                  }
                  className="w-full px-3 py-1.5 rounded-md border border-slate-300 text-slate-800 focus:outline-none focus:border-slate-500 text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Link Canva</label>
                <input
                  type="url"
                  value={editingCard.canva_url}
                  onChange={(e) =>
                    setEditingCard({ ...editingCard, canva_url: e.target.value })
                  }
                  className="w-full px-3 py-1.5 rounded-md border border-slate-300 text-slate-800 focus:outline-none focus:border-slate-500 text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">File Gambar (Opsional)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    accept="image/*"
                    id="edit-card-image-file"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files?.[0]) handleUploadImage(e.target.files[0], true);
                    }}
                  />
                  <label
                    htmlFor="edit-card-image-file"
                    className={`px-3 py-1.5 rounded-md border border-slate-300 text-xs font-medium cursor-pointer transition ${
                      uploadingImage
                        ? "bg-slate-100 text-slate-400"
                        : "bg-slate-50 hover:bg-slate-100 text-slate-700"
                    }`}
                  >
                    {uploadingImage ? "Mengunggah..." : "Pilih File Gambar Baru"}
                  </label>
                  {editingCard.image_url && (
                    <button
                      type="button"
                      onClick={() => setEditingCard({ ...editingCard, image_url: "" })}
                      className="text-red-600 hover:underline text-xs"
                    >
                      Hapus
                    </button>
                  )}
                </div>
                {editingCard.image_url && (
                  <div className="mt-2 w-32 h-20 rounded border border-slate-200 overflow-hidden bg-slate-50">
                    <img src={editingCard.image_url} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Kolom Status</label>
                  <select
                    value={editingCard.status}
                    onChange={(e) =>
                      setEditingCard({
                        ...editingCard,
                        status: e.target.value as KanbanStatus,
                      })
                    }
                    className="w-full px-2.5 py-1.5 rounded-md border border-slate-300 text-slate-800 focus:outline-none focus:border-slate-500 text-xs bg-white"
                  >
                    {COLUMNS.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-medium mb-1">Prioritas</label>
                  <select
                    value={editingCard.priority}
                    onChange={(e) =>
                      setEditingCard({
                        ...editingCard,
                        priority: e.target.value as KanbanPriority,
                      })
                    }
                    className="w-full px-2.5 py-1.5 rounded-md border border-slate-300 text-slate-800 focus:outline-none focus:border-slate-500 text-xs bg-white"
                  >
                    {PRIORITIES.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Platform</label>
                  <select
                    value={editingCard.platform}
                    onChange={(e) =>
                      setEditingCard({
                        ...editingCard,
                        platform: e.target.value as KanbanPlatform,
                      })
                    }
                    className="w-full px-2.5 py-1.5 rounded-md border border-slate-300 text-slate-800 focus:outline-none focus:border-slate-500 text-xs bg-white"
                  >
                    {PLATFORMS.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-medium mb-1">Ditugaskan Kepada</label>
                  <input
                    type="text"
                    value={editingCard.assignee_name}
                    onChange={(e) =>
                      setEditingCard({ ...editingCard, assignee_name: e.target.value })
                    }
                    className="w-full px-3 py-1.5 rounded-md border border-slate-300 text-slate-800 focus:outline-none focus:border-slate-500 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Catatan Admin</label>
                <input
                  type="text"
                  value={editingCard.admin_notes || ""}
                  onChange={(e) =>
                    setEditingCard({ ...editingCard, admin_notes: e.target.value })
                  }
                  className="w-full px-3 py-1.5 rounded-md border border-slate-300 text-slate-800 focus:outline-none focus:border-slate-500 text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingCard(null)}
                  className="px-3 py-1.5 rounded-md border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-medium transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-md bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs transition"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* MODAL: DETAIL CARD (NOTION STYLE LIGHT) */}
      {/* ========================================== */}
      {viewingCard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-xl overflow-hidden my-6">
            <div className="p-3.5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-medium text-slate-500">
                  ID #{viewingCard.id}
                </span>
                <span className="text-xs text-slate-600 font-medium">
                  {viewingCard.platform}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => {
                    const card = viewingCard;
                    setViewingCard(null);
                    setEditingCard(card);
                  }}
                  className="px-2.5 py-1 rounded border border-slate-300 hover:bg-white text-slate-700 text-xs font-medium transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => setViewingCard(null)}
                  className="p-1 rounded text-slate-400 hover:text-slate-700 transition"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-5 overflow-y-auto space-y-4 text-xs">
              <div>
                <h2 className="text-lg font-semibold text-slate-900 mb-2">
                  {viewingCard.title}
                </h2>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2 py-0.5 rounded border border-slate-200 bg-slate-50 text-slate-700">
                    Status: <strong>{COLUMNS.find((c) => c.id === viewingCard.status)?.title}</strong>
                  </span>
                  <span className="px-2 py-0.5 rounded border border-slate-200 bg-slate-50 text-slate-700">
                    Penugasan: <strong>{viewingCard.assignee_name || "-"}</strong>
                  </span>
                  <span className="px-2 py-0.5 rounded border border-slate-200 bg-slate-50 text-slate-700">
                    Sumber: <strong>{viewingCard.origin === "admin" ? "Ide Super Admin" : "Ide Desainer"}</strong>
                  </span>
                  {viewingCard.deadline && (
                    <span className="px-2 py-0.5 rounded border border-slate-200 bg-slate-50 text-slate-700">
                      Target: <strong>{formatDateIndo(viewingCard.deadline)}</strong>
                    </span>
                  )}
                </div>
              </div>

              {/* ACC Alert */}
              {viewingCard.status === "review_ide" && (
                <div className="p-3 rounded-lg border border-amber-200 bg-amber-50 flex items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold text-xs text-amber-900">Menunggu Persetujuan Super Admin</p>
                    <p className="text-[11px] text-amber-800">
                      Ide usulan dari desainer sebelum dipindahkan ke proses pengerjaan.
                    </p>
                  </div>
                  {isSuperAdmin && (
                    <button
                      onClick={() => handleApproveIdea(viewingCard)}
                      className="px-3 py-1.5 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs transition shrink-0"
                    >
                      Setujui Ide (ACC)
                    </button>
                  )}
                </div>
              )}

              {/* Uploaded Image */}
              {viewingCard.image_url && (
                <div className="rounded-lg border border-slate-200 overflow-hidden bg-slate-50">
                  <div className="px-3 py-2 border-b border-slate-200 flex items-center justify-between text-[11px] font-medium text-slate-700">
                    <span>File Gambar Desain</span>
                    <a
                      href={viewingCard.image_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      Buka Asli ↗
                    </a>
                  </div>
                  <div className="p-2 flex items-center justify-center bg-white">
                    <img
                      src={viewingCard.image_url}
                      alt={viewingCard.title}
                      className="max-h-80 rounded object-contain"
                    />
                  </div>
                </div>
              )}

              {/* Canva Preview */}
              {viewingCard.canva_url && (
                <div className="rounded-lg border border-slate-200 overflow-hidden bg-white">
                  <div className="px-3 py-2 border-b border-slate-200 flex items-center justify-between text-[11px] font-medium text-slate-700 bg-slate-50">
                    <span>Pratinjau Canva Interaktif</span>
                    <a
                      href={viewingCard.canva_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline flex items-center gap-1"
                    >
                      <span>Buka Canva</span>
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  </div>
                  <div className="h-80 w-full bg-slate-100">
                    <iframe
                      src={getCanvaEmbedUrl(viewingCard.canva_url)}
                      title="Canva Detail View"
                      className="w-full h-full border-0"
                      allowFullScreen
                      loading="lazy"
                    />
                  </div>
                </div>
              )}

              {/* Description */}
              <div>
                <h4 className="font-semibold text-slate-800 mb-1 text-[11px] uppercase tracking-wide">
                  Deskripsi & Brief
                </h4>
                <div className="p-3 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 whitespace-pre-wrap leading-relaxed">
                  {viewingCard.description || "Tidak ada deskripsi rinci."}
                </div>
              </div>

              {/* Admin Notes */}
              <div>
                <h4 className="font-semibold text-slate-800 mb-1 text-[11px] uppercase tracking-wide">
                  Catatan Admin
                </h4>
                <div className="p-3 rounded-lg border border-slate-200 bg-slate-50 text-slate-700">
                  {viewingCard.admin_notes || "Belum ada catatan khusus."}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-slate-500">
                <span className="text-[11px]">Dibuat: {formatDateIndo(viewingCard.created_at)}</span>
                <button
                  onClick={() => {
                    handleStartTimer(viewingCard.id, viewingCard.title);
                    setViewingCard(null);
                  }}
                  className="px-3 py-1.5 rounded-md bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs transition"
                >
                  Mulai Jam Kerja
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* MODAL: STOP TIMER */}
      {/* ========================================== */}
      {isStopTimerModalOpen && myActiveTimer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white border border-slate-200 rounded-xl w-full max-w-sm p-5 shadow-xl">
            <h3 className="font-semibold text-sm text-slate-900 mb-1">
              Selesai Bekerja
            </h3>
            <p className="text-xs text-slate-500 mb-3">
              Durasi sesi kerja saat ini: <strong className="text-slate-800">{formatDuration(timerElapsed)}</strong>
            </p>

            <div className="mb-3">
              <label className="block text-slate-700 font-medium text-xs mb-1">
                Catatan Hasil Pengerjaan (Opsional)
              </label>
              <textarea
                rows={3}
                placeholder="Ringkasan tugas yang telah diselesaikan..."
                value={stopTimerNotes}
                onChange={(e) => setStopTimerNotes(e.target.value)}
                className="w-full px-3 py-1.5 rounded-md border border-slate-300 text-slate-800 focus:outline-none focus:border-slate-500 text-xs"
              />
            </div>

            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsStopTimerModalOpen(false)}
                className="px-3 py-1.5 rounded-md border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-medium transition"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleStopTimer}
                className="px-4 py-1.5 rounded-md bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs transition"
              >
                Simpan & Selesai
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* MODAL: WORK TIMER MONITOR TABLE (LIGHT) */}
      {/* ========================================== */}
      {isTimerMonitorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-xl w-full max-w-4xl max-h-[85vh] flex flex-col shadow-xl overflow-hidden my-6">
            <div className="p-3.5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div>
                <h3 className="font-semibold text-sm text-slate-900">
                  Log Jam Kerja Tim
                </h3>
                <p className="text-[11px] text-slate-500">
                  Riwayat waktu kerja, jam mulai dan selesai, serta total durasi.
                </p>
              </div>
              <button
                onClick={() => setIsTimerMonitorOpen(false)}
                className="p-1 rounded text-slate-400 hover:text-slate-700 transition"
              >
                ✕
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-5 text-xs flex-1">
              {/* Active workers */}
              {activeTimers.length > 0 && (
                <div>
                  <h4 className="font-semibold text-xs text-slate-700 mb-2 uppercase tracking-wide">
                    Sedang Aktif ({activeTimers.length})
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                    {activeTimers.map((act) => (
                      <div
                        key={act.id}
                        className="p-3 rounded-lg border border-emerald-200 bg-emerald-50/40 flex items-center justify-between"
                      >
                        <div>
                          <div className="font-semibold text-slate-900">{act.user_name}</div>
                          <div className="text-slate-600 text-[11px]">{act.task_title || "Pengerjaan Desain"}</div>
                          <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                            Mulai: {formatClockTime(act.started_at)} WIB
                          </div>
                        </div>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-semibold border border-emerald-200">
                          Aktif
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* History Table */}
              <div>
                <h4 className="font-semibold text-xs text-slate-700 mb-2 uppercase tracking-wide">
                  Riwayat ({timerLogs.length} Entri)
                </h4>
                {timerLogs.length === 0 ? (
                  <div className="p-8 text-center text-slate-400 border border-dashed border-slate-200 rounded-lg">
                    Belum ada riwayat jam kerja yang tersimpan.
                  </div>
                ) : (
                  <div className="overflow-x-auto border border-slate-200 rounded-lg">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50 text-slate-600 text-[11px] border-b border-slate-200 font-medium">
                          <th className="py-2 px-3">Nama</th>
                          <th className="py-2 px-3">Tugas</th>
                          <th className="py-2 px-3">Waktu</th>
                          <th className="py-2 px-3">Durasi</th>
                          <th className="py-2 px-3">Catatan</th>
                          {isSuperAdmin && <th className="py-2 px-3 text-right">Aksi</th>}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-[11px]">
                        {timerLogs.map((log) => (
                          <tr key={log.id} className="hover:bg-slate-50 transition">
                            <td className="py-2 px-3 font-medium text-slate-800">
                              {log.user_name}
                            </td>
                            <td className="py-2 px-3 max-w-[200px] truncate text-slate-700">
                              {log.task_title || "Pengerjaan Desain"}
                            </td>
                            <td className="py-2 px-3 font-mono text-slate-600 whitespace-nowrap">
                              {formatClockTime(log.started_at)} -{" "}
                              {log.ended_at ? formatClockTime(log.ended_at) : "Sekarang"}
                            </td>
                            <td className="py-2 px-3 font-mono font-medium text-slate-900 whitespace-nowrap">
                              {log.status === "active" ? "Aktif" : formatDuration(log.duration_seconds)}
                            </td>
                            <td className="py-2 px-3 text-slate-600 max-w-[180px] truncate">
                              {log.notes || "-"}
                            </td>
                            {isSuperAdmin && (
                              <td className="py-2 px-3 text-right">
                                <button
                                  onClick={() => handleDeleteTimerLog(log.id)}
                                  className="text-slate-400 hover:text-red-600 p-1 rounded hover:bg-slate-100 transition"
                                  title="Hapus log"
                                >
                                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                  </svg>
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
