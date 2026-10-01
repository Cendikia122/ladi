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
-- Seed Blogs
-- -----------------------------------------------------
INSERT INTO `blogs` (`title`, `slug`, `author`, `date`, `category`, `excerpt`, `content`, `tags`, `status`)
VALUES 
(
  'Kenapa Bisnis Lokal di Bogor Wajib Ada di Google Maps?',
  'kenapa-bisnis-lokal-di-bogor-wajib-ada-di-google-maps',
  'Tim Ladi',
  '28 September 2026',
  'PANDUAN USAHA',
  'Lebih dari 80% konsumen mencari tempat makan, bengkel, atau klinik terdekat lewat smartphone mereka. Jangan biarkan toko Anda tak terlihat.',
  '<p>Pernahkah Anda bertanya mengapa pelanggan baru jarang mampir ke toko fisik Anda, padahal lokasi Anda berada di pinggir jalan yang cukup ramai? Jawabannya sederhana: <strong>sebelum orang melangkah keluar rumah atau memutar setir kendaraan, mata mereka terlebih dahulu melihat layar ponsel pintar.</strong></p><h3>Perilaku Konsumen Modern di Kota Bogor</h3><p>Ketika seseorang mencari bengkel, kafe untuk rapat santai, atau apotek darurat, mereka tidak lagi bertanya ke orang di pinggir jalan. Mereka membuka Google Maps dan mengetik <em>\"bengkel terdekat\"</em> atau <em>\"katering enak di bogor\"</em>.</p><p>Jika profil Google Bisnis Anda belum terverifikasi, alamat Anda salah sematan, atau tidak memiliki ulasan bintang lima, calon pelanggan tersebut akan langsung beralih ke kompetitor Anda dalam hitungan 3 detik.</p><h3>Langkah Praktis yang Perlu Anda Lakukan:</h3><ul><li>Klaim dan verifikasi titik lokasi bisnis Anda di Google Bisnisku.</li><li>Lengkapi jam operasional, nomor WhatsApp yang aktif, dan foto toko yang terang.</li><li>Ajak pelanggan setia memberikan ulasan jujur beserta foto.</li></ul><p>Tim Ladi siap membantu mengurus seluruh proses legalitas profil digital bisnis Anda hingga terdaftar resmi dan muncul di peringkat teratas pencarian lokal.</p>',
  'Google Maps, SEO Lokal, UMKM Bogor',
  'published'
),
(
  '5 Kesalahan Fatal Pemilik Toko Saat Go Digital',
  '5-kesalahan-fatal-pemilik-toko-saat-go-digital',
  'Tim Ladi',
  '24 September 2026',
  'STRATEGI DIGITAL',
  'Bikin akun Instagram tapi tidak pernah dibalas, atau nomor kontak mati saat pelanggan mau beli. Simak evaluasi penting ini.',
  '<p>Banyak pemilik usaha senior merasa sudah \"go digital\" hanya karena memiliki akun media sosial. Namun bulan demi bulan berlalu, tidak ada satu pun transaksi yang masuk dari internet. Mengapa hal ini bisa terjadi?</p><h3>1. Nomor Kontak Tidak Responsif atau Terputus</h3><p>Pelanggan internet memiliki tingkat kesabaran yang sangat rendah. Jika mereka menekan tombol WhatsApp dan tidak dibalas dalam 15 menit, mereka akan langsung berpindah ke toko lain.</p><h3>2. Titik Peta Google Melenceng</h3><p>Tidak ada yang lebih menjengkelkan bagi pembeli selain diarahkan Google Maps ke gang buntu atau rumah kosong. Pastikan titik koordinat GPS Anda akurat hingga ke nomor pintu toko.</p><h3>3. Tidak Memiliki Bukti Kepercayaan (Social Proof)</h3><p>Konsumen yang belum pernah berkunjung membutuhkan rasa aman. Foto tim yang ramah, foto etalase yang rapi, dan testimoni pelanggan lama adalah modal terbesar Anda di dunia maya.</p>',
  'Tips Bisnis, Digitalisasi, UMKM',
  'published'
),
(
  'Cara Mudah Mengelola WhatsApp Bisnis Tanpa Bikin Pusing',
  'cara-mudah-mengelola-whatsapp-bisnis-tanpa-bikin-pusing',
  'Tim Ladi',
  '19 September 2026',
  'TUTORIAL',
  'Panduan sederhana menyiapkan katalog produk, pesan otomatis di luar jam kerja, dan template balasan cepat untuk calon pembeli.',
  '<p>WhatsApp Bisnis adalah senjata paling ampuh dan paling murah untuk UMKM di Indonesia. Sayangnya, banyak pengusaha masih menggunakan WhatsApp pribadi biasa untuk melayani ratusan pembeli.</p><h3>Fitur WhatsApp Bisnis yang Wajib Anda Pasang Hari Ini:</h3><ul><li><strong>Katalog Digital:</strong> Pajang foto produk lengkap dengan harga, sehingga Anda tidak perlu bolak-balik kirim foto manual.</li><li><strong>Pesan Salam (Greeting Message):</strong> Sambut pelanggan secara instan saat mereka pertama kali menyapa.</li><li><strong>Balasan Cepat (Quick Replies):</strong> Simpan format rekening bank, ongkos kirim, dan alamat toko dengan satu tombol pintas.</li></ul><p>Di Ladi, kami membantu merapikan katalog WhatsApp Bisnis Anda agar tampak profesional dan meyakinkan di mata pembeli.</p>',
  'WhatsApp Bisnis, Penjualan, Panduan',
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
  'https://wa.me/6281298319944?text=Halo+Ladi%2C+saya+mau+daftar+Workshop+Google+Bisnis',
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
  'https://wa.me/6281298319944?text=Halo+Ladi%2C+saya+tertarik+mengikuti+Briefing+Eksekutif',
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
  'https://wa.me/6281298319944?text=Halo+Ladi%2C+saya+mau+jadwalkan+Klinik+Konsultasi+1-on-1',
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

