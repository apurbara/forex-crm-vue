import HomeInterface from "./layout/home-interface";
import MenuItemInterface from "./layout/menu-item-interface";

export default interface LayoutInterface {
  home: HomeInterface;
  appBarMenuItems?: MenuItemInterface[];
  navBarMenuItems?: MenuItemInterface[] | undefined;
}
