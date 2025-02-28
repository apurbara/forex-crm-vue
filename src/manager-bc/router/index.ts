const managerRoutes = [
  {
    path: "manager-dashboard",
    name: "manager-dashboard",
    component: () => import("@/manager-bc/pages/ManagerDashboard.vue"),
  },
  {
    path: "manager-greeting-assignment/",
    children: [
      {
        path: "",
        name: "manager_greeting-assignment-list",
        component: () => import("@/manager-bc/pages/greeting-assignment/List.vue"),
      },
      {
        path: "distribute",
        name: "manager_distribute-greeting-assignment",
        props: true,
        component: () => import("@/manager-bc/pages/greeting-assignment/Distribute.vue"),
      },
      {
        path: ":greetingAssignmentId",
        name: "manager_greeting-assignment-detail",
        props: true,
        component: () => import("@/manager-bc/pages/greeting-assignment/Detail.vue"),
      },
    ],
  },
  {
    path: "manager-fact-finding-assignment/",
    children: [
      {
        path: "",
        name: "manager_fact-finding-assignment-list",
        component: () => import("@/manager-bc/pages/fact-finding-assignment/List.vue"),
      },
      {
        path: "distribute",
        name: "manager_distribute-fact-finding-assignment",
        props: true,
        component: () => import("@/manager-bc/pages/fact-finding-assignment/Distribute.vue"),
      },
      {
        path: ":factFindingAssignmentId",
        name: "manager_fact-finding-assignment-detail",
        props: true,
        component: () => import("@/manager-bc/pages/fact-finding-assignment/Detail.vue"),
      },
    ],
  },
  {
    path: "manager-striking-assignment/",
    children: [
      {
        path: "",
        name: "manager_striking-assignment-list",
        component: () => import("@/manager-bc/pages/striking-assignment/List.vue"),
      },
      {
        path: "distribute",
        name: "manager_distribute-striking-assignment",
        props: true,
        component: () => import("@/manager-bc/pages/striking-assignment/Distribute.vue"),
      },
      {
        path: ":strikingAssignmentId",
        name: "manager_striking-assignment-detail",
        props: true,
        component: () => import("@/manager-bc/pages/striking-assignment/Detail.vue"),
      },
    ],
  },
  // {
  //   path: "manager-fact-finding-assignment/",
  //   children: [
  //     {
  //       path: "",
  //       name: "manager_fact-finding-assignment-list",
  //       component: () => import("@/manager-bc/pages/fact-finding-assignment/List.vue"),
  //     },
  //     {
  //       path: ":customerAssignmentId",
  //       name: "manager_fact-finding-assignment-detail",
  //       props: true,
  //       component: () => import("@/manager-bc/pages/fact-finding-assignment/Detail.vue"),
  //     },
  //     {
  //       path: "distribute",
  //       name: "manager_fact-finding-greeting-assignment",
  //       props: true,
  //       component: () => import("@/manager-bc/pages/fact-finding-assignment/Distribute.vue"),
  //     },
  //   ],
  // },
  // {
  //   path: "manager-customer-assignment/",
  //   children: [
  //     {
  //       path: "",
  //       name: "manager-customer-assignment-list",
  //       component: () => import("@/manager-bc/pages/customer-assignment/List.vue"),
  //     },
  //     {
  //       path: ":customerAssignmentId",
  //       name: "manager-customer-assignment-detail",
  //       props: true,
  //       component: () => import("@/manager-bc/pages/customer-assignment/Detail.vue"),
  //     },
  //   ],
  // },
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
];

export default managerRoutes;
