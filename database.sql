-- =====================================================
-- DATABASE SCHEMA FOR LADI (LAYANAN DIGITAL)
-- Hostinger MySQL Database: u941811514_faselin
-- Host: srv1762.hstgr.io
-- =====================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- -----------------------------------------------------
-- Table: admin_users
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `admin_users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `username` VARCHAR(50) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `name` VARCHAR(100) DEFAULT 'Admin Ladi',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `admin_users` (`username`, `password`, `name`) 
VALUES ('admin', 'admin123', 'Administrator Ladi')
ON DUPLICATE KEY UPDATE `username`=VALUES(`username`);

-- -----------------------------------------------------
-- Table: blogs
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `blogs` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(500) NOT NULL,
  `slug` VARCHAR(500) NOT NULL UNIQUE,
  `author` VARCHAR(255) DEFAULT 'Tim Ladi',
  `date` VARCHAR(100) DEFAULT '',
  `category` VARCHAR(100) DEFAULT 'PANDUAN USAHA',
  `thumb` MEDIUMTEXT,
  `thumb_full` MEDIUMTEXT,
  `excerpt` TEXT,
  `content` LONGTEXT,
  `tags` VARCHAR(500) DEFAULT 'Digitalisasi, UMKM, Google Maps',
  `status` ENUM('published', 'draft') DEFAULT 'published',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------
-- Seed Blogs (SEO Topic Clusters)
-- -----------------------------------------------------
INSERT INTO `blogs` (`title`, `slug`, `author`, `date`, `category`, `excerpt`, `content`, `tags`, `status`)
VALUES 
(
  'Panduan Lengkap Cara Mendaftarkan Tempat Usaha di Google Maps & Google Bisnisku (Cepat Terverifikasi di 2026)',
  'panduan-cara-mendaftar-google-maps-usaha-cepat-terverifikasi',
  'Tim Ladi',
  '14 Oktober 2026',
  'PANDUAN USAHA',
  'Langkah demi langkah mendaftarkan toko fisik atau jasa ke Google Maps dan Google Bisnisku agar langsung muncul di pencarian lokal dan mendatangkan pelanggan baru setiap hari.',
  '<p>Pernahkah Anda menyadari bahwa sebelum seseorang melangkah ke toko fisik atau memesan jasa servis, hal pertama yang mereka lakukan adalah membuka ponsel dan mengetik di Google? Kata kunci seperti <em>\"bengkel terdekat\"</em>, <em>\"katering enak di sekitar sini\"</em>, atau <em>\"klinik gigi buka sekarang\"</em> adalah pencarian berdaya beli sangat tinggi.</p><p>Jika nama tempat usaha Anda belum terdaftar resmi di Google Maps dan Profil Bisnis Google, calon pelanggan tersebut 100% akan diarahkan ke tempat usaha kompetitor Anda.</p><h2>Mengapa Google Maps Sangat Krusial untuk Bisnis Lokal?</h2><p>Lebih dari <strong>82% pengguna smartphone</strong> menggunakan pencarian lokal sebelum berkunjung. Tiga bisnis teratas yang disorot langsung di peta Google (Google Local 3-Pack) mendapatkan mayoritas panggilan telepon dan kunjungan rute.</p><div class=\"callout-box\"><h4>💡 Bukti Nyata Hasil Optimasi Google Maps</h4><p>Pada studi kasus <strong>Bengkel Motor Budi Jaya</strong> yang kami tangani, perbaikan titik koordinat Google Maps dan integrasi tombol panggilan cepat terbukti meningkatkan panggilan darurat servis hingga <strong>+340%</strong> hanya dalam 30 hari. <a href=\"/project\">Baca studi kasus lengkapnya di sini →</a></p></div><p>Jika Anda merasa repot mengurus pendaftaran dan verifikasi video Google Bisnisku, tim <strong>Ladi</strong> siap mendampingi Anda hingga lokasi bisnis resmi terverifikasi melalui <a href=\"/services/paket-exist\">Paket EXIST Ladi</a>.</p>',
  'Google Maps, SEO Lokal, Panduan UMKM, Google Bisnisku',
  'published'
),
(
  'Berapa Biaya Pembuatan Website UMKM Profesional di 2026? Rincian Lengkap & Tips Hemat',
  'berapa-biaya-pembuatan-website-umkm-profesional',
  'Tim Ladi',
  '10 Oktober 2026',
  'TIPS PRAKTIS',
  'Simak rincian transparan biaya domain, hosting, dan jasa pembuatan website untuk bisnis kecil dan UMKM agar tidak tertipu harga mahal tanpa hasil nyata.',
  '<p>Salah satu pertanyaan paling umum pemilik usaha adalah: <em>\"Berapa sebenarnya biaya wajar untuk membuat website bisnis yang profesional?\"</em></p><p>Sebuah website profesional memerlukan domain resmi (.com/.id), cloud hosting cepat, serta copywriting dan optimasi SEO terstruktur agar mudah ditemukan pembeli di Google.</p><div class=\"callout-box\"><h4>🎯 Contoh Implementasi Riil</h4><p>Mitra kami di bidang kuliner korporat, <strong>Katering Sari Rasa Ibu Hj. Nunung</strong>, menaikkan omzet pesanan kantor hingga <strong>+180%</strong> setelah memiliki website katalog menu resmi. <a href=\"/project\">Pelajari studi kasusnya di halaman Proyek Ladi →</a></p></div><p>Di <strong>Ladi</strong>, kami menyediakan paket transparan mulai dari <a href=\"/services/paket-exist\">Paket EXIST (Rp 950.000)</a> hingga <a href=\"/services/paket-rise\">Paket RISE (Rp 2.450.000)</a> yang sudah termasuk domain, hosting, dan optimasi SEO tanpa biaya tersembunyi.</p>',
  'Biaya Website, Harga Website UMKM, Tips Bisnis, Jasa Pembuatan Website',
  'published'
),
(
  'Mengapa Bisnis Tidak Boleh Bergantung Hanya pada Marketplace di Tahun 2026',
  'mengapa-bisnis-tidak-boleh-bergantung-marketplace',
  'Tim Ladi',
  '05 Oktober 2026',
  'STRATEGI BISNIS',
  'Potongan biaya komisi terus naik dan akun sewaktu-waktu bisa dibatasi. Inilah pentingnya memiliki website mandiri sebagai aset kedaulatan usaha Anda.',
  '<p>Banyak pemilik usaha merasa sudah cukup hanya berjualan di marketplace. Namun menjadikannya satu-satunya tumpuan memiliki risiko besar: komisi admin naik, perang harga banting-bantingan, dan data pelanggan tidak bisa Anda miliki.</p><div class=\"callout-box\"><h4>📈 Studi Kasus Nyata</h4><p>Mitra kami, <strong>Pusat Oleh-Oleh Khas Bogor Bu Ratna</strong>, berhasil meningkatkan penjualan wisatawan luar kota sebesar <strong>+210%</strong> dengan mengandalkan website mandiri dan Google SEO tanpa terjebak perang harga. <a href=\"/project\">Baca detail hasilnya di halaman Portofolio Klien →</a></p></div><p>Bangun kedaulatan digital usaha Anda sekarang dengan <a href=\"/services/paket-rise\">Paket RISE Website Lengkap</a> bersama tim Ladi.</p>',
  'Strategi Bisnis, Marketplace, Website Mandiri, Kedaulatan Digital',
  'published'
),
(
  'Landing Page vs Website Profil Perusahaan: Mana yang Lebih Tepat untuk Usaha Anda?',
  'perbedaan-landing-page-dan-website-company-profile',
  'Tim Ladi',
  '01 Oktober 2026',
  'PANDUAN USAHA',
  'Jangan salah pilih jenis website. Pahami perbedaan mendasar tujuan, struktur, dan potensi konversi antara landing page 1 halaman dengan website multi-halaman.',
  '<p>Memilih format website yang tepat menentukan kesuksesan pemasaran online Anda. Landing page 1 halaman fokus pada konversi cepat dan satu penawaran spesifik, sementara Website Profil Perusahaan (Company Profile) membangun kepercayaan jangka panjang dan otoritas SEO di Google.</p><div class=\"callout-box\"><h4>🏥 Studi Kasus Terkait</h4><p>Pada proyek <strong>Klinik Gigi drg. Sejahtera</strong>, integrasi website profil dan sistem booking online menghilangkan antrean ruang tunggu dan mengumpulkan 120+ ulasan positif di Google. <a href=\"/project\">Lihat detail proyek klinik gigi di sini →</a></p></div><p>Konsultasikan pilihan terbaik untuk usaha Anda melalui <a href=\"/services/paket-exist\">Paket EXIST</a> atau <a href=\"/services/paket-rise\">Paket RISE</a>.</p>',
  'Landing Page, Company Profile, Desain Web, Strategi UMKM',
  'published'
),
(
  'Kenapa Usaha Bagus Anda Masih Sepi di Google? (Dan Solusi Praktis Agar Cepat Muncul)',
  'kenapa-usaha-bagus-sepi-di-google',
  'Tim Ladi',
  '28 September 2026',
  'PANDUAN USAHA',
  'Bukan karena produk Anda kalah saing, tapi karena alamat dan profil bisnis Anda belum terdaftar secara terstruktur di radar pencarian Google.',
  '<p>Banyak usaha dengan produk bagus sepi karena belum terdaftar di radar Google. Pelanggan zaman modern mencari bukti ulasan, titik GPS akurat, dan tombol WhatsApp instan sebelum berbelanja.</p><p>Simak panduan kami di <a href=\"/blog/panduan-cara-mendaftar-google-maps-usaha-cepat-terverifikasi\">Panduan Pendaftaran Google Maps</a> atau hubungi tim <strong>Ladi</strong> untuk solusi lengkap digitalisasi bisnis Anda.</p>',
  'Panduan Usaha, Google, SEO Lokal, Kredibilitas Bisnis',
  'published'
),
(
  'Cara Mengubah WhatsApp Bisnis Menjadi Mesin Penjualan Otomatis untuk Toko Anda',
  'cara-mengubah-whatsapp-bisnis-jadi-mesin-penjualan-otomatis',
  'Tim Ladi',
  '22 September 2026',
  'TUTORIAL',
  'Tutorial praktis menyiapkan katalog digital, pesan salam instan, dan template balasan cepat agar calon pembeli langsung transfer tanpa ragu.',
  '<p>WhatsApp adalah sarana konversi penjualan nomor satu di Indonesia. Dengan memanfaatkan katalog produk, pesan salam otomatis, dan quick replies, Anda bisa melayani pelanggan 24 jam nonstop tanpa kewalahan.</p><p>Semua website yang kami bangun di Ladi terintegrasi langsung dengan WhatsApp yang otomatis mengisi teks pesanan pembeli. Pelajari lebih lanjut di <a href=\"/services/paket-run\">Paket RUN Ladi</a> atau ikuti pelatihan kami di <a href=\"/events\">Agenda Acara Ladi</a>.</p>',
  'WhatsApp Bisnis, Penjualan Otomatis, Tutorial UMKM, Customer Service',
  'published'
)
ON DUPLICATE KEY UPDATE `title`=VALUES(`title`);

-- -----------------------------------------------------
-- Table: events
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `events` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(500) NOT NULL,
  `tag` VARCHAR(255) DEFAULT 'Workshop Praktis',
  `thumb` MEDIUMTEXT,
  `date` VARCHAR(100) DEFAULT '',
  `location` VARCHAR(255) DEFAULT 'Bogor & Live Zoom',
  `short_desc` TEXT,
  `description` LONGTEXT,
  `btn_text` VARCHAR(100) DEFAULT 'Daftar Sekarang',
  `btn_link` TEXT,
  `status` ENUM('active', 'inactive') DEFAULT 'active',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------
-- Seed Events
-- -----------------------------------------------------
INSERT INTO `events` (`title`, `tag`, `date`, `location`, `short_desc`, `description`, `btn_text`, `btn_link`, `status`)
VALUES 
(
  'Workshop Google Bisnis & Optimasi Titik Peta Lokal',
  'Workshop Tatap Muka',
  'Sabtu, 14 Oktober 2026 · 09:00 - 13:00 WIB',
  'Sentra Bisnis Pajajaran, Kota Bogor',
  'Panduan langsung langkah demi langkah bagi pemilik toko fisik agar tempat usahanya muncul di peringkat 3 teratas pencarian Google Maps Bogor.',
  '<h3>Materi yang Dipelajari:</h3><ul><li>Klaim kepemilikan dan verifikasi instan Google Bisnisku</li><li>Trik memilih kategori bisnis yang minim persaingan tapi ramai pencari</li><li>Strategi mengumpulkan ulasan bintang 5 dari pelanggan setia tanpa melanggar pedoman Google</li><li>Teknik menghubungkan profil Google ke WhatsApp Penjualan langsung</li></ul>',
  'Daftar Kursi Terbatas',
  'https://wa.me/6282112477119?text=Halo+Ladi%2C+saya+mau+daftar+Workshop+Google+Bisnis',
  'active'
),
(
  'Briefing Eksekutif: Reputasi Digital & Keamanan Usaha',
  'Sesi Terbatas (Maks. 10 Orang)',
  'Rabu, 21 Oktober 2026 · 14:00 - 16:30 WIB',
  'Lounge Hotel Salak The Heritage, Bogor',
  'Sesi eksklusif untuk pemilik usaha dan manajemen senior tentang pencegahan penipuan online yang mencatut nama bisnis Anda.',
  '<h3>Pokok Pembahasan:</h3><ul><li>Mengamankan akun Google Bisnis dari upaya pembajakan pihak tak bertanggung jawab</li><li>Menangani ulasan negatif palsu dari kompetitor nakal secara legal dan tenang</li><li>Standar verifikasi resmi komunikasi WhatsApp kepada pelanggan setia</li></ul>',
  'Reservasi Kursi Eksekutif',
  'https://wa.me/6282112477119?text=Halo+Ladi%2C+saya+tertarik+mengikuti+Briefing+Eksekutif',
  'active'
),
(
  'Klinik Konsultasi 1-on-1: Transformasi Digital Toko Anda',
  'Konsultasi Privat',
  'Sesuai Perjanjian (Senin - Jumat)',
  'Kantor Ladi Bogor atau Kunjungan Langsung ke Toko Anda',
  'Konsultan digital Ladi datang langsung ke lokasi usaha Anda untuk mengevaluasi titik lemah dan merancang peta jalan digitalisasi tokomu.',
  '<h3>Apa yang Kami Periksa Bersama Anda:</h3><ul><li>Audit keterlihatan toko Anda di pencarian smartphone radius 5 km</li><li>Pemeriksaan nomor kontak, katalog, dan alur pemesanan pelanggan</li><li>Rekomendasi tindakan instan yang bisa langsung menaikkan panggilan telepon dan kunjungan</li></ul>',
  'Jadwalkan Konsultasi 1-on-1',
  'https://wa.me/6282112477119?text=Halo+Ladi%2C+saya+mau+jadwalkan+Klinik+Konsultasi+1-on-1',
  'active'
)
ON DUPLICATE KEY UPDATE `title`=VALUES(`title`);

-- -----------------------------------------------------
-- Table: projects (Portfolio Studi Kasus Klien)
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `projects` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(500) NOT NULL,
  `slug` VARCHAR(500) NOT NULL UNIQUE,
  `client_name` VARCHAR(255),
  `client_industry` VARCHAR(255),
  `client_location` VARCHAR(255),
  `website_url` TEXT,
  `thumb` MEDIUMTEXT,
  `summary` TEXT,
  `challenge` LONGTEXT,
  `solution` LONGTEXT,
  `results` TEXT,
  `year` VARCHAR(50) DEFAULT '2026',
  `status` ENUM('published', 'draft') DEFAULT 'published',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------
-- Seed Projects
-- -----------------------------------------------------
INSERT INTO `projects` (`title`, `slug`, `client_name`, `client_industry`, `client_location`, `website_url`, `thumb`, `summary`, `challenge`, `solution`, `results`, `year`, `status`)
VALUES 
(
  'Bengkel Motor Budi Jaya',
  'bengkel-motor-budi-jaya',
  'Pak Budi Santoso',
  'Otomotif & Servis Kendaraan',
  'Tanah Sareal, Kota Bogor',
  'https://maps.google.com/?q=bengkel+motor+budi+jaya',
  '/images/bengkel.jpg',
  'Transformasi bengkel lokal tradisional menjadi bengkel rujukan nomor 1 di Google Maps kawasan Tanah Sareal dengan peningkatan panggilan telepon darurat servis sebesar +340%.',
  'Lokasi berada agak masuk ke dalam gang jalan sekunder. Hanya mengandalkan plang kayu di depan bengkel, sehingga pengendara motor yang mengalami mogok di jalan raya tidak tahu keberadaannya.',
  'Pendaftaran resmi Google Bisnis, optimasi titik koordinat GPS akurat, penambahan tombol Telepon Montir Darurat Langsung, serta website profil satu halaman yang memuat katalog harga suku cadang transparan.',
  '+340% Telepon & Kunjungan, Peringkat #1 Pencarian Bengkel Motor Terdekat di Radius 4 km',
  '2026',
  'published'
),
(
  'Katering Sari Rasa Ibu Hj. Nunung',
  'katering-sari-rasa-ibu-hj-nunung',
  'Hj. Nunung Suryani',
  'Kuliner & Katering Korporat',
  'Pajajaran, Kota Bogor',
  'https://kateringsarirasa.com',
  '/images/katering.jpg',
  'Peningkatan omzet pesanan nasi kotak dan prasmanan kantor hingga 180% melalui katalog menu digital dan formulir pemesanan cepat via WhatsApp.',
  'Sebelumnya hanya mengandalkan brosur fotokopi dan rekomendasi mulut ke mulut keluarga. Kesulitan mendapatkan order besar dari perkantoran dan instansi pemerintah karena tidak memiliki katalog resmi.',
  'Pembangunan website katalog menu interaktif dengan foto hidangan profesional, paket harga transparan per porsi, dan tombol unduh proposal penawaran otomatis untuk sekretariat kantor.',
  '+180% Omzet Pesanan Kantor, Rata-rata 25 Pesanan Korporat Baru per Bulan',
  '2026',
  'published'
)
ON DUPLICATE KEY UPDATE `title`=VALUES(`title`);

-- -----------------------------------------------------
-- Table: team_members
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `team_members` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `role` VARCHAR(255) NOT NULL,
  `badge` VARCHAR(100) DEFAULT 'Team Ladi',
  `image` MEDIUMTEXT,
  `desc` TEXT,
  `focus` VARCHAR(255) DEFAULT '',
  `order_num` INT DEFAULT 0,
  `status` ENUM('active', 'inactive') DEFAULT 'active',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------
-- Seed Team Members
-- -----------------------------------------------------
INSERT INTO `team_members` (`name`, `role`, `badge`, `image`, `desc`, `focus`, `order_num`, `status`)
VALUES 
(
  'Rizky Pratama',
  'Project Lead & Digital Strategist',
  'PPLG Wikrama Lead',
  '/images/team/team1.jpg',
  'Memastikan arsitektur website prima, SEO maksimal, dan setiap proyek digital selesai tepat waktu dengan standar visual kelas dunia.',
  'Arsitektur & SEO Semantik',
  1,
  'active'
),
(
  'Fajar Ramadhan',
  'Lead Fullstack & UI Engineer',
  'Web & Mobile Specialist',
  '/images/team/team2.jpg',
  'Membangun website responsif super kencang, mulus dibuka di semua tipe HP, dan terintegrasi langsung dengan database serta WhatsApp bisnis.',
  'Performa & Integrasi Sistem',
  2,
  'active'
),
(
  'Sarah Amalia',
  'Digital Branding & Client Support',
  'Client Care & Strategist',
  '/images/team/team3.jpg',
  'Menata copywriting promosi, estetika visual foto usaha, serta mendampingi pemilik UMKM langkah demi langkah agar usahanya ramai dicari pembeli.',
  'Visual & Konten Promosi',
  3,
  'active'
)
ON DUPLICATE KEY UPDATE `name`=VALUES(`name`);

-- -----------------------------------------------------
-- Table: service_packages
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `service_packages` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `slug` VARCHAR(255) NOT NULL UNIQUE,
  `tag` VARCHAR(100) DEFAULT 'PAKET LADI',
  `subtitle` TEXT,
  `target_audience` TEXT,
  `price` VARCHAR(100) NOT NULL,
  `original_price` VARCHAR(100) DEFAULT '',
  `period` VARCHAR(100) DEFAULT 'Sekali Bayar',
  `timeline` VARCHAR(100) DEFAULT '5–7 Hari',
  `deliverables` LONGTEXT,
  `example_websites` LONGTEXT,
  `audit_report_sample` LONGTEXT,
  `description` LONGTEXT,
  `faqs` LONGTEXT,
  `cta_text` VARCHAR(100) DEFAULT 'Pesan via WhatsApp',
  `cta_whatsapp_text` TEXT,
  `badge_popular` TINYINT(1) DEFAULT 0,
  `status` ENUM('active', 'inactive') DEFAULT 'active',
  `order_num` INT DEFAULT 0,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_slug (`slug`),
  INDEX idx_status (`status`),
  INDEX idx_order (`order_num`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

