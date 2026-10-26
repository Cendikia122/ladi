export type KanbanStatus = "draft" | "review_ide" | "in_progress" | "review_design" | "done";
export type KanbanPriority = "low" | "medium" | "high" | "urgent";
export type KanbanPlatform =
  | "Instagram Feeds"
  | "Instagram Carousel"
  | "Reels / TikTok"
  | "Website Banner"
  | "Brosur / Flyer"
  | "Lainnya";
export type KanbanOrigin = "admin" | "designer";

export interface KanbanCard {
  id: number;
  title: string;
  description: string;
  canva_url: string;
  image_url?: string;
  status: KanbanStatus;
  origin: KanbanOrigin;
  is_approved_by_admin: boolean;
  priority: KanbanPriority;
  platform: KanbanPlatform;
  assignee_name: string;
  deadline?: string;
  admin_notes?: string;
  order_num: number;
  created_by: string;
  created_at: string;
  updated_at?: string;
}

export interface WorkTimerLog {
  id: number;
  user_name: string;
  user_role: string;
  task_id?: number | null;
  task_title?: string;
  started_at: string;
  ended_at?: string | null;
  duration_seconds: number;
  status: "active" | "completed";
  notes?: string;
  created_at: string;
  updated_at?: string;
}

/**
 * Normalisasi URL Canva menjadi Embed URL live preview
 */
export function getCanvaEmbedUrl(input?: string | null): string {
  if (!input) return "";
  const raw = input.trim();
  if (!raw) return "";

  // Jika input berupa kode tag iframe <iframe src="...">
  const iframeMatch = raw.match(/src=["'](https:\/\/(?:www\.)?canva\.com\/design\/[^"']+)["']/i);
  if (iframeMatch) {
    const url = iframeMatch[1];
    return url.includes("embed") ? url : url + (url.includes("?") ? "&embed" : "?embed");
  }

  // Jika berupa URL canva: https://www.canva.com/design/DAG123/hash/view atau /edit
  const urlMatch = raw.match(/https:\/\/(?:www\.)?canva\.com\/design\/([a-zA-Z0-9_\-]+)\/([a-zA-Z0-9_\-]+)/i);
  if (urlMatch) {
    const [, id, hash] = urlMatch;
    return `https://www.canva.com/design/${id}/${hash}/view?embed`;
  }

  // Jika link format lain dari canva.com/design/
  if (raw.includes("canva.com/design/")) {
    const clean = raw.split("?")[0];
    return `${clean}?embed`;
  }

  return raw;
}
