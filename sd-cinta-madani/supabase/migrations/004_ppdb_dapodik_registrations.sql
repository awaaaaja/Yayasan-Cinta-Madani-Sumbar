-- ============================================================================
-- Migration: 004_ppdb_dapodik_registrations
-- PPDB Online — Tabel pendaftaran & dokumen (Dapodik-compliant)
-- ============================================================================

-- ============================================================================
-- 0. HELPER FUNCTION
-- ============================================================================

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- 1. TABLES
-- ============================================================================

-- 1.1 ppdb_registrations
CREATE TABLE ppdb_registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  period_id uuid NOT NULL REFERENCES ppdb_periods(id) ON DELETE CASCADE,

  -- Data Siswa (Dapodik)
  nik text NOT NULL CHECK (length(nik) = 16),
  nisn text,
  full_name text NOT NULL,
  birth_place text NOT NULL,
  birth_date date NOT NULL,
  gender text NOT NULL CHECK (gender IN ('L', 'P')),
  religion text NOT NULL,
  address text NOT NULL,
  rt text,
  rw text,
  kelurahan text NOT NULL,
  kecamatan text NOT NULL,
  kabupaten text NOT NULL,
  provinsi text NOT NULL,
  kode_pos text,
  phone text,

  -- Data Orang Tua / Wali
  father_name text NOT NULL,
  father_occupation text NOT NULL,
  father_income text NOT NULL,
  mother_name text NOT NULL,
  mother_occupation text NOT NULL,
  mother_income text NOT NULL,
  guardian_name text,

  -- Asal Sekolah
  previous_school text NOT NULL,
  previous_school_npsn text,
  previous_school_address text,
  graduation_year integer NOT NULL,

  -- Status & Admin
  status text NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'verified', 'accepted', 'rejected')),
  admin_notes text,

  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 1.2 ppdb_documents
CREATE TABLE ppdb_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  registration_id uuid NOT NULL REFERENCES ppdb_registrations(id) ON DELETE CASCADE,
  document_type text NOT NULL
    CHECK (document_type IN ('birth_cert', 'family_card', 'photo', 'diploma', 'other')),
  file_url text NOT NULL,
  file_name text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- ============================================================================
-- 2. INDEXES
-- ============================================================================

CREATE INDEX idx_ppdb_registrations_period_id ON ppdb_registrations(period_id);
CREATE INDEX idx_ppdb_registrations_status ON ppdb_registrations(status);
CREATE INDEX idx_ppdb_registrations_nik ON ppdb_registrations(nik);
CREATE INDEX idx_ppdb_registrations_created_at ON ppdb_registrations(created_at);
CREATE INDEX idx_ppdb_documents_registration_id ON ppdb_documents(registration_id);

-- ============================================================================
-- 3. TRIGGERS (updated_at)
-- ============================================================================

CREATE TRIGGER set_updated_at BEFORE UPDATE ON ppdb_registrations
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ============================================================================
-- 4. ROW LEVEL SECURITY
-- ============================================================================

ALTER TABLE ppdb_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE ppdb_documents ENABLE ROW LEVEL SECURITY;

-- 4.1 ppdb_registrations — anon (public form)
--    INSERT only: warga negara bisa mendaftar
CREATE POLICY "ppdb_registrations_insert_anon"
  ON ppdb_registrations
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- 4.1.1 ppdb_registrations — anon: TIDAK BISA SELECT
--    (tidak ada SELECT policy untuk anon → otomatis ditolak)

-- 4.2 ppdb_registrations — authenticated (admin)
CREATE POLICY "ppdb_registrations_select_admin"
  ON ppdb_registrations
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'super_admin')
  );

CREATE POLICY "ppdb_registrations_update_admin"
  ON ppdb_registrations
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'super_admin')
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'super_admin')
  );

-- 4.3 ppdb_documents — anon: TIDAK BISA AKSES
--    (tidak ada policy untuk anon → otomatis ditolak)

-- 4.4 ppdb_documents — authenticated (admin)
CREATE POLICY "ppdb_documents_select_admin"
  ON ppdb_documents
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'super_admin')
  );

CREATE POLICY "ppdb_documents_delete_admin"
  ON ppdb_documents
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'super_admin')
  );

-- ============================================================================
-- 5. STORAGE BUCKET
-- ============================================================================

INSERT INTO storage.buckets (id, name, public)
VALUES ('ppdb-documents', 'ppdb-documents', false)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS: anon tidak bisa akses, admin bisa full
CREATE POLICY "ppdb_storage_insert_anon"
  ON storage.objects
  FOR INSERT
  TO anon
  WITH CHECK (bucket_id = 'ppdb-documents');

CREATE POLICY "ppdb_storage_select_admin"
  ON storage.objects
  FOR SELECT
  TO authenticated
  USING (bucket_id = 'ppdb-documents');

CREATE POLICY "ppdb_storage_delete_admin"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'ppdb-documents');
