# 📖 Panduan Lengkap Deploy Website Ladi ke Hostinger MySQL + Vercel

Panduan ini disusun mengikuti arsitektur production yang telah terbukti di **Fasel Consulting**, disesuaikan khusus untuk ekosistem **Ladi (Layanan Digital)**.

---

## 🗺️ Alur Sistem di Production

```
┌────────────────────────────────────────────────────────┐
│                   KAMU (Admin Ladi)                    │
│             Login di /admin/login (1-Klik)             │
└───────────────────────────┬────────────────────────────┘
                            │ Tulis Artikel / Event
                            ▼
┌────────────────────────────────────────────────────────┐
│                   VERCEL SERVERLESS                    │
│          /api/blogs & /api/events API Routes           │
└─────────────┬────────────────────────────┬─────────────┘
              │ (Prioritas Utama)          │ (Cadangan jika offline)
              ▼                            ▼
┌──────────────────────────┐   ┌─────────────────────────┐
│   Hostinger MySQL DB     │   │     Local JSON File     │
│   srv1762.hstgr.io       │   │  data/blogs & events    │
│   u941811514_faselin     │   │     Circuit Breaker     │
└─────────────┬────────────┘   └─────────────────────────┘
              │ Data Realtime
              ▼
┌────────────────────────────────────────────────────────┐
│                   PENGUNJUNG PUBLIK                    │
│  /           → Beranda + Cuplikan Proyek & Blog        │
│  /blog       → Daftar Artikel Wawasan (SSR)            │
│  /blog/[slug]→ Detail Artikel + Schema.org + WhatsApp  │
│  /events     → Agenda Workshop & Pelatihan             │
│  /project    → Showcase Studi Kasus UMKM               │
└───────────────────────────┬────────────────────────────┘
                            │ Otomatis Crawl
                            ▼
┌────────────────────────────────────────────────────────┐
│                     GOOGLE SEARCH                      │
│     /sitemap.xml (Dinamis) + /robots.txt (SEO Ready)   │
└────────────────────────────────────────────────────────┘
```

---

## 📋 Checklist Persiapan

- [x] Kode Ladi sudah siap dan lulus build (`next build` sukses 100%)
- [x] File skema database siap: [`database.sql`](./database.sql)
- [x] Sitemap dinamis ([`/sitemap.xml`](./app/sitemap.ts)) & Robots ([`/robots.txt`](./app/robots.ts)) aktif
- [x] JSON-LD Schema.org terpasang di setiap artikel ([`/blog/[slug]`](./app/blog/[slug]/page.tsx))
- [x] Bug penyimpanan lokal JSON sudah diperbaiki
- [ ] Akun GitHub
- [ ] Akun Vercel
- [ ] Akun Hostinger (Database MySQL aktif)

---

## 🛠️ LANGKAH 1 — Setup Database di Hostinger

### 1. Buat Database MySQL (Jika Belum)
1. Buka dashboard Hostinger: [hpanel.hostinger.com](https://hpanel.hostinger.com)
2. Masuk ke menu **Databases** → **MySQL Databases**.
3. Buat database atau gunakan database yang sudah Anda miliki:
   - **MySQL Host:** `srv1762.hstgr.io`
   - **Database Name:** `u941811514_faselin`
   - **Username:** `u941811514_admin`
   - **Password:** *(Catat password database ini)*

### 2. Import Tabel Melalui phpMyAdmin
1. Di baris database Anda, klik tombol **Enter phpMyAdmin**.
2. Pilih database `u941811514_faselin` di panel sebelah kiri.
3. Klik tab menu **Import** (atau **SQL**).
4. Buka file [`database.sql`](./database.sql) yang ada di folder proyek Ladi, copy seluruh kodenya, paste ke kotak SQL di phpMyAdmin, lalu klik **Go / Kirim**.
5. Tabel `admin_users`, `blogs`, dan `events` beserta artikel contoh akan langsung terbuat!

### 3. Wajib: Buka Remote MySQL (Agar Vercel Bisa Akses)
Karena server Vercel berada di cloud global, Anda harus mengizinkan koneksi dari luar Hostinger:
1. Di hPanel Hostinger, cari menu **Remote MySQL**.
2. Di kolom **IP (IPv4 or IPv6)**, masukkan tanda persen: `%`
3. Pilih database: `u941811514_faselin`.
4. Klik **Add / Tambah**.

---

## 🚀 LANGKAH 2 — Push Kode ke GitHub

Buka Terminal di komputer Anda, lalu jalankan perintah berikut:

```bash
# 1. Pindah ke direktori proyek Ladi
cd "/Users/bob/Desktop/coding/Project/ladi"

# 2. Inisialisasi Git
git init

# 3. Tambahkan semua berkas
git add .

# 4. Buat commit pertama
git commit -m "feat: complete ladi web with mysql blog, events, and showcase"

# 5. Ubah branch utama menjadi main
git branch -M main

# 6. Hubungkan ke repository GitHub Anda (Buat repo baru di github.com/new misalnya bernama 'ladi')
git remote add origin https://github.com/USERNAME/ladi.git

# 7. Push kode ke GitHub
git push -u origin main
```

---

## ⚡ LANGKAH 3 — Deploy ke Vercel

1. Buka [vercel.com](https://vercel.com) dan login dengan akun GitHub Anda.
2. Klik tombol **"Add New..."** → pilih **"Project"**.
3. Cari repository **`ladi`**, lalu klik **Import**.
4. Di bagian **Environment Variables**, klik expand dan masukkan variabel-variabel berikut:

| Nama Variabel (Key) | Nilai (Value) | Keterangan |
|---|---|---|
| `DB_HOST` | `srv1762.hstgr.io` | Host server database Hostinger |
| `DB_USER` | `u941811514_admin` | Username MySQL Hostinger |
| `DB_PASSWORD` | `(password_database_anda)` | **Password database yang dibuat di Hostinger** |
| `DB_NAME` | `u941811514_faselin` | Nama database |
| `DB_PORT` | `3306` | Port default MySQL |
| `DB_SSL` | `false` | SSL Hostinger |
| `ADMIN_USERNAME` | `admin` | Username login admin panel |
| `ADMIN_PASSWORD` | `admin123` | Password login admin (bisa diganti sesuai selera) |
| `AUTH_SECRET` | `ladi_secret_super_aman_2026` | Kunci enkripsi token sesi |
| `NEXT_PUBLIC_SITE_URL` | `https://ladi.id` | Domain publik Anda (atau URL default Vercel) |

5. Klik tombol biru **"Deploy"**.
6. Tunggu 1–2 menit hingga proses build selesai. Website Anda kini resmi **LIVE di Internet Global!** 🎉

---

## 🔍 LANGKAH 4 — Verifikasi & Pengujian CRUD Setelah Live

Buka link website yang diberikan oleh Vercel:

1. **Cek Beranda & Listing:**
   - Kunjungi `https://domain-anda.vercel.app/`
   - Kunjungi `https://domain-anda.vercel.app/blog`
   - Kunjungi `https://domain-anda.vercel.app/events`
   - Kunjungi `https://domain-anda.vercel.app/project`

2. **Cek Koneksi Database:**
   - Kunjungi `https://domain-anda.vercel.app/admin`
   - Klik tombol **"⚡ Masuk Cepat (Akun Administrator Default)"**
   - Perhatikan bar status di atas:
     - Jika berwarna **HIJAU** ("Database MySQL Hostinger Aktif") → **Berhasil 100%!** Data tersimpan langsung di server Hostinger.

3. **Uji Tambah Artikel:**
   - Klik **"+ Tulis Artikel"**
   - Masukkan Judul & Isi artikel, lalu klik **"Publikasikan Artikel"**
   - Artikel akan langsung muncul seketika di `https://domain-anda.vercel.app/blog` tanpa perlu re-deploy!

4. **Cek SEO & Google Bot:**
   - Buka `https://domain-anda.vercel.app/sitemap.xml` → Artikel yang baru dibuat akan otomatis terdaftar di sitemap untuk di-crawl Google.
   - Buka `https://domain-anda.vercel.app/robots.txt` → Aturan crawl mesin pencari aktif.
