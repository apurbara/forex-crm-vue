// Composables
// import UserRepository from "@/domain/user-repository";
import { inject } from "vue";
import { createRouter, createWebHistory } from "vue-router";
import companyRoutes from "@/company-bc/router";
import userRoutes from "@/user-bc/router";
import UserRepository from "@/user-bc/role/user-repository";
import salesRoutes from "@/sales-bc/router";

const routes = [
  {
    path: "/",
    component: () => import("@/shared/components/UserLayoutComponent.vue"),
    children: [
      {
        path: "",
        name: "landing-page",
        component: () => import("@/user-bc/pages/LandingPage.vue"),
      },
      ...companyRoutes,
      ...userRoutes,
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
  if (to.name === "landing-page" || to.name === "home") {
  } else if (to.name === "login" || to.name === "admin-login" || to.name === "manager-login") {
    const userRepository = inject<UserRepository>("userRepository");
    if (userRepository?.getUser().isAuthenticated()) {
      return { name: "landing-page" };
    }
  } else {
    const userRepository = inject<UserRepository>("userRepository");
    if (!userRepository?.getUser().isAuthenticated() && to.name !== "login") {
      return { name: "login" };
    }
  }
});

export default router;
