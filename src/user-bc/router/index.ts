const userRoutes = [
  {
    path: "/login",
    name: "login",
    component: () => import("@/user-bc/pages/SalesLogin.vue"),
  },
  {
    path: "/admin-login",
    name: "admin-login",
    component: () => import("@/user-bc/pages/AdminLogin.vue"),
  },
  {
    path: "/manager-login",
    name: "manager-login",
    component: () => import("@/user-bc/pages/ManagerLogin.vue"),
  },
];
export default userRoutes