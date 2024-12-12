import { inject } from "vue";
import { createRouter, createWebHistory } from "vue-router";
import companyRoutes from "@/company-bc/router";
import salesRoutes from "@/sales-bc/router";
import adminRoutes from "@/admin-bc/router";
import managerRoutes from "@/manager-bc/router";
import CompanyUserRepository from "@/company-bc/role/company-user-repository";

const routes = [
  {
    path: "/login",
    name: "login",
    component: () => import("@/shared-bc/pages/Login.vue"),
  },
  {
    path: "/",
    component: () => import("@/shared/components/UserLayoutComponent.vue"),
    children: [
      {
        path: "",
        name: "landing-page",
        component: () => import("@/shared-bc/pages/LandingPage.vue"),
      },
      {
        path: "home",
        name: "home",
        component: () => import("@/shared-bc/pages/Home.vue"),
      },
      ...companyRoutes,
      ...adminRoutes,
      ...managerRoutes,
      ...salesRoutes,
    ],
  },
];

const router = createRouter({
  // history: createWebHistory(process.env.BASE_URL),
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach((to, from) => {
  const companyUserRepository = inject<CompanyUserRepository>(
    "companyUserRepository"
  );
  // console.log(to.name)
  // console.log(!!companyUserRepository?.getUser())
  if (to.name === "landing-page" || to.name === "home") {
  } else if (to.name === "login") {
    if (!!companyUserRepository?.getUser()) {
      return { name: "landing-page" };
    }
  } else {
    if (!companyUserRepository?.getUser() && to.name !== "login") {
      return { name: "login" };
    }
  }
});

export default router;
