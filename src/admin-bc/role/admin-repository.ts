import router from "@/router";
import AdminRole, { AdminRoleType } from "./admin-role";
import RegularException from "@/resources/exception/regular-exception";
import HttpRequestInterface from "@/infrastructure/http-request-interface";
import RestRequestInterface from "@/infrastructure/rest-request-interface";

export default class AdminRepository {
  protected user?: AdminRole;
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
      const adminData: AdminRoleType = JSON.parse(userParameters);
      if (adminData.type === AdminRole.type) {
        this.logUserIn(adminData);
      }
    }
  }
  //
  getUser(): AdminRole {
    if (!this.user) {
      throw RegularException.unauthorized(
        "you must login to access this resources"
      );
    }
    return this.user;
  }

  //
  logUserIn(adminData: AdminRoleType): void {
    this.user = new AdminRole(adminData, this.httpRequest, this.restRequest);
  }

  logUserOut(): void {
    this.user = undefined;
  }
}
