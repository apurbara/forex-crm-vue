import { components } from "vuetify/dist/vuetify-labs.js";

const managerRoutes = [
  {
    path: "manager/",
    component: () => import("@/manager-bc/components/ManagerLayoutComponent.vue"),
    children: [
      {
        path: "",
        redirect: "/manager/dashboard",
      },
      {
        path: "dashboard",
        meta: { title: "Manager Dashboard" },
        component: () => import("@/manager-bc/pages/ManagerDashboard.vue"),
      },
      {
        path: "customer-assignment/",
        children: [
          {
            path: "",
            meta: { title: "Customer Assignment List" },
            component: () => import("@/manager-bc/pages/customer-assignment/List.vue"),
          },
          {
            path: ":customerAssignmentId",
            meta: { title: "Customer Assignment Detail" },
            props: true,
            component: () => import("@/manager-bc/pages/customer-assignment/Detail.vue"),
          },
        ],
      },
      {
        path: "closing-request/",
        children: [
          {
            path: "",
            meta: { title: "Closing Request List" },
            component: () => import("@/manager-bc/pages/closing-request/List.vue"),
          },
        ],
      },
      {
        path: "recycle-request/",
        children: [
          {
            path: "",
            meta: { title: "Recycle Request Detail" },
            component: () => import("@/manager-bc/pages/recycle-request/List.vue"),
          },
        ],
      },
    ],
  },
  // {
  //   path: "manager-dashboard",
  //   name: "manager-dashboard",
  //   component: () => import("@/manager-bc/pages/ManagerDashboard.vue"),
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
  // {
  //   path: "manager-closing-request/",
  //   children: [
  //     {
  //       path: "",
  //       name: "manager-closing-request-list",
  //       component: () => import("@/manager-bc/pages/closing-request/List.vue"),
  //     },
  //   ],
  // },
  // {
  //   path: "manager-recycle-request/",
  //   children: [
  //     {
  //       path: "",
  //       name: "manager-recycle-request-list",
  //       component: () => import("@/manager-bc/pages/recycle-request/List.vue"),
  //     },
  //   ],
  // },
];

export default managerRoutes;
