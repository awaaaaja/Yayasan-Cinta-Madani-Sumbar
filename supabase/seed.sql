-- ============================================================================
-- DEV SEED, DO NOT USE IN PRODUCTION
-- Data fiktif ini HANYA untuk development/testing.
-- Jangan pernah pakai data ini sebagai konten final.
-- ============================================================================

-- 1. Site Settings (singleton)
INSERT INTO site_settings (id, school_name, tagline, description, email, phone, address)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'Yayasan Cinta Madani',
  'Menumbuhkan Generasi untuk Masa Depan',
  'Yayasan pendidikan yang berkomitmen menciptakan lingkungan belajar yang mendukung karakter, potensi, dan masa depan setiap anak.',
  'info@cintamani.or.id',
  '021-1234-5678',
  'Jl. Pendidikan No. 123, Jakarta Selatan'
);

-- 2. Navigation Items
INSERT INTO navigation_items (id, label, url, sort_order, is_visible) VALUES
  ('00000000-0000-0000-0000-000000000010', 'Beranda', '/', 1, true),
  ('00000000-0000-0000-0000-000000000011', 'Tentang', '/tentang', 2, true),
  ('00000000-0000-0000-0000-000000000012', 'Unit Pendidikan', '/unit-pendidikan', 3, true),
  ('00000000-0000-0000-0000-000000000013', 'Program', '/program', 4, true),
  ('00000000-0000-0000-0000-000000000014', 'Berita', '/berita', 5, true),
  ('00000000-0000-0000-0000-000000000015', 'Galeri', '/galeri', 6, true),
  ('00000000-0000-0000-0000-000000000016', 'Kontak', '/kontak', 7, true);

-- 3. Pages (homepage WAJIB ada agar RLS page_sections bisa di-bypass via page_key)
INSERT INTO pages (id, title, slug, page_key, description, status) VALUES
  ('00000000-0000-0000-0000-000000000020', 'Beranda', 'beranda', 'home', 'Homepage Yayasan Cinta Madani.', 'published'),
  ('00000000-0000-0000-0000-000000000021', 'Tentang Yayasan', 'tentang', 'tentang', 'Mengenal Yayasan Cinta Madani lebih dekat.', 'published'),
  ('00000000-0000-0000-0000-000000000022', 'Profil', 'tentang-profil', 'tentang-profil', 'Profil lengkap yayasan.', 'published'),
  ('00000000-0000-0000-0000-000000000023', 'Sejarah', 'tentang-sejarah', 'tentang-sejarah', 'Perjalanan dan tonggak penting yayasan.', 'published'),
  ('00000000-0000-0000-0000-000000000024', 'Visi & Misi', 'tentang-visi-misi', 'tentang-visi-misi', 'Arah dan tujuan pendidikan kami.', 'published'),
  ('00000000-0000-0000-0000-000000000025', 'Nilai', 'tentang-nilai', 'tentang-nilai', 'Prinsip yang menjadi fondasi setiap kegiatan.', 'published'),
  ('00000000-0000-0000-0000-000000000026', 'Pengurus', 'tentang-pengurus', 'tentang-pengurus', 'Tim yang menjalankan visi yayasan.', 'published');

-- 4. Page Sections (Homepage — linked to page_id 'home')
INSERT INTO page_sections (page_id, section_key, title, content, is_visible, sort_order) VALUES
  ('00000000-0000-0000-0000-000000000020', 'hero', NULL,
   '{"eyebrow": "Yayasan Cinta Madani", "headline": "Menumbuhkan Generasi untuk Masa Depan.", "description": "Lingkungan pendidikan yang mendukung karakter, potensi, dan masa depan setiap anak.", "primary_cta_label": "Kenali Yayasan", "primary_cta_url": "/tentang", "secondary_cta_label": "Jelajahi Sekolah", "secondary_cta_url": "/unit-pendidikan", "hero_image": null}',
   true, 1),
  ('00000000-0000-0000-0000-000000000020', 'statistics', NULL,
   '{"items": [{"label": "Pendidikan Bermakna"}, {"label": "Karakter"}, {"label": "Kemandirian"}, {"label": "Kepedulian"}]}',
   true, 2),
   ('00000000-0000-0000-0000-000000000020', 'about', NULL,
    '{"eyebrow": "01 / Tentang Yayasan", "heading": "Ruang untuk Bertumbuh.", "description": "Yayasan Cinta Madani berkomitmen menciptakan lingkungan pendidikan yang mendukung karakter, potensi, dan masa depan setiap anak.", "cta_label": "Baca Profil Yayasan", "cta_url": "/tentang", "primary_image": null, "secondary_image": null}',
    true, 3),
  ('00000000-0000-0000-0000-000000000020', 'values', NULL,
    '{"items": [{"number": "01", "title": "Karakter", "description": "Membentuk pribadi yang berintegritas, bertanggung jawab, dan peduli terhadap sesama."}, {"number": "02", "title": "Kemandirian", "description": "Mendorong siswa untuk mandiri, kritis, dan percaya diri dalam menghadapi tantangan."}, {"number": "03", "title": "Kepedulian", "description": "Menumbuhkan empati dan kepedulian terhadap lingkungan sosial dan alam."}, {"number": "04", "title": "Pembelajaran Bermakna", "description": "Pembelajaran yang relevan, kontekstual, dan menghubungkan pengetahuan dengan kehidupan nyata."}]}',
    true, 4),
  ('00000000-0000-0000-0000-000000000020', 'school_life', NULL,
    '{"eyebrow": "04 / Kehidupan Sekolah", "heading": "Kehidupan di Cinta Madani.", "description": "Setiap hari di Cinta Madani adalah petualangan belajar yang menyenangkan.", "images": [], "captions": []}',
    true, 7),
  ('00000000-0000-0000-0000-000000000020', 'ppdb_cta', NULL,
    '{"eyebrow": "PPDB 2026/2027", "heading": "Awali Langkah Baru Bersama Cinta Madani.", "description": "Daftarkan putra-putri Anda di unit pendidikan Cinta Madani.", "cta_label": "Lihat Informasi PPDB", "cta_url": "/ppdb"}',
    true, 12);

-- 5. News Categories
INSERT INTO news_categories (id, name, slug, description) VALUES
  ('00000000-0000-0000-0000-000000000030', 'Umum', 'umum', 'Berita umum yayasan'),
  ('00000000-0000-0000-0000-000000000031', 'Akademik', 'akademik', 'Berita akademik'),
  ('00000000-0000-0000-0000-000000000032', 'Kegiatan', 'kegiatan', 'Berita kegiatan sekolah');

-- DEV SEED END — hapus semua data di atas sebelum production launch.

-- ============================================================================
-- TEST USERS (create via Supabase Auth, then set role in profiles)
-- ============================================================================
-- To create test users, register via Supabase Auth dashboard or API:
--   1. super_admin@cintamani.or.id — role: super_admin
--   2. editor@cintamani.or.id — role: editor
-- Then manually set role in profiles table:
--   UPDATE profiles SET role = 'super_admin' WHERE id = '<user_id>';
--   UPDATE profiles SET role = 'editor' WHERE id = '<user_id>';
-- ============================================================================
