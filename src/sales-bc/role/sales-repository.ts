import router from "@/router";
import SalesRole, { SalesRoleType } from "./sales-role";
import RegularException from "@/resources/exception/regular-exception";
import HttpRequestInterface from "@/infrastructure/http-request-interface";
import RestRequestInterface from "@/infrastructure/rest-request-interface";

export default class SalesRepository {
  protected user?: SalesRole;
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
      const salesData: SalesRoleType = JSON.parse(userParameters);
      if (salesData.type === SalesRole.type) {
        this.logUserIn(salesData);
      }
    }
  }
  //
  getUser(): SalesRole {
    if (!this.user) {
      throw RegularException.unauthorized(
        "you must login to access this resources"
      );
    }
    return this.user;
  }

  //
  logUserIn(salesData: SalesRoleType): void {
    this.user = new SalesRole(salesData, this.httpRequest, this.restRequest);
  }

  logUserOut(): void {
    this.user = undefined;
  }
}
