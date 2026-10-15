import fs from "fs";
import path from "path";
import crypto from "crypto";
import { getPool, isDbCircuitOpen, markDbOffline } from "./mysql";

export type AdminRole = "superadmin" | "admin" | "editor";

export interface AdminUser {
  id: number;
  username: string;
  password_hash: string;
  name: string;
  role: AdminRole;
  status: "active" | "inactive";
  created_at: string;
  updated_at?: string;
}

export type SafeAdminUser = Omit<AdminUser, "password_hash">;

const DATA_DIR = path.join(process.cwd(), "data");
const USERS_FILE = path.join(DATA_DIR, "users.json");

// In-memory fallback cache
let inMemoryUsers: AdminUser[] = [];
let usersInitialized = false;

function canUseMysql(): boolean {
  return !isDbCircuitOpen() && Boolean(process.env.DB_PASSWORD);
}

/**
 * Hash password menggunakan scrypt dengan random 16-byte salt
 */
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

/**
 * Verifikasi password terhadap stored hash (mendukung format salt:hash dan plain text fallback)
 */
export function verifyPassword(password: string, storedHash: string): boolean {
  if (!storedHash || !password) return false;
  try {
    if (storedHash.includes(":")) {
      const [salt, hash] = storedHash.split(":");
      if (!salt || !hash) return false;
      const computedHash = crypto.scryptSync(password, salt, 64).toString("hex");
      const hashBuf = Buffer.from(hash, "hex");
      const compBuf = Buffer.from(computedHash, "hex");
      if (hashBuf.length !== compBuf.length) return false;
      return crypto.timingSafeEqual(hashBuf, compBuf);
    }
    // Fallback jika plain text (misal saat inisialisasi dev)
    return password === storedHash;
  } catch {
    return false;
  }
}

/**
 * Validasi format username
 */
export function isValidUsername(username: string): boolean {
  return /^[a-zA-Z0-9_.-]{3,30}$/.test(username.trim());
}

/**
 * Format user untuk response aman (tanpa password_hash)
 */
export function toSafeUser(user: AdminUser): SafeAdminUser {
  const { password_hash, ...safe } = user;
  return safe;
}

/**
 * Pastikan data users.json ada dan termuat di memori
 */
function ensureLocalUsers(): AdminUser[] {
  if (usersInitialized && inMemoryUsers.length > 0) {
    return inMemoryUsers;
  }

  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    if (fs.existsSync(USERS_FILE)) {
      const content = fs.readFileSync(USERS_FILE, "utf-8");
      inMemoryUsers = JSON.parse(content);
      usersInitialized = true;
      return inMemoryUsers;
    }
  } catch (err) {
    console.warn("Notice: Gagal membaca data/users.json, membuat inisialisasi default:", err);
  }

  // Jika belum ada file, seed akun default
  const defaultAdmin = process.env.ADMIN_USERNAME || "admin";
  const defaultAdminPass = process.env.ADMIN_PASSWORD || "admin123";
  const defaultWriter = process.env.WRITER_USERNAME || "penulis";
  const defaultWriterPass = process.env.WRITER_PASSWORD || "penulis123";

  inMemoryUsers = [
    {
      id: 1,
      username: defaultAdmin,
      password_hash: hashPassword(defaultAdminPass),
      name: "Super Administrator",
      role: "superadmin",
      status: "active",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 2,
      username: defaultWriter,
      password_hash: hashPassword(defaultWriterPass),
      name: "Penulis Konten (Blog)",
      role: "editor",
      status: "active",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ];

  persistLocalUsers(inMemoryUsers);
  usersInitialized = true;
  return inMemoryUsers;
}

/**
 * Simpan data users ke file lokal users.json
 */
function persistLocalUsers(users: AdminUser[]) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), "utf-8");
  } catch (err) {
    console.warn("Notice: Gagal menyimpan data/users.json:", err);
  }
}

let adminTableEnsured = false;
export async function ensureAdminUsersTable(db: any) {
  if (adminTableEnsured) return;
  adminTableEnsured = true;
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS admin_users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(100) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'admin',
        status VARCHAR(50) DEFAULT 'active',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Pastikan kolom role, status, password_hash ada jika database sudah memiliki tabel versi lama
    try {
      await db.query("ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS role VARCHAR(50) DEFAULT 'admin'");
      await db.query("ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'active'");
      await db.query("ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS password_hash VARCHAR(255) NULL");
      await db.query("ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP");
    } catch {}

    // Periksa apakah tabel kosong; jika kosong, masukkan user awal dari data lokal
    const [rows]: any = await db.query("SELECT COUNT(*) as count FROM admin_users");
    if (rows && rows[0]?.count === 0) {
      const localUsers = ensureLocalUsers();
      for (const u of localUsers) {
        await db.query(
          `INSERT INTO admin_users (id, username, password_hash, name, role, status)
           VALUES (?, ?, ?, ?, ?, ?)
           ON DUPLICATE KEY UPDATE id=id`,
          [u.id, u.username, u.password_hash, u.name, u.role, u.status]
        );
      }
    }
  } catch {
    // Abaikan jika error jaringan atau permission
  }
}

/**
 * Ambil semua user admin
 */
export async function getAdminUsers(includePassword = false): Promise<AdminUser[] | SafeAdminUser[]> {
  if (canUseMysql()) {
    try {
      const db = getPool();
      await ensureAdminUsersTable(db);
      const [rows]: any = await db.query(
        "SELECT id, username, password_hash, name, role, status, created_at, updated_at FROM admin_users ORDER BY id ASC"
      );
      if (Array.isArray(rows) && rows.length > 0) {
        const users: AdminUser[] = rows.map((r: any) => ({
          id: Number(r.id),
          username: String(r.username),
          password_hash: String(r.password_hash || ""),
          name: String(r.name || ""),
          role: (r.role as AdminRole) || "admin",
          status: (r.status as "active" | "inactive") || "active",
          created_at: r.created_at ? new Date(r.created_at).toISOString() : new Date().toISOString(),
          updated_at: r.updated_at ? new Date(r.updated_at).toISOString() : undefined,
        }));

        // Sinkronkan ke cache memori & file fallback
        inMemoryUsers = users;
        persistLocalUsers(users);

        return includePassword ? users : users.map(toSafeUser);
      }
    } catch {
      markDbOffline(60000);
    }
  }

  const local = ensureLocalUsers();
  return includePassword ? local : local.map(toSafeUser);
}

/**
 * Cari admin berdasarkan Username
 */
export async function getAdminUserByUsername(
  username: string,
  includePassword = false
): Promise<AdminUser | SafeAdminUser | null> {
  const clean = username.trim().toLowerCase();

  if (canUseMysql()) {
    try {
      const db = getPool();
      await ensureAdminUsersTable(db);
      const [rows]: any = await db.query(
        "SELECT id, username, password_hash, name, role, status, created_at, updated_at FROM admin_users WHERE LOWER(username) = ? LIMIT 1",
        [clean]
      );
      if (Array.isArray(rows) && rows.length > 0) {
        const r = rows[0];
        const user: AdminUser = {
          id: Number(r.id),
          username: String(r.username),
          password_hash: String(r.password_hash || ""),
          name: String(r.name || ""),
          role: (r.role as AdminRole) || "admin",
          status: (r.status as "active" | "inactive") || "active",
          created_at: r.created_at ? new Date(r.created_at).toISOString() : new Date().toISOString(),
          updated_at: r.updated_at ? new Date(r.updated_at).toISOString() : undefined,
        };
        return includePassword ? user : toSafeUser(user);
      }
    } catch {
      markDbOffline(60000);
    }
  }

  const local = ensureLocalUsers();
  const found = local.find((u) => u.username.toLowerCase() === clean);
  if (!found) return null;
  return includePassword ? found : toSafeUser(found);
}

/**
 * Cari admin berdasarkan ID
 */
export async function getAdminUserById(
  id: number,
  includePassword = false
): Promise<AdminUser | SafeAdminUser | null> {
  if (canUseMysql()) {
    try {
      const db = getPool();
      await ensureAdminUsersTable(db);
      const [rows]: any = await db.query(
        "SELECT id, username, password_hash, name, role, status, created_at, updated_at FROM admin_users WHERE id = ? LIMIT 1",
        [id]
      );
      if (Array.isArray(rows) && rows.length > 0) {
        const r = rows[0];
        const user: AdminUser = {
          id: Number(r.id),
          username: String(r.username),
          password_hash: String(r.password_hash || ""),
          name: String(r.name || ""),
          role: (r.role as AdminRole) || "admin",
          status: (r.status as "active" | "inactive") || "active",
          created_at: r.created_at ? new Date(r.created_at).toISOString() : new Date().toISOString(),
          updated_at: r.updated_at ? new Date(r.updated_at).toISOString() : undefined,
        };
        return includePassword ? user : toSafeUser(user);
      }
    } catch {
      markDbOffline(60000);
    }
  }

  const local = ensureLocalUsers();
  const found = local.find((u) => u.id === id);
  if (!found) return null;
  return includePassword ? found : toSafeUser(found);
}

/**
 * Buat akun admin baru
 */
export async function createAdminUser(data: {
  username: string;
  password: string;
  name: string;
  role: AdminRole;
  status?: "active" | "inactive";
}): Promise<SafeAdminUser> {
  const cleanUsername = data.username.trim();
  if (!isValidUsername(cleanUsername)) {
    throw new Error(
      "Username tidak valid! Hanya boleh huruf, angka, underscore (_), titik (.), atau strip (-), panjang 3–30 karakter."
    );
  }

  if (!data.password || data.password.trim().length < 6) {
    throw new Error("Password minimal 6 karakter!");
  }

  if (!data.name || !data.name.trim()) {
    throw new Error("Nama lengkap admin wajib diisi!");
  }

  // Cek apakah username sudah ada
  const existing = await getAdminUserByUsername(cleanUsername);
  if (existing) {
    throw new Error(`Username "${cleanUsername}" sudah digunakan oleh akun lain!`);
  }

  const hashedPassword = hashPassword(data.password.trim());
  const nowIso = new Date().toISOString();
  const role: AdminRole = data.role || "admin";
  const status = data.status || "active";

  const local = ensureLocalUsers();
  const nextLocalId = local.length > 0 ? Math.max(...local.map((u) => u.id)) + 1 : 1;
  let newId = nextLocalId;

  if (canUseMysql()) {
    try {
      const db = getPool();
      await ensureAdminUsersTable(db);
      const [result]: any = await db.query(
        `INSERT INTO admin_users (username, password_hash, name, role, status)
         VALUES (?, ?, ?, ?, ?)`,
        [cleanUsername, hashedPassword, data.name.trim(), role, status]
      );
      if (result && result.insertId) {
        newId = Number(result.insertId);
      }
    } catch (dbErr: any) {
      if (dbErr.code === "ER_DUP_ENTRY") {
        throw new Error(`Username "${cleanUsername}" sudah digunakan!`);
      }
      markDbOffline(60000);
    }
  }

  const newUser: AdminUser = {
    id: newId,
    username: cleanUsername,
    password_hash: hashedPassword,
    name: data.name.trim(),
    role,
    status,
    created_at: nowIso,
    updated_at: nowIso,
  };

  // Update memori & fallback file
  local.push(newUser);
  persistLocalUsers(local);

  return toSafeUser(newUser);
}

/**
 * Edit akun admin: bisa ganti username, nama, role, status, dan password
 */
export async function updateAdminUser(
  id: number,
  data: {
    username?: string;
    name?: string;
    role?: AdminRole;
    status?: "active" | "inactive";
    password?: string;
  }
): Promise<SafeAdminUser> {
  const existing = (await getAdminUserById(id, true)) as AdminUser | null;
  if (!existing) {
    throw new Error("Akun admin tidak ditemukan!");
  }

  let newUsername = existing.username;
  if (data.username && data.username.trim() !== existing.username) {
    const cleanUser = data.username.trim();
    if (!isValidUsername(cleanUser)) {
      throw new Error(
        "Username tidak valid! Hanya boleh huruf, angka, underscore (_), titik (.), atau strip (-), panjang 3–30 karakter."
      );
    }

    // Cek apakah username baru sudah dipakai akun lain
    const conflict = await getAdminUserByUsername(cleanUser);
    if (conflict && conflict.id !== id) {
      throw new Error(`Username "${cleanUser}" sudah digunakan oleh akun lain!`);
    }
    newUsername = cleanUser;
  }

  let newName = existing.name;
  if (data.name && data.name.trim()) {
    newName = data.name.trim();
  }

  let newRole = existing.role;
  if (data.role) {
    newRole = data.role;
  }

  let newStatus = existing.status;
  if (data.status) {
    newStatus = data.status;
  }

  let newPasswordHash = existing.password_hash;
  if (data.password && data.password.trim()) {
    if (data.password.trim().length < 6) {
      throw new Error("Password minimal 6 karakter!");
    }
    newPasswordHash = hashPassword(data.password.trim());
  }

  const nowIso = new Date().toISOString();

  if (canUseMysql()) {
    try {
      const db = getPool();
      await ensureAdminUsersTable(db);
      await db.query(
        `UPDATE admin_users 
         SET username = ?, password_hash = ?, name = ?, role = ?, status = ?, updated_at = NOW()
         WHERE id = ?`,
        [newUsername, newPasswordHash, newName, newRole, newStatus, id]
      );
    } catch (dbErr: any) {
      if (dbErr.code === "ER_DUP_ENTRY") {
        throw new Error(`Username "${newUsername}" sudah digunakan oleh akun lain!`);
      }
      markDbOffline(60000);
    }
  }

  // Update local memory & file
  const local = ensureLocalUsers();
  const index = local.findIndex((u) => u.id === id);
  const updatedUser: AdminUser = {
    ...existing,
    username: newUsername,
    password_hash: newPasswordHash,
    name: newName,
    role: newRole,
    status: newStatus,
    updated_at: nowIso,
  };

  if (index !== -1) {
    local[index] = updatedUser;
  } else {
    local.push(updatedUser);
  }
  persistLocalUsers(local);

  return toSafeUser(updatedUser);
}

/**
 * Reset / override password akun admin langsung oleh Super Admin
 */
export async function resetAdminPassword(id: number, newPass: string): Promise<boolean> {
  if (!newPass || newPass.trim().length < 6) {
    throw new Error("Password baru minimal 6 karakter!");
  }

  await updateAdminUser(id, { password: newPass.trim() });
  return true;
}

/**
 * Hapus akun admin
 */
export async function deleteAdminUser(id: number, currentUsername: string): Promise<boolean> {
  const existing = (await getAdminUserById(id, false)) as SafeAdminUser | null;
  if (!existing) {
    throw new Error("Akun admin tidak ditemukan!");
  }

  // Larangan menghapus akun sendiri
  if (existing.username.toLowerCase() === currentUsername.trim().toLowerCase()) {
    throw new Error("Anda tidak dapat menghapus akun Anda sendiri yang sedang aktif digunakan!");
  }

  // Larangan menghapus jika ini adalah satu-satunya Super Admin
  if (existing.role === "superadmin") {
    const allUsers = (await getAdminUsers(false)) as SafeAdminUser[];
    const superAdmins = allUsers.filter((u) => u.role === "superadmin" && u.status === "active");
    if (superAdmins.length <= 1) {
      throw new Error(
        "Tidak dapat menghapus satu-satunya Super Administrator! Minimal harus ada 1 Super Admin yang aktif."
      );
    }
  }

  if (canUseMysql()) {
    try {
      const db = getPool();
      await ensureAdminUsersTable(db);
      await db.query("DELETE FROM admin_users WHERE id = ?", [id]);
    } catch {
      markDbOffline(60000);
    }
  }

  const local = ensureLocalUsers();
  inMemoryUsers = local.filter((u) => u.id !== id);
  persistLocalUsers(inMemoryUsers);

  return true;
}
