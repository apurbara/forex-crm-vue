import CompanyUserRepository from "@/company-bc/role/company-user-repository";
import HomeInterface from "@/resources/components/layout/home-interface";
import MenuItemInterface from "@/resources/components/layout/menu-item-interface";
import { useStringLimiter } from "@/resources/composables/typography";
// import { useDependencyInjection } from "../composables/dependency-injection";
import { inject } from "vue";
import AdminRepository from "@/admin-bc/role/admin-repository";
import ManagerRepository from "@/manager-bc/role/manager-repository";
import SalesRepository from "@/sales-bc/role/sales-repository";

export const baseHome: HomeInterface = {
  title: "pintar-forex",
  to: "/",
};

// const {
//   companyUserRepository,
//   adminRepository,
//   managerRepository,
//   salesRepository,
// } = useDependencyInjection();

export const generateBaseAppBarMenuItems = (
  // companyUserRepository: CompanyUserRepository,
  name: string | undefined = "",
): MenuItemInterface[] => [
  {
    icon: "mdi-account-circle-outline",
    title: useStringLimiter(name, 10),
  },
  // {
  //   icon: "mdi-logout",
  //   callableAction: logoutFunction,
  //   // callableAction: () => {
  //   //   inject<CompanyUserRepository>("companyUserRepository")!.logUserOut();
  //   //   inject<AdminRepository>("adminRepository")!.logUserOut();
  //   //   inject<ManagerRepository>("managerRepository")!.logUserOut();
  //   //   inject<SalesRepository>("salesRepository")!.logUserOut();
  //   //   // companyUserRepository.logUserOut();
  //   //   // adminRepository.logUserOut();
  //   //   // managerRepository.logUserOut();
  //   //   // salesRepository.logUserOut();
  //   //   // companyUserRepository.logUserOut();
  //   // },
  // },
];
