import fs from "fs";
import path from "path";
import { query } from "./mysql";

export interface BlogItem {
  id: number;
  title: string;
  slug: string;
  author: string;
  date: string;
  category: string;
  thumb?: string;
  thumb_full?: string;
  excerpt: string;
  content: string;
  tags?: string;
  status: "published" | "draft";
  created_at: string;
  updated_at?: string;
}

export interface EventItem {
  id: number;
  title: string;
  tag: string;
  thumb?: string;
  date: string;
  location: string;
  short_desc: string;
  description: string;
  btn_text?: string;
  btn_link?: string;
  status: "active" | "inactive";
  created_at: string;
  updated_at?: string;
}

const DATA_DIR = path.join(process.cwd(), "data");
const BLOGS_FILE = path.join(DATA_DIR, "blogs.json");
const EVENTS_FILE = path.join(DATA_DIR, "events.json");

// In-memory fallback
let inMemoryBlogs: BlogItem[] = [];
let inMemoryEvents: EventItem[] = [];

function ensureData() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (fs.existsSync(BLOGS_FILE)) {
      const raw = fs.readFileSync(BLOGS_FILE, "utf-8");
      inMemoryBlogs = JSON.parse(raw);
    }
    if (fs.existsSync(EVENTS_FILE)) {
      const raw = fs.readFileSync(EVENTS_FILE, "utf-8");
      inMemoryEvents = JSON.parse(raw);
    }
  } catch (err) {
    console.warn("Storage read notice:", err);
  }
}

function persistBlogs() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(BLOGS_FILE, JSON.stringify(inMemoryBlogs, null, 2), "utf-8");
  } catch (err) {
    console.warn("File write skipped (serverless environment):", err);
  }
}

function persistEvents() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(EVENTS_FILE, JSON.stringify(inMemoryEvents, null, 2), "utf-8");
  } catch (err) {
    console.warn("File write skipped (serverless environment):", err);
  }
}

// Initial setup
ensureData();

// ==========================================
// 📰 BLOG FUNCTIONS (HYBRID MYSQL + JSON)
// ==========================================

export async function getBlogs(limit?: number, all: boolean = false): Promise<BlogItem[]> {
  // 1. Coba ambil dari MySQL terlebih dahulu
  try {
    let sql = all
      ? "SELECT * FROM blogs ORDER BY id DESC"
      : "SELECT * FROM blogs WHERE status = 'published' ORDER BY id DESC";
    if (limit && limit > 0) {
      sql += ` LIMIT ${Number(limit)}`;
    }
    const rows = await query<any[]>(sql);
    if (rows && rows.length > 0) {
      return rows.map((r) => ({
        id: r.id,
        title: r.title,
        slug: r.slug,
        author: r.author || "Tim Ladi",
        date: r.date || "",
        category: r.category || "PANDUAN USAHA",
        thumb: r.thumb,
        thumb_full: r.thumb_full,
        excerpt: r.excerpt || "",
        content: r.content || "",
        tags: r.tags || "",
        status: r.status || "published",
        created_at: r.created_at ? new Date(r.created_at).toISOString() : new Date().toISOString(),
      }));
    }
  } catch (dbErr) {
    // MySQL offline / circuit breaker terbuka -> otomatis fallback ke JSON lokal
  }

  // 2. Fallback: Baca dari File JSON
  ensureData();
  let list = inMemoryBlogs;
  if (!all) {
    list = list.filter((b) => b.status === "published");
  }
  if (limit && limit > 0) {
    return list.slice(0, limit);
  }
  return list;
}

export async function getBlogBySlug(slug: string): Promise<BlogItem | null> {
  // 1. Coba dari MySQL
  try {
    const rows = await query<any[]>(
      "SELECT * FROM blogs WHERE slug = ? AND status = 'published' LIMIT 1",
      [slug]
    );
    if (rows && rows.length > 0) {
      const r = rows[0];
      return {
        id: r.id,
        title: r.title,
        slug: r.slug,
        author: r.author || "Tim Ladi",
        date: r.date || "",
        category: r.category || "PANDUAN USAHA",
        thumb: r.thumb,
        thumb_full: r.thumb_full,
        excerpt: r.excerpt || "",
        content: r.content || "",
        tags: r.tags || "",
        status: r.status || "published",
        created_at: r.created_at ? new Date(r.created_at).toISOString() : new Date().toISOString(),
      };
    }
  } catch (e) {}

  // 2. Fallback JSON
  ensureData();
  return inMemoryBlogs.find((b) => b.slug.toLowerCase() === slug.toLowerCase() && b.status === "published") || null;
}

export async function getBlogById(id: number | string): Promise<BlogItem | null> {
  const numId = Number(id);
  // 1. Coba dari MySQL
  try {
    const rows = await query<any[]>("SELECT * FROM blogs WHERE id = ? LIMIT 1", [numId]);
    if (rows && rows.length > 0) {
      const r = rows[0];
      return {
        id: r.id,
        title: r.title,
        slug: r.slug,
        author: r.author || "Tim Ladi",
        date: r.date || "",
        category: r.category || "PANDUAN USAHA",
        thumb: r.thumb,
        thumb_full: r.thumb_full,
        excerpt: r.excerpt || "",
        content: r.content || "",
        tags: r.tags || "",
        status: r.status || "published",
        created_at: r.created_at ? new Date(r.created_at).toISOString() : new Date().toISOString(),
      };
    }
  } catch (e) {}

  // 2. Fallback JSON
  ensureData();
  return inMemoryBlogs.find((b) => b.id === numId) || null;
}

export async function createBlog(data: Partial<BlogItem>): Promise<BlogItem> {
  ensureData();
  const now = new Date();
  const dateStr = now.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const baseSlug = (data.title || "artikel-baru")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  let slug = baseSlug;
  let counter = 1;
  while (inMemoryBlogs.some((b) => b.slug === slug)) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  const title = data.title || "Artikel Baru";
  const author = data.author || "Tim Ladi";
  const date = data.date || dateStr;
  const category = data.category || "PANDUAN USAHA";
  const excerpt = data.excerpt || "";
  const content = data.content || "<p>Konten artikel...</p>";
  const tags = data.tags || "Digital, UMKM";
  const status = (data.status as "published" | "draft") || "published";

  let newId = inMemoryBlogs.length > 0 ? Math.max(...inMemoryBlogs.map((b) => b.id)) + 1 : 1;

  // 1. Simpan ke MySQL jika online
  try {
    const res = await query<any>(
      `INSERT INTO blogs (title, slug, author, date, category, excerpt, content, tags, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [title, slug, author, date, category, excerpt, content, tags, status]
    );
    if (res && res.insertId) {
      newId = res.insertId;
    }
  } catch (dbErr) {
    console.warn("MySQL insert blog skipped (offline/fallback):", dbErr);
  }

  const newBlog: BlogItem = {
    id: newId,
    title,
    slug,
    author,
    date,
    category,
    excerpt,
    content,
    tags,
    status,
    created_at: now.toISOString(),
  };

  // 2. Simpan ke JSON lokal
  inMemoryBlogs.unshift(newBlog);
  persistBlogs();

  return newBlog;
}

export async function updateBlog(id: number | string, data: Partial<BlogItem>): Promise<BlogItem | null> {
  const numId = Number(id);

  // 1. Update di MySQL
  try {
    await query(
      `UPDATE blogs SET 
        title = COALESCE(?, title),
        author = COALESCE(?, author),
        category = COALESCE(?, category),
        excerpt = COALESCE(?, excerpt),
        content = COALESCE(?, content),
        tags = COALESCE(?, tags),
        status = COALESCE(?, status)
       WHERE id = ?`,
      [data.title, data.author, data.category, data.excerpt, data.content, data.tags, data.status, numId]
    );
  } catch (dbErr) {}

  // 2. Update di JSON
  ensureData();
  const index = inMemoryBlogs.findIndex((b) => b.id === numId);
  if (index === -1) return null;

  const existing = inMemoryBlogs[index];
  const updated: BlogItem = {
    ...existing,
    ...data,
    id: existing.id,
    slug: data.slug || existing.slug,
    updated_at: new Date().toISOString(),
  };

  inMemoryBlogs[index] = updated;
  persistBlogs();
  return updated;
}

export async function deleteBlog(id: number | string): Promise<boolean> {
  const numId = Number(id);

  // 1. Delete dari MySQL
  try {
    await query("DELETE FROM blogs WHERE id = ?", [numId]);
  } catch (dbErr) {}

  // 2. Delete dari JSON
  ensureData();
  const index = inMemoryBlogs.findIndex((b) => b.id === numId);
  if (index === -1) return false;

  inMemoryBlogs.splice(index, 1);
  persistBlogs();
  return true;
}

// ==========================================
// 🎟️ EVENT FUNCTIONS (HYBRID MYSQL + JSON)
// ==========================================

export async function getEvents(limit?: number, all: boolean = false): Promise<EventItem[]> {
  // 1. Coba ambil dari MySQL
  try {
    let sql = all
      ? "SELECT * FROM events ORDER BY id DESC"
      : "SELECT * FROM events WHERE status = 'active' ORDER BY id DESC";
    if (limit && limit > 0) {
      sql += ` LIMIT ${Number(limit)}`;
    }
    const rows = await query<any[]>(sql);
    if (rows && rows.length > 0) {
      return rows.map((r) => ({
        id: r.id,
        title: r.title,
        tag: r.tag || "Workshop Praktis",
        thumb: r.thumb,
        date: r.date || "",
        location: r.location || "",
        short_desc: r.short_desc || "",
        description: r.description || "",
        btn_text: r.btn_text || "Daftar Sekarang",
        btn_link: r.btn_link || `https://wa.me/6281298319944?text=${encodeURIComponent("Halo Ladi, saya tertarik daftar event: " + r.title)}`,
        status: r.status || "active",
        created_at: r.created_at ? new Date(r.created_at).toISOString() : new Date().toISOString(),
      }));
    }
  } catch (e) {}

  // 2. Fallback JSON
  ensureData();
  let list = inMemoryEvents;
  if (!all) {
    list = list.filter((e) => e.status === "active");
  }
  if (limit && limit > 0) {
    return list.slice(0, limit);
  }
  return list;
}

export async function getEventById(id: number | string): Promise<EventItem | null> {
  const numId = Number(id);
  try {
    const rows = await query<any[]>("SELECT * FROM events WHERE id = ? LIMIT 1", [numId]);
    if (rows && rows.length > 0) {
      const r = rows[0];
      return {
        id: r.id,
        title: r.title,
        tag: r.tag || "Workshop",
        thumb: r.thumb,
        date: r.date || "",
        location: r.location || "",
        short_desc: r.short_desc || "",
        description: r.description || "",
        btn_text: r.btn_text || "Daftar Sekarang",
        btn_link: r.btn_link,
        status: r.status || "active",
        created_at: r.created_at ? new Date(r.created_at).toISOString() : new Date().toISOString(),
      };
    }
  } catch (e) {}

  ensureData();
  return inMemoryEvents.find((e) => e.id === numId) || null;
}

export async function createEvent(data: Partial<EventItem>): Promise<EventItem> {
  ensureData();
  const now = new Date();
  const title = data.title || "Event Baru";
  const tag = data.tag || "Workshop Praktis";
  const date = data.date || "Jadwal Mendatang";
  const location = data.location || "Online / Bogor";
  const short_desc = data.short_desc || "";
  const description = data.description || `<p>${short_desc}</p>`;
  const btn_text = data.btn_text || "Daftar via WhatsApp";
  const btn_link = data.btn_link || `https://wa.me/6281298319944?text=${encodeURIComponent("Halo Ladi, saya mau daftar " + title)}`;
  const status = (data.status as "active" | "inactive") || "active";

  let newId = inMemoryEvents.length > 0 ? Math.max(...inMemoryEvents.map((e) => e.id)) + 1 : 1;

  try {
    const res = await query<any>(
      `INSERT INTO events (title, tag, date, location, short_desc, description, btn_text, btn_link, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [title, tag, date, location, short_desc, description, btn_text, btn_link, status]
    );
    if (res && res.insertId) {
      newId = res.insertId;
    }
  } catch (e) {}

  const newEvent: EventItem = {
    id: newId,
    title,
    tag,
    date,
    location,
    short_desc,
    description,
    btn_text,
    btn_link,
    status,
    created_at: now.toISOString(),
  };

  inMemoryEvents.unshift(newEvent);
  persistEvents();
  return newEvent;
}

export async function updateEvent(id: number | string, data: Partial<EventItem>): Promise<EventItem | null> {
  const numId = Number(id);

  try {
    await query(
      `UPDATE events SET
        title = COALESCE(?, title),
        tag = COALESCE(?, tag),
        date = COALESCE(?, date),
        location = COALESCE(?, location),
        short_desc = COALESCE(?, short_desc),
        description = COALESCE(?, description),
        btn_text = COALESCE(?, btn_text),
        btn_link = COALESCE(?, btn_link),
        status = COALESCE(?, status)
       WHERE id = ?`,
      [data.title, data.tag, data.date, data.location, data.short_desc, data.description, data.btn_text, data.btn_link, data.status, numId]
    );
  } catch (e) {}

  ensureData();
  const index = inMemoryEvents.findIndex((e) => e.id === numId);
  if (index === -1) return null;

  const existing = inMemoryEvents[index];
  const updated: EventItem = {
    ...existing,
    ...data,
    id: existing.id,
    updated_at: new Date().toISOString(),
  };

  inMemoryEvents[index] = updated;
  persistEvents();
  return updated;
}

export async function deleteEvent(id: number | string): Promise<boolean> {
  const numId = Number(id);

  try {
    await query("DELETE FROM events WHERE id = ?", [numId]);
  } catch (e) {}

  ensureData();
  const index = inMemoryEvents.findIndex((e) => e.id === numId);
  if (index === -1) return false;

  inMemoryEvents.splice(index, 1);
  persistEvents();
  return true;
}
