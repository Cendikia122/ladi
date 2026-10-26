import { query } from "./mysql";
export * from "./kanban-types";
import {
  KanbanCard,
  WorkTimerLog,
  KanbanStatus,
  KanbanPriority,
  KanbanPlatform,
  KanbanOrigin,
} from "./kanban-types";

// ==========================================
// KANBAN CRUD (100% PURE DATABASE MYSQL)
// ==========================================

export async function getKanbanCards(): Promise<KanbanCard[]> {
  try {
    const rows = await query<any[]>(
      "SELECT * FROM kanban_cards ORDER BY order_num ASC, id DESC"
    );
    if (rows && Array.isArray(rows)) {
      return rows.map((r) => ({
        id: Number(r.id),
        title: r.title || "",
        description: r.description || "",
        canva_url: r.canva_url || "",
        image_url: r.image_url || "",
        status: (r.status || "draft") as KanbanStatus,
        origin: (r.origin || "admin") as KanbanOrigin,
        is_approved_by_admin: Boolean(r.is_approved_by_admin),
        priority: (r.priority || "medium") as KanbanPriority,
        platform: (r.platform || "Instagram Feeds") as KanbanPlatform,
        assignee_name: r.assignee_name || "",
        deadline: r.deadline || "",
        admin_notes: r.admin_notes || "",
        order_num: Number(r.order_num) || 0,
        created_by: r.created_by || "admin",
        created_at: r.created_at ? new Date(r.created_at).toISOString() : new Date().toISOString(),
        updated_at: r.updated_at ? new Date(r.updated_at).toISOString() : undefined,
      }));
    }
  } catch (err) {
    console.error("Database getKanbanCards error:", err);
  }
  return [];
}

export async function getKanbanCardById(id: number | string): Promise<KanbanCard | null> {
  const numId = Number(id);
  try {
    const rows = await query<any[]>("SELECT * FROM kanban_cards WHERE id = ? LIMIT 1", [numId]);
    if (rows && rows.length > 0) {
      const r = rows[0];
      return {
        id: Number(r.id),
        title: r.title || "",
        description: r.description || "",
        canva_url: r.canva_url || "",
        image_url: r.image_url || "",
        status: (r.status || "draft") as KanbanStatus,
        origin: (r.origin || "admin") as KanbanOrigin,
        is_approved_by_admin: Boolean(r.is_approved_by_admin),
        priority: (r.priority || "medium") as KanbanPriority,
        platform: (r.platform || "Instagram Feeds") as KanbanPlatform,
        assignee_name: r.assignee_name || "",
        deadline: r.deadline || "",
        admin_notes: r.admin_notes || "",
        order_num: Number(r.order_num) || 0,
        created_by: r.created_by || "admin",
        created_at: r.created_at ? new Date(r.created_at).toISOString() : new Date().toISOString(),
        updated_at: r.updated_at ? new Date(r.updated_at).toISOString() : undefined,
      };
    }
  } catch (err) {
    console.error("Database getKanbanCardById error:", err);
  }
  return null;
}

export async function createKanbanCard(data: {
  title: string;
  description?: string;
  canva_url?: string;
  image_url?: string;
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

  const res = await query<any>(
    `INSERT INTO kanban_cards (
      title, description, canva_url, image_url, status, origin,
      is_approved_by_admin, priority, platform, assignee_name,
      deadline, admin_notes, order_num, created_by, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
    [
      data.title.trim(),
      data.description || "",
      data.canva_url || "",
      data.image_url || "",
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

  const insertedId = res?.insertId || Date.now();

  return {
    id: insertedId,
    title: data.title.trim(),
    description: data.description || "",
    canva_url: data.canva_url || "",
    image_url: data.image_url || "",
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
}

export async function updateKanbanCard(
  id: number | string,
  updates: Partial<KanbanCard>
): Promise<KanbanCard | null> {
  const numId = Number(id);

  const fields: string[] = [];
  const values: any[] = [];

  if (updates.title !== undefined) { fields.push("title = ?"); values.push(updates.title); }
  if (updates.description !== undefined) { fields.push("description = ?"); values.push(updates.description); }
  if (updates.canva_url !== undefined) { fields.push("canva_url = ?"); values.push(updates.canva_url); }
  if (updates.image_url !== undefined) { fields.push("image_url = ?"); values.push(updates.image_url); }
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
    fields.push("updated_at = NOW()");
    values.push(numId);
    await query<any>(`UPDATE kanban_cards SET ${fields.join(", ")} WHERE id = ?`, values);
  }

  return await getKanbanCardById(numId);
}

export async function deleteKanbanCard(id: number | string): Promise<boolean> {
  const numId = Number(id);
  try {
    const res = await query<any>("DELETE FROM kanban_cards WHERE id = ?", [numId]);
    return Boolean(res && res.affectedRows > 0);
  } catch (err) {
    console.error("Database deleteKanbanCard error:", err);
    return false;
  }
}

export async function approveKanbanIdea(id: number | string): Promise<KanbanCard | null> {
  return await updateKanbanCard(id, {
    is_approved_by_admin: true,
    status: "in_progress",
  });
}

// ==========================================
// WORK TIMER (100% PURE DATABASE MYSQL)
// ==========================================

export async function getWorkTimerLogs(limit = 100): Promise<WorkTimerLog[]> {
  try {
    const rows = await query<any[]>(
      "SELECT * FROM work_timer_logs ORDER BY id DESC LIMIT ?",
      [limit]
    );
    if (rows && Array.isArray(rows)) {
      return rows.map((r) => ({
        id: Number(r.id),
        user_name: r.user_name || "",
        user_role: r.user_role || "designer",
        task_id: r.task_id ? Number(r.task_id) : null,
        task_title: r.task_title || "",
        started_at: r.started_at ? new Date(r.started_at).toISOString() : new Date().toISOString(),
        ended_at: r.ended_at ? new Date(r.ended_at).toISOString() : null,
        duration_seconds: Number(r.duration_seconds) || 0,
        status: (r.status || "completed") as "active" | "completed",
        notes: r.notes || "",
        created_at: r.created_at ? new Date(r.created_at).toISOString() : new Date().toISOString(),
        updated_at: r.updated_at ? new Date(r.updated_at).toISOString() : undefined,
      }));
    }
  } catch (err) {
    console.error("Database getWorkTimerLogs error:", err);
  }
  return [];
}

export async function getActiveTimers(): Promise<WorkTimerLog[]> {
  try {
    const rows = await query<any[]>(
      "SELECT * FROM work_timer_logs WHERE status = 'active' ORDER BY started_at DESC"
    );
    if (rows && Array.isArray(rows)) {
      return rows.map((r) => ({
        id: Number(r.id),
        user_name: r.user_name || "",
        user_role: r.user_role || "designer",
        task_id: r.task_id ? Number(r.task_id) : null,
        task_title: r.task_title || "",
        started_at: r.started_at ? new Date(r.started_at).toISOString() : new Date().toISOString(),
        ended_at: null,
        duration_seconds: Number(r.duration_seconds) || 0,
        status: "active" as const,
        notes: r.notes || "",
        created_at: r.created_at ? new Date(r.created_at).toISOString() : new Date().toISOString(),
        updated_at: r.updated_at ? new Date(r.updated_at).toISOString() : undefined,
      }));
    }
  } catch (err) {
    console.error("Database getActiveTimers error:", err);
  }
  return [];
}

export async function startWorkTimer(data: {
  user_name: string;
  user_role?: string;
  task_id?: number | null;
  task_title?: string;
}): Promise<WorkTimerLog> {
  const now = new Date();
  const nowIso = now.toISOString();

  // Hentikan timer aktif sebelumnya milik user ini jika ada
  try {
    const existing: any = await query(
      "SELECT id, started_at FROM work_timer_logs WHERE user_name = ? AND status = 'active'",
      [data.user_name]
    );
    if (existing && Array.isArray(existing)) {
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

  const res = await query<any>(
    `INSERT INTO work_timer_logs (
      user_name, user_role, task_id, task_title,
      started_at, duration_seconds, status, notes, created_at, updated_at
    ) VALUES (?, ?, ?, ?, NOW(), 0, 'active', '', NOW(), NOW())`,
    [
      data.user_name,
      data.user_role || "designer",
      data.task_id || null,
      data.task_title || "",
    ]
  );

  const insertedId = res?.insertId || Date.now();

  return {
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
}

export async function stopWorkTimer(id: number | string, notes = ""): Promise<WorkTimerLog | null> {
  const numId = Number(id);
  const now = new Date();
  const nowIso = now.toISOString();

  const rows = await query<any[]>("SELECT * FROM work_timer_logs WHERE id = ? LIMIT 1", [numId]);
  if (rows && rows.length > 0) {
    const r = rows[0];
    const start = new Date(r.started_at).getTime();
    const duration = Math.max(0, Math.floor((now.getTime() - start) / 1000));

    await query(
      `UPDATE work_timer_logs 
       SET ended_at = NOW(), duration_seconds = ?, status = 'completed', notes = ?, updated_at = NOW()
       WHERE id = ?`,
      [duration, notes, numId]
    );

    return {
      id: numId,
      user_name: r.user_name,
      user_role: r.user_role,
      task_id: r.task_id,
      task_title: r.task_title,
      started_at: r.started_at ? new Date(r.started_at).toISOString() : nowIso,
      ended_at: nowIso,
      duration_seconds: duration,
      status: "completed",
      notes,
      created_at: r.created_at ? new Date(r.created_at).toISOString() : nowIso,
    };
  }

  return null;
}

export async function deleteWorkTimerLog(id: number | string): Promise<boolean> {
  const numId = Number(id);
  try {
    const res = await query<any>("DELETE FROM work_timer_logs WHERE id = ?", [numId]);
    return Boolean(res && res.affectedRows > 0);
  } catch (err) {
    console.error("Database deleteWorkTimerLog error:", err);
    return false;
  }
}
