import { PersonnelType } from "./model/personnel";
import router from "@/router";
import AdminRole, { AdminRoleType } from "./user-role/admin-role";
import Guest from "./user-role/guest";
import PersonnelRole, { PersonnelRoleType } from "./user-role/personnel-role";
import SalesRole, { SalesRoleType } from "./user-role/personnel/sales-role";

export type StoreableAuthInfo = {
  type: string;
};

export default class UserRepository {
  protected user: any;

  getUser<RoleType>(): RoleType {
    return this.user;
  }

  constructor() {
    const userParameters = localStorage.getItem("user");
    if (userParameters) {
      const userData: StoreableAuthInfo = JSON.parse(userParameters);
      switch (userData.type) {
        case AdminRole.getRoleType():
          this.user = new AdminRole(userData as AdminRoleType);
          break;
        case PersonnelRole.getRoleType():
          this.user = new PersonnelRole(userData as PersonnelRoleType);
          break;
        case SalesRole.getRoleType():
          const salesRoleData = userData as unknown as SalesRoleType;
          const personnel = new PersonnelRole(salesRoleData.personnelRole);
          const sales = personnel.authorizeAsSales(salesRoleData);
          this.user = sales;
          break;
        default:
          this.user = new Guest();
          break;
      }
    } else {
      this.user = new Guest();
    }
  }

  logUserIn(user: StoreableAuthInfo): void {
    this.user = user;
    localStorage.setItem("user", JSON.stringify(this.user));
    router.push("/");
  }

  logout(): void {
    this.user = new Guest();
    localStorage.clear();
    router.push("/home");
  }
}
