-- Insert SD Cinta Madani unit if not exists
INSERT INTO education_units (name, slug, description, status, sort_order)
SELECT 'SD Cinta Madani', 'sd-cinta-madani', 'Sekolah Dasar Cinta Madani', 'published', 1
WHERE NOT EXISTS (
  SELECT 1 FROM education_units WHERE slug = 'sd-cinta-madani'
);
