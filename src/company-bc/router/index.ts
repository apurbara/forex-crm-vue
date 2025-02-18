import { inject } from "vue";
import CompanyUserRepository from "../role/company-user-repository";

const companyRoutes = [
  {
    path: "company/",
    component: () => import("@/company-bc/components/CompanyLayoutComponent.vue"),
    children: [
      {
        path: "province/",
        beforeEnter: () => {
          inject<CompanyUserRepository>("companyUserRepository")
            ?.getUser()
            ?.canAccessCompanyMenu("province");
        },
        children: [
          {
            path: "",
            meta: { title: "Province List" },
            component: () => import("@/company-bc/pages/province/List.vue"),
          },
          {
            path: "add",
            meta: { title: "Add Province" },
            component: () => import("@/company-bc/pages/province/Add.vue"),
          },
        ],
      },
      {
        path: "city/",
        beforeEnter: () => {
          inject<CompanyUserRepository>("companyUserRepository")
            ?.getUser()
            ?.canAccessCompanyMenu("city");
        },
        children: [
          {
            path: "",
            meta: { title: "City List" },
            component: () => import("@/company-bc/pages/city/List.vue"),
          },
          {
            path: "add",
            meta: { title: "Add City" },
            component: () => import("@/company-bc/pages/city/Add.vue"),
          },
          {
            path: ":cityId",
            meta: { title: "City Detail" },
            props: true,
            component: () => import("@/company-bc/pages/city/Detail.vue"),
          },
        ],
      },
      {
        path: "common-sales-metric/",
        beforeEnter: () => {
          inject<CompanyUserRepository>("companyUserRepository")
            ?.getUser()
            ?.canAccessCompanyMenu("common-sales-metric");
        },
        children: [
          {
            path: "",
            name: "common-sales-metric-list",
            component: () => import("@/company-bc/pages/common-sales-metric/List.vue"),
          },
          {
            path: "add",
            name: "add-common-sales-metric",
            component: () => import("@/company-bc/pages/common-sales-metric/Add.vue"),
          },
          {
            path: ":commonSalesMetricId",
            name: "common-sales-metric-detail",
            props: true,
            component: () => import("@/company-bc/pages/common-sales-metric/Detail.vue"),
          },
        ],
      },
      {
        path: "company-metric/",
        beforeEnter: () => {
          inject<CompanyUserRepository>("companyUserRepository")
            ?.getUser()
            ?.canAccessCompanyMenu("company-metric");
        },
        children: [
          {
            path: "",
            name: "company-metric-list",
            component: () => import("@/company-bc/pages/company-metric/List.vue"),
          },
          {
            path: "add",
            name: "add-company-metric",
            component: () => import("@/company-bc/pages/company-metric/Add.vue"),
          },
          {
            path: ":companyMetricId",
            name: "company-metric-detail",
            props: true,
            component: () => import("@/company-bc/pages/company-metric/Detail.vue"),
          },
        ],
      },
      {
        path: "sales-rank/",
        beforeEnter: () => {
          inject<CompanyUserRepository>("companyUserRepository")
            ?.getUser()
            ?.canAccessCompanyMenu("sales-rank");
        },
        children: [
          {
            path: "",
            name: "sales-rank-list",
            component: () => import("@/company-bc/pages/sales-rank/List.vue"),
          },
          {
            path: "add",
            name: "add-sales-rank",
            component: () => import("@/company-bc/pages/sales-rank/Add.vue"),
          },
          {
            path: ":salesRankId",
            name: "sales-rank-detail",
            props: true,
            component: () => import("@/company-bc/pages/sales-rank/Detail.vue"),
          },
        ],
      },
      {
        path: "sales-performance-metric/",
        beforeEnter: () => {
          inject<CompanyUserRepository>("companyUserRepository")
            ?.getUser()
            ?.canAccessCompanyMenu("sales-performance-metric");
        },
        children: [
          {
            path: "",
            name: "sales-performance-metric-list",
            component: () => import("@/company-bc/pages/sales-performance-metric/List.vue"),
          },
          {
            path: "add",
            name: "add-sales-performance-metric",
            component: () => import("@/company-bc/pages/sales-performance-metric/Add.vue"),
          },
          {
            path: ":salesPerformanceMetricId",
            name: "sales-performance-metric-detail",
            props: true,
            component: () => import("@/company-bc/pages/sales-performance-metric/Detail.vue"),
          },
        ],
      },
      {
        path: "customer-journey/",
        beforeEnter: () => {
          inject<CompanyUserRepository>("companyUserRepository")
            ?.getUser()
            ?.canAccessCompanyMenu("customer-journey");
        },
        children: [
          {
            path: "",
            name: "customer-journey-list",
            component: () => import("@/company-bc/pages/customer-journey/List.vue"),
          },
          {
            path: "add",
            name: "add-customer-journey",
            component: () => import("@/company-bc/pages/customer-journey/Add.vue"),
          },
          {
            path: "set-initial",
            name: "set-initial-customer-journey",
            component: () => import("@/company-bc/pages/customer-journey/SetInitial.vue"),
          },
          {
            path: ":customerJourneyId",
            name: "customer-journey-detail",
            props: true,
            component: () => import("@/company-bc/pages/customer-journey/Detail.vue"),
          },
        ],
      },
      {
        path: "sales-activity/",
        beforeEnter: () => {
          inject<CompanyUserRepository>("companyUserRepository")
            ?.getUser()
            ?.canAccessCompanyMenu("sales-activity");
        },
        children: [
          {
            path: "",
            name: "sales-activity-list",
            component: () => import("@/company-bc/pages/sales-activity/List.vue"),
          },
          {
            path: "add",
            name: "add-sales-activity",
            component: () => import("@/company-bc/pages/sales-activity/Add.vue"),
          },
          {
            path: "set-initial",
            name: "set-initial-sales-activity",
            component: () => import("@/company-bc/pages/sales-activity/SetInitial.vue"),
          },
          {
            path: ":salesActivityId",
            name: "sales-activity-detail",
            props: true,
            component: () => import("@/company-bc/pages/sales-activity/Detail.vue"),
          },
        ],
      },
      {
        path: "customer-verification/",
        beforeEnter: () => {
          inject<CompanyUserRepository>("companyUserRepository")
            ?.getUser()
            ?.canAccessCompanyMenu("customer-verification");
        },
        children: [
          {
            path: "",
            name: "customer-verification-list",
            component: () => import("@/company-bc/pages/customer-verification/List.vue"),
          },
          {
            path: "add",
            name: "add-customer-verification",
            component: () => import("@/company-bc/pages/customer-verification/Add.vue"),
          },
          {
            path: ":customerVerificationId",
            name: "customer-verification-detail",
            props: true,
            component: () => import("@/company-bc/pages/customer-verification/Detail.vue"),
          },
        ],
      },
      {
        path: "manager/",
        beforeEnter: () => {
          inject<CompanyUserRepository>("companyUserRepository")
            ?.getUser()
            ?.canAccessCompanyMenu("manager");
        },
        children: [
          {
            path: "",
            name: "manager-list",
            component: () => import("@/company-bc/pages/manager/List.vue"),
          },
          {
            path: "add",
            name: "add-manager",
            component: () => import("@/company-bc/pages/manager/Add.vue"),
          },
          {
            path: ":managerId",
            name: "manager-detail",
            props: true,
            component: () => import("@/company-bc/pages/manager/Detail.vue"),
          },
        ],
      },
      {
        path: "sales/",
        beforeEnter: () => {
          inject<CompanyUserRepository>("companyUserRepository")
            ?.getUser()
            ?.canAccessCompanyMenu("sales");
        },
        children: [
          {
            path: "",
            name: "sales-list",
            component: () => import("@/company-bc/pages/sales/List.vue"),
          },
          {
            path: "add",
            name: "add-sales",
            component: () => import("@/company-bc/pages/sales/Add.vue"),
          },
          {
            path: ":salesId",
            name: "sales-detail",
            props: true,
            component: () => import("@/company-bc/pages/sales/Detail.vue"),
          },
        ],
      },
      {
        path: "customer/",
        beforeEnter: () => {
          inject<CompanyUserRepository>("companyUserRepository")
            ?.getUser()
            ?.canAccessCompanyMenu("customer");
        },
        children: [
          {
            path: "",
            name: "customer-list",
            component: () => import("@/company-bc/pages/customer/List.vue"),
          },
        ],
      },
      {
        path: "customer-assignment/",
        beforeEnter: () => {
          inject<CompanyUserRepository>("companyUserRepository")
            ?.getUser()
            ?.canAccessCompanyMenu("customer-assignment");
        },
        children: [
          {
            path: "",
            name: "customer-assignment-list",
            component: () => import("@/company-bc/pages/customer-assignment/List.vue"),
          },
          {
            path: "distribute",
            name: "distribute-customer-assignment",
            component: () => import("@/company-bc/pages/customer-assignment/Distribute.vue"),
          },
          // {
          //   path: ":customerAssignmentId",
          //   name: "customer-assignment-detail",
          //   props: true,
          //   component: () => import("@/company-bc/pages/customer-assignment/Detail.vue"),
          // },
        ],
      },
    ],
  },
  // {
  //   path: "province/",
  //   beforeEnter: () => {
  //     inject<CompanyUserRepository>("companyUserRepository")
  //       ?.getUser()
  //       ?.canAccessCompanyMenu("province");
  //   },
  //   children: [
  //     {
  //       path: "",
  //       name: "province-list",
  //       component: () => import("@/company-bc/pages/province/List.vue"),
  //     },
  //     {
  //       path: "add",
  //       name: "add-province",
  //       component: () => import("@/company-bc/pages/province/Add.vue"),
  //     },
  //   ],
  // },
  // {
  //   path: "city/",
  //   beforeEnter: () => {
  //     inject<CompanyUserRepository>("companyUserRepository")
  //       ?.getUser()
  //       ?.canAccessCompanyMenu("city");
  //   },
  //   children: [
  //     {
  //       path: "",
  //       name: "city-list",
  //       component: () => import("@/company-bc/pages/city/List.vue"),
  //     },
  //     {
  //       path: "add",
  //       name: "add-city",
  //       component: () => import("@/company-bc/pages/city/Add.vue"),
  //     },
  //     {
  //       path: ":cityId",
  //       name: "city-detail",
  //       props: true,
  //       component: () => import("@/company-bc/pages/city/Detail.vue"),
  //     },
  //   ],
  // },
  // {
  //   path: "common-sales-metric/",
  //   beforeEnter: () => {
  //     inject<CompanyUserRepository>("companyUserRepository")
  //       ?.getUser()
  //       ?.canAccessCompanyMenu("common-sales-metric");
  //   },
  //   children: [
  //     {
  //       path: "",
  //       name: "common-sales-metric-list",
  //       component: () => import("@/company-bc/pages/common-sales-metric/List.vue"),
  //     },
  //     {
  //       path: "add",
  //       name: "add-common-sales-metric",
  //       component: () => import("@/company-bc/pages/common-sales-metric/Add.vue"),
  //     },
  //     {
  //       path: ":commonSalesMetricId",
  //       name: "common-sales-metric-detail",
  //       props: true,
  //       component: () => import("@/company-bc/pages/common-sales-metric/Detail.vue"),
  //     },
  //   ],
  // },
  // {
  //   path: "company-metric/",
  //   beforeEnter: () => {
  //     inject<CompanyUserRepository>("companyUserRepository")
  //       ?.getUser()
  //       ?.canAccessCompanyMenu("company-metric");
  //   },
  //   children: [
  //     {
  //       path: "",
  //       name: "company-metric-list",
  //       component: () => import("@/company-bc/pages/company-metric/List.vue"),
  //     },
  //     {
  //       path: "add",
  //       name: "add-company-metric",
  //       component: () => import("@/company-bc/pages/company-metric/Add.vue"),
  //     },
  //     {
  //       path: ":companyMetricId",
  //       name: "company-metric-detail",
  //       props: true,
  //       component: () => import("@/company-bc/pages/company-metric/Detail.vue"),
  //     },
  //   ],
  // },
  // {
  //   path: "sales-rank/",
  //   beforeEnter: () => {
  //     inject<CompanyUserRepository>("companyUserRepository")
  //       ?.getUser()
  //       ?.canAccessCompanyMenu("sales-rank");
  //   },
  //   children: [
  //     {
  //       path: "",
  //       name: "sales-rank-list",
  //       component: () => import("@/company-bc/pages/sales-rank/List.vue"),
  //     },
  //     {
  //       path: "add",
  //       name: "add-sales-rank",
  //       component: () => import("@/company-bc/pages/sales-rank/Add.vue"),
  //     },
  //     {
  //       path: ":salesRankId",
  //       name: "sales-rank-detail",
  //       props: true,
  //       component: () => import("@/company-bc/pages/sales-rank/Detail.vue"),
  //     },
  //   ],
  // },
  // {
  //   path: "sales-performance-metric/",
  //   beforeEnter: () => {
  //     inject<CompanyUserRepository>("companyUserRepository")
  //       ?.getUser()
  //       ?.canAccessCompanyMenu("sales-performance-metric");
  //   },
  //   children: [
  //     {
  //       path: "",
  //       name: "sales-performance-metric-list",
  //       component: () => import("@/company-bc/pages/sales-performance-metric/List.vue"),
  //     },
  //     {
  //       path: "add",
  //       name: "add-sales-performance-metric",
  //       component: () => import("@/company-bc/pages/sales-performance-metric/Add.vue"),
  //     },
  //     {
  //       path: ":salesPerformanceMetricId",
  //       name: "sales-performance-metric-detail",
  //       props: true,
  //       component: () => import("@/company-bc/pages/sales-performance-metric/Detail.vue"),
  //     },
  //   ],
  // },
  // {
  //   path: "customer-journey/",
  //   beforeEnter: () => {
  //     inject<CompanyUserRepository>("companyUserRepository")
  //       ?.getUser()
  //       ?.canAccessCompanyMenu("customer-journey");
  //   },
  //   children: [
  //     {
  //       path: "",
  //       name: "customer-journey-list",
  //       component: () => import("@/company-bc/pages/customer-journey/List.vue"),
  //     },
  //     {
  //       path: "add",
  //       name: "add-customer-journey",
  //       component: () => import("@/company-bc/pages/customer-journey/Add.vue"),
  //     },
  //     {
  //       path: "set-initial",
  //       name: "set-initial-customer-journey",
  //       component: () => import("@/company-bc/pages/customer-journey/SetInitial.vue"),
  //     },
  //     {
  //       path: ":customerJourneyId",
  //       name: "customer-journey-detail",
  //       props: true,
  //       component: () => import("@/company-bc/pages/customer-journey/Detail.vue"),
  //     },
  //   ],
  // },
  // {
  //   path: "sales-activity/",
  //   beforeEnter: () => {
  //     inject<CompanyUserRepository>("companyUserRepository")
  //       ?.getUser()
  //       ?.canAccessCompanyMenu("sales-activity");
  //   },
  //   children: [
  //     {
  //       path: "",
  //       name: "sales-activity-list",
  //       component: () => import("@/company-bc/pages/sales-activity/List.vue"),
  //     },
  //     {
  //       path: "add",
  //       name: "add-sales-activity",
  //       component: () => import("@/company-bc/pages/sales-activity/Add.vue"),
  //     },
  //     {
  //       path: "set-initial",
  //       name: "set-initial-sales-activity",
  //       component: () => import("@/company-bc/pages/sales-activity/SetInitial.vue"),
  //     },
  //     {
  //       path: ":salesActivityId",
  //       name: "sales-activity-detail",
  //       props: true,
  //       component: () => import("@/company-bc/pages/sales-activity/Detail.vue"),
  //     },
  //   ],
  // },
  // {
  //   path: "customer-verification/",
  //   beforeEnter: () => {
  //     inject<CompanyUserRepository>("companyUserRepository")
  //       ?.getUser()
  //       ?.canAccessCompanyMenu("customer-verification");
  //   },
  //   children: [
  //     {
  //       path: "",
  //       name: "customer-verification-list",
  //       component: () => import("@/company-bc/pages/customer-verification/List.vue"),
  //     },
  //     {
  //       path: "add",
  //       name: "add-customer-verification",
  //       component: () => import("@/company-bc/pages/customer-verification/Add.vue"),
  //     },
  //     {
  //       path: ":customerVerificationId",
  //       name: "customer-verification-detail",
  //       props: true,
  //       component: () => import("@/company-bc/pages/customer-verification/Detail.vue"),
  //     },
  //   ],
  // },
  // {
  //   path: "manager/",
  //   beforeEnter: () => {
  //     inject<CompanyUserRepository>("companyUserRepository")
  //       ?.getUser()
  //       ?.canAccessCompanyMenu("manager");
  //   },
  //   children: [
  //     {
  //       path: "",
  //       name: "manager-list",
  //       component: () => import("@/company-bc/pages/manager/List.vue"),
  //     },
  //     {
  //       path: "add",
  //       name: "add-manager",
  //       component: () => import("@/company-bc/pages/manager/Add.vue"),
  //     },
  //     {
  //       path: ":managerId",
  //       name: "manager-detail",
  //       props: true,
  //       component: () => import("@/company-bc/pages/manager/Detail.vue"),
  //     },
  //   ],
  // },
  // {
  //   path: "sales/",
  //   beforeEnter: () => {
  //     inject<CompanyUserRepository>("companyUserRepository")
  //       ?.getUser()
  //       ?.canAccessCompanyMenu("sales");
  //   },
  //   children: [
  //     {
  //       path: "",
  //       name: "sales-list",
  //       component: () => import("@/company-bc/pages/sales/List.vue"),
  //     },
  //     {
  //       path: "add",
  //       name: "add-sales",
  //       component: () => import("@/company-bc/pages/sales/Add.vue"),
  //     },
  //     {
  //       path: ":salesId",
  //       name: "sales-detail",
  //       props: true,
  //       component: () => import("@/company-bc/pages/sales/Detail.vue"),
  //     },
  //   ],
  // },
  // {
  //   path: "customer/",
  //   beforeEnter: () => {
  //     inject<CompanyUserRepository>("companyUserRepository")
  //       ?.getUser()
  //       ?.canAccessCompanyMenu("customer");
  //   },
  //   children: [
  //     {
  //       path: "",
  //       name: "customer-list",
  //       component: () => import("@/company-bc/pages/customer/List.vue"),
  //     },
  //   ],
  // },
  // {
  //   path: "customer-assignment/",
  //   beforeEnter: () => {
  //     inject<CompanyUserRepository>("companyUserRepository")
  //       ?.getUser()
  //       ?.canAccessCompanyMenu("customer-assignment");
  //   },
  //   children: [
  //     {
  //       path: "",
  //       name: "customer-assignment-list",
  //       component: () => import("@/company-bc/pages/customer-assignment/List.vue"),
  //     },
  //     {
  //       path: "distribute",
  //       name: "distribute-customer-assignment",
  //       component: () => import("@/company-bc/pages/customer-assignment/Distribute.vue"),
  //     },
  //   ],
  // },
];

export default companyRoutes;
