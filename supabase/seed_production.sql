-- ============================================================================
-- PRODUCTION SEED — Yayasan Cinta Madani
-- Data realistis untuk website yayasan pendidikan Islam
-- ============================================================================

-- 1. Site Settings (update existing)
UPDATE site_settings SET
  school_name = 'Yayasan Cinta Madani',
  tagline = 'Menumbuhkan Generasi Berkarakter, Berilmu, dan Beramal',
  description = 'Yayasan Cinta Madani adalah lembaga pendidikan Islam yang berkomitmen menciptakan lingkungan belajar holistik, mengintegrasikan ilmu pengetahuan dengan nilai-nilai karakter Islami sejak usia dini hingga menengah atas.',
  email = 'info@cintamadani.sch.id',
  phone = '021-7654-3210',
  whatsapp = '6281234567890',
  address = 'Jl. Pendidikan Islam No. 88, Kebayoran Baru, Jakarta Selatan 12190',
  social_links = '{"instagram": "https://instagram.com/cintamadani", "facebook": "https://facebook.com/cintamadani", "youtube": "https://youtube.com/@cintamadani", "tiktok": "https://tiktok.com/@cintamadani"}',
  seo_defaults = '{"title": "Yayasan Cinta Madani", "description": "Yayasan pendidikan Islam yang membentuk generasi berkarakter, berilmu, dan beramal.", "og_image": "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200"}'
WHERE id = '00000000-0000-0000-0000-000000000001';

-- 2. Navigation Items (update + add Agenda & PPDB)
DELETE FROM navigation_items;
INSERT INTO navigation_items (id, label, url, sort_order, is_visible) VALUES
  ('00000000-0000-0000-0000-000000000010', 'Beranda', '/', 1, true),
  ('00000000-0000-0000-0000-000000000011', 'Tentang', '/tentang', 2, true),
  ('00000000-0000-0000-0000-000000000012', 'Unit Pendidikan', '/unit-pendidikan', 3, true),
  ('00000000-0000-0000-0000-000000000013', 'Program', '/program', 4, true),
  ('00000000-0000-0000-0000-000000000014', 'Berita', '/berita', 5, true),
  ('00000000-0000-0000-0000-000000000015', 'Galeri', '/galeri', 6, true),
  ('00000000-0000-0000-0000-000000000016', 'Agenda', '/agenda', 7, true),
  ('00000000-0000-0000-0000-000000000017', 'PPDB', '/ppdb', 8, true),
  ('00000000-0000-0000-0000-000000000018', 'Kontak', '/kontak', 9, true);

-- 3. Pages (update existing with richer content)
UPDATE pages SET description = 'Yayasan Cinta Madani — menumbuhkan generasi berkarakter, berilmu, dan beramal sejak 2005.' WHERE id = '00000000-0000-0000-0000-000000000020';
UPDATE pages SET description = 'Mengenal lebih dekat sejarah, visi, misi, dan nilai-nilai Yayasan Cinta Madani.' WHERE id = '00000000-0000-0000-0000-000000000021';

-- 4. Homepage Sections (richer content with Unsplash images)
UPDATE page_sections SET content = '{
  "eyebrow": "Yayasan Cinta Madani",
  "headline": "Menumbuhkan Generasi Berkarakter, Berilmu, dan Beramal.",
  "description": "Lingkungan pendidikan Islam yang holistik — mengintegrasikan ilmu pengetahuan, karakter, dan kepedulian sejak usia dini hingga menengah atas.",
  "primary_cta_label": "Kenali Yayasan",
  "primary_cta_url": "/tentang",
  "secondary_cta_label": "Jelajahi Sekolah",
  "secondary_cta_url": "/unit-pendidikan",
  "hero_image": "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1600&q=80"
}' WHERE page_id = '00000000-0000-0000-0000-000000000020' AND section_key = 'hero';

UPDATE page_sections SET content = '{
  "items": [
    {"label": "20+ Tahun Pengalaman"},
    {"label": "4 Unit Pendidikan"},
    {"label": "3000+ Alumni"},
    {"label": "Akreditasi A"}
  ]
}' WHERE page_id = '00000000-0000-0000-0000-000000000020' AND section_key = 'statistics';

UPDATE page_sections SET content = '{
  "eyebrow": "01 / Tentang Yayasan",
  "heading": "Pendidikan yang Membumi dan Menyentuh Hati.",
  "description": "Sejak 2005, Yayasan Cinta Madani hadir sebagai lembaga pendidikan Islam yang percaya setiap anak memiliki potensi unik. Kami menciptakan lingkungan belajar yang aman, menyenangkan, dan bermakna — tempat siswa tumbuh tidak hanya cerdas secara akademik, tetapi juga berakhlak mulia dan peduli lingkungan.",
  "cta_label": "Baca Profil Yayasan",
  "cta_url": "/tentang",
  "primary_image": "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&q=80",
  "secondary_image": "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=600&q=80"
}' WHERE page_id = '00000000-0000-0000-0000-000000000020' AND section_key = 'about';

UPDATE page_sections SET content = '{
  "items": [
    {"number": "01", "title": "Tauhid & Akhlak", "description": "Menanamkan cinta kepada Allah, Rasul, dan sesama manusia sebagai fondasi setiap perilaku."},
    {"number": "02", "title": "Ilmu & Keterampilan", "description": "Membekali siswa dengan pengetahuan dan keterampilan abad 21 yang relevan dan bermakna."},
    {"number": "03", "title": "Kemandirian", "description": "Mendorong siswa untuk mandiri, kritis, dan percaya diri dalam menghadapi tantangan."},
    {"number": "04", "title": "Kepedulian Lingkungan", "description": "Menumbuhkan empati dan tanggung jawab terhadap kelestarian alam dan kesejahteraan sosial."}
  ]
}' WHERE page_id = '00000000-0000-0000-0000-000000000020' AND section_key = 'values';

UPDATE page_sections SET content = '{
  "eyebrow": "04 / Kehidupan Sekolah",
  "heading": "Setiap Hari adalah Petualangan Belajar.",
  "description": "Dari kelas pagi yang penuh semangat hingga kegiatan ekstrakurikuler yang inspiratif — kehidupan di Cinta Madani dirancang agar siswa belajar dengan gembira dan bermakna.",
  "images": [
    "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&q=80",
    "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80",
    "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=800&q=80",
    "https://images.unsplash.com/photo-1544717305-2782549b5136?w=800&q=80"
  ],
  "captions": ["Pembelajaran di kelas", "Laboratorium sains", "Kegiatan seni dan budah", "Olahraga bersama"]
}' WHERE page_id = '00000000-0000-0000-0000-000000000020' AND section_key = 'school_life';

-- 5. Education Units (4 units)
DELETE FROM unit_programs;
DELETE FROM education_units;

INSERT INTO education_units (id, name, slug, short_description, description, address, phone, email, status, sort_order) VALUES
('a0000000-0000-0000-0000-000000000001', 'TK Cinta Madani', 'tk-cinta-madani',
 'Taman Kanak-kanak Islam yang menumbuhkan kecintaan anak kepada Allah melalui bermain dan berkreasi.',
 'TK Cinta Madani menyediakan lingkungan belajar yang aman, menyenangkan, dan penuh kasih sayang untuk anak usia 3-6 tahun. Kurikulum kami mengintegrasikan perkembangan karakter Islami dengan metode bermain berbasis Montessori, membantu anak tumbuh secara holistik — cerdas, kreatif, dan berakhlak mulia.',
 'Jl. Pendidikan Islam No. 88, Kebayoran Baru, Jakarta Selatan',
 '021-7654-3211', 'tk@cintamadani.sch.id', 'published', 1),

('a0000000-0000-0000-0000-000000000002', 'SD Cinta Madani', 'sd-cinta-madani',
 'Sekolah Dasar Islam Terpadu dengan pendekatan pembelajaran berbasis proyek dan karakter.',
 'SD Cinta Madani menerapkan Kurikulum Merdeka dengan insersi nilai-nilai Islam secara terpadu. Siswa belajar melalui proyek-proyek kontekstual yang menghubungkan pengetahuan dengan kehidupan nyata, didukung oleh fasilitas laboratorium, perpustakaan, dan ruang seni yang lengkap.',
 'Jl. Pendidikan Islam No. 90, Kebayoran Baru, Jakarta Selatan',
 '021-7654-3212', 'sd@cintamadani.sch.id', 'published', 2),

('a0000000-0000-0000-0000-000000000003', 'SMP Cinta Madani', 'smp-cinta-madani',
 'Sekolah Menengah Pertama yang membentuk generasi muda yang kritis, kreatif, dan beriman.',
 'SMP Cinta Madani menyiapkan siswa menghadapi tantangan abad 21 dengan memadukan Kurikulum Merdeka, program Tahfidz Al-Qur\'an, dan kegiatan kepemimpinan. Siswa didorong untuk berpikir kritis, berkreasi, dan berkontribusi positif di masyarakat.',
 'Jl. Pendidikan Islam No. 92, Kebayoran Baru, Jakarta Selatan',
 '021-7654-3213', 'smp@cintamadani.sch.id', 'published', 3),

('a0000000-0000-0000-0000-000000000004', 'SMA Cinta Madani', 'sma-cinta-madani',
 'Sekolah Menengah Atas yang mempersiapkan pemimpin masa depan dengan keunggulan akademik dan karakter.',
 'SMA Cinta Madani menawarkan program IPA, IPS, dan Bahasa dengan pendekatan pembelajaran inquiry-based. Program unggulan meliputi Tahfidz Al-Qur\'an, kelas bahasa Arab dan Inggris, laboratorium riset, dan program kesiapan kuliah ke universitas nasional maupun internasional.',
 'Jl. Pendidikan Islam No. 94, Kebayoran Baru, Jakarta Selatan',
 '021-7654-3214', 'sma@cintamadani.sch.id', 'published', 4);

-- 6. News Articles (5 articles)
DELETE FROM news_tag_relations;
DELETE FROM news;

INSERT INTO news (id, unit_id, category_id, title, slug, excerpt, content, cover_image_url, status, featured, author_id, published_at, seo_title, seo_description) VALUES
('b0000000-0000-0000-0000-000000000001', NULL, '00000000-0000-0000-0000-000000000032',
 'Resepsi Tahun Ajaran Baru 2025/2026 Berlangsung Khidmat',
 'resepsi-tahun-ajar-baru-2025-2026',
 'Upacara pembukaan tahun ajaran baru dihelat meriah di halaman utama Yayasan Cinta Madani.',
 '<p>Resepsi Tahun Ajaran Baru 2025/2026 Yayasan Cinta Madani berlangsung khidmat pada Senin (14/7) di halaman utama. Acara dihadiri oleh seluruh siswa, guru, karyawan, dan wali murid dari empat unit pendidikan.</p><p>Dalam sambutannya, Ketua Yayasan menyampaikan pentingnya membangun karakter Islami sejak hari pertama sekolah. "Tahun ini kita mengusung tema <strong>Membangun Generasi Cinta Ilmu</strong> — mari kita jadikan setiap momen pembelajaran sebagai ibadah."</p><p>Acara ditutup dengan doa bersama dan foto seluruh keluarga besar Cinta Madani.</p>',
 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=800&q=80',
 'published', true, '00000000-0000-0000-0000-000000000099', '2025-07-14T08:00:00Z',
 'Resepsi Tahun Ajaran Baru 2025/2026 | Yayasan Cinta Madani',
 'Upacara pembukaan tahun ajaran baru 2025/2026 Yayasan Cinta Madani berlangsung khidmat dihadiri seluruh siswa dan wali murid.'),

('b0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000031',
 'SD Cinta Madani Raih Juara 2 Olimpiade Sains Tingkat Provinsi',
 'sd-raih-juara-2-olimpiade-sains-provinsi',
 'Siswa kelas 5 SD Cinta Madani meraih juara 2 Olimpiade Sains tingkat DKI Jakarta.',
 '<p>Kabar gembira datang dari siswa SD Cinta Madani! Muhammad Rizki (kelas 5B) berhasil meraih juara 2 dalam Olimpiade Sains tingkat Provinsi DKI Jakarta yang diselenggarakan di Universitas Indonesia pada 5 Juli 2025.</p><p>Rizki bersaing dengan 150 siswa dari berbagai sekolah se-DKI Jakarta dalam bidang Matematika. Prestasi ini tidak lepas dari bimbingan para guru dan dukungan penuh dari sekolah.</p><p>"Saya belajar tekun karena ingin membanggakan sekolah dan orang tua," ujar Rizki dengan bangga.</p>',
 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80',
 'published', false, '00000000-0000-0000-0000-000000000099', '2025-07-08T09:00:00Z',
 'Juara 2 Olimpiade Sains SD Cinta Madani',
 'Siswa SD Cinta Madani meraih juara 2 Olimpiade Sains tingkat Provinsi DKI Jakarta.'),

('b0000000-0000-0000-0000-000000000003', NULL, '00000000-0000-0000-0000-000000000030',
 'Kurikulum Berbasis Cinta: Fondasi Pembelajaran di Cinta Madani',
 'kurikulum-berbasis-cinta-fondasi-pembelajaran',
 'Yayasan Cinta Madani mengadopsi pendekatan Kurikulum Berbasis Cinta Kemenag RI.',
 '<p>Sejalan dengan peluncuran Kurikulum Berbasis Cinta (KBC) oleh Kementerian Agama RI, Yayasan Cinta Madani telah lebih dulu mengadopsi pendekatan serupa dalam pembelajaran sehari-hari.</p><p>"Cinta adalah energi dasar dalam pendidikan. Ketika siswa merasa dicintai dan dihargai, mereka belajar dengan lebih bermakna," ujar Kepala SMA Cinta Madani.</p><p>Lima nilai utama KBC — Cinta kepada Tuhan, Ilmu, Diri & Sesama, Lingkungan, dan Tanah Air — telah terintegrasi dalam kurikulum semua unit pendidikan Cinta Madani.</p>',
 'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=800&q=80',
 'published', false, '00000000-0000-0000-0000-000000000099', '2025-06-25T07:00:00Z',
 'Kurikulum Berbasis Cinta di Cinta Madani',
 'Yayasan Cinta Madani mengadopsi pendekatan Kurikulum Berbasis Cinta dalam pembelajaran.'),

('b0000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000032',
 'SMP Cinta Madani Gelar佩Yakin & Peduli: Bakti Sosial ke Panti Asuhan',
 'smp-bakti-sosial-panti-asuhan',
 'Siswa SMP Cinta Madani menggelar bakti sosial ke Panti Asuhan Yatim Aisyiyah.',
 '<p>Sebanyak 45 siswa kelas 7 dan 8 SMP Cinta Madani menggelar kegiatan bakti sosial di Panti Asuhan Yatim Aisyiyah, Kebayoran Lama, pada Sabtu (5/7).</p><p>Kegiatan yang bertajuk "Berbagi Itu Indah" ini meliputi pengajian bersama anak-anak panti, bermain games edukatif, serta menyerahkan bantuan sembako dan perlengkapan sekolah.</p><p>"Kami ingin siswa belajar empati dan berbagi langsung dengan sesama. Ini bagian dari pendidikan karakter yang tidak bisa diajarkan hanya dari buku," kata Wali Kelas 7B.</p>',
 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800&q=80',
 'published', false, '00000000-0000-0000-0000-000000000099', '2025-07-05T10:00:00Z',
 'Bakti Sosial SMP Cinta Madani',
 'Siswa SMP Cinta Madani menggelar bakti sosial ke Panti Asuhan Yatim Aisyiyah.'),

('b0000000-0000-0000-0000-000000000005', NULL, '00000000-0000-0000-0000-000000000031',
 'Seleksi PPDB 2025/2026 Telah Dibuka untuk Semua Unit',
 'seleksi-ppdb-2025-2026-telah-dibuka',
 'Pendaftaran dan seleksi Peserta Didik Baru tahun ajaran 2025/2026 resmi dibuka.',
 '<p>Yayasan Cinta Madani mengumumkan dibukanya pendaftaran Peserta Didik Baru (PPDB) untuk tahun ajaran 2025/2026 di semua unit pendidikan: TK, SD, SMP, dan SMA.</p><p>Pendaftaran dibuka sejak 1 Januari hingga 31 Maret 2025. Seleksi terdiri dari ujian tertulis, tes wawancara, dan observasi karakter. Bagi yang berminat, silakan daftar secara online melalui halaman PPDB kami.</p><p>"Kami mencari siswa yang tidak hanya cerdas, tetapi juga memiliki karakter baik dan semangat belajar," jelas Kepala Sekolah Admissions.</p>',
 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&q=80',
 'published', true, '00000000-0000-0000-0000-000000000099', '2025-01-02T08:00:00Z',
 'PPDB 2025/2026 Yayasan Cinta Madani',
 'Pendaftaran PPDB 2025/2026 dibuka untuk TK, SD, SMP, dan SMA Cinta Madani.');

-- 7. Programs (5 programs)
DELETE FROM unit_programs;
DELETE FROM programs;

INSERT INTO programs (id, title, slug, excerpt, content, icon, featured, status, sort_order) VALUES
('c0000000-0000-0000-0000-000000000001', 'Tahfidz Al-Qur''an', 'tahfidz-quran',
 'Program hafalan Al-Qur''an terstruktur dengan pendampingan ustadz/ustadzah berpengalaman.',
 '<p>Program Tahfidz Al-Qur''an di Yayasan Cinta Madani dirancang untuk membantu siswa menghafal Al-Qur''an secara bertahap dan konsisten. Setiap siswa mendapatkan target hafalan mingguan yang disesuaikan dengan kemampuan, didampingi oleh ustadz/ustadzah bersertifikat.</p><p>Metode yang digunakan meliputi:</p><ul><li>Tilawah dan tahsin sebelum mulai menghafal</li><li>Muroja''ah (pengulangan) secara berkala</li><li>Tes hafalan bulanan dengan penilaian</li><li>Program motivasi dan reward untuk pencapaian tertentu</li></ul>',
 'book-open', true, 'published', 1),

('c0000000-0000-0000-0000-000000000002', 'Sains & Robotika', 'sains-robotika',
 'Program unggulan sains terapan dan dasar-dasar robotika untuk siswa SD hingga SMA.',
 '<p>Program Sains & Robotika Cinta Madani membekali siswa dengan keterampilan STEM (Science, Technology, Engineering, Mathematics) melalui hands-on project. Siswa belajar merancang, membangun, dan memprogram robot sederhana hingga kompleks.</p><p>Fasilitas yang tersedia:</p><ul><li>Laboratorium sains lengkap</li><li>Kit robotika Arduino dan Raspberry Pi</li><li>Ruang maker space</li><li>Mentoring dari praktisi industri</li></ul>',
 'cpu', true, 'published', 2),

('c0000000-0000-0000-0000-000000000003', 'Bahasa Arab & Inggris', 'bahasa-arab-inggris',
 'Penguasaan bahasa Arab dan Inggris melalui metode immersif dan percakapan.',
 '<p>Di era global, penguasaan bahasa Arab dan Inggris menjadi kebutuhan penting. Program ini menggunakan metode immersif — siswa berlatih percakapan sehari-hari dalam bahasa target, didukung oleh native speaker dan materi interaktif.</p><p>Capaian program:</p><ul><li>Siswa mampu berkomunikasi dalam bahasa Arab dan Inggris</li><li>Persiapan ujian sertifikasi internasional</li><li>Kegiatan exchange dan study tour</li><li>Klub debat dan public speaking</li></ul>',
 'globe', true, 'published', 3),

('c0000000-0000-0000-0000-000000000004', 'Kepemudaan & Leadership', 'kepemudaan-leadership',
 'Membentuk pemimpin masa depan melalui program kepemimpinan dan pengabdian masyarakat.',
 '<p>Program ini dirancang untuk mengembangkan soft skills kepemimpinan, kerja tim, dan kepedulian sosial siswa. Melalui kegiatan lapangan, proyek komunitas, dan simulasi kepemimpinan, siswa belajar memimpin dengan teladan dan berkontribusi nyata.</p><p>Kegiatan utama:</p><ul><li>Camping leadership dan team building</li><li>Proyek pengabdian masyarakat</li><li>Klub debat dan public speaking</li><li>Mentoring dari tokoh masyarakat</li></ul>',
 'users', false, 'published', 4),

('c0000000-0000-0000-0000-000000000005', 'Seni & Budaya Islam', 'seni-budaya-islam',
 'Pengembangan bakat seni dalam bingkai budaya Islam: kaligrafi, nasyid, dan seni lukis.',
 '<p>Program Seni & Budaya Islam memberikan ruang bagi siswa untuk mengekspresikan kreativitas melalui media seni yang terinspirasi dari nilai-nilai Islam. Siswa belajar kaligrafi Arab, seni lukis Islam, nasyid, dan produksi konten kreatif.</p><p>Kegiatan unggulan:</p><ul><li>Lomba kaligrafi tingkat nasional</li><li>Pentas nasyid tahunan</li><li>Pameran seni siswa</li><li>Workshop seni dari praktisi</li></ul>',
 'palette', false, 'published', 5);

-- Link programs to units
INSERT INTO unit_programs (unit_id, program_id) VALUES
('a0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000001'),
('a0000000-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000001'),
('a0000000-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000002'),
('a0000000-0000-0000-0000-000000000003', 'c0000000-0000-0000-0000-000000000001'),
('a0000000-0000-0000-0000-000000000003', 'c0000000-0000-0000-0000-000000000002'),
('a0000000-0000-0000-0000-000000000003', 'c0000000-0000-0000-0000-000000000003'),
('a0000000-0000-0000-0000-000000000003', 'c0000000-0000-0000-0000-000000000004'),
('a0000000-0000-0000-0000-000000000003', 'c0000000-0000-0000-0000-000000000005'),
('a0000000-0000-0000-0000-000000000004', 'c0000000-0000-0000-0000-000000000001'),
('a0000000-0000-0000-0000-000000000004', 'c0000000-0000-0000-0000-000000000002'),
('a0000000-0000-0000-0000-000000000004', 'c0000000-0000-0000-0000-000000000003'),
('a0000000-0000-0000-0000-000000000004', 'c0000000-0000-0000-0000-000000000004'),
('a0000000-0000-0000-0000-000000000004', 'c0000000-0000-0000-0000-000000000005');

-- 8. Events / Agenda (5 events)
DELETE FROM events;

INSERT INTO events (id, unit_id, title, slug, description, event_date, end_date, location, status) VALUES
('d0000000-0000-0000-0000-000000000001', NULL,
 'Pawai Karnaval Kemerdekaan RI ke-80',
 'pawai-karnaval-kemerdekaan-ri-80',
 'Seluruh siswa Cinta Madani berpawai merayakan HUT RI ke-80 dari kampus TK hingga SMA.',
 '2025-08-17T07:00:00Z', '2025-08-17T11:00:00Z', 'Jl. Pendidikan Islam & Sekitar Kebayoran Baru', 'published'),

('d0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000003',
 'Lomba Olimpiade Matematika Antar Sekolah',
 'lomba-olimpiade-matematika-antar-sekolah',
 'SMP Cinta Madani menjadi tuan rumah Olimpiade Matematika tingkat kabupaten.',
 '2025-09-20T08:00:00Z', '2025-09-20T15:00:00Z', 'Aula SMP Cinta Madani', 'published'),

('d0000000-0000-0000-0000-000000000003', NULL,
 'Pentas Seni dan Budaya Islam 2025',
 'pentas-seni-budaya-islam-2025',
 'Pentas tahunan seni kaligrafi, nasyid, dan drama islami dari seluruh unit pendidikan.',
 '2025-11-15T09:00:00Z', '2025-11-15T16:00:00Z', 'Lapangan Utama Yayasan Cinta Madani', 'published'),

('d0000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000004',
 'Seminar Pendidikan: Masa Depan Pendidikan Islam',
 'seminar-pendidikan-masa-depan-pendidikan-islam',
 'Seminar nasional bersama pendidik dan akademisi tentang arah pendidikan Islam di Indonesia.',
 '2025-10-05T08:00:00Z', '2025-10-05T12:00:00Z', 'Auditorium SMA Cinta Madani', 'published'),

('d0000000-0000-0000-0000-000000000005', NULL,
 'Study Tour & Outbound 2025',
 'study-tour-outbound-2025',
 'Kegiatan study tour dan outbound tahunan untuk siswa SMP dan SMA.',
 '2025-12-10T06:00:00Z', '2025-12-12T17:00:00Z', 'Taman Pendidikan Alam, Bogor', 'published');

-- 9. Achievements (5 achievements)
DELETE FROM achievements;

INSERT INTO achievements (id, unit_id, title, description, student_or_team, level, year, category, featured) VALUES
('e0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000002',
 'Juara 2 Olimpiade Sains Tingkat Provinsi',
 'Muhammad Rizki (Kelas 5B) meraih juara 2 dalam Olimpiade Sains tingkat Provinsi DKI Jakarta bidang Matematika.',
 'Muhammad Rizki', 'Provinsi', 2025, 'Akademik', true),

('e0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000003',
 'Juara 1 Festival Nasyid Tingkat Nasional',
 'Tim nasyid SMP Cinta Madani "Suara Hati" menjuarai Festival Nasyid Nasional di Bandung.',
 'Tim Nasyid Suara Hati', 'Nasional', 2025, 'Seni & Budaya', true),

('e0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000004',
 'Siswa SMA Cinta Madani Diterima UI & ITB',
 '7 siswa SMA Cinta Madani diterima di Universitas Indonesia dan ITB melalui jalur SNBP 2025.',
 '7 Siswa Angkatan 2025', 'Nasional', 2025, 'Akademik', true),

('e0000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000002',
 'Juara 3 Lomba Kaligrafi Tingkat Nasional',
 'Aisyah Putri (Kelas 4) meraih juara 3 Lomba Kaligrafi Nasional tingkat SD.',
 'Aisyah Putri', 'Nasional', 2024, 'Seni & Budaya', false),

('e0000000-0000-0000-0000-000000000005', NULL,
 'Akreditasi A untuk Seluruh Unit Pendidikan',
 'Keempat unit pendidikan Cinta Madani memperoleh Akreditasi A dari BAN-SM.',
 'Seluruh Unit', 'Nasional', 2024, 'Akademik', false);

-- 10. Gallery Albums (3 albums)
DELETE FROM gallery_items;
DELETE FROM media WHERE folder = 'gallery';
DELETE FROM gallery_albums;

INSERT INTO gallery_albums (id, unit_id, title, slug, description, cover_url, event_date, status) VALUES
('f0000000-0000-0000-0000-000000000001', NULL,
 'Resepsi Tahun Ajaran Baru 2025', 'resepsi-tahun-ajar-baru-2025',
 'Dokumentasi upacara pembukaan tahun ajaran baru 2025/2026.',
 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=800&q=80',
 '2025-07-14', 'published'),

('f0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000003',
 'Bakti Sosial SMP ke Panti Asuhan', 'bakti-sosial-smp-panti-asuhan',
 'Kegiatan bakti sosial siswa SMP Cinta Madani ke Panti Asuhan Yatim Aisyiyah.',
 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800&q=80',
 '2025-07-05', 'published'),

('f0000000-0000-0000-0000-000000000003', NULL,
 'Camp Leadership & Outbound 2024', 'camp-leadership-outbound-2024',
 'Kegiatan camping dan outbound tahunan untuk siswa SMP dan SMA.',
 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800&q=80',
 '2024-11-20', 'published');

-- 11. PPDB Periods
DELETE FROM ppdb_faqs;
DELETE FROM ppdb_requirements;
DELETE FROM ppdb_periods;

INSERT INTO ppdb_periods (id, unit_id, academic_year, title, description, status, start_date, end_date, contact_name, contact_phone, contact_email) VALUES
('g0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001',
 '2025/2026', 'PPDB TK Cinta Madani 2025/2026',
 'Pendaftaran Taman Kanak-kanak Cinta Madani untuk tahun ajaran 2025/2026.',
 'open', '2025-01-01', '2025-03-31',
 'Ibu Siti Nurhaliza', '0812-3456-7890', 'ppdb-tk@cintamadani.sch.id'),

('g0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000002',
 '2025/2026', 'PPDB SD Cinta Madani 2025/2026',
 'Pendaftaran Sekolah Dasar Cinta Madani untuk tahun ajaran 2025/2026.',
 'open', '2025-01-01', '2025-03-31',
 'Bapak Ahmad Dahlan', '0812-3456-7891', 'ppdb-sd@cintamadani.sch.id'),

('g0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000003',
 '2025/2026', 'PPDB SMP Cinta Madani 2025/2026',
 'Pendaftaran Sekolah Menengah Pertama Cinta Madani untuk tahun ajaran 2025/2026.',
 'open', '2025-01-01', '2025-03-31',
 'Ibu Kartini', '0812-3456-7892', 'ppdb-smp@cintamadani.sch.id'),

('g0000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000004',
 '2025/2026', 'PPDB SMA Cinta Madani 2025/2026',
 'Pendaftaran Sekolah Menengah Atas Cinta Madani untuk tahun ajaran 2025/2026.',
 'open', '2025-01-01', '2025-03-31',
 'Bapak Ki Hajar Dewantara', '0812-3456-7893', 'ppdb-sma@cintamadani.sch.id');

-- PPDB Requirements
INSERT INTO ppdb_requirements (ppdb_period_id, title, description, sort_order) VALUES
('g0000000-0000-0000-0000-000000000001', 'Akta Kelahiran', 'Fotokopi akta kelahiran anak', 1),
('g0000000-0000-0000-0000-000000000001', 'Kartu Keluarga', 'Fotokopi KK terbaru', 2),
('g0000000-0000-0000-0000-000000000001', 'Surat Keterangan Sehat', 'Surat keterangan sehat dari dokter', 3),
('g0000000-0000-0000-0000-000000000002', 'Akta Kelahiran', 'Fotokopi akta kelahiran anak', 1),
('g0000000-0000-0000-0000-000000000002', 'Kartu Keluarga', 'Fotokopi KK terbaru', 2),
('g0000000-0000-0000-0000-000000000002', 'Ijazah TK', 'Fotokopi ijazah TK (jika ada)', 3),
('g0000000-0000-0000-0000-000000000002', 'Surat Keterangan Sehat', 'Surat keterangan sehat dari dokter', 4),
('g0000000-0000-0000-0000-000000000003', 'Akta Kelahiran', 'Fotokopi akta kelahiran', 1),
('g0000000-0000-0000-0000-000000000003', 'Ijazah SD', 'Fotokopi ijazah SD yang dilegalisir', 2),
('g0000000-0000-0000-0000-000000000003', 'SKHUN', 'Fotokopi SKHUN SD', 3),
('g0000000-0000-0000-0000-000000000003', 'Surat Keterangan Sehat', 'Surat keterangan sehat dari dokter', 4),
('g0000000-0000-0000-0000-000000000004', 'Akta Kelahiran', 'Fotokopi akta kelahiran', 1),
('g0000000-0000-0000-0000-000000000004', 'Ijazah SMP', 'Fotokopi ijazah SMP yang dilegalisir', 2),
('g0000000-0000-0000-0000-000000000004', 'SKHUN', 'Fotokopi SKHUN SMP', 3),
('g0000000-0000-0000-0000-000000000004', 'Surat Keterangan Sehat', 'Surat keterangan sehat dari dokter', 4),
('g0000000-0000-0000-0000-000000000004', 'Rapor SMP', 'Fotokopi rapor semester 1-5', 5);

-- PPDB FAQs
INSERT INTO ppdb_faqs (ppdb_period_id, question, answer, sort_order) VALUES
('g0000000-0000-0000-0000-000000000002', 'Kapan pendaftaran dibuka?',
 'Pendaftaran dibuka mulai 1 Januari hingga 31 Maret 2025.', 1),
('g0000000-0000-0000-0000-000000000002', 'Bagaimana proses seleksinya?',
 'Seleksi terdiri dari ujian tertulis (Matematika & Bahasa Indonesia), tes wawancara siswa & orang tua, dan observasi karakter.', 2),
('g0000000-0000-0000-0000-000000000002', 'Berapa biaya pendaftaran?',
 'Biaya pendaftaran dan formulir sebesar Rp 250.000. Biaya SPP dan biaya pendidikan lainnya dapat dilihat di brosur resmi.', 3),
('g0000000-0000-0000-0000-000000000003', 'Apakah ada program beasiswa?',
 'Ya, Cinta Madani menyediakan beasiswa prestasi dan beasiswa kebutuhan ekonomi untuk siswa berprestasi dari keluarga kurang mampu.', 1),
('g0000000-0000-0000-0000-000000000003', 'Apakah ada kegiatan ekstrakurikuler?',
 'Ya, tersedia Tahfidz Al-Qur''an, Sains & Robotika, Bahasa Arab & Inggris, Pramuka, Futsal, Kaligrafi, dan lainnya.', 2);

-- DEV SEED END
