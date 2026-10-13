import { getPool, isDbCircuitOpen } from "./mysql";
import fs from "fs";
import path from "path";

export interface LockoutRecord {
  username: string;
  failed_attempts: number;
  locked_until: number;
  last_attempt: number;
  ip_address?: string;
}

export interface LockoutStatus {
  isLocked: boolean;
  failedAttempts: number;
  remainingAttempts: number;
  lockedUntil: number;
  remainingHours: number;
  remainingDays: number;
}

const MAX_FAILED_ATTEMPTS = 3;
const LOCKOUT_DURATION_MS = 3 * 24 * 60 * 60 * 1000; // 3 hari (72 jam)
const FALLBACK_FILE = path.join("/tmp", "ladi_lockouts.json");

// In-memory cache for fast lookups & serverless instances
const memoryCache = new Map<string, LockoutRecord>();

function readFallbackFile(): Record<string, LockoutRecord> {
  try {
    if (fs.existsSync(FALLBACK_FILE)) {
      return JSON.parse(fs.readFileSync(FALLBACK_FILE, "utf-8"));
    }
  } catch {
    // Ignore error
  }
  return {};
}

function writeFallbackFile(data: Record<string, LockoutRecord>) {
  try {
    fs.writeFileSync(FALLBACK_FILE, JSON.stringify(data), "utf-8");
  } catch {
    // Ignore error in read-only environments
  }
}

let lockoutTableEnsured = false;
async function ensureLockoutTable(db: any) {
  if (lockoutTableEnsured) return;
  lockoutTableEnsured = true;
  try {
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
  } catch {
    // Abaikan jika tabel sudah ada atau error
  }
}

async function getRecord(username: string): Promise<LockoutRecord> {
  const clean = username.trim().toLowerCase();

  // 1. Coba dari MySQL jika database aktif
  if (!isDbCircuitOpen()) {
    try {
      const db = getPool();
      await ensureLockoutTable(db);
      const [rows]: any = await db.query(
        "SELECT username, failed_attempts, locked_until, last_attempt, ip_address FROM login_lockouts WHERE username = ?",
        [clean]
      );
      if (rows && rows.length > 0) {
        const r = rows[0];
        const record: LockoutRecord = {
          username: clean,
          failed_attempts: Number(r.failed_attempts || 0),
          locked_until: Number(r.locked_until || 0),
          last_attempt: Number(r.last_attempt || 0),
          ip_address: r.ip_address || "",
        };
        memoryCache.set(clean, record);
        return record;
      }
    } catch {
      // Fallback ke memori/file
    }
  }

  // 2. Coba dari memory cache
  if (memoryCache.has(clean)) {
    return memoryCache.get(clean)!;
  }

  // 3. Coba dari fallback file
  const fallback = readFallbackFile();
  if (fallback[clean]) {
    memoryCache.set(clean, fallback[clean]);
    return fallback[clean];
  }

  return {
    username: clean,
    failed_attempts: 0,
    locked_until: 0,
    last_attempt: 0,
  };
}

async function saveRecord(record: LockoutRecord): Promise<void> {
  const clean = record.username.trim().toLowerCase();
  memoryCache.set(clean, record);

  const fallback = readFallbackFile();
  fallback[clean] = record;
  writeFallbackFile(fallback);

  if (!isDbCircuitOpen()) {
    try {
      const db = getPool();
      await ensureLockoutTable(db);
      await db.query(
        `INSERT INTO login_lockouts (username, failed_attempts, locked_until, last_attempt, ip_address)
         VALUES (?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE
           failed_attempts = VALUES(failed_attempts),
           locked_until = VALUES(locked_until),
           last_attempt = VALUES(last_attempt),
           ip_address = VALUES(ip_address)`,
        [clean, record.failed_attempts, record.locked_until, record.last_attempt, record.ip_address || ""]
      );
    } catch {
      // Abaikan error jaringan MySQL
    }
  }
}

/**
 * Cek status blokir akun
 */
export async function checkLockout(username: string): Promise<LockoutStatus> {
  const clean = username.trim().toLowerCase();
  const record = await getRecord(clean);
  const now = Date.now();

  // Jika waktu blokir sudah lewat 3 hari, otomatis buka blokir
  if (record.locked_until > 0 && now >= record.locked_until) {
    record.failed_attempts = 0;
    record.locked_until = 0;
    await saveRecord(record);
    return {
      isLocked: false,
      failedAttempts: 0,
      remainingAttempts: MAX_FAILED_ATTEMPTS,
      lockedUntil: 0,
      remainingHours: 0,
      remainingDays: 0,
    };
  }

  const isLocked = record.locked_until > now;
  const remainingMs = Math.max(0, record.locked_until - now);
  const remainingHours = Math.ceil(remainingMs / (1000 * 60 * 60));
  const remainingDays = Math.ceil(remainingHours / 24);
  const remainingAttempts = Math.max(0, MAX_FAILED_ATTEMPTS - record.failed_attempts);

  return {
    isLocked,
    failedAttempts: record.failed_attempts,
    remainingAttempts: isLocked ? 0 : remainingAttempts,
    lockedUntil: record.locked_until,
    remainingHours,
    remainingDays,
  };
}

/**
 * Catat percobaan login yang gagal
 */
export async function recordFailedAttempt(username: string, ip = ""): Promise<LockoutStatus> {
  const clean = username.trim().toLowerCase();
  const record = await getRecord(clean);
  const now = Date.now();

  record.failed_attempts = (record.failed_attempts || 0) + 1;
  record.last_attempt = now;
  if (ip) record.ip_address = ip;

  // Jika mencapai batas 3 kali gagal, blokir selama 3 hari
  if (record.failed_attempts >= MAX_FAILED_ATTEMPTS) {
    record.locked_until = now + LOCKOUT_DURATION_MS;
  }

  await saveRecord(record);
  return checkLockout(clean);
}

/**
 * Reset / buka blokir akun (dipanggil saat login sukses atau direset Super Admin)
 */
export async function clearLockout(username: string): Promise<void> {
  const clean = username.trim().toLowerCase();
  const record: LockoutRecord = {
    username: clean,
    failed_attempts: 0,
    locked_until: 0,
    last_attempt: Date.now(),
  };
  await saveRecord(record);
}

/**
 * Ambil semua akun yang tercatat untuk dashboard Super Admin
 */
export async function getAllLockouts(): Promise<
  Array<{
    username: string;
    failed_attempts: number;
    isLocked: boolean;
    locked_until: number;
    remainingHours: number;
    last_attempt: number;
  }>
> {
  const now = Date.now();
  const results: Array<{
    username: string;
    failed_attempts: number;
    isLocked: boolean;
    locked_until: number;
    remainingHours: number;
    last_attempt: number;
  }> = [];

  if (!isDbCircuitOpen()) {
    try {
      const db = getPool();
      await ensureLockoutTable(db);
      const [rows]: any = await db.query(
        "SELECT username, failed_attempts, locked_until, last_attempt FROM login_lockouts ORDER BY last_attempt DESC"
      );
      if (rows && rows.length > 0) {
        for (const r of rows) {
          const lockedUntil = Number(r.locked_until || 0);
          const isLocked = lockedUntil > now;
          const remainingMs = Math.max(0, lockedUntil - now);
          results.push({
            username: r.username,
            failed_attempts: Number(r.failed_attempts || 0),
            isLocked,
            locked_until: lockedUntil,
            remainingHours: Math.ceil(remainingMs / (1000 * 60 * 60)),
            last_attempt: Number(r.last_attempt || 0),
          });
        }
        return results;
      }
    } catch {
      // Fallback ke memory cache
    }
  }

  // Fallback membaca memory / file
  const fileData = readFallbackFile();
  const allKeys = new Set([...memoryCache.keys(), ...Object.keys(fileData)]);

  for (const key of allKeys) {
    const item = memoryCache.get(key) || fileData[key];
    if (item && item.failed_attempts > 0) {
      const isLocked = item.locked_until > now;
      const remainingMs = Math.max(0, item.locked_until - now);
      results.push({
        username: item.username,
        failed_attempts: item.failed_attempts,
        isLocked,
        locked_until: item.locked_until,
        remainingHours: Math.ceil(remainingMs / (1000 * 60 * 60)),
        last_attempt: item.last_attempt,
      });
    }
  }

  return results;
}
