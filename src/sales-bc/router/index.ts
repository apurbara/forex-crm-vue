const salesRoutes = [
  {
    path: "sales-dashboard",
    name: "sales-dashboard",
    component: () => import("@/sales-bc/pages/SalesDashboard.vue"),
  },
  {
    path: "greeter-dashboard",
    name: "greeter-dashboard",
    component: () => import("@/sales-bc/pages/GreeterDashboard.vue"),
  },
  {
    path: "fact-finder-dashboard",
    name: "fact-finder-dashboard",
    component: () => import("@/sales-bc/pages/FactFinderDashboard.vue"),
  },
  {
    path: "striker-dashboard",
    name: "striker-dashboard",
    component: () => import("@/sales-bc/pages/StrikerDashboard.vue"),
  },
  {
    path: "sales-activity-schedule/",
    children: [
      {
        path: "",
        name: "sales-activity-schedule-list",
        component: () => import("@/sales-bc/pages/activity/List.vue"),
      },
    ],
  },
  {
    path: "sales-greeting-assignment/",
    children: [
      {
        path: "",
        name: "sales-greeting-assignment-list",
        component: () =>
          import("@/sales-bc/pages/greeting-assignment/List.vue"),
      },
      {
        path: ":greetingAssignmentId",
        name: "sales-greeting-assignment-detail",
        props: true,
        component: () =>
          import("@/sales-bc/pages/greeting-assignment/Detail.vue"),
      },
    ],
  },
  {
    path: "sales-fact-finding-assignment/",
    children: [
      {
        path: "",
        name: "sales-fact-finding-assignment-list",
        component: () =>
          import("@/sales-bc/pages/fact-finding-assignment/List.vue"),
      },
      {
        path: ":factFindingAssignmentId",
        name: "sales-fact-finding-assignment-detail",
        props: true,
        component: () =>
          import("@/sales-bc/pages/fact-finding-assignment/Detail.vue"),
      },
    ],
  },
  {
    path: "sales-striking-assignment/",
    children: [
      {
        path: "",
        name: "sales-striking-assignment-list",
        component: () =>
          import("@/sales-bc/pages/striking-assignment/List.vue"),
      },
      {
        path: ":strikingAssignmentId",
        name: "sales-striking-detail",
        props: true,
        component: () =>
          import("@/sales-bc/pages/striking-assignment/Detail.vue"),
      },
    ],
  },
];

export default salesRoutes;
