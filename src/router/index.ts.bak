// Composables
import UserRepository from "@/domain/user-repository";
import { inject } from "vue";
import { createRouter, createWebHistory } from "vue-router";

const authorizeUserCanAccessMenu = (menu: string): boolean =>
  inject<UserRepository>("userRepository")?.isUserCanAccess(menu)!;

const routes = [
  {
    path: "/login",
    name: "login",
    component: () => import("@/pages/Login.vue"),
  },
  {
    path: "/admin-login",
    name: "admin-login",
    component: () => import("@/pages/AdminLogin.vue"),
  },
  // {
  //   path: "/",
  //   redirect: "/landing-page",
  // },
  {
    path: "/",
    component: () => import("@/shared/components/UserLayoutComponent.vue"),
    children: [
      {
        path: "",
        name: "landing-page",
        component: () => import("@/pages/LandingPage.vue"),
      },
      {
        path: "manager-dashboard",
        name: "manager-dashboard",
        beforeEnter: () => {
          authorizeUserCanAccessMenu("manager-dashboard");
        },
        component: () => import("@/pages/ManagerDashboard.vue"),
      },
      {
        path: "sales-dashboard",
        name: "sales-dashboard",
        beforeEnter: () => {
          authorizeUserCanAccessMenu("sales-dashboard");
        },
        component: () => import("@/pages/SalesDashboard.vue"),
      },
      {
        path: "home",
        name: "home",
        component: () => import("@/pages/Home.vue"),
      },
      {
        path: "admin/",
        beforeEnter: () =>
          inject<UserRepository>("userRepository")?.isUserCanAccess("admin"),
        children: [
          {
            path: "",
            name: "admin-list",
            component: () => import("@/pages/admin/List.vue"),
          },
          {
            path: ":adminId",
            name: "admin-detail",
            props: true,
            component: () => import("@/pages/admin/Detail.vue"),
          },
          {
            path: "add",
            name: "add-admin",
            component: () => import("@/pages/admin/Add.vue"),
          },
        ],
      },
      {
        path: "manager/",
        beforeEnter: () =>
          inject<UserRepository>("userRepository")?.isUserCanAccess("manager"),
        children: [
          {
            path: "",
            name: "manager-list",
            component: () => import("@/pages/manager/List.vue"),
          },
          {
            path: ":managerId",
            name: "manager-detail",
            props: true,
            component: () => import("@/pages/manager/Detail.vue"),
          },
          {
            path: "add",
            name: "add-manager",
            component: () => import("@/pages/manager/Add.vue"),
          },
        ],
      },
      {
        path: "sales/",
        beforeEnter: () =>
          inject<UserRepository>("userRepository")?.isUserCanAccess("sales"),
        children: [
          {
            path: "",
            name: "sales-list",
            component: () => import("@/pages/sales/List.vue"),
          },
          {
            path: ":salesId",
            name: "sales-detail",
            props: true,
            component: () => import("@/pages/sales/Detail.vue"),
          },
          {
            path: "add",
            name: "add-sales",
            component: () => import("@/pages/sales/Add.vue"),
          },
        ],
      },
      {
        path: "product/",
        beforeEnter: () =>
          inject<UserRepository>("userRepository")?.isUserCanAccess("product"),
        children: [
          {
            path: "",
            name: "product-list",
            component: () => import("@/pages/product/List.vue"),
          },
          {
            path: ":productId",
            name: "product-detail",
            props: true,
            component: () => import("@/pages/product/Detail.vue"),
          },
          {
            path: "add",
            name: "add-product",
            component: () => import("@/pages/product/Add.vue"),
          },
        ],
      },
      {
        path: "mail-content/",
        beforeEnter: () => authorizeUserCanAccessMenu("mail-content"),
        children: [
          {
            path: "",
            name: "mail-content-list",
            component: () => import("@/pages/mail-content/List.vue"),
          },
          {
            path: ":mailContentId",
            name: "mail-content-detail",
            props: true,
            component: () => import("@/pages/mail-content/Detail.vue"),
          },
          {
            path: "add",
            name: "add-mail-content",
            component: () => import("@/pages/mail-content/Add.vue"),
          },
        ],
      },
      {
        path: "sales-mission/",
        beforeEnter: () => authorizeUserCanAccessMenu("sales-mission"),
        children: [
          {
            path: "",
            name: "sales-mission-list",
            component: () => import("@/pages/sales-mission/List.vue"),
          },
          {
            path: ":salesMissionId",
            name: "sales-mission-detail",
            props: true,
            component: () => import("@/pages/sales-mission/Detail.vue"),
          },
          {
            path: "add",
            name: "add-sales-mission",
            component: () => import("@/pages/sales-mission/Add.vue"),
          },
        ],
      },
      {
        path: "article/",
        beforeEnter: () => authorizeUserCanAccessMenu("article"),
        children: [
          {
            path: "",
            name: "article-list",
            component: () => import("@/pages/article/List.vue"),
          },
          {
            path: ":articleId",
            name: "article-detail",
            props: true,
            component: () => import("@/pages/article/Detail.vue"),
          },
          {
            path: "add",
            name: "add-article",
            component: () => import("@/pages/article/Add.vue"),
          },
        ],
      },
      {
        path: "sales-summary/",
        beforeEnter: () => authorizeUserCanAccessMenu("sales-summary"),
        children: [
          {
            path: "",
            name: "sales-summary-list",
            component: () => import("@/pages/sales-summary/List.vue"),
          },
          {
            path: ":salesId",
            name: "sales-summary-detail",
            props: true,
            component: () => import("@/pages/sales-summary/Detail.vue"),
          },
        ],
      },
      {
        path: "customer-summary/",
        beforeEnter: () => authorizeUserCanAccessMenu("customer-summary"),
        children: [
          {
            path: "",
            name: "customer-summary-list",
            component: () => import("@/pages/customer-summary/List.vue"),
          },
          {
            path: ":customerId",
            name: "customer-summary-detail",
            props: true,
            component: () => import("@/pages/customer-summary/Detail.vue"),
          },
        ],
      },
      {
        path: "sales-mission-report/",
        beforeEnter: () => authorizeUserCanAccessMenu("sales-mission-report"),
        children: [
          {
            path: "submit",
            name: "submit-sales-mission-report",
            component: () => import("@/pages/sales-mission-report/Submit.vue"),
          },
          {
            path: ":salesMissionReportId",
            name: "sales-mission-report-detail",
            props: true,
            component: () => import("@/pages/sales-mission-report/Detail.vue"),
          },
        ],
      },
    ],
  },
];

const router = createRouter({
  // history: createWebHistory(process.env.BASE_URL),
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach((to, from) => {
  if (to.name === "login" || to.name === "admin-login" || to.name === "home") {
  } else {
    const userRepository = inject<UserRepository>("userRepository");
    if (!userRepository?.isUserAuthenticated() && to.name !== "login") {
      return { name: "login" };
    }
  }
});

export default router;
