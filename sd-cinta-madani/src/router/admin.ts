import type { RouteRecordRaw } from "vue-router";

const adminRoutes: RouteRecordRaw[] = [
  {
    path: "/admin/login",
    name: "admin-login",
    component: () => import("@/pages/admin/LoginPage.vue"),
    meta: { requiresAuth: false },
  },
  {
    path: "/admin",
    component: () => import("@/layouts/AdminLayout.vue"),
    meta: { requiresAuth: true },
    children: [
      { path: "", redirect: "/admin/dashboard" },
      {
        path: "dashboard",
        name: "admin-dashboard",
        component: () => import("@/pages/admin/DashboardPage.vue"),
        meta: { role: "editor" },
      },
      // Hero Slides
      {
        path: "hero",
        name: "admin-hero-list",
        component: () => import("@/pages/admin/hero/HeroList.vue"),
        meta: { role: "editor" },
      },
      {
        path: "hero/create",
        name: "admin-hero-create",
        component: () => import("@/pages/admin/hero/HeroForm.vue"),
        meta: { role: "editor" },
      },
      {
        path: "hero/:id/edit",
        name: "admin-hero-edit",
        component: () => import("@/pages/admin/hero/HeroForm.vue"),
        meta: { role: "editor" },
      },
      // About Section
      {
        path: "about",
        name: "admin-about",
        component: () => import("@/pages/admin/about/AboutForm.vue"),
        meta: { role: "editor" },
      },
      // News
      {
        path: "news",
        name: "admin-news-list",
        component: () => import("@/pages/admin/news/NewsList.vue"),
        meta: { role: "editor" },
      },
      {
        path: "news/create",
        name: "admin-news-create",
        component: () => import("@/pages/admin/news/NewsForm.vue"),
        meta: { role: "editor" },
      },
      {
        path: "news/:id/edit",
        name: "admin-news-edit",
        component: () => import("@/pages/admin/news/NewsForm.vue"),
        meta: { role: "editor" },
      },
      // Programs
      {
        path: "programs",
        name: "admin-programs-list",
        component: () => import("@/pages/admin/programs/ProgramList.vue"),
        meta: { role: "editor" },
      },
      {
        path: "programs/create",
        name: "admin-programs-create",
        component: () => import("@/pages/admin/programs/ProgramForm.vue"),
        meta: { role: "editor" },
      },
      {
        path: "programs/:id/edit",
        name: "admin-programs-edit",
        component: () => import("@/pages/admin/programs/ProgramForm.vue"),
        meta: { role: "editor" },
      },
      // Events
      {
        path: "events",
        name: "admin-events-list",
        component: () => import("@/pages/admin/events/EventList.vue"),
        meta: { role: "editor" },
      },
      {
        path: "events/create",
        name: "admin-events-create",
        component: () => import("@/pages/admin/events/EventForm.vue"),
        meta: { role: "editor" },
      },
      {
        path: "events/:id/edit",
        name: "admin-events-edit",
        component: () => import("@/pages/admin/events/EventForm.vue"),
        meta: { role: "editor" },
      },
      // Achievements
      {
        path: "achievements",
        name: "admin-achievements-list",
        component: () => import("@/pages/admin/achievements/AchievementList.vue"),
        meta: { role: "editor" },
      },
      {
        path: "achievements/create",
        name: "admin-achievements-create",
        component: () => import("@/pages/admin/achievements/AchievementForm.vue"),
        meta: { role: "editor" },
      },
      {
        path: "achievements/:id/edit",
        name: "admin-achievements-edit",
        component: () => import("@/pages/admin/achievements/AchievementForm.vue"),
        meta: { role: "editor" },
      },
      // Gallery
      {
        path: "gallery",
        name: "admin-gallery-list",
        component: () => import("@/pages/admin/gallery/GalleryList.vue"),
        meta: { role: "editor" },
      },
      {
        path: "gallery/create",
        name: "admin-gallery-create",
        component: () => import("@/pages/admin/gallery/AlbumForm.vue"),
        meta: { role: "editor" },
      },
      {
        path: "gallery/:id/edit",
        name: "admin-gallery-edit",
        component: () => import("@/pages/admin/gallery/AlbumForm.vue"),
        meta: { role: "editor" },
      },
      // PPDB
      {
        path: "ppdb",
        name: "admin-ppdb-list",
        component: () => import("@/pages/admin/ppdb/PpdbList.vue"),
        meta: { role: "editor" },
      },
      {
        path: "ppdb/create",
        name: "admin-ppdb-create",
        component: () => import("@/pages/admin/ppdb/PpdbForm.vue"),
        meta: { role: "editor" },
      },
      {
        path: "ppdb/:id/edit",
        name: "admin-ppdb-edit",
        component: () => import("@/pages/admin/ppdb/PpdbForm.vue"),
        meta: { role: "editor" },
      },
      // Downloads
      {
        path: "downloads",
        name: "admin-downloads-list",
        component: () => import("@/pages/admin/downloads/DownloadList.vue"),
        meta: { role: "editor" },
      },
      {
        path: "downloads/create",
        name: "admin-downloads-create",
        component: () => import("@/pages/admin/downloads/DownloadForm.vue"),
        meta: { role: "editor" },
      },
      {
        path: "downloads/:id/edit",
        name: "admin-downloads-edit",
        component: () => import("@/pages/admin/downloads/DownloadForm.vue"),
        meta: { role: "editor" },
      },
      // Pages
      {
        path: "pages",
        name: "admin-pages-list",
        component: () => import("@/pages/admin/pages/PageList.vue"),
        meta: { role: "editor" },
      },
      {
        path: "pages/:id",
        name: "admin-pages-edit",
        component: () => import("@/pages/admin/pages/PageEditor.vue"),
        meta: { role: "editor" },
      },
      // Section Manager
      {
        path: "homepage/sections",
        name: "admin-section-manager",
        component: () => import("@/pages/admin/pages/SectionManager.vue"),
        meta: { role: "super_admin" },
      },
      // Media
      {
        path: "media",
        name: "admin-media",
        component: () => import("@/pages/admin/media/MediaLibrary.vue"),
        meta: { role: "editor" },
      },
      // Contacts
      {
        path: "contacts",
        name: "admin-contacts",
        component: () => import("@/pages/admin/contacts/ContactList.vue"),
        meta: { role: "editor" },
      },
      // Navigation
      {
        path: "navigation",
        name: "admin-navigation",
        component: () => import("@/pages/admin/navigation/NavigationList.vue"),
        meta: { role: "super_admin" },
      },
      // Settings
      {
        path: "settings",
        name: "admin-settings",
        component: () => import("@/pages/admin/settings/SettingsPage.vue"),
        meta: { role: "super_admin" },
      },
      // Guru & Staf
      {
        path: "guru-staf",
        name: "admin-staff-list",
        component: () => import("@/pages/admin/staff/StaffList.vue"),
        meta: { role: "editor" },
      },
      {
        path: "guru-staf/create",
        name: "admin-staff-create",
        component: () => import("@/pages/admin/staff/StaffForm.vue"),
        meta: { role: "editor" },
      },
      {
        path: "guru-staf/:id/edit",
        name: "admin-staff-edit",
        component: () => import("@/pages/admin/staff/StaffForm.vue"),
        meta: { role: "editor" },
      },
      // Fasilitas
      {
        path: "fasilitas",
        name: "admin-facilities-list",
        component: () => import("@/pages/admin/facilities/FacilityList.vue"),
        meta: { role: "editor" },
      },
      {
        path: "fasilitas/create",
        name: "admin-facilities-create",
        component: () => import("@/pages/admin/facilities/FacilityForm.vue"),
        meta: { role: "editor" },
      },
      {
        path: "fasilitas/:id/edit",
        name: "admin-facilities-edit",
        component: () => import("@/pages/admin/facilities/FacilityForm.vue"),
        meta: { role: "editor" },
      },
      // PPDB Registrations
      {
        path: "registrations",
        name: "admin-ppdb-registrations",
        component: () => import("@/pages/admin/ppdb/RegistrationList.vue"),
        meta: { role: "editor" },
      },
      {
        path: "registrations/:id",
        name: "admin-ppdb-registration-detail",
        component: () => import("@/pages/admin/ppdb/RegistrationDetail.vue"),
        meta: { role: "editor" },
      },
      // Users
      {
        path: "users",
        name: "admin-users",
        component: () => import("@/pages/admin/users/UserList.vue"),
        meta: { role: "super_admin" },
      },
    ],
  },
];

export default adminRoutes;
