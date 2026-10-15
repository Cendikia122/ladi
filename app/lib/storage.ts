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

export interface ProjectItem {
  id: number;
  title: string;
  slug: string;
  client_name: string;
  client_industry: string;
  client_location: string;
  website_url?: string;
  thumb?: string;
  summary: string;
  challenge: string;
  solution: string;
  results: string;
  year?: string;
  status: "published" | "draft";
  created_at: string;
  updated_at?: string;
}

export interface TeamMember {
  id: number;
  name: string;
  role: string;
  badge?: string;
  image?: string;
  desc: string;
  focus?: string;
  order_num?: number;
  status: "active" | "inactive";
  created_at: string;
  updated_at?: string;
}

export interface ServicePackage {
  id: number;
  name: string;
  slug: string;
  tag: string;
  subtitle: string;
  target_audience: string;
  price: string;
  original_price?: string;
  period?: string;
  timeline: string;
  deliverables: string;
  example_websites?: string;
  audit_report_sample?: string;
  description: string;
  faqs?: string;
  cta_text?: string;
  cta_whatsapp_text?: string;
  badge_popular?: boolean | number;
  status: "active" | "inactive";
  order_num?: number;
  created_at: string;
  updated_at?: string;
}

export interface OrderItem {
  id: number;
  order_number: string;
  package_slug: string;
  package_name: string;
  package_price: number;
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  business_name: string;
  business_category?: string;
  domain_requested?: string;
  notes?: string;
  payment_method: string;
  payment_proof?: string | null;
  payment_status: "unpaid" | "waiting_verification" | "paid" | "cancelled" | "refunded";
  order_status: "new" | "in_progress" | "review" | "completed";
  order_type?: "paketan" | "pecahan";
  template_name?: string;
  template_url?: string;
  template_tech?: string;
  domain_choice?: string;
  hosting_duration?: string;
  addons?: string;
  paid_at?: string | null;
  created_at: string;
  updated_at?: string;
}

export interface TemplateItem {
  id: string;
  name: string;
  tech: "HTML5" | "PHP" | "Laravel" | "React" | "Next.JS";
  type: string;
  industry: string;
  envato_url: string;
  allowed_packages: string[];
  description: string;
  badge?: string;
}

const DATA_DIR = path.join(process.cwd(), "data");
const BLOGS_FILE = path.join(DATA_DIR, "blogs.json");
const EVENTS_FILE = path.join(DATA_DIR, "events.json");
const PROJECTS_FILE = path.join(DATA_DIR, "projects.json");
const TEAM_FILE = path.join(DATA_DIR, "team.json");
const SERVICES_FILE = path.join(DATA_DIR, "services.json");
const ORDERS_FILE = path.join(DATA_DIR, "orders.json");
const TEMPLATES_FILE = path.join(DATA_DIR, "templates.json");

// In-memory fallback
let inMemoryBlogs: BlogItem[] = [];
let inMemoryEvents: EventItem[] = [];
let inMemoryProjects: ProjectItem[] = [];
let inMemoryTeam: TeamMember[] = [];
let inMemoryServices: ServicePackage[] = [];
let inMemoryOrders: OrderItem[] = [];
let inMemoryTemplates: TemplateItem[] = [];

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
    if (fs.existsSync(PROJECTS_FILE)) {
      const raw = fs.readFileSync(PROJECTS_FILE, "utf-8");
      inMemoryProjects = JSON.parse(raw);
    }
    if (fs.existsSync(TEAM_FILE)) {
      const raw = fs.readFileSync(TEAM_FILE, "utf-8");
      inMemoryTeam = JSON.parse(raw);
    }
    if (fs.existsSync(SERVICES_FILE)) {
      const raw = fs.readFileSync(SERVICES_FILE, "utf-8");
      inMemoryServices = JSON.parse(raw);
    }
    if (fs.existsSync(ORDERS_FILE)) {
      const raw = fs.readFileSync(ORDERS_FILE, "utf-8");
      inMemoryOrders = JSON.parse(raw);
    }
    if (fs.existsSync(TEMPLATES_FILE)) {
      const raw = fs.readFileSync(TEMPLATES_FILE, "utf-8");
      inMemoryTemplates = JSON.parse(raw);
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

function persistProjects() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(PROJECTS_FILE, JSON.stringify(inMemoryProjects, null, 2), "utf-8");
  } catch (err) {
    console.warn("File write skipped (serverless environment):", err);
  }
}

function persistTeam() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(TEAM_FILE, JSON.stringify(inMemoryTeam, null, 2), "utf-8");
  } catch (err) {
    console.warn("File write skipped (serverless environment):", err);
  }
}

function persistServices() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(SERVICES_FILE, JSON.stringify(inMemoryServices, null, 2), "utf-8");
  } catch (err) {
    console.warn("File write skipped (serverless environment):", err);
  }
}

function persistOrders() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(ORDERS_FILE, JSON.stringify(inMemoryOrders, null, 2), "utf-8");
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
    if (Array.isArray(rows)) {
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
  const thumb = data.thumb || data.thumb_full || "";
  const thumb_full = data.thumb_full || thumb;
  const status = (data.status as "published" | "draft") || "published";

  let newId = inMemoryBlogs.length > 0 ? Math.max(...inMemoryBlogs.map((b) => b.id)) + 1 : 1;

  // 1. Simpan ke MySQL jika online
  try {
    const res = await query<any>(
      `INSERT INTO blogs (title, slug, author, date, category, thumb, thumb_full, excerpt, content, tags, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [title, slug, author, date, category, thumb, thumb_full, excerpt, content, tags, status]
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
    thumb,
    thumb_full,
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
  let updatedInMysql = false;

  // 1. Update di MySQL
  try {
    const res = await query<any>(
      `UPDATE blogs SET 
        title = COALESCE(?, title),
        author = COALESCE(?, author),
        category = COALESCE(?, category),
        thumb = COALESCE(?, thumb),
        thumb_full = COALESCE(?, thumb_full),
        excerpt = COALESCE(?, excerpt),
        content = COALESCE(?, content),
        tags = COALESCE(?, tags),
        status = COALESCE(?, status)
       WHERE id = ?`,
      [data.title, data.author, data.category, data.thumb, data.thumb_full, data.excerpt, data.content, data.tags, data.status, numId]
    );
    if (res && (res.affectedRows > 0 || res.changedRows > 0)) {
      updatedInMysql = true;
    }
  } catch (dbErr) {}

  // 2. Update di JSON
  ensureData();
  const index = inMemoryBlogs.findIndex((b) => b.id === numId || String(b.id) === String(id));

  if (index !== -1) {
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

  const fromDb = await getBlogById(numId);
  if (fromDb) {
    return fromDb;
  }

  return null;
}

export async function deleteBlog(id: number | string): Promise<boolean> {
  const numId = Number(id);
  let deletedFromMysql = false;

  // 1. Delete dari MySQL
  try {
    const res = await query<any>("DELETE FROM blogs WHERE id = ?", [numId]);
    if (res && res.affectedRows > 0) {
      deletedFromMysql = true;
    }
  } catch (dbErr) {}

  // 2. Delete dari JSON
  ensureData();
  const index = inMemoryBlogs.findIndex((b) => b.id === numId || String(b.id) === String(id));
  let deletedFromJson = false;
  if (index !== -1) {
    inMemoryBlogs.splice(index, 1);
    persistBlogs();
    deletedFromJson = true;
  }

  return deletedFromMysql || deletedFromJson;
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
    if (Array.isArray(rows)) {
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
        btn_link: r.btn_link || `https://wa.me/6282112477119?text=${encodeURIComponent("Halo Ladi, saya tertarik daftar event: " + r.title)}`,
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
  const thumb = data.thumb || "";
  const date = data.date || "Jadwal Mendatang";
  const location = data.location || "Online / Bogor";
  const short_desc = data.short_desc || "";
  const description = data.description || `<p>${short_desc}</p>`;
  const btn_text = data.btn_text || "Daftar via WhatsApp";
  const btn_link = data.btn_link || `https://wa.me/6282112477119?text=${encodeURIComponent("Halo Ladi, saya mau daftar " + title)}`;
  const status = (data.status as "active" | "inactive") || "active";

  let newId = inMemoryEvents.length > 0 ? Math.max(...inMemoryEvents.map((e) => e.id)) + 1 : 1;

  try {
    const res = await query<any>(
      `INSERT INTO events (title, tag, thumb, date, location, short_desc, description, btn_text, btn_link, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [title, tag, thumb, date, location, short_desc, description, btn_text, btn_link, status]
    );
    if (res && res.insertId) {
      newId = res.insertId;
    }
  } catch (e) {}

  const newEvent: EventItem = {
    id: newId,
    title,
    tag,
    thumb,
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
  let updatedInMysql = false;

  try {
    const res = await query<any>(
      `UPDATE events SET
        title = COALESCE(?, title),
        tag = COALESCE(?, tag),
        thumb = COALESCE(?, thumb),
        date = COALESCE(?, date),
        location = COALESCE(?, location),
        short_desc = COALESCE(?, short_desc),
        description = COALESCE(?, description),
        btn_text = COALESCE(?, btn_text),
        btn_link = COALESCE(?, btn_link),
        status = COALESCE(?, status)
       WHERE id = ?`,
      [data.title, data.tag, data.thumb, data.date, data.location, data.short_desc, data.description, data.btn_text, data.btn_link, data.status, numId]
    );
    if (res && (res.affectedRows > 0 || res.changedRows > 0)) {
      updatedInMysql = true;
    }
  } catch (e) {}

  ensureData();
  const index = inMemoryEvents.findIndex((e) => e.id === numId || String(e.id) === String(id));

  if (index !== -1) {
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

  const fromDb = await getEventById(numId);
  if (fromDb) {
    return fromDb;
  }

  return null;
}

export async function deleteEvent(id: number | string): Promise<boolean> {
  const numId = Number(id);
  let deletedFromMysql = false;

  try {
    const res = await query<any>("DELETE FROM events WHERE id = ?", [numId]);
    if (res && res.affectedRows > 0) {
      deletedFromMysql = true;
    }
  } catch (e) {}

  ensureData();
  const index = inMemoryEvents.findIndex((e) => e.id === numId || String(e.id) === String(id));
  let deletedFromJson = false;
  if (index !== -1) {
    inMemoryEvents.splice(index, 1);
    persistEvents();
    deletedFromJson = true;
  }

  return deletedFromMysql || deletedFromJson;
}

// ==========================================
// 💼 PROJECT / PORTFOLIO FUNCTIONS (HYBRID MYSQL + JSON)
// ==========================================

export async function getProjects(limit?: number, all: boolean = false): Promise<ProjectItem[]> {
  // 1. Coba ambil dari MySQL
  try {
    let sql = all
      ? "SELECT * FROM projects ORDER BY id DESC"
      : "SELECT * FROM projects WHERE status = 'published' ORDER BY id DESC";
    if (limit && limit > 0) {
      sql += ` LIMIT ${Number(limit)}`;
    }
    const rows = await query<any[]>(sql);
    if (Array.isArray(rows)) {
      return rows.map((r) => ({
        id: r.id,
        title: r.title,
        slug: r.slug,
        client_name: r.client_name || "",
        client_industry: r.client_industry || "",
        client_location: r.client_location || "",
        website_url: r.website_url || "",
        thumb: r.thumb,
        summary: r.summary || "",
        challenge: r.challenge || "",
        solution: r.solution || "",
        results: r.results || "",
        year: r.year || "2026",
        status: r.status || "published",
        created_at: r.created_at ? new Date(r.created_at).toISOString() : new Date().toISOString(),
      }));
    }
  } catch (e) {}

  // 2. Fallback JSON
  ensureData();
  let list = inMemoryProjects;
  if (!all) {
    list = list.filter((p) => p.status === "published");
  }
  if (limit && limit > 0) {
    return list.slice(0, limit);
  }
  return list;
}

export async function getProjectBySlug(slug: string): Promise<ProjectItem | null> {
  try {
    const rows = await query<any[]>(
      "SELECT * FROM projects WHERE slug = ? AND status = 'published' LIMIT 1",
      [slug]
    );
    if (rows && rows.length > 0) {
      const r = rows[0];
      return {
        id: r.id,
        title: r.title,
        slug: r.slug,
        client_name: r.client_name || "",
        client_industry: r.client_industry || "",
        client_location: r.client_location || "",
        website_url: r.website_url || "",
        thumb: r.thumb,
        summary: r.summary || "",
        challenge: r.challenge || "",
        solution: r.solution || "",
        results: r.results || "",
        year: r.year || "2026",
        status: r.status || "published",
        created_at: r.created_at ? new Date(r.created_at).toISOString() : new Date().toISOString(),
      };
    }
  } catch (e) {}

  ensureData();
  return inMemoryProjects.find((p) => p.slug.toLowerCase() === slug.toLowerCase() && p.status === "published") || null;
}

export async function getProjectById(id: number | string): Promise<ProjectItem | null> {
  const numId = Number(id);
  try {
    const rows = await query<any[]>("SELECT * FROM projects WHERE id = ? LIMIT 1", [numId]);
    if (rows && rows.length > 0) {
      const r = rows[0];
      return {
        id: r.id,
        title: r.title,
        slug: r.slug,
        client_name: r.client_name || "",
        client_industry: r.client_industry || "",
        client_location: r.client_location || "",
        website_url: r.website_url || "",
        thumb: r.thumb,
        summary: r.summary || "",
        challenge: r.challenge || "",
        solution: r.solution || "",
        results: r.results || "",
        year: r.year || "2026",
        status: r.status || "published",
        created_at: r.created_at ? new Date(r.created_at).toISOString() : new Date().toISOString(),
      };
    }
  } catch (e) {}

  ensureData();
  return inMemoryProjects.find((p) => p.id === numId || String(p.id) === String(id)) || null;
}

export async function createProject(data: Partial<ProjectItem>): Promise<ProjectItem> {
  ensureData();
  const now = new Date();

  const baseSlug = (data.title || "proyek-baru")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  let slug = baseSlug;
  let counter = 1;
  while (inMemoryProjects.some((p) => p.slug === slug)) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  const title = data.title || "Proyek Baru";
  const client_name = data.client_name || "";
  const client_industry = data.client_industry || "UMKM";
  const client_location = data.client_location || "Bogor, Indonesia";
  const website_url = data.website_url || "";
  const thumb = data.thumb || "";
  const summary = data.summary || "";
  const challenge = data.challenge || "";
  const solution = data.solution || "";
  const results = data.results || "";
  const year = data.year || String(now.getFullYear());
  const status = (data.status as "published" | "draft") || "published";

  let newId = inMemoryProjects.length > 0 ? Math.max(...inMemoryProjects.map((p) => p.id)) + 1 : 1;

  try {
    const res = await query<any>(
      `INSERT INTO projects (title, slug, client_name, client_industry, client_location, website_url, thumb, summary, challenge, solution, results, year, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [title, slug, client_name, client_industry, client_location, website_url, thumb, summary, challenge, solution, results, year, status]
    );
    if (res && res.insertId) {
      newId = res.insertId;
    }
  } catch (e) {}

  const newProject: ProjectItem = {
    id: newId,
    title,
    slug,
    client_name,
    client_industry,
    client_location,
    website_url,
    thumb,
    summary,
    challenge,
    solution,
    results,
    year,
    status,
    created_at: now.toISOString(),
  };

  inMemoryProjects.unshift(newProject);
  persistProjects();
  return newProject;
}

export async function updateProject(id: number | string, data: Partial<ProjectItem>): Promise<ProjectItem | null> {
  const numId = Number(id);
  let updatedInMysql = false;

  try {
    const res = await query<any>(
      `UPDATE projects SET
        title = COALESCE(?, title),
        client_name = COALESCE(?, client_name),
        client_industry = COALESCE(?, client_industry),
        client_location = COALESCE(?, client_location),
        website_url = COALESCE(?, website_url),
        thumb = COALESCE(?, thumb),
        summary = COALESCE(?, summary),
        challenge = COALESCE(?, challenge),
        solution = COALESCE(?, solution),
        results = COALESCE(?, results),
        year = COALESCE(?, year),
        status = COALESCE(?, status)
       WHERE id = ?`,
      [
        data.title,
        data.client_name,
        data.client_industry,
        data.client_location,
        data.website_url,
        data.thumb,
        data.summary,
        data.challenge,
        data.solution,
        data.results,
        data.year,
        data.status,
        numId,
      ]
    );
    if (res && (res.affectedRows > 0 || res.changedRows > 0)) {
      updatedInMysql = true;
    }
  } catch (e) {}

  ensureData();
  const index = inMemoryProjects.findIndex((p) => p.id === numId || String(p.id) === String(id));

  if (index !== -1) {
    const existing = inMemoryProjects[index];
    const updated: ProjectItem = {
      ...existing,
      ...data,
      id: existing.id,
      updated_at: new Date().toISOString(),
    };

    inMemoryProjects[index] = updated;
    persistProjects();
    return updated;
  }

  const fromDb = await getProjectById(numId);
  if (fromDb) {
    return fromDb;
  }

  return null;
}

export async function deleteProject(id: number | string): Promise<boolean> {
  const numId = Number(id);
  let deletedFromMysql = false;

  try {
    const res = await query<any>("DELETE FROM projects WHERE id = ?", [numId]);
    if (res && res.affectedRows > 0) {
      deletedFromMysql = true;
    }
  } catch (e) {}

  ensureData();
  const index = inMemoryProjects.findIndex((p) => p.id === numId || String(p.id) === String(id));
  let deletedFromJson = false;
  if (index !== -1) {
    inMemoryProjects.splice(index, 1);
    persistProjects();
    deletedFromJson = true;
  }

  return deletedFromMysql || deletedFromJson;
}

// ==========================================
// 👥 TEAM FUNCTIONS (HYBRID MYSQL + JSON)
// ==========================================

export async function getTeamMembers(all: boolean = false): Promise<TeamMember[]> {
  // 1. Coba ambil dari MySQL terlebih dahulu
  try {
    const sql = all
      ? "SELECT * FROM team_members ORDER BY order_num ASC, id ASC"
      : "SELECT * FROM team_members WHERE status = 'active' ORDER BY order_num ASC, id ASC";
    const rows = await query<any[]>(sql);
    if (Array.isArray(rows)) {
      return rows.map((r) => ({
        id: r.id,
        name: r.name,
        role: r.role,
        badge: r.badge || "",
        image: r.image || "/images/team/team1.jpg",
        desc: r.desc || "",
        focus: r.focus || "",
        order_num: r.order_num !== null && r.order_num !== undefined ? Number(r.order_num) : 0,
        status: r.status || "active",
        created_at: r.created_at ? new Date(r.created_at).toISOString() : new Date().toISOString(),
        updated_at: r.updated_at ? new Date(r.updated_at).toISOString() : undefined,
      }));
    }
  } catch (dbErr) {
    // MySQL offline -> fallback ke JSON
  }

  // 2. Fallback: Baca dari File JSON
  ensureData();
  let list = inMemoryTeam;
  if (!all) {
    list = list.filter((m) => m.status === "active");
  }
  return [...list].sort((a, b) => (a.order_num || 0) - (b.order_num || 0));
}

export async function getTeamMemberById(id: number | string): Promise<TeamMember | null> {
  const numId = Number(id);
  // 1. Coba dari MySQL
  try {
    const rows = await query<any[]>(
      "SELECT * FROM team_members WHERE id = ? LIMIT 1",
      [numId]
    );
    if (rows && rows.length > 0) {
      const r = rows[0];
      return {
        id: r.id,
        name: r.name,
        role: r.role,
        badge: r.badge || "",
        image: r.image || "/images/team/team1.jpg",
        desc: r.desc || "",
        focus: r.focus || "",
        order_num: r.order_num !== null && r.order_num !== undefined ? Number(r.order_num) : 0,
        status: r.status || "active",
        created_at: r.created_at ? new Date(r.created_at).toISOString() : new Date().toISOString(),
      };
    }
  } catch (e) {}

  // 2. Fallback JSON
  ensureData();
  return inMemoryTeam.find((m) => m.id === numId || String(m.id) === String(id)) || null;
}

export async function createTeamMember(data: Partial<TeamMember>): Promise<TeamMember> {
  const name = data.name || "Anggota Tim";
  const role = data.role || "Spesialis Digital";
  const badge = data.badge || "Tim Ladi";
  const image = data.image || "/images/team/team1.jpg";
  const desc = data.desc || "";
  const focus = data.focus || "";
  const order_num = data.order_num !== undefined ? Number(data.order_num) : 0;
  const status: "active" | "inactive" = data.status === "inactive" ? "inactive" : "active";

  ensureData();
  const nextId = inMemoryTeam.length > 0 ? Math.max(...inMemoryTeam.map((m) => m.id)) + 1 : 1;
  let finalId = nextId;

  // Simpan ke MySQL
  try {
    const res = await query<any>(
      `INSERT INTO team_members (name, role, badge, image, \`desc\`, focus, order_num, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, role, badge, image, desc, focus, order_num, status]
    );
    if (res && res.insertId) {
      finalId = res.insertId;
    }
  } catch (e) {}

  const newItem: TeamMember = {
    id: finalId,
    name,
    role,
    badge,
    image,
    desc,
    focus,
    order_num,
    status,
    created_at: new Date().toISOString(),
  };

  inMemoryTeam.push(newItem);
  persistTeam();

  return newItem;
}

export async function updateTeamMember(
  id: number | string,
  data: Partial<TeamMember>
): Promise<TeamMember | null> {
  const numId = Number(id);
  let updatedInMysql = false;

  try {
    const res = await query<any>(
      `UPDATE team_members SET
        name = COALESCE(?, name),
        role = COALESCE(?, role),
        badge = COALESCE(?, badge),
        image = COALESCE(?, image),
        \`desc\` = COALESCE(?, \`desc\`),
        focus = COALESCE(?, focus),
        order_num = COALESCE(?, order_num),
        status = COALESCE(?, status)
       WHERE id = ?`,
      [
        data.name,
        data.role,
        data.badge,
        data.image,
        data.desc,
        data.focus,
        data.order_num !== undefined ? Number(data.order_num) : null,
        data.status,
        numId,
      ]
    );
    if (res && (res.affectedRows > 0 || res.changedRows > 0)) {
      updatedInMysql = true;
    }
  } catch (e) {}

  ensureData();
  const index = inMemoryTeam.findIndex((m) => m.id === numId || String(m.id) === String(id));

  if (index !== -1) {
    const existing = inMemoryTeam[index];
    const updated: TeamMember = {
      ...existing,
      ...data,
      id: existing.id,
      updated_at: new Date().toISOString(),
    };

    inMemoryTeam[index] = updated;
    persistTeam();
    return updated;
  }

  const fromDb = await getTeamMemberById(numId);
  if (fromDb) {
    return fromDb;
  }

  return null;
}

export async function deleteTeamMember(id: number | string): Promise<boolean> {
  const numId = Number(id);
  let deletedFromMysql = false;

  try {
    const res = await query<any>("DELETE FROM team_members WHERE id = ?", [numId]);
    if (res && res.affectedRows > 0) {
      deletedFromMysql = true;
    }
  } catch (e) {}

  ensureData();
  const index = inMemoryTeam.findIndex((m) => m.id === numId || String(m.id) === String(id));
  let deletedFromJson = false;
  if (index !== -1) {
    inMemoryTeam.splice(index, 1);
    persistTeam();
    deletedFromJson = true;
  }

  return deletedFromMysql || deletedFromJson;
}

// ==============================================================================
// SERVICE PACKAGES / PRODUK LAYANAN (Landing Page Iklan & CRUD Super Admin)
// ==============================================================================

export async function getServicePackages(all = false): Promise<ServicePackage[]> {
  try {
    const sql = all
      ? "SELECT * FROM service_packages ORDER BY order_num ASC, id ASC"
      : "SELECT * FROM service_packages WHERE status = 'active' ORDER BY order_num ASC, id ASC";
    const rows = await query<any[]>(sql);
    if (rows && rows.length > 0) {
      return rows.map((r) => ({
        id: Number(r.id),
        name: r.name,
        slug: r.slug,
        tag: r.tag || "PAKET LADI",
        subtitle: r.subtitle || "",
        target_audience: r.target_audience || "",
        price: r.price || "",
        original_price: r.original_price || "",
        period: r.period || "Sekali Bayar",
        timeline: r.timeline || "5–7 Hari",
        deliverables: r.deliverables || "[]",
        example_websites: r.example_websites || "[]",
        audit_report_sample: r.audit_report_sample || "{}",
        description: r.description || "",
        faqs: r.faqs || "[]",
        cta_text: r.cta_text || "Pesan via WhatsApp",
        cta_whatsapp_text: r.cta_whatsapp_text || "",
        badge_popular: Boolean(r.badge_popular),
        status: r.status || "active",
        order_num: Number(r.order_num || 0),
        created_at: r.created_at ? new Date(r.created_at).toISOString() : new Date().toISOString(),
        updated_at: r.updated_at ? new Date(r.updated_at).toISOString() : undefined,
      }));
    }
  } catch (e) {
    // Fallback ke JSON
  }

  ensureData();
  const list = all ? inMemoryServices : inMemoryServices.filter((s) => s.status === "active");
  return list.sort((a, b) => (a.order_num || 0) - (b.order_num || 0));
}

export async function getServicePackageBySlug(slug: string): Promise<ServicePackage | null> {
  const clean = slug.trim().toLowerCase();
  try {
    const rows = await query<any[]>("SELECT * FROM service_packages WHERE slug = ? LIMIT 1", [clean]);
    if (rows && rows.length > 0) {
      const r = rows[0];
      return {
        id: Number(r.id),
        name: r.name,
        slug: r.slug,
        tag: r.tag || "PAKET LADI",
        subtitle: r.subtitle || "",
        target_audience: r.target_audience || "",
        price: r.price || "",
        original_price: r.original_price || "",
        period: r.period || "Sekali Bayar",
        timeline: r.timeline || "5–7 Hari",
        deliverables: r.deliverables || "[]",
        example_websites: r.example_websites || "[]",
        audit_report_sample: r.audit_report_sample || "{}",
        description: r.description || "",
        faqs: r.faqs || "[]",
        cta_text: r.cta_text || "Pesan via WhatsApp",
        cta_whatsapp_text: r.cta_whatsapp_text || "",
        badge_popular: Boolean(r.badge_popular),
        status: r.status || "active",
        order_num: Number(r.order_num || 0),
        created_at: r.created_at ? new Date(r.created_at).toISOString() : new Date().toISOString(),
        updated_at: r.updated_at ? new Date(r.updated_at).toISOString() : undefined,
      };
    }
  } catch (e) {
    // Fallback ke JSON
  }

  ensureData();
  return inMemoryServices.find((s) => s.slug.toLowerCase() === clean) || null;
}

export async function getServicePackageById(id: number | string): Promise<ServicePackage | null> {
  const numId = Number(id);
  try {
    const rows = await query<any[]>("SELECT * FROM service_packages WHERE id = ? LIMIT 1", [numId]);
    if (rows && rows.length > 0) {
      const r = rows[0];
      return {
        id: Number(r.id),
        name: r.name,
        slug: r.slug,
        tag: r.tag || "PAKET LADI",
        subtitle: r.subtitle || "",
        target_audience: r.target_audience || "",
        price: r.price || "",
        original_price: r.original_price || "",
        period: r.period || "Sekali Bayar",
        timeline: r.timeline || "5–7 Hari",
        deliverables: r.deliverables || "[]",
        example_websites: r.example_websites || "[]",
        audit_report_sample: r.audit_report_sample || "{}",
        description: r.description || "",
        faqs: r.faqs || "[]",
        cta_text: r.cta_text || "Pesan via WhatsApp",
        cta_whatsapp_text: r.cta_whatsapp_text || "",
        badge_popular: Boolean(r.badge_popular),
        status: r.status || "active",
        order_num: Number(r.order_num || 0),
        created_at: r.created_at ? new Date(r.created_at).toISOString() : new Date().toISOString(),
        updated_at: r.updated_at ? new Date(r.updated_at).toISOString() : undefined,
      };
    }
  } catch (e) {
    // Fallback ke JSON
  }

  ensureData();
  return inMemoryServices.find((s) => s.id === numId || String(s.id) === String(id)) || null;
}

export async function createServicePackage(data: Partial<ServicePackage>): Promise<ServicePackage> {
  ensureData();
  const nextId = inMemoryServices.length > 0 ? Math.max(...inMemoryServices.map((s) => s.id)) + 1 : 1;

  const newPackage: ServicePackage = {
    id: nextId,
    name: data.name || "Paket Baru",
    slug: data.slug || `paket-${Date.now()}`,
    tag: data.tag || "PAKET LADI",
    subtitle: data.subtitle || "",
    target_audience: data.target_audience || "",
    price: data.price || "Rp 0",
    original_price: data.original_price || "",
    period: data.period || "Sekali Bayar",
    timeline: data.timeline || "5–7 Hari",
    deliverables: data.deliverables || "[]",
    example_websites: data.example_websites || "[]",
    audit_report_sample: data.audit_report_sample || "{}",
    description: data.description || "",
    faqs: data.faqs || "[]",
    cta_text: data.cta_text || "Pesan via WhatsApp",
    cta_whatsapp_text: data.cta_whatsapp_text || "",
    badge_popular: data.badge_popular ? 1 : 0,
    status: data.status || "active",
    order_num: typeof data.order_num === "number" ? data.order_num : inMemoryServices.length + 1,
    created_at: new Date().toISOString(),
  };

  try {
    const res = await query<any>(
      `INSERT INTO service_packages (name, slug, tag, subtitle, target_audience, price, original_price, period, timeline, deliverables, example_websites, audit_report_sample, description, faqs, cta_text, cta_whatsapp_text, badge_popular, status, order_num)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        newPackage.name,
        newPackage.slug,
        newPackage.tag,
        newPackage.subtitle,
        newPackage.target_audience,
        newPackage.price,
        newPackage.original_price || "",
        newPackage.period,
        newPackage.timeline,
        newPackage.deliverables,
        newPackage.example_websites || "[]",
        newPackage.audit_report_sample || "{}",
        newPackage.description,
        newPackage.faqs || "[]",
        newPackage.cta_text,
        newPackage.cta_whatsapp_text || "",
        newPackage.badge_popular ? 1 : 0,
        newPackage.status,
        newPackage.order_num,
      ]
    );
    if (res && res.insertId) {
      newPackage.id = res.insertId;
    }
  } catch (e) {
    // Fallback ke JSON
  }

  inMemoryServices.push(newPackage);
  persistServices();
  return newPackage;
}

export async function updateServicePackage(
  id: number | string,
  data: Partial<ServicePackage>
): Promise<ServicePackage | null> {
  const numId = Number(id);

  try {
    const fields: string[] = [];
    const values: any[] = [];

    if (data.name !== undefined) { fields.push("name = ?"); values.push(data.name); }
    if (data.slug !== undefined) { fields.push("slug = ?"); values.push(data.slug); }
    if (data.tag !== undefined) { fields.push("tag = ?"); values.push(data.tag); }
    if (data.subtitle !== undefined) { fields.push("subtitle = ?"); values.push(data.subtitle); }
    if (data.target_audience !== undefined) { fields.push("target_audience = ?"); values.push(data.target_audience); }
    if (data.price !== undefined) { fields.push("price = ?"); values.push(data.price); }
    if (data.original_price !== undefined) { fields.push("original_price = ?"); values.push(data.original_price); }
    if (data.period !== undefined) { fields.push("period = ?"); values.push(data.period); }
    if (data.timeline !== undefined) { fields.push("timeline = ?"); values.push(data.timeline); }
    if (data.deliverables !== undefined) { fields.push("deliverables = ?"); values.push(data.deliverables); }
    if (data.example_websites !== undefined) { fields.push("example_websites = ?"); values.push(data.example_websites); }
    if (data.audit_report_sample !== undefined) { fields.push("audit_report_sample = ?"); values.push(data.audit_report_sample); }
    if (data.description !== undefined) { fields.push("description = ?"); values.push(data.description); }
    if (data.faqs !== undefined) { fields.push("faqs = ?"); values.push(data.faqs); }
    if (data.cta_text !== undefined) { fields.push("cta_text = ?"); values.push(data.cta_text); }
    if (data.cta_whatsapp_text !== undefined) { fields.push("cta_whatsapp_text = ?"); values.push(data.cta_whatsapp_text); }
    if (data.badge_popular !== undefined) { fields.push("badge_popular = ?"); values.push(data.badge_popular ? 1 : 0); }
    if (data.status !== undefined) { fields.push("status = ?"); values.push(data.status); }
    if (data.order_num !== undefined) { fields.push("order_num = ?"); values.push(data.order_num); }

    if (fields.length > 0) {
      values.push(numId);
      await query<any>(`UPDATE service_packages SET ${fields.join(", ")} WHERE id = ?`, values);
    }
  } catch (e) {
    // Fallback ke JSON
  }

  ensureData();
  const index = inMemoryServices.findIndex((s) => s.id === numId || String(s.id) === String(id));
  if (index !== -1) {
    const existing = inMemoryServices[index];
    const updated: ServicePackage = {
      ...existing,
      ...data,
      id: existing.id,
      updated_at: new Date().toISOString(),
    };
    inMemoryServices[index] = updated;
    persistServices();
    return updated;
  }

  return await getServicePackageById(numId);
}

export async function deleteServicePackage(id: number | string): Promise<boolean> {
  const numId = Number(id);
  let deletedFromMysql = false;

  try {
    const res = await query<any>("DELETE FROM service_packages WHERE id = ?", [numId]);
    if (res && res.affectedRows > 0) {
      deletedFromMysql = true;
    }
  } catch (e) {}

  ensureData();
  const index = inMemoryServices.findIndex((s) => s.id === numId || String(s.id) === String(id));
  let deletedFromJson = false;
  if (index !== -1) {
    inMemoryServices.splice(index, 1);
    persistServices();
    deletedFromJson = true;
  }

  return deletedFromMysql || deletedFromJson;
}

// ----------------------------------------------------
// ORDERS (Sistem Pemesanan Otomatis & Instant Checkout)
// ----------------------------------------------------

export async function getOrders(limit?: number, statusFilter?: string): Promise<OrderItem[]> {
  try {
    let sql = "SELECT * FROM orders";
    const params: any[] = [];
    if (statusFilter && statusFilter !== "all") {
      sql += " WHERE payment_status = ? OR order_status = ?";
      params.push(statusFilter, statusFilter);
    }
    sql += " ORDER BY id DESC";
    if (limit) {
      sql += " LIMIT ?";
      params.push(limit);
    }
    const rows = await query<any[]>(sql, params);
    if (rows && rows.length >= 0) {
      return rows.map((r) => ({
        ...r,
        package_price: Number(r.package_price),
        created_at: r.created_at ? new Date(r.created_at).toISOString() : new Date().toISOString(),
        updated_at: r.updated_at ? new Date(r.updated_at).toISOString() : undefined,
        paid_at: r.paid_at ? new Date(r.paid_at).toISOString() : null,
      }));
    }
  } catch (err) {
    console.warn("MySQL getOrders failed, using fallback:", err);
  }

  ensureData();
  let list = [...inMemoryOrders];
  if (statusFilter && statusFilter !== "all") {
    list = list.filter((o) => o.payment_status === statusFilter || o.order_status === statusFilter);
  }
  list.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  if (limit) {
    list = list.slice(0, limit);
  }
  return list;
}

export async function getOrderByNumber(orderNumber: string): Promise<OrderItem | null> {
  try {
    const rows = await query<any[]>("SELECT * FROM orders WHERE order_number = ? LIMIT 1", [orderNumber]);
    if (rows && rows.length > 0) {
      const r = rows[0];
      return {
        ...r,
        package_price: Number(r.package_price),
        created_at: r.created_at ? new Date(r.created_at).toISOString() : new Date().toISOString(),
        updated_at: r.updated_at ? new Date(r.updated_at).toISOString() : undefined,
        paid_at: r.paid_at ? new Date(r.paid_at).toISOString() : null,
      };
    }
  } catch (err) {
    console.warn("MySQL getOrderByNumber failed, using fallback:", err);
  }

  ensureData();
  const found = inMemoryOrders.find((o) => o.order_number.toLowerCase() === orderNumber.toLowerCase());
  return found || null;
}

export async function createOrder(
  data: Omit<OrderItem, "id" | "created_at" | "updated_at">
): Promise<OrderItem> {
  const now = new Date().toISOString();
  let insertedId = 0;

  try {
    const res = await query<any>(
      `INSERT INTO orders (
        order_number, package_slug, package_name, package_price,
        customer_name, customer_phone, customer_email, business_name,
        business_category, domain_requested, notes, payment_method,
        payment_proof, payment_status, order_status, paid_at,
        order_type, template_name, template_url, template_tech,
        domain_choice, hosting_duration, addons
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        data.order_number,
        data.package_slug,
        data.package_name,
        data.package_price,
        data.customer_name,
        data.customer_phone,
        data.customer_email || "",
        data.business_name,
        data.business_category || "",
        data.domain_requested || "",
        data.notes || "",
        data.payment_method || "QRIS",
        data.payment_proof || null,
        data.payment_status || "unpaid",
        data.order_status || "new",
        data.paid_at || null,
        data.order_type || "paketan",
        data.template_name || "",
        data.template_url || "",
        data.template_tech || "",
        data.domain_choice || "",
        data.hosting_duration || "",
        data.addons || "",
      ]
    );
    if (res && res.insertId) {
      insertedId = res.insertId;
    }
  } catch (err) {
    console.warn("MySQL createOrder error:", err);
  }

  ensureData();
  if (!insertedId) {
    insertedId = inMemoryOrders.length > 0 ? Math.max(...inMemoryOrders.map((o) => o.id)) + 1 : 1;
  }

  const newOrder: OrderItem = {
    ...data,
    id: insertedId,
    created_at: now,
    updated_at: now,
  };

  inMemoryOrders.unshift(newOrder);
  persistOrders();
  return newOrder;
}

export async function updateOrder(
  orderNumber: string,
  updates: Partial<OrderItem>
): Promise<OrderItem | null> {
  const now = new Date().toISOString();

  try {
    const fields: string[] = [];
    const values: any[] = [];

    if (updates.payment_status !== undefined) {
      fields.push("payment_status = ?");
      values.push(updates.payment_status);
      if (updates.payment_status === "paid" && !updates.paid_at) {
        fields.push("paid_at = NOW()");
      }
    }
    if (updates.order_status !== undefined) {
      fields.push("order_status = ?");
      values.push(updates.order_status);
    }
    if (updates.payment_proof !== undefined) {
      fields.push("payment_proof = ?");
      values.push(updates.payment_proof);
    }
    if (updates.notes !== undefined) {
      fields.push("notes = ?");
      values.push(updates.notes);
    }
    if (updates.domain_requested !== undefined) {
      fields.push("domain_requested = ?");
      values.push(updates.domain_requested);
    }
    if (updates.order_type !== undefined) {
      fields.push("order_type = ?");
      values.push(updates.order_type);
    }
    if (updates.template_name !== undefined) {
      fields.push("template_name = ?");
      values.push(updates.template_name);
    }
    if (updates.template_url !== undefined) {
      fields.push("template_url = ?");
      values.push(updates.template_url);
    }
    if (updates.template_tech !== undefined) {
      fields.push("template_tech = ?");
      values.push(updates.template_tech);
    }
    if (updates.domain_choice !== undefined) {
      fields.push("domain_choice = ?");
      values.push(updates.domain_choice);
    }
    if (updates.hosting_duration !== undefined) {
      fields.push("hosting_duration = ?");
      values.push(updates.hosting_duration);
    }
    if (updates.addons !== undefined) {
      fields.push("addons = ?");
      values.push(updates.addons);
    }

    if (fields.length > 0) {
      values.push(orderNumber);
      await query<any>(`UPDATE orders SET ${fields.join(", ")} WHERE order_number = ?`, values);
    }
  } catch (err) {
    console.warn("MySQL updateOrder error:", err);
  }

  ensureData();
  const idx = inMemoryOrders.findIndex((o) => o.order_number === orderNumber);
  if (idx !== -1) {
    const existing = inMemoryOrders[idx];
    const updated = {
      ...existing,
      ...updates,
      updated_at: now,
      paid_at: updates.payment_status === "paid" ? (updates.paid_at || now) : existing.paid_at,
    };
    inMemoryOrders[idx] = updated;
    persistOrders();
    return updated;
  }

  return await getOrderByNumber(orderNumber);
}

export async function deleteOrder(orderNumber: string): Promise<boolean> {
  let deletedFromMysql = false;
  try {
    const res = await query<any>("DELETE FROM orders WHERE order_number = ?", [orderNumber]);
    if (res && res.affectedRows > 0) {
      deletedFromMysql = true;
    }
  } catch (e) {}

  ensureData();
  const idx = inMemoryOrders.findIndex((o) => o.order_number === orderNumber);
  let deletedFromJson = false;
  if (idx !== -1) {
    inMemoryOrders.splice(idx, 1);
    persistOrders();
    deletedFromJson = true;
  }

  return deletedFromMysql || deletedFromJson;
}

export async function getTemplates(): Promise<TemplateItem[]> {
  ensureData();
  return inMemoryTemplates;
}

export async function getTemplatesByPackage(slug: string): Promise<TemplateItem[]> {
  ensureData();
  return inMemoryTemplates.filter((t) => t.allowed_packages.includes(slug) || t.allowed_packages.includes("custom"));
}


