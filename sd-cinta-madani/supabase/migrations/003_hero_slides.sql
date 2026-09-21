-- ============================================================================
-- Migration: 003_hero_slides
-- Hero slideshow CMS table for Yayasan Cinta Madani
-- ============================================================================

-- 1. TABLE
CREATE TABLE hero_slides (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text,
  description text,
  image_url text NOT NULL,
  image_alt text,
  image_position text NOT NULL DEFAULT 'center' CHECK (image_position IN ('center', 'top', 'bottom', 'left', 'right')),
  duration integer NOT NULL DEFAULT 5000,
  sort_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  cta_label text,
  cta_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 2. INDEXES
CREATE INDEX idx_hero_slides_active_sort ON hero_slides(is_active, sort_order);

-- 3. ENABLE RLS
ALTER TABLE hero_slides ENABLE ROW LEVEL SECURITY;

-- 4. RLS POLICIES
-- Public: read active slides
CREATE POLICY "hero_slides_select_public" ON hero_slides
  FOR SELECT USING (is_active = true);

-- Editor: full access
CREATE POLICY "hero_slides_select_editor" ON hero_slides
  FOR SELECT USING (is_editor());

CREATE POLICY "hero_slides_insert_editor" ON hero_slides
  FOR INSERT WITH CHECK (is_editor());

CREATE POLICY "hero_slides_update_editor" ON hero_slides
  FOR UPDATE USING (is_editor());

CREATE POLICY "hero_slides_delete_super_admin" ON hero_slides
  FOR DELETE USING (is_super_admin());

-- 5. UPDATED_AT TRIGGER
CREATE TRIGGER set_updated_at BEFORE UPDATE ON hero_slides
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

-- 6. SEED: temporary Unsplash placeholders for development
INSERT INTO hero_slides (title, description, image_url, image_alt, image_position, duration, sort_order, is_active) VALUES
  (
    'Pembelajaran Al-Quran',
    'Menumbuhkan generasi yang cinta Al-Quran dan Sunnah.',
    'https://images.unsplash.com/photo-1564981797816-1043664bf78d?w=1920&h=1080&fit=crop&crop=center',
    'Siswa sedang membaca Al-Quran',
    'center',
    6000,
    1,
    true
  ),
  (
    'Aktivitas Kelas',
    'Lingkungan belajar yang nyaman dan inspiratif.',
    'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1920&h=1080&fit=crop&crop=center',
    'Kegiatan belajar mengajar di kelas',
    'center',
    6000,
    2,
    true
  ),
  (
    'Sains & Robotika',
    'Mengembangkan potensi STEM sejak dini.',
    'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?w=1920&h=1080&fit=crop&crop=center',
    'Siswa praktik sains dan robotika',
    'center',
    6000,
    3,
    true
  ),
  (
    'Kegiatan Sekolah',
    'Momen kebersamaan yang membentuk karakter.',
    'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=1920&h=1080&fit=crop&crop=center',
    'Kegiatan ekstrakurikuler siswa',
    'center',
    6000,
    4,
    true
  ),
  (
    'Guru & Siswa',
    'Pendidikan yang berpusat pada kasih sayang.',
    'https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=1920&h=1080&fit=crop&crop=center',
    'Interaksi guru dan siswa',
    'center',
    6000,
    5,
    true
  );
