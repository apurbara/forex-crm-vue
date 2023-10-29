import UserRepository from "@/domain/user-repository";
import HomeInterface from "@/resources/components/layout/home-interface";
import MenuItemInterface from "@/resources/components/layout/menu-item-interface";
import { useStringLimiter } from "@/resources/composables/typography";

export const baseHome: HomeInterface = {
  title: "forex",
  to: "/home",
};

export const generateBaseAppBarMenuItems = (
  userRepository: UserRepository,
  name: string | undefined = ""
): MenuItemInterface[] => [
  {
    icon: "mdi-account-circle-outline",
    title: useStringLimiter(name, 10),
  },
  {
    icon: "mdi-logout",
    callableAction: () => {
      userRepository.logout();
    },
  },
];
