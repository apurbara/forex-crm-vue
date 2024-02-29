import UserRepository from "@/domain/user-repository";
import { UserRoleInterface } from "@/domain/user-role/role-interfaces";
import { inject } from "vue";

const companyRoutes = [
  {
    path: "personnel/",
    // component: () => import('@/resources/components/BlankComponent.vue'),
    beforeEnter: () => {
      inject<UserRepository>("userRepository")
        ?.getUser<UserRoleInterface>()
        .canAccess("personnel");
    },
    children: [
      {
        path: "",
        name: "personnel-list",
        component: () => import("@/pages/personnel/List.vue"),
      },
      {
        path: "add",
        name: "add-personnel",
        component: () => import("@/pages/personnel/Add.vue"),
      },
      {
        path: ":personnelId",
        name: "personnel-detail",
        props: true,
        component: () => import("@/pages/personnel/Detail.vue"),
      },
      {
        path: ":personnelId/assign-as-sales",
        name: "assign-personnel-as-sales",
        props: true,
        component: () => import("@/pages/personnel/AssignAsSales.vue"),
      },
    ],
  },
  {
    path: "area-structure/",
    // component: () => import('@/resources/components/BlankComponent.vue'),
    beforeEnter: () => {
      inject<UserRepository>("userRepository")
        ?.getUser<UserRoleInterface>()
        .canAccess("area-structure");
    },
    children: [
      {
        path: "",
        name: "area-structure-list",
        component: () => import("@/pages/area-structure/List.vue"),
      },
      {
        path: "add-root",
        name: "add-root-area-structure",
        component: () => import("@/pages/area-structure/AddRoot.vue"),
      },
      {
        path: ":areaStructureId/add-branch",
        name: "add-branch-area-structure",
        props: true,
        component: () => import("@/pages/area-structure/AddBranch.vue"),
      },
      {
        path: ":areaStructureId",
        name: "area-structure-detail",
        props: true,
        component: () => import("@/pages/area-structure/Detail.vue"),
      },
    ],
  },
  {
    path: "area/",
    // component: () => import('@/resources/components/BlankComponent.vue'),
    beforeEnter: () => {
      inject<UserRepository>("userRepository")
        ?.getUser<UserRoleInterface>()
        .canAccess("area");
    },
    children: [
      {
        path: "",
        name: "area-list",
        component: () => import("@/pages/area/List.vue"),
      },
      {
        path: "add-root/:areaStructureId",
        name: "add-root-area",
        props: true,
        component: () => import("@/pages/area/AddRoot.vue"),
      },
      {
        path: ":areaId/add-branch",
        name: "add-branch-area",
        props: true,
        component: () => import("@/pages/area/AddBranch.vue"),
      },
      {
        path: ":areaId",
        name: "area-detail",
        props: true,
        component: () => import("@/pages/area/Detail.vue"),
      },
    ],
  },
  {
    path: "customer-verification/",
    // component: () => import('@/resources/components/BlankComponent.vue'),
    beforeEnter: () => {
      inject<UserRepository>("userRepository")
        ?.getUser<UserRoleInterface>()
        .canAccess("customer-verification");
    },
    children: [
      {
        path: "",
        name: "customer-verification-list",
        component: () => import("@/pages/customer-verification/List.vue"),
      },
      {
        path: "add",
        name: "add-customer-verification",
        component: () => import("@/pages/customer-verification/Add.vue"),
      },
      {
        path: ":customerVerificationId",
        name: "customer-verification-detail",
        props: true,
        component: () => import("@/pages/customer-verification/Detail.vue"),
      },
    ],
  },
  {
    path: "sales-activity/",
    // component: () => import('@/resources/components/BlankComponent.vue'),
    beforeEnter: () => {
      inject<UserRepository>("userRepository")
        ?.getUser<UserRoleInterface>()
        .canAccess("sales-activity");
    },
    children: [
      {
        path: "",
        name: "sales-activity-list",
        component: () => import("@/pages/sales-activity/List.vue"),
      },
      {
        path: "set-initial",
        name: "set-initial-sales-activity",
        component: () => import("@/pages/sales-activity/SetInitial.vue"),
      },
      {
        path: "add",
        name: "add-sales-activity",
        component: () => import("@/pages/sales-activity/Add.vue"),
      },
      {
        path: ":salesActivityId",
        name: "sales-activity-detail",
        props: true,
        component: () => import("@/pages/sales-activity/Detail.vue"),
      },
    ],
  },
  {
    path: "customer-journey/",
    // component: () => import('@/resources/components/BlankComponent.vue'),
    beforeEnter: () => {
      inject<UserRepository>("userRepository")
        ?.getUser<UserRoleInterface>()
        .canAccess("customer-journey");
    },
    children: [
      {
        path: "",
        name: "customer-journey-list",
        component: () => import("@/pages/customer-journey/List.vue"),
      },
      {
        path: "set-initial",
        name: "set-initial-customer-journey",
        component: () => import("@/pages/customer-journey/SetInitial.vue"),
      },
      {
        path: "add",
        name: "add-customer-journey",
        component: () => import("@/pages/customer-journey/Add.vue"),
      },
      {
        path: ":customerJourneyId",
        name: "customer-journey-detail",
        props: true,
        component: () => import("@/pages/customer-journey/Detail.vue"),
      },
    ],
  },
  {
    path: "manager/",
    // component: () => import('@/resources/components/BlankComponent.vue'),
    beforeEnter: () => {
      inject<UserRepository>("userRepository")
        ?.getUser<UserRoleInterface>()
        .canAccess("manager");
    },
    children: [
      {
        path: "",
        name: "manager-list",
        component: () => import("@/pages/manager/List.vue"),
      },
      {
        path: ":managerId",
        name: "manager-detail",
        props: true,
        component: () => import("@/pages/manager/Detail.vue"),
      },
    ],
  },
  {
    path: "sales/",
    // component: () => import('@/resources/components/BlankComponent.vue'),
    beforeEnter: () => {
      inject<UserRepository>("userRepository")
        ?.getUser<UserRoleInterface>()
        .canAccess("sales");
    },
    children: [
      {
        path: "",
        name: "sales-list",
        component: () => import("@/pages/sales/List.vue"),
      },
      {
        path: ":salesId",
        name: "sales-detail",
        props: true,
        component: () => import("@/pages/sales/Detail.vue"),
      },
    ],
  },
  {
    path: "customer/",
    // component: () => import('@/resources/components/BlankComponent.vue'),
    beforeEnter: () => {
      inject<UserRepository>("userRepository")
        ?.getUser<UserRoleInterface>()
        .canAccess("customer");
    },
    children: [
      {
        path: "",
        name: "customer-list",
        component: () => import("@/pages/customer/List.vue"),
      },
    ],
  },
];

export default companyRoutes;
