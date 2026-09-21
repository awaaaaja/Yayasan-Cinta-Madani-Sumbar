import { createRouter, createWebHistory } from "vue-router";
import PublicLayout from "@/layouts/PublicLayout.vue";
import adminRoutes from "@/router/admin";
import { getSession, getUserRole } from "@/services/auth.service";

const publicRoutes = [
  {
    path: "/",
    component: PublicLayout,
    children: [
      {
        path: "",
        name: "home",
        component: () => import("@/pages/public/HomePage.vue"),
      },
      {
        path: "tentang",
        name: "tentang",
        component: () => import("@/pages/public/TentangPage.vue"),
      },
      {
        path: "tentang/:sub",
        name: "tentang-sub",
        component: () => import("@/pages/public/TentangSubPage.vue"),
      },
      {
        path: "guru-dan-staf",
        name: "guru-staf",
        component: () => import("@/pages/public/GuruStafPage.vue"),
      },
      {
        path: "fasilitas",
        name: "fasilitas",
        component: () => import("@/pages/public/FasilitasPage.vue"),
      },
      {
        path: "program",
        name: "program-list",
        component: () => import("@/pages/public/ProgramListPage.vue"),
      },
      {
        path: "program/:slug",
        name: "program-detail",
        component: () => import("@/pages/public/ProgramDetailPage.vue"),
      },
      {
        path: "berita",
        name: "news-list",
        component: () => import("@/pages/public/NewsListPage.vue"),
      },
      {
        path: "berita/kategori/:slug",
        name: "news-category",
        component: () => import("@/pages/public/NewsListPage.vue"),
      },
      {
        path: "berita/:slug",
        name: "news-detail",
        component: () => import("@/pages/public/NewsDetailPage.vue"),
      },
      {
        path: "agenda",
        name: "agenda-list",
        component: () => import("@/pages/public/AgendaListPage.vue"),
      },
      {
        path: "agenda/:slug",
        name: "agenda-detail",
        component: () => import("@/pages/public/AgendaDetailPage.vue"),
      },
      {
        path: "prestasi",
        name: "prestasi",
        component: () => import("@/pages/public/PrestasiPage.vue"),
      },
      {
        path: "galeri",
        name: "galeri-list",
        component: () => import("@/pages/public/GaleriListPage.vue"),
      },
      {
        path: "galeri/:slug",
        name: "galeri-detail",
        component: () => import("@/pages/public/GaleriDetailPage.vue"),
      },
      {
        path: "ppdb",
        name: "ppdb",
        component: () => import("@/pages/public/PpdbPage.vue"),
      },
      {
        path: "ppdb/daftar",
        name: "ppdb-register",
        component: () => import("@/pages/public/PpdbRegisterPage.vue"),
      },
      {
        path: "ppdb/sukses",
        name: "ppdb-success",
        component: () => import("@/pages/public/PpdbSuccessPage.vue"),
      },
      {
        path: "kontak",
        name: "kontak",
        component: () => import("@/pages/public/KontakPage.vue"),
      },
      {
        path: "privacy-policy",
        name: "privacy",
        component: () => import("@/pages/public/PrivacyPage.vue"),
      },
      {
        path: "terms",
        name: "terms",
        component: () => import("@/pages/public/TermsPage.vue"),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes: [
    ...publicRoutes,
    ...adminRoutes,
    {
      path: "/:pathMatch(.*)*",
      name: "not-found",
      component: () => import("@/pages/public/NotFoundPage.vue"),
    },
  ],
  scrollBehavior(_to, _from, savedPosition) {
    return savedPosition || { top: 0 };
  },
});

router.beforeEach(async (to) => {
  if (!to.meta.requiresAuth) return true;

  const session = await getSession();
  if (!session) return { name: "admin-login" };

  if (to.meta.role) {
    const role = await getUserRole(session.user.id);
    const required = to.meta.role as string;

    if (required === "super_admin" && role !== "super_admin") {
      return { name: "admin-dashboard" };
    }
  }

  return true;
});

export default router;
