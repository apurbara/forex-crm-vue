import UserRepository from "@/domain/user-repository";
import { UserRoleInterface } from "@/domain/user-role/role-interfaces";
import { inject } from "vue";

const managerRoutes = [
  {
    path: "manager-dashboard",
    name: "manager-dashboard",
    component: () => import("@/pages/manager-role/ManagerDashboard.vue"),
    // component: () => import('@/resources/components/BlankComponent.vue'),
    beforeEnter: () => {
      inject<UserRepository>("userRepository")
        ?.getUser<UserRoleInterface>()
        .canAccess("manager-dashboard");
    },
  },
  {
    path: "manager-customer-assignment/",
    beforeEnter: () => {
      inject<UserRepository>("userRepository")
        ?.getUser<UserRoleInterface>()
        .canAccess("manager-customer-assignment");
    },
    children: [
      {
        path: "",
        name: "manager-customer-assignment-list",
        component: () => import("@/pages/manager-role/customer-assignment/List.vue"),
      },
      {
        path: "distribute",
        name: "distribute-customer-assignment",
        component: () => import("@/pages/manager-role/customer-assignment/Distribute.vue"),
      },
    ],
  },
  // {
  //   path: "sales/",
  //   // component: () => import('@/resources/components/BlankComponent.vue'),
  //   beforeEnter: () => {
  //     inject<UserRepository>("userRepository")
  //       ?.getUser<UserRoleInterface>()
  //       .canAccess("sales");
  //   },
  //   children: [
  //     {
  //       path: "",
  //       name: "sales-list",
  //       component: () => import("@/pages/manager-role/sales/List.vue"),
  //     },
  //     {
  //       path: ":salesId",
  //       name: "sales-detail",
  //       props: true,
  //       component: () => import("@/pages/manager-role/sales/Detail.vue"),
  //     },
  //   ],
  // },
];

export default managerRoutes;
