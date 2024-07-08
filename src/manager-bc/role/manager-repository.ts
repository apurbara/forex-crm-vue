import router from "@/router";
import ManagerRole, { ManagerRoleType } from "./manager-role";
import RegularException from "@/resources/exception/regular-exception";
import HttpRequestInterface from "@/infrastructure/http-request-interface";
import RestRequestInterface from "@/infrastructure/rest-request-interface";

export default class ManagerRepository {
  protected user?: ManagerRole;
  protected httpRequest: HttpRequestInterface;
  protected restRequest: RestRequestInterface;

  constructor(
    httpRequest: HttpRequestInterface,
    restRequest: RestRequestInterface
  ) {
    this.httpRequest = httpRequest;
    this.restRequest = restRequest;
    const userParameters = localStorage.getItem("user");
    if (userParameters) {
      const managerData: ManagerRoleType = JSON.parse(userParameters);
      if (managerData.type === ManagerRole.type) {
        this.logUserIn(managerData);
      }
    }
  }
  //
  getUser(): ManagerRole {
    if (!this.user) {
      throw RegularException.unauthorized(
        "you must login to access this resources"
      );
    }
    return this.user;
  }

  //
  logUserIn(managerData: ManagerRoleType): void {
    this.user = new ManagerRole(
      managerData,
      this.httpRequest,
      this.restRequest
    );
    localStorage.setItem("user", JSON.stringify(managerData));
    router.push(this.user.getLandingPage());
  }

  logUserOut(): void {
    this.user = undefined;
  }
}
