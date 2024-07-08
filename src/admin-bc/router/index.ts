const adminRoutes = [
  {
    path: "admin-dashboard",
    name: "admin-dashboard",
    component: () => import("@/admin-bc/pages/AdminDashboard.vue"),
  },
];

export default adminRoutes;
