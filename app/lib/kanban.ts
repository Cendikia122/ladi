import fs from "fs";
import path from "path";
import { query } from "./mysql";
export * from "./kanban-types";
import {
  KanbanCard,
  WorkTimerLog,
  KanbanStatus,
  KanbanPriority,
  KanbanPlatform,
  KanbanOrigin,
  getCanvaEmbedUrl,
} from "./kanban-types";

const DATA_DIR = path.join(process.cwd(), "data");
const KANBAN_FILE = path.join(DATA_DIR, "kanban_cards.json");
const TIMER_FILE = path.join(DATA_DIR, "work_timer_logs.json");

let inMemoryKanban: KanbanCard[] = [];
let inMemoryTimers: WorkTimerLog[] = [];
let dataLoaded = false;

function ensureDataLoaded() {
  if (dataLoaded) return;
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (fs.existsSync(KANBAN_FILE)) {
      inMemoryKanban = JSON.parse(fs.readFileSync(KANBAN_FILE, "utf-8"));
    } else {
      inMemoryKanban = [
        {
          id: 1,
          title: "Konten Carousel: 5 Rahasia Website UMKM Menghasilkan Penjualan",
          description: "Desain 5 slide Instagram carousel edukasi tentang pentingnya website responsif dan checkout otomatis untuk UMKM. Tone: Profesional, modern, elegan.",
          canva_url: "https://www.canva.com/design/DAGU_example/view?embed",
          status: "draft",
          origin: "admin",
          is_approved_by_admin: true,
          priority: "high",
          platform: "Instagram Carousel",
          assignee_name: "Tim Desainer Ladi",
          deadline: "2026-10-30",
          admin_notes: "Gunakan palet warna Navy #0f172a dan Orange #fa824b.",
          order_num: 1,
          created_by: "bob",
          created_at: new Date().toISOString(),
        },
        {
          id: 2,
          title: "Banner Promo Paket Exist Website Murah Rp 299rb",
          description: "Visual banner website dan stories promo paket Exist. Tonjolkan harga Rp 299.000 sekali bayar dengan domain & hosting gratis.",
          canva_url: "",
          status: "in_progress",
          origin: "admin",
          is_approved_by_admin: true,
          priority: "urgent",
          platform: "Website Banner",
          assignee_name: "Tim Desainer Ladi",
          deadline: "2026-10-28",
          admin_notes: "Fokus ke call-to-action 'Pesan Sekarang'.",
          order_num: 2,
          created_by: "bob",
          created_at: new Date().toISOString(),
        },
      ];
      persistKanban();
    }

    if (fs.existsSync(TIMER_FILE)) {
      inMemoryTimers = JSON.parse(fs.readFileSync(TIMER_FILE, "utf-8"));
    } else {
      inMemoryTimers = [];
      persistTimers();
    }
  } catch (err) {
    console.warn("Notice loading kanban fallback JSON:", err);
  }
  dataLoaded = true;
}

function persistKanban() {
  try {
    if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
    fs.writeFileSync(KANBAN_FILE, JSON.stringify(inMemoryKanban, null, 2), "utf-8");
  } catch {}
}

function persistTimers() {
  try {
    if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
    fs.writeFileSync(TIMER_FILE, JSON.stringify(inMemoryTimers, null, 2), "utf-8");
  } catch {}
}

// getCanvaEmbedUrl is re-exported from ./kanban-types

// ==========================================
// KANBAN CRUD
// ==========================================

export async function getKanbanCards(): Promise<KanbanCard[]> {
  try {
    const rows = await query<any[]>(
      "SELECT * FROM kanban_cards ORDER BY order_num ASC, id DESC"
    );
    if (rows && rows.length >= 0) {
      return rows.map((r) => ({
        ...r,
        is_approved_by_admin: Boolean(r.is_approved_by_admin),
        created_at: r.created_at ? new Date(r.created_at).toISOString() : new Date().toISOString(),
        updated_at: r.updated_at ? new Date(r.updated_at).toISOString() : undefined,
      }));
    }
  } catch (err) {
    console.warn("MySQL getKanbanCards fallback to JSON:", err);
  }

  ensureDataLoaded();
  return [...inMemoryKanban].sort((a, b) => (a.order_num || 0) - (b.order_num || 0));
}

export async function getKanbanCardById(id: number | string): Promise<KanbanCard | null> {
  const numId = Number(id);
  try {
    const rows = await query<any[]>("SELECT * FROM kanban_cards WHERE id = ? LIMIT 1", [numId]);
    if (rows && rows.length > 0) {
      const r = rows[0];
      return {
        ...r,
        is_approved_by_admin: Boolean(r.is_approved_by_admin),
        created_at: r.created_at ? new Date(r.created_at).toISOString() : new Date().toISOString(),
        updated_at: r.updated_at ? new Date(r.updated_at).toISOString() : undefined,
      };
    }
  } catch {}

  ensureDataLoaded();
  return inMemoryKanban.find((c) => c.id === numId) || null;
}

export async function createKanbanCard(data: {
  title: string;
  description?: string;
  canva_url?: string;
  status?: KanbanStatus;
  origin?: KanbanOrigin;
  is_approved_by_admin?: boolean;
  priority?: KanbanPriority;
  platform?: KanbanPlatform;
  assignee_name?: string;
  deadline?: string;
  admin_notes?: string;
  order_num?: number;
  created_by?: string;
}): Promise<KanbanCard> {
  const now = new Date().toISOString();
  const origin: KanbanOrigin = data.origin || "admin";
  const defaultStatus: KanbanStatus = origin === "designer" ? "review_ide" : (data.status || "draft");
  const isApproved = origin === "admin" ? true : Boolean(data.is_approved_by_admin);

  let insertedId = 0;

  try {
    const res = await query<any>(
      `INSERT INTO kanban_cards (
        title, description, canva_url, status, origin,
        is_approved_by_admin, priority, platform, assignee_name,
        deadline, admin_notes, order_num, created_by
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        data.title.trim(),
        data.description || "",
        data.canva_url || "",
        defaultStatus,
        origin,
        isApproved ? 1 : 0,
        data.priority || "medium",
        data.platform || "Instagram Feeds",
        data.assignee_name || "",
        data.deadline || "",
        data.admin_notes || "",
        data.order_num || 0,
        data.created_by || "admin",
      ]
    );
    if (res && res.insertId) {
      insertedId = res.insertId;
    }
  } catch (err) {
    console.warn("MySQL createKanbanCard fallback to JSON:", err);
  }

  ensureDataLoaded();
  if (!insertedId) {
    insertedId = inMemoryKanban.length > 0 ? Math.max(...inMemoryKanban.map((c) => c.id)) + 1 : 1;
  }

  const newCard: KanbanCard = {
    id: insertedId,
    title: data.title.trim(),
    description: data.description || "",
    canva_url: data.canva_url || "",
    status: defaultStatus,
    origin,
    is_approved_by_admin: isApproved,
    priority: data.priority || "medium",
    platform: data.platform || "Instagram Feeds",
    assignee_name: data.assignee_name || "",
    deadline: data.deadline || "",
    admin_notes: data.admin_notes || "",
    order_num: data.order_num || 0,
    created_by: data.created_by || "admin",
    created_at: now,
    updated_at: now,
  };

  inMemoryKanban.unshift(newCard);
  persistKanban();
  return newCard;
}

export async function updateKanbanCard(
  id: number | string,
  updates: Partial<KanbanCard>
): Promise<KanbanCard | null> {
  const numId = Number(id);
  const now = new Date().toISOString();

  try {
    const fields: string[] = [];
    const values: any[] = [];

    if (updates.title !== undefined) { fields.push("title = ?"); values.push(updates.title); }
    if (updates.description !== undefined) { fields.push("description = ?"); values.push(updates.description); }
    if (updates.canva_url !== undefined) { fields.push("canva_url = ?"); values.push(updates.canva_url); }
    if (updates.status !== undefined) { fields.push("status = ?"); values.push(updates.status); }
    if (updates.origin !== undefined) { fields.push("origin = ?"); values.push(updates.origin); }
    if (updates.is_approved_by_admin !== undefined) {
      fields.push("is_approved_by_admin = ?");
      values.push(updates.is_approved_by_admin ? 1 : 0);
    }
    if (updates.priority !== undefined) { fields.push("priority = ?"); values.push(updates.priority); }
    if (updates.platform !== undefined) { fields.push("platform = ?"); values.push(updates.platform); }
    if (updates.assignee_name !== undefined) { fields.push("assignee_name = ?"); values.push(updates.assignee_name); }
    if (updates.deadline !== undefined) { fields.push("deadline = ?"); values.push(updates.deadline); }
    if (updates.admin_notes !== undefined) { fields.push("admin_notes = ?"); values.push(updates.admin_notes); }
    if (updates.order_num !== undefined) { fields.push("order_num = ?"); values.push(updates.order_num); }

    if (fields.length > 0) {
      values.push(numId);
      await query<any>(`UPDATE kanban_cards SET ${fields.join(", ")} WHERE id = ?`, values);
    }
  } catch (err) {
    console.warn("MySQL updateKanbanCard fallback:", err);
  }

  ensureDataLoaded();
  const idx = inMemoryKanban.findIndex((c) => c.id === numId);
  if (idx !== -1) {
    const updated: KanbanCard = {
      ...inMemoryKanban[idx],
      ...updates,
      id: numId,
      updated_at: now,
    };
    inMemoryKanban[idx] = updated;
    persistKanban();
    return updated;
  }

  return await getKanbanCardById(numId);
}

export async function deleteKanbanCard(id: number | string): Promise<boolean> {
  const numId = Number(id);
  let deleted = false;

  try {
    const res = await query<any>("DELETE FROM kanban_cards WHERE id = ?", [numId]);
    if (res && res.affectedRows > 0) deleted = true;
  } catch {}

  ensureDataLoaded();
  const idx = inMemoryKanban.findIndex((c) => c.id === numId);
  if (idx !== -1) {
    inMemoryKanban.splice(idx, 1);
    persistKanban();
    deleted = true;
  }

  return deleted;
}

/**
 * Super Admin ACC ide desainer
 */
export async function approveKanbanIdea(id: number | string): Promise<KanbanCard | null> {
  return await updateKanbanCard(id, {
    is_approved_by_admin: true,
    status: "in_progress", // Langsung pindah ke proses atau siap digeser
  });
}

// ==========================================
// WORK TIMER ("JAM KERJA") TRACKER
// ==========================================

export async function getWorkTimerLogs(limit = 100): Promise<WorkTimerLog[]> {
  try {
    const rows = await query<any[]>(
      "SELECT * FROM work_timer_logs ORDER BY id DESC LIMIT ?",
      [limit]
    );
    if (rows && rows.length >= 0) {
      return rows.map((r) => ({
        ...r,
        started_at: r.started_at ? new Date(r.started_at).toISOString() : new Date().toISOString(),
        ended_at: r.ended_at ? new Date(r.ended_at).toISOString() : null,
        created_at: r.created_at ? new Date(r.created_at).toISOString() : new Date().toISOString(),
      }));
    }
  } catch (err) {
    console.warn("MySQL getWorkTimerLogs fallback:", err);
  }

  ensureDataLoaded();
  return [...inMemoryTimers].sort(
    (a, b) => new Date(b.started_at).getTime() - new Date(a.started_at).getTime()
  ).slice(0, limit);
}

export async function getActiveTimers(): Promise<WorkTimerLog[]> {
  try {
    const rows = await query<any[]>(
      "SELECT * FROM work_timer_logs WHERE status = 'active' ORDER BY started_at DESC"
    );
    if (rows && rows.length >= 0) {
      return rows.map((r) => ({
        ...r,
        started_at: r.started_at ? new Date(r.started_at).toISOString() : new Date().toISOString(),
        ended_at: null,
      }));
    }
  } catch {}

  ensureDataLoaded();
  return inMemoryTimers.filter((t) => t.status === "active");
}

export async function startWorkTimer(data: {
  user_name: string;
  user_role?: string;
  task_id?: number | null;
  task_title?: string;
}): Promise<WorkTimerLog> {
  const now = new Date();
  const nowIso = now.toISOString();

  // Pastikan timer aktif sebelumnya milik user ini distop terlebih dahulu
  try {
    const [existing]: any = await query(
      "SELECT id, started_at FROM work_timer_logs WHERE user_name = ? AND status = 'active'",
      [data.user_name]
    );
    if (existing && existing.length > 0) {
      for (const ex of existing) {
        const start = new Date(ex.started_at).getTime();
        const duration = Math.max(0, Math.floor((now.getTime() - start) / 1000));
        await query(
          "UPDATE work_timer_logs SET ended_at = NOW(), duration_seconds = ?, status = 'completed' WHERE id = ?",
          [duration, ex.id]
        );
      }
    }
  } catch {}

  let insertedId = 0;
  try {
    const res = await query<any>(
      `INSERT INTO work_timer_logs (
        user_name, user_role, task_id, task_title,
        started_at, duration_seconds, status, notes
      ) VALUES (?, ?, ?, ?, NOW(), 0, 'active', '')`,
      [
        data.user_name,
        data.user_role || "designer",
        data.task_id || null,
        data.task_title || "",
      ]
    );
    if (res && res.insertId) {
      insertedId = res.insertId;
    }
  } catch (err) {
    console.warn("MySQL startWorkTimer fallback:", err);
  }

  ensureDataLoaded();
  // Stop inMemory active timers for this user
  inMemoryTimers.forEach((t) => {
    if (t.user_name === data.user_name && t.status === "active") {
      t.status = "completed";
      t.ended_at = nowIso;
      t.duration_seconds = Math.max(0, Math.floor((now.getTime() - new Date(t.started_at).getTime()) / 1000));
    }
  });

  if (!insertedId) {
    insertedId = inMemoryTimers.length > 0 ? Math.max(...inMemoryTimers.map((t) => t.id)) + 1 : 1;
  }

  const newLog: WorkTimerLog = {
    id: insertedId,
    user_name: data.user_name,
    user_role: data.user_role || "designer",
    task_id: data.task_id || null,
    task_title: data.task_title || "",
    started_at: nowIso,
    ended_at: null,
    duration_seconds: 0,
    status: "active",
    notes: "",
    created_at: nowIso,
  };

  inMemoryTimers.unshift(newLog);
  persistTimers();
  return newLog;
}

export async function stopWorkTimer(id: number | string, notes = ""): Promise<WorkTimerLog | null> {
  const numId = Number(id);
  const now = new Date();
  const nowIso = now.toISOString();

  try {
    const rows = await query<any[]>("SELECT * FROM work_timer_logs WHERE id = ? LIMIT 1", [numId]);
    if (rows && rows.length > 0) {
      const r = rows[0];
      const start = new Date(r.started_at).getTime();
      const duration = Math.max(0, Math.floor((now.getTime() - start) / 1000));

      await query(
        `UPDATE work_timer_logs 
         SET ended_at = NOW(), duration_seconds = ?, status = 'completed', notes = ?
         WHERE id = ?`,
        [duration, notes, numId]
      );

      return {
        ...r,
        ended_at: nowIso,
        duration_seconds: duration,
        status: "completed",
        notes,
      };
    }
  } catch (err) {
    console.warn("MySQL stopWorkTimer fallback:", err);
  }

  ensureDataLoaded();
  const idx = inMemoryTimers.findIndex((t) => t.id === numId);
  if (idx !== -1) {
    const log = inMemoryTimers[idx];
    const duration = Math.max(0, Math.floor((now.getTime() - new Date(log.started_at).getTime()) / 1000));
    log.status = "completed";
    log.ended_at = nowIso;
    log.duration_seconds = duration;
    if (notes) log.notes = notes;
    persistTimers();
    return log;
  }

  return null;
}

export async function deleteWorkTimerLog(id: number | string): Promise<boolean> {
  const numId = Number(id);
  let deleted = false;

  try {
    const res = await query<any>("DELETE FROM work_timer_logs WHERE id = ?", [numId]);
    if (res && res.affectedRows > 0) deleted = true;
  } catch {}

  ensureDataLoaded();
  const idx = inMemoryTimers.findIndex((t) => t.id === numId);
  if (idx !== -1) {
    inMemoryTimers.splice(idx, 1);
    persistTimers();
    deleted = true;
  }

  return deleted;
}
