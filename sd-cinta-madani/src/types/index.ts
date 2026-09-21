export interface SiteSettings {
  id: string;
  school_name: string;
  tagline: string;
  description: string;
  logo_url: string;
  logo_light_url: string;
  logo_dark_url: string;
  favicon_url: string;
  email: string;
  phone: string;
  whatsapp: string;
  address: string;
  maps_url: string;
  social_links: SocialLinks;
  seo_defaults: SeoDefaults;
  footer_content: FooterContent;
  created_at: string;
  updated_at: string;
}

export interface SocialLinks {
  instagram?: string;
  facebook?: string;
  youtube?: string;
  tiktok?: string;
}

export interface SeoDefaults {
  title?: string;
  description?: string;
  og_image?: string;
}

export interface FooterContent {
  description?: string;
  copyright?: string;
}

export interface PageSection {
  id: string;
  page_id: string;
  section_key: string;
  title: string;
  subtitle: string;
  description: string;
  content: Record<string, unknown>;
  is_visible: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface HeroContent {
  eyebrow?: string;
  headline?: string;
  description?: string;
  primary_cta_label?: string;
  primary_cta_url?: string;
  secondary_cta_label?: string;
  secondary_cta_url?: string;
  hero_image?: string;
}

export interface TrustStripContent {
  eyebrow?: string;
  items?: Array<{
    label: string;
    description?: string;
  }>;
}

export interface AboutContent {
  eyebrow?: string;
  heading?: string;
  description?: string;
  primary_image?: string;
  secondary_image?: string;
  cta_label?: string;
  cta_url?: string;
  section_label?: string;
  founded_year?: string;
}

export interface NavigationItem {
  id: string;
  label: string;
  url: string;
  parent_id: string | null;
  sort_order: number;
  is_visible: boolean;
  open_new_tab: boolean;
  children?: NavigationItem[];
}

export type LoadingState = "loading" | "empty" | "error" | "success";

export interface News {
  id: string;
  unit_id: string | null;
  category_id: string | null;
  title: string;
  slug: string;
  excerpt: string | null;
  content: Record<string, unknown>;
  cover_image_url: string | null;
  status: "draft" | "published" | "archived";
  featured: boolean;
  author_id: string;
  published_at: string | null;
  scheduled_at: string | null;
  seo_title: string | null;
  seo_description: string | null;
  og_image_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface NewsCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
}

export interface NewsTag {
  id: string;
  name: string;
  slug: string;
}

export interface EducationUnit {
  id: string;
  name: string;
  slug: string;
  short_description: string | null;
  description: string | null;
  logo_url: string | null;
  hero_image_url: string | null;
  address: string | null;
  phone: string | null;
  email: string | null;
  maps_url: string | null;
  status: "draft" | "published" | "archived";
  sort_order: number;
  seo_title: string | null;
  seo_description: string | null;
  og_image_url: string | null;
}

export interface Program {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: Record<string, unknown>;
  image_url: string | null;
  icon: string | null;
  featured: boolean;
  status: "draft" | "published" | "archived";
  sort_order: number;
  seo_title: string | null;
  seo_description: string | null;
  og_image_url: string | null;
}

export interface Event {
  id: string;
  unit_id: string | null;
  title: string;
  slug: string;
  description: string | null;
  cover_image_url: string | null;
  event_date: string;
  end_date: string | null;
  location: string | null;
  registration_url: string | null;
  status: "draft" | "published" | "archived";
}

export interface Achievement {
  id: string;
  unit_id: string | null;
  title: string;
  description: string | null;
  student_or_team: string | null;
  level: string | null;
  year: number;
  category: string | null;
  image_url: string | null;
  featured: boolean;
}

export interface GalleryAlbum {
  id: string;
  unit_id: string | null;
  title: string;
  slug: string;
  description: string | null;
  cover_url: string | null;
  event_date: string | null;
  status: "draft" | "published" | "archived";
}

export interface MediaItem {
  id: string;
  file_name: string;
  storage_path: string;
  public_url: string;
  mime_type: string;
  file_size: number | null;
  width: number | null;
  height: number | null;
  alt_text: string | null;
  caption: string | null;
  folder: string | null;
  uploaded_by: string;
  created_at: string;
}

export interface PpdbPeriod {
  id: string;
  unit_id: string;
  academic_year: string;
  title: string;
  description: string | null;
  status: "coming_soon" | "open" | "closed";
  registration_url: string | null;
  contact_name: string | null;
  contact_phone: string | null;
  contact_email: string | null;
  start_date: string;
  end_date: string;
}

export interface Download {
  id: string;
  unit_id: string | null;
  title: string;
  description: string | null;
  file_url: string;
  file_type: string | null;
  file_size: number | null;
  status: "draft" | "published" | "archived";
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  status: "unread" | "read" | "replied" | "archived";
  created_at: string;
}

export interface Page {
  id: string;
  title: string;
  slug: string;
  page_key: string;
  description: string | null;
  status: "draft" | "published" | "archived";
  seo_title: string | null;
  seo_description: string | null;
  og_image_url: string | null;
}

export interface Staff {
  id: string;
  unit_id: string | null;
  full_name: string;
  position: string;
  photo_url: string | null;
  bio: string | null;
  sort_order: number;
  is_visible: boolean;
}

export interface AuditLog {
  id: string;
  user_id: string;
  action: string;
  entity_type: string;
  entity_id: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
}

export interface HeroSlide {
  id: string;
  title: string | null;
  description: string | null;
  image_url: string;
  image_alt: string | null;
  image_position: string;
  duration: number;
  sort_order: number;
  is_active: boolean;
  cta_label: string | null;
  cta_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  count: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
