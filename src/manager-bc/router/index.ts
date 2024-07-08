const managerRoutes = [
  {
    path: "manager-dashboard",
    name: "manager-dashboard",
    component: () => import("@/manager-bc/pages/ManagerDashboard.vue"),
  },
  {
    path: "manager-customer-assignment/",
    children: [
      {
        path: "",
        name: "manager-customer-assignment-list",
        component: () => import("@/manager-bc/pages/customer-assignment/List.vue"),
      },
      {
        path: ":customerAssignmentId",
        name: "manager-customer-assignment-detail",
        props: true,
        component: () => import("@/manager-bc/pages/customer-assignment/Detail.vue"),
      },
    ],
  },
  {
    path: "manager-closing-request/",
    children: [
      {
        path: "",
        name: "manager-closing-request-list",
        component: () => import("@/manager-bc/pages/closing-request/List.vue"),
      },
    ],
  },
  {
    path: "manager-recycle-request/",
    children: [
      {
        path: "",
        name: "manager-recycle-request-list",
        component: () => import("@/manager-bc/pages/recycle-request/List.vue"),
      },
    ],
  },
  // {
  //   path: "schedule/",
  //   children: [
  //     {
  //       path: "",
  //       name: "schedule-list",
  //       component: () => import("@/manager-bc/pages/schedule/List.vue"),
  //     },
  //   ],
  // },
  // {
  //   path: "manager-customer-assignment/",
  //   children: [
  //     {
  //       path: "",
  //       name: "manager-customer-assignment-list",
  //       component: () => import("@/manager-bc/pages/assignment/List.vue"),
  //     },
  //     {
  //       path: "register",
  //       name: "register-new-customer",
  //       component: () => import("@/manager-bc/pages/customer-assignment/Register.vue"),
  //     },
  //     {
  //       path: ":customerAssignmentId",
  //       name: "manager-customer-assignment-detail",
  //       props: true,
  //       component: () => import("@/manager-bc/pages/assignment/Detail.vue"),
  //     },
  //   ],
  // },
];

export default managerRoutes;
