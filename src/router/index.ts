// Composables
import UserRepository from "@/domain/user-repository";
import { inject } from "vue";
import { createRouter, createWebHistory } from "vue-router";
import companyRoutes from "./company-routes";
import { UserRoleInterface } from "@/domain/user-role/role-interfaces";
import salesRoutes from "./sales-routes";

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
  // { path: "/", redirect: "/lading-page" },
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
        path: "home",
        name: "home",
        component: () => import("@/pages/Home.vue"),
      },
      ...companyRoutes,
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
  console.log(to.name);
  if (to.name === "landing-page" || to.name === "login" || to.name === "admin-login" || to.name === "home") {
  } else {
    const userRepository = inject<UserRepository>("userRepository");
    if (
      !userRepository?.getUser<UserRoleInterface>().isAuthenticated() &&
      to.name !== "login"
    ) {
      return { name: "login" };
    }
  }
});

export default router;
