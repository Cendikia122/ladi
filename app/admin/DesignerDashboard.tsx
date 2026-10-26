"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  KanbanCard,
  WorkTimerLog,
  KanbanStatus,
  KanbanPriority,
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

export default function DesignerDashboard({
  initialCards,
  initialTimerLogs,
  initialActiveTimers,
  currentUser,
}: Props) {
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
    const update = () => {
      const start = new Date(myActiveTimer.started_at).getTime();
      const now = Date.now();
      setTimerElapsed(Math.max(0, Math.floor((now - start) / 1000)));
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [myActiveTimer]);

  // Modal States
  const [isStopModalOpen, setIsStopModalOpen] = useState(false);
  const [stopNotes, setStopNotes] = useState("");
  const [viewingCanvaUrl, setViewingCanvaUrl] = useState<string | null>(null);

  // Toast
  const [toast, setToast] = useState<{ type: "success" | "error" | "warning"; message: string } | null>(null);
  const showToast = (type: "success" | "error" | "warning", message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  // Timer Handlers
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
      showToast("success", `Jam kerja dimulai untuk: ${taskTitle || "Pengerjaan Desain"}`);
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
          notes: stopNotes,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Gagal menghentikan timer.");
      }

      setActiveTimers((prev) => prev.filter((t) => t.id !== myActiveTimer.id));
      setTimerLogs((prev) => prev.map((t) => (t.id === myActiveTimer.id ? data.log : t)));
      setIsStopModalOpen(false);
      setStopNotes("");
      showToast(
        "success",
        `Jam kerja selesai. Durasi: ${formatDuration(data.log?.duration_seconds || timerElapsed)}.`
      );
    } catch (err: any) {
      showToast("error", err.message || "Gagal menghentikan jam kerja.");
    }
  };

  // Filter Tasks for To-Do List: Tasks that are in_progress or draft or review_ide
  const todoList = useMemo(() => {
    return cards.filter((c) => c.status !== "done");
  }, [cards]);

  // Status metrics
  const inProgressCount = useMemo(() => cards.filter((c) => c.status === "in_progress").length, [cards]);
  const reviewIdeCount = useMemo(() => cards.filter((c) => c.status === "review_ide").length, [cards]);
  const reviewDesignCount = useMemo(() => cards.filter((c) => c.status === "review_design").length, [cards]);
  const doneCount = useMemo(() => cards.filter((c) => c.status === "done").length, [cards]);

  return (
    <div className="space-y-8 max-w-7xl mx-auto font-sans">
      {/* Toast */}
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

      {/* Main Header Card for Designer */}
      <div className="p-6 sm:p-7 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-5">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2 py-0.5 rounded border border-slate-200 bg-slate-50 text-slate-600 font-mono text-[11px] font-medium uppercase tracking-wide">
              Panel Desainer & Content Creator
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
            Halo, {currentUser.name || currentUser.username}
          </h1>
          <p className="text-xs text-slate-500 mt-1 max-w-xl">
            Ruang kerja khusus pengerjaan desain: kelola tugas dari Super Admin, hubungkan link Canva, dan catat jam kerja Anda.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <Link
            href="/admin/kanban"
            className="px-4 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs transition flex items-center gap-2 shadow-xs"
          >
            <span>Buka Papan Kanban Lengkap</span>
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 1. SECTION: KANBAN PROYEK */}
      {/* ======================================================== */}
      <div className="rounded-2xl bg-white border border-slate-200 p-6 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-slate-900" />
              <h2 className="text-sm font-semibold text-slate-900 uppercase tracking-wide">
                1. Kanban Proyek
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Visualisasi alur kerja proyek desain dari ide awal Super Admin hingga persetujuan final.
            </p>
          </div>

          <Link
            href="/admin/kanban"
            className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs transition flex items-center gap-2 shadow-xs self-start sm:self-auto"
          >
            <span>Buka Papan Kanban Lengkap</span>
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>

        {/* 5 Columns Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60">
            <span className="text-[11px] font-medium text-slate-500 uppercase block mb-1">
              Draft Ide
            </span>
            <span className="text-2xl font-bold text-slate-800">
              {cards.filter((c) => c.status === "draft").length}
            </span>
            <span className="text-[10px] text-slate-400 block mt-1">Ide dari Super Admin</span>
          </div>

          <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/40">
            <span className="text-[11px] font-medium text-amber-700 uppercase block mb-1">
              Menunggu ACC
            </span>
            <span className="text-2xl font-bold text-amber-800">
              {reviewIdeCount}
            </span>
            <span className="text-[10px] text-amber-600/80 block mt-1">Perlu tinjauan admin</span>
          </div>

          <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/40">
            <span className="text-[11px] font-medium text-blue-700 uppercase block mb-1">
              Sedang Proses
            </span>
            <span className="text-2xl font-bold text-blue-800">
              {inProgressCount}
            </span>
            <span className="text-[10px] text-blue-600/80 block mt-1">Desain aktif dibuat</span>
          </div>

          <div className="p-4 rounded-xl border border-indigo-200 bg-indigo-50/40">
            <span className="text-[11px] font-medium text-indigo-700 uppercase block mb-1">
              Review Desain
            </span>
            <span className="text-2xl font-bold text-indigo-800">
              {reviewDesignCount}
            </span>
            <span className="text-[10px] text-indigo-600/80 block mt-1">Menunggu revisi/ACC</span>
          </div>

          <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/40">
            <span className="text-[11px] font-medium text-emerald-700 uppercase block mb-1">
              Selesai
            </span>
            <span className="text-2xl font-bold text-emerald-800">
              {doneCount}
            </span>
            <span className="text-[10px] text-emerald-600/80 block mt-1">Telah disetujui</span>
          </div>
        </div>

        {/* Quick Board Columns Preview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
          {/* Kolom Draft Ide dari Super Admin */}
          <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-800 uppercase tracking-wide">
                  Draft Siap Dikerjakan
                </span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-600">
                  {cards.filter((c) => c.status === "draft").length}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mb-3">
                Ide konten dari Super Admin yang bisa langsung Anda ambil dan geser ke proses pengerjaan.
              </p>
              <div className="space-y-2">
                {cards
                  .filter((c) => c.status === "draft")
                  .slice(0, 3)
                  .map((card) => (
                    <div
                      key={card.id}
                      className="p-2.5 rounded-lg bg-white border border-slate-200 text-xs shadow-2xs"
                    >
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="text-[10px] font-medium text-slate-500">
                          {card.platform}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400">
                          {card.priority}
                        </span>
                      </div>
                      <div className="font-medium text-slate-900 line-clamp-1">{card.title}</div>
                    </div>
                  ))}
                {cards.filter((c) => c.status === "draft").length === 0 && (
                  <div className="text-[11px] text-slate-400 text-center py-3">
                    Tidak ada draft yang belum diambil.
                  </div>
                )}
              </div>
            </div>
            <Link
              href="/admin/kanban"
              className="mt-3 block text-center py-1.5 rounded-md bg-white border border-slate-200 hover:border-slate-300 text-[11px] font-medium text-slate-700 transition"
            >
              Lihat Semua Draft di Kanban →
            </Link>
          </div>

          {/* Kolom Sedang Proses */}
          <div className="p-3.5 rounded-xl border border-blue-200 bg-blue-50/30 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-blue-950 uppercase tracking-wide">
                  Sedang Diproses
                </span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-white border border-blue-200 text-blue-700 font-semibold">
                  {inProgressCount}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mb-3">
                Tugas yang saat ini aktif sedang Anda buat desainnya.
              </p>
              <div className="space-y-2">
                {cards
                  .filter((c) => c.status === "in_progress")
                  .slice(0, 3)
                  .map((card) => (
                    <div
                      key={card.id}
                      className="p-2.5 rounded-lg bg-white border border-blue-200 text-xs shadow-2xs"
                    >
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="text-[10px] font-medium text-blue-600">
                          {card.platform}
                        </span>
                        {card.canva_url && (
                          <span className="text-[10px] text-emerald-600 font-medium">
                            Canva Terhubung
                          </span>
                        )}
                      </div>
                      <div className="font-medium text-slate-900 line-clamp-1">{card.title}</div>
                    </div>
                  ))}
                {inProgressCount === 0 && (
                  <div className="text-[11px] text-slate-400 text-center py-3">
                    Belum ada desain yang sedang dikerjakan.
                  </div>
                )}
              </div>
            </div>
            <Link
              href="/admin/kanban"
              className="mt-3 block text-center py-1.5 rounded-md bg-white border border-blue-200 hover:border-blue-300 text-[11px] font-medium text-blue-800 transition"
            >
              Kelola Pengerjaan di Kanban →
            </Link>
          </div>

          {/* Kolom Menunggu Review Desain */}
          <div className="p-3.5 rounded-xl border border-indigo-200 bg-indigo-50/30 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-indigo-950 uppercase tracking-wide">
                  Review Hasil Desain
                </span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-white border border-indigo-200 text-indigo-700 font-semibold">
                  {reviewDesignCount}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mb-3">
                Desain yang sudah selesai dibuat dan diajukan ke Super Admin untuk persetujuan.
              </p>
              <div className="space-y-2">
                {cards
                  .filter((c) => c.status === "review_design")
                  .slice(0, 3)
                  .map((card) => (
                    <div
                      key={card.id}
                      className="p-2.5 rounded-lg bg-white border border-indigo-200 text-xs shadow-2xs"
                    >
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="text-[10px] font-medium text-indigo-600">
                          {card.platform}
                        </span>
                        {card.canva_url && (
                          <span className="text-[10px] text-emerald-600 font-medium">
                            Canva Terhubung
                          </span>
                        )}
                      </div>
                      <div className="font-medium text-slate-900 line-clamp-1">{card.title}</div>
                    </div>
                  ))}
                {reviewDesignCount === 0 && (
                  <div className="text-[11px] text-slate-400 text-center py-3">
                    Belum ada desain dalam tahap review.
                  </div>
                )}
              </div>
            </div>
            <Link
              href="/admin/kanban"
              className="mt-3 block text-center py-1.5 rounded-md bg-white border border-indigo-200 hover:border-indigo-300 text-[11px] font-medium text-indigo-800 transition"
            >
              Buka Review di Kanban →
            </Link>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 2. SECTION: TO DO LIST (DARI KANBAN & SUPERADMIN) */}
      {/* ======================================================== */}
      <div className="rounded-2xl bg-white border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-slate-900" />
              <h2 className="text-sm font-semibold text-slate-900 uppercase tracking-wide">
                2. To Do List (Tugas dari Kanban & Super Admin)
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Daftar proyek dan arahan langsung dari Super Admin yang perlu dikerjakan atau dituntaskan.
            </p>
          </div>

          <span className="text-xs font-mono text-slate-500 border border-slate-200 bg-slate-50 px-2.5 py-1 rounded-md self-start sm:self-auto">
            {todoList.length} Tugas Aktif
          </span>
        </div>

        {todoList.length === 0 ? (
          <div className="p-8 text-center text-slate-400 border border-dashed border-slate-200 rounded-xl text-xs">
            Semua tugas telah diselesaikan. Anda dapat mengambil ide baru dari kolom Draft di Papan Kanban.
          </div>
        ) : (
          <div className="space-y-3">
            {todoList.map((task) => {
              const isUrgent = task.priority === "urgent";
              const isHigh = task.priority === "high";

              return (
                <div
                  key={task.id}
                  className="p-4 rounded-xl border border-slate-200 hover:border-slate-300 transition bg-white flex flex-col sm:flex-row sm:items-start justify-between gap-4"
                >
                  <div className="space-y-2 flex-1">
                    {/* Meta Tags */}
                    <div className="flex flex-wrap items-center gap-1.5 text-[10px]">
                      <span className="px-1.5 py-0.5 rounded border border-slate-200 bg-slate-50 text-slate-600 font-medium">
                        {task.platform}
                      </span>

                      <span
                        className={`px-1.5 py-0.5 rounded border font-medium ${
                          isUrgent
                            ? "bg-red-50 text-red-700 border-red-200"
                            : isHigh
                            ? "bg-amber-50 text-amber-700 border-amber-200"
                            : "bg-slate-50 text-slate-600 border-slate-200"
                        }`}
                      >
                        Prioritas: {task.priority}
                      </span>

                      <span className="px-1.5 py-0.5 rounded border border-slate-200 bg-slate-50 text-slate-600 font-mono">
                        Status:{" "}
                        {task.status === "draft"
                          ? "Draft Ide"
                          : task.status === "review_ide"
                          ? "Menunggu ACC"
                          : task.status === "in_progress"
                          ? "Sedang Dikerjakan"
                          : "Review Desain"}
                      </span>

                      {task.deadline && (
                        <span className="px-1.5 py-0.5 rounded border border-slate-200 bg-slate-50 text-slate-600 font-mono">
                          Target: {formatDateIndo(task.deadline)}
                        </span>
                      )}
                    </div>

                    {/* Task Title */}
                    <h3 className="text-sm font-semibold text-slate-900 leading-snug">
                      {task.title}
                    </h3>

                    {/* Task Description */}
                    {task.description && (
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {task.description}
                      </p>
                    )}

                    {/* Catatan Khusus dari Super Admin */}
                    {task.admin_notes && (
                      <div className="p-2.5 rounded-lg border border-blue-200 bg-blue-50/60 text-xs text-blue-900 space-y-0.5">
                        <span className="font-semibold block text-[11px] text-blue-950 uppercase tracking-wide">
                          Catatan & Arahan Super Admin:
                        </span>
                        <p className="leading-relaxed">{task.admin_notes}</p>
                      </div>
                    )}

                    {/* Notice for Review Ide */}
                    {task.status === "review_ide" && (
                      <div className="p-2 rounded border border-amber-200 bg-amber-50 text-[11px] text-amber-800">
                        Usulan ide ini masih menunggu persetujuan (ACC) dari Super Admin sebelum diproses ke pengerjaan aktif.
                      </div>
                    )}
                  </div>

                  {/* Actions Right */}
                  <div className="flex flex-row sm:flex-col items-center sm:items-end gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                    <button
                      onClick={() => handleStartTimer(task.id, task.title)}
                      className="w-full sm:w-auto px-3 py-1.5 rounded-md bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs transition flex items-center justify-center gap-1.5"
                    >
                      <span>Mulai Kerjakan Ini</span>
                    </button>

                    {task.canva_url && (
                      <button
                        onClick={() => setViewingCanvaUrl(task.canva_url)}
                        className="w-full sm:w-auto px-3 py-1.5 rounded-md border border-slate-300 hover:bg-slate-50 text-slate-700 font-medium text-xs transition flex items-center justify-center gap-1"
                      >
                        <span>Pratinjau Canva</span>
                        <svg className="w-3 h-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </button>
                    )}

                    <Link
                      href="/admin/kanban"
                      className="text-xs text-slate-500 hover:text-slate-800 underline py-1"
                    >
                      Buka di Kanban →
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ======================================================== */}
      {/* 3. SECTION: JAM KERJA (WORK TIMER) */}
      {/* ======================================================== */}
      <div className="rounded-2xl bg-white border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-slate-900" />
              <h2 className="text-sm font-semibold text-slate-900 uppercase tracking-wide">
                3. Jam Kerja
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Pelacak waktu kerja digital untuk mencatat durasi kerja Anda secara akurat.
            </p>
          </div>

          {/* Live Stopwatch Widget */}
          <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 px-4 py-2 rounded-xl">
            <div className="flex items-center gap-2">
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  myActiveTimer ? "bg-emerald-500 animate-pulse" : "bg-slate-300"
                }`}
              />
              <span className="text-xs font-mono text-slate-500 uppercase">
                {myActiveTimer ? "Sedang Bekerja" : "Timer Nonaktif"}
              </span>
              <span
                className={`font-mono text-base font-bold ml-1 ${
                  myActiveTimer ? "text-emerald-700" : "text-slate-700"
                }`}
              >
                {myActiveTimer ? formatDuration(timerElapsed) : "00:00:00"}
              </span>
            </div>

            {myActiveTimer ? (
              <button
                onClick={() => setIsStopModalOpen(true)}
                className="ml-2 px-3 py-1.5 rounded-md bg-rose-600 hover:bg-rose-700 text-white font-medium text-xs transition"
              >
                Selesai Kerja
              </button>
            ) : (
              <button
                onClick={() => handleStartTimer()}
                className="ml-2 px-3 py-1.5 rounded-md bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs transition"
              >
                Mulai Kerja
              </button>
            )}
          </div>
        </div>

        {/* Current Active Task Notice */}
        {myActiveTimer && (
          <div className="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/50 flex items-center justify-between gap-3 text-xs">
            <div>
              <span className="text-emerald-900 font-semibold block">
                Sedang Mengerjakan: {myActiveTimer.task_title || "Pengerjaan Desain"}
              </span>
              <span className="text-emerald-700 text-[11px] font-mono">
                Dimulai pada pukul {formatClockTime(myActiveTimer.started_at)} WIB
              </span>
            </div>
            <button
              onClick={() => setIsStopModalOpen(true)}
              className="px-3 py-1 rounded bg-white border border-emerald-300 text-emerald-800 hover:bg-emerald-50 font-medium text-xs transition"
            >
              Hentikan Timer
            </button>
          </div>
        )}

        {/* Recent Work Logs */}
        <div>
          <h3 className="text-xs font-semibold text-slate-700 uppercase tracking-wide mb-2.5">
            Riwayat Sesi Kerja Terbaru Anda
          </h3>
          {timerLogs.length === 0 ? (
            <div className="p-6 text-center text-slate-400 border border-dashed border-slate-200 rounded-xl text-xs">
              Belum ada rekaman jam kerja yang tersimpan. Klik &quot;Mulai Kerja&quot; untuk memulai sesi pertama Anda.
            </div>
          ) : (
            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 text-slate-600 text-[11px] border-b border-slate-200 font-medium">
                    <th className="py-2.5 px-3">Tugas</th>
                    <th className="py-2.5 px-3">Jam Kerja</th>
                    <th className="py-2.5 px-3">Durasi</th>
                    <th className="py-2.5 px-3">Catatan Hasil</th>
                    <th className="py-2.5 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-[11px]">
                  {timerLogs.slice(0, 5).map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50 transition">
                      <td className="py-2.5 px-3 font-medium text-slate-800 max-w-[220px] truncate">
                        {log.task_title || "Pengerjaan Desain"}
                      </td>
                      <td className="py-2.5 px-3 font-mono text-slate-600 whitespace-nowrap">
                        {formatClockTime(log.started_at)} -{" "}
                        {log.ended_at ? formatClockTime(log.ended_at) : "Aktif"}
                      </td>
                      <td className="py-2.5 px-3 font-mono font-semibold text-slate-900 whitespace-nowrap">
                        {log.status === "active" ? "Sedang Berjalan" : formatDuration(log.duration_seconds)}
                      </td>
                      <td className="py-2.5 px-3 text-slate-600 max-w-[200px] truncate">
                        {log.notes || "-"}
                      </td>
                      <td className="py-2.5 px-3 whitespace-nowrap">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-mono border ${
                            log.status === "active"
                              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                              : "bg-slate-50 text-slate-600 border-slate-200"
                          }`}
                        >
                          {log.status === "active" ? "Aktif" : "Selesai"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal Stop Timer */}
      {isStopModalOpen && myActiveTimer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white border border-slate-200 rounded-xl w-full max-w-sm p-5 shadow-xl">
            <h3 className="font-semibold text-sm text-slate-900 mb-1">
              Selesaikan Sesi Kerja
            </h3>
            <p className="text-xs text-slate-500 mb-3">
              Durasi sesi saat ini: <strong className="text-slate-800">{formatDuration(timerElapsed)}</strong>
            </p>

            <div className="mb-3">
              <label className="block text-slate-700 font-medium text-xs mb-1">
                Catatan Hasil Pengerjaan (Opsional)
              </label>
              <textarea
                rows={3}
                placeholder="Ringkasan desain yang telah dibuat..."
                value={stopNotes}
                onChange={(e) => setStopNotes(e.target.value)}
                className="w-full px-3 py-1.5 rounded-md border border-slate-300 text-slate-800 focus:outline-none focus:border-slate-500 text-xs"
              />
            </div>

            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsStopModalOpen(false)}
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

      {/* Modal Canva Preview */}
      {viewingCanvaUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white border border-slate-200 rounded-xl w-full max-w-4xl h-[80vh] flex flex-col shadow-xl overflow-hidden">
            <div className="p-3 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <span className="font-semibold text-xs text-slate-800">
                Pratinjau Desain Canva
              </span>
              <div className="flex items-center gap-2">
                <a
                  href={viewingCanvaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1 rounded border border-slate-300 hover:bg-white text-slate-700 text-xs font-medium transition"
                >
                  Buka di Canva ↗
                </a>
                <button
                  onClick={() => setViewingCanvaUrl(null)}
                  className="p-1 rounded text-slate-400 hover:text-slate-700 transition"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="flex-1 bg-slate-100 relative">
              <iframe
                src={getCanvaEmbedUrl(viewingCanvaUrl)}
                title="Canva Preview"
                className="w-full h-full border-0"
                allowFullScreen
                loading="lazy"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
