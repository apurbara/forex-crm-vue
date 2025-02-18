const salesRoutes = [
  {
    path: "sales/",
    component: () => import("@/sales-bc/components/SalesLayoutComponent.vue"),
    children: [
      {
        path: "",
        redirect: "/sales/dashboard",
      },
      {
        path: "dashboard",
        meta: { title: "Sales Dashboard" },
        component: () => import("@/sales-bc/pages/SalesDashboard.vue"),
      },
      {
        path: "schedule/",
        children: [
          {
            path: "",
            name: "sales-activity-schedule-list",
            component: () => import("@/sales-bc/pages/Schedule/Main.vue"),
          },
        ],
      },
      {
        path: "customer-assignment/",
        children: [
          // {
          //   path: "",
          //   name: "sales-customer-assignment-list",
          //   component: () => import("@/sales-bc/pages/customer-assignment/List.vue"),
          // },
          {
            path: "",
            name: "sales-customer-assignment-list",
            component: () => import("@/sales-bc/pages/customer-assignment/Main.vue"),
          },
          {
            path: ":customerAssignmentId/",
            props: true,
            component: () =>
              import("@/sales-bc/components/sales/CustomerAssignmentLayoutComponent.vue"),
            children: [
              {
                path: "",
                redirect: (to: any) => {
                  return `/sales/customer-assignment/${to.params.customerAssignmentId}/sales-activity`;
                },
              },
              {
                path: "sales-activity",
                props: true,
                component: () =>
                  import("@/sales-bc/pages/customer-assignment/sales-activity/List.vue"),
              },
              {
                path: "closing-request-log",
                props: true,
                component: () =>
                  import("@/sales-bc/pages/customer-assignment/closing-request-log/List.vue"),
              },
              {
                path: "recycle-request-log",
                props: true,
                component: () =>
                  import("@/sales-bc/pages/customer-assignment/recycle-request-log/List.vue"),
              },
              {
                path: "journey-log",
                props: true,
                component: () =>
                  import("@/sales-bc/pages/customer-assignment/journey-log/List.vue"),
              },
            ],
          },
        ],
      },
    ],
  },
  // {
  //   path: "sales-dashboard",
  //   name: "sales-dashboard",
  //   component: () => import("@/sales-bc/pages/SalesDashboard.vue"),
  // },
  // {
  //   path: "sales-activity-schedule/",
  //   children: [
  //     {
  //       path: "",
  //       name: "sales-activity-schedule-list",
  //       component: () => import("@/sales-bc/pages/activity/List.vue"),
  //     },
  //   ],
  // },
  // {
  //   path: "sales-customer-assignment/",
  //   children: [
  //     {
  //       path: "",
  //       name: "sales-customer-assignment-list",
  //       component: () =>
  //         import("@/sales-bc/pages/customer-assignment/List.vue"),
  //     },
  //     {
  //       path: ":customerAssignmentId",
  //       name: "sales-customer-assignment-detail",
  //       props: true,
  //       component: () =>
  //         import("@/sales-bc/pages/customer-assignment/Detail.vue"),
  //     },
  //   ],
  // },
];

export default salesRoutes;
