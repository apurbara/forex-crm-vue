import UserRepository from "@/domain/user-repository";
import { inject } from "vue";

const innovRoutes = [
  {
    path: "admin/",
    // component: () => import('@/resources/components/BlankComponent.vue'),
    beforeEnter: () => {
      inject<UserRepository>("userRepository")
        ?.getUser()
        .canAccess("admin");
    },
    children: [
      {
        path: "",
        name: "admin-list",
        component: () => import("@/pages/admin/List.vue"),
      },
    ],
  },
  {
    path: "firm/",
    beforeEnter: () => {
      inject<UserRepository>("userRepository")
        ?.getUser()
        .canAccess("firm");
    },
    children: [
      {
        path: "",
        name: "firm-list",
        component: () => import("@/pages/firm/List.vue"),
      },
    ],
  },
];

export default innovRoutes;
