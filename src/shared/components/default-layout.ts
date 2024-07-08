import CompanyUserRepository from "@/company-bc/role/company-user-repository";
import HomeInterface from "@/resources/components/layout/home-interface";
import MenuItemInterface from "@/resources/components/layout/menu-item-interface";
import { useStringLimiter } from "@/resources/composables/typography";

export const baseHome: HomeInterface = {
  title: "pintar-forex",
  to: "/",
};

export const generateBaseAppBarMenuItems = (
  companyUserRepository: CompanyUserRepository,
  name: string | undefined = ""
): MenuItemInterface[] => [
  {
    icon: "mdi-account-circle-outline",
    title: useStringLimiter(name, 10),
  },
  {
    icon: "mdi-logout",
    callableAction: () => {
      companyUserRepository.logUserOut();
    },
  },
];
