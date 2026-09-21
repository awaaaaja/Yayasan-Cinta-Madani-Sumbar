-- Migration 002: Fix RLS policy mismatches with router roles
-- The router allows editor role to manage education_units, ppdb_periods, ppdb_faqs, ppdb_requirements
-- But RLS policies restrict INSERT/UPDATE/DELETE to super_admin only.

-- 1. education_units: allow editor to INSERT (create new units)
DROP POLICY IF EXISTS "education_units_insert_super_admin" ON education_units;
CREATE POLICY "education_units_insert_editor" ON education_units
  FOR INSERT WITH CHECK (is_editor());

-- 2. ppdb_periods: allow editor to INSERT/UPDATE/DELETE
DROP POLICY IF EXISTS "ppdb_periods_insert_super_admin" ON ppdb_periods;
DROP POLICY IF EXISTS "ppdb_periods_update_super_admin" ON ppdb_periods;
DROP POLICY IF EXISTS "ppdb_periods_delete_super_admin" ON ppdb_periods;
CREATE POLICY "ppdb_periods_insert_editor" ON ppdb_periods
  FOR INSERT WITH CHECK (is_editor());
CREATE POLICY "ppdb_periods_update_editor" ON ppdb_periods
  FOR UPDATE USING (is_editor());
CREATE POLICY "ppdb_periods_delete_editor" ON ppdb_periods
  FOR DELETE USING (is_editor());

-- 3. ppdb_faqs: allow editor to INSERT/UPDATE/DELETE
DROP POLICY IF EXISTS "ppdb_faqs_insert_super_admin" ON ppdb_faqs;
DROP POLICY IF EXISTS "ppdb_faqs_update_super_admin" ON ppdb_faqs;
DROP POLICY IF EXISTS "ppdb_faqs_delete_super_admin" ON ppdb_faqs;
CREATE POLICY "ppdb_faqs_insert_editor" ON ppdb_faqs
  FOR INSERT WITH CHECK (is_editor());
CREATE POLICY "ppdb_faqs_update_editor" ON ppdb_faqs
  FOR UPDATE USING (is_editor());
CREATE POLICY "ppdb_faqs_delete_editor" ON ppdb_faqs
  FOR DELETE USING (is_editor());

-- 4. ppdb_requirements: allow editor to INSERT/UPDATE/DELETE
DROP POLICY IF EXISTS "ppdb_requirements_insert_super_admin" ON ppdb_requirements;
DROP POLICY IF EXISTS "ppdb_requirements_update_super_admin" ON ppdb_requirements;
DROP POLICY IF EXISTS "ppdb_requirements_delete_super_admin" ON ppdb_requirements;
CREATE POLICY "ppdb_requirements_insert_editor" ON ppdb_requirements
  FOR INSERT WITH CHECK (is_editor());
CREATE POLICY "ppdb_requirements_update_editor" ON ppdb_requirements
  FOR UPDATE USING (is_editor());
CREATE POLICY "ppdb_requirements_delete_editor" ON ppdb_requirements
  FOR DELETE USING (is_editor());
