const salesRoutes = [
  {
    path: "sales-dashboard",
    name: "sales-dashboard",
    component: () => import("@/sales-bc/pages/SalesDashboard.vue"),
  },
  {
    path: "schedule/",
    children: [
      {
        path: "",
        name: "schedule-list",
        component: () => import("@/sales-bc/pages/schedule/List.vue"),
      },
    ],
  },
  {
    path: "sales-customer-assignment/",
    children: [
      {
        path: "",
        name: "sales-customer-assignment-list",
        component: () => import("@/sales-bc/pages/assignment/List.vue"),
      },
      {
        path: "register",
        name: "register-new-customer",
        component: () => import("@/sales-bc/pages/customer-assignment/Register.vue"),
      },
      {
        path: ":customerAssignmentId",
        name: "sales-customer-assignment-detail",
        props: true,
        component: () => import("@/sales-bc/pages/assignment/Detail.vue"),
      },
    ],
  },
];

export default salesRoutes;
