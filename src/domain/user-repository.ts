import router from "@/router";
import Admin from "./user-role/admin";
import Guest from "./user-role/guest";
import {
  UserRoleDataType,
  UserRoleInterface,
} from "./user-role/role-interfaces";
import Personnel from "./user-role/personnel";

export default class UserRepository {
  protected user: any;

  getUser<RoleType>(): RoleType {
    return this.user;
  }

  constructor() {
    const userParameters = localStorage.getItem("user");
    if (userParameters) {
      const userData: UserRoleDataType = JSON.parse(userParameters);
      switch (userData.type) {
        case Admin.getRoleType():
          this.user = new Admin(userData);
          break;
        case Personnel.getRoleType():
          this.user = new Personnel(userData);
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
    router.push("/dashboard");
  }

  logout(): void {
    this.user = new Guest();
    localStorage.clear();
    router.push("/home");
  }
}
