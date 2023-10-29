export default interface MenuItemInterface {
  title?: string;
  to?: string;
  icon?: string;
  callableAction?: CallableFunction;
  children?: Array<MenuItemInterface | "divider">;
}

