import mysql from "mysql2/promise";

let pool: mysql.Pool | null = null;
let offlineUntil = 0;

export function markDbOffline(durationMs = 60000) {
  offlineUntil = Date.now() + durationMs;
}

export function isDbCircuitOpen(): boolean {
  return Date.now() < offlineUntil;
}

export function resetDbCircuit() {
  offlineUntil = 0;
}

export function getPool(): mysql.Pool {
  if (!pool) {
    const isSsl = process.env.DB_SSL === "true";
    pool = mysql.createPool({
      host: process.env.DB_HOST || "srv1762.hstgr.io",
      user: process.env.DB_USER || "u941811514_admin",
      password: process.env.DB_PASSWORD || "",
      database: process.env.DB_NAME || "u941811514_ladi",
      port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      connectTimeout: 8000, // Timeout 8 detik agar stabil untuk koneksi cloud-to-Hostinger
      enableKeepAlive: true,
      keepAliveInitialDelay: 10000,
      ssl: isSsl ? { rejectUnauthorized: false } : undefined,
    });
  }
  return pool;
}

let tablesChecked = false;
async function ensureTables(db: mysql.Pool) {
  if (tablesChecked) return;
  tablesChecked = true;
  try {
    // 1. Pastikan tabel blogs ada di Hostinger jika belum dibuat
    await db.query(`
      CREATE TABLE IF NOT EXISTS blogs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(500) NOT NULL,
        slug VARCHAR(500),
        author VARCHAR(255) DEFAULT 'Tim Ladi',
        date VARCHAR(100),
        category VARCHAR(100) DEFAULT 'PANDUAN USAHA',
        thumb MEDIUMTEXT,
        thumb_full MEDIUMTEXT,
        excerpt TEXT,
        content LONGTEXT,
        tags VARCHAR(500),
        status VARCHAR(50) DEFAULT 'published',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // 2. Pastikan tabel events ada di Hostinger jika belum dibuat
    await db.query(`
      CREATE TABLE IF NOT EXISTS events (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(500) NOT NULL,
        tag VARCHAR(255),
        thumb MEDIUMTEXT,
        date VARCHAR(100),
        location VARCHAR(255),
        short_desc TEXT,
        description LONGTEXT,
        btn_text VARCHAR(100) DEFAULT 'Daftar Sekarang',
        btn_link TEXT,
        status VARCHAR(50) DEFAULT 'active',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // 3. Pastikan tabel projects (portfolio) ada di Hostinger jika belum dibuat
    await db.query(`
      CREATE TABLE IF NOT EXISTS projects (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(500) NOT NULL,
        slug VARCHAR(500),
        client_name VARCHAR(255),
        client_industry VARCHAR(255),
        client_location VARCHAR(255),
        website_url TEXT,
        thumb MEDIUMTEXT,
        summary TEXT,
        challenge LONGTEXT,
        solution LONGTEXT,
        results TEXT,
        year VARCHAR(50) DEFAULT '2026',
        status VARCHAR(50) DEFAULT 'published',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // 4. Pastikan tabel team_members ada di Hostinger jika belum dibuat
    await db.query(`
      CREATE TABLE IF NOT EXISTS team_members (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        role VARCHAR(255) NOT NULL,
        badge VARCHAR(100) DEFAULT 'Tim Ladi',
        image MEDIUMTEXT,
        \`desc\` TEXT,
        focus VARCHAR(255) DEFAULT '',
        order_num INT DEFAULT 0,
        status VARCHAR(50) DEFAULT 'active',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // 5. Pastikan tabel system_settings ada untuk mencatat inisialisasi awal
    await db.query(`
      CREATE TABLE IF NOT EXISTS system_settings (
        \`key\` VARCHAR(50) PRIMARY KEY,
        \`value\` VARCHAR(255)
      )
    `);

    // 6. Pastikan tabel login_lockouts ada untuk proteksi brute force login
    await db.query(`
      CREATE TABLE IF NOT EXISTS login_lockouts (
        username VARCHAR(100) PRIMARY KEY,
        failed_attempts INT DEFAULT 0,
        locked_until BIGINT DEFAULT 0,
        last_attempt BIGINT DEFAULT 0,
        ip_address VARCHAR(100) DEFAULT '',
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // 7. Pastikan tabel service_packages ada untuk produk / paket Ladi
    await db.query(`
      CREATE TABLE IF NOT EXISTS service_packages (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(500) NOT NULL,
        slug VARCHAR(500) NOT NULL UNIQUE,
        tag VARCHAR(255) DEFAULT 'PAKET LADI',
        subtitle TEXT,
        target_audience TEXT,
        price VARCHAR(100) DEFAULT '',
        original_price VARCHAR(100) DEFAULT '',
        period VARCHAR(100) DEFAULT 'Sekali Bayar',
        timeline VARCHAR(100) DEFAULT '5–7 Hari',
        deliverables LONGTEXT,
        example_websites LONGTEXT,
        audit_report_sample LONGTEXT,
        description LONGTEXT,
        faqs LONGTEXT,
        cta_text VARCHAR(255) DEFAULT 'Pesan Paket Ini via WhatsApp',
        cta_whatsapp_text TEXT,
        badge_popular TINYINT(1) DEFAULT 0,
        status VARCHAR(50) DEFAULT 'active',
        order_num INT DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Selalu sinkronkan service_packages dari services.json ke MySQL Hostinger
    try {
      const fs = await import("fs");
      const path = await import("path");
      const servicesFile = path.join(process.cwd(), "data", "services.json");
      if (fs.existsSync(servicesFile)) {
        const services = JSON.parse(fs.readFileSync(servicesFile, "utf-8"));
        for (const s of services) {
          await db.query(
            `INSERT INTO service_packages (id, name, slug, tag, subtitle, target_audience, price, original_price, period, timeline, deliverables, example_websites, audit_report_sample, description, faqs, cta_text, cta_whatsapp_text, badge_popular, status, order_num)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
             ON DUPLICATE KEY UPDATE 
               name=VALUES(name),
               slug=VALUES(slug),
               tag=VALUES(tag),
               subtitle=VALUES(subtitle),
               target_audience=VALUES(target_audience),
               price=VALUES(price),
               original_price=VALUES(original_price),
               period=VALUES(period),
               timeline=VALUES(timeline),
               deliverables=VALUES(deliverables),
               example_websites=VALUES(example_websites),
               audit_report_sample=VALUES(audit_report_sample),
               description=VALUES(description),
               faqs=VALUES(faqs),
               cta_text=VALUES(cta_text),
               cta_whatsapp_text=VALUES(cta_whatsapp_text),
               badge_popular=VALUES(badge_popular),
               status=VALUES(status),
               order_num=VALUES(order_num)`,
            [
              s.id,
              s.name,
              s.slug,
              s.tag || "PAKET LADI",
              s.subtitle || "",
              s.target_audience || "",
              s.price || "",
              s.original_price || "",
              s.period || "Sekali Bayar",
              s.timeline || "5–7 Hari",
              s.deliverables || "[]",
              s.example_websites || "[]",
              s.audit_report_sample || "{}",
              s.description || "",
              s.faqs || "[]",
              s.cta_text || "Pesan via WhatsApp",
              s.cta_whatsapp_text || "",
              s.badge_popular ? 1 : 0,
              s.status || "active",
              s.order_num || 0,
            ]
          );
        }
      }
    } catch {}

    // Periksa apakah database sudah pernah di-inisialisasi
    const [metaRows]: any = await db.query("SELECT `value` FROM system_settings WHERE `key` = 'initialized'");
    if (!metaRows || metaRows.length === 0) {
      try {
        const fs = await import("fs");
        const path = await import("path");
        const dataDir = path.join(process.cwd(), "data");

        const blogsFile = path.join(dataDir, "blogs.json");
        if (fs.existsSync(blogsFile)) {
          const blogs = JSON.parse(fs.readFileSync(blogsFile, "utf-8"));
          for (const b of blogs) {
            await db.query(
              `INSERT INTO blogs (id, title, slug, author, date, category, thumb, thumb_full, excerpt, content, tags, status)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
               ON DUPLICATE KEY UPDATE id=id`,
              [b.id, b.title, b.slug, b.author || "Tim Ladi", b.date || "", b.category || "PANDUAN USAHA", b.thumb || "", b.thumb_full || "", b.excerpt || "", b.content || "", b.tags || "", b.status || "published"]
            );
          }
        }

        const eventsFile = path.join(dataDir, "events.json");
        if (fs.existsSync(eventsFile)) {
          const events = JSON.parse(fs.readFileSync(eventsFile, "utf-8"));
          for (const e of events) {
            await db.query(
              `INSERT INTO events (id, title, tag, thumb, date, location, short_desc, description, btn_text, btn_link, status)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
               ON DUPLICATE KEY UPDATE id=id`,
              [e.id, e.title, e.tag || "Workshop", e.thumb || "", e.date || "", e.location || "", e.short_desc || "", e.description || "", e.btn_text || "Daftar", e.btn_link || "", e.status || "active"]
            );
          }
        }

        const projectsFile = path.join(dataDir, "projects.json");
        if (fs.existsSync(projectsFile)) {
          const projects = JSON.parse(fs.readFileSync(projectsFile, "utf-8"));
          for (const p of projects) {
            await db.query(
              `INSERT INTO projects (id, title, slug, client_name, client_industry, client_location, website_url, thumb, summary, challenge, solution, results, year, status)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
               ON DUPLICATE KEY UPDATE id=id`,
              [p.id, p.title, p.slug, p.client_name || "", p.client_industry || "", p.client_location || "", p.website_url || "", p.thumb || "", p.summary || "", p.challenge || "", p.solution || "", p.results || "", p.year || "2026", p.status || "published"]
            );
          }
        }

        const teamFile = path.join(dataDir, "team.json");
        if (fs.existsSync(teamFile)) {
          const team = JSON.parse(fs.readFileSync(teamFile, "utf-8"));
          for (const m of team) {
            await db.query(
              `INSERT INTO team_members (id, name, role, badge, image, \`desc\`, focus, order_num, status)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
               ON DUPLICATE KEY UPDATE id=id`,
              [m.id, m.name, m.role, m.badge || "Tim Ladi", m.image || "/images/team/team1.jpg", m.desc || "", m.focus || "", m.order_num || 0, m.status || "active"]
            );
          }
        }

        const servicesFile = path.join(dataDir, "services.json");
        if (fs.existsSync(servicesFile)) {
          const services = JSON.parse(fs.readFileSync(servicesFile, "utf-8"));
          for (const s of services) {
            await db.query(
              `INSERT INTO service_packages (id, name, slug, tag, subtitle, target_audience, price, original_price, period, timeline, deliverables, example_websites, audit_report_sample, description, faqs, cta_text, cta_whatsapp_text, badge_popular, status, order_num)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
               ON DUPLICATE KEY UPDATE id=id`,
              [s.id, s.name, s.slug, s.tag || "PAKET LADI", s.subtitle || "", s.target_audience || "", s.price || "", s.original_price || "", s.period || "Sekali Bayar", s.timeline || "5–7 Hari", s.deliverables || "[]", s.example_websites || "[]", s.audit_report_sample || "{}", s.description || "", s.faqs || "[]", s.cta_text || "Pesan via WhatsApp", s.cta_whatsapp_text || "", s.badge_popular ? 1 : 0, s.status || "active", s.order_num || 0]
            );
          }
        }

        await db.query("INSERT INTO system_settings (`key`, `value`) VALUES ('initialized', 'true')");
      } catch (seedErr) {
        // Abaikan jika seeding gagal
      }
    }
  } catch (e) {
    // Abaikan jika error permission atau tabel sudah terpasang
  }
}

export async function query<T = any>(sql: string, params: any[] = []): Promise<T> {
  // Jika circuit breaker terbuka (baru saja offline), langsung fail fast ke fallback JSON
  if (isDbCircuitOpen()) {
    throw new Error("MySQL offline (circuit breaker open)");
  }

  // Jika password belum diatur di env, langsung gunakan JSON
  if (!process.env.DB_PASSWORD && process.env.NODE_ENV !== "test") {
    throw new Error("DB_PASSWORD belum diatur di environment variable");
  }

  try {
    const db = getPool();
    const [rows] = await db.query(sql, params);
    return rows as T;
  } catch (error: any) {
    // Jika tabel belum ada (ER_NO_SUCH_TABLE atau errno 1146), inisialisasi tabel sekali dan coba lagi
    if (error?.code === "ER_NO_SUCH_TABLE" || error?.errno === 1146) {
      try {
        const db = getPool();
        await ensureTables(db);
        const [rows] = await db.query(sql, params);
        return rows as T;
      } catch (retryErr) {
        markDbOffline(60000);
        throw retryErr;
      }
    }
    // Tandai offline selama 60 detik agar request berikutnya instan dari JSON
    markDbOffline(60000);
    throw error;
  }
}

export async function checkDbConnection(): Promise<{ connected: boolean; message: string; host: string }> {
  const host = process.env.DB_HOST || "srv1762.hstgr.io";
  if (!process.env.DB_PASSWORD) {
    return {
      connected: false,
      message: "DB_PASSWORD belum diisi di environment variables Vercel/Hosting.",
      host,
    };
  }

  try {
    resetDbCircuit();
    const db = getPool();
    await db.query("SELECT 1");
    return {
      connected: true,
      message: "MySQL Hostinger Terhubung & Siap Digunakan.",
      host,
    };
  } catch (err: any) {
    markDbOffline(60000);
    return {
      connected: false,
      message: `MySQL Offline: ${err.message}. Sistem otomatis menggunakan fallback file JSON lokal.`,
      host,
    };
  }
}
