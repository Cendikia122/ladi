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
      database: process.env.DB_NAME || "u941811514_faselin",
      port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      connectTimeout: 2500, // Timeout cepat 2.5s agar tidak menggantung jika offline
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
    // Pastikan tabel blogs ada di Hostinger jika belum dibuat
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

    // Pastikan tabel events ada di Hostinger jika belum dibuat
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
  } catch (e) {
    // Abaikan jika error permisson atau tabel sudah terpasang
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
    await ensureTables(db);
    const [rows] = await db.query(sql, params);
    return rows as T;
  } catch (error: any) {
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
