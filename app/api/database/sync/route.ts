import { NextRequest, NextResponse } from "next/server";
import mysql from "mysql2/promise";
import fs from "fs";
import path from "path";
import { verifyAdmin } from "@/app/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const admin = verifyAdmin(request);
  if (!admin) {
    return NextResponse.json({ success: false, message: "Akses ditolak" }, { status: 401 });
  }

  try {
    const host = process.env.DB_HOST || "srv1762.hstgr.io";
    const user = process.env.DB_USER || "u941811514_admin";
    const password = process.env.DB_PASSWORD || "";
    const database = process.env.DB_NAME || "u941811514_faselin";
    const port = process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306;
    const ssl = process.env.DB_SSL === "true";

    if (!password) {
      return NextResponse.json({
        success: false,
        message: "DB_PASSWORD belum diisi. Masukkan password database terlebih dahulu.",
      }, { status: 400 });
    }

    const conn = await mysql.createConnection({
      host,
      user,
      password,
      database,
      port,
      connectTimeout: 7000,
      ssl: ssl ? { rejectUnauthorized: false } : undefined,
    });

    // 1. Buat Tabel
    await conn.query(`
      CREATE TABLE IF NOT EXISTS blogs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(500) NOT NULL,
        slug VARCHAR(500) NOT NULL UNIQUE,
        author VARCHAR(255) DEFAULT 'Tim Ladi',
        date VARCHAR(100) DEFAULT '',
        category VARCHAR(100) DEFAULT 'PANDUAN USAHA',
        thumb MEDIUMTEXT,
        thumb_full MEDIUMTEXT,
        excerpt TEXT,
        content LONGTEXT,
        tags VARCHAR(500) DEFAULT 'Digitalisasi, UMKM',
        status VARCHAR(50) DEFAULT 'published',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    await conn.query(`
      CREATE TABLE IF NOT EXISTS events (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(500) NOT NULL,
        tag VARCHAR(255) DEFAULT 'Workshop Praktis',
        thumb MEDIUMTEXT,
        date VARCHAR(100) DEFAULT '',
        location VARCHAR(255) DEFAULT 'Bogor & Live Zoom',
        short_desc TEXT,
        description LONGTEXT,
        btn_text VARCHAR(100) DEFAULT 'Daftar Sekarang',
        btn_link TEXT,
        status VARCHAR(50) DEFAULT 'active',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    await conn.query(`
      CREATE TABLE IF NOT EXISTS projects (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(500) NOT NULL,
        slug VARCHAR(500) NOT NULL,
        client_name VARCHAR(255) DEFAULT '',
        client_industry VARCHAR(255) DEFAULT '',
        client_location VARCHAR(255) DEFAULT '',
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
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // 2. Baca data dari file JSON lokal
    const dataDir = path.join(process.cwd(), "data");
    const blogsFile = path.join(dataDir, "blogs.json");
    const eventsFile = path.join(dataDir, "events.json");
    const projectsFile = path.join(dataDir, "projects.json");

    let syncedBlogs = 0;
    if (fs.existsSync(blogsFile)) {
      const blogs = JSON.parse(fs.readFileSync(blogsFile, "utf-8"));
      for (const b of blogs) {
        await conn.query(
          `INSERT INTO blogs (id, title, slug, author, date, category, thumb, thumb_full, excerpt, content, tags, status)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
           ON DUPLICATE KEY UPDATE 
            title = VALUES(title),
            author = VALUES(author),
            date = VALUES(date),
            category = VALUES(category),
            thumb = VALUES(thumb),
            thumb_full = VALUES(thumb_full),
            excerpt = VALUES(excerpt),
            content = VALUES(content),
            tags = VALUES(tags),
            status = VALUES(status)`,
          [b.id, b.title, b.slug, b.author || "Tim Ladi", b.date || "", b.category || "PANDUAN USAHA", b.thumb || "", b.thumb_full || "", b.excerpt || "", b.content || "", b.tags || "", b.status || "published"]
        );
        syncedBlogs++;
      }
    }

    let syncedEvents = 0;
    if (fs.existsSync(eventsFile)) {
      const events = JSON.parse(fs.readFileSync(eventsFile, "utf-8"));
      for (const e of events) {
        await conn.query(
          `INSERT INTO events (id, title, tag, thumb, date, location, short_desc, description, btn_text, btn_link, status)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
           ON DUPLICATE KEY UPDATE
            title = VALUES(title),
            tag = VALUES(tag),
            thumb = VALUES(thumb),
            date = VALUES(date),
            location = VALUES(location),
            short_desc = VALUES(short_desc),
            description = VALUES(description),
            btn_text = VALUES(btn_text),
            btn_link = VALUES(btn_link),
            status = VALUES(status)`,
          [e.id, e.title, e.tag || "Workshop", e.thumb || "", e.date || "", e.location || "", e.short_desc || "", e.description || "", e.btn_text || "Daftar", e.btn_link || "", e.status || "active"]
        );
        syncedEvents++;
      }
    }

    let syncedProjects = 0;
    if (fs.existsSync(projectsFile)) {
      const projects = JSON.parse(fs.readFileSync(projectsFile, "utf-8"));
      for (const p of projects) {
        await conn.query(
          `INSERT INTO projects (id, title, slug, client_name, client_industry, client_location, website_url, thumb, summary, challenge, solution, results, year, status)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
           ON DUPLICATE KEY UPDATE
            title = VALUES(title),
            slug = VALUES(slug),
            client_name = VALUES(client_name),
            client_industry = VALUES(client_industry),
            client_location = VALUES(client_location),
            website_url = VALUES(website_url),
            thumb = VALUES(thumb),
            summary = VALUES(summary),
            challenge = VALUES(challenge),
            solution = VALUES(solution),
            results = VALUES(results),
            year = VALUES(year),
            status = VALUES(status)`,
          [p.id, p.title, p.slug, p.client_name || "", p.client_industry || "", p.client_location || "", p.website_url || "", p.thumb || "", p.summary || "", p.challenge || "", p.solution || "", p.results || "", p.year || "2026", p.status || "published"]
        );
        syncedProjects++;
      }
    }

    await conn.end();

    return NextResponse.json({
      success: true,
      message: "Seluruh data berhasil disinkronkan ke MySQL Hostinger!",
      synced: {
        blogs: syncedBlogs,
        events: syncedEvents,
        projects: syncedProjects,
      },
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      message: `Gagal sinkronisasi: ${error.message}`,
    }, { status: 500 });
  }
}
