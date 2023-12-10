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
