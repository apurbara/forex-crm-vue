const salesRoutes = [
  {
    path: "sales-dashboard",
    name: "sales-dashboard",
    component: () => import("@/sales-bc/pages/SalesDashboard.vue"),
  },
  {
    path: "sales-activity/",
    children: [
      {
        path: "",
        name: "sales-activity-list",
        component: () => import("@/sales-bc/pages/activity/List.vue"),
      },
    ],
  },
  {
    path: "sales-customer-assignment/",
    children: [
      {
        path: "",
        name: "sales-customer-assignment-list",
        component: () =>
          import("@/sales-bc/pages/customer-assignment/List.vue"),
      },
      // {
      //   path: "register",
      //   name: "register-new-customer",
      //   component: () =>
      //     import("@/sales-bc/pages/customer-assignment/Register.vue"),
      // },
      {
        path: ":customerAssignmentId",
        name: "sales-customer-assignment-detail",
        props: true,
        component: () =>
          import("@/sales-bc/pages/customer-assignment/Detail.vue"),
      },
    ],
  },
];

export default salesRoutes;
