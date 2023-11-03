import UserRepository from "@/domain/user-repository";
import { UserRoleInterface } from "@/domain/user-role/role-interfaces";
import { inject } from "vue";

const salesRoutes = [
  {
    path: "sales-dashboard",
    name: "sales-dashboard",
    component: () => import("@/pages/SalesDashboard.vue"),
    // component: () => import('@/resources/components/BlankComponent.vue'),
    beforeEnter: () => {
      inject<UserRepository>("userRepository")
        ?.getUser<UserRoleInterface>()
        .canAccess("sales-dashboard");
    },
  },
  {
    path: "schedule/",
    // component: () => import('@/resources/components/BlankComponent.vue'),
    beforeEnter: () => {
      inject<UserRepository>("userRepository")
        ?.getUser<UserRoleInterface>()
        .canAccess("schedule");
    },
    children: [
      {
        path: "",
        name: "schedule-list",
        component: () => import("@/pages/sales-role/schedule/List.vue"),
      },
      {
        path: "add",
        name: "add-schedule",
        component: () => import("@/pages/sales-role/schedule/Register.vue"),
      },
      {
        path: ":scheduleId",
        name: "schedule-detail",
        props: true,
        component: () => import("@/pages/sales-role/schedule/Detail.vue"),
      },
    ],
  },
  {
    path: "assigned-customer/",
    // component: () => import('@/resources/components/BlankComponent.vue'),
    beforeEnter: () => {
      inject<UserRepository>("userRepository")
        ?.getUser<UserRoleInterface>()
        .canAccess("assigned-customer");
    },
    children: [
      {
        path: "",
        name: "assigned-customer-list",
        component: () => import("@/pages/sales-role/assigned-customer/List.vue"),
      },
      {
        path: "register",
        name: "register-new-customer",
        component: () => import("@/pages/sales-role/assigned-customer/Register.vue"),
      },
      {
        path: ":assignedCustomerId",
        name: "assigned-customer-detail",
        props: true,
        component: () => import("@/pages/sales-role/assigned-customer/Detail.vue"),
      },
    ],
  },
];

export default salesRoutes;
