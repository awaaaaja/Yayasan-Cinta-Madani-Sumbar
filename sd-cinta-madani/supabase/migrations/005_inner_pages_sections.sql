-- ============================================================================
-- Migration: 005_inner_pages_sections
-- Seed 5 inner pages + default sections untuk SD Cinta Madani
-- ============================================================================

-- ============================================================================
-- 1. PAGES — seed 5 halaman inner
-- ============================================================================

INSERT INTO pages (title, slug, page_key, description, status) VALUES
  ('Tentang', 'tentang', 'tentang', 'Profil, visi-misi, sejarah, dan nilai-nilai SD Cinta Madani.', 'published'),
  ('Program', 'program', 'program', 'Program pendidikan unggulan SD Cinta Madani.', 'published'),
  ('Berita', 'berita', 'berita', 'Berita dan informasi terkini dari SD Cinta Madani.', 'published'),
  ('Galeri', 'galeri', 'galeri', 'Galeri kegiatan dan momen SD Cinta Madani.', 'published'),
  ('Agenda', 'agenda', 'agenda', 'Agenda dan kegiatan mendatang SD Cinta Madani.', 'published')
ON CONFLICT (page_key) DO NOTHING;

-- Also seed homepage if not exists
INSERT INTO pages (title, slug, page_key, description, status) VALUES
  ('Beranda', '/', 'home', 'Website resmi SD Cinta Madani.', 'published')
ON CONFLICT (page_key) DO NOTHING;

-- ============================================================================
-- 2. PAGE SECTIONS — default sections per page
-- ============================================================================

-- Helper: get page_id by page_key
DO $$
DECLARE
  v_tentang_id uuid;
  v_program_id uuid;
  v_berita_id uuid;
  v_galeri_id uuid;
  v_agenda_id uuid;
  v_home_id uuid;
BEGIN
  SELECT id INTO v_tentang_id FROM pages WHERE page_key = 'tentang';
  SELECT id INTO v_program_id FROM pages WHERE page_key = 'program';
  SELECT id INTO v_berita_id FROM pages WHERE page_key = 'berita';
  SELECT id INTO v_galeri_id FROM pages WHERE page_key = 'galeri';
  SELECT id INTO v_agenda_id FROM pages WHERE page_key = 'agenda';
  SELECT id INTO v_home_id FROM pages WHERE page_key = 'home';

  -- ========== TENTANG ==========
  IF v_tentang_id IS NOT NULL THEN
    INSERT INTO page_sections (page_id, section_key, title, subtitle, description, content, sort_order) VALUES
      (v_tentang_id, 'about_hero', 'Tentang SD Cinta Madani', NULL, NULL,
       '{"heading": "Membangun Generasi Beriman, Cerdas, dan Peduli", "description": "SD Cinta Madani hadir untuk memberikan pendidikan yang mengintegrasikan keimanan, akademik, dan pengembangan karakter.", "image": ""}',
       0),
      (v_tentang_id, 'about_profile', 'Profil Lembaga', NULL, NULL,
       '{"heading": "SD Cinta Madani", "description": "<p>SD Cinta Madani adalah lembaga pendidikan dasar yang berkomitmen untuk mengembangkan potensi siswa secara holistik. Dengan kurikulum yang mengintegrasikan ilmu pengetahuan dan nilai-nilai keimanan, kami membentuk generasi yang cerdas, berkarakter, dan peduli lingkungan.</p><p>Sejak berdiri, kami telah menjadi bagian dari keluarga besar Yayasan Cinta Madani dan terus berkomitmen untuk memberikan pendidikan terbaik bagi putra-putri Anda.</p>", "image": "", "stats": [{"label": "Siswa Aktif", "value": "450+"}, {"label": "Guru & Staf", "value": "35+"}, {"label": "Program Unggulan", "value": "6"}, {"label": "Tahun Berdiri", "value": "2015"}]}',
       1),
      (v_tentang_id, 'about_values', 'Nilai-Nilai Kami', NULL, NULL,
       '{"items": [{"icon": "star", "title": "Tauhid & Akhlak", "description": "Menanamkan keimanan dan akhlak mulia sebagai fondasi karakter siswa."}, {"icon": "book-open", "title": "Ilmu & Keterampilan", "description": "Mengembangkan potensi akademik dan keterampilan hidup siswa."}, {"icon": "users", "title": "Kemandirian", "description": "Membentuk siswa yang mandiri, disiplin, dan bertanggung jawab."}, {"icon": "globe", "title": "Kepedulian Lingkungan", "description": "Menumbuhkan kepedulian terhadap sesama dan lingkungan sekitar."}]}',
       2),
      (v_tentang_id, 'about_history', 'Sejarah', NULL, 'Perjalanan SD Cinta Madani dalam memberikan pendidikan berkualitas.',
       '{"items": [{"year": "2015", "title": "Pendirian SD Cinta Madani", "description": "SD Cinta Madani didirikan sebagai bagian dari Yayasan Cinta Madani."}, {"year": "2018", "title": "Akreditasi A", "description": "Meraih akreditasi A dari Badan Akreditasi Nasional."}, {"year": "2020", "title": "Ekspansi Fasilitas", "description": "Pembangunan laboratorium sains dan perpustakaan baru."}, {"year": "2023", "title": "Program Tahfidz", "description": "Peluncuran program Tahfidz Al-Quran terstruktur."}, {"year": "2025", "title": "Prestasi Nasional", "description": "Siswa meraih prestasi di tingkat nasional dalam olimpiade sains."}]}',
       3)
    ON CONFLICT DO NOTHING;
  END IF;

  -- ========== PROGRAM ==========
  IF v_program_id IS NOT NULL THEN
    INSERT INTO page_sections (page_id, section_key, title, subtitle, description, content, sort_order) VALUES
      (v_program_id, 'program_hero', 'Program Unggulan', NULL, NULL,
       '{"heading": "Program Pendidikan Terbaik untuk Putra-Putri Anda", "description": "SD Cinta Madani menawarkan program pendidikan komprehensif yang mengintegrasikan kurikulum nasional dengan nilai-nilai keimanan.", "image": ""}',
       0),
      (v_program_id, 'program_featured', 'Program Unggulan', NULL, 'Program unggulan yang menjadi kekuatan SD Cinta Madani.',
       '{"heading": "Tahfidz Al-Quran", "description": "Program hafalan Al-Quran terstruktur dengan pendampingan ustadz berpengalaman."}',
       1),
      (v_program_id, 'program_grid', 'Semua Program', NULL, NULL,
       '{}',
       2)
    ON CONFLICT DO NOTHING;
  END IF;

  -- ========== BERITA ==========
  IF v_berita_id IS NOT NULL THEN
    INSERT INTO page_sections (page_id, section_key, title, subtitle, description, content, sort_order) VALUES
      (v_berita_id, 'news_hero', 'Berita & Informasi', NULL, NULL,
       '{"heading": "Berita Terkini SD Cinta Madani", "description": "Ikuti perkembangan terbaru, kegiatan, dan pencapaian dari SD Cinta Madani.", "image": ""}',
       0),
      (v_berita_id, 'news_featured', 'Berita Unggulan', NULL, 'Sorotan berita penting minggu ini.',
       '{"heading": "Resepsi Tahun Ajaran Baru 2025/2026", "description": "Upacara pembukaan tahun ajaran baru dihelat meriah dengan dihadiri seluruh warga sekolah dan orang tua siswa."}',
       1)
    ON CONFLICT DO NOTHING;
  END IF;

  -- ========== GALERI ==========
  IF v_galeri_id IS NOT NULL THEN
    INSERT INTO page_sections (page_id, section_key, title, subtitle, description, content, sort_order) VALUES
      (v_galeri_id, 'gallery_hero', 'Galeri Kegiatan', NULL, NULL,
       '{"heading": "Galeri Kegiatan SD Cinta Madani", "description": "Dokumentasi momen-momen berharga dalam kegiatan belajar mengajar dan ekstrakurikuler.", "image": ""}',
       0)
    ON CONFLICT DO NOTHING;
  END IF;

  -- ========== AGENDA ==========
  IF v_agenda_id IS NOT NULL THEN
    INSERT INTO page_sections (page_id, section_key, title, subtitle, description, content, sort_order) VALUES
      (v_agenda_id, 'agenda_hero', 'Agenda & Kegiatan', NULL, NULL,
       '{"heading": "Agenda Kegiatan SD Cinta Madani", "description": "Jadwal kegiatan dan acara mendatang di SD Cinta Madani.", "image": ""}',
       0),
      (v_agenda_id, 'agenda_info', 'Ringkasan', NULL, NULL,
       '{"items": [{"icon": "calendar", "label": "Acara Mendatang", "value": "5+"}, {"icon": "users", "label": "Peserta", "value": "200+"}, {"icon": "trophy", "label": "Kompetisi", "value": "3"}, {"icon": "star", "label": "Program Khusus", "value": "2"}]}',
       1)
    ON CONFLICT DO NOTHING;
  END IF;

END $$;
