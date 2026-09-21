-- ============================================================================
-- Migration: 001_initial_schema
-- Website Yayasan Cinta Madani — Full schema per PRD.md §11 ERD
-- ============================================================================

-- ============================================================================
-- 1. TABLES
-- ============================================================================

-- 1.1 profiles
CREATE TABLE profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text,
  avatar_url text,
  role text NOT NULL DEFAULT 'editor' CHECK (role IN ('super_admin', 'editor')),
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 1.2 site_settings
CREATE TABLE site_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  school_name text,
  tagline text,
  description text,
  logo_url text,
  logo_light_url text,
  logo_dark_url text,
  favicon_url text,
  email text,
  phone text,
  whatsapp text,
  address text,
  maps_url text,
  social_links jsonb DEFAULT '{}',
  seo_defaults jsonb DEFAULT '{}',
  footer_content jsonb DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 1.3 navigation_items
CREATE TABLE navigation_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  label text NOT NULL,
  url text NOT NULL,
  parent_id uuid REFERENCES navigation_items(id) ON DELETE SET NULL,
  sort_order integer NOT NULL DEFAULT 0,
  is_visible boolean NOT NULL DEFAULT true,
  open_new_tab boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 1.4 pages
CREATE TABLE pages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  page_key text UNIQUE NOT NULL,
  description text,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  seo_title text,
  seo_description text,
  og_image_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 1.5 page_sections
CREATE TABLE page_sections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id uuid NOT NULL REFERENCES pages(id) ON DELETE CASCADE,
  section_key text NOT NULL,
  title text,
  subtitle text,
  description text,
  content jsonb DEFAULT '{}',
  is_visible boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 1.6 education_units
CREATE TABLE education_units (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  short_description text,
  description text,
  logo_url text,
  hero_image_url text,
  address text,
  phone text,
  email text,
  maps_url text,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 1.7 unit_facilities [PROPOSED — finalisasi但需 stakeholder confirmation]
CREATE TABLE unit_facilities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  unit_id uuid NOT NULL REFERENCES education_units(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  icon text,
  image_url text,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 1.8 staff [PROPOSED — finalisasi但需 stakeholder confirmation]
CREATE TABLE staff (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  unit_id uuid REFERENCES education_units(id) ON DELETE SET NULL,
  full_name text NOT NULL,
  position text NOT NULL,
  photo_url text,
  bio text,
  sort_order integer NOT NULL DEFAULT 0,
  is_visible boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 1.9 programs
CREATE TABLE programs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  excerpt text,
  content jsonb DEFAULT '{}',
  image_url text,
  icon text,
  featured boolean NOT NULL DEFAULT false,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 1.10 unit_programs (many-to-many)
CREATE TABLE unit_programs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  unit_id uuid NOT NULL REFERENCES education_units(id) ON DELETE CASCADE,
  program_id uuid NOT NULL REFERENCES programs(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(unit_id, program_id)
);

-- 1.11 news_categories
CREATE TABLE news_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 1.12 news_tags
CREATE TABLE news_tags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 1.13 news
CREATE TABLE news (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  unit_id uuid REFERENCES education_units(id) ON DELETE SET NULL,
  category_id uuid REFERENCES news_categories(id) ON DELETE SET NULL,
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  excerpt text,
  content jsonb DEFAULT '{}',
  cover_image_url text,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  featured boolean NOT NULL DEFAULT false,
  author_id uuid NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
  published_at timestamptz,
  scheduled_at timestamptz,
  seo_title text,
  seo_description text,
  og_image_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 1.14 news_tag_relations
CREATE TABLE news_tag_relations (
  news_id uuid NOT NULL REFERENCES news(id) ON DELETE CASCADE,
  tag_id uuid NOT NULL REFERENCES news_tags(id) ON DELETE CASCADE,
  PRIMARY KEY (news_id, tag_id)
);

-- 1.15 events
CREATE TABLE events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  unit_id uuid REFERENCES education_units(id) ON DELETE SET NULL,
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  cover_image_url text,
  event_date timestamptz NOT NULL,
  end_date timestamptz,
  location text,
  registration_url text,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 1.16 achievements
CREATE TABLE achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  unit_id uuid REFERENCES education_units(id) ON DELETE SET NULL,
  title text NOT NULL,
  description text,
  student_or_team text,
  level text,
  year integer NOT NULL,
  category text,
  image_url text,
  featured boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 1.17 gallery_albums
CREATE TABLE gallery_albums (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  unit_id uuid REFERENCES education_units(id) ON DELETE SET NULL,
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  cover_url text,
  event_date date,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 1.18 media
CREATE TABLE media (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  file_name text NOT NULL,
  storage_path text NOT NULL,
  public_url text NOT NULL,
  mime_type text NOT NULL,
  file_size integer,
  width integer,
  height integer,
  alt_text text,
  caption text,
  folder text,
  uploaded_by uuid NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 1.19 gallery_items
CREATE TABLE gallery_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  album_id uuid NOT NULL REFERENCES gallery_albums(id) ON DELETE CASCADE,
  media_id uuid NOT NULL REFERENCES media(id) ON DELETE CASCADE,
  caption text,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 1.20 ppdb_periods
CREATE TABLE ppdb_periods (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  unit_id uuid NOT NULL REFERENCES education_units(id) ON DELETE CASCADE,
  academic_year text NOT NULL,
  title text NOT NULL,
  description text,
  status text NOT NULL DEFAULT 'coming_soon' CHECK (status IN ('coming_soon', 'open', 'closed')),
  registration_url text,
  contact_name text,
  contact_phone text,
  contact_email text,
  start_date date NOT NULL,
  end_date date NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 1.21 ppdb_requirements
CREATE TABLE ppdb_requirements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ppdb_period_id uuid NOT NULL REFERENCES ppdb_periods(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 1.22 ppdb_faqs
CREATE TABLE ppdb_faqs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ppdb_period_id uuid NOT NULL REFERENCES ppdb_periods(id) ON DELETE CASCADE,
  question text NOT NULL,
  answer text NOT NULL,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 1.23 downloads
CREATE TABLE downloads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  unit_id uuid REFERENCES education_units(id) ON DELETE SET NULL,
  title text NOT NULL,
  description text,
  file_url text NOT NULL,
  file_type text,
  file_size integer,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 1.24 contact_messages
CREATE TABLE contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  subject text NOT NULL,
  message text NOT NULL,
  status text NOT NULL DEFAULT 'unread' CHECK (status IN ('unread', 'read', 'replied', 'archived')),
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 1.25 audit_logs
CREATE TABLE audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
  action text NOT NULL,
  entity_type text NOT NULL,
  entity_id uuid,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now()
);

-- ============================================================================
-- 2. INDEXES
-- ============================================================================

-- Foreign key indexes for frequent joins
CREATE INDEX idx_page_sections_page_id ON page_sections(page_id);
CREATE INDEX idx_unit_facilities_unit_id ON unit_facilities(unit_id);
CREATE INDEX idx_staff_unit_id ON staff(unit_id);
CREATE INDEX idx_unit_programs_unit_id ON unit_programs(unit_id);
CREATE INDEX idx_unit_programs_program_id ON unit_programs(program_id);
CREATE INDEX idx_news_unit_id ON news(unit_id);
CREATE INDEX idx_news_category_id ON news(category_id);
CREATE INDEX idx_news_author_id ON news(author_id);
CREATE INDEX idx_news_tag_relations_news_id ON news_tag_relations(news_id);
CREATE INDEX idx_news_tag_relations_tag_id ON news_tag_relations(tag_id);
CREATE INDEX idx_events_unit_id ON events(unit_id);
CREATE INDEX idx_achievements_unit_id ON achievements(unit_id);
CREATE INDEX idx_gallery_albums_unit_id ON gallery_albums(unit_id);
CREATE INDEX idx_gallery_items_album_id ON gallery_items(album_id);
CREATE INDEX idx_gallery_items_media_id ON gallery_items(media_id);
CREATE INDEX idx_media_uploaded_by ON media(uploaded_by);
CREATE INDEX idx_ppdb_periods_unit_id ON ppdb_periods(unit_id);
CREATE INDEX idx_ppdb_requirements_ppdb_period_id ON ppdb_requirements(ppdb_period_id);
CREATE INDEX idx_ppdb_faqs_ppdb_period_id ON ppdb_faqs(ppdb_period_id);
CREATE INDEX idx_downloads_unit_id ON downloads(unit_id);
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);

-- Status + date indexes for common queries
CREATE INDEX idx_news_status_published_at ON news(status, published_at DESC);
CREATE INDEX idx_events_status_event_date ON events(status, event_date);
CREATE INDEX idx_education_units_status_sort ON education_units(status, sort_order);
CREATE INDEX idx_programs_status_sort ON programs(status, sort_order);
CREATE INDEX idx_gallery_albums_status ON gallery_albums(status);
CREATE INDEX idx_pages_status ON pages(status);
CREATE INDEX idx_ppdb_periods_status ON ppdb_periods(status);

-- ============================================================================
-- 3. ENABLE RLS ON EVERY TABLE
-- ============================================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE navigation_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE education_units ENABLE ROW LEVEL SECURITY;
ALTER TABLE unit_facilities ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE unit_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE news_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE news_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE news ENABLE ROW LEVEL SECURITY;
ALTER TABLE news_tag_relations ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_albums ENABLE ROW LEVEL SECURITY;
ALTER TABLE media ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE ppdb_periods ENABLE ROW LEVEL SECURITY;
ALTER TABLE ppdb_requirements ENABLE ROW LEVEL SECURITY;
ALTER TABLE ppdb_faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE downloads ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- 4. RLS POLICIES
-- ============================================================================

-- Helper function: check if current user is super_admin
CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS boolean AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'super_admin' AND is_active = true
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Helper function: check if current user is editor (or super_admin)
CREATE OR REPLACE FUNCTION public.is_editor()
RETURNS boolean AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role IN ('super_admin', 'editor') AND is_active = true
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- --------------------------------------------------------------------------
-- 4.1 profiles
-- --------------------------------------------------------------------------
CREATE POLICY "profiles_select_own" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "profiles_select_admin" ON profiles
  FOR SELECT USING (is_super_admin());

CREATE POLICY "profiles_update_own" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "profiles_update_super_admin" ON profiles
  FOR UPDATE USING (is_super_admin());

CREATE POLICY "profiles_insert_own" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- --------------------------------------------------------------------------
-- 4.2 site_settings
-- --------------------------------------------------------------------------
CREATE POLICY "site_settings_select_public" ON site_settings
  FOR SELECT USING (true);

CREATE POLICY "site_settings_all_super_admin" ON site_settings
  FOR ALL USING (is_super_admin());

-- --------------------------------------------------------------------------
-- 4.3 navigation_items
-- --------------------------------------------------------------------------
CREATE POLICY "navigation_items_select_public" ON navigation_items
  FOR SELECT USING (is_visible = true);

CREATE POLICY "navigation_items_all_super_admin" ON navigation_items
  FOR ALL USING (is_super_admin());

-- --------------------------------------------------------------------------
-- 4.4 pages
-- --------------------------------------------------------------------------
CREATE POLICY "pages_select_published" ON pages
  FOR SELECT USING (status = 'published');

CREATE POLICY "pages_select_editor" ON pages
  FOR SELECT USING (is_editor());

CREATE POLICY "pages_insert_editor" ON pages
  FOR INSERT WITH CHECK (is_editor());

CREATE POLICY "pages_update_editor" ON pages
  FOR UPDATE USING (is_editor());

CREATE POLICY "pages_delete_super_admin" ON pages
  FOR DELETE USING (is_super_admin());

-- --------------------------------------------------------------------------
-- 4.5 page_sections
-- --------------------------------------------------------------------------
CREATE POLICY "page_sections_select_published" ON page_sections
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM pages WHERE pages.id = page_sections.page_id AND pages.status = 'published')
  );

CREATE POLICY "page_sections_select_editor" ON page_sections
  FOR SELECT USING (is_editor());

CREATE POLICY "page_sections_insert_editor" ON page_sections
  FOR INSERT WITH CHECK (is_editor());

CREATE POLICY "page_sections_update_editor" ON page_sections
  FOR UPDATE USING (is_editor());

CREATE POLICY "page_sections_delete_super_admin" ON page_sections
  FOR DELETE USING (is_super_admin());

-- --------------------------------------------------------------------------
-- 4.6 education_units
-- --------------------------------------------------------------------------
CREATE POLICY "education_units_select_published" ON education_units
  FOR SELECT USING (status = 'published');

CREATE POLICY "education_units_select_editor" ON education_units
  FOR SELECT USING (is_editor());

CREATE POLICY "education_units_insert_super_admin" ON education_units
  FOR INSERT WITH CHECK (is_super_admin());

CREATE POLICY "education_units_update_editor" ON education_units
  FOR UPDATE USING (is_editor());

CREATE POLICY "education_units_delete_super_admin" ON education_units
  FOR DELETE USING (is_super_admin());

-- --------------------------------------------------------------------------
-- 4.7 unit_facilities
-- --------------------------------------------------------------------------
CREATE POLICY "unit_facilities_select_published" ON unit_facilities
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM education_units WHERE education_units.id = unit_facilities.unit_id AND education_units.status = 'published')
  );

CREATE POLICY "unit_facilities_select_editor" ON unit_facilities
  FOR SELECT USING (is_editor());

CREATE POLICY "unit_facilities_insert_editor" ON unit_facilities
  FOR INSERT WITH CHECK (is_editor());

CREATE POLICY "unit_facilities_update_editor" ON unit_facilities
  FOR UPDATE USING (is_editor());

CREATE POLICY "unit_facilities_delete_super_admin" ON unit_facilities
  FOR DELETE USING (is_super_admin());

-- --------------------------------------------------------------------------
-- 4.8 staff
-- --------------------------------------------------------------------------
CREATE POLICY "staff_select_public" ON staff
  FOR SELECT USING (is_visible = true);

CREATE POLICY "staff_select_editor" ON staff
  FOR SELECT USING (is_editor());

CREATE POLICY "staff_insert_editor" ON staff
  FOR INSERT WITH CHECK (is_editor());

CREATE POLICY "staff_update_editor" ON staff
  FOR UPDATE USING (is_editor());

CREATE POLICY "staff_delete_super_admin" ON staff
  FOR DELETE USING (is_super_admin());

-- --------------------------------------------------------------------------
-- 4.9 programs
-- --------------------------------------------------------------------------
CREATE POLICY "programs_select_published" ON programs
  FOR SELECT USING (status = 'published');

CREATE POLICY "programs_select_editor" ON programs
  FOR SELECT USING (is_editor());

CREATE POLICY "programs_insert_editor" ON programs
  FOR INSERT WITH CHECK (is_editor());

CREATE POLICY "programs_update_editor" ON programs
  FOR UPDATE USING (is_editor());

CREATE POLICY "programs_delete_super_admin" ON programs
  FOR DELETE USING (is_super_admin());

-- --------------------------------------------------------------------------
-- 4.10 unit_programs
-- --------------------------------------------------------------------------
CREATE POLICY "unit_programs_select_published" ON unit_programs
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM education_units WHERE education_units.id = unit_programs.unit_id AND education_units.status = 'published')
  );

CREATE POLICY "unit_programs_select_editor" ON unit_programs
  FOR SELECT USING (is_editor());

CREATE POLICY "unit_programs_insert_editor" ON unit_programs
  FOR INSERT WITH CHECK (is_editor());

CREATE POLICY "unit_programs_delete_editor" ON unit_programs
  FOR DELETE USING (is_editor());

-- --------------------------------------------------------------------------
-- 4.11 news_categories
-- --------------------------------------------------------------------------
CREATE POLICY "news_categories_select_public" ON news_categories
  FOR SELECT USING (true);

CREATE POLICY "news_categories_select_editor" ON news_categories
  FOR SELECT USING (is_editor());

CREATE POLICY "news_categories_insert_editor" ON news_categories
  FOR INSERT WITH CHECK (is_editor());

CREATE POLICY "news_categories_update_editor" ON news_categories
  FOR UPDATE USING (is_editor());

CREATE POLICY "news_categories_delete_super_admin" ON news_categories
  FOR DELETE USING (is_super_admin());

-- --------------------------------------------------------------------------
-- 4.12 news_tags
-- --------------------------------------------------------------------------
CREATE POLICY "news_tags_select_public" ON news_tags
  FOR SELECT USING (true);

CREATE POLICY "news_tags_select_editor" ON news_tags
  FOR SELECT USING (is_editor());

CREATE POLICY "news_tags_insert_editor" ON news_tags
  FOR INSERT WITH CHECK (is_editor());

CREATE POLICY "news_tags_delete_editor" ON news_tags
  FOR DELETE USING (is_editor());

-- --------------------------------------------------------------------------
-- 4.13 news
-- --------------------------------------------------------------------------
CREATE POLICY "news_select_published" ON news
  FOR SELECT USING (
    status = 'published'
    AND published_at IS NOT NULL
    AND published_at <= now()
  );

CREATE POLICY "news_select_editor" ON news
  FOR SELECT USING (is_editor());

CREATE POLICY "news_insert_editor" ON news
  FOR INSERT WITH CHECK (is_editor());

CREATE POLICY "news_update_editor" ON news
  FOR UPDATE USING (is_editor());

CREATE POLICY "news_delete_super_admin" ON news
  FOR DELETE USING (is_super_admin());

-- --------------------------------------------------------------------------
-- 4.14 news_tag_relations
-- --------------------------------------------------------------------------
CREATE POLICY "news_tag_relations_select_published" ON news_tag_relations
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM news WHERE news.id = news_tag_relations.news_id AND news.status = 'published')
  );

CREATE POLICY "news_tag_relations_select_editor" ON news_tag_relations
  FOR SELECT USING (is_editor());

CREATE POLICY "news_tag_relations_insert_editor" ON news_tag_relations
  FOR INSERT WITH CHECK (is_editor());

CREATE POLICY "news_tag_relations_delete_editor" ON news_tag_relations
  FOR DELETE USING (is_editor());

-- --------------------------------------------------------------------------
-- 4.15 events
-- --------------------------------------------------------------------------
CREATE POLICY "events_select_published" ON events
  FOR SELECT USING (status = 'published');

CREATE POLICY "events_select_editor" ON events
  FOR SELECT USING (is_editor());

CREATE POLICY "events_insert_editor" ON events
  FOR INSERT WITH CHECK (is_editor());

CREATE POLICY "events_update_editor" ON events
  FOR UPDATE USING (is_editor());

CREATE POLICY "events_delete_super_admin" ON events
  FOR DELETE USING (is_super_admin());

-- --------------------------------------------------------------------------
-- 4.16 achievements
-- --------------------------------------------------------------------------
CREATE POLICY "achievements_select_public" ON achievements
  FOR SELECT USING (true);

CREATE POLICY "achievements_select_editor" ON achievements
  FOR SELECT USING (is_editor());

CREATE POLICY "achievements_insert_editor" ON achievements
  FOR INSERT WITH CHECK (is_editor());

CREATE POLICY "achievements_update_editor" ON achievements
  FOR UPDATE USING (is_editor());

CREATE POLICY "achievements_delete_super_admin" ON achievements
  FOR DELETE USING (is_super_admin());

-- --------------------------------------------------------------------------
-- 4.17 gallery_albums
-- --------------------------------------------------------------------------
CREATE POLICY "gallery_albums_select_published" ON gallery_albums
  FOR SELECT USING (status = 'published');

CREATE POLICY "gallery_albums_select_editor" ON gallery_albums
  FOR SELECT USING (is_editor());

CREATE POLICY "gallery_albums_insert_editor" ON gallery_albums
  FOR INSERT WITH CHECK (is_editor());

CREATE POLICY "gallery_albums_update_editor" ON gallery_albums
  FOR UPDATE USING (is_editor());

CREATE POLICY "gallery_albums_delete_super_admin" ON gallery_albums
  FOR DELETE USING (is_super_admin());

-- --------------------------------------------------------------------------
-- 4.18 media
-- --------------------------------------------------------------------------
CREATE POLICY "media_select_editor" ON media
  FOR SELECT USING (is_editor());

CREATE POLICY "media_insert_editor" ON media
  FOR INSERT WITH CHECK (is_editor());

CREATE POLICY "media_delete_editor" ON media
  FOR DELETE USING (is_editor());

-- --------------------------------------------------------------------------
-- 4.19 gallery_items
-- --------------------------------------------------------------------------
CREATE POLICY "gallery_items_select_published" ON gallery_items
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM gallery_albums WHERE gallery_albums.id = gallery_items.album_id AND gallery_albums.status = 'published')
  );

CREATE POLICY "gallery_items_select_editor" ON gallery_items
  FOR SELECT USING (is_editor());

CREATE POLICY "gallery_items_insert_editor" ON gallery_items
  FOR INSERT WITH CHECK (is_editor());

CREATE POLICY "gallery_items_delete_editor" ON gallery_items
  FOR DELETE USING (is_editor());

-- --------------------------------------------------------------------------
-- 4.20 ppdb_periods
-- --------------------------------------------------------------------------
CREATE POLICY "ppdb_periods_select_public" ON ppdb_periods
  FOR SELECT USING (status IN ('open', 'coming_soon'));

CREATE POLICY "ppdb_periods_select_editor" ON ppdb_periods
  FOR SELECT USING (is_editor());

CREATE POLICY "ppdb_periods_insert_super_admin" ON ppdb_periods
  FOR INSERT WITH CHECK (is_super_admin());

CREATE POLICY "ppdb_periods_update_super_admin" ON ppdb_periods
  FOR UPDATE USING (is_super_admin());

CREATE POLICY "ppdb_periods_delete_super_admin" ON ppdb_periods
  FOR DELETE USING (is_super_admin());

-- --------------------------------------------------------------------------
-- 4.21 ppdb_requirements
-- --------------------------------------------------------------------------
CREATE POLICY "ppdb_requirements_select_public" ON ppdb_requirements
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM ppdb_periods WHERE ppdb_periods.id = ppdb_requirements.ppdb_period_id AND ppdb_periods.status IN ('open', 'coming_soon'))
  );

CREATE POLICY "ppdb_requirements_select_editor" ON ppdb_requirements
  FOR SELECT USING (is_editor());

CREATE POLICY "ppdb_requirements_insert_super_admin" ON ppdb_requirements
  FOR INSERT WITH CHECK (is_super_admin());

CREATE POLICY "ppdb_requirements_update_super_admin" ON ppdb_requirements
  FOR UPDATE USING (is_super_admin());

CREATE POLICY "ppdb_requirements_delete_super_admin" ON ppdb_requirements
  FOR DELETE USING (is_super_admin());

-- --------------------------------------------------------------------------
-- 4.22 ppdb_faqs
-- --------------------------------------------------------------------------
CREATE POLICY "ppdb_faqs_select_public" ON ppdb_faqs
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM ppdb_periods WHERE ppdb_periods.id = ppdb_faqs.ppdb_period_id AND ppdb_periods.status IN ('open', 'coming_soon'))
  );

CREATE POLICY "ppdb_faqs_select_editor" ON ppdb_faqs
  FOR SELECT USING (is_editor());

CREATE POLICY "ppdb_faqs_insert_super_admin" ON ppdb_faqs
  FOR INSERT WITH CHECK (is_super_admin());

CREATE POLICY "ppdb_faqs_update_super_admin" ON ppdb_faqs
  FOR UPDATE USING (is_super_admin());

CREATE POLICY "ppdb_faqs_delete_super_admin" ON ppdb_faqs
  FOR DELETE USING (is_super_admin());

-- --------------------------------------------------------------------------
-- 4.23 downloads
-- --------------------------------------------------------------------------
CREATE POLICY "downloads_select_published" ON downloads
  FOR SELECT USING (status = 'published');

CREATE POLICY "downloads_select_editor" ON downloads
  FOR SELECT USING (is_editor());

CREATE POLICY "downloads_insert_editor" ON downloads
  FOR INSERT WITH CHECK (is_editor());

CREATE POLICY "downloads_update_editor" ON downloads
  FOR UPDATE USING (is_editor());

CREATE POLICY "downloads_delete_super_admin" ON downloads
  FOR DELETE USING (is_super_admin());

-- --------------------------------------------------------------------------
-- 4.24 contact_messages
-- --------------------------------------------------------------------------
-- Public: INSERT only (no SELECT — admin only reads)
CREATE POLICY "contact_messages_insert_anon" ON contact_messages
  FOR INSERT WITH CHECK (true);

-- Editor/Super Admin: full access
CREATE POLICY "contact_messages_select_editor" ON contact_messages
  FOR SELECT USING (is_editor());

CREATE POLICY "contact_messages_update_editor" ON contact_messages
  FOR UPDATE USING (is_editor());

CREATE POLICY "contact_messages_delete_super_admin" ON contact_messages
  FOR DELETE USING (is_super_admin());

-- --------------------------------------------------------------------------
-- 4.25 audit_logs
-- --------------------------------------------------------------------------
CREATE POLICY "audit_logs_select_super_admin" ON audit_logs
  FOR SELECT USING (is_super_admin());

CREATE POLICY "audit_logs_insert_authenticated" ON audit_logs
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- ============================================================================
-- 5. TRIGGERS — updated_at
-- ============================================================================

CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON site_settings
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON navigation_items
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON pages
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON page_sections
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON education_units
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON unit_facilities
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON staff
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON programs
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON news_categories
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON news
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON events
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON achievements
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON gallery_albums
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON ppdb_periods
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON downloads
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

-- ============================================================================
-- 6. STORAGE BUCKETS
-- ============================================================================

INSERT INTO storage.buckets (id, name, public) VALUES
  ('site-assets', 'site-assets', true),
  ('unit-assets', 'unit-assets', true),
  ('news', 'news', true),
  ('gallery', 'gallery', true),
  ('documents', 'documents', false),
  ('avatars', 'avatars', true);

-- Storage policies
CREATE POLICY "site_assets_select_public"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'site-assets');

CREATE POLICY "site_assets_insert_admin"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'site-assets' AND is_editor());

CREATE POLICY "site_assets_delete_admin"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'site-assets' AND is_editor());

CREATE POLICY "unit_assets_select_public"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'unit-assets');

CREATE POLICY "unit_assets_insert_admin"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'unit-assets' AND is_editor());

CREATE POLICY "unit_assets_delete_admin"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'unit-assets' AND is_editor());

CREATE POLICY "news_select_public"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'news');

CREATE POLICY "news_insert_admin"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'news' AND is_editor());

CREATE POLICY "news_delete_admin"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'news' AND is_editor());

CREATE POLICY "gallery_select_public"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'gallery');

CREATE POLICY "gallery_insert_admin"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'gallery' AND is_editor());

CREATE POLICY "gallery_delete_admin"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'gallery' AND is_editor());

CREATE POLICY "documents_select_admin"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'documents' AND is_editor());

CREATE POLICY "documents_insert_admin"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'documents' AND is_editor());

CREATE POLICY "documents_delete_admin"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'documents' AND is_editor());

CREATE POLICY "avatars_select_public"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

CREATE POLICY "avatars_insert_own"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "avatars_delete_own"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

-- ============================================================================
-- 6. TRIGGERS — auto-create profile on user signup
-- ============================================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role, is_active)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    COALESCE(NEW.raw_user_meta_data->>'role', 'editor'),
    true
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
