import router from "@/router";
import Admin from "./user-role/admin";
import Guest from "./user-role/guest";
import LayoutInterface from "@/resources/components/layout-interface";
import UserRoleInterface from "./user-role-interface";
import UserRoleDataInterface from "./user-role/user-role-data-interface";
import Manager from "./user-role/manager";
import Sales from "./user-role/sales";

export default class UserRepository {
  protected user: any;

  getUser<UserRoleType extends UserRoleInterface>(): UserRoleType {
    return this.user;
  }

  getUserLayout(): LayoutInterface {
    return this.user.getLayout(this);
  }

  getUserToken(): string | undefined {
    return this.user.getToken();
  }

  isUserAuthenticated(): boolean {
    return this.user.isAuthenticated();
  }

  isUserCanAccess(menu: string): boolean {
    return this.user.canAccess(menu);
  }

  constructor() {
    const userParameters = localStorage.getItem("user");
    if (userParameters) {
      const userData: UserRoleDataInterface = JSON.parse(userParameters);
      switch (userData.type) {
        case Admin.getRoleType():
          this.user = new Admin(userData);
          break;
        case Manager.getRoleType():
          this.user = new Manager(userData);
          break;
        case Sales.getRoleType():
          this.user = new Sales(userData);
          break;
        default:
          this.user = new Guest();
          break;
      }
    } else {
      this.user = new Guest();
    }
  }

  logUserIn(user: UserRoleInterface): void {
    this.user = user;
    localStorage.setItem("user", JSON.stringify(this.user));
    router.push(user.getLandingPage());
  }

  logout(): void {
    this.user = new Guest();
    localStorage.clear();
    router.push("/home");
  }
}
